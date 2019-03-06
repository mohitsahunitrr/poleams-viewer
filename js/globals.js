var serviceApiUrl = apiUrl_config[window.location.hostname];

dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.TitlePane");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.Select");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.TooltipDialog");
dojo.require("dijit.Tooltip");
dojo.require("dijit.Dialog");
dojo.require("dijit.popup");
dojo.require("dijit.ProgressBar");
dojo.require('dijit.form.CheckBox');
dojo.require('dijit.form.ComboBox');
dojo.require('dijit.form.RadioButton');
dojo.require('dijit.form.Textarea');
dojo.require('dijit.form.FilteringSelect');
dojo.require('dijit.form.TextBox');
dojo.require('dijit.form.ValidationTextBox');
dojo.require('dijit.form.DateTextBox');
dojo.require('dijit.form.TimeTextBox');
dojo.require('dijit.form.HorizontalSlider');
dojo.require('dijit.form.HorizontalRule');
dojo.require('dijit.form.HorizontalRuleLabels');
dojo.require('dijit.form.NumberTextBox');
dojo.require('dijit.form.NumberSpinner');
dojo.require('dijit.focus');

dojo.require("dojo.fx");
dojo.require("dojo.fx.Toggler")
dojo.require("dojox.fx");
dojo.require("dojox.widget.TitleGroup")
dojo.require("dojox.grid.DataGrid");
dojo.require("dojox.layout.FloatingPane");
dojo.require("dojox.layout.ResizeHandle");

dojo.require("dojo.request.xhr");
dojo.require("dojo.request.script");
dojo.require("dojo.DeferredList");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojo.dnd.move");
dojo.require("dojo.dom-geometry");
dojo.require("dojo.cookie");
dojo.require("dojo.sniff");
dojo.require("dojo.has");
dojo.require("dojo.date");
dojo.require("dojo.date.locale");
dojo.require("dojo.number");

dojo.require("esri.map");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.virtualearth.VETiledLayer");
dojo.require("esri.renderer");
dojo.require("esri.layers.LayerDrawingOptions");
dojo.require("esri.symbols.PictureMarkerSymbol");

var map, veSatelliteTileLayer, veRoadTileLayer, windFeatureLayer, initialExtent, tooltip, symbol;

var inspectionEventsJsonResponse;
var inspectionEventsJson;

var date = new Date();
var currentDate = (((date.getMonth())<9) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1))  + "-" + ((date.getDate()<10) ? "0" + date.getDate() : date.getDate()) + "-" + date.getFullYear();

var aboutVersion = "1.10.01"
var aboutYearStart = 2018;
var aboutYearEnd = date.getFullYear();

var authUserObject = {};
var authUser = "";
var authUserId = "";
var authRole = "";
var authSites = [];
var authRoles = [];
var authUserOrg = [];
var authUserOrgKey = null;
var authExtent;
var authRequest = {};
var userNames = {};
var uuids = [];
var siteOrgs = {};

var siteData = {};
var sitesToProcess = [];
var siteName;
var siteId;
var siteView = "DistributionLine";
var turbineId;
var turbineName;
var turbineInspectionDate;
var workOrderNumber;
var lasDataAvailable = null;

var inspectionStatus = {
	"InspectionInProcess":[],
	"InspectionApproved":[],
	"InspectionSubmitted":[],
	"InspectionCompleted":[]
	
};

var siteSelectMethod = 'dialog';
var clearFilter = false;
var poleFilterSelect;
var transmissionFilterSelect;

var firstImageLoad = true;
var zoomifyOver = false;
var zoomifyHotspotCurrent = null;
var zoomifyFullScreenMode = false;
var shapeMode = 'rectangle';

var severityColors = {
	"-9999": "#444444",
	"-1": "#444444",
    "NA": "#444444",
	"0": "#444444",
	"1": "#6DAFBA",
	"2": "#FFD34E",
	"3": "#F16722",
	"4": "#FB0058",
	"5": "#FB0058"
};

var dukeSeverityColors = {
	"NA": "#444444",
	"Pending": "#444444",
	"Processed": "#FFD34E",
	"PendingMerge": "#F16722",
	"Complete": "#589D6D",
	"Critical": "#FB0058"
}

var transmissionSeverityColors = {
    "NA": "#444444",
	"0": "#F7B409",
	"1": "#6DAFBA",
	"2": "#F16722",
	"3": "#7D1940",
}

var hotSpotColors = transmissionSeverityColors;

var transmissionSeverityLabels = {
    "NA": "NA",
	"0": "NA",
	"1": "None",
	"2": "Minor",
	"3": "Critical",
}

var legendMessages = {
	"severity0":"No issue",
	"severity1":"Minimal issue noted",
	"severity2":"Issue noted that does not require immediate attention",
	"severity3":"Issue noted that should be monitored and potentially repaired during next repair cycle",
	"severity4":"Significant issue that should be addressed as soon as possible",
	"severity5":"Turbine should be taken offline and remain offline until issue is addressed"
}

var reportTypeOptions = [
	{ label: "New Feature or Enhancement", value: "request" },
	{ label: "General Feedback", value: "feedback" },
    { label: "Defect or Issue", value: "bug"  }
];

var elementTypeOptions = [
    { label: "Asset Viewer", value: "Asset Viewer"  },
    { label: "Asset Inspector", value: "Asset Inspector" },
    { label: "Asset Images", value: "Asset Images"  },
    { label: "Site Viewer", value: "Site Viewer" },
    { label: "Reports", value: "Report" },
    { label: "Map", value: "Map" },
    { label: "Other", value: "Other" }
]

var severityTypeOptions = [
	{ label: "Minor", value: "Minor"  },
	{ label: "Major", value: "Major" },
    { label: "Severe", value: "Severe" }
];

var priorityTypeOptions = [
	{ label: "Low", value: "Low"  },
    { label: "High", value: "High"  },
	{ label: "Critical", value: "Critical" }
];

var criticalClasses = {
	"distribution": {
		"default": {
			"1":0,
			"2":0,
			"3":0,
			"4":0
		},
		"Duke": {
			"Processed":0,
			"PendingMerge":0,
			"Complete":0,
			"Critical":0
		}
	},
	"transmission":{
		"1":0,
		"2":0,
		"3":0
	}
}

var gridFields = {
	"DistributionLine": {
		"default": [
			{"name":"criticality", "alias":"criticality", "width":"24px", "hidden": false },
			{"name":"poleId", "alias":"Pole ID", "width":"100px", "hidden": false },
			{"name":"dateOfAnalysis", "alias":"Analysis Date", "width":"105px", "hidden": false },
			{"name":"horizontalLoadingPercent", "alias":"Horizontal Pole Loading", "width":"150px", "hidden": false },
			{"name":"dataMergedDate", "alias":"Design Manager", "width":"105px", "hidden": false }
		],
		"Duke": [
			{"name":"criticality", "alias":"criticality", "width":"24px", "hidden": false },
			{"name":"poleId", "alias":"Pole ID", "width":"150px", "hidden": false },
			{"name":"dateOfAnalysis", "alias":"Analysis Date", "width":"160px", "hidden": false },
			{"name":"status", "alias":"Status", "width":"160px", "hidden": false }
		]
	},
	"TransmissionLine": [
		{"name":"criticality", "alias":"criticality", "width":"24px", "hidden": false },
		{"name":"poleId", "alias":"Structure Number", "width":"241px", "hidden": false },
        {"name":"dateOfInspection", "alias":"Inspection Date", "width":"235px", "hidden": false }
	]
};

var assetJsonResponse = [];
var Potree;
var viewer;
var material;