dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.TitlePane");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.Select");
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
dojo.require("esri.dijit.HomeButton")
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.virtualearth.VETiledLayer");
dojo.require("esri.renderer");
dojo.require("esri.layers.LayerDrawingOptions");
dojo.require("esri.symbols.PictureMarkerSymbol");

var map, veSatelliteTileLayer, veRoadTileLayer, windTileLayer, windFeatureLayer, initialExtent, tooltip, homeButton, symbol, highlightSymbol, bladeViewerOffset, tooltip, turbineBladeInspectionRecords;

var bladeViewerPosition = {"top": "20px", "left": "20px"}
var turbineBladeInspectionFields = ["BLADE", "SERIAL", "SEVERITY", "TYPE", "SURFACE", "ROOT_DIST", "LE_DIST", "OBSERVATION", "IMAGES_GRID"];
var turbineFields = ["TURBINE_ID", "INSPECTION_DATE", "MANUFACTURER", "MODEL", "MW_TURBINE", "ON_YEAR", "TOWER_HT", "TOTAL_HT", "BLADE_LEN", "ROTOR_DIA", "ROTOR_S_A","SeverityScore","InspectionEvents"];
var overViewGridConnections = [];
var inspectionEventsJsonResponse;
var imageJsonResponse;

var imageJson;
var inspectionEventsJson;

var date = new Date();
var currentDate = (((date.getMonth())<9) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1))  + "-" + ((date.getDate()<10) ? "0" + date.getDate() : date.getDate()) + "-" + date.getFullYear();

var aboutVersion = "1.9.01"
var aboutYearStart = 2014;
var aboutYearEnd = date.getFullYear();

var authUserObject = {};
var authUser = "";
var authUserId = "";
var authRole = "";
var authSites = [];
var authRoles = [];
var authUserOrg = [];
var authExtent;
var authRequest = {};
var userNames = {};
var uuids = [];

var siteData = {};
var sitesToProcess = [];
var sitesAreProcess = [];
var siteName;
var siteId;
var siteView = "DistributionLine";
var turbineId;
var turbineName;
var turbineSiteViewerIndex;
var turbineInspectionDate;
var workOrderNumber;

var inspectionStatus = {
	"InspectionInProcess":[],
	"InspectionApproved":[],
	"InspectionSubmitted":[],
	"InspectionCompleted":[]
	
};

var siteSelectMethod = 'dialog';
var clearFilter = false;

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
	"5": "#7D1940"
};

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
    { label: "Blade Viewer", value: "Blade Viewer"  },
    { label: "Blade Inspector", value: "Blade Inspector" },
    { label: "Blade Images", value: "Blade Images"  },
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

var eventHandles = {};

var skinTemplate = {
    "default": {
        "windams": "windams_viewer_text",
        "logo": "none",
        "url": "http://www.inspectools.com",
        "css": {
            "header": {
                "background": "#1a1a1a",
                "color": "#ffffff"
            },
            "sign-in": {
                "background": "#1a1a1a",
                "color": "#adafaf",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "right": "20px",
                "mouseOverBackground": "#2a2a2a",
                "mouseOverColor": "#ffffff",
            },
            "current-user": {
                "color": "#adafaf",
                "right":"105px"
            },
            "loginDiv": {
                "background": "#2a2a2a",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "borderBottom": "2px solid #3d3d3d",
                "right":"20px"
            },
            "headerRightDiv": {
                "width": "204px",
                "background": "#1a1a1a",
                "mouseOverBackground": "#2a2a2a",
                "display": "none"
            }
        }
    },
    "InspecToolsLLC": {
        "windams": "windams_viewer_text",
        "logo": "url(../images/logos/inspectools_logo.png)",
        "url":"http://www.inspectools.com",
        "css": {
            "header": {
                "background": "#1a1a1a",
                "color": "#ffffff"
            },
            "sign-in": {
                "background": "#1a1a1a",
                "color": "#adafaf",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "right":"205px",
                "mouseOverBackground": "#2a2a2a",
                "mouseOverColor": "#ffffff",
            },
            "current-user": {
                "color": "#adafaf",
                "right":"290px"
            },
            "loginDiv": {
                "background": "#2a2a2a",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "borderBottom": "2px solid #3d3d3d",
                "right":"205px"
            },
            "headerRightDiv": {
                "width": "204px",
                "background": "#1a1a1a",
                "mouseOverBackground": "#2a2a2a",
                "display": "block"
            }
        }
    },
    "Vestas": {
        "windams": "windams_viewer_text",
        "logo": "url(../images/logos/vestas_logo.png)",
         "url":"http://www.vestas.com",
        "css": {
            "header": {
                "background": "#1a1a1a",
                "color": "#ffffff"
            },
            "sign-in": {
                "background": "#1a1a1a",
                "color": "#adafaf",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "right": "155px",
                "mouseOverBackground": "#2a2a2a",
                "mouseOverColor": "#ffffff",
            },
            "current-user": {
                "color": "#adafaf",
                "right": "240px"
            },
            "loginDiv": {
                "background": "#2a2a2a",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "borderBottom": "2px solid #3d3d3d",
                "right":"155px"
            },
            "headerRightDiv": {
                "width": "150px",
                "background": "#1a1a1a",
                "mouseOverBackground": "#2a2a2a",
                "display": "block"
            }
        }
    },
    "Siemens": {
        "windams": "windams_viewer_text",
        "logo": "url(../images/logos/martek_logo.png)",
        "url":"http://www.martek-marine.com",
        "css": {
            "header": {
                "background": "#1a1a1a",
                "color": "#ffffff"
            },
            "sign-in": {
                "background": "#1a1a1a",
                "color": "#adafaf",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "right": "205px",
                "mouseOverBackground": "#2a2a2a",
                "mouseOverColor": "#ffffff",
            },
            "current-user": {
                "color": "#adafaf",
                "right": "290px"
            },
            "loginDiv": {
                "background": "#2a2a2a",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "borderBottom": "2px solid #3d3d3d",
                "right":"205px"
            },
            "headerRightDiv": {
                "width": "204px",
                "background": "#1a1a1a",
                "mouseOverBackground": "#2a2a2a",
                "display": "block"
            }
        }
    },
    "Martek Marine": {
        "windams": "windams_viewer_text",
        "logo": "url(../images/logos/martek_logo.png)",
        "url":"http://www.martek-marine.com",
        "css": {
            "header": {
                "background": "#1a1a1a",
                "color": "#ffffff"
            },
            "sign-in": {
                "background": "#1a1a1a",
                "color": "#adafaf",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "right": "205px",
                "mouseOverBackground": "#2a2a2a",
                "mouseOverColor": "#ffffff",
            },
            "current-user": {
                "color": "#adafaf",
                "right": "290px"
            },
            "loginDiv": {
                "background": "#2a2a2a",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "borderBottom": "2px solid #3d3d3d",
                "right":"205px"
            },
            "headerRightDiv": {
                "width": "204px",
                "background": "#1a1a1a",
                "mouseOverBackground": "#2a2a2a",
                "display": "block"
            }
        }
    },
    "Windetect": {
        "windams": "windams_viewer_text",
        "logo": "url(../images/logos/windetect_logo.png)",
        "url":"http://windetect.co.kr",
        "css": {
            "header": {
                "background": "#1a1a1a",
                "color": "#ffffff"
            },
            "sign-in": {
                "background": "#1a1a1a",
                "color": "#adafaf",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "right": "205px",
                "mouseOverBackground": "#2a2a2a",
                "mouseOverColor": "#ffffff",
            },
            "current-user": {
                "color": "#adafaf",
                "right": "290px"
            },
            "loginDiv": {
                "background": "#2a2a2a",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "borderBottom": "2px solid #3d3d3d",
                "right":"205px"
            },
            "headerRightDiv": {
                "width": "204px",
                "background": "#1a1a1a",
                "mouseOverBackground": "#2a2a2a",
                "display": "block"
            }
        }
    },
    "Aerial Vision": {
        "windams": "windams_viewer_text",
        "logo": "url(../images/logos/aerial_vision_logo.png)",
        "url":"http://aerialvision.co.uk/",
        "css": {
            "header": {
                "background": "#1a1a1a",
                "color": "#ffffff"
            },
            "sign-in": {
                "background": "#1a1a1a",
                "color": "#adafaf",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "right": "205px",
                "mouseOverBackground": "#2a2a2a",
                "mouseOverColor": "#ffffff",
            },
            "current-user": {
                "color": "#adafaf",
                "right": "290px"
            },
            "loginDiv": {
                "background": "#2a2a2a",
                "borderLeft": "2px solid #3d3d3d",
                "borderRight": "2px solid #3d3d3d",
                "borderBottom": "2px solid #3d3d3d",
                "right":"205px"
            },
            "headerRightDiv": {
                "width": "204px",
                "background": "#1a1a1a",
                "mouseOverBackground": "#2a2a2a",
                "display": "block"
            }
        }
    } 
}

var authUserSkin = skinTemplate["default"];

var authUserDamageOptionWhiteList = {
    "default":["Component","Composite","Miscellaneous"],
    "InspecToolsLLC":["Component","Composite","Miscellaneous"]
}
var authUserFilterOptionWhiteList = {
    "default":{
        "Component": ["Blade Collar","Diverter Strips","Drain Hole","Gurney Flap","ID Plate","LE Tape","Lightning Receptors","Spoiler","Stall Strip","Vortex Generators","Other"],
        "Composite":["Charring","Chordwise Crack","Crazing","Crush","Debonding","Delamination","Dry Fiber","Erosion","Exposed Core","Exposed Laminate","Flagging","Hole","Lightning Strike","Old Repair","Pitting","Repair Failure","Scratch","Spar Damage","Spider Cracks","Split","Stress Crack","Thin Topcoat","Top-coat Flaking","Other"],
        "Miscellaneous":["Dirty or Heavy Insect","Fluid Ingression","Grease","Mold","Surface Staining","Other"]
    },
    "InspecToolsLLC": {
        "Component": ["Blade Collar","Diverter Strips","Drain Hole","Gurney Flap","ID Plate","LE Tape","Lightning Receptors","Spoiler","Stall Strip","Vortex Generators","Other"],
        "Composite":["Charring","Chordwise Crack","Crazing","Crush","Debonding","Delamination","Dry Fiber","Erosion","Exposed Core","Exposed Laminate","Flagging","Hole","Lightning Strike","Old Repair","Pitting","Repair Failure","Scratch","Spar Damage","Spider Cracks","Split","Stress Crack","Thin Topcoat","Top-coat Flaking","Other"],
        "Miscellaneous":["Dirty or Heavy Insect","Fluid Ingression","Grease","Mold","Surface Staining","Other"]
    }
}
var authUserSurfaceOptionWhiteList = {
    "default":["Leading Edge" ,"Trailing Edge","High Pressure Side","Low Pressure Side","Both Shells", "Tower","Nose Cone","Spinner, Shroud, or Hub","Nacelle"],
    "InspecToolsLLC":["Leading Edge" ,"Trailing Edge","High Pressure Side","Low Pressure Side","Both Shells", "Tower","Nose Cone","Spinner, Shroud, or Hub","Nacelle"]
}

var assetJsonResponse = [];
var Potree;
var viewer;
var material;