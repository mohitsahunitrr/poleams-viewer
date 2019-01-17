/* 
 * All rights reserved.
 */

/*
 * Recommend js files obtained from Thinbus SRP PHP Demo:
 * https://bitbucket.org/simon_massey/thinbus-php/overview
 *
 * Good overview of use can be found here:
 * https://bitbucket.org/simon_massey/thinbus-srp-js
 */

/*
 * Authenticate with InspecTools' security services.
 */
var jwe;
var sessionId;
var sessionKey;
var srpClient;

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

function authenticate(username, password) {
	
    srpClient = new SRP6JavascriptClientSessionSHA256();
    srpClient.step1(username, password);
    
	var step1ClientRequest = {
        login: username
    };
	
	dojo.xhrPost({
		url: windAmsDwUrl + 'auth/srp/step1',
		handleAs: "json",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json; charset=utf-8"
		},
		postData: JSON.stringify(step1ClientRequest),
		load: function(response) {
            var status = response.status;
            if (status === "Success") {
                authStep1Recv(response);
            } else if (status === "InvalidLogin") {
                console.log('invalid user');
                loginError('invalid');
            }
		},
		error: function(error){
			console.log(error);
            loginError();
		}
	});
}

function authStep1Recv(step1ServerResponse) {
    var credentials = srpClient.step2(step1ServerResponse.salt, step1ServerResponse.b);

    var step2ClientResponse = {
        "a":credentials.A,
        "m1":credentials.M1,
        "sessionId":step1ServerResponse.sessionId
    };
    
    dojo.xhrPost({
        url: windAmsDwUrl + 'auth/srp/step2',
        handleAs: "json",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        postData: JSON.stringify(step2ClientResponse),
        load: function(response) {
            
            var status = response.status;
            if (status === "Success") {
                authStep2Recv(response);
            } else if (status === "AuthenticationFailed") {
                console.log('wrong password');
                loginError('invalid');
            }
        },
        error: function(error){
            console.log(error);
            loginError();
        }
    });
}

function authStep2Recv(step2ServerResponse) {
	var windAmsAppId = "51a2afaf-180d-4d20-8dd9-f06e84e73583"
    authUserObject = step2ServerResponse.credentials;
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
        authUserOrg = _.first(authUserObject.organizations);
        
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
				dojo.style('bladeInspectorButtonDiv', 'display','block');
				dojo.style('bladeInspectorGridButtonDiv', 'right','220px');
			
				dojo.style('bladeInspectionReportButtonDiv', 'display', 'block');
				var display = (authUserOrg.key == "Vestas" || authUserOrg.key == "InspecToolsLLC") ? 'inline-block' : 'none';
				dojo.style('bladeInspectionWordDownload', 'display', display);
				
				dojo.style('siteImageDownload', 'display','inline-block');
				dojo.style('siteReportDownload', 'display','inline-block');
				break;
			
			case 'report':
				dojo.style('bladeInspectorButtonDiv', 'display','none');
				dojo.style('bladeInspectorGridButtonDiv', 'display','none');
			
				dojo.style('bladeInspectionReportButtonDiv', 'display', 'block');
				var display = (authUserOrg.key == "Vestas" || authUserOrg.key == "InspecToolsLLC") ? 'inline-block' : 'none';
				dojo.style('bladeInspectionWordDownload', 'display', display);
				
				dojo.style('siteImageDownload', 'display','inline-block');
				dojo.style('siteReportDownload', 'display','inline-block');
				break;
			
			case 'guest':
				dojo.style('bladeInspectorButtonDiv', 'display','none');
				dojo.style('bladeInspectorGridButtonDiv', 'display','none');
				
				dojo.style('bladeInspectionReportButtonDiv', 'display','none');
				dojo.style('siteInspectionReportButtonDiv', 'display','none');
				
				dojo.style('siteImageDownload', 'display','none');
				dojo.style('siteReportDownload', 'display','none');
				break;
		}
        
        processSitesByOrganization(authUserObject.sitesByOrganization);
    } else {
        loginError('role');
    } 
}

/* function processSitesByOrganization(sitesByOrganization) {
	if (authUserOrg.key == "InspecToolsLLC") {
		dojo.xhrGet({
			url: windAmsDwUrl + 'site',
			handleAs: "json",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json; charset=utf-8"
			},
			load: function(response) {
				parseSites(response);
			},
			error: function(error){
				console.log(error);
			}
		});
	} else {
		parseSites(sitesByOrganization);
	}
    getUserNames();
}

function parseSites(sites) {
    
    dojo.empty("windSiteSelectInnerContent");
    
	var options = dijit.byId('siteViewerDropDown').getOptions();
    dijit.byId('siteViewerDropDown').removeOption(options);
    dijit.byId('siteViewerDropDown').addOption({ label: '', value: '' });
    
    var siteList  = _.flatten(_.values(sites));
    if (siteList.length > 0) {
        var values = dojo.map(siteList , function(site) { return site.name; });
        values.sort();
        
        var siteDeferreds = dojo.map(values, function(value) { return getWindSiteIdByName(value); });    
        var siteDeferredList = new dojo.DeferredList(siteDeferreds);
        siteDeferredList.then(function(results) {
            var siteDeferreds = [];
            dojo.forEach(results, function(site) {
                if (site[1]) { 
                    siteData[site[1].name] = {};
                    siteData[site[1].name].id = site[1].id;
                    var siteDeferred = getWindSiteWorkOrders(site[1].id);
                    siteDeferreds.push(siteDeferred);
                }
            });
            
            if (siteDeferreds.length > 0) {
                var siteDeferredList = new dojo.DeferredList(siteDeferreds);
                siteDeferredList.then(function(response) { 
                    dojo.forEach(response, function(site, i) {
                        if (site[1] && site[1].length > 0) {
                            dojo.forEach(site[1], function(workOrder){
                                var data = _.pick(siteData,function(value,key,object) {
                                    if (value.id == workOrder.siteId) { return true; }
                                });
                                var name = _.first(_.keys(data));
                                
                                if (_.isUndefined(siteData[name].workOrders)) {
                                    siteData[name].workOrders = {};
                                }
                                
                                if (!_.isNull(workOrder.orderNumber)) {
                                    siteData[name].workOrders[workOrder.orderNumber] = {};
                                    siteData[name].workOrders[workOrder.orderNumber].description = workOrder.description;
                                    siteData[name].workOrders[workOrder.orderNumber].type = workOrder.type;
                                    siteData[name].workOrders[workOrder.orderNumber].timestamp = (workOrder.requestDate && !_.isNull(workOrder.requestDate)) ? convertDate(workOrder.requestDate, 'viewer') : null;
                                    siteData[name].workOrders[workOrder.orderNumber].data = [];
                                    if (_.isNull(dojo.byId(name))) {
                                        var containerNode = dojo.create("div",null, "windSiteSelectInnerContent", "last");
                                         dojo.addClass(containerNode, "windSiteSelectorItemContainer");
                                         
                                         var node = dojo.create("div",{ 
                                            "id": name,
                                            "innerHTML": name,
                                         }, containerNode, "last");
                                        dojo.addClass(node, "windSiteSelectorItem");
                                        
                                        dojo.connect(node, "onclick", function(){ 
                                            chooseWindSite(this.id); 
                                        })
                                        dojo.connect(node, "onmouseover", function(){ 
                                            hoverSiteSelector(this.id, 'over'); 
                                        })
                                        dojo.connect(node, "onmouseout", function(){ 
                                            hoverSiteSelector(this.id, 'out'); 
                                        })
                                        var option = { label: name, value: name };
                                        dijit.byId('siteViewerDropDown').addOption(option);
                                        
                                        var site = _.first(dojo.filter(siteList, function(s) { return s.name == name; }));
                                        authSites.push(site);
                                    }

									var data = {
										"siteId": siteData[name].id,
										"orderNumber": workOrder.orderNumber,
										"status":"Released"
									};
									var assetInspectionDeferred = dojo.xhrPost({
										url: windAmsDwUrl + "assetInspection/search",
										handleAs: "json",
										headers: {
											"Accept": "application/json",
											"Content-Type": "application/json"
										},
										postData: JSON.stringify(data),
										load: function(response) {
											siteData[name].workOrders[workOrder.orderNumber].inspected = dojo.map(response,function(asset){
												return asset.assetId;
											});
										},
										error: function(error){
											console.log(error);
										}
									});
                                    
                                }
                            });
                            
                        };
                    });
                    renderWindSiteSelector();
                    loadMapLayers();
                });
                
            } else {
                var node = dojo.create("div",{ id: site[1].name }, "windSiteSelectInnerContent", "last");
                dojo.attr(node, "innerHTML", "No authorized sites");
                dojo.addClass(node, "windSiteSelectorItem");
                renderWindSiteSelector();
                
                windTileLayer.hide();
                windCanadaLayer.hide();
            }
        });
    } else {
        var node = dojo.create("div",{ id: site[1].name }, "windSiteSelectInnerContent", "last");
        dojo.attr(node, "innerHTML", "No authorized sites");
        dojo.addClass(node, "windSiteSelectorItem");
        renderWindSiteSelector();
                
        windTileLayer.hide();
        windCanadaLayer.hide();
    }
}

function getUserNames(){
	var userDeferred = dojo.xhrGet({
		url: windAmsDwUrl + "user/names",
		handleAs: "json",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		load: function(results){
			userNames = results;
		},
		error: function(error) {
			console.log(error);
		}
	});
} */
