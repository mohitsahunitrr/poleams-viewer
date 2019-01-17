displayFields = ["subStationSummary.name", "subStationSummary.feederNumber", "poleSummary.fplid", "poleSummary.type", "poleSummary.length", "poleSummary.poleClass","poleSummary.framing", "poleSummary.equipmentType",  "poleSummary.numberOfPhases", "poleSummary.location.latitude", "poleSummary.location.longitude", "poleInspectionSummary.horizontalLoadingPercent"];

translationJson = {
	"id": "7efe4d05-d7f0-4d44-87c1-4c64f2350638",
	"organizationId": "a02e9505-a862-4d65-bad8-6c5559996213",
	"languageCode": "en",
	"languageName": "English",
	"countryCode": "US",
	"countryName": "United States",
	"version": 1,
	"updated": "20181218",
	"name": "Florida Light and Power",
	"logoURLs": {
		
	},
	"errors": {
		"maxValue": "{label} must be less than or equal to {maxValue}.",
		"maxLength": "{label} must be no more than {maxLength} characters in length.",
		"minLength": "{label} must be at least {minLength} characters in length.",
		"required": "{label} is required.",
		"listValuesOnly": "The value {value} does not exist in the list of acceptable values for {label}.",
		"minValue": "{label} must be greater than or equal to {minValue}."
	},
	"fields": {
		"feederInspectionSummary.feederNumber": {
			"dependent": null,
			"key": "feederInspectionSummary.feederNumber",
			"label": "Feeder",
			"description": "The feeder coming into the substation.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"feederInspectionSummary.name": {
			"dependent": null,
			"key": "feederInspectionSummary.name",
			"label": "feeder",
			"description": "The name of the substation.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.anchor[].bearing": {
			"dependent": null,
			"key": "poleSummary.anchor[].bearing",
			"label": "Guy {index} Bearing",
			"description": "The Guy Bearing",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.anchor[].diameter": {
			"dependent": null,
			"key": "poleSummary.anchor[].diameter",
			"label": "Guy {index} Diameter",
			"description": "The Guy Diameter",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.anchor[].leadLength": {
			"dependent": null,
			"key": "poleSummary.anchor[].leadLength",
			"label": "Guy {index} Lead Length",
			"description": "The Guy Lead Length",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.anchor[].type": {
			"dependent": null,
			"key": "poleSummary.anchor[].type",
			"label": "Guy {index} Assc",
			"description": "The Guy Assc",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.caTVAttachments[].diameter": {
			"dependent": null,
			"key": "poleSummary.caTVAttachments[].diameter",
			"label": "CATV {index} Attach Diameter",
			"description": "The diameter of the attached CATV cable.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.caTVAttachments[].height": {
			"dependent": null,
			"key": "poleSummary.caTVAttachments[].height",
			"label": "CATV {index} Attach Height",
			"description": "The height at which the CATV cable is attached.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.circuit1SpanLength1": {
			"dependent": null,
			"key": "poleSummary.switchNumber",
			"label": "Circuit 1 Span Length (1)",
			"description": "Circuit 1 Span Length (1)",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.circuit1SpanLength2": {
			"dependent": null,
			"key": "poleSummary.switchNumber",
			"label": "Circuit 1 Span Length (2)",
			"description": "Circuit 1 Span Length (2)",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.equipmentQuantity": {
			"dependent": null,
			"key": "poleSummary.equipmentQuantity",
			"label": "Equip Quan.",
			"description": "The quantity of equipment installed on the pole.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.equipmentType": {
			"dependent": null,
			"key": "poleSummary.equipmentType",
			"label": "Equip Type",
			"description": "The type of equipment installed on the pole.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.utilityId": {
			"dependent": null,
			"key": "poleSummary.utilityId",
			"label": "Pole ID",
			"description": "Pole ID.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.framing": {
			"dependent": null,
			"key": "poleSummary.framing",
			"label": "Framing",
			"description": "The framing installed on the pole.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.id": {
			"dependent": null,
			"key": "poleSummary.id",
			"label": "Pole Number",
			"description": "Pole Number",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.length": {
			"dependent": null,
			"key": "poleSummary.height",
			"label": "Pole Height",
			"description": "Height of the pole.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.location.latitude": {
			"dependent": null,
			"key": "poleSummary.location.latitude",
			"label": "Latitude",
			"description": "The latitude where the pole is located.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.location.longitude": {
			"dependent": null,
			"key": "poleSummary.location.longitude",
			"label": "Longitude",
			"description": "The longitude where the pole is located.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.multiplexType": {
			"dependent": null,
			"key": "poleSummary.multiplexType",
			"label": "Multiplex Type",
			"description": "Multiplex Type",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.neutralWireType": {
			"dependent": null,
			"key": "poleSummary.neutralWireType",
			"label": "Neutral Wire Type",
			"description": "The type of the neutral wire.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.numberOfCATVAttachments": {
			"dependent": null,
			"key": "poleSummary.numberOfCATVAttachments",
			"label": "No CATV Attachments",
			"description": "The number of Cable TV attachments on the pole.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.numberOfOpenWires": {
			"dependent": null,
			"key": "poleSummary.numberOfOpenWires",
			"label": "# of Open Wires",
			"description": "The number of open wires.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.numberOfPhases": {
			"dependent": null,
			"key": "poleSummary.numberOfPhases",
			"label": "Num of Phases",
			"description": "The number of phases of the primary span on the pole.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.numberOfTelComAttachments": {
			"dependent": null,
			"key": "poleSummary.numberOfTelComAttachments",
			"label": "No Telecom Attached",
			"description": "The number of Telecom attachments on the pole.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.openWireType": {
			"dependent": null,
			"key": "poleSummary.openWireType",
			"label": "Open Wire Type",
			"description": "The type of the open wire.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.owner": {
			"dependent": null,
			"key": "poleSummary.owner",
			"label": "Owner",
			"description": "The owner the pole.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.poleClass": {
			"dependent": null,
			"key": "poleSummary.poleClass",
			"label": "Pole Class",
			"description": "The class of pole.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.primaryWireType": {
			"dependent": null,
			"key": "poleSummary.primaryWireType",
			"label": "Primary Wire Type",
			"description": "The type of the primary wire.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.pullOff1SpanLength1": {
			"dependent": null,
			"key": "poleSummary.pullOff1SpanLength1",
			"label": "Pull Off 1 Span Length (1)",
			"description": "Pull Off 1 Span Length (1)",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.pullOff2SpanLength2": {
			"dependent": null,
			"key": "poleSummary.pullOff2SpanLength2",
			"label": "Pull Off 2 Span Length (2)",
			"description": "Pull Off 2 Span Length (2)",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.risers[]": {
			"dependent": null,
			"key": "poleSummary.risers[]",
			"label": "Riser Type {index}",
			"description": "Riser type.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.streetLight": {
			"dependent": null,
			"key": "poleSummary.streetLight",
			"label": "Streetlight",
			"description": "Streetlight",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.switchNumber": {
			"dependent": null,
			"key": "poleSummary.switchNumber",
			"label": "Switch Number",
			"description": "Switch Number.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.telCommAttachments[].diameter": {
			"dependent": null,
			"key": "poleSummary.caTVAttachments[].diameter",
			"label": "TELCO {index} Attach Diameter",
			"description": "The diameter of the attached Telcomm cable.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.telCommAttachments[].height": {
			"dependent": null,
			"key": "poleSummary.caTVAttachments[].height",
			"label": "TELCO {index} Attach Height",
			"description": "The height at which the Telcomm cable is attached.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.totalSizeCATV": {
			"dependent": null,
			"key": "poleSummary.totalSizeCATV",
			"label": "Total Size CATV",
			"description": "Total size CATV.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.totalSizeTelCom": {
			"dependent": null,
			"key": "poleSummary.totalSizeTelCom",
			"label": "Total Size Telecom",
			"description": "Total size TelComm.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.tlnCoordinate": {
			"dependent": null,
			"key": "poleSummary.tlnCoordinate",
			"label": "TLN Coordinate",
			"description": "TLN Coordinate.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleSummary.type": {
			"dependent": null,
			"key": "poleSummary.type",
			"label": "Type",
			"description": "The type of pole.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleInspectionSummary.access": {
			"dependent": null,
			"key": "poleInspectionSummary.access",
			"label": "Access",
			"description": "Access to pole.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleInspectionSummary.passedAnalysis": {
			"dependent": null,
			"key": "poleInspectionSummary.passedAnalysis",
			"label": "Pass",
			"description": "Pass or fail judgment on analysis results.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleInspectionSummary.criticality": {
			"dependent": null,
			"key": "poleInspectionSummary.criticality",
			"label": "Criticality",
			"description": "The criticality of the pole in terms of needing upgrades. 1 - 5, 5 being most critical.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleInspectionSummary.horizontalLoadingPercent": {
			"dependent": null,
			"key": "poleInspectionSummary.horizontalLoadingPercent",
			"label": "Horizontal Pole Loading",
			"description": "The current wind rating for the pole.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleInspectionSummary.latLongDelta": {
			"dependent": null,
			"key": "poleInspectionSummary.latLongDelta",
			"label": "Lat, Long Delta (ft)",
			"description": "The difference between expected and actual location, in feet.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"poleInspectionSummary.loadCase.wind": {
			"dependent": null,
			"key": "poleInspectionSummary.loadCase.wind",
			"label": "Wind Zone",
			"description": "The maximum wind speed.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"resource.position.side": {
			"dependent": null,
			"key": "resource.position.side",
			"label": "Location",
			"description": "The location being inspected.",
			"listValues": [{
				"label": "A Base",
				"value": "ABase",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "A Leg",
				"value": "ALeg",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "A Middle",
				"value": "AMiddle",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "A Top",
				"value": "ATop",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "B Base",
				"value": "BBase",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "B Leg",
				"value": "BLeg",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "B Middle",
				"value": "BMiddle",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "B Top",
				"value": "BTop",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "C Base",
				"value": "CBase",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "C Leg",
				"value": "CLeg",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "C Middle",
				"value": "CMiddle",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "C Top",
				"value": "CTop",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "D Base",
				"value": "DBase",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "D Leg",
				"value": "DLeg",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "D Middle",
				"value": "DMiddle",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "D Top",
				"value": "DTop",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "Overview",
				"value": "Overview",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "X-Arms Bottom Left Phase",
				"value": "XABL",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "X-Arms Bottom Right Phase",
				"value": "XABR",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "X-Arms Middle Inside Phase",
				"value": "XAMI",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "X-Arms Middle Left Phase",
				"value": "XAML",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "X-Arms Middle Right Phase",
				"value": "XAMR",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "X-Arms Top Left Phase",
				"value": "XATL",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "X-Arms Top Right Phase",
				"value": "XATR",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			}],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionLineInspectionSummary.dateOfInspection": {
			"dependent": null,
			"key": "transmissionLineInspectionSummary.dateOfInspection",
			"label": "Inspection Date",
			"description": "The date the inspection was done.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionLineInspectionSummary.orderNumber": {
			"dependent": null,
			"key": "transmissionLineInspectionSummary.orderNumber",
			"label": "Order Number",
			"description": "Work order number",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionLineInspectionSummary.processedBy": {
			"dependent": null,
			"key": "transmissionLineInspectionSummary.processedBy",
			"label": "Processed By",
			"description": "Who processed the inspection.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionLineInspectionSummary.status": {
			"dependent": null,
			"key": "transmissionLineInspectionSummary.status",
			"label": "The status of the inspection",
			"description": "Status",
			"listValues": [{
				"label": "Pending",
				"value": "Pending",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "In Process",
				"value": "InProcess",
				"selector": 0,
				"sortOrder": 1,
				"deprecated": null
			},
			{
				"label": "Uploaded",
				"value": "Uploaded",
				"selector": 0,
				"sortOrder": 2,
				"deprecated": null
			},
			{
				"label": "Processed",
				"value": "Processed",
				"selector": 0,
				"sortOrder": 3,
				"deprecated": null
			},
			{
				"label": "Released",
				"value": "Released",
				"selector": 0,
				"sortOrder": 4,
				"deprecated": null
			}],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionLineInspectionSummary.type": {
			"dependent": null,
			"key": "transmissionLineInspectionSummary.type",
			"label": "Type",
			"description": "Type of Inspection",
			"listValues": [{
				"label": "Drone Inspection",
				"value": "DroneInspection",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			}],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionStructureSummary.dateOfInstall": {
			"dependent": null,
			"key": "transmissionStructureSummary.dateOfInstall",
			"label": "Date Installed",
			"description": "Date structure was installed",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionStructureSummary.location.latitude": {
			"dependent": null,
			"key": "transmissionStructureSummary.location.latitude",
			"label": "Latitude",
			"description": "The latitude where the structure is located.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionStructureSummary.location.longitude": {
			"dependent": null,
			"key": "transmissionStructureSummary.location.longitude",
			"label": "Longitude",
			"description": "The longitude where the structure is located.",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionStructureSummary.make": {
			"dependent": null,
			"key": "transmissionStructureSummary.make",
			"label": "Manufacturer",
			"description": "Manufacturer of the structure",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionStructureSummary.model": {
			"dependent": null,
			"key": "transmissionStructureSummary.model",
			"label": "Model",
			"description": "Model of the structure",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionStructureSummary.serialNumber": {
			"dependent": null,
			"key": "transmissionStructureSummary.",
			"label": "Serial Number",
			"description": "The serial number of the structure",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionStructureSummary.type": {
			"dependent": null,
			"key": "transmissionStructureSummary.type",
			"label": "Type",
			"description": "The type of structure",
			"listValues": [{
				"label": "Steel Tower",
				"value": "SteelTower",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "Steel Pole",
				"value": "SteelPole",
				"selector": 0,
				"sortOrder": 1,
				"deprecated": null
			},
			{
				"label": "Concrete Pole",
				"value": "ConcretePole",
				"selector": 0,
				"sortOrder": 2,
				"deprecated": null
			},
			{
				"label": "Wooden Pole",
				"value": "WoodenPole",
				"selector": 0,
				"sortOrder": 3,
				"deprecated": null
			}],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionStructureSummary.structureNumber": {
			"dependent": null,
			"key": "transmissionStructureSummary.structureNumber",
			"label": "Structure Number",
			"description": "Unique number assigned to the pole by the utility",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionStructureInspectionSummary.dateOfInspection": {
			"dependent": null,
			"key": "transmissionInspectionStructureSummary.dateOfInspection",
			"label": "Inspection Date",
			"description": "Date of Inspection",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionStructureInspectionSummary.orderNumber": {
			"dependent": null,
			"key": "transmissionInspectionStructureSummary.orderNumber",
			"label": "Order Number",
			"description": "Work order number",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionStructureInspectionSummary.processedBy": {
			"dependent": null,
			"key": "transmissionInspectionStructureSummary.processedBy",
			"label": "Processed By",
			"description": "Processed By",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionInspectionStructureSummary.status": {
			"dependent": null,
			"key": "transmissionInspectionStructureSummary.status",
			"label": "Status",
			"description": "Status",
			"listValues": [{
				"label": "Pending",
				"value": "Pending",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "In Process",
				"value": "InProcess",
				"selector": 0,
				"sortOrder": 1,
				"deprecated": null
			},
			{
				"label": "Uploaded",
				"value": "Uploaded",
				"selector": 0,
				"sortOrder": 2,
				"deprecated": null
			},
			{
				"label": "Processed",
				"value": "Processed",
				"selector": 0,
				"sortOrder": 3,
				"deprecated": null
			},
			{
				"label": "Released",
				"value": "Released",
				"selector": 0,
				"sortOrder": 4,
				"deprecated": null
			}],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionInspectionStructureSummary.type": {
			"dependent": null,
			"key": "transmissionInspectionStructureSummary.type",
			"label": "",
			"description": "",
			"listValues": [{
				"label": "Drone Inspection",
				"value": "DroneInspection",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			}],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionInspectionStructureSummary.reasonNotInspected": {
			"dependent": null,
			"key": "transmissionInspectionStructureSummary.reasonNotInspected",
			"label": "Reason not Inspected",
			"description": "Reason the structure was not inspected",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"transmissionInspectionStructureSummary.severity": {
			"dependent": null,
			"key": "transmissionInspectionStructureSummary.severity",
			"label": "Severity",
			"description": "The severity of the damage",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"inspectionEvent.orderNumber": {
			"dependent": null,
			"key": "inspectionEvent.orderNumber",
			"label": "Order Number",
			"description": "Work order number",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"inspectionEvent.name": {
			"dependent": null,
			"key": "inspectionEvent.name",
			"label": "Name",
			"description": "Name of damage",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"inspectionEvent.findingType": {
			"dependent": null,
			"key": "inspectionEvent.findingType",
			"label": "Problem Description",
			"description": "Description of the problem",
			"listValues": [{
				"label": "Backed Out",
				"value": "BackedOut",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "Bird Caging",
				"value": "BirdCaging",
				"selector": 0,
				"sortOrder": 1,
				"deprecated": null
			},
			{
				"label": "Corrosion",
				"value": "Corrosion",
				"selector": 0,
				"sortOrder": 2,
				"deprecated": null
			},
			{
				"label": "Cracked",
				"value": "Cracked",
				"selector": 0,
				"sortOrder": 3,
				"deprecated": null
			},
			{
				"label": "Damaged",
				"value": "Damaged",
				"selector": 0,
				"sortOrder": 4,
				"deprecated": null
			},
			{
				"label": "Encroachment",
				"value": "Encroachment",
				"selector": 0,
				"sortOrder": 5,
				"deprecated": null
			},
			{
				"label": "Extra Hardware",
				"value": "ExtraHardware",
				"selector": 0,
				"sortOrder": 6,
				"deprecated": null
			},
			{
				"label": "Flashed",
				"value": "Flashed",
				"selector": 0,
				"sortOrder": 7,
				"deprecated": null
			},
			{
				"label": "Leaning",
				"value": "Leaning",
				"selector": 0,
				"sortOrder": 8,
				"deprecated": null
			},
			{
				"label": "Loose",
				"value": "Loose",
				"selector": 0,
				"sortOrder": 9,
				"deprecated": null
			},
			{
				"label": "Missing",
				"value": "Missing",
				"selector": 0,
				"sortOrder": 10,
				"deprecated": null
			},
			{
				"label": "Pack Out",
				"value": "PackOut",
				"selector": 0,
				"sortOrder": 11,
				"deprecated": null
			},
			{
				"label": "Rot",
				"value": "Rot",
				"selector": 0,
				"sortOrder": 12,
				"deprecated": null
			},
			{
				"label": "Vegetation Encroachment",
				"value": "VegetationEncroachment",
				"selector": 0,
				"sortOrder": 13,
				"deprecated": null
			},
			{
				"label": "Wood Pecker",
				"value": "WoodPecker",
				"selector": 0,
				"sortOrder": 14,
				"deprecated": null
			},
			{
				"label": "Not Applicable",
				"value": "NA",
				"selector": 0,
				"sortOrder": 15,
				"deprecated": null
			}],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"inspectionEvent.observationType": {
			"dependent": null,
			"key": "inspectionEvent.observationType",
			"label": "",
			"description": "",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"inspectionEvent.severity": {
			"dependent": null,
			"key": "inspectionEvent.severity",
			"label": "Severity",
			"description": "Severity of damage",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"inspectionEvent.comment": {
			"dependent": null,
			"key": "inspectionEvent.comment",
			"label": "Comment",
			"description": "Comment about damage",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"inspectionEvent.userId": {
			"dependent": null,
			"key": "inspectionEvent.userId",
			"label": "Identified By",
			"description": "User that identified the damage",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"inspectionEvent.date": {
			"dependent": null,
			"key": "inspectionEvent.date",
			"label": "Date Identified",
			"description": "Date damage was identified",
			"listValues": [],
			"errors": {
				
			},
			"views": {
				
			}
		},
		"inspectionEvent.position": {
			"dependent": null,
			"key": "inspectionEvent.position",
			"label": "Area",
			"description": "Area of damage",
			"listValues": [{
				"label": "Insulators",
				"value": "Insulators",
				"selector": 0,
				"sortOrder": 0,
				"deprecated": null
			},
			{
				"label": "Conductor",
				"value": "Conductor",
				"selector": 0,
				"sortOrder": 1,
				"deprecated": null
			},
			{
				"label": "Cotter Key",
				"value": "Cotter Key",
				"selector": 0,
				"sortOrder": 2,
				"deprecated": null
			},
			{
				"label": "Ground Wire",
				"value": "GroundWire",
				"selector": 0,
				"sortOrder": 3,
				"deprecated": null
			},
			{
				"label": "Hardware",
				"value": "Hardware",
				"selector": 0,
				"sortOrder": 4,
				"deprecated": null
			},
			{
				"label": "Joint",
				"value": "Joint",
				"selector": 0,
				"sortOrder": 5,
				"deprecated": null
			},
			{
				"label": "Lightining Arrestor",
				"value": "LightiningArrestor",
				"selector": 0,
				"sortOrder": 6,
				"deprecated": null
			},
			{
				"label": "Pole",
				"value": "Pole",
				"selector": 0,
				"sortOrder": 7,
				"deprecated": null
			},
			{
				"label": "ROW",
				"value": "ROW",
				"selector": 0,
				"sortOrder": 8,
				"deprecated": null
			},
			{
				"label": "Splice",
				"value": "Splice",
				"selector": 0,
				"sortOrder": 9,
				"deprecated": null
			},
			{
				"label": "Static Wire",
				"value": "StaticWire",
				"selector": 0,
				"sortOrder": 10,
				"deprecated": null
			},
			{
				"label": "Not Applicable",
				"value": "NA",
				"selector": 0,
				"sortOrder": 11,
				"deprecated": null
			}],
			"errors": {
				
			},
			"views": {
				
			}
		}
	},
	"views": {
		"poleAMSViewer.poleView.summary": ["feederInspectionSummary.name",
		"feederInspectionSummary.feederNumber",
		"poleSummary.utilityId",
		"poleSummary.type",
		"poleSummary.length",
		"poleSummary.poleClass",
		"poleSummary.framing",
		"poleSummary.equipmentType",
		"poleSummary.numberOfPhases",
		"poleSummary.location.latitude",
		"poleSummary.location.longitude",
		"poleInspectionSummary.horizontalLoadingPercent"],
		"poleAMSViewer.poleView.detail": ["poleSummary.id",
		"poleSummary.owner",
		"poleInspectionSummary.access",
		"poleSummary.circuit1SpanLength1",
		"poleSummary.circuit1SpanLength2",
		"poleSummary.pullOff1SpanLength1",
		"poleSummary.pullOff2SpanLength2",
		"poleSummary.framing",
		"poleSummary.equipmentQuantity",
		"poleSummary.streetLight",
		"poleSummary.risers[]",
		"poleSummary.numberOfCATVAttachments",
		"poleSummary.totalSizeCATV",
		"poleSummary.caTVAttachments[].height",
		"poleSummary.caTVAttachments[].diameter",
		"poleSummary.numberOfTelComAttachments",
		"poleSummary.totalSizeTelCom",
		"poleSummary.telCommAttachments[].height",
		"poleSummary.telCommAttachments[].diameter",
		"poleSummary.primaryWireType",
		"poleSummary.neutralWireType",
		"poleSummary.openWireType",
		"poleSummary.numberOfOpenWires",
		"poleSummary.multiplexType",
		"poleSummary.switchNumber",
		"poleSummary.tlnCoordinate",
		"poleSummary.anchor[].type",
		"poleSummary.anchor[].leadLength",
		"poleSummary.anchor[].diameter",
		"poleSummary.anchor[].bearing",
		"poleInspectionSummary.latLongDelta"]
	}
};
