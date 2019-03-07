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
var workOrderNumber;
var lasDataAvailable = null;

var siteSelectMethod = 'dialog';
var poleFilterSelect;
var transmissionFilterSelect;

var assetJsonResponse = [];
var Potree;
var viewer;
var material;

var firstImageLoad = true;
var zoomifyOver = false;
var zoomifyHotspotCurrent = null;
var zoomifyFullScreenMode = false;
var shapeMode = 'rectangle';

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
    { label: "Pole or Structure Viewer", value: "Pole or Structure Viewer" },
    { label: "Images", value: "Images"  },
    { label: "Feeder or Line Viewer", value: "Feeder or Line Viewer" },
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


var customSites = ["Duke"];
var appConfig = {
	"DistributionLine": {
		"default": {
			"ui": {
				"site-viewer-title" : "feeder",
				"site-name-header": "Feeder:",
				"site-name-width": "65px",
				"pole-criticality-header": "Horizontal Pole Loading (%):",
				"pole-criticality-width": "200px",
				"pole-criticality-field": "horizontalLoadingPercent"
			 },
			 "fields": [
				{"name":"criticality", "alias":"criticality", "width":"24px", "hidden": false, "nullValue":"NA", "property":"criticality", "dataType":"string" },
				{"name":"poleId", "alias":"Pole ID", "width":"100px", "hidden": false, "property":"utilityId", "dataType":"uid" },
				{"name":"dateOfAnalysis", "alias":"Analysis Date", "width":"105px", "hidden": false, "nullValue":" -- ", "property":"dateOfAnalysis", "dataType":"date" },
				{"name":"horizontalLoadingPercent", "alias":"Horizontal Pole Loading", "width":"150px", "hidden": false, "nullValue":" -- ", "property":"horizontalLoadingPercent", "dataType":"string" },
				{"name":"dataMergedDate", "alias":"Design Manager", "width":"105px", "hidden": false, "nullValue":" -- ", "property":"dataMergedDate", "dataType":"data" }
			],
			"property": {
				"criticality": "criticality"
			},
			"summaryClass": {
				"1":0,
				"2":0,
				"3":0,
				"4":0
			},
			"colors": {
				"NA": "#444444",
				"0": "#444444",
				"1": "#6DAFBA",
				"2": "#FFD34E",
				"3": "#F16722",
				"4": "#FB0058",
				"5": "#FB0058"
			},
			"sliderLabels": {

			}
		},
		"Duke": {
			"ui": {
				"site-viewer-title" : "circuit",
				"site-name-header": "Circuit:",
				"site-name-width": "65px",
				"pole-criticality-header": "Pole Status:",
				"pole-criticality-width": "90px",
				"pole-criticality-field": null
			},
			"fields": [
				{"name":"criticality", "alias":"criticality", "width":"24px", "hidden": false, "nullValue":"NA", "property":"status", "dataType":"string" },
				{"name":"poleId", "alias":"Pole ID", "width":"150px", "hidden": false, "property":"utilityId", "dataType":"uid" },
				{"name":"dateOfAnalysis", "alias":"Analysis Date", "width":"160px", "hidden": false, "nullValue":" -- ", "property":"dateOfAnalysis", "dataType":"date" },
				{"name":"status", "alias":"Status", "width":"160px", "hidden": false, "nullValue":"Pending", "property":"status", "dataType":"string" }
			],
			"property": {
				"criticality": "status"
			},
			"summaryClass": {
				"Processed":0,
				"PendingMerge":0,
				"Complete":0,
				"Critical":0
			},
			"colors": {
				"NA": "#444444",
				"Pending": "#444444",
				"Processed": "#FFD34E",
				"PendingMerge": "#F16722",
				"Complete": "#589D6D",
				"Critical": "#FB0058"
			},
			"sliderLabels": {

			}
		}
	},
	"TransmissionLine": {
		"default":  {
			"ui": {
				"site-viewer-title" : "line",
				"site-name-header": "Line:",
				"site-name-width": "50px",
				"pole-criticality-header": "Damage Assessment:",
				"pole-criticality-width": "155px",
				"pole-criticality-field": null
			},
			"fields": [
				{"name":"criticality", "alias":"criticality", "width":"24px", "hidden": false, "nullValue":"NA", "property":"severity", "dataType":"string" },
				{"name":"poleId", "alias":"Structure Number", "width":"241px", "hidden": false, "property":"structureNumber", "dataType":"uid" },
				{"name":"dateOfInspection", "alias":"Inspection Date", "width":"235px", "hidden": false, "nullValue":" -- ", "property":"dateOfInspection", "dataType":"date" }
			],
			"property": {
				"criticality": "severity"
			},
			"summaryClass": {
				"1":0,
				"2":0,
				"3":0
			},
			"colors": {
				"NA": "#444444",
				"0": "#F7B409",
				"1": "#6DAFBA",
				"2": "#F16722",
				"3": "#7D1940"
			},
			"sliderLabels": {
				"NA": "NA",
				"0": "NA",
				"1": "None",
				"2": "Minor",
				"3": "Critical"
			}
		}
	}
}