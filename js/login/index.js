// Enter Global Config Values & Instantiate ADAL AuthenticationContext
var config = {
    instance: 'https://login.microsoftonline.com/',
    tenant: '4b07043f-40ce-464d-8715-8e2a4fd8d7d1',
    clientId: 'd5a9412a-721f-4de9-9a3d-f0f5b456811f', // Change for Localhost Dev
    postLogoutRedirectUri: "https://windamsdev.vestas.inspectools.net", // Change for Localhost Dev
    cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
};
var authContext = new AuthenticationContext(config);
var webserviceClientId = "17722449-ef2e-4adc-ad1d-8b7ead334ec9";

// Check For & Handle Redirect From AAD After Login
var isCallback = authContext.isCallback(window.location.hash);
authContext.handleWindowCallback();
$("#errorMessage").html(authContext.getLoginError());

if (isCallback && !authContext.getLoginError()) {
    window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
}

/*
 * error_description	string	error description returned from AAD if token request fails.
 * token				string	token returned from AAD if token request is successful.
 * error				string	error message returned from AAD if token request fails.
 */
function tokenObtained(error_description, token, error) {
	if (error) {
		$("#errorMessage").html(error_description);
		$("#accessToken").val("");
        $("#sitesDiv").hide();
	} else {
		$("#accessToken").val(token);
		$("#errorMessage").html("");
        $("#sitesList").val("");
        $("#sitesDiv").show();
	}
}

// Register Click Handlers
$("#dosignin").click(function () {
    authContext.login();
});
$("#dosignout").click(function () {
    authContext.logOut();
});
$("#obtainToken").click(function () {
//	authContext.acquireTokenPopup("8576f635-4684-4f06-8a6a-935f3aadb03c", "", "", tokenObtained);
	authContext.acquireToken(webserviceClientId, tokenObtained);
});
$("#sitesButton").click(function () {
    $("#errorMessage").html("");
    $("#sitesList").val("");
    // Get ExtUserCredentials from ${server_base}/auth/credentials
    // Same data structure as the old SRP2 return.
    $.ajax({
        url: 'https://servicesdev.vestas.inspectools.net/auth/credentials',
        type: 'GET',
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            sep = "";
            txt = "";
            for (var orgid in data.sitesByOrganization) {
                for (var i in data.sitesByOrganization[orgid]) {
                    txt = txt + sep + data.sitesByOrganization[orgid][i];
                    sep = ", ";
                }
            }
            $("#sitesList").val(txt);
        },
        error: function() {
            $("#errorMessage").html("Error authenticating against WindAMS API.");
        },
        beforeSend: setAccessHeader
    });
})
// Check Login Status, Update UI
var user = authContext.getCachedUser();
if (user) {
    $("#userId").html(user.profile.oid);
    $("#userLogin").html(user.userName);
    $("#userName").html(user.profile.name);
    $("#userdisplay").show();
    $("#accessToken").empty();
    $("#expiresOn").empty();
    $("#dosignin").hide();
    $("#dosignout").show();
} else {
    $("#userId").empty();
    $("#userLogin").empty();
    $("#userName").empty();
    $("#accessToken").empty();
    $("#expiresOn").empty();
    $("#userdisplay").hide();
    $("#dosignin").show();
    $("#dosignout").hide();
}
if (authContext.getLoginError()) {
	$("#errorMessage").html(authContext.getLoginError());
} else {
	$("#errorMessage").empty();
}

function setAccessHeader(xhr) {
    var auth = 'Bearer ' + $("#accessToken").val();
    xhr.setRequestHeader('Authorization', auth);
}
