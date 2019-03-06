// The unique domain within Auth0 for the tenant
var AUTH0_DOMAIN=auth0_config[window.location.hostname].tenant;
// The unique ID associated with the client app within Auth0
var AUTH0_CLIENT_ID=auth0_config[window.location.hostname].clientID;
// The URL to redirect to after authorization.  This URL must
// be one of the configured ones within the app's config in Auth0
var AUTH0_CALLBACK_URL=auth0_config[window.location.hostname].callbackURL;
// The URL of the service to be authenticted for.  Used to look
// up API in Auth0 and must match the URL for a configured API.
var AUTH0_AUDIENCE =auth0_config[window.location.hostname].resource;

// Token used to verify and identify the authenticated user.
var idToken;
// Token to be used for authenticating calls to API endpoints.
var accessToken;

var authErrorStatus = null;
var authErrorKey = "default";
var appAuth = false;

var authErrorConfig = {
	"login_required": {
		"message": "There was a problem logging you in: token is expired for currently cached user.<br>Click Close to log in again.",
		"action": function() {
			authenticationError.hide();
			webAuth.authorize();
		}
	},
	"Token Renewal Failed": {
		"message": "There was a problem logging you in: token renewal failed due to timeout.<br>Click Close to log in again.",
		"action": function() {
			authenticationError.hide();
			webAuth.authorize();
		}
	},
	"default":{
		"message": "There was a problem logging you in: unknown issue at this time.<br>Try again or contact support for assistance.",
		"action": function() {
			authenticationError.hide();
			logOut();
		}
	},
	"401": {
		"message": "401 Unauthorized: the current user does not have the necessary credentials.<br>Try again with a supported login.",
		"action": function() {
			authenticationError.hide();
			logOut();
		}
	},
	"403": {
		"message": "403 Forbidden: the current user does not have the necessary credentials.<br>Try again with a supported login.",
		"action": function() {
			authenticationError.hide();
			logOut();
		}
	},
	"503": {
		"message": "503 Authorization Service Unavailable: the server is currently unavailable.<br>Click Close and try again later.",
		"action": function() {
			authenticationError.hide();
			logOut();
		}
	}
}

var webAuth = new auth0.WebAuth({
	domain: AUTH0_DOMAIN,
	clientID: AUTH0_CLIENT_ID,
	redirectUri: AUTH0_CALLBACK_URL,
	audience: AUTH0_AUDIENCE,
	responseType: 'token id_token',
	scope: 'openid profile read:messages',
	leeway: 60
});

function checkAuth0() {
	if (window.location.hash.includes("access_token")) {
		webAuth.parseHash(function(err, authResult) {
			if (authResult && authResult.accessToken && authResult.idToken) {
				window.location.hash = '';
				window.history.pushState("", document.title, window.location.pathname);
				logIn(authResult);
			}
		})
	} else if (localStorage.getItem('isLoggedIn') === 'true') {
		renewToken();
	}
}

function renewToken() {
	webAuth.checkSession({}, (err, authResult) => {
		if (authResult && authResult.accessToken && authResult.idToken) {
			if (!appAuth) {
				logIn(authResult);
			} else {
				authToken = authResult.accessToken;
				idToken = authResult.idToken;
				expiresAt = Math.round(authResult.expiresIn * 1000 + new Date().getTime());
				localStorage.setItem('isLoggedIn', 'true');
				localStorage.setItem('expiresAt', expiresAt);
				sessionTimeoutWarning.hide();
			}
		} else if (err) {
			console.log('Could not get a new token '  + err.error + ' : ' + err.error_description + '.');
			authErrorKey = (!_.isUndefined(authErrorConfig[err.error])) ? err.error : "default";
			dojo.query(".authenticationErrorText")[0].innerHTML = authErrorConfig[authErrorKey].message;
			authenticationError.show();
		}
	});
}

function signInOnClick() {
    var loginStatus = dojo.attr('sign-in', 'data-viewer-login');
    if (loginStatus == "false"){
        webAuth.authorize();
    } else if (loginStatus == "true") {
        logOut();
    } 
}


function updateExpirationTime() {
    if (localStorage.getItem('isLoggedIn') === 'true' && appAuth) {
		var currentTime = Math.round(new Date().getTime()/1000);
		var tokenTime = Math.round(parseInt(localStorage.getItem('expiresAt'))/1000);
        tokenExpires = tokenTime - currentTime;
        dojo.byId("sessionTimeoutExpire").innerHTML = Math.floor(tokenExpires/60) + " min " + tokenExpires%60 + " secs";
			
		if (tokenExpires <= 300) {
			sessionTimeoutWarning.show()
		}
		
		if (tokenExpires <= 0) {
			logOut();
		}
    }
}

window.setInterval(updateExpirationTime, 1000);

function logIn(authResult) {
	accessToken = authResult.accessToken;
	idToken = authResult.idToken;
	expiresAt = Math.round(authResult.expiresIn * 1000 + new Date().getTime());
	
	localStorage.setItem('isLoggedIn', 'true');
	localStorage.setItem('expiresAt', expiresAt);
	
	authenticate();
}

function logOut() {
	localStorage.removeItem('isLoggedIn');
	localStorage.removeItem('expiresAt');
	accessToken = null;
	idToken = null;
	
	var logOutOptions = { "clientId": AUTH0_CLIENT_ID, "returnTo":AUTH0_CALLBACK_URL };
	webAuth.logout(logOutOptions);
	
	dojo.byId('sign-in').innerHTML = 'Sign In';
	dojo.attr('sign-in', 'data-viewer-login', 'false');
	
	dojo.byId('current-user').innerHTML = '';
	authUser = '';
	authUserId = '';
	authRole = '';
	
	authUserObject = {};
	authSites = [];
	authRoles = [];
	authUserOrg = [];
	authExtent = null;
	siteData = {};
	
	dojo.style('mapWindSite', 'display', 'none');
	dojo.style('bladeViewerButton', 'display', 'none');
	dojo.style('siteViewerButton', 'display', 'none');
	
	dojo.style('map-legend', 'visibility', 'hidden');
	
	dojo.query('[class*="toolTip"]').style("visibility", "hidden");
	dojo.attr("mapWindSite", "data-wind-selector-status", "closed");
	
	dojo.query("#lasViewerOuterContent iframe")[0].src = "";
	
	map.setExtent(initialExtent);
	
	var bladeViewerClose = dojo.fx.slideTo({
		node: 'bladeViewer',
		left: -1000,
		top: dojo.style("bladeViewer", "top"),
		beforeBegin:  function() {
			dojo.attr('bladeViewer','data-blade-viewer-status', 'closed');
		}
	});
	var siteViewerClose = dojo.fx.slideTo({
		node: 'siteViewer',
		left: -10000,
		top: dojo.style("siteViewer", "top"),
		beforeBegin:  function() {
			dojo.attr('siteViewer','data-las-viewer-status', 'closed');
		}
	});
	var lasViewerClose = dojo.fx.slideTo({
		node: 'lasViewer',
		left: -10000,
		top: dojo.style("lasViewer", "top"),
		beforeBegin:  function() {
			dojo.attr('lasViewer','data-las-viewer-status', 'closed');
		}
	});
	
	dojo.fx.combine([bladeViewerClose, siteViewerClose, lasViewerClose]).play();
	clearHighlightSymbol();
	resetBladeViewerPanel();
	resetSiteViewerPanel();
	removeMapLayers();
	
}

function authenticate() {
	dojo.xhrGet({
		url: serviceApiUrl + 'auth/credentials',
		handleAs: "json",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json; charset=utf-8",
			"Authorization": "Bearer " + accessToken
		},
		load: function(response) {
			loginSuccess(response);
		},
		error: function(error){
			console.log(error);
			loginError();
		}
	});
}

function loginSuccess(response) {
	appAuth = true;
	dojo.style("mapProgressBar", { "display":"block" });
	
	authUserObject = dojo.clone(response);

	dojo.style('loginError', 'display', 'none');
	dojo.style('loginDiv', 'height', '105px');

	dojo.byId('sign-in').innerHTML = 'Sign Out';
	dojo.attr('sign-in', 'data-viewer-login', 'true');

	dojo.byId('current-user').innerHTML = "Welcome " + authUserObject.firstName;
	authUser = authUserObject.firstName + " " +  authUserObject.lastName;
	authUserId = authUserObject.userId;
	authUserOrg = _.first(authUserObject.organizations);
	
	getOrgs(_.keys(authUserObject.sitesByOrganization));
	getTranslation(authUserOrg.id);
	
	dojo.query(".login-progress-tracker").style("display", "none");
	loginProgress.set("title","Retrieving data ...")
	dojo.byId("loginProgressContent").innerHTML = "<div id='data-retrieve-message' style='text-align:center;'>Retrieving your inspection data ... <br>thank you for your patience.</div>";		
	loginProgress.show();
	
	var siteByOrg = _.flatten(_.values(authUserObject.sitesByOrganization));
	getFeeders(siteByOrg);
	getTransmissionLines(siteByOrg);
	getUUIDs();

	dojo.style('mapWindSite', 'display', 'block');
	dojo.style('bladeViewerButton', 'display', 'block');
	dojo.style('siteViewerButton', 'display', 'block');
	dojo.style('switchViewButton', 'display', 'block');
}

function loginError(type) {
    dojo.style('loginError', 'display', 'block');
    dojo.style('loginDiv', 'height', '125px');
    var message = 'Invalid username or password';
    
    switch(type) {
        case 'invalid':
            dojo.byId('pw').value = '';
            dojo.byId('pw').focus();
            break;
        case 'null-user':
            message = 'Username required';
            dojo.byId('uid').focus();
            loginErrorHighlight('uid','error');
            break;
        case 'null-password':
            message = 'Password required';
            dojo.byId('pw').focus();
            loginErrorHighlight('uid','error');
            break;
        case 'null-user-password':
            message = 'Username and password required';
            dojo.byId('uid').focus();
            loginErrorHighlight('uid','error');
            loginErrorHighlight('pw','error');
            break;
        case 'role':
            dojo.byId('pw').focus();
            message = 'Permission denied';
            break;
        default:
            dojo.byId('pw').focus();
            message = 'Authentication failed';
    }
	dojo.byId('loginError').innerHTML = message;
}

function loginErrorHighlight(nodeId, state) {
    if (state == "error") {
        dojo.style(nodeId, "backgroundColor", "#F9F7BA");
        dojo.style(nodeId+ "-icon", "backgroundColor", "#F9F7BA");
        dojo.attr(nodeId, "data-authenticate-error", true);
    } else if (state == "clear") {
        dojo.style(nodeId, "backgroundColor", "#FFFFFF");
        dojo.style(nodeId+ "-icon", "backgroundColor", "#FFFFFF");
        dojo.attr(nodeId, "data-authenticate-error", false);
    }
}


function getFeeders(sites) {
	var feeders = _.filter(sites, function(site) { return _.has(site, "feederNumber"); });
	parseFeeders(feeders);
}

function getTransmissionLines(sites) {
	var transmissionLines = _.filter(sites, function(site) { return _.has(site, "lineNumber"); });
	parseTransmissionLines(transmissionLines);
}

function getWorkOrders(site) {
	var data = { "siteId": site  };
	var deferred = dojo.xhrPost({
		url: serviceApiUrl + "workOrder/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + accessToken
		},
		postData: JSON.stringify(data)
	});
	return deferred;
}

function getFeederInspections(site, workOrder) {
	var data = { "siteId": site, "orderNumber": workOrder };
	var deferred = dojo.xhrPost({
		url: serviceApiUrl + "feederInspection/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + accessToken
		},
		postData: JSON.stringify(data)
	})
	return deferred;
	
}

function getTransmissionLineInspections(site, workOrder) {
	var data = { "siteId": site, "orderNumber": workOrder };
	var deferred = dojo.xhrPost({
		url: serviceApiUrl + "transmissionLineInspection/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + accessToken
		},
		postData: JSON.stringify(data)
	})
	return deferred;
	
}

function parseFeeders(feederList) {
    
    dojo.empty("distributionSelectorList");
    
	var options = dijit.byId('siteViewerDropDown').getOptions();
    dijit.byId('siteViewerDropDown').removeOption(options);
    dijit.byId('siteViewerDropDown').addOption({ label: '', value: '' });
	
	var feederIds = [];
    if (feederList.length > 0) {
		
		var workOrderDeferreds = [];
		dojo.forEach(feederList, function(feeder) {
			siteData[feeder.id] = {};
			siteData[feeder.id].id = feeder.id;
			siteData[feeder.id].name = feeder.name;
			siteData[feeder.id].feederNumber = feeder.feederNumber;
			siteData[feeder.id].organizationId = feeder.organizationId;
			siteData[feeder.id].type = "DistributionLine";
			var workOrderDeferred = getWorkOrders(feeder.id);
			workOrderDeferreds.push(workOrderDeferred);
		});
		var workOrderDeferredList = new dojo.DeferredList(workOrderDeferreds);
		workOrderDeferredList.then(function(response) {
			if (response.length > 0) {
				var feederInspectionDeferreds = [];
				var feederWorkOrders = dojo.map(response, function(r) { return r[1] });
				dojo.forEach(feederWorkOrders, function(workOrders, i) {
					var feeder = feederList[i];
					dojo.forEach(workOrders, function(workOrder) {
						if (_.isUndefined(siteData[feeder.id].workOrders)) {
							siteData[feeder.id].workOrders = {};
						}
						
						if (!_.isNull(workOrder.orderNumber) && !_.contains(sitesToProcess, feeder.id + "-" + workOrder.orderNumber)) {
							feederIds.push(feeder.id + "-" + workOrder.orderNumber);
							sitesToProcess.push(feeder.id + "-" + workOrder.orderNumber);
							
							siteData[feeder.id].workOrders[workOrder.orderNumber] = {};
							siteData[feeder.id].workOrders[workOrder.orderNumber].description = workOrder.description;
							siteData[feeder.id].workOrders[workOrder.orderNumber].type = workOrder.type;
							siteData[feeder.id].workOrders[workOrder.orderNumber].status = (_.has(workOrder, "status")) ? workOrder.status : null;
							siteData[feeder.id].workOrders[workOrder.orderNumber].requestDate = (workOrder.requestDate && !_.isNull(workOrder.requestDate)) ? convertDate(workOrder.requestDate, 'viewer') : null;
							
							if (_.isNull(dojo.byId(feeder.id))) {
								var containerNode = dojo.create("div",null,"distributionSelectorList", "last");
								 dojo.addClass(containerNode, "windSiteSelectorItemContainer");
								 
								var node = dojo.create("div",{ 
									"id": feeder.id,
									"innerHTML": siteData[feeder.id].name + "-" + siteData[feeder.id].feederNumber,
								}, containerNode, "last");
								dojo.attr(node, "data-id", feeder.id);
								dojo.attr(node, "data-name", siteData[feeder.id].name + "-" + siteData[feeder.id].feederNumber);
								dojo.addClass(node, "windSiteSelectorItem");

								dojo.connect(node, "onclick", function(){ 
									chooseAssetSite(this.id); 
								})
								dojo.connect(node, "onmouseover", function(){ 
									hoverSiteSelector(this.id, 'over'); 
								})
								dojo.connect(node, "onmouseout", function(){ 
									hoverSiteSelector(this.id, 'out'); 
								})
								var option = { label: siteData[feeder.id].name + "-" + siteData[feeder.id].feederNumber, value: feeder.id };
								dijit.byId('siteViewerDropDown').addOption(option);

								var site = _.first(dojo.filter(feederList, function(s) { return s.id == siteData[feeder.id].id; }));
								authSites.push(site);
							}
							
							if (sitesToProcess.length <= 1) {
								dojo.query(".login-progress-tracker").style("display", "none");
								dojo.style("data-retrieve-message", "margin-bottom", "15px");
								siteDownloadProgressTable = dojo.create("table", {
									class:"siteDownloadProgress"
								}, dojo.byId("loginProgressContent"));
							}
							
							var background = (sitesToProcess.length%2 == 0) ? "#ffffff" : "#efefef";
							var tr = dojo.create("tr",  {
								style:"background:" + background,
							}, siteDownloadProgressTable);
							var td = dojo.create("td", {
								innerHTML:"" + siteData[feeder.id].name + "-" + siteData[feeder.id].feederNumber + " (" + workOrder.orderNumber +")"
							}, tr);
							var td = dojo.create("td", {
								class:"site-download-wait " + feeder.id + "-" + workOrder.orderNumber,
								innerHTML:"<i class='fa fa-circle-o-notch fa-spin'></i>"
							}, tr);
							loginProgress.resize();
							
							var feederInspectionDeferred = getFeederInspections(feeder.id, workOrder.orderNumber);
							feederInspectionDeferreds.push(feederInspectionDeferred);
						}
					})
				})
				
				var feederInspectionDeferredList = new dojo.DeferredList(feederInspectionDeferreds);
				feederInspectionDeferredList.then(function(response) {
					var feederInspections = [];
					dojo.forEach(response, function(r, i) {
						if (r[1].length > 0) {
							feederInspections.push(r[1]);
						} else {
							var td = _.first(dojo.query(".site-download-wait." + feederIds[i]));
							td.innerHTML = "<i class='fa fa-times-circle site-download-wait'></i>";
							sitesToProcess = _.without(sitesToProcess, feederIds[i]);
						}
					});
					
					if (feederInspections.length > 0) {
						dojo.forEach(feederInspections, function(feederInspection) {
							dojo.forEach(feederInspection, function(inspection) {
								getSiteSummary(inspection.id, inspection.siteId, inspection.orderNumber, 'distribution');
							})
						})
					}
				})
			}
			
		});
    } else {
        dijit.byId('siteViewerDropDown').addOption({ label: '', value: '' });
    }
}

function parseTransmissionLines(transmissionLineList) {
    
    dojo.empty("transmissionSelectorList");
    
	var options = dijit.byId('transmissionViewerDropDown').getOptions();
    dijit.byId('transmissionViewerDropDown').removeOption(options);
	
	var transmissionLineIds = [];
    if (transmissionLineList.length > 0) {
		
		var workOrderDeferreds = [];
		dojo.forEach(transmissionLineList, function(transmissionLine) {
			siteData[transmissionLine.id] = {};
			siteData[transmissionLine.id].id = transmissionLine.id;
			siteData[transmissionLine.id].name = transmissionLine.name;
			siteData[transmissionLine.id].lineNumber = transmissionLine.lineNumber;
			siteData[transmissionLine.id].organizationId = transmissionLine.organizationId;
			siteData[transmissionLine.id].type = "TransmissionLine";
			var workOrderDeferred = getWorkOrders(transmissionLine.id);
			workOrderDeferreds.push(workOrderDeferred);
		});
		var workOrderDeferredList = new dojo.DeferredList(workOrderDeferreds);
		workOrderDeferredList.then(function(response) {
			if (response.length > 0) {
				var transmissionLineInspectionDeferreds = [];
				
				var transmissionLineWorkOrders = dojo.map(response, function(r) { return r[1] });
				dojo.forEach(transmissionLineWorkOrders, function(workOrders, i) {
					var transmissionLine = transmissionLineList[i];
				
					dojo.forEach(workOrders, function(workOrder, i) {
						if (_.isUndefined(siteData[transmissionLine.id].workOrders)) {
							siteData[transmissionLine.id].workOrders = {};
						}
						
						if (!_.isNull(workOrder.orderNumber) && !_.contains(sitesToProcess, transmissionLine.id + "-" + workOrder.orderNumber)) {
							transmissionLineIds.push(transmissionLine.id + "-" + workOrder.orderNumber);
							sitesToProcess.push(transmissionLine.id + "-" + workOrder.orderNumber);
							
							siteData[transmissionLine.id].workOrders[workOrder.orderNumber] = {};
							siteData[transmissionLine.id].workOrders[workOrder.orderNumber].description = workOrder.description;
							siteData[transmissionLine.id].workOrders[workOrder.orderNumber].type = workOrder.type;
							siteData[transmissionLine.id].workOrders[workOrder.orderNumber].status = (_.has(workOrder, "status")) ? workOrder.status : null;
							siteData[transmissionLine.id].workOrders[workOrder.orderNumber].requestDate = (workOrder.requestDate && !_.isNull(workOrder.requestDate)) ? convertDate(workOrder.requestDate, 'viewer') : null;
							
							if (_.isNull(dojo.byId(transmissionLine.id))) {
								var containerNode = dojo.create("div",null,"transmissionSelectorList", "last");
								 dojo.addClass(containerNode, "windSiteSelectorItemContainer");
								 
								var node = dojo.create("div",{ 
									"id": transmissionLine.id,
									"innerHTML": siteData[transmissionLine.id].name,
								}, containerNode, "last");
								dojo.attr(node, "data-id", transmissionLine.id);
								dojo.attr(node, "data-name", siteData[transmissionLine.id].name);
								dojo.addClass(node, "windSiteSelectorItem");

								dojo.connect(node, "onclick", function(){ 
									chooseAssetSite(this.id); 
								})
								dojo.connect(node, "onmouseover", function(){ 
									hoverSiteSelector(this.id, 'over'); 
								})
								dojo.connect(node, "onmouseout", function(){ 
									hoverSiteSelector(this.id, 'out'); 
								})
								var option = { label: siteData[transmissionLine.id].name, value: transmissionLine.id };
								dijit.byId('transmissionViewerDropDown').addOption(option);

								var site = _.first(dojo.filter(transmissionLineList, function(s) { return s.id == siteData[transmissionLine.id].id; }));
								authSites.push(site);
							}
							
							
							if (sitesToProcess.length <= 1) {
								dojo.query(".login-progress-tracker").style("display", "none");
								dojo.style("data-retrieve-message", "margin-bottom", "15px");
								siteDownloadProgressTable = dojo.create("table", {
									class:"siteDownloadProgress"
								}, dojo.byId("loginProgressContent"));
							}
							
							var background = (sitesToProcess.length%2 == 0) ? "#ffffff" : "#efefef";
							var tr = dojo.create("tr",  {
								style:"background:" + background,
							}, siteDownloadProgressTable);
							var td = dojo.create("td", {
								innerHTML:"" + siteData[transmissionLine.id].name + " (" + workOrder.orderNumber +")"
							}, tr);
							var td = dojo.create("td", {
								class:"site-download-wait " + transmissionLine.id + "-" + workOrder.orderNumber,
								innerHTML:"<i class='fa fa-circle-o-notch fa-spin'></i>"
							}, tr);
							loginProgress.resize();
							
							var transmissionLineInspectionDeferred = getTransmissionLineInspections(transmissionLine.id, workOrder.id);
							transmissionLineInspectionDeferreds.push(transmissionLineInspectionDeferred);
						}
					})
				})
				
				var transmissionLineInspectionDeferredList = new dojo.DeferredList(transmissionLineInspectionDeferreds);
				transmissionLineInspectionDeferredList.then(function(response) {
					
					var transmissionLineInspections = [];
					dojo.forEach(response, function(r, i) {
						if (r[1].length > 0) {
							transmissionLineInspections.push(r[1]);
						} else {
							var td = _.first(dojo.query(".site-download-wait." + transmissionLineIds[i]));
							td.innerHTML = "<i class='fa fa-times-circle site-download-wait'></i>";
							sitesToProcess = _.without(sitesToProcess, transmissionLineIds[i]);
						}
					});
					
					if (transmissionLineInspections.length > 0) {
						dojo.forEach(transmissionLineInspections, function(transmissionLineInspection) {
							dojo.forEach(transmissionLineInspection, function(inspection) {
								getSiteSummary(inspection.id, inspection.siteId, inspection.orderNumber, 'transmission');
							}) 
						})
					}
				})
			}
			
		});
    } else {
		dijit.byId('transmissionViewerDropDown').addOption({ label: '', value: '' });
	}
}

function getSiteSummary(id, siteId, workOrder, type) {
	
	var apiObj = (type == "distribution") ? "feederInspection" : "transmissionLineInspection";
	var assetSummaryDeferred = dojo.xhrGet({
		url: serviceApiUrl + apiObj + "/" + id + "/summary",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + accessToken
		}
	})
	assetSummaryDeferred.then(function(response) {
		if (type == "distribution") {
			var feeder = response;
			if (_.has(siteData[siteId].workOrders, workOrder)) {
				siteData[siteId].workOrders[workOrder].summary = {};
				siteData[siteId].workOrders[workOrder].summary.name = feeder.name;
				siteData[siteId].workOrders[workOrder].summary.feederNumber = feeder.feederNumber;
				siteData[siteId].workOrders[workOrder].summary.windZone = feeder.windZone;
				siteData[siteId].workOrders[workOrder].summary.hardeningLevel = feeder.hardeningLevel;
				
				siteData[siteId].workOrders[workOrder].summary.feederMapDownloadURL = feeder.feederMapDownloadURL;
				siteData[siteId].workOrders[workOrder].summary.summaryReportDownloadURL = feeder.summaryReportDownloadURL;
				siteData[siteId].workOrders[workOrder].summary.anomalyReportDownloadURL = feeder.anomalyReportDownloadURL;
				siteData[siteId].workOrders[workOrder].summary.anomalyMapDownloadURL = feeder.anomalyMapDownloadURL;
				siteData[siteId].workOrders[workOrder].summary.surveyReportDownloadURL = feeder.surveyReportDownloadURL;
				siteData[siteId].workOrders[workOrder].summary.vegitationEncroachmentGoogleEarthURL = feeder.vegitationEncroachmentGoogleEarthURL;
				siteData[siteId].workOrders[workOrder].summary.vegitationEncroachmentReportDownloadURL = feeder.vegitationEncroachmentReportDownloadURL;
				siteData[siteId].workOrders[workOrder].summary.vegitationEncroachmentShapeDownloadURL = feeder.vegitationEncroachmentShapeDownloadURL;
				
				siteData[siteId].workOrders[workOrder].summary.inspectionFlightVideos = feeder.inspectionFlightVideos;
				
				siteData[siteId].workOrders[workOrder].summary.objects = {};
				siteData[siteId].workOrders[workOrder].summary.objects.subStationSummary = feeder;
				siteData[siteId].workOrders[workOrder].summary.objects.subStationSummary.feederNumber = feeder.feederNumber;
				siteData[siteId].workOrders[workOrder].summary.objects.poleSummary = feeder.polesByFPLId;
				siteData[siteId].workOrders[workOrder].summary.objects.poleInspectionSummary = feeder.poleInspectionsByFPLId;
				
				dojo.forEach(_.keys(siteData[siteId].workOrders[workOrder].summary.objects.poleSummary), function(fplid) {				
					var asset = siteData[siteId].workOrders[workOrder].summary.objects.poleSummary[fplid];
					if (_.isNull(asset.location)) {
						siteData[siteId].workOrders[workOrder].summary.objects.poleSummary[fplid].location = { "accuracy":null,"altitude":null, "latitude": 0, "longitude": 0 };
					}
				})
				
				siteData[siteId].workOrders[workOrder].summary.data = dojo.map(_.keys(feeder.polesByFPLId), function(fplid) {
					var pole = dojo.clone(feeder.polesByFPLId[fplid]);
					pole.assetInspection = (!_.isUndefined(feeder.poleInspectionsByFPLId[fplid])) ? dojo.clone(feeder.poleInspectionsByFPLId[fplid]) : {};
					return pole;
				});
				
				createGridDataStore(siteId, workOrder, siteData[siteId].workOrders[workOrder].summary.data, "DistributionLine");
			}
		}
		if (type == "transmission") {
			var transmissionLine = response;
			if (_.has(siteData[siteId].workOrders, workOrder)) {
				siteData[siteId].workOrders[workOrder].summary = {};
					siteData[siteId].workOrders[workOrder].summary.name = siteData[siteId].name;
					siteData[siteId].workOrders[workOrder].summary.lineNumber = siteData[siteId].lineNumber;
					
					siteData[siteId].workOrders[workOrder].summary.summaryReportDownloadURL = transmissionLine.summaryReportDownloadURL;
					siteData[siteId].workOrders[workOrder].summary.inspectionFlightVideos = transmissionLine.inspectionFlightVideos;
					
					siteData[siteId].workOrders[workOrder].summary.objects = {};
					siteData[siteId].workOrders[workOrder].summary.objects.transmissionLineSummary = transmissionLine;
					
					siteData[siteId].workOrders[workOrder].summary.objects.structureSummary = transmissionLine.structures;
					siteData[siteId].workOrders[workOrder].summary.objects.structureInspectionSummary = transmissionLine.structureInspections;
					
					dojo.forEach(_.keys(siteData[siteId].workOrders[workOrder].summary.objects.structureSummary), function(id) {				
						var asset = siteData[siteId].workOrders[workOrder].summary.objects.structureSummary[id];
						if (_.isNull(asset.location)) {
							siteData[siteId].workOrders[workOrder].summary.objects.structureSummary[id].location = { "accuracy":null,"altitude":null, "latitude": 0, "longitude": 0 };
						}
					})
					
					siteData[siteId].workOrders[workOrder].summary.data = dojo.map(_.keys(transmissionLine.structures), function(id) {
						var asset = dojo.clone(transmissionLine.structures[id]);
						asset.assetInspection = (!_.isUndefined(transmissionLine.structureInspections[id])) ? dojo.clone(transmissionLine.structureInspections[id]) : {};
						
						if (!_.isEmpty(asset.assetInspection)) {
							asset.assetInspection.inspectionEvents = {};
							asset.assetInspection.inspectionEvents.events = [];
							asset.assetInspection.inspectionEventResources = {};
							asset.assetInspection.inspectionEventResources.polys = [];
							dojo.forEach(asset.assetInspection.flightImages, function(image) {
									image.polys = [];
							});
						}
						
						return asset;
					});
					
					createGridDataStore(siteId, workOrder, siteData[siteId].workOrders[workOrder].summary.data, "TransmissionLine");
			}
		}	
		
		var tds = dojo.query(".site-download-wait." + siteId + "-" + workOrder);
		dojo.forEach(tds, function(td) {
			td.innerHTML = "<i class='fa fa-check-circle site-download-wait'></i>";
		})
		sitesToProcess = _.without(sitesToProcess, siteId + "-" + workOrder);
		
		if (sitesToProcess.length == 0) {
			finishDataParsing();
		}
		
	},
	function(err) {
		var tds = dojo.query(".site-download-wait." + siteId + "-" + workOrder);
		dojo.forEach(tds, function(td) {
			td.innerHTML = "<i class='fa fa-times-circle site-download-wait'></i>";
		})
		sitesToProcess = _.without(sitesToProcess, siteId + "-" + workOrder);
		
		if (sitesToProcess.length == 0) {
			finishDataParsing();
		}
	})
}

function finishDataParsing(){	
	window.setTimeout(function(){
		loginProgress.hide();
		window.setTimeout(function(){
			dojo.byId("loginProgressContent").innerHTML = "";
			dojo.style("loginProgressContent", "width", "auto;");
		}, 1000)
	}, 1000)
	
	//remove any workOrder without inspection data and remove any sites without work orders
	var siteIds = _.keys(siteData);
	dojo.forEach(siteIds, function(siteId) {
		var workOrders = _.keys(siteData[siteId].workOrders);
		dojo.forEach(workOrders, function(workOrder) {
			if(!_.has(siteData[siteId].workOrders[workOrder], "summary")) {
				delete siteData[siteId].workOrders[workOrder];
			}
		})
		if (_.isEmpty(siteData[siteId].workOrders)) {
			if (dojo.byId(siteId)) {
				dojo.destroy(dojo.byId(siteId).parentNode);
			}
			dijit.byId('siteViewerDropDown').removeOption(siteId);
			authSites = dojo.filter(authSites, function(site) { return site.id !== siteId; });
			delete siteData[siteId];
		}
	})

	renderWindSiteSelector();
							
	loadMapLayers();

	var extent = getQueryResultsExtent(windFeatureGraphics);
	authExtent = extent;

	window.setTimeout(function(){
		var switchViewButton = dojo.byId("switchViewButton");
		
		var distIds = dojo.filter(_.keys(siteData), function(site) { return siteData[site].type == "DistributionLine"; });
		var transIds = dojo.filter(_.keys(siteData), function(site) { return siteData[site].type == "TransmissionLine"; });
		
		if (distIds.length > 0 || transIds.length > 0) {
			var id = (distIds.length > 0) ? _.first(distIds) : _.first(transIds);
			siteView = (distIds.length > 0) ? "DistributionLine" : "TransmissionLine";
			var viewId = (siteView == "DistributionLine") ? "site" : "transmission";
			
			siteId = id;
			siteName = siteData[id].name;
			dijit.byId(viewId + 'ViewerDropDown').set('value', id);
			updateWorkOrderDropdown(id);
			openViewerPanel("siteViewer"); 
			
			if (viewId == "transmission"){
				dojo.removeClass(switchViewButton, "distribution transmission");
				dojo.addClass(switchViewButton, "transmission");
				switchViews(siteView);
			}
			var display = (distIds.length == 0 || transIds.length == 0) ? "none" : "block";
			dojo.style(switchViewButton, "display", display);
			
		} else {
			var node = dojo.create("div",{ id: "no_authorized_sites" }, "windSiteSelectInnerContent", "last");
			dojo.attr(node, "innerHTML", "No authorized sites");
			dojo.addClass(node, "windSiteSelectorItem");
			renderWindSiteSelector();
			loginProgress.hide();
			dojo.style(switchViewButton, "display", "none");
		}
		
		windFeatureLayer.redraw();
		
		dojo.style("mapProgressBar", "display", "none");
		
	}, 1000);	
	
}

function getUUIDs() {
	dojo.xhrGet({
		url: serviceApiUrl + "utils/uuid?count=50",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + accessToken
		},
		load: function(results){
			uuids = results;
		},
		error: function(error) {
			console.log(error);
		}
	});
	
}

function getTranslation(id){
	
	var translationDeferred = dojo.xhrGet({
		url: serviceApiUrl + "org/" + id + "/translations",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + accessToken
		},
		load: function(results){
			translationJson = results;
			createInspectionDisplay();
		},
		error: function(error) {
			console.log(error);
			createInspectionDisplay();
		}
	});
}

function getOrgs(orgIds) {
	dojo.forEach(orgIds, function(orgId) {
		dojo.xhrGet({
			url: serviceApiUrl + "org/" + orgId,
			handleAs: "json",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + accessToken
			},
			load: function(results){
				siteOrgs[orgId] = results;
			},
			error: function(error) {
				console.log(error);
			}
		});
	})
}