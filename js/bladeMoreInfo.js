var tempBladeMoreInfoData = {};
var rollbackIBladeMoreInfoData = {};

var runStatusAtArrivalOptions = [
	{ label: " -- ", value: 0 },
	{ label: "Run", value: 1  },
	{ label: "Stop", value: 2 },
	{ label: "Restrictions", value: 3 },
	{ label: "No Power", value: 6 },
	{ label: "Pause", value: 7},
	{ label: "Emergency Stop", value: 8 }
];

var runStatusAfterInspectionOptions = [
	{ label: " -- ", value: 0 },
	{ label: "Run", value: 1  },
	{ label: "Stop", value: 2 },
	{ label: "Restrictions", value: 3 },
	{ label: "No Power", value: 6 },
	{ label: "Pause", value: 7},
	{ label: "Emergency Stop", value: 8 }
];


var bladeLengthTypes = {};
var bladeLengthOptions = [
	{ "value": "", "label": " -- " },
	{ "value": "29", "label": "N/A" },
	{ "value": "30", "label": "10.5" },
	{ "value": "31", "label": "11.5" },
	{ "value": "32", "label": "13" },
	{ "value": "33", "label": "17" },
	{ "value": "34", "label": "19" },
	{ "value": "1", "label": "20.5" },
	{ "value": "2", "label": "23" },
	{ "value": "3", "label": "25" },
	{ "value": "4", "label": "32" },
	{ "value": "5", "label": "39" },
	{ "value": "6", "label": "44" },
	{ "value": "7", "label": "49" },
	{ "value": "37", "label": "51" },
	{ "value": "38", "label": "54" },
	{ "value": "36", "label": "55" },
	{ "value": "39", "label": "62" },
	{ "value": "40", "label": "67" },
	{ "value": "8", "label": "AL23,8" },
	{ "value": "9", "label": "AL26,8" },
	{ "value": "10", "label": "AL31,8" },
	{ "value": "11", "label": "AL35,8" },
	{ "value": "12", "label": "AL40,8" },
	{ "value": "13", "label": "LM19,1" },
	{ "value": "14", "label": "LM21,5" },
	{ "value": "15", "label": "LM23,2" },
	{ "value": "16", "label": "LM23,5" },
	{ "value": "17", "label": "LM25,2" },
	{ "value": "18", "label": "LM25,5" },
	{ "value": "19", "label": "LM26,0" },
	{ "value": "20", "label": "LM26,1" },
	{ "value": "21", "label": "LM29,0" },
	{ "value": "22", "label": "LM29,1" },
	{ "value": "23", "label": "LM31,2" },
	{ "value": "24", "label": "LM35,0" },
	{ "value": "25", "label": "LM35.0 P2" },
	{ "value": "26", "label": "LM38,8" },
	{ "value": "35", "label": "LM40,1" },
	{ "value": "27", "label": "LM44,8" },
	{ "value": "28", "label": "LM54,0" }
];

var bladeColorOptions = [
	{ "value": "0", "label": " -- " },
	{ "value": "6", "label": "N/A" },
	{ "value": "3", "label": "Ral 7035 Light Gray" },
	{ "value": "8", "label": "Ral 7035 Light Gray / Ral 3020 Red Stripes" },
	{ "value": "11", "label": "Ral 7035 Light Gray / Ral 3020 Red Tip" },
	{ "value": "4", "label": "Ral 7040 Gray" },
	{ "value": "9", "label": "Ral 7040 Gray / Ral 3020 Red Stripes" },
	{ "value": "7", "label": "Ral 7040 Gray / Ral 3020 Red Tip" },
	{ "value": "5", "label": "Ral 9010 White" },
	{ "value": "12", "label": "Ral 9010 White / Ral 2009 Orange Stripes" },
	{ "value": "13", "label": "Ral 9010 White / Ral 2009 Orange Tip" },
	{ "value": "14", "label": "Ral 9010 White / Ral 3020 Red Stripes" },
	{ "value": "15", "label": "Ral 9010 White / Ral 3020 Red Tip" }
];

var bladeManufacturerOptions = [
	{
		"value": "",
		"label": " -- "
	},
	{
		"value": "LM Wind Power",
		"label": "LM Wind Power"
	},
	{
		"value": "Vestas Blades",
		"label": "Vestas Blades"
	},
	{
		"value": "AL – AeroLaminates",
		"label": "AL – AeroLaminates"
	}
]

function createBladeMoreInfoContent() {
	//added to support Vestas requirement for additional fields
	var enableMoreInfoButton = new dijit.form.Button({
        id: "enableMoreInfo",
		label: "Show More Info",
        style: "font-size: 12px;",
		iconClass: "dijitEditorIcon enableMoreInfo",
		disabled: false,
		onClick: function(){
			
			var inspectorState = dojo.style('bladeInspectorPanel', 'display');
			var moreInfoState = dojo.style('bladeMoreInfoPanel', 'display');
            
			if (moreInfoState == 'none' && inspectorState == 'block') {
                dojo.style('bladeViewer', 'width', '1280px');
                dojo.style('bladeMoreInfoPanel', 'display', 'block');
                this.set('label', "Hide More Info");
            } else if (moreInfoState == 'none' && inspectorState == 'none') {
				dojo.style('bladeViewer', 'width', '960px');
                dojo.style('bladeMoreInfoPanel', 'display', 'block');
                this.set('label', "Hide More Info");
			} else if (moreInfoState == 'block' && inspectorState == 'block') {
				dojo.style('bladeViewer', 'width', '950px');
                dojo.style('bladeMoreInfoPanel', 'display', 'none');
                this.set('label', "Show More Info");
			}  else {
                dojo.style('bladeViewer', 'width', '610px');
                dojo.style('bladeMoreInfoPanel', 'display', 'none');
                this.set('label', "Show More Info");
            }
            
			updateToolsContainer();
			var api = $("#bladeViewerOuterContent").data('jsp');
			api.reinitialise();
			
			if (dojo.style('bladeMoreInfoPanel', 'display') == "block") {
				var wrapper = dojo.position(dojo.byId("bladeMoreInfoAccordionWrapper"))
				var groups = dojo.query("#bladeMoreInfoAccordionContainer .dijitTitlePaneTitle")
				var titleHeight = dojo.position(groups[0]).h * groups.length + 8;
				dojo.query("#bladeMoreInfoAccordionContainer .dijitTitlePaneContentInner").style('height', (wrapper.h - titleHeight) + "px");
				
				dojo.forEach(groups, function(node){
					var widget = dijit.getEnclosingWidget(node);
					if (widget.open) {
						var api = $('#' + widget.id + '-scroll-pane').data('jsp');
						api.reinitialise();
					}
				})
			}
        }
		
    }, "bladeMoreInfoButton");
	
	var bladeMoreInfoAccordionWrapper = new dijit.layout.ContentPane({ id: "bladeMoreInfoAccordionWrapper" }, "bladeMoreInfoAccordionWrapper");
	
	var bladeMoreInfoAccordionContainer = new dojox.widget.TitleGroup({
		id:"bladeMoreInfoAccordionContainer"
	}, "bladeMoreInfoAccordionContainer");

	var bladeMoreInfoTurbineData = new dijit.TitlePane({ id: "bladeMoreInfoTurbineData", title: "Wind Turbine Data", open: true }, "bladeMoreInfoTurbineData");
	var bladeMoreInfoBladeData = new dijit.TitlePane({ id: "bladeMoreInfoBladeData", title: "Blade Data", open: false  }, "bladeMoreInfoBladeData");

	bladeMoreInfoAccordionContainer.addChild(bladeMoreInfoTurbineData);
	bladeMoreInfoAccordionContainer.addChild(bladeMoreInfoBladeData);
	bladeMoreInfoAccordionContainer.startup();

	var wrapper = dojo.position(dojo.byId("bladeMoreInfoAccordionWrapper"))
	var groups = dojo.query("#bladeMoreInfoAccordionContainer .dijitTitlePaneTitle")
	var titleHeight = dojo.position(groups[0]).h * groups.length + 13;
	dojo.query("#bladeMoreInfoAccordionContainer .dijitTitlePaneContentInner").style('height', (wrapper.h - titleHeight) + "px");

	dojo.query("#bladeMoreInfoAccordionContainer .dijitTitlePaneTextNode").forEach(function(node){
		var widget = dijit.getEnclosingWidget(node);
		var text = node.innerHTML;
		var fa_icon = (widget.open) ? 'fa-caret-down' : 'fa-caret-right';
		var content = '<i class="moreInfoTitleIcon fa ' + fa_icon + '" aria-hidden="true"></i>' + text;
		node.innerHTML = content;
		
		dojo.connect(widget, "toggle", function () {
			if (this.open) {
				dojo.removeClass(this.titleNode.firstChild, "fa-caret-right");
				dojo.addClass(this.titleNode.firstChild, "fa-caret-down");
			} else {
				dojo.removeClass(this.titleNode.firstChild, "fa-caret-down");
				dojo.addClass(this.titleNode.firstChild, "fa-caret-right");
			}
		});
		
		dojo.mixin(widget, {
			_onTitleClick: function(){
				if (!widget.open) {
					var a = widget._dxfindParent();
					dojo.query(".dijitTitlePane", a.domNode).forEach(function (b) {
						var b = dijit.getEnclosingWidget(b);
						if (b.open || b.id == widget.id) {
							b.toggle();
						}
					})
				}
			}
		});
		
		dojo.connect(widget._wipeIn, "onEnd", function () {
			var api = $('#' + widget.id + '-scroll-pane').data('jsp');
			api.reinitialise();
		});
		
		var params = {
			verticalDragMinHeight: 25,
			verticalDragMaxHeight: 25,
			animateScroll: true,
			mouseWheelSpeed: 20,
			trackClickSpeed: 20
		};

		$('#' + widget.id + '-scroll-pane').jScrollPane(params);
	});
	
	/* var options = [
		{ label: " -- ", value: "" },
		{ label: "Inspection", value: "inspection" },
		{ label: "Failure", value: "failure" },
		{ label: "Repair", value: "repair" },
		{ label: "Retrofit", value: "retrofit" }
	];
	
	new dijit.form.Select({
        id: "reportType",
        options: options,
		value: 1,
		style: "width:100%; font-size: 14px;",
		required: false,
		disabled: true,
		onChange: function(value) {
		},
        onClick: function() {
        },
    }, "reportTypeDiv") */
	
	new dijit.form.TextBox({
		id: "cirNumber",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "cirNumberDiv");
	
	new dijit.form.TextBox({
		id: "caseNumber",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "caseNumberDiv");
	
	new dijit.form.TextBox({
		id: "serial",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "serialDiv");
	
	new dijit.form.TextBox({
		id: "name",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "nameDiv");
	
	/* new dijit.form.Select({
        id: "runStatus",
        options: options,
		value: 1,
		style: "width:100%; font-size: 14px;",
		required: false,
		disabled: true,
		onChange: function(value) {
		},
        onClick: function() {
        },
    }, "runStatusDiv") */
	
	new dijit.form.Select({
        id: "runStatusAtArrival",
        options: runStatusAtArrivalOptions,
		value: 1,
		style: "width:100%; font-size: 14px;",
		required: false,
		disabled: true,
		onChange: function(value) {
		},
        onClick: function() {
        },
    }, "runStatusAtArrivalDiv")
	
	new dijit.form.Select({
        id: "runStatusAfterInspection",
        options: runStatusAfterInspectionOptions,
		value: 1,
		style: "width:100%; font-size: 14px;",
		required: false,
		disabled: true,
		onChange: function(value) {
		},
        onClick: function() {
        },
    }, "runStatusAfterInspectionDiv")
	
	new dijit.form.DateTextBox({
		id: "failureDate",
		value: "",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		constraints: {
			datePattern : 'dd-MM-yyyy',
			max: new Date('2018-03-13') 
		},
		invalidMessage: "Failure date should be prior than Inspection date",
		onChange: function(value) {
			dijit.byId("dateOfInspection").constraints.min = value;
		}
	}, "failureDateDiv");
	
	new dijit.form.DateTextBox({
		id: "dateOfInspection",
		value: "",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		constraints: {
			datePattern : 'dd-MM-yyyy',
			min: new Date('2018-03-01') 
		},
		invalidMessage: "Inspection date should be later or the same as Failure date",
		onChange: function(value) {
			dijit.byId("failureDate").constraints.max = value;
		}
	}, "dateOfInspectionDiv");
	
	new dijit.form.TextBox({
		id: "orderNumber",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "orderNumberDiv");
	
	new dijit.form.TextBox({
		id: "runHours",
		value: "10",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "runHoursDiv");
	
	new dijit.form.TextBox({
		id: "generator1RunHours",
		value: "10",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "generator1RunHoursDiv");
	
	new dijit.form.TextBox({
		id: "generator2RunHours",
		value: "10",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "generator2RunHoursDiv");
	
	new dijit.form.TextBox({
		id: "totalProduction",
		value: "100000",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "totalProductionDiv");
	
	new dijit.form.TextBox({
		id: "quantityOfFailedComponents",
		value: "2",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "quantityOfFailedComponentsDiv");
	
	new dijit.form.TextBox({
		id: "bladeItemNumber",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "bladeItemNumberDiv");
	
	new dijit.form.TextBox({
		id: "alarmLogNumber",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "alarmLogNumberDiv");
	
	new dijit.form.TextBox({
		id: "bladeSerialNumber",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "bladeSerialNumberDiv");
	
	new dijit.form.Select({
        id: "bladeManufacturer",
        options: bladeManufacturerOptions,
		style: "width:100%; font-size: 14px;",
		required: false,
		disabled: true,
		onChange: function(value) {
		},
        onClick: function() {
        },
    }, "bladeManufacturerDiv")
	
	/* new dijit.form.TextBox({
		id: "bladeManufacturer",
		value: "",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "bladeManufacturerDiv"); */
	
	new dijit.form.Select({
        id: "bladeLength",
        options: bladeLengthOptions,
		style: "width:100%; font-size: 14px;",
		required: false,
		disabled: true,
		onChange: function(value) {
		},
        onClick: function() {
        },
    }, "bladeLengthDiv")
	
	/* new dijit.form.TextBox({
		id: "bladeLength",
		value: "",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "bladeLengthDiv"); */
	
	new dijit.form.Select({
        id: "bladeColor",
        options: bladeColorOptions,
		style: "width:100%; font-size: 14px;",
		required: false,
		disabled: true,
		onChange: function(value) {
		},
        onClick: function() {
        },
    }, "bladeColorDiv")
	dojo.query("#bladeColor table div.dijitButtonText").style({ "max-width": "245px", "overflow": "hidden"});
	
	dojo.connect(dojo.byId("damageIdentified-toggle"), "onchange", function(){
		var toggle = this;
		window.setTimeout(function() {
			dojo.query("#damageIdentifiedDiv .toggle-switch-text.option").style("color", "#d3d3d3");
			var side = (toggle.checked) ? "after" : "before";
			dojo.query("#damageIdentifiedDiv .toggle-switch-text." + side).style("color", "#000000");
		}, 150);
    })
	
	var rulesNode = dojo.create("div", { id: 'bladeConditionSliderRule' }, dojo.byId('bladeConditionDiv'), 'first');
	var sliderRules = new dijit.form.HorizontalRule({
		container:"topDecoration",
		count:5,
		style: "height: 5px;"
	}, rulesNode);
	
	var labelsNode = dojo.create("div", { id: 'bladeConditionSliderLabels' }, dojo.byId('bladeConditionDiv'), 'first');
	var sliderLabels = new dijit.form.HorizontalRuleLabels({
		container: "topDecoration",
		labelStyle: "font-size: 14px; font-weight: bolder; top: -20px;",
		labels: ['<span id="bladeCondition1-sliderLabel" style="color:#00B050; cursor:pointer;" onclick="">1</span>', '<span id="bladeCondition2-sliderLabel" style="color:#7FD728; cursor:pointer;" onclick="">2</span>', '<span id="bladeCondition3-sliderLabel" style="color:#EFEF00; cursor:pointer;" onclick="">3</span>', '<span id="bladeCondition4-sliderLabel" style="color:#F16722; cursor:pointer;" onclick="">4</span>', '<span id="bladeCondition5-sliderLabel" style="color:#FF0000; cursor:pointer;" onclick="">5</span>']
	}, labelsNode);
	
	var bladeConditionSlider = new dijit.form.HorizontalSlider({
		id: "bladeConditionSlider",
		value: 1,
		minimum: 1,
		maximum: 5,
		discreteValues: 5,
		intermediateChanges: false,
		style: "width:100%;margin-top:15px;",
		showButtons: false,
		clickSelect: true,
		disabled: true,
		onChange: function(value){
			if (_.has(siteData[siteName].workOrders, workOrderNumber)) {
				var turbine = _.first(dojo.filter(siteData[siteName].workOrders[workOrderNumber].data, function(turbine) { 
					return  turbine.id == turbineId; 
				}));
				var componentCurrent = dojo.attr("bladeId", "data-blade-id");
				var componentLetter = _.last(componentCurrent.replace("blade","")).toUpperCase();
				var componentId = (!_.isNull(turbine.components)) ? _.invert(turbine.components.ids)["Blade" + componentLetter] : null;
				var component = (!_.isNull(componentId)) ? turbine.components.component[componentId] : undefined;
				var componentInspection = (!_.isNull(componentId)) ? turbine.components.inspectionStatus[componentId] : undefined;
				
				if (!_.isUndefined(componentInspection) && _.has(componentInspection, "attributes")) {
					componentInspection.attributes.overallBladeCondition = value;
				}
				updateSiteViewerAndFeatureLayerRecords();
				updateBladeSelectorSeverity();
				enableSubmitApproveButton(value);
			}
		}
	}, "bladeConditionDiv");
	
	bladeConditionSlider.startup();
	sliderRules.startup();
	sliderLabels.startup();
	
	
	new dijit.form.TextBox({
		id: "ambientTemp",
		value: "15",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "ambientTempDiv");
	
	new dijit.form.TextBox({
		id: "humidity",
		value: "50",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "humidityDiv");
	
	new dijit.form.TextBox({
		id: "bladeSurfaceTemp",
		value: "20",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "bladeSurfaceTempDiv");
	
	new dijit.form.TextBox({
		id: "totalCureTime",
		value: "12",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "totalCureTimeDiv");
	
	new dijit.form.TextBox({
		id: "vtNumber",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "vtNumberDiv");
	
	new dijit.form.DateTextBox({
		id: "calibrationDate",
		value: "",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		constraints: { datePattern : 'dd-MM-yyyy' },
		onChange: function(value) {
		}
	}, "calibrationDateDiv");
	
	new dijit.form.TextBox({
		id: "",
		value: "",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "Div");
	
	new dijit.form.TextBox({
		id: "additionalDocumentRef",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "additionalDocumentRefDiv");
	
	new dijit.form.TextBox({
		id: "resinType",
		value: "Resin",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "resinTypeDiv");
	
	new dijit.form.TextBox({
		id: "resinBatchNumbers",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "resinBatchNumbersDiv");
	
	new dijit.form.DateTextBox({
		id: "resinExpiryDate",
		value: "",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		constraints: { datePattern : 'dd-MM-yyyy' },
		onChange: function(value) {
		}
	}, "resinExpiryDateDiv");
	
	new dijit.form.TextBox({
		id: "hardnerType",
		value: "Hardner",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "hardnerTypeDiv");
	
	new dijit.form.TextBox({
		id: "hardnerBatchNumbers",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "hardnerBatchNumbersDiv");
	
	new dijit.form.DateTextBox({
		id: "hardnerExpiryDate",
		value: "",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		constraints: { datePattern : 'dd-MM-yyyy' },
		onChange: function(value) {
		}
	}, "hardnerExpiryDateDiv");
	
	new dijit.form.TextBox({
		id: "glassSupplier",
		value: "Glass",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "glassSupplierDiv");
	
	new dijit.form.TextBox({
		id: "glassBatchNumbers",
		value: "12345678",
		style: "width:100%; font-size: 14px;",
		disabled: true,
		onChange: function(value) {
		}
	}, "glassBatchNumbersDiv");
	
	dojo.connect(dojo.byId('submitMoreInfoData'), 'onmouseenter', function(evt) {
		showToolTip(evt, 'Submit to CIR for Review');
	});	
	dojo.connect(dojo.byId('submitMoreInfoData'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	dojo.connect(dojo.byId('submitMoreInfoData'), 'onclick', function(evt) {
		var state = dojo.attr(this, 'data-enabled');
		if (state) {
			submitCIR('submit');
		}
	});
	
	dojo.connect(dojo.byId('submitApproveMoreInfoData'), 'onmouseenter', function(evt) {
		showToolTip(evt, 'Submit to CIR and Approve');
	});	
	dojo.connect(dojo.byId('submitApproveMoreInfoData'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	dojo.connect(dojo.byId('submitApproveMoreInfoData'), 'onclick', function(evt) {
		var state = dojo.attr(this, 'data-enabled');
		if (state) {
			submitCIR('approve');
		}
	});
	
	setAnnotationToolDisplay('submitMoreInfoData', false);
	setAnnotationToolDisplay('submitApproveMoreInfoData', false);
	
	dojo.forEach(dojo.query("[name=reportType]"), function(node) {
		dojo.connect(node, "onclick", function(evt) {
			var value = this.value;
			var display = (value == "repair" || value == "retrofit") ? "block" : "none";
			dojo.style(dojo.byId("bladeRepairOrRetrofit"), "display", display);
		})
	})
}

function enableBladeMoreInfoContent(status) {
	if (status) {
		//enable
		var djs = dojo.query("#bladeMoreInfoPanel .moreInfoInputRows .dijit");
		dojo.forEach(djs, function(dj) {
			var widget = dijit.getEnclosingWidget(dj);
			if (!_.contains(['cirNumber','orderNumber', 'dateOfInspection', 'name', 'serial'], widget.id)) {
				widget.set("disabled", false);
			}
		});
		
		var tas = dojo.query("#bladeMoreInfoPanel .moreInfoInputRows textarea")
		dojo.forEach(tas, function(ta) {
			ta.disabled = false;
		});
		
		var cks = dojo.query("#bladeMoreInfoPanel .moreInfoInputRows input[type='checkbox']")
		dojo.forEach(cks, function(ck) {
			ck.disabled = false;
		});
		
		var rbs = dojo.query("#bladeMoreInfoPanel .moreInfoInputRows input[type='radio']")
		dojo.forEach(rbs, function(rb) {
			rb.disabled = false;
		})
		
	} else {
		//disable
		var djs = dojo.query("#bladeMoreInfoPanel .moreInfoInputRows .dijit");
		dojo.forEach(djs, function(dj) {
			dijit.getEnclosingWidget(dj).set("disabled", true);
		});
		
		var tas = dojo.query("#bladeMoreInfoPanel .moreInfoInputRows textarea")
		dojo.forEach(tas, function(ta) {
			ta.disabled = true;
		});
		
		var cks = dojo.query("#bladeMoreInfoPanel .moreInfoInputRows input[type='checkbox']")
		dojo.forEach(cks, function(ck) {
			ck.disabled = true;
		});
		
		var rbs = dojo.query("#bladeMoreInfoPanel .moreInfoInputRows input[type='radio']")
		dojo.forEach(rbs, function(rb) {
			rb.disabled = true;
		})
		
	}
	
	setAnnotationToolDisplay('submitMoreInfoData', status);
	setAnnotationToolDisplay('submitApproveMoreInfoData', status);
}

function populateBladeMoreInfoContent() {
	var turbine = _.first(dojo.filter(siteData[siteName].workOrders[workOrderNumber].data, function(turbine) { 
		return  turbine.id == turbineId; 
	}));
	var assetInspection = turbine.assetInspection;
	
	var componentCurrent = dojo.attr("bladeId", "data-blade-id");
	var componentLetter = _.last(componentCurrent.replace("blade","")).toUpperCase();
	var componentId = (!_.isNull(turbine.components)) ? _.invert(turbine.components.ids)["Blade" + componentLetter] : null;
	
	var component = (!_.isNull(componentId)) ? turbine.components.component[componentId] : undefined;
	var componentInspection = (!_.isNull(componentId)) ? turbine.components.inspectionStatus[componentId] : undefined;
	var bladeRepairRetrofit = (!_.isNull(componentId)) ? turbine.components.bladeRepairRetrofit[componentId] : undefined;
	
	var serviceOrderNumber = workOrderNumber;
	//var scope = (!_.isNull(siteData[siteName].workOrders[workOrderNumber].scope)) ? siteData[siteName].workOrders[workOrderNumber].scope : "";
	var scope = (_.isNull(siteData[siteName].workOrders[workOrderNumber].scope) || !_.contains(["inspection", "failure", "repair", "retrofit"], siteData[siteName].workOrders[workOrderNumber].scope)) ? "inspection" : siteData[siteName].workOrders[workOrderNumber].scope;
	
	var assetSerial = (!_.isNull(turbine.serialNumber)) ? turbine.serialNumber : "";
	var assetName = turbine.name;
	var assetBladeLength = (_.has(turbine, "attributes") && _.has(turbine.attributes, "bladeLength") && !_.isNull(turbine.attributes.bladeLength)) ? turbine.attributes.bladeLength : "";
	
	var dateOfInspection = (!_.isNull(assetInspection.dateOfInspection)) ? assetInspection.dateOfInspection : "00000000";
	var failureDate = (!_.isNull(assetInspection.failureDate)) ? assetInspection.failureDate : "00000000";
	var runHours = (_.has(assetInspection, "attributes") && _.has(assetInspection.attributes, "runHours") && !_.isNull(assetInspection.attributes.runHours)) ? assetInspection.attributes.runHours : "";
	var generator1RunHours = (_.has(assetInspection, "attributes") && _.has(assetInspection.attributes, "generator1RunHours") && !_.isNull(assetInspection.attributes.generator1RunHours)) ? assetInspection.attributes.generator1RunHours : "";
	var generator2RunHours = (_.has(assetInspection, "attributes") && _.has(assetInspection.attributes, "generator2RunHours") && !_.isNull(assetInspection.attributes.generator2RunHours)) ? assetInspection.attributes.generator2RunHours : "";
	var totalProduction = (_.has(assetInspection, "attributes") && _.has(assetInspection.attributes, "totalProduction") && !_.isNull(assetInspection.attributes.totalProduction)) ? assetInspection.attributes.totalProduction : "";
	var runStatusAfterInspection = (_.has(assetInspection, "attributes") && _.has(assetInspection.attributes, "runStatusAfterInspection") && !_.isNull(assetInspection.attributes.runStatusAfterInspection)) ? assetInspection.attributes.runStatusAfterInspection : 0;
	var runStatusAtArrival = (_.has(assetInspection, "attributes") && _.has(assetInspection.attributes, "runStatusAtArrival") && !_.isNull(assetInspection.attributes.runStatusAtArrival)) ? assetInspection.attributes.runStatusAtArrival : 0;
	var quantityOfFailedComponents = (_.has(assetInspection, "attributes") && _.has(assetInspection.attributes, "quantityOfFailedComponents") && !_.isNull(assetInspection.attributes.quantityOfFailedComponents)) ? assetInspection.attributes.quantityOfFailedComponents : "";
	
	var componentItemNumber = (!_.isUndefined(component) && _.has(component, "attributes") && _.has(component.attributes, "itemNumber") && !_.isNull(component.attributes.itemNumber)) ? component.attributes.itemNumber : "";
	var componentSerial = (!_.isUndefined(component) && !_.isNull(component.serialNumber)) ? component.serialNumber : "";
	var componentMake = (!_.isUndefined(component) && !_.isNull(component.make)) ? component.make : "";
	var componentColor = (!_.isUndefined(component) && _.has(component, "attributes") && _.has(component.attributes, "color") && !_.isNull(component.attributes.color)) ? component.attributes.color : 0;
	
	var cirNumber = (!_.isUndefined(componentInspection) && _.has(componentInspection, "vendorId") && !_.isNull(componentInspection.vendorId)) ? componentInspection.vendorId : "";
	var caseNumber = (!_.isUndefined(componentInspection) && _.has(componentInspection, "attributes") && _.has(componentInspection.attributes, "caseNumber") && !_.isNull(componentInspection.attributes.caseNumber)) ? componentInspection.attributes.caseNumber : "";
	var reasonForService = (!_.isUndefined(componentInspection) && !_.isNull(componentInspection.reasonForService)) ? componentInspection.reasonForService : "";
	var plateImageResourceId = (!_.isUndefined(componentInspection) && !_.isNull(componentInspection.plateImageResourceId)) ? componentInspection.plateImageResourceId : "";
	//var noBladeIdReason = (!_.isUndefined(componentInspection) && _.has(componentInspection, "attributes") && _.has(componentInspection.attributes, "noBladeIdReason") && !_.isNull(componentInspection.attributes.noBladeIdReason)) ? componentInspection.attributes.noBladeIdReason : "";
	var overallBladeCondition = (!_.isUndefined(componentInspection) && _.has(componentInspection, "attributes") && _.has(componentInspection.attributes, "overallBladeCondition") && !_.isNull(componentInspection.attributes.overallBladeCondition)) ? componentInspection.attributes.overallBladeCondition : 0;
	
	var description = (!_.isUndefined(componentInspection) && !_.isNull(componentInspection.description)) ? componentInspection.description : "";
	var descriptionOfConsequentialProblems = (!_.isUndefined(componentInspection) && _.has(componentInspection, "attributes") && _.has(componentInspection.attributes, "descriptionOfConsequentialProblems") && !_.isNull(componentInspection.attributes.descriptionOfConsequentialProblems)) ? componentInspection.attributes.descriptionOfConsequentialProblems : "";
	
	/* var additionalInformation = (!_.isUndefined(componentInspection) && !_.isNull(componentInspection.additionalInformation)) ? componentInspection.additionalInformation : "";
	var sbuRecommendation = (!_.isUndefined(componentInspection) && !_.isNull(componentInspection.sbuRecommendation)) ? componentInspection.sbuRecommendation : "";
	var alarmLogNumber = (!_.isUndefined(componentInspection) && !_.isNull(componentInspection.alarmLogNumber)) ? componentInspection.alarmLogNumber : "";
	var vestasConfidentialComments = (!_.isUndefined(componentInspection) && !_.isNull(componentInspection.vestasConfidentialComments)) ? componentInspection.vestasConfidentialComments : ""; */
	
	//from workOrder
	dojo.query("#reportType input[value=" + scope + "]")[0].checked = true;
	//dijit.byId("reportType").set("value", scope);
	dijit.byId("orderNumber").set("value", serviceOrderNumber);
	
	//from asset
	dijit.byId("name").set("value", assetName);
	dijit.byId("serial").set("value", assetSerial);
	dijit.byId("bladeLength").set("value", assetBladeLength);
	
	//from assetInspection
	//dijit.byId("runStatus").set("value", runStatus);
	dijit.byId("runStatusAfterInspection").set("value", runStatusAfterInspection);
	dijit.byId("runStatusAtArrival").set("value", runStatusAtArrival);
	dijit.byId("runHours").set("value", runHours);
	dijit.byId("generator1RunHours").set("value", generator1RunHours);
	dijit.byId("generator2RunHours").set("value", generator2RunHours);
	dijit.byId("totalProduction").set("value", totalProduction);
	dijit.byId("quantityOfFailedComponents").set("value", quantityOfFailedComponents);
	var failureDate = convertDate(failureDate, "moreInfo");
	var dateOfInspection = convertDate(dateOfInspection, "moreInfo");
	dijit.byId("failureDate").constraints.max = new Date(dateOfInspection);
	dijit.byId("dateOfInspection").constraints.min = new Date(failureDate);
	dijit.byId("failureDate").set("value", new Date(failureDate));
	dijit.byId("dateOfInspection").set("value", new Date(dateOfInspection));
	
	//from component
	dijit.byId("bladeItemNumber").set("value", componentItemNumber);
	dijit.byId("bladeSerialNumber").set("value", componentSerial);
	dijit.byId("bladeManufacturer").set("value", componentMake);
	dijit.byId("bladeColor").set("value", componentColor);
	
	//from componentInspection
	dijit.byId("cirNumber").set("value", cirNumber);
	dijit.byId("caseNumber").set("value", caseNumber);
	dojo.byId("reasonForService").value = reasonForService;
	dojo.byId("description").value = description;
	dojo.byId("descriptionOfConsequentialProblems").value = descriptionOfConsequentialProblems;
	//dojo.byId("reasonNoBladeId").value = noBladeIdReason;
	
	/* dojo.byId("additionalInformation").value = additionalInformation;
	dojo.byId("sbuRecommendation").value = sbuRecommendation;
	dijit.byId("alarmLogNumber").set("value", alarmLogNumber);
	dojo.byId("vestasConfidentialComments").value = vestasConfidentialComments; */
	
	//check if any inspection events exist
	var damageIdentified = (bladeInspectionEventsData.length > 0 || overallBladeCondition >= 1) ? true : false;
	dojo.byId("damageIdentified-toggle").checked = damageIdentified;
	
	if (damageIdentified) {
		var bladeSeverity = dojo.map(bladeInspectionEventsData, function(item) { return item.severity })
		overallBladeCondition = (bladeSeverity.length > 0) ? _.max(bladeSeverity) : overallBladeCondition;
	}
	dijit.byId("bladeConditionSlider").set("value", overallBladeCondition);
	
	var display = (damageIdentified) ? "block" : "none";
	dojo.query(".bladeCondition").style("display", display);
	
	
	//from workOrder
	tempBladeMoreInfoData.scope = scope;
	tempBladeMoreInfoData.serviceOrderNumber = serviceOrderNumber;
						 
	//from asset         
	tempBladeMoreInfoData.assetName = assetName;
	tempBladeMoreInfoData.assetSerial = assetSerial;
	tempBladeMoreInfoData.assetBladeLength = assetBladeLength;
						 
	//from assetInspection
	//tempBladeMoreInfoData.runStatus = runStatus;
	tempBladeMoreInfoData.runStatusAfterInspection = runStatusAfterInspection;
	tempBladeMoreInfoData.runStatusAtArrival = runStatusAtArrival;
	tempBladeMoreInfoData.runHours = runHours;
	tempBladeMoreInfoData.generator1RunHours = generator1RunHours;
	tempBladeMoreInfoData.generator2RunHours = generator2RunHours;
	tempBladeMoreInfoData.totalProduction = totalProduction;
	tempBladeMoreInfoData.quantityOfFailedComponents = quantityOfFailedComponents;

	tempBladeMoreInfoData.failureDate = failureDate;
	tempBladeMoreInfoData.dateOfInspection = dateOfInspection;
						 
	//from component     
	tempBladeMoreInfoData.componentItemNumber = componentItemNumber;
	tempBladeMoreInfoData.componentSerial = componentSerial;
	tempBladeMoreInfoData.componentMake = componentMake;
	tempBladeMoreInfoData.componentColor = componentColor;
						 
	//from componentInspection
	tempBladeMoreInfoData.cirNumber = cirNumber;
	tempBladeMoreInfoData.caseNumber = caseNumber;
	tempBladeMoreInfoData.reasonForService = reasonForService;
	tempBladeMoreInfoData.description = description;
	tempBladeMoreInfoData.descriptionOfConsequentialProblems = descriptionOfConsequentialProblems;
	//tempBladeMoreInfoData.noBladeIdReason = noBladeIdReason;
	tempBladeMoreInfoData.damageIdentified = damageIdentified;
	tempBladeMoreInfoData.overallBladeCondition = overallBladeCondition;
	
	/* tempBladeMoreInfoData.additionalInformation = additionalInformation;
	tempBladeMoreInfoData.sbuRecommendation = sbuRecommendation;
	tempBladeMoreInfoData.alarmLogNumber = alarmLogNumber;
	tempBladeMoreInfoData.vestasConfidentialComments = vestasConfidentialComments; */
	
	if (!_.isUndefined(bladeRepairRetrofit) && !_.isNull(bladeRepairRetrofit)) {
		console.log(bladeRepairRetrofit);
		var ambientTemp = (_.has(bladeRepairRetrofit, "ambientTemp") && !_.isNull(bladeRepairRetrofit.ambientTemp)) ? bladeRepairRetrofit.ambientTemp : "";
		var humidity = (_.has(bladeRepairRetrofit, "humidity") && !_.isNull(bladeRepairRetrofit.humidity)) ? bladeRepairRetrofit.humidity : "";
		var bladeSurfaceTemp = (_.has(bladeRepairRetrofit, "bladeSurfaceTemp") && !_.isNull(bladeRepairRetrofit.bladeSurfaceTemp)) ? bladeRepairRetrofit.bladeSurfaceTemp : "";
		var totalCureTime = (_.has(bladeRepairRetrofit, "totalCureTime") && !_.isNull(bladeRepairRetrofit.totalCureTime)) ? bladeRepairRetrofit.totalCureTime : "";
		var vtNumber = (_.has(bladeRepairRetrofit, "vtNumber") && !_.isNull(bladeRepairRetrofit.vtNumber)) ? bladeRepairRetrofit.vtNumber : "";
		var calibrationDate = (_.has(bladeRepairRetrofit, "calibrationDate") && !_.isNull(bladeRepairRetrofit.calibrationDate)) ? bladeRepairRetrofit.calibrationDate : "00000000";
		var additionalDocumentRef = (_.has(bladeRepairRetrofit, "additionalDocumentRef") && !_.isNull(bladeRepairRetrofit.additionalDocumentRef)) ? bladeRepairRetrofit.additionalDocumentRef : "";
		var resinType = (_.has(bladeRepairRetrofit, "resinType") && !_.isNull(bladeRepairRetrofit.resinType)) ? bladeRepairRetrofit.resinType : "";
		var resinBatchNumbers = (_.has(bladeRepairRetrofit, "resinBatchNumbers") && !_.isNull(bladeRepairRetrofit.resinBatchNumbers)) ? bladeRepairRetrofit.resinBatchNumbers : "";
		var resinExpiryDate = (_.has(bladeRepairRetrofit, "resinExpiryDate") && !_.isNull(bladeRepairRetrofit.resinExpiryDate)) ? bladeRepairRetrofit.resinExpiryDate : "00000000";
		var hardnerType = (_.has(bladeRepairRetrofit, "hardnerType") && !_.isNull(bladeRepairRetrofit.hardnerType)) ? bladeRepairRetrofit.hardnerType : "";
		var hardnerBatchNumbers = (_.has(bladeRepairRetrofit, "hardnerBatchNumbers") && !_.isNull(bladeRepairRetrofit.hardnerBatchNumbers)) ? bladeRepairRetrofit.hardnerBatchNumbers : "";
		var hardnerExpiryDate = (_.has(bladeRepairRetrofit, "hardnerExpiryDate") && !_.isNull(bladeRepairRetrofit.hardnerExpiryDate)) ? bladeRepairRetrofit.hardnerExpiryDate : "00000000";
		var glassSupplier = (_.has(bladeRepairRetrofit, "glassSupplier") && !_.isNull(bladeRepairRetrofit.glassSupplier)) ? bladeRepairRetrofit.glassSupplier : "";
		var glassBatchNumbers = (_.has(bladeRepairRetrofit, "glassBatchNumbers") && !_.isNull(bladeRepairRetrofit.glassBatchNumbers)) ? bladeRepairRetrofit.glassBatchNumbers : "";
		
		dijit.byId("ambientTemp").set("value", ambientTemp);
		dijit.byId("humidity").set("value", humidity);
		dijit.byId("bladeSurfaceTemp").set("value", bladeSurfaceTemp);
		dijit.byId("totalCureTime").set("value", totalCureTime);
		dijit.byId("vtNumber").set("value", vtNumber);
		dijit.byId("additionalDocumentRef").set("value", additionalDocumentRef);
		dijit.byId("resinType").set("value", resinType);
		dijit.byId("resinBatchNumbers").set("value", resinBatchNumbers);
		dijit.byId("hardnerType").set("value", hardnerType);
		dijit.byId("hardnerBatchNumbers").set("value", hardnerBatchNumbers);
		dijit.byId("glassSupplier").set("value", glassSupplier);
		dijit.byId("glassBatchNumbers").set("value", glassBatchNumbers);
		
		var calibrationDate = convertDate(calibrationDate, "moreInfo");
		dijit.byId("calibrationDate").set("value", calibrationDate);
		
		var resinExpiryDate = convertDate(resinExpiryDate, "moreInfo");
		dijit.byId("resinExpiryDate").set("value", resinExpiryDate);
		
		var hardnerExpiryDate = convertDate(hardnerExpiryDate, "moreInfo");
		dijit.byId("hardnerExpiryDate").set("value", hardnerExpiryDate);
		
		var display = (scope == "repair" || scope == "retrofit") ? "block" : "none";
		dojo.style(dojo.byId("bladeRepairOrRetrofit"), "display", display);
		
		tempBladeMoreInfoData.bladeRepairRetrofit = {};
		tempBladeMoreInfoData.bladeRepairRetrofit.ambientTemp = ambientTemp;
		tempBladeMoreInfoData.bladeRepairRetrofit.humidity = humidity;
		tempBladeMoreInfoData.bladeRepairRetrofit.bladeSurfaceTemp = bladeSurfaceTemp;
		tempBladeMoreInfoData.bladeRepairRetrofit.totalCureTime = totalCureTime;
		tempBladeMoreInfoData.bladeRepairRetrofit.vtNumber = vtNumber;
		tempBladeMoreInfoData.bladeRepairRetrofit.additionalDocumentRef = additionalDocumentRef;
		tempBladeMoreInfoData.bladeRepairRetrofit.resinType = resinType;
		tempBladeMoreInfoData.bladeRepairRetrofit.resinBatchNumbers = resinBatchNumbers;
		tempBladeMoreInfoData.bladeRepairRetrofit.hardnerType = hardnerType;
		tempBladeMoreInfoData.bladeRepairRetrofit.hardnerBatchNumbers = hardnerBatchNumbers;
		tempBladeMoreInfoData.bladeRepairRetrofit.glassSupplier = glassSupplier;
		tempBladeMoreInfoData.bladeRepairRetrofit.glassBatchNumbers = glassBatchNumbers;
		tempBladeMoreInfoData.bladeRepairRetrofit.calibrationDate = calibrationDate;
		tempBladeMoreInfoData.bladeRepairRetrofit.resinExpiryDate = resinExpiryDate;
		tempBladeMoreInfoData.bladeRepairRetrofit.hardnerExpiryDate = hardnerExpiryDate;
	}
	
}

function closeBladeMoreInfoDisplay() {
	dojo.query("#bladeMoreInfoPanel .dijitTextBox").forEach(function(tb) {
		var widget = dijit.getEnclosingWidget(tb);
		widget.set("value", "");
	})
	
	dojo.query("#bladeMoreInfoPanel .dijitSelect").forEach(function(sb) {
		var widget = dijit.getEnclosingWidget(sb);
		widget.set("value", "");
	})
	
	dojo.query("#bladeMoreInfoPanel textarea").forEach(function(ta) {
		ta.value = "";
	})
	
	dijit.byId("failureDate").constraints.max = new Date('0000-00-00');
	dijit.byId("dateOfInspection").constraints.min = new Date('0000-00-00');

	var inspectorState = dojo.style('bladeInspectorPanel', 'display');
	var moreInfoState = dojo.style('bladeMoreInfoPanel', 'display');
	
	dojo.byId("damageIdentified-toggle").checked = false;
	
	dijit.byId("bladeConditionSlider").set("value", 1);
	dojo.query(".bladeCondition").style("display", "none");

	if (moreInfoState == 'block' && inspectorState == 'block') {
		dojo.style('bladeViewer', 'width', '950px');
		dojo.style('bladeMoreInfoPanel', 'display', 'none');
		dijit.byId("enableMoreInfo").set('label', "Show More Info");
	}  else {
		dojo.style('bladeViewer', 'width', '610px');
		dojo.style('bladeMoreInfoPanel', 'display', 'none');
		dijit.byId("enableMoreInfo").set('label', "Show More Info");
	}
	
	dijit.byId("bladeMoreInfoTurbineData")._onTitleClick();
}

function saveBladeMoreInfoDataEdits(submit, action) {
	
	var submitCirDeferreds = [];
	
	function convertDatetoUTCString(d) {
		if (!_.isNull(d)) {
			var dt = d.getUTCFullYear() + "" + (((d.getUTCMonth())<9) ? "0" + (d.getUTCMonth() + 1) : (d.getUTCMonth() + 1)) + "" + ((d.getUTCDate()<10) ? "0" + d.getUTCDate() : d.getUTCDate());
			return dt;
		} else {
			return null;
		}
	}
	
	var turbine = _.first(dojo.filter(siteData[siteName].workOrders[workOrderNumber].data, function(turbine) { 
		return  turbine.id == turbineId; 
	}));
	var assetInspection = turbine.assetInspection;
	
	var componentCurrent = dojo.attr("bladeId", "data-blade-id");
	var componentLetter = _.last(componentCurrent.replace("blade","")).toUpperCase();
	var componentId = _.invert(turbine.components.ids)["Blade" + componentLetter];
	
	var component = turbine.components.component[componentId];
	var componentInspection = turbine.components.inspectionStatus[componentId];
	var bladeRepairRetrofit = (!_.isNull(turbine.components.bladeRepairRetrofit[componentId])) ? turbine.components.bladeRepairRetrofit[componentId] : {};
	
	//from workOrder
	//var workOrderScope = dijit.byId("reportType").get("value");
	var workOrderScope = dojo.query("#reportType input:checked")[0].value;
	var orderNumber = dijit.byId("orderNumber").get("value");
	
	//from asset
	var assetName = dijit.byId("name").get("value");
	var assetBladeLength = dijit.byId("bladeLength").get("value");
	var assetSerialNumber = dijit.byId("serial").get("value");
	
	//from assetInspection
	var runStatusAfterInspection = dijit.byId("runStatusAfterInspection").get("value");
	var runStatusAtArrival = dijit.byId("runStatusAtArrival").get("value");
	var runHours = dijit.byId("runHours").get("value");
	var generator1RunHours = dijit.byId("generator1RunHours").get("value");
	var generator2RunHours = dijit.byId("generator2RunHours").get("value");
	var totalProduction = dijit.byId("totalProduction").get("value");
	var quantityOfFailedComponents = dijit.byId("quantityOfFailedComponents").get("value");
	var failureDate = convertDatetoUTCString(dijit.byId("failureDate").get("value"));
	var dateOfInspection = convertDatetoUTCString(dijit.byId("dateOfInspection").get("value"));
	
	if (runStatusAfterInspection != '') {
		assetInspection.attributes.runStatusAfterInspection = runStatusAfterInspection;
	}
	if (runStatusAtArrival != '') {
		assetInspection.attributes.runStatusAtArrival = runStatusAtArrival;
	}
	if (runHours != '') {
		assetInspection.attributes.runHours = runHours;
	}
	if (generator1RunHours != '') {
		assetInspection.attributes.generator1RunHours = generator1RunHours;
	}
	if (generator2RunHours != '') {
		assetInspection.attributes.generator2RunHours = generator2RunHours;
	}
	if (totalProduction != '') {
		assetInspection.attributes.totalProduction = totalProduction;
	}
	if (quantityOfFailedComponents != '') {
		assetInspection.attributes.quantityOfFailedComponents = quantityOfFailedComponents;
	}
	if (!_.isNull(failureDate) && failureDate != "19700101") {
		assetInspection.failureDate = failureDate;
	}
	
	if (!_.isNull(dateOfInspection) && dateOfInspection != "19700101") {
		assetInspection.dateOfInspection = dateOfInspection;
	}
	
	var assetInspectionDeferred = dojo.xhrPost({
		url: windAmsDwVestasUrl + "assetInspection",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + authToken
		},
		postData: JSON.stringify(assetInspection),
		load: function(response) {
			console.log(response);
		},
		error: function(error){
			console.log(error);
			dojo.byId("dataWarehouseErrorContent").innerHTML = "Error saving asset inspection to the server. <br>" + error.message;
			dijit.byId("dataWarehouseError").show();
		}
	})
	submitCirDeferreds.push(assetInspectionDeferred);
	
	//from component
	var bladeItemNumber = dijit.byId("bladeItemNumber").get("value");
	var bladeSerialNumber = dijit.byId("bladeSerialNumber").get("value");
	var bladeManufacturer = dijit.byId("bladeManufacturer").get("value");
	var bladeColor = dijit.byId("bladeColor").get("value");
	
	if (bladeSerialNumber != '') {
		component.serialNumber = bladeSerialNumber;
	}
	if (bladeManufacturer != '') {
		component.make = bladeManufacturer;
	}
	if (bladeItemNumber != '') {
		component.attributes.itemNumber = bladeItemNumber;
	}
	if (bladeColor != '') {
		component.attributes.color = bladeColor;
	}
	
	var componentDeferred = dojo.xhrPost({
		url: windAmsDwVestasUrl + "component",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + authToken
		},
		postData: JSON.stringify(component),
		load: function(response) {
			console.log(response);
		},
		error: function(error){
			console.log(error);
			dojo.byId("dataWarehouseErrorContent").innerHTML = "Error saving component data to the server. <br>" + error.message;
			dijit.byId("dataWarehouseError").show();
		}
	})
	submitCirDeferreds.push(componentDeferred);
	
	//from componentInspection
	var caseNumber = dijit.byId("caseNumber").value;
	var reasonForService = dojo.byId("reasonForService").value;
	//var noBladeIdReason = dojo.byId("reasonNoBladeId").value;
	var description = dojo.byId("description").value;
	var descriptionOfConsequentialProblems = dojo.byId("descriptionOfConsequentialProblems").value;
	var overallBladeCondition = dijit.byId("bladeConditionSlider").get("value");
	
	if (caseNumber != '') {
		componentInspection.attributes.caseNumber = caseNumber;
	}
	if (reasonForService != '') {
		componentInspection.reasonForService = reasonForService;
	}
	/* if (noBladeIdReason != '') {
		componentInspection.attributes.noBladeIdReason = noBladeIdReason;
	} */
	if (description != '') {
		componentInspection.description = description;
	}
	if (descriptionOfConsequentialProblems != '') {
		componentInspection.attributes.descriptionOfConsequentialProblems = descriptionOfConsequentialProblems;
	}
	if (overallBladeCondition != '') {
		componentInspection.attributes.overallBladeCondition = overallBladeCondition;
	}
	
	var componentInspectionDeferred = dojo.xhrPost({
		url: windAmsDwVestasUrl + "componentInspection",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": 'Bearer ' + authToken
		},
		postData: JSON.stringify(componentInspection),
		load: function(response) {
			console.log(response);
			updateSiteViewerAndFeatureLayerRecords();
            updateBladeSelectorSeverity();
		},
		error: function(error){
			console.log(error);
			dojo.byId("dataWarehouseErrorContent").innerHTML = "Error saving component inspection data to the server. <br>" + error.message;
			dijit.byId("dataWarehouseError").show();
		}
	})
	submitCirDeferreds.push(componentInspectionDeferred);
	
	//from bladeRepairRetrofit
	var ambientTemp = parseInt(dijit.byId("ambientTemp").get("value"));
	var humidity = parseInt(dijit.byId("humidity").get("value"));
	var bladeSurfaceTemp = parseInt(dijit.byId("bladeSurfaceTemp").get("value"));
	var totalCureTime = parseInt(dijit.byId("totalCureTime").get("value"));
	var vtNumber = dijit.byId("vtNumber").get("value");
	var additionalDocumentRef = dijit.byId("additionalDocumentRef").get("value");
	var resinType = dijit.byId("resinType").get("value");
	var resinBatchNumbers = dijit.byId("resinBatchNumbers").get("value");
	var hardnerType = dijit.byId("hardnerType").get("value");
	var hardnerBatchNumbers = dijit.byId("hardnerBatchNumbers").get("value");
	var glassSupplier = dijit.byId("glassSupplier").get("value");
	var glassBatchNumbers = dijit.byId("glassBatchNumbers").get("value");
	var calibrationDate = convertDatetoUTCString(dijit.byId("calibrationDate").get("value"));
	var resinExpiryDate = convertDatetoUTCString(dijit.byId("resinExpiryDate").get("value"));
	var hardnerExpiryDate = convertDatetoUTCString(dijit.byId("hardnerExpiryDate").get("value"));
	
	if (ambientTemp != '' && !_.isNaN(ambientTemp)) {
		bladeRepairRetrofit.ambientTemp = ambientTemp;
	}
	if (humidity != '' && !_.isNaN(humidity)) {
		bladeRepairRetrofit.humidity = humidity;
	}
	if (bladeSurfaceTemp != '' && !_.isNaN(bladeSurfaceTemp)) {
		bladeRepairRetrofit.bladeSurfaceTemp = bladeSurfaceTemp;
	}
	if (totalCureTime != '' && !_.isNaN(totalCureTime)) {
		bladeRepairRetrofit.totalCureTime = totalCureTime;
	}
	if (vtNumber != '') {
		bladeRepairRetrofit.vtNumber = vtNumber;
	}
	if (additionalDocumentRef != '') {
		bladeRepairRetrofit.additionalDocumentRef = additionalDocumentRef;
	}
	if (resinType != '') {
		bladeRepairRetrofit.resinType = resinType;
	}
	if (hardnerType != '') {
		bladeRepairRetrofit.hardnerType = hardnerType;
	}
	if (hardnerBatchNumbers != '') {
		bladeRepairRetrofit.hardnerBatchNumbers = hardnerBatchNumbers;
	}
	if (glassSupplier != '') {
		bladeRepairRetrofit.glassSupplier = glassSupplier;
	}
	if (glassBatchNumbers != '') {
		bladeRepairRetrofit.glassBatchNumbers = glassBatchNumbers;
	}
	if (!_.isNull(calibrationDate) && calibrationDate != "19700101") {
		bladeRepairRetrofit.calibrationDate = calibrationDate;
	}
	if (!_.isNull(resinExpiryDate) && resinExpiryDate != "19700101") {
		bladeRepairRetrofit.resinExpiryDate = resinExpiryDate;
	}
	if (!_.isNull(hardnerExpiryDate) && hardnerExpiryDate != "19700101") {
		bladeRepairRetrofit.hardnerExpiryDate = hardnerExpiryDate;
	}
	
	if (!_.isEmpty(bladeRepairRetrofit)) {
		var bladeRepairRetrofitDeferred = dojo.xhrPost({
			url: windAmsDwVestasUrl + "bladeRepairRetrofit",
			handleAs: "json",
			headers: {
				"Content-Type": "application/json",
				"Authorization": 'Bearer ' + authToken
			},
			postData: JSON.stringify(bladeRepairRetrofit),
			load: function(response) {
				console.log(response);
			},
			error: function(error){
				console.log(error);
				dojo.byId("dataWarehouseErrorContent").innerHTML = "Error saving component inspection data to the server. <br>" + error.message;
				dijit.byId("dataWarehouseError").show();
			}
		})
		submitCirDeferreds.push(bladeRepairRetrofitDeferred);
	}
	
	var submitCirDeferredList = new dojo.DeferredList(submitCirDeferreds);
    submitCirDeferredList.then(function(results) {
		
		cirNumber = (cirNumber != "") ? dijit.byId("cirNumber").get("value") : componentInspection.id;
		
		if (submit) {
			dojo.byId("submitCirProcessText").innerHTML = "2. Submitting CIR Report ...";
			var approve = (action == "approve") ? "/?approved=true" : "";
			dojo.xhrPost({
				url: windAmsDwVestasUrl + "vestas/cir/" + cirNumber + "/submit" + approve,
				handleAs: "json",
				headers: {
					"Content-Type": "application/json",
					"Authorization": 'Bearer ' + authToken
				},
				load: function(response) {
					dojo.byId("submitCirProcessText").innerHTML = "3. CIR Report ... <b>Submission successful!</b>";
					dojo.byId("submitCirProcessSpinner").innerHTML = '<i class="fa fa-check-circle-o"></i>';
					
					console.log(response);
					
					turbine.components.inspectionStatus[componentId] = response;
					
					dijit.byId("cirNumber").set("value", response.vendorId);
					
					var bladeId = dojo.attr("bladeId", "data-blade-id");
					getCurrentBladeInspectionStatus(bladeId);
					populateBladeInspectionStatus();
					
					updateOverallBladeConditionSeverity();
	
					enableBladeMoreInfoContent(false);
					
					window.setTimeout(function() {
						submitCirProcess.hide();
					}, 2000)
					
				},
				error: function(error){
					console.log(error);
					dojo.byId("dataWarehouseErrorContent").innerHTML = "Error submitting to CIR. <br>" + error.message;
					dijit.byId("dataWarehouseError").show();
				}
			})
		}
	});
}

function updateSiteDataBladeMoreInfo(inspectionEvent){

}

function undoBladeMoreInfoDataEdits(exit) {
	var scope = tempBladeMoreInfoData.scope;
	var serviceOrderNumber = tempBladeMoreInfoData.serviceOrderNumber;
	
	var assetSerial = tempBladeMoreInfoData.assetSerial;
	var assetName = tempBladeMoreInfoData.assetName;
	var assteBladeLength = tempBladeMoreInfoData.assteBladeLength;
	
	var dateOfInspection = tempBladeMoreInfoData.dateOfInspection;
	var failureDate = tempBladeMoreInfoData.failureDate;
	//var runStatus = tempBladeMoreInfoData.runStatus;
	var runHours = tempBladeMoreInfoData.runHours;
	var generator1RunHours = tempBladeMoreInfoData.generator1RunHours;
	var generator2RunHours = tempBladeMoreInfoData.generator2RunHours;
	var totalProduction = tempBladeMoreInfoData.totalProduction;
	var runStatusAfterInspection = tempBladeMoreInfoData.runStatusAfterInspection;
	var runStatusAtArrival = tempBladeMoreInfoData.runStatusAtArrival;
	var quantityOfFailedComponents = tempBladeMoreInfoData.quantityOfFailedComponents;
	
	var componentItemNumber = tempBladeMoreInfoData.componentItemNumber;
	var componentSerial = tempBladeMoreInfoData.componentSerial;
	var componentMake = tempBladeMoreInfoData.componentMake;
	var componentColor = tempBladeMoreInfoData.componentColor;
	
	var cirNumber = tempBladeMoreInfoData.cirNumber;
	var caseNumber = tempBladeMoreInfoData.caseNumber;
	var reasonForService = tempBladeMoreInfoData.reasonForService;
	var description = tempBladeMoreInfoData.description;
	var plateImageResourceId = tempBladeMoreInfoData.plateImageResourceId;
	var descriptionOfConsequentialProblems = tempBladeMoreInfoData.descriptionOfConsequentialProblems;
	//var noBladeIdReason = tempBladeMoreInfoData.noBladeIdReason;
	var damageIdentified = tempBladeMoreInfoData.damageIdentified;
	var overallBladeCondition = tempBladeMoreInfoData.overallBladeCondition;
	
	/* 
	var additionalInformation = tempBladeMoreInfoData.additionalInformation;
	var sbuRecommendation = tempBladeMoreInfoData.sbuRecommendation;
	var alarmLogNumber = tempBladeMoreInfoData.alarmLogNumber;
	var vestasConfidentialComments = tempBladeMoreInfoData.vestasConfidentialComments
	*/
	
	//from workOrder
	dojo.query("#reportType input[value=" + scope + "]")[0].checked = true;
	//dijit.byId("reportType").set("value", scope);
	dijit.byId("orderNumber").set("value", serviceOrderNumber);
	
	//from asset
	dijit.byId("name").set("value", assetName);
	dijit.byId("serial").set("value", assetSerial);
	dijit.byId("bladeLength").set("value", assteBladeLength);
	
	//from assetInspection
	//dijit.byId("runStatus").set("value", runStatus);
	dijit.byId("runStatusAfterInspection").set("value", runStatusAfterInspection);
	dijit.byId("runStatusAtArrival").set("value", runStatusAtArrival);
	dijit.byId("runHours").set("value", runHours);
	dijit.byId("generator1RunHours").set("value", generator1RunHours);
	dijit.byId("generator2RunHours").set("value", generator2RunHours);
	dijit.byId("totalProduction").set("value", totalProduction);
	dijit.byId("quantityOfFailedComponents").set("value", quantityOfFailedComponents);
	var failureDate = convertDate(failureDate, "moreInfo");
	var dateOfInspection = convertDate(dateOfInspection, "moreInfo");
	dijit.byId("failureDate").constraints.max = new Date(dateOfInspection);
	dijit.byId("dateOfInspection").constraints.min = new Date(failureDate);
	dijit.byId("failureDate").set("value", new Date(failureDate));
	dijit.byId("dateOfInspection").set("value", new Date(dateOfInspection));
	
	//from component
	dijit.byId("bladeItemNumber").set("value", componentItemNumber);
	dijit.byId("bladeSerialNumber").set("value", componentSerial);
	dijit.byId("bladeManufacturer").set("value", componentMake);
	dijit.byId("bladeColor").set("value", componentColor);
	
	//from componentInspection
	dijit.byId("cirNumber").set("value", cirNumber);
	dijit.byId("caseNumber").set("value", caseNumber);
	dojo.byId("reasonForService").value = reasonForService;
	dojo.byId("description").value = description;
	dojo.byId("descriptionOfConsequentialProblems").value = descriptionOfConsequentialProblems;
	//dojo.byId("reasonNoBladeId").value = noBladeIdReason;
	
	dojo.byId("damageIdentified-toggle").checked = damageIdentified;
	dijit.byId("bladeConditionSlider").set("value", overallBladeCondition);
	
	/* dojo.byId("additionalInformation").value = additionalInformation;
	dojo.byId("sbuRecommendation").value = sbuRecommendation;
	dijit.byId("alarmLogNumber").set("value", alarmLogNumber);
	dojo.byId("vestasConfidentialComments").value = vestasConfidentialComments; */
	
	if (!_.isEmpty(tempBladeMoreInfoData.bladeRepairRetrofit)) {
		var ambientTemp = tempBladeMoreInfoData.bladeRepairRetrofit.ambientTemp;
		var humidity = tempBladeMoreInfoData.bladeRepairRetrofit.humidity;
		var bladeSurfaceTemp = tempBladeMoreInfoData.bladeRepairRetrofit.bladeSurfaceTemp;
		var totalCureTime = tempBladeMoreInfoData.bladeRepairRetrofit.totalCureTime;
		var vtNumber = tempBladeMoreInfoData.bladeRepairRetrofit.vtNumber;
		var additionalDocumentRef = tempBladeMoreInfoData.bladeRepairRetrofit.additionalDocumentRef;
		var resinType = tempBladeMoreInfoData.bladeRepairRetrofit.resinType;
		var resinBatchNumbers = tempBladeMoreInfoData.bladeRepairRetrofit.resinBatchNumbers;
		var hardnerType = tempBladeMoreInfoData.bladeRepairRetrofit.hardnerType;
		var hardnerBatchNumbers = tempBladeMoreInfoData.bladeRepairRetrofit.hardnerBatchNumbers;
		var glassSupplier = tempBladeMoreInfoData.bladeRepairRetrofit.glassSupplier;
		var glassBatchNumbers = tempBladeMoreInfoData.bladeRepairRetrofit.glassBatchNumbers;
		var calibrationDate = tempBladeMoreInfoData.bladeRepairRetrofit.calibrationDate;
		var resinExpiryDate = tempBladeMoreInfoData.bladeRepairRetrofit.resinExpiryDate;
		var hardnerExpiryDate = tempBladeMoreInfoData.bladeRepairRetrofit.hardnerExpiryDate;
		
		dijit.byId("ambientTemp").set("value", ambientTemp);
		dijit.byId("humidity").set("value", humidity);
		dijit.byId("bladeSurfaceTemp").set("value", bladeSurfaceTemp);
		dijit.byId("totalCureTime").set("value", totalCureTime);
		dijit.byId("vtNumber").set("value", vtNumber);
		dijit.byId("additionalDocumentRef").set("value", additionalDocumentRef);
		dijit.byId("resinType").set("value", resinType);
		dijit.byId("resinBatchNumbers").set("value", resinBatchNumbers);
		dijit.byId("hardnerType").set("value", hardnerType);
		dijit.byId("hardnerBatchNumbers").set("value", hardnerBatchNumbers);
		dijit.byId("glassSupplier").set("value", glassSupplier);
		dijit.byId("glassBatchNumbers").set("value", glassBatchNumbers);
		
		var calibrationDate = convertDate(calibrationDate, "moreInfo");
		dijit.byId("calibrationDate").set("value", calibrationDate);
		
		var resinExpiryDate = convertDate(resinExpiryDate, "moreInfo");
		dijit.byId("resinExpiryDate").set("value", resinExpiryDate);
		
		var hardnerExpiryDate = convertDate(hardnerExpiryDate, "moreInfo");
		dijit.byId("hardnerExpiryDate").set("value", hardnerExpiryDate);
		
		var display = (scope == "repair" || scope == "retrofit") ? "block" : "none";
		dojo.style(dojo.byId("bladeRepairOrRetrofit"), "display", display);
		
	}
	
	if (exit) {
		enableBladeMoreInfoContent(false);
	}
	
}

function updateOverallBladeConditionSeverity() {
	var bladeSeverity = dojo.map(bladeInspectionEventsData, function(item) { return item.severity })
	var overallBladeCondition = (bladeSeverity.length > 0) ? _.max(bladeSeverity) : dijit.byId("bladeConditionSlider").get("value");
	dijit.byId("bladeConditionSlider").set("value", overallBladeCondition);
}

function submitCIR(action) {
	if (checkBladeMoreInfoFields()) {
		dojo.byId("submitCirProcessText").innerHTML = "1. Compiling data for the CIR Report ...";
		dojo.byId("submitCirProcessSpinner").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
		submitCirProcess.show();
		saveBladeMoreInfoDataEdits(true, action);
	}	
}

function checkBladeMoreInfoFields(){
    var check = true;
	
	var orderNumber = dijit.byId("orderNumber").get("value");
	var cirNumber = dijit.byId("cirNumber").value;
	var caseNumber = dijit.byId("caseNumber").value;
	var assetSerialNumber = dijit.byId("serial").get("value");
	var runStatusAfterInspection = dijit.byId("runStatusAfterInspection").get("value");
	var runStatusAtArrival = dijit.byId("runStatusAtArrival").get("value");
	var runHours = dijit.byId("runHours").get("value");
	var generator1RunHours = dijit.byId("generator1RunHours").get("value");
	var generator2RunHours = dijit.byId("generator2RunHours").get("value");
	var totalProduction = dijit.byId("totalProduction").get("value");
	var failureDate = dijit.byId("failureDate").get("value");
	var dateOfInspection = dijit.byId("dateOfInspection").get("value");
	
	
    if (cirNumber == "") {
        check = false;
        dojo.addClass(dojo.byId("cirNumberRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("cirNumber");
	}
    if (caseNumber == "") {
        check = false;
        dojo.addClass(dojo.byId("caseNumberRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("caseNumber");
	}
	if (assetSerialNumber == "") {
        check = false;
        dojo.addClass(dojo.byId("serialRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("serial");
	}
	/* if (runStatusAfterInspection == "0") {
        check = false;
        dojo.addClass(dojo.byId("runStatusAfterInspectionRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("runStatusAfterInspection");
	}
	if (runStatusAtArrival == "0") {
        check = false;
        dojo.addClass(dojo.byId("runStatusAtArrivalRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("runStatusAtArrival");
	} */
	if (runHours == "") {
        check = false;
        dojo.addClass(dojo.byId("runHoursRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("runHours");
	}
	if (generator1RunHours == "") {
        check = false;
        dojo.addClass(dojo.byId("generator1RunHoursRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("generator1RunHours");
	}
	if (generator2RunHours == "") {
        check = false;
        dojo.addClass(dojo.byId("generator2RunHoursRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("generator2RunHours");
	}
	if (totalProduction == "") {
        check = false;
        dojo.addClass(dojo.byId("totalProductionRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("totalProduction");
	}
	if (_.isNull(failureDate)) {
        check = false;
        dojo.addClass(dojo.byId("failureDateRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("failureDate");
	}
	if (_.isNull(dateOfInspection)) {
        check = false;
        dojo.addClass(dojo.byId("dateOfInspectionRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("dateOfInspection");
	}
	
	var bladeItemNumber = dijit.byId("bladeItemNumber").get("value");
	var bladeSerialNumber = dijit.byId("bladeSerialNumber").get("value");
	var assetBladeLength = dijit.byId("bladeLength").get("value");
	var bladeManufacturer = dijit.byId("bladeManufacturer").get("value");
	var bladeColor = dijit.byId("bladeColor").get("value");
	var description = dojo.byId("description").value;
	var additionalInformation = dojo.byId("additionalInformation").value;
	var sbuRecommendation = dojo.byId("sbuRecommendation").value;
	var alarmLogNumber = dijit.byId("alarmLogNumber").get("value");
	var vestasConfidentialComments = dojo.byId("vestasConfidentialComments").value;
	var descriptionOfConsequentialProblems = dojo.byId("descriptionOfConsequentialProblems").value;
	var overallBladeCondition = dijit.byId("bladeConditionSlider").get("value");
	
	if (bladeItemNumber == "") {
        check = false;
        dojo.addClass(dojo.byId("bladeItemNumberRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("bladeItemNumber");
	}
	if (bladeSerialNumber == "") {
        check = false;
        dojo.addClass(dojo.byId("bladeSerialNumberRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("bladeSerialNumber");
	}
	if (assetBladeLength == "") {
        check = false;
        dojo.addClass(dojo.byId("bladeLengthRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("bladeLength");
	}
	if (bladeManufacturer == "") {
        check = false;
        dojo.addClass(dojo.byId("bladeManufacturerRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("bladeManufacturer");
	}
	if (bladeColor == "") {
        check = false;
        dojo.addClass(dojo.byId("bladeColorRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("bladeColor");
	}
	if (description == "") {
        check = false;
        dojo.addClass(dojo.byId("descriptionRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("description");
	}
	if (additionalInformation == "") {
        check = false;
        dojo.addClass(dojo.byId("additionalInformationRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("additionalInformation");
	}
	if (sbuRecommendation == "") {
        check = false;
        dojo.addClass(dojo.byId("sbuRecommendationRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("sbuRecommendation");
	}
	if (alarmLogNumber == "") {
        check = false;
        dojo.addClass(dojo.byId("alarmLogNumberRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("alarmLogNumber");
	}
	if (vestasConfidentialComments == "") {
        check = false;
        dojo.addClass(dojo.byId("vestasConfidentialCommentsRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("vestasConfidentialComments");
	}
	if (descriptionOfConsequentialProblems == "") {
        check = false;
        dojo.addClass(dojo.byId("descriptionOfConsequentialProblemsRowLabel"), "highlightInspectionEventLabel");
    } else {
		clearBladeMoreInfoFieldHighlight("descriptionOfConsequentialProblems");
	}
	
	
	if (_.has(tempBladeMoreInfoData, "bladeRepairRetrofit") && !_.isEmpty(tempBladeMoreInfoData.bladeRepairRetrofit)){
		var ambientTemp = dijit.byId("ambientTemp").get("value");
		var humidity = dijit.byId("humidity").get("value");
		var bladeSurfaceTemp = parseInt(dijit.byId("bladeSurfaceTemp").get("value"));
		var totalCureTime = parseInt(dijit.byId("totalCureTime").get("value"));
		
		if (ambientTemp == "") {
			check = false;
			dojo.addClass(dojo.byId("ambientTempRowLabel"), "highlightInspectionEventLabel");
		}
		if (humidity == "") {
			check = false;
			dojo.addClass(dojo.byId("humidityRowLabel"), "highlightInspectionEventLabel");
		}
		if (bladeSurfaceTemp == "") {
			check = false;
			dojo.addClass(dojo.byId("bladeSurfaceTempRowLabel"), "highlightInspectionEventLabel");
		}
		if (totalCureTime == "") {
			check = false;
			dojo.addClass(dojo.byId("totalCureTimeRowLabel"), "highlightInspectionEventLabel");
		}
	}
    return check;
}

function clearBladeMoreInfoFieldHighlight(name) {
    dojo.removeClass(dojo.byId(name + "RowLabel"), "highlightInspectionEventLabel");
}

function showBladeMoreInfoRequiredFieldLabels(editing){
    if (editing){
        dojo.byId("cirNumberRowLabel").innerHTML = "Observation Type:";
        dojo.byId("findingTypeRowLabel").innerHTML = "Finding Type (required):";
        dojo.byId("surfaceTypeRowLabel").innerHTML = "Surface (required):";  
    } else {
        dojo.byId("damageTypeRowLabel").innerHTML = "Observation Type:";
        dojo.byId("findingTypeRowLabel").innerHTML = "Finding Type:";
        dojo.byId("surfaceTypeRowLabel").innerHTML = "Surface:"; 
    }
}

function enableSubmitApproveButton(value) {
	/* var role = (_.indexOf(authRoles, 'Inspector') > -1 || _.indexOf(authRoles, 'Admin') > -1 || _.indexOf(authRoles, 'OrgAdmin') > -1 || _.indexOf(authRoles, 'SiteAdmin') > -1) ? 'inspector' : (_.indexOf(authRoles, 'read_report') > -1) ? 'report' : 'guest';
	if (role == '') {}
		if (value > 2) {
			setAnnotationToolDisplay('submitApproveMoreInfoData', true);
		} else {
			setAnnotationToolDisplay('submitApproveMoreInfoData', false);
		}
	} */
}