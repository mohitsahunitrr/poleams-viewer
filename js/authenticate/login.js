// Enter Global Config Values & Instantiate ADAL AuthenticationContext

//Inspectools Dev
//var webserviceClientId = "17722449-ef2e-4adc-ad1d-8b7ead334ec9";
//var config = {
    //instance: 'https://login.microsoftonline.com/',
    //Inspectools Dev
	//tenant: '4b07043f-40ce-464d-8715-8e2a4fd8d7d1',
    //clientId: 'ccde5a1b-aa3c-4086-858b-c7af60e256c1',
    //postLogoutRedirectUri: " https://windamsdev.vestas.inspectools.net/",
	//cacheLocation: 'localStorage'
//};
var configs = {
	"windamsdev.inspectools.net": {
		instance: 'https://login.microsoftonline.com/',
		tenant: '4b07043f-40ce-464d-8715-8e2a4fd8d7d1',
		clientId: 'd5a9412a-721f-4de9-9a3d-f0f5b456811f',
		postLogoutRedirectUri: "https://windamsdev.inspectools.net/",
		cacheLocation: 'sessionStorage'
	},
	"windamsdev.vestas.inspectools.net": {
		instance: 'https://login.microsoftonline.com/',
		tenant: 'eb6b9710-d101-4a69-9b3f-7951ad9804e5',
		clientId: '2ed97cf2-adab-41c5-b6ae-a4bc78622cc8',
		postLogoutRedirectUri: "https://windamsdev.vestas.inspectools.net/",
		cacheLocation: 'sessionStorage'
	},
	"windamstest.vestas.inspectools.net": {
		instance: 'https://login.microsoftonline.com/',
		tenant: '1d7dbf0f-21dc-490c-84df-bd5ebad37e4b',
		clientId: 'df9f5b6e-99f6-4dc8-a139-1c2f250a366a',
		postLogoutRedirectUri: "https://windamstest.vestas.inspectools.net/",
		cacheLocation: 'sessionStorage'
	}
}

var webserviceClientIds = {
	"windamsdev.inspectools.net": "17722449-ef2e-4adc-ad1d-8b7ead334ec9",
	"windamsdev.vestas.inspectools.net": "fa71ab0c-e530-4ef6-b437-231e96a51eea",
	"windamstest.vestas.inspectools.net": "e163e780-47ed-490f-9152-9f6a104270e8"
}
var config = configs[window.location.hostname];
var webserviceClientId = webserviceClientIds[window.location.hostname];

var authAttempts = 0;
var authToken = "";
var tokenComplete = false;
//var authContext = new AuthenticationContext(config);
var authContext = {};
var authenticationErrorStatus = null;
var authenticationErrorKey = "default";

var authenticationErrorConfig = {
	"login_required": {
		"message": "There was a problem logging you in: token is expired for currently cached user.<br>Click Close to log in again.",
		"action": function() {
			authContext.clearCache();
			authContext.login();
			authenticationError.hide();
		}
	},
	"Token Renewal Failed": {
		"message": "There was a problem logging you in: token renewal failed due to timeout.<br>Click Close to log in again.",
		"action": function() {
			authContext.clearCache();
			authContext.login();
			authenticationError.hide();
		}
	},
	"default":{
		"message": "There was a problem logging you in: unknown issue at this time.<br>Try again or contact support for assistance.",
		"action": function() {
			authenticationError.hide();
			authContext.clearCache();
			authContext.logOut();
		}
	},
	"401": {
		"message": "401 Unauthorized: the current user does not have the necessary credentials.<br>Try again with a supported login.",
		"action": function() {
			authenticationError.hide();
			authContext.clearCache();
			authContext.logOut();
		}
	},
	"403": {
		"message": "403 Forbidden: the current user does not have the necessary credentials.<br>Try again with a supported login.",
		"action": function() {
			authenticationError.hide();
			authContext.clearCache();
			authContext.logOut();
		}
	},
	"503": {
		"message": "503 Authorization Service Unavailable: the server is currently unavailable.<br>Click Close and try again later.",
		"action": function() {
			authenticationError.hide();
			authContext.clearCache();
			authContext.logOut();
		}
	}
}

/*
 * error_description	string	error description returned from AAD if token request fails.
 * token				string	token returned from AAD if token request is successful.
 * error				string	error message returned from AAD if token request fails.
 */

 
function initAAD() {
	// Check For & Handle Redirect From AAD After Login
	var isCallback = authContext.isCallback(window.location.hash);
	if (isCallback) {
		console.log("1. load location hash...");
		console.log("2. handle callback...");
		authContext.handleWindowCallback();
	}

	// Check Login Status
	dojo.byId("loginProgressContent").innerHTML = "Getting current user...";
	var user = authContext.getCachedUser();
	if (user) {
		if (window.location == window.parent.location) {
			loginProgress.show();
			console.log(user);
			console.log("3. request token...");
			updateLoginProgressBar(1);
			dojo.byId("loginProgressContent").innerHTML = "Requesting token for " + user.profile.name + "...";
			
			authContext.acquireToken(webserviceClientId, tokenObtained);
			
			dojo.connect(dojo.byId("authenticationErrorButton"), "onclick", function() {
				console.log(authenticationErrorKey);
				authenticationErrorConfig[authenticationErrorKey].action();
			})
		}
	}
}

function tokenObtained(error_description, token, error) {	
	if (!error) {
		console.log("4. collect token...");
		updateLoginProgressBar(2);
		dojo.byId("loginProgressContent").innerHTML = "Token retrieved...";
		
		dojo.style("mapProgressBar", { "display":"block" });
		authToken = token;
		getAuthSites();
	} else {
		console.log(error);
		console.log(error_description);
		console.log(authenticationErrorStatus);
		loginProgress.hide();
		authenticationErrorKey = (!_.isNull(authenticationErrorStatus) && _.has(authenticationErrorConfig, authenticationErrorStatus)) ? authenticationErrorStatus : (_.has(authenticationErrorConfig, error)) ? error : "default";
		var message = authenticationErrorConfig[authenticationErrorKey].message;
		dojo.query(".authenticationErrorText")[0].innerHTML = message;
		authenticationError.show();
		dojo.attr('sign-in', 'data-viewer-login', 'false');
	}
}

function updateExpirationTime() {
    var user = authContext.getCachedUser();
    var cur = Math.round(new Date().getTime()/1000.0);
    if (user) {
        tokenExpires = user.profile.exp - cur;
        if (authToken) {
            obj = jwt_decode(authToken);
            apiExpires = obj.exp - cur;
			dojo.byId("sessionTimeoutExpire").innerHTML = Math.floor(apiExpires/60) + " min " + apiExpires%60 + " secs";
			
			if (apiExpires <= 300) {
				sessionTimeoutWarning.show()
			}
			
			if (apiExpires <= 0) {
				authContext.clearCache();
				authContext.logOut();
			}
        }
    }
}

//window.setInterval(updateExpirationTime, 1000);

function renewToken() {
    dojo.byId("sessionContinueButton").innerHTML = '<i class="fa fa-spinner fa-pulse"></i>';
	authContext._renewToken(webserviceClientId, function(error_description, token, error) {
		console.log(error_description);
		console.log(token);
		console.log(error);
        if (token) {
            authToken = token;
			sessionTimeoutWarning.hide();
        } else {
			authenticationError.show();
		}
		dojo.byId("sessionContinueButton").innerHTML = 'Continue';
    });
}

function getAuthSites() {
	if (authToken) {
		console.log("5. request user data...");
		updateLoginProgressBar(3);
		dojo.byId("loginProgressContent").innerHTML = "Requesting user credentials from server...";
		dojo.xhrGet({
			url: windAmsDwVestasUrl + 'auth/credentials',
			handleAs: "json",
			headers: {
				"Content-Type": "application/json",
				"Authorization": JSON.stringify(authRequest)
			},
			load: function(response) {
				updateLoginProgressBar(4);
				dojo.byId("loginProgressContent").innerHTML = "Credentials retrieved ... <b>Login successful!</b>";
				authSitesRecv(response);
			},
			error: function(error){
				authenticationErrorStatus = error.status;
				authAttempts += 1;
				if (authAttempts < 3) {
					console.log("6. update token...");
					dojo.byId("loginProgressContent").innerHTML = "Retrieving credentials failed, resending request (" + authAttempts + ")...";
					authContext.clearCache();
					authContext.acquireToken(webserviceClientId, tokenObtained);
					//authContext._renewIdToken(tokenObtained);
				} else {
					console.log(error.status);
					loginProgress.hide();
					authenticationErrorKey = (!_.isNull(authenticationErrorStatus) && _.has(authenticationErrorConfig, authenticationErrorStatus)) ? authenticationErrorStatus : "default";
					var message = authenticationErrorConfig[authenticationErrorKey].message;
					dojo.query(".authenticationErrorText")[0].innerHTML = message;
					authenticationError.show();
					dojo.attr('sign-in', 'data-viewer-login', 'false');
					dojo.style("mapProgressBar", { "display":"none" });
				}
				return error;
			}
		})
	}
}

function authSitesRecv(response) {
	var windAmsAppId = "51a2afaf-180d-4d20-8dd9-f06e84e73583";
    if (_.isEmpty(authUserObject)) { 
		authUserObject = response;
		authRoles = (_.has(authUserObject.rolesByApplication, windAmsAppId)) ? authUserObject.rolesByApplication[windAmsAppId] : null;
		if (authRoles) {
			var role = (_.indexOf(authRoles, 'Inspector') > -1 || _.indexOf(authRoles, 'Admin') > -1 || _.indexOf(authRoles, 'OrgAdmin') > -1 || _.indexOf(authRoles, 'SiteAdmin') > -1) ? 'inspector' : (_.indexOf(authRoles, 'read_report') > -1) ? 'report' : 'guest';
			//add report permissions for Data Processor? Guest has lowest privileges already
			
			dojo.style('loginError', 'display', 'none');
			dojo.style('loginDiv', 'height', '105px');
			
			dojo.byId('sign-in').innerHTML = 'Sign Out';
			dojo.attr('sign-in', 'data-viewer-login', 'true');
			
			dojo.byId('current-user').innerHTML = "Welcome " + authUserObject.firstName;
			authUser = authUserObject.firstName + " " +  authUserObject.lastName;
			authUserId = authUserObject.userId;
			authUserOrg = (authUserObject.organizations.length > 0) ? _.first(authUserObject.organizations) : { "key": "InspecToolsLLC", "name":"InspecTools" };
			
			dojo.fx.wipeOut({ 
				node: "loginDiv",
				onEnd: function(){
					applyCssSkin(authUserOrg.key);
				}
			}).play();
			
			dojo.style('mapWindSite', 'display', 'block');
			dojo.style('bladeViewerButton', 'display', 'block');
			dojo.style('siteViewerButton', 'display', 'block');
			dojo.style('headerMenuDiv', 'display', 'block');
			
			switch(role) {
				case 'inspector':
					dojo.style('bladeInspectorGridButtonDiv', 'display','block');
					dojo.style('bladeInspectorButtonDiv', 'display','block');
					var display = (authUserOrg.key == "Vestas") ? 'block' : 'none';
					dojo.style('bladeMoreInfoButtonDiv', 'display', display);
				
					dojo.style('bladeInspectionReportButtonDiv', 'display', 'block');
					var display = (authUserOrg.key == "Vestas" || authUserOrg.key == "InspecToolsLLC") ? 'inline-block' : 'none';
					dojo.style('bladeInspectionWordDownload', 'display', display);
					
					dojo.style('siteImageDownload', 'display','inline-block');
					dojo.style('siteReportDownload', 'display','inline-block');
					break;
				
				case 'report':
					dojo.style('bladeInspectorGridButtonDiv', 'display','none');
					dojo.style('bladeInspectorButtonDiv', 'display','none');
					dojo.style('bladeMoreInfoButtonDiv', 'display', 'none');
				
					dojo.style('bladeInspectionReportButtonDiv', 'display', 'block');
					var display = (authUserOrg.key == "Vestas" || authUserOrg.key == "InspecToolsLLC") ? 'inline-block' : 'none';
					dojo.style('bladeInspectionWordDownload', 'display', display);
					
					dojo.style('siteImageDownload', 'display','inline-block');
					dojo.style('siteReportDownload', 'display','inline-block');
					break;
				
				case 'guest':
					dojo.style('bladeInspectorGridButtonDiv', 'display','none');
					dojo.style('bladeInspectorButtonDiv', 'display','none');
					dojo.style('bladeMoreInfoButtonDiv', 'display', 'none');
					
					dojo.style('bladeInspectionReportButtonDiv', 'display','none');
					dojo.style('siteInspectionReportButtonDiv', 'display','none');
					
					dojo.style('siteImageDownload', 'display','none');
					dojo.style('siteReportDownload', 'display','none');
					break;
			}
			
			dojo.style("mapProgressBar", { "display":"block" });
			loginProgress.set("title","Retrieving data ...")
			dojo.byId("loginProgressContent").innerHTML = "<div id='data-retrieve-message' style='text-align:center;'>Retrieving your asset/inspection data ... <br>thank you for your patience.</div>";
			
			//getValidationTranslation(authUserOrg.id);
			//processSitesByOrganization(authUserObject.sitesByOrganization);
			
		} else {
			loginError('role');
		}
	}
}

function updateLoginProgressBar(step){
	var total = dojo.query(".progress-stop").length;
	var next = step + 1;

	var stopNode = dojo.query(".login-progress-tracker .progress-stop.S" + step)[0];
	dojo.removeClass(stopNode,"active");
	dojo.addClass(stopNode,"complete");
	stopNode.innerHTML = '<i class="fa fa-check"></i>';
	
	if (next <= total) {
		var nextNode = dojo.query(".login-progress-tracker .progress-stop.S" + next)[0];
		dojo.addClass(nextNode,"active");
		dojo.addClass(dojo.query(".login-progress-tracker .progress-track.S" + next)[0],"active");
	}
	
}







function signInOnClick() {
    var loginStatus = dojo.attr('sign-in', 'data-viewer-login');
    if (loginStatus == "false"){
        var display = dojo.style("loginDiv", "display");
        if (display == "none") {
            dojo.fx.wipeIn({ 
                node: "loginDiv",
                onBegin: function(){
                    dojo.style('sign-in', { 'backgroundColor':'#2a2a2a', 'color':'#ffffff' });
                    dijit.focus(dojo.byId("uid"));
                },
                onEnd: function() {
                    
                }
            }).play();
        } else {
            dojo.fx.wipeOut({ 
                node: "loginDiv",
                onEnd: function(){
					dojo.style('sign-in', { 'backgroundColor':'#1a1a1a', 'color':'#adafaf' });
                }
            }).play();
        }
    } else if (loginStatus == "true") {
        logInOutViewer('logout');
    } 
}


function logInOutViewer(state){
	if (state == 'login') {
		var username = dojo.byId('uid').value.trim();
		var password = dojo.byId('pw').value.trim();
        
        if (username == "" && password == "") {
            loginError('null-user-password');
        } else if (username == "") {
            loginError('null-user');
        } else if (password == ""){
            loginError('null-password');
        } else {
           authenticate(username, password); 
        }
		
	} else if ( state == 'logout') {
		
		dojo.byId('pw').value = '';
        dojo.byId('pw').focus();
        
        loginErrorHighlight('uid','clear');
        loginErrorHighlight('pw','clear');
		
		dojo.byId('sign-in').innerHTML = 'Sign In';
		dojo.attr('sign-in', 'data-viewer-login', 'false');
		
		dojo.style('loginError', 'display', 'none');
		dojo.style('loginDiv', 'height', '105px');
		
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
}

function authenticate(username, password) {
	
   authRequest = {
        "login": username,
		"passwordHash":sha256(password)
    };
	
	dojo.xhrGet({
		url: windAmsDwVestasUrl + 'auth/credentials',
		handleAs: "json",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json; charset=utf-8",
			"Authorization": JSON.stringify(authRequest)
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
	
	dojo.fx.wipeOut({ 
		node: "loginDiv"
	}).play();
	
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
	
	dojo.style('map-legend', 'visibility', 'visible');
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
	/* dojo.xhrGet({
		url: windAmsDwVestasUrl + 'feeder',
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
		},
		load: function(response) {
			//authUserAssets = response;
			parseFeeders(response);
		},
		error: function(error){
			console.log(error);
		}
	}); */
	
	var feeders = _.filter(sites, function(site) { return _.has(site, "feederNumber"); });
	parseFeeders(feeders);
}


function getTransmissionLines(sites) {
	/* dojo.xhrGet({
		url: windAmsDwVestasUrl + 'transmissionLine',
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
		},
		load: function(response) {
			parseTransmissionLines(response);
		},
		error: function(error){
			console.log(error);
		}
	}); */
	
	var transmissionLines = _.filter(sites, function(site) { return _.has(site, "lineNumber"); });
	parseTransmissionLines(transmissionLines);
}

function getWorkOrders(site) {
	var data = { "siteId": site  };
	var deferred = dojo.xhrPost({
		url: windAmsDwVestasUrl + "workOrder/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
		},
		postData: JSON.stringify(data)
	});
	return deferred;
}

function getFeederInspections(site, workOrder) {
	var data = { "siteId": site, "orderNumber": workOrder };
	var deferred = dojo.xhrPost({
		url: windAmsDwVestasUrl + "feederInspection/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
		},
		postData: JSON.stringify(data)
	})
	return deferred;
	
}

function getTransmissionLineInspections(site, workOrder) {
	var data = { "siteId": site, "orderNumber": workOrder };
	var deferred = dojo.xhrPost({
		url: windAmsDwVestasUrl + "transmissionLineInspection/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
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
	
	//var feederList  = _.flatten(_.values(feeders));
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
						
						if (!_.isNull(workOrder.orderNumber)) {
							sitesToProcess.push(feeder.id);
							
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
								class:"site-download-wait " + feeder.id,
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
					var feederInspections = dojo.map(response, function(r) { return r[1] });
					if (feederInspections.length > 0) {
						var feederInspectionObjs = [];
						var feederSummaryDeferreds = [];
						dojo.forEach(feederInspections, function(feederInspection) {
							dojo.forEach(feederInspection, function(inspection) {
								feederInspectionObjs.push(inspection)
								var feederSummaryDeferred = dojo.xhrGet({
									url: windAmsDwVestasUrl + "feederInspection/" + inspection.id + "/summary",
									handleAs: "json",
									headers: {
										"Content-Type": "application/json",
										"Authorization": JSON.stringify(authRequest)
									},
									load: function(response) {
										//console.log(response);
									},
									error: function(error) {
										console.log(error);
									}
								})
								feederSummaryDeferreds.push(feederSummaryDeferred);
							})
						})
						
						var feederSummaryList = new dojo.DeferredList(feederSummaryDeferreds);
						feederSummaryList.then(function(response) {
							var feederInspectionSummaries = dojo.map(response, function(r) { return r[1] });
							if (feederInspectionSummaries.length > 0) {
								dojo.forEach(feederInspectionSummaries, function(feeder, i) {
									var workOrder = feederInspectionObjs[i].orderNumber;
									if (_.has(siteData[feeder.id].workOrders, workOrder)) {
										siteData[feeder.id].workOrders[workOrder].summary = {};
										siteData[feeder.id].workOrders[workOrder].summary.name = feeder.name;
										siteData[feeder.id].workOrders[workOrder].summary.feederNumber = parseInt(feeder.feederNumber);
										siteData[feeder.id].workOrders[workOrder].summary.windZone = feeder.windZone;
										siteData[feeder.id].workOrders[workOrder].summary.hardeningLevel = feeder.hardeningLevel;
										
										siteData[feeder.id].workOrders[workOrder].summary.feederMapDownloadURL = feeder.feederMapDownloadURL;
										siteData[feeder.id].workOrders[workOrder].summary.summaryReportDownloadURL = feeder.summaryReportDownloadURL;
										siteData[feeder.id].workOrders[workOrder].summary.anomalyReportDownloadURL = feeder.anomalyReportDownloadURL;
										siteData[feeder.id].workOrders[workOrder].summary.anomalyMapDownloadURL = feeder.anomalyMapDownloadURL;
										siteData[feeder.id].workOrders[workOrder].summary.surveyReportDownloadURL = feeder.surveyReportDownloadURL;
										siteData[feeder.id].workOrders[workOrder].summary.vegitationEncroachmentGoogleEarthURL = feeder.vegitationEncroachmentGoogleEarthURL;
										siteData[feeder.id].workOrders[workOrder].summary.vegitationEncroachmentReportDownloadURL = feeder.vegitationEncroachmentReportDownloadURL;
										siteData[feeder.id].workOrders[workOrder].summary.vegitationEncroachmentShapeDownloadURL = feeder.vegitationEncroachmentShapeDownloadURL;
										
										siteData[feeder.id].workOrders[workOrder].summary.objects = {};
										siteData[feeder.id].workOrders[workOrder].summary.objects.subStationSummary = feeder;
										siteData[feeder.id].workOrders[workOrder].summary.objects.subStationSummary.feederNumber = parseInt(feeder.feederNumber);
										siteData[feeder.id].workOrders[workOrder].summary.objects.poleSummary = feeder.polesByFPLId;
										siteData[feeder.id].workOrders[workOrder].summary.objects.poleInspectionSummary = feeder.poleInspectionsByFPLId;
										
										dojo.forEach(_.keys(siteData[feeder.id].workOrders[workOrder].summary.objects.poleSummary), function(fplid) {				
											var asset = siteData[feeder.id].workOrders[workOrder].summary.objects.poleSummary[fplid];
											if (_.isNull(asset.location)) {
												siteData[feeder.id].workOrders[workOrder].summary.objects.poleSummary[fplid].location = { "accuracy":null,"altitude":null, "latitude": 0, "longitude": 0 };
											}
										})
										
										siteData[feeder.id].workOrders[workOrder].summary.data = dojo.map(_.keys(feeder.polesByFPLId), function(fplid) {
											var pole = dojo.clone(feeder.polesByFPLId[fplid]);
											pole.assetInspection = (!_.isUndefined(feeder.poleInspectionsByFPLId[fplid])) ? dojo.clone(feeder.poleInspectionsByFPLId[fplid]) : {};
											return pole;
										});
										
										createGridDataStore(feeder.id, workOrder, siteData[feeder.id].workOrders[workOrder].summary.data, "DistributionLine");
									}
									
									var td = _.first(dojo.query(".site-download-wait." + feeder.id));
									td.innerHTML = "<i class='fa fa-check-circle site-download-wait'></i>";
									sitesToProcess = _.without(sitesToProcess, feeder.id);
								})
		
								if (sitesToProcess.length == 0) {
									finishDataParsing();
								}
								
							} else {
								var node = dojo.create("div",{ id: site[1].name }, "windSiteSelectInnerContent", "last");
								dojo.attr(node, "innerHTML", "No authorized sites");
								dojo.addClass(node, "windSiteSelectorItem");
								renderWindSiteSelector();
							}
							
						});
					}
				})
			}
			
		});
    } else {
        var node = dojo.create("div",{ id: "no_authorized_sites" }, "windSiteSelectInnerContent", "last");
        dojo.attr(node, "innerHTML", "No authorized sites");
        dojo.addClass(node, "windSiteSelectorItem");
        renderWindSiteSelector();
		loginProgress.hide();
    }
}

function parseTransmissionLines(transmissionLineList) {
    
    dojo.empty("transmissionSelectorList");
    
	var options = dijit.byId('transmissionViewerDropDown').getOptions();
    dijit.byId('transmissionViewerDropDown').removeOption(options);
	
	//var transmissionLineList  = _.flatten(_.values(transmissionLines));
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
						
						if (!_.isNull(workOrder.orderNumber)) {
							sitesToProcess.push(transmissionLine.id);
							
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
								class:"site-download-wait " + transmissionLine.id,
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
					var transmissionLineInspections = dojo.map(response, function(r) { return r[1] });
					if (transmissionLineInspections.length > 0) {
						var transmissionLineInspectionObjs = [];
						var transmissionLineSummaryDeferreds = [];
						dojo.forEach(transmissionLineInspections, function(transmissionLineInspection) {
							dojo.forEach(transmissionLineInspection, function(inspection) {
								transmissionLineInspectionObjs.push(inspection);
								var transmissionLineSummaryDeferred = dojo.xhrGet({
									url: windAmsDwVestasUrl + "transmissionLineInspection/" + inspection.id + "/summary",
									handleAs: "json",
									headers: {
										"Content-Type": "application/json",
										"Authorization": JSON.stringify(authRequest)
									},
									load: function(response) {
										//console.log(response);
									},
									error: function(error) {
										console.log(error);
									}
								})
								transmissionLineSummaryDeferreds.push(transmissionLineSummaryDeferred);
							})
						})
						var transmissionLineSummaryList = new dojo.DeferredList(transmissionLineSummaryDeferreds);
						transmissionLineSummaryList.then(function(response) {
							var transmissionLineSummaries = dojo.map(response, function(r) { return r[1] });
							if (transmissionLineSummaries.length > 0) {
								dojo.forEach(transmissionLineSummaries, function(transmissionLine, i) {
									var workOrder = transmissionLineInspectionObjs[i].orderNumber;
									if (_.has(siteData[transmissionLine.siteId].workOrders, workOrder)) {
										siteData[transmissionLine.siteId].workOrders[workOrder].summary = {};
										siteData[transmissionLine.siteId].workOrders[workOrder].summary.name = siteData[transmissionLine.siteId].name;
										siteData[transmissionLine.siteId].workOrders[workOrder].summary.lineNumber = siteData[transmissionLine.siteId].lineNumber;
										
										// hard-coded for the demo
										siteData[transmissionLine.siteId].workOrders[workOrder].summary.summaryReportDownloadURL = window.location.href + "summary/Summary_Report_Line_1001.xlsx";
										
										siteData[transmissionLine.siteId].workOrders[workOrder].summary.objects = {};
										siteData[transmissionLine.siteId].workOrders[workOrder].summary.objects.transmissionLineSummary = transmissionLine;
										
										siteData[transmissionLine.siteId].workOrders[workOrder].summary.objects.structureSummary = transmissionLine.structures;
										siteData[transmissionLine.siteId].workOrders[workOrder].summary.objects.structureInspectionSummary = transmissionLine.structureInspections;
										
										dojo.forEach(_.keys(siteData[transmissionLine.siteId].workOrders[workOrder].summary.objects.structureSummary), function(id) {				
											var asset = siteData[transmissionLine.siteId].workOrders[workOrder].summary.objects.structureSummary[id];
											if (_.isNull(asset.location)) {
												siteData[transmissionLine.siteId].workOrders[workOrder].summary.objects.structureSummary[id].location = { "accuracy":null,"altitude":null, "latitude": 0, "longitude": 0 };
											}
										})
										
										siteData[transmissionLine.siteId].workOrders[workOrder].summary.data = dojo.map(_.keys(transmissionLine.structures), function(id) {
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
										
										createGridDataStore(transmissionLine.siteId, workOrder, siteData[transmissionLine.siteId].workOrders[workOrder].summary.data, "TransmissionLine");

									}
									
									var td = _.first(dojo.query(".site-download-wait." + transmissionLine.siteId));
									td.innerHTML = "<i class='fa fa-check-circle site-download-wait'></i>";
									sitesToProcess = _.without(sitesToProcess, transmissionLine.siteId);
								})
								
								if (sitesToProcess.length == 0) {
									finishDataParsing();
								}
							}
						});
					}
				})
			}
			
		});
    } else {
		dijit.byId('transmissionViewerDropDown').addOption({ label: '', value: '' });
	}
}

function finishDataParsing(){	
	window.setTimeout(function(){
		loginProgress.hide();
		window.setTimeout(function(){
			dojo.byId("loginProgressContent").innerHTML = "";
			dojo.style("loginProgressContent", "width", "auto;");
		}, 1000)
	}, 1000)

	renderWindSiteSelector();
							
	loadMapLayers();

	var extent = getQueryResultsExtent(windFeatureGraphics);
	authExtent = extent;

	var ids = dojo.filter(_.keys(siteData), function(site) { return siteData[site].type == "DistributionLine"; });
	//var ids = _.keys(siteData);
	window.setTimeout(function(){
		var id = _.first(ids);
		siteId = id;
		siteName = siteData[id].name;
		dijit.byId('siteViewerDropDown').set('value', id);
		updateWorkOrderDropdown(id);
		openViewerPanel("siteViewer"); 
		windFeatureLayer.redraw();
		
		dojo.style("mapProgressBar", "display", "none");
		
	}, 1000);	
	
}

function getUUIDs() {
	dojo.xhrGet({
		url: windAmsDwVestasUrl + "utils/uuid?count=50",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
		},
		load: function(results){
			uuids = results;
		},
		error: function(error) {
			console.log(error);
		}
	});
	
}

function getValidationTranslation(id){
	var validationDeferred = dojo.xhrGet({
		url: windAmsDwVestasUrl + "org/" + id + "/validations",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
		},
		load: function(results){
			validationJson = results;
		},
		error: function(error) {
			console.log(error);
		}
	});
	
	var translationDeferred = dojo.xhrGet({
		url: windAmsDwVestasUrl + "org/" + id + "/translations",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
		},
		load: function(results){
			translationJson = results;
		},
		error: function(error) {
			console.log(error);
		}
	});
	
	var dataDeferredList = new dojo.DeferredList([validationDeferred,translationDeferred]);
    dataDeferredList.then(function(response) {
		console.log(response);
	})
}
