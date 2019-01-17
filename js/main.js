function init() {
	/* initAAD();
	if (window.location == window.parent.location) {
		loadMainApp();
	} */
	
	loadMainApp();

	bladeImageGallery = $('#image-gallery').lightSlider({
		gallery:true,
		item:1,
		thumbItem:5,
		vertical:true,
		verticalHeight: 375,
		vThumbWidth: 100,
		thumbMargin: 2,
		galleryMargin:0,
		slideMargin: 0,
		speed:500,
		auto:false,
		loop:false,
		onSliderLoad: function() {
			$('#image-gallery').removeClass('cS-hidden');
		}
	});	
}

function loadMainApp(){
	console.log('loading app...');
	initializeJqScrollPane();
	dijit.byId("application").resize();
	
	dojo.connect(window, "onresize", function(){
		resizeViewerPanel("bladeViewer");
		resizeViewerPanel("lasViewer");
		
		var viewId = (siteView == "DistributionLine") ? "site" : "transmission";
		resizeViewerPanel(viewId + "Viewer");
		
        renderWindSiteSelector();
        
        dojo.style("mapProgressBar", { 
            top: dojo.style("map", "height")/2 - dojo.style("mapProgressBar", "height")/2 + "px",
            left: dojo.style("map", "width")/2 - dojo.style("mapProgressBar", "width")/2 + "px"
        });
        
        dojo.style("map-legend", {
            left: dojo.style("map", "width")/2 - dojo.style("map-legend", "width")/2 + "px"
        });
	});

	dojo.style("mapProgressBar", { 
        display:"none",
        top: dojo.style("map", "height")/2 - dojo.style("mapProgressBar", "height")/2 + "px",
        left: dojo.style("map", "width")/2 - dojo.style("mapProgressBar", "width")/2 + "px"
	});
    
    dojo.style("map-legend", {
        left: dojo.style("map", "width")/2 - dojo.style("map-legend", "width")/2 + "px"
    });
	
	var height = dojo.coords("bladeViewerOuterContent").h - dojo.coords("siteViewerInnerTop").h - 40;
	dojo.style("siteViewerInnerCenter", "height", height + "px");
	dojo.style("siteViewerRecords", "height", (height - dojo.coords('siteViewerRecordsText').h) + "px");
	dojo.style("siteViewerRecordsTable", "height", (height - dojo.coords('siteViewerRecordsText').h) + "px");
	resizeViewerPanel("siteViewer");
	dojo.style("header", "visibility", "visible");
	dojo.query(".mapButtons").style("visibility", "visible");
    
    var siteViewerMoveableDiv = new dojo.dnd.move.parentConstrainedMoveable("siteViewer", {
        handle: dojo.byId("siteViewerHeader"),
        area: "border",
        within: true
    });
    dojo.connect(siteViewerMoveableDiv,"onDragDetected", function() {
        /* var status = dojo.attr("siteViewerFilterDiv", 'data-site-filter-status');
        if (status == "open") {
            wipeNode("in", {node:"siteViewerFilterDiv", duration:1 }).play();
            dojo.attr("siteViewerFilterDiv", 'data-site-filter-status', 'closed');
        } */
    })
	dojo.connect(siteViewerMoveableDiv,"onMouseDown", function(evt) {
        var id = 'siteViewer';
		var z = {
			'siteViewer': 60,
			'bladeViewer': 50,
			'lasViewer':50
		}
		z[id] = z[id] + 1;
		_.each(_.keys(z), function(i) {
			dojo.style(i, "z-index", z[i])
		})
    })
	dojo.connect(dojo.byId('siteViewer'), 'onmousedown', function(evt) {
		var id = this.id;
		var z = {
			'siteViewer': 60,
			'bladeViewer': 50,
			'lasViewer':50
		}
		z[id] = z[id] + 1;
		_.each(_.keys(z), function(i) {
			dojo.style(i, "z-index", z[i])
		})
	})
    
	var bladeViewerMoveableDiv = new dojo.dnd.move.parentConstrainedMoveable("bladeViewer", {
        handle: dojo.byId("bladeViewerHeader"),
        area: "border",
        within: true
    });
	dojo.connect(bladeViewerMoveableDiv,"onMouseDown", function(evt) {
        var id = 'bladeViewer';
		var z = {
			'siteViewer': 50,
			'bladeViewer': 60,
			'lasViewer':50
		}
		z[id] = z[id] + 1;
		_.each(_.keys(z), function(i) {
			dojo.style(i, "z-index", z[i])
		})
    })
	dojo.connect(dojo.byId('bladeViewer'), 'onmousedown', function(evt) {
		var id = this.id;
		var z = {
			'siteViewer': 50,
			'bladeViewer': 60,
			'lasViewer':50
		}
		z[id] = z[id] + 1;
		_.each(_.keys(z), function(i) {
			dojo.style(i, "z-index", z[i])
		})
	})
	
	var lasViewerMoveableDiv = new dojo.dnd.move.parentConstrainedMoveable("lasViewer", {
        handle: dojo.byId("lasViewerHeader"),
        area: "border",
        within: true
    });
	dojo.connect(lasViewerMoveableDiv,"onMouseDown", function(evt) {
        var id = 'bladeViewer';
		var z = {
			'siteViewer': 50,
			'bladeViewer': 50,
			'lasViewer':60
		}
		z[id] = z[id] + 1;
		_.each(_.keys(z), function(i) {
			dojo.style(i, "z-index", z[i])
		})
    })
	dojo.connect(dojo.byId('lasViewer'), 'onmousedown', function(evt) {
		var id = this.id;
		var z = {
			'siteViewer': 50,
			'bladeViewer': 50,
			'lasViewer':60
		}
		z[id] = z[id] + 1;
		_.each(_.keys(z), function(i) {
			dojo.style(i, "z-index", z[i])
		})
	})
	
    createBugReportForm();
	createAboutDialog();
	
    esriConfig.defaults.io.corsEnabledServers.push("testing.inspectools.net/webservices");
	esriConfig.defaults.io.corsEnabledServers.push("ec2-54-173-18-139.compute-1.amazonaws.com");
	esriConfig.defaults.io.corsEnabledServers.push("services.inspectools.net");
	esriConfig.defaults.io.corsEnabledServers.push("services2.inspectools.net");
	esriConfig.defaults.io.corsEnabledServers.push("windamsresources.s3-us-west-2.amazonaws.com");
	esriConfig.defaults.io.corsEnabledServers.push("maps.inspectools.net");
	
	//set initial extent and levels of detail (lods) for map
	initialExtent = new esri.geometry.Extent({
	"xmin": -15831654,
	"ymin": 2494393,
	"xmax": -6439072,
	"ymax": 6995005,
	"spatialReference": {
	  "wkid": 102100
	}
	});
	
	map = new esri.Map("map", {	
		"extent": initialExtent,
		"fitExtent": false,
		"logo": true,
		"minZoom":2,
		"maxZoom":16,
		"sliderPosition": "top-right",
		"fadeOnZoom": true,
		"force3DTransforms": true,
		"navigationMode": "css-transforms"
		//"basemap": "national-geographic"
	});
	
	dojo.connect(map, 'onLoad', function(map) {
		
		//tooltip = dojo.create("div", { "class": "maptooltip", "innerHTML": "" }, dijit.byId('center').domNode);
		tooltip = _.first(dojo.query(".maptooltip"));
		dojo.style(tooltip, { "position": "fixed", "display": "none" });
	});
	
	veSatelliteTileLayer = new esri.virtualearth.VETiledLayer({
		bingMapsKey: "AirWMJ4HSjTJERBJANEmA2-A4U9VIkH7ZKO2zdDIrRwW4byZyLGeWLcUK2u532Ji",
		mapStyle: esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL_WITH_LABELS
	});
	map.addLayer(veSatelliteTileLayer);
	veSatelliteTileLayer.hide();
	
	veRoadTileLayer = new esri.virtualearth.VETiledLayer({
		bingMapsKey: "AirWMJ4HSjTJERBJANEmA2-A4U9VIkH7ZKO2zdDIrRwW4byZyLGeWLcUK2u532Ji",
		className:"veTileGray",
		mapStyle: esri.virtualearth.VETiledLayer.MAP_STYLE_ROAD
	});
	map.addLayer(veRoadTileLayer);
	
	dojo.connect(dojo.byId("mapHomeButton"), "onclick", function(){
		var bladeViewerClose = dojo.fx.slideTo({
			node: 'bladeViewer',
			left: -(dojo.coords("bladeViewer").w + 5),
			top: dojo.style("bladeViewer", "top"),
			beforeBegin:  function() {
				dojo.attr('bladeViewer','data-blade-viewer-status', 'closed');
			}
		});
		var siteViewerClose = dojo.fx.slideTo({
			node: 'siteViewer',
			left: -(dojo.coords("siteViewer").w + 5),
			top: dojo.style("siteViewer", "top"),
			beforeBegin:  function() {
				dojo.attr('siteViewer','data-site-viewer-status', 'closed');
			}
		});
		var lasViewerClose = dojo.fx.slideTo({
			node: 'lasViewer',
			left: -(dojo.coords("lasViewer").w + 5),
			top: dojo.style("lasViewer", "top"),
			beforeBegin:  function() {
				dojo.attr('lasViewer','data-las-viewer-status', 'closed');
			}
		});
		
		dojo.fx.combine([bladeViewerClose, siteViewerClose, lasViewerClose]).play();
		resetBladeViewerPanel();
		//resetSiteViewerPanel();
		//dijit.byId('siteViewerDropDown').set('value', '');
		//dojo.style("siteViewerRecordsTable", "backgroundImage", "none");
        
        //hide map legend
        //dojo.style('map-legend', 'visibility', 'hidden');
        
        var extent = (authUser != "") ? authExtent : initialExtent;
        map.setExtent(extent.expand(1.5),true);
        
        window.setTimeout(function(){
            windFeatureLayer.show();
        }, 1000);
	});
	dojo.connect(dojo.byId('mapHomeButton'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Reset the<br>Viewer', 'side');
	});	
	dojo.connect(dojo.byId('mapHomeButton'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId("mapBaseSatellite"), "onclick", function(){
		veSatelliteTileLayer.show();
		veRoadTileLayer.hide();
	});
	dojo.connect(dojo.byId('mapBaseSatellite'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Show Imagery<br>Basemap', 'side');
	});	
	dojo.connect(dojo.byId('mapBaseSatellite'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId("mapBaseRoad"), "onclick", function(){
		veSatelliteTileLayer.hide();
		veRoadTileLayer.show();
	});
	dojo.connect(dojo.byId('mapBaseRoad'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Show Streets<br>Basemap', 'side');
	});	
	dojo.connect(dojo.byId('mapBaseRoad'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId("mapWindSite"), "onclick", function(){
		toggleWindSiteSelector();
	});
	dojo.connect(dojo.byId('mapWindSite'), 'onmousemove', function(evt) {
		var assetType = (siteView == "DistributionLine") ? "Feeder" : "Line";
		showToolTip(evt, 'Select a<br>' + assetType, 'side');
	});	
	dojo.connect(dojo.byId('mapWindSite'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId("bladeViewerButton"), "onclick", function(){
		var status = dojo.attr('bladeViewer', 'data-blade-viewer-status');
		var otherStatus = dojo.attr('siteViewer', 'data-site-viewer-status');
		if (status == 'closed') {
			openViewerPanel("bladeViewer");
			if (otherStatus == 'closed') {
				var centroid = getMapCentroid();
				shiftMapCenter(centroid.x, centroid.y, "bladeViewer");
			}
			if (dijit.byId("siteViewerGrid") !== undefined) {
				var item = dijit.byId("siteViewerGrid").selection.getSelected()[0];
				if (item) {
					var features = windFeatureLayer.graphics;
					var id = item["uniqueId"];
					var ids = dojo.map(features, function(feature){ return feature.attributes['uniqueId']; });
					var index = dojo.indexOf(ids, id);
					populateBladeViewerContent(features[index], true);
				} else {
					resetBladeViewerPanel();
				}
			}
		} else {
			closeViewerPanel("bladeViewer");
		}
	});
	dojo.connect(dojo.byId('bladeViewerButton'), 'onmousemove', function(evt) {
		var assetType = (siteView == "DistributionLine") ? "Pole" : "Structure";
		showToolTip(evt, 'Open ' + assetType + '<br>Viewer', 'side');
	});	
	dojo.connect(dojo.byId('bladeViewerButton'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId("siteViewerButton"), "onclick", function(){
		var status = dojo.attr('siteViewer', 'data-site-viewer-status');
		var otherStatus = dojo.attr('bladeViewer', 'data-blade-viewer-status');
		if (status == 'closed') {
			openViewerPanel("siteViewer");
			if (otherStatus == 'closed') {
				var centroid = getMapCentroid();
				shiftMapCenter(centroid.x, centroid.y, "siteViewer");
			}
		} else {
			closeViewerPanel("siteViewer");
		}
	});
	dojo.connect(dojo.byId('siteViewerButton'), 'onmousemove', function(evt) {
		var assetType = (siteView == "DistributionLine") ? "Feeder" : "Line";
		showToolTip(evt, 'Open ' + assetType + '<br>Viewer', 'side');
	});	
	dojo.connect(dojo.byId('siteViewerButton'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId("switchViewButton"), "onclick", function(){
		var view = (siteView == "DistributionLine") ? "TransmissionLine" : "DistributionLine";
		
		var viewClass = (siteView == "DistributionLine") ? "transmission" : "distribution";
		dojo.removeClass(dojo.byId("switchViewButton"), "distribution transmission");
		dojo.addClass(dojo.byId("switchViewButton"), viewClass);
		
		switchViews(view);
	});
	dojo.connect(dojo.byId('switchViewButton'), 'onmousemove', function(evt) {
		var assetType = (siteView == "DistributionLine") ? "Transmission" : "Distribution";
		showToolTip(evt, 'Set the view to<br>' + assetType, 'side');
	});	
	dojo.connect(dojo.byId('switchViewButton'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId("bladeViewerImageOuter"), "onmouseover", function(){
			 dojo.query('.zoomifyBladeViewerImageNav').style({ "display":"block"});
		});
		
	dojo.connect(dojo.byId("bladeViewerImageOuter"), "onmouseout", function(){
		 dojo.query('.zoomifyBladeViewerImageNav').style({ "display":"none"});
	});
	
	dojo.connect(dojo.byId("zoomify-up"), "onclick", function(){
		bladeImageGallery.goToPrevSlide();
	});
	
	dojo.connect(dojo.byId("zoomify-down"), "onclick", function(){
		bladeImageGallery.goToNextSlide();
	});
	
	var enableMoreInfoButton = new dijit.form.Button({
        id: "enableMoreInfo",
		label: "Hide Inspection Details",
        style: "font-size: 12px;",
		iconClass: "dijitEditorIcon enableMoreInfo",
		disabled: false,
		onClick: function(){
			
			var viewId = (siteView == "DistributionLine") ? "distribution" : "transmission";
			var inspectorState = dojo.style(viewId + 'InspectorPanel', 'display');
			
            if (inspectorState == 'none') {
                dojo.style('bladeViewer', 'width', '950px');
                dojo.style(viewId + 'InspectorPanel', 'display', 'block');
                this.set('label', "Hide Inspection Details");
            }  else {
                dojo.style('bladeViewer', 'width', '610px');
                dojo.style(viewId + 'InspectorPanel', 'display', 'none');
                this.set('label', "Show Inspection Details");
            }
            
			var api = $("#" + viewId + "InspectionDataTableContent").data('jsp');
			api.reinitialise();
        }
		
    }, "bladeMoreInfoButton");
    
    var bladeInspectionDownloadProgressBar = new dijit.ProgressBar({
        id: "bladeInspectionDownloadProgressBar",
        minimum:0,
        maximum:1,
        style: "width: 100%"
	}, "bladeInspectionDownloadProgressBar")
    
    dojo.connect(dojo.byId("bladeInspectionReportDownload"),"click", function(){
		var url = siteData[siteId].workOrders[workOrderNumber].summary.objects.poleInspectionSummary[turbineName].designReportURL;
		window.open(url, '_blank');
    });
    dojo.connect(dojo.byId('bladeInspectionReportDownload'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Open Design<br>report (PDF)');
	});	
	dojo.connect(dojo.byId('bladeInspectionReportDownload'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId("bladeInspectionForemanDownload"),"click", function(){
        var url = siteData[siteId].workOrders[workOrderNumber].summary.objects.poleInspectionSummary[turbineName].analysisReportURL;
		window.open(url, '_blank');
    });
    dojo.connect(dojo.byId('bladeInspectionForemanDownload'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Open PoleForeman<br>Report (PDF)');
	});	
	dojo.connect(dojo.byId('bladeInspectionForemanDownload'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId("bladeInspectionXmlDownload"),"click", function(){
        var url = siteData[siteId].workOrders[workOrderNumber].summary.objects.poleInspectionSummary[turbineName].analysisResultURL;
		window.open(url, '_blank');
    });
    dojo.connect(dojo.byId('bladeInspectionXmlDownload'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Download PoleForeman<br>Analysis (XML)');
	});	
	dojo.connect(dojo.byId('bladeInspectionXmlDownload'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId("siteVegetationEncroachment"),"click", function(){
        openViewerPanel('lasViewer');
    });
    dojo.connect(dojo.byId('siteVegetationEncroachment'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Open Vegetation Encroachment<br>LiDAR Viewer');
	});	
	dojo.connect(dojo.byId('siteVegetationEncroachment'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId("siteFeederGoogleMapDownload"),"click", function(){
        var url = siteData[siteId].workOrders[workOrderNumber].summary.vegitationEncroachmentGoogleEarthURL;
		window.open(url, '_blank');
    });
    dojo.connect(dojo.byId('siteFeederGoogleMapDownload'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Open Vegetation<br>Encroachment in Google Maps');
	});	
	dojo.connect(dojo.byId('siteFeederGoogleMapDownload'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId("siteAnomalyMapDownload"),"click", function(){
        var url = siteData[siteId].workOrders[workOrderNumber].summary.anomalyMapDownloadURL;
		window.open(url, '_blank');
    });
    dojo.connect(dojo.byId('siteAnomalyMapDownload'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Open Anomaly<br>Map (PDF)');
	});	
	dojo.connect(dojo.byId('siteAnomalyMapDownload'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	})
	
	dojo.connect(dojo.byId("siteAnomalyReportDownload"),"click", function(){
        var url = siteData[siteId].workOrders[workOrderNumber].summary.anomalyReportDownloadURL;
		window.open(url, '_blank');
    });
    dojo.connect(dojo.byId('siteAnomalyReportDownload'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Open Anomaly<br>Report (PDF)');
	});	
	dojo.connect(dojo.byId('siteAnomalyReportDownload'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	})
	
	dojo.connect(dojo.byId("siteFeederReportDownload"),"click", function(){
        var url = siteData[siteId].workOrders[workOrderNumber].summary.summaryReportDownloadURL;
		window.open(url, '_blank');
    });
    dojo.connect(dojo.byId('siteFeederReportDownload'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Open Feeder<br>Summary Report (PDF)');
	});	
	dojo.connect(dojo.byId('siteFeederReportDownload'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	})
	
	dojo.connect(dojo.byId("siteFeederMapDownload"),"click", function(){
        var url = siteData[siteId].workOrders[workOrderNumber].summary.feederMapDownloadURL;
		window.open(url, '_blank');
    });
    dojo.connect(dojo.byId('siteFeederMapDownload'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Open Circuit<br>Map (PDF)');
	});	
	dojo.connect(dojo.byId('siteFeederMapDownload'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	})
	
	dojo.connect(dojo.byId("siteExcelDownload"),"click", function(){
        var url = siteData[siteId].workOrders[workOrderNumber].summary.surveyReportDownloadURL;
		window.open(url, '_blank');
    });
    dojo.connect(dojo.byId('siteExcelDownload'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Download Survey<br>Template (XLS)');
	});	
	dojo.connect(dojo.byId('siteExcelDownload'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	})
	
	dojo.connect(dojo.byId("lasKmlDownload"),"click", function(){
        var url = siteData[siteId].workOrders[workOrderNumber].summary.vegitationEncroachmentShapeDownloadURL;
		window.open(url, '_blank');
    });
    dojo.connect(dojo.byId('lasKmlDownload'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Download Vegetation<br>Encroachment Results (KML)');
	});	
	dojo.connect(dojo.byId('lasKmlDownload'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	})
	
	dojo.connect(dojo.byId("lasGoogleMapDownload"),"click", function(){
        var url = siteData[siteId].workOrders[workOrderNumber].summary.vegitationEncroachmentGoogleEarthURL;
		window.open(url, '_blank');
    });
    dojo.connect(dojo.byId('lasGoogleMapDownload'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Display Vegetation Enroachment<br>Results in Google Maps');
	});	
	dojo.connect(dojo.byId('lasGoogleMapDownload'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	})
	
	
	dojo.connect(dojo.byId("transmissionExcelDownload"),"click", function(){
        var url = siteData[siteId].workOrders[workOrderNumber].summary.summaryReportDownloadURL;
		window.open(url, '_blank');
    });
    dojo.connect(dojo.byId('transmissionExcelDownload'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Download Inspection<br>Results (XLS)');
	});	
	dojo.connect(dojo.byId('transmissionExcelDownload'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	})
	
	dojo.connect(dojo.byId("transmissionVideo"),"click", function(){
        transmissionLineVideo.show();
    });
    dojo.connect(dojo.byId('transmissionVideo'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Open Transmission Line<br>Inspection Video');
	});	
	dojo.connect(dojo.byId('transmissionVideo'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	})
	
	dojo.connect(dijit.byId('transmissionLineVideo'), "onHide", function() { 
		var player = videojs('transmission-video-player');
		player.pause();
		player.currentTime(0);
	})
	
	/* dojo.connect(dojo.byId("sessionContinueButton"), "onclick", function() {
		renewToken();
	})
	
	dojo.connect(dojo.byId("sessionLogoutButton"), "onclick", function() {
		authContext.clearCache();
		authContext.logOut();
		sessionTimeoutWarning.hide();
	}) */
	
	/* dojo.forEach(_.keys(legendMessages), function(key) { 
		dojo.connect(dojo.byId(key), 'onmouseover', function(event) {
			console.log(key);
			showToolTip(event, legendMessages[key], "top")
		});
		dojo.connect(dojo.byId(key), 'onmouseout', function(event) {
			if (tooltip) { tooltip.style.display = "none";} 
		});
	}); */
    
    //apply relevant colors to map legend symbols
    dojo.forEach(["1","2","3","4","5"], function(level) {
        dojo.style("distribution-legend-" + level, "backgroundColor", severityColors[level]);
		dojo.style("distribution-class-legend-" + level, "backgroundColor", severityColors[level]);
    });
	
	dojo.forEach(["1","2","3"], function(level) {
        dojo.style("transmission-legend-" + level, "backgroundColor", transmissionSeverityColors[level]);
		dojo.style("transmission-class-legend-" + level, "backgroundColor", transmissionSeverityColors[level]);
    });
    
    /* dojo.connect(dojo.byId("logo-inspectools"), "onclick", function(){ 
		window.open("http://www.inspectools.com");
	}); */
	
	dojo.forEach(dojo.query(".class-legend-symbol"), function(node) {
		dojo.connect(node, 'onclick', function(event) {
			var filter = dojo.attr(this, "data-filter");
			if (filter != "hide" && filter != "show") {
				dojo.query(".class-legend-symbol").attr("data-filter", "hide");
				dojo.attr(this,"data-filter", "show");
				dojo.query("#" + this.id + " + div.class-legend-close").style("display", "block");
				var value = dojo.attr(this, "data-value");
				filterSiteViewerRecords(value);
			}
		});
	});
	
	dojo.forEach(dojo.query(".class-legend-symbol + div.class-legend-close"), function(node) {
		dojo.connect(node, 'onclick', function(event) {
			clearFilterSiteViewerUI();
			clearFilterSiteViewerRecords();
			clearFilterSiteViewerFeatures();
		});
	});
	
	resizeViewerPanel("bladeViewer");
	resizeViewerPanel("lasViewer");
	
    window.setTimeout(function() {
		initiateZoomifyViewer('zoomify', window.location.href + 'images/blades/blank.zif');
	}, 5000);
	
	//Potree controls
	dojo.connect(dojo.byId("potree-earth-control"), "onclick", function () {
		viewer.setNavigationMode(Potree.EarthControls);
		dojo.query(".potree-control").removeClass("active");
		dojo.addClass(this,"active");
	})
	dojo.connect(dojo.byId('potree-earth-control'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Set navigation mode<br>to zoom or pan scene');
	});	
	dojo.connect(dojo.byId('potree-earth-control'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	})
	
	
	dojo.connect(dojo.byId("potree-orbit-control"), "onclick", function () {
		viewer.setNavigationMode(Potree.OrbitControls);
		dojo.query(".potree-control").removeClass("active");
		dojo.addClass(this,"active");
	})
	dojo.connect(dojo.byId('potree-orbit-control'), 'onmousemove', function(evt) {
		showToolTip(evt, 'Set navigation mode<br>to rotate or tilt scene');
	});	
	dojo.connect(dojo.byId('potree-orbit-control'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	})
	
	dojo.connect(dojo.byId('sign-in'), 'onclick', function() {
		signInOnClick();
	});
	
	dojo.connect(dojo.byId('sign-in'), 'onmouseover', function() {
		dojo.style(this, { 'backgroundColor':'#2a2a2a', 'color':'#ffffff' });
	});
	
	dojo.connect(dojo.byId('sign-in'), 'onmouseout', function() {
		if (dojo.style('loginDiv', 'display') == 'none') {
			dojo.style(this, { 'backgroundColor':'#1a1a1a', 'color':'#adafaf' });
		}
	});
	
	dojo.connect(dojo.byId('loginButton'), 'onclick', function() {
		logInOutViewer('login');
	});
	
	dojo.connect(dojo.byId('uid'), 'onkeydown', function(event) {
		if (event.keyCode == 13) {
			logInOutViewer('login');
		}
        if (dojo.attr(this, "data-authenticate-error")) {
            loginErrorHighlight('uid','clear');
            loginErrorHighlight('pw','clear');
            dojo.style('loginError', 'display', 'none');
            dojo.style('loginDiv', 'height', '105px');
        }
	});
	
	dojo.connect(dojo.byId('pw'), 'onkeydown', function(event) {
		if (event.keyCode == 13) {
			logInOutViewer('login');
		}
        if (dojo.attr(this, "data-authenticate-error")) {
            loginErrorHighlight('uid','clear');
            loginErrorHighlight('pw','clear');
            dojo.style('loginError', 'display', 'none');
            dojo.style('loginDiv', 'height', '105px');
        }
	});
    
    dojo.connect(dojo.byId('uid'), 'onchange', function(event) {
        if (dojo.attr(this, "data-authenticate-error")) {
            loginErrorHighlight('uid','clear');
            loginErrorHighlight('pw','clear');
            dojo.style('loginError', 'display', 'none');
            dojo.style('loginDiv', 'height', '105px');
        }
	});
    
    dojo.connect(dojo.byId('pw'), 'onchange', function(event) {
        if (dojo.attr(this, "data-authenticate-error")) {
            loginErrorHighlight('uid','clear');
            loginErrorHighlight('pw','clear');
            dojo.style('loginError', 'display', 'none');
            dojo.style('loginDiv', 'height', '105px');
        }
	});
	
	
	createInspectionDisplay();
}

function advanceToNextImage(imgType, imgId, imgName, imgLabel, zUrl){
	if (imgType == "zoomify") {
		updateZoomifyViewer('zoomify', zUrl, imgId);
	}
	var display = (imgType == "zoomify") ? "none" : "block";
	dojo.style(dojo.byId("image-gallery"), "display", display);
	
	if (dojo.byId("ToolbarDisplay")) {
		var display = (imgType == "image") ? "none" : "block";
		dojo.style(dojo.byId("ToolbarDisplay"), "display", display);
	}
	
	var bottom = (imgType == "zoomify") ? "22px" : "2px";
	dojo.style(dojo.byId("zoomify-down"), "bottom", bottom);
	
	var z = (imgType == "zoomify") ? "0" : "3000";
	dojo.style(dojo.byId("bladeViewerImageGallery"), "z-index", z);
	
	dojo.byId("bladeViewerImageText").innerHTML = (_.isUndefined(imgLabel)) ? " -- No Photo to Display -- " : imgLabel;
	dojo.attr(dojo.byId("zoomify"), "data-active-image-id", imgId);
}

function updateZoomifyViewer(id, viewerPath, imageId) {
	var viewId = (siteView == "DistributionLine") ? "site" : "transmission";
	
	var params = {
		'zSkinPath':'images/zoomify/skins/default',
		'zNavigatorVisible':3,
		'zToolbarVisible':1,
		'zMeasureVisible': 0,
		'zLogoVisible':0,
		'zHelpVisible':0,
		'zProgressVisible':0,
		'zNavigatorWidth':100,
		'zNavigatorHeight':75,
		'zNavigatorLeft':5,
		'zNavigatorTop':5,
		'zZoomSpeed':8,
		'zFadeInSpeed':8,
		'zCoordinatesVisible':0,
		'zEditMode':1,
		'zFreehandVisible': 1,
		'zTextVisible': 1,
		'zIconVisible': 1,
		'zRectangleVisible': 1,
		'zPolygonVisible': 1,
		'zAnnotationPanelVisible': 0,
        'zHotspotsDrawOnlyInView': 0
    };
	
	if (viewId == "transmission") {
		var currentImage = getImageById(imageId);
		var data = getAnnotationObjects(currentImage);
		var annotationObjects = makeAnnotationObjects(data);
		params['zAnnotationJSONObject'] = annotationObjects;
	}
	
	//if ((!Z.Viewer) || (Z.imagePath != viewerPath)) {
	if (Z.Viewer) {
        //hack to remove navigator display from the dom as it gets appended by zoomify every setImage call even if it already exists in the dom
		dojo.destroy("navigatorDisplay0");
		Z.Viewer.setImage(viewerPath, params);
        
        // zoomify hack to ensure mouse events trigger navigator and toolbar visibility (mouseover only)
        dojo.connect(dojo.byId("ViewerDisplay"), "onmouseover", function(){
            if (!_.isUndefined(dojo.byId("navigatorDisplay0")) && !_.isNull(dojo.byId("navigatorDisplay0"))) {
                dojo.style(dojo.byId("navigatorDisplay0"), "display", "inline-block");
            }
			if (!_.isUndefined(dojo.byId("ToolbarDisplay")) && !_.isNull(dojo.byId("ToolbarDisplay"))) {
				dojo.style(dojo.byId("ToolbarDisplay"), "display", "inline-block");
				dojo.query("#ToolbarDisplay > *").style("display", "inline-block");
			}
        });
        
        dojo.connect(dojo.byId("ViewerDisplay"), "onmouseout", function(){
            if (!_.isUndefined(dojo.byId("navigatorDisplay0")) && !_.isNull(dojo.byId("navigatorDisplay0"))) {
                dojo.style(dojo.byId("navigatorDisplay0"), "display", "none");
            }
        });
        //end hack
	}
	
	if (viewId == "transmission") {	
		var tab = dojo.query("#transmissionToggleButtons .btn.active")[0].value;
		var inspectionEvents = _.filter(currentImage.polys, function(poly) { return poly.source == tab });
		var inspectionEventId = (inspectionEvents.length > 0) ? inspectionEvents[0].inspectionEventId : "";
		dijit.byId('inspectionEventTypeDropdown').set('value', inspectionEventId);
	}
}

function convertDate(value, to) {
	switch (to) {
		case "viewer":
			var m = value.slice(4,6);
			var d = value.slice(6);
			var y = value.slice(0,4);
			var output = m + "-" + d + "-" + y;
			break;
		case "warehouse":
			var d = value.split("-")[1];
			var m = value.split("-")[0];
			var y = value.split("-")[2];
			var output = y + m + d;
			break;
	}
	return output;
}

function loadMapLayers() {
	 
	var siteIds = _.keys(siteData);
	authUserAssets = [];
	var assetIds = [];
	dojo.forEach(siteIds, function(siteId) {
		var workOrders = _.keys(siteData[siteId].workOrders);
		var assetType = siteData[siteId].type;
		dojo.forEach(workOrders, function(workOrder) {
			dojo.forEach(siteData[siteId].workOrders[workOrder].summary.data, function(asset) {
				var exists = _.contains(assetIds, asset.id);
				if (!exists) {
					/* if (!(assetType == "TransmissionLine" && !_.isEmpty(asset.assetInspection) && asset.assetInspection.reasonNotInspected == "In Substation")) {
						assetIds.push(asset.id);
						asset.organizationId = siteData[siteId].organizationId;
						asset.assetType = assetType;
						authUserAssets.push(asset);
					} */
					
					assetIds.push(asset.id);
					asset.organizationId = siteData[siteId].organizationId;
					asset.assetType = assetType;
					authUserAssets.push(asset);
				}
			})
		})
	});
	
	windFeatureGraphics = _.map(authUserAssets, function(asset){
	  if (!_.isNull(asset.location)) {
		  if (asset.location.latitude > 90 || asset.location.latitude < -90) {
			  asset.location.latitude = 0;
		  }
		  if (asset.location.longitude > 180 || asset.location.longitude < -180) {
			  asset.location.longitude =  0;
		  }
	  } else {
		  asset.location = { latitude: 0, longitude: 0 };
	  }
	  
	  var graphic = new esri.Graphic();
	  var geometry = esri.geometry.geographicToWebMercator(new esri.geometry.Point(asset.location.longitude, asset.location.latitude,  new esri.SpatialReference({ wkid: 4326 })));
	  
	  //console.log(asset.attributes);
	  var attributes = {
		"uniqueId":asset.id,
		"organizationId":asset.organizationId,
		"organizationName":authUserOrg.name,
		"subStationId": asset.siteId,
		"name": siteData[asset.siteId].name,
		"feederNumber": siteData[asset.siteId].feederNumber,
		"poleId": (asset.assetType == "DistributionLine") ? asset.utilityId : asset.structureNumber ,
		"equipmentType": asset.equipmentType,
		"framing": asset.framing,
		"length": asset.length,
		"numberOfPhases":asset.numberOfPhases,
		"poleClass":asset.poleClass,
		"type": asset.type,
		"location.latitude":asset.location.latitude,
		"location.longitude":asset.location.longitude,
		"dateOfAnalysis": (_.has(asset.assetInspection, "dateOfAnalysis") && !_.isEmpty(asset.assetInspection) && !_.isNull(asset.assetInspection.dateOfAnalysis)) ? convertDate(asset.assetInspection.dateOfAnalysis, "viewer") : (!_.isEmpty(asset.assetInspection)) ? asset.assetInspection.dateOfAnalysis : "NA",
		"dateOfInspection": (_.has(asset.assetInspection, "dateOfInspection") && !_.isEmpty(asset.assetInspection) && !_.isNull(asset.assetInspection.dateOfInspection)) ? convertDate(asset.assetInspection.dateOfInspection, "viewer") : (!_.isEmpty(asset.assetInspection)) ? asset.assetInspection.dateOfInspection : "NA",
		"passedAnalysis": (_.has(asset.assetInspection, "passedAnalysis") && !_.isEmpty(asset.assetInspection)) ? asset.assetInspection.passedAnalysis : "NA",
		"horizontalLoadingPercent": (_.has(asset.assetInspection, "horizontalLoadingPercent") && !_.isEmpty(asset.assetInspection)) ? asset.assetInspection.horizontalLoadingPercent : 0,
		"assetType": asset.assetType,
		"reasonNotInspected": (asset.assetType == "TransmissionLine" && !_.isEmpty(asset.assetInspection)) ? asset.assetInspection.reasonNotInspected : null,
		"materialType": asset.type
	  };
	  
	  var criticalityProperty = (asset.assetType == "DistributionLine") ? "criticality" : "severity";
	  attributes.criticality = (_.isEmpty(asset.assetInspection) || _.isNull(asset.assetInspection[criticalityProperty]) || !_.has(asset.assetInspection, criticalityProperty)) ? "NA" : asset.assetInspection[criticalityProperty];
	  
	  graphic.setGeometry(geometry); 
	  graphic.setAttributes(attributes);
	  return graphic;
	})

	windFeatureCollection = {
	  "layerDefinition": null,
	  "featureSet": {
		"features": windFeatureGraphics,
		"geometryType": "esriGeometryPoint"
	  }
	};

	windFeatureCollection.layerDefinition = {
	  "geometryType": "esriGeometryPoint",
	  "objectIdField": "uniqueId",
	  "fields": [
			{"name":"uniqueId","type":"esriFieldTypeDouble","alias":"Unique ID"},
			{"name":"organizationId","type":"esriFieldTypeString","alias":"Site Owner ID"},
			{"name":"organizationName","type":"esriFieldTypeString","alias":"Site Owner"},
			{"name":"subStationId","type":"esriFieldTypeString","alias":"Site ID"},
			{"name":"name","type":"esriFieldTypeString","alias":"Site Name"},
			{"name":"feederNumber","type":"esriFieldTypeString","alias":"Feeder Number"},
			{"name":"poleId","type":"esriFieldTypeString","alias":"ID"},
			{"name":"equipmentType","type":"esriFieldTypeString","alias":"Equipment Type"},
			{"name":"framing","type":"esriFieldTypeString","alias":"Framing"},
			{"name":"length","type":"esriFieldTypeDouble","alias":"Height"},
			{"name":"numberOfPhases","type":"esriFieldTypeString","alias":"numberOfPhases"},
			{"name":"poleClass","type":"esriFieldTypeString","alias":"Pole Class"},
			{"name":"type","type":"esriFieldTypeString","alias":"Type"},
			{"name":"location.latitude","type":"esriFieldTypeDouble","alias":"Latitude"},
			{"name":"location.longitude","type":"esriFieldTypeDouble","alias":"Longitude"},
			{"name":"dateOfAnalysis","type":"esriFieldTypeString","alias":"Inspection Date"},
			{"name":"passedAnalysis","type":"esriFieldTypeString","alias":"Passed Analysis"},
			{"name":"horizontalLoadingPercent","type":"esriFieldTypeString","alias":"Horizontal Loading (%)"},
			{"name":"criticality","type":"esriFieldTypeSmallInteger","alias":"Criticality"},
			{"name":"assetType","type":"esriFieldTypeString","alias":"Asset Type"}
		]
	};
	
	windFeatureLayer = new esri.layers.FeatureLayer(windFeatureCollection, {
	  mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
	  outFields: ["*"],
	  opacity: 1
	});
	
	/* symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,255,255,1]), 1), new dojo.Color([200,200,200,1]));
	windFeatureLayer.setRenderer(new esri.renderer.SimpleRenderer(symbol)); */
	
	var assetMarkerSymbol = new esri.symbol.PictureMarkerSymbol();
	assetMarkerSymbol.setHeight(20);
	assetMarkerSymbol.setWidth(20);
	assetMarkerSymbol.setUrl(""); 
	windFeatureLayer.setRenderer(new esri.renderer.SimpleRenderer(assetMarkerSymbol));
	
	map.addLayer(windFeatureLayer);

	dojo.connect(windFeatureLayer, "onGraphicDraw", function(evt) {
		var viewId = (siteView == "DistributionLine") ? "distribution" : "transmission";
		var graphic = evt.graphic;
		var assetType = (graphic.attributes["assetType"] == "DistributionLine") ? "distribution" : "transmission";
		
		var criticality = (assetType == "distribution" && viewId == "distribution") ? graphic.attributes["criticality"] : (assetType == "transmission" && viewId == "transmission") ? graphic.attributes["criticality"] : "NA";
		var svg = assetType + "_" + criticality;
		var url = window.location.href + "images/icons/" + svg + ".svg";
		graphic.symbol.setUrl(url);
		
		var alpha = 1;
		var filterNode = dojo.query("#" + assetType + "-class-legend .class-legend-symbol[data-filter='show']");
		if (filterNode.length > 0) {
			var value = dojo.attr(filterNode[0], "data-value");
			alpha = (graphic.attributes["criticality"] == value && graphic.attributes["subStationId"] == siteId) ? 1 : 0.1;
		}
		
		if (!_.isNull(graphic.getNode())) {
			dojo.attr(graphic.getNode(), "opacity", alpha);
		}
		
	});
	
	dojo.connect(windFeatureLayer, "onClick", function(evt) {
		var viewId = (siteView == "DistributionLine") ? "site" : "transmission";
		var previousSiteId = siteId;
		var currentSiteId = evt.graphic.attributes["subStationId"];
		var assetType = evt.graphic.attributes["assetType"];
		var id = evt.graphic.attributes["poleId"];
		var ids = (dijit.byId("siteViewerGrid")) ? dojo.map(dijit.byId("siteViewerGrid").store._arrayOfAllItems, function(item){ return _.first(item["Pole ID"]) }) : [];
		
		var siteChange = currentSiteId != previousSiteId;
		var turbineFilter = dojo.indexOf(ids, id) >= 0;
		
		if ((turbineFilter || siteChange) && siteView == assetType) {  
			
			turbineId = evt.graphic.attributes["uniqueId"];
			turbineName = evt.graphic.attributes["poleId"];
			siteId = currentSiteId;
			siteName = siteData[siteId].name;
			
			//check if clicked feature is a new site and reset site viewer if necessary.
			if (siteChange) {
				siteSelectMethod = 'map';
				dijit.byId(viewId + "ViewerDropDown").set("value", currentSiteId);
				updateWorkOrderDropdown(currentSiteId);
				
				window.setTimeout(function() {
					var idField = (viewId == "site") ? "Pole ID" : "Structure Number";
					var ids = dojo.map(siteData[siteId].workOrders[workOrderNumber].summary.store.items, function(item){ return item[idField]; })
					var selectId = dojo.indexOf(ids, id);
					populateSiteViewerContent(currentSiteId, selectId);
				}, 500);
				
			} else {
				//select record in the site viewer table (use interval to allow grid to fully load)	
				var checkGrid = setInterval(function(){
					if (dijit.byId(viewId + "ViewerGrid")) {
						clearInterval(checkGrid);
						
						setSelectedRowInSiteViewerTable(turbineId, viewId);
					}
				}, 100);
			}
			
			var bladeViewerStatus = dojo.byId("bladeViewer").getAttribute('data-blade-viewer-status');
			var siteViewerStatus = dojo.byId("siteViewer").getAttribute('data-site-viewer-status');
			if (siteViewerStatus == "closed") { 
				openViewerPanel("siteViewer")
				siteViewerStatus = dojo.byId("siteViewer").getAttribute('data-site-viewer-status');
			}
			populateBladeViewerContent(evt.graphic, true);
			
			clearHighlightSymbol();
			//set symbology for the clicked feature
			setSymbologyForFeature(evt.graphic, true);
			
			//set map center with offset if viewer(s) are open
			var geometry = evt.graphic.geometry;
			map.centerAt(geometry);
		}
	});
	
	dojo.connect(windFeatureLayer, "onMouseMove", function(evt) {
		var previousSite = siteId;
		var site = evt.graphic.attributes["subStationId"];
		var name = siteData[site].name;
		var feeder = evt.graphic.attributes["feederNumber"];
		var id = evt.graphic.attributes["poleId"];
		var assetType = evt.graphic.attributes["assetType"];
		
		if (assetType == "DistributionLine") {
			var ids = (dijit.byId("siteViewerGrid")) ? dojo.map(dijit.byId("siteViewerGrid").store._arrayOfAllItems, function(item){ return _.first(item["Pole ID"]) }) : [];
			
			var siteChange = (site != previousSite) ? true : false;
			var turbineFilter = dojo.indexOf(ids, id) >= 0;
			
			if (turbineFilter || siteChange) {  
				var content = "";
				content += '<table style="text-align:left">';
				
				content += '<tr>';
				content += '<td style="width:100px">Feeder:</td>';
				content += '<td>' + name + '-' + feeder + '</td>';
				content += '</tr>';
				
				content += '<tr>';
				content += '<td>Pole Id:</td>';
				content += '<td>' + id + '</td>';
				content += '</tr>';
				
				if ( evt.graphic.attributes['criticality'] != "NA") {
					content += '<tr>';
					content += '<td>Horizontal Pole Loading (%):</td>';
					content += '<td>' + evt.graphic.attributes['horizontalLoadingPercent'] + '</td>';
					content += '</tr>';
				}
				content += '</table>';
				showToolTip(evt, content);
			}
		}
		
		if (assetType == "TransmissionLine") {
			var ids = (dijit.byId("transmissionViewerGrid")) ? dojo.map(dijit.byId("transmissionViewerGrid").store._arrayOfAllItems, function(item){ return _.first(item["Structure Number"]) }) : [];
			var turbineFilter = dojo.indexOf(ids, id) >= 0;
			
			var siteChange = (site != previousSite) ? true : false;
			
			if (turbineFilter || siteChange) {
				var content = "";
				content += '<table style="text-align:left">';
				
				content += '<tr>';
				content += '<td style="width:100px">Transmission Line:</td>';
				content += '<td>' + name + '</td>';
				content += '</tr>';
				
				content += '<tr>';
				content += '<td>Structure Number:</td>';
				content += '<td>' + id + '</td>';
				content += '</tr>';
				
				if ( evt.graphic.attributes['criticality'] != "NA") {
					content += '<tr>';
					content += '<td>Criticality:</td>';
					content += '<td>' + transmissionSeverityLabels[evt.graphic.attributes['criticality']] + '</td>';
					content += '</tr>';
				}
				
				content += '</table>';
				showToolTip(evt, content);
			}
		}
	});
	
	dojo.connect(windFeatureLayer,"onMouseOut", function () { 
		if (tooltip) { tooltip.style.display = "none";} 
	});
}

function removeMapLayers() {
	map.removeLayer(windFeatureLayer);
}


function showToolTip(evt, content, position) {
	var position = typeof position !== 'undefined' ? position : "left";
	var px, py;        
	if (evt.clientX || evt.pageY) {
	  px = evt.clientX;
	  py = evt.clientY;
	} else {
	  px = evt.clientX + dojo.body().scrollLeft - dojo.body().clientLeft;
	  py = evt.clientY + dojo.body().scrollTop - dojo.body().clientTop;
	}
	if (tooltip) {
		tooltip.style.visibility = "hidden";
		tooltip.style.display = "";
		
		tooltip.innerHTML = content;
		var w = dojo.getMarginBox(tooltip).w
		var offset = (position == "side") ? -1*(w + 20) : 20;
		
		var style = { 
			"left": (px + offset) + "px"
		}
		var top = (position == "top") ? (py - 15) + "px" : (py) + "px";
		style["top"] = top;
		dojo.style(tooltip, style);
		tooltip.style.visibility = "visible";
	}
}

function setSymbologyForFeature(feature, selection) {
	var viewId = (siteView == "DistributionLine") ? "distribution" : "transmission";
	var assetType = (feature.attributes["assetType"] == "DistributionLine") ? "distribution" : "transmission";
	
	var criticality = (assetType == "distribution" && viewId == "distribution") ? feature.attributes["criticality"] : (assetType == "transmission" && viewId == "transmission") ? feature.attributes["criticality"] : "NA";
	var svg = assetType + "_" + criticality;
	var url = window.location.href + "images/icons/" + svg + ".svg";
	
	if (_.isNull(feature.symbol)) {
		var markerSymbol = new esri.symbol.PictureMarkerSymbol();
		markerSymbol.setHeight(20);
		markerSymbol.setWidth(20);
		markerSymbol.setUrl(url);
		feature.setSymbol(markerSymbol);
	} else {
		feature.symbol.setUrl(url);
	}
	
	var alpha = (!_.isUndefined(feature.getNode()) && !_.isNull(feature.getNode())) ? dojo.attr(feature.getNode(), "opacity") : 1.0;
	if (!_.isNull(feature.getNode())) {
		dojo.attr(feature.getNode(), "opacity", alpha);
	}
}

function clearHighlightSymbol() {
	if (windFeatureLayer) {
		dojo.forEach(windFeatureLayer.graphics, function(graphic) {
			setSymbologyForFeature(graphic, false);
		});
	}
}

function chooseAssetSite(id) {
	var viewId = (siteView == "DistributionLine") ? "site" : "transmission";
	dijit.byId(viewId + 'ViewerDropDown').set('value', id);
    toggleWindSiteSelector();
	openViewerPanel(viewId + "Viewer");
}

function setSiteViewerContent(selectId) {
	var viewId = (siteView == "DistributionLine") ? "site" : "transmission";
	var id = dijit.byId(viewId + 'ViewerDropDown').get('value');
			
	if (siteSelectMethod == 'dialog') {
	    if (siteId != id) {
            updateWorkOrderDropdown(id);
        }
		resetBladeViewerPanel();
		clearHighlightSymbol();
		populateSiteViewerContent(id, selectId);
	}
	
	if (siteView == "DistributionLine") {
		var url = window.location.href + "las/" + siteData[id].name.toLowerCase() + "-" + siteData[id].feederNumber + "/index.html";
		dojo.xhrGet({
			url: url,
			handleAs: "text",
			load: function(response, ioargs) {
				dojo.query("#lasViewerOuterContent iframe")[0].src = url;
				dojo.query(".potree-control").removeClass("active");
				dojo.addClass(dojo.byId("potree-orbit-control"),"active");
			},
			error: function(error, ioargs){
				dojo.query("#lasViewerOuterContent iframe")[0].src = "";
			}
		})
	}
}

function updateWorkOrderDropdown(id) {
	var viewId = (siteView == "DistributionLine") ? "site" : "transmission";
	var options = dijit.byId(viewId + 'ViewerWorkOrderDropDown').getOptions();
	dijit.byId(viewId + 'ViewerWorkOrderDropDown').removeOption(options);
	workOrderNumber = null;
	if (id !="" && _.has(siteData[id], "workOrders")) {
        var workOrders = _.keys(siteData[id].workOrders);
        
        var workOrderObjects = [];
        dojo.forEach(_.values(siteData[id].workOrders), function(workOrder,i) {
            var order = dojo.clone(workOrder);
            order.name = workOrders[i];
            var time = (!_.isNull(order.requestDate)) ? order.requestDate.split("-") : ["01","01","1900"];
            order.timeSort = time[2] + time[0] + time[1];
            workOrderObjects.push(order);
        });
        workOrderObjects = _.sortBy(workOrderObjects, "timeSort").reverse();
        
        dojo.forEach(workOrderObjects, function(workOrder){
			var label = (!_.isNull(workOrder.requestDate)) ? workOrder.name + "  (" + workOrder.requestDate + ")" : workOrder.name;
			dijit.byId(viewId + 'ViewerWorkOrderDropDown').addOption({ label: label, value: workOrder.name });
		});
		workOrderNumber = _.first(workOrderObjects).name;
        
		dijit.byId(viewId + 'ViewerWorkOrderDropDown').set("disabled", false);
	} else {
		dijit.byId(viewId + 'ViewerWorkOrderDropDown')._setDisplay("");
		dijit.byId(viewId + 'ViewerWorkOrderDropDown').set("disabled", true);
	}
}


function populateSiteViewerContent(id, selectId) {
	
	var viewId = (siteView == "DistributionLine") ? "site" : "transmission";
	var distributionDisplay = (siteView == "DistributionLine") ? "table" : "none";
	var transmissionDisplay = (siteView == "TransmissionLine") ? "table" : "none";
	
	clearFilterSiteViewerUI();
	clearFilterSiteViewerFeatures();
	clearSiteViewerPanel();
	
	if (id != '') {
		selectId = (selectId >= 0) ? selectId : 0;
	
		dojo.style(viewId + "ViewerRecordsTable", "backgroundImage", "url(" + (window.location.origin + window.location.pathname) + "/images/image-loader.gif)");
		siteId = id;
		siteName = siteData[id].name;
		workOrderNumber = dijit.byId(viewId + "ViewerWorkOrderDropDown").get('value');
		
		var features = dojo.filter(windFeatureLayer.graphics, function(feature) { return feature.attributes["subStationId"] == siteId; })
		
		var assets = (_.has(siteData, siteId)) ? siteData[siteId].workOrders[workOrderNumber].summary.data : [];
		processSiteData(features, assets, selectId);
		
		//show map legend
		dojo.style('map-legend', 'visibility', 'visible');
		dojo.style('distribution-legend', 'display', distributionDisplay);
		dojo.style('transmission-legend', 'display', transmissionDisplay);
		
		if (viewId == "tranmission") {
			var player = videojs('transmission-video-player');
			//var src = siteData[siteId].workOrders[workOrderNumber].summary.videoUrl;
			var src = window.location.href + 'video/Video_Inspection_Line_1001.mp4'; // replace with actual value from summary object when included
			var srcs = [ { "type": "video/mp4", "src": src } ];
			player.src(srcs);
		}
	}
}

/* 
function processSiteData(features, assets, selectId){
	
	if (siteSelectMethod == 'dialog') {
		var extent = getQueryResultsExtent(features);
		map.setExtent(extent.expand(1.5),true);
	}
    windFeatureLayer.show();
    
	var summaryCriticality = summarizeCriticality();
	var sum = _.reduce(_.values(summaryCriticality), function(memo, num){ return memo + num; }, 0);
	
	//dojo.byId("distribution_inspections_total").innerHTML = features.length;
	
	
	populatePoleRecordTable(features, selectId);
    resizeViewerPanel("siteViewer");
	
	var data = siteData[siteId].workOrders[workOrderNumber].summary.store;
    var item = data.items[selectId];
	var uniqueId = item['uniqueId'];
	var fplid = item['Pole ID'];
	var criticality = item['criticality'];
    turbineId = uniqueId;
    turbineName = fplid;
    
	var turbine = dojo.filter(features, function(feature) { return feature.attributes['poleId'] == fplid; })[0];
    setSymbologyForFeature(turbine, true);
    
    //select record in the site viewer table (use interval to allow grid to fully load)	
    var checkGrid = setInterval(function(){
		var grid = dijit.byId("siteViewerGrid");
        if (grid) {
            clearInterval(checkGrid);
            setSelectedRowInSiteViewerTable(turbineId);
			
			var item = grid.getItem(selectId);
			var obj = {
				id: turbineId,
				name: fplid,
				criticality: criticality
			}
			getAndSetBladeViewerAsset(obj);
        }
    }, 100);
	
	siteSelectMethod = 'dialog';
	
} */

function processSiteData(features, assets, selectId){
	
	if (siteSelectMethod == 'dialog') {
		var extent = getQueryResultsExtent(features);
		map.setExtent(extent.expand(1.5),true);
	}
    windFeatureLayer.show();
    var summaryCriticality = summarizeCriticality();
	
	if (siteView == "DistributionLine") {
		
		populatePoleRecordTable(features, selectId);
		//dojo.byId("turbines_total").innerHTML = features.length;
		var idField = 'Pole ID';
		resizeViewerPanel("siteViewer");
	}
	
	if (siteView == "TransmissionLine") {
		populateStructureRecordTable(features, selectId);
		var idField = 'Structure Number';
		resizeViewerPanel("transmissionViewer");
	}
	
	var data = siteData[siteId].workOrders[workOrderNumber].summary.store;
    var item = data.items[selectId];
	var uniqueId = item['uniqueId'];
	var assetId = item[idField];
	var criticality = item['criticality'];
    turbineId = uniqueId;
    turbineName = assetId;
    
	var turbine = dojo.filter(features, function(feature) { return feature.attributes['poleId'] == assetId; })[0];
	if (!_.isUndefined(turbine)) {
		setSymbologyForFeature(turbine, true);
	}
    
    //select record in the site viewer table (use interval to allow grid to fully load)	
    var checkGrid = setInterval(function(){
		var grid = dijit.byId(gridId + "ViewerGrid");
        if (grid) {
            clearInterval(checkGrid);
			var gridId = (siteView == "DistributionLine") ? "site" : "transmission";
            setSelectedRowInSiteViewerTable(turbineId, gridId);
			
			var item = grid.getItem(selectId);
			var obj = {
				id: turbineId,
				name: assetId,
				criticality: criticality
			}
			getAndSetBladeViewerAsset(obj);
        }
    }, 100);
	
	siteSelectMethod = 'dialog';
	
}

function summarizeCriticality() {
	var viewId = (siteView == "DistributionLine") ? "distribution" : "transmission";
	var assets = (viewId == "distribution") ? "poleSummary" : "structureSummary";
	var assetInspections = (viewId == "distribution") ? "poleInspectionSummary" : "structureInspectionSummary";
	var property = (viewId == "distribution") ? "criticality" : "severity";
	
	var data = siteData[siteId].workOrders[workOrderNumber].summary.data;
	var structures = siteData[siteId].workOrders[workOrderNumber].summary.objects[assets];
	var inspections = siteData[siteId].workOrders[workOrderNumber].summary.objects[assetInspections];
	var total = _.keys(data).length;
	var criticalClass = {
		"distribution":{
			"1":0,
			"2":0,
			"3":0,
			"4":0,
			"5":0
		},
		"transmission":{
			"1":0,
			"2":0,
			"3":0
		}
	}
	
	/* dojo.forEach(_.values(inspections), function(i) {
		if (_.has(criticalClass[viewId], i[property])) {
			criticalClass[viewId][i[property]] = criticalClass[viewId][i[property]] + 1;
		}
	}); */
	
	dojo.forEach(data, function(i) {
		if (_.has(criticalClass[viewId], i.assetInspection[property])) {
			criticalClass[viewId][i.assetInspection[property]] = criticalClass[viewId][i.assetInspection[property]] + 1;
		}
	});
	
	dojo.forEach(_.keys(criticalClass[viewId]), function(k) {
		dojo.byId(viewId + "-class-legend-" + k).innerHTML = dojo.number.format(criticalClass[viewId][k]/total*100, { places:0 }) + "%";
	});
	
	return criticalClass;
}

function switchViews(view) {
	
	siteView = view;
	
	var feederDisplay = (siteView == "DistributionLine") ? "block" : "none";
	var transmissionDisplay = (siteView == "TransmissionLine") ? "block" : "none";
	dojo.style(dojo.byId("siteViewerOuterContent"), "display", feederDisplay);
	dojo.style(dojo.byId("transmissionViewerOuterContent"), "display", transmissionDisplay);
	
	var viewId = (siteView == "DistributionLine") ? "distribution" : "transmission";
	dojo.removeClass(dojo.byId("siteViewer"), "distribution transmission");
	dojo.addClass(dojo.byId("siteViewer"), viewId);
	
	dojo.removeClass(dojo.byId("bladeViewer"), "distribution transmission");
	dojo.addClass(dojo.byId("bladeViewer"), viewId);
	
	dojo.removeClass(dojo.byId("headerLeftDiv"), "distribution transmission");
	dojo.addClass(dojo.byId("headerLeftDiv"), viewId);
	
	dojo.query(".activeView").removeClass("activeView");
	dojo.addClass(dojo.byId(viewId + "SelectorList"), ".activeView");
	
	dojo.byId("pole-criticality-header").innerHTML = (viewId == "distribution") ? "Horizontal Pole Loading (%):" : "Damage Assessment:";
	
	var aiDisplay = (siteView == "TransmissionLine") ? "block" : "none";
	dojo.style(dojo.byId("ai-button"), "display", aiDisplay);
	
	var prevViewId = (viewId == "distribution") ? "transmission" : "distribution";
	var display = dojo.style(dojo.byId(prevViewId + "InspectorPanel"), "display");
	dojo.query(".inspectorPanel").style("display", "none");
	dojo.style(dojo.byId(viewId + "InspectorPanel"), "display", display);
	
	setSiteViewerContent(0);
	
	dojo.byId("analyst-button").click();
}

function populateBladeViewerContent(feature, open) {
	var viewId = (siteView == "DistributionLine") ? "distribution" : "transmission";
	dojo.style("zoomify-loading", "display", "block");
	
	var attributes = feature.attributes;
	var id = attributes["uniqueId"];
	var name = attributes["poleId"];
	siteId = attributes["subStationId"];
	siteName = attributes["name"];
	var x = dojo.number.format(attributes["location.longitude"], { places:4 });
	var y = dojo.number.format(attributes["location.latitude"], { places:4 });
	var criticality = attributes["criticality"];
	
	dojo.byId("siteId").innerHTML = (viewId == "distribution") ? siteName + "-" + attributes["feederNumber"] : siteName;
	dojo.byId("workOrder").innerHTML = workOrderNumber;
	dojo.byId("turbineId").innerHTML = name;
	dojo.byId("turbineLocation").innerHTML = x + " , " + y;
	
	dojo.byId("pole-criticality").innerHTML = (viewId == "distribution") ? attributes["horizontalLoadingPercent"] : "";
	var backgroundColor = (viewId == "distribution") ? severityColors[criticality] : transmissionSeverityColors[criticality];
	dojo.style(dojo.byId("pole-criticality"), "backgroundColor", backgroundColor);
	
	dojo.attr("siteId", "data-site-id", siteId);
	dojo.attr("turbineId", "data-turbine-id", id);
	
	var buttonDisplay = (viewId == "distribution") ? "block" : "none";
	dojo.style(dojo.byId("bladeInspectionReportButtonDiv"), "display", buttonDisplay);
	
	dojo.query(".inspectorPanel").style("display", "none");
	dojo.style(dojo.byId(viewId + "InspectorPanel"), "display", "block");
	
	var table = dojo.byId(viewId + "InspectionDataTable");
	dojo.empty(table);
	
	var i = 0;
	if (viewId == "distribution") {
		
		if (_.has(siteData[siteId].workOrders[workOrderNumber].summary.objects, "poleInspectionSummary") && !_.isEmpty(siteData[siteId].workOrders[workOrderNumber].summary.objects.poleInspectionSummary)) {
			siteData[siteId].workOrders[workOrderNumber].summary.objects.poleInspectionSummary[name].latLongDelta = dojo.number.format(siteData[siteId].workOrders[workOrderNumber].summary.objects.poleInspectionSummary[name].latLongDelta, { places:8 });
		}
		
		dojo.forEach(_.keys(translationJson.views), function(view) {
			var fields = translationJson.views[view];
			var skipProperty = [];
			
			dojo.forEach(fields, function(field) {
				var summaryParts = field.split(".");
				var summaryName = summaryParts[0];
				var summaryProperty = summaryParts.slice(1);
				var summaryObject = (summaryName.indexOf("pole") >= 0) ? siteData[siteId].workOrders[workOrderNumber].summary.objects[summaryName][name] : siteData[siteId].workOrders[workOrderNumber].summary.objects[summaryName];
				
				if (!_.isUndefined(summaryObject)) {
					if (summaryProperty.length == 1) {
						var property = summaryProperty[0];
						if (property.indexOf("[]") >= 0) {
							property = property.replace("[]","");
							dojo.forEach(summaryObject[property], function(value, j) {
								var label = translationJson.fields[field].label.replace("{index}", "(" + (j+1) + ")");
								var tr = dojo.create("tr",{"className":(i%2==0) ? "even" : "odd"}, table);
								dojo.create("td",{"innerHTML": label, "className":"label"}, tr);
								dojo.create("td",{"innerHTML":value, "className":"value"}, tr);
								i += 1;
							});
						} else {
							var value = summaryObject[property];
							var label = translationJson.fields[field].label;
							var tr = dojo.create("tr",{"className":(i%2==0) ? "even" : "odd"}, table);
							dojo.create("td",{"innerHTML": label, "className":"label"}, tr);
							dojo.create("td",{"innerHTML":value, "className":"value"}, tr);
							i += 1;
						}
					} else {
						var property = summaryProperty[0];
						var group = _.filter(fields, function(i) { return _.contains(i.split("."), property); });
						if (!_.contains(skipProperty, field)) {
							
							if (group.length > 1) {
								skipProperty.push(_.last(group));
							}
							
							if (property.indexOf("[]") >= 0) {
								property = property.replace("[]","");
								dojo.forEach(summaryObject[property], function(v, j) {
									dojo.forEach(group, function(field, k) {
										var subProperty = field.split(".").pop();
										var value = v[subProperty];
										var label = translationJson.fields[field].label.replace("{index}", "(" + (j+1) + ")");
										var tr = dojo.create("tr",{"className":(i%2==0) ? "even" : "odd"}, table);
										dojo.create("td",{"innerHTML": label, "className":"label"}, tr);
										dojo.create("td",{"innerHTML":value, "className":"value"}, tr);
										i += 1;
									})
								});
							} else {
								dojo.forEach(group, function(field, k) {
									var subProperty = field.split(".").pop();
									var value = summaryObject[property][subProperty];
									var label = translationJson.fields[field].label;
									var tr = dojo.create("tr",{"className":(i%2==0) ? "even" : "odd"}, table);
									dojo.create("td",{"innerHTML": label, "className":"label"}, tr);
									dojo.create("td",{"innerHTML":value, "className":"value"}, tr);
									i += 1;
								})
							}
						}
					}
				}
			})
		})
	}
	
	if (viewId == "transmission") {
		/* 
		var summaryObject = siteData[siteId].workOrders[workOrderNumber].summary.objects.structureInspectionSummary[name];
		var value = siteName;
		var tr = dojo.create("tr",{"className":"odd"}, table);
		dojo.create("td",{"innerHTML": "Line ID", "className":"label"}, tr);
		dojo.create("td",{"innerHTML": value, "className":"value"}, tr);
		
		var value = attributes["dateOfInspection"];
		var tr = dojo.create("tr",{"className":"even"}, table);
		dojo.create("td",{"innerHTML": "Inspection Date", "className":"label"}, tr);
		dojo.create("td",{"innerHTML": value, "className":"value"}, tr);
		/* 
		var value = name;
		var tr = dojo.create("tr",{"className":"odd"}, table);
		dojo.create("td",{"innerHTML": "Structure Number", "className":"label"}, tr);
		dojo.create("td",{"innerHTML": value, "className":"value"}, tr);
		
		var value = dojo.number.format(attributes["location.longitude"], { places:8 });
		var tr = dojo.create("tr",{"className":"even"}, table);
		dojo.create("td",{"innerHTML": "Longitude", "className":"label"}, tr);
		dojo.create("td",{"innerHTML": value, "className":"value"}, tr);
		
		var value = dojo.number.format(attributes["location.latitude"], { places:8 });
		var tr = dojo.create("tr",{"className":"odd"}, table);
		dojo.create("td",{"innerHTML": "Latitude", "className":"label"}, tr);
		dojo.create("td",{"innerHTML": value, "className":"value"}, tr);
		 */
		dojo.byId("inspectionDateRow").innerHTML = attributes["dateOfInspection"];
		getTransmissionInspectionEvents(siteId, workOrderNumber, turbineId);
	}
	
	var api = $('#' + viewId + 'InspectionDataTableContent').data("jsp");
	api.reinitialise();
	var assetInspectionId = (viewId == "distribution") ? "poleInspectionSummary" : "structureInspectionSummary"
	var assetInspection = siteData[siteId].workOrders[workOrderNumber].summary.objects[assetInspectionId][name];
	dojo.query("#bladeViewerImageGallery .lSSlideOuter").style("height", "auto");
	dojo.query("#bladeViewerImageGallery .lSGallery").style( { "height": "auto", "background": "none", "border":"none" })
	
	bladeImageGallery.destroy();
	var ul = dojo.byId("image-gallery");
	dojo.empty(ul);
	var images = [];
	var flightImages = [];
	var thermalImages = [];
	var groundImages = [];
	var identifiedComponentImages = [];
	
	if (!_.isUndefined(assetInspection)) {
		
		if (_.has(assetInspection, "flightImages")){
			flightImages = dojo.filter(assetInspection.flightImages, function(image) { return !_.isNull(image.zoomifyURL); });
			dojo.forEach(flightImages, function(image, i) {
				var li = dojo.create("li", {}, ul);
				dojo.attr(li, "data-thumb", image.scaledImageURL);
				dojo.attr(li, "data-image-url", image.downloadURL);
				dojo.attr(li, "data-zoomify-url", image.zoomifyURL.split("?")[0]);
				dojo.attr(li, "data-image-type", "zoomify");
				dojo.attr(li, "data-image-id", image.resourceId);
				dojo.attr(li, "data-image-name", "VA-" + (i + 1));
				dojo.attr(li, "data-image-label", "Visual Aerial (" + (i + 1) + " of " + flightImages.length + ")" );
				dojo.create("img", { "src": image.downloadURL, "style":"width:450px;height:373px" }, li)
			});
		}
		if (_.has(assetInspection, "thermalImages")) {
			thermalImages = dojo.filter(assetInspection.thermalImages, function(image) { return !_.isNull(image.downloadURL); });
			dojo.forEach(thermalImages, function(image, i) {
				var li = dojo.create("li", {}, ul);
				dojo.attr(li, "data-thumb", image.scaledImageURL);
				dojo.attr(li, "data-image-url", image.downloadURL);
				dojo.attr(li, "data-image-type", "image");
				dojo.attr(li, "data-image-id", image.resourceId);
				dojo.attr(li, "data-image-name", "TA-" + (i + 1));
				dojo.attr(li, "data-image-label", "Thermal Aerial (" + (i + 1) + " of " + thermalImages.length + ")" );
				dojo.create("img", { "src": image.downloadURL, "style":"width:450px;height:373px" }, li)
			});
		}
		if (_.has(assetInspection, "groundImages")) {
			groundImages = dojo.filter(assetInspection.groundImages, function(image) { return !_.isNull(image.downloadURL); });
			dojo.forEach(groundImages, function(image, i) {
				var li = dojo.create("li", {}, ul);
				dojo.attr(li, "data-thumb", image.scaledImageURL);
				dojo.attr(li, "data-image-url", image.downloadURL);
				dojo.attr(li, "data-image-type", "image");
				dojo.attr(li, "data-image-id", image.resourceId);
				dojo.attr(li, "data-image-name", "VG-" + (i + 1));
				dojo.attr(li, "data-image-label", "Visual Ground (" + (i + 1) + " of " + groundImages.length + ")" );
				dojo.create("img", { "src": image.downloadURL, "style":"width:450px;height:373px" }, li)
			});
		}
		if (_.has(assetInspection, "identifiedComponentImages")) {
			identifiedComponentImages = dojo.filter(assetInspection.identifiedComponentImages, function(image) { return !_.isNull(image.zoomifyURL); });
			dojo.forEach(identifiedComponentImages, function(image, i) {
				var li = dojo.create("li", {}, ul);
				dojo.attr(li, "data-thumb", image.scaledImageURL);
				dojo.attr(li, "data-image-url", image.downloadURL);
				dojo.attr(li, "data-zoomify-url", image.zoomifyURL.split("?")[0]);
				dojo.attr(li, "data-image-type", "zoomify");
				dojo.attr(li, "data-image-id", image.resourceId);
				dojo.attr(li, "data-image-name", "IC-" + (i + 1));
				dojo.attr(li, "data-image-label", "Identified Components (" + (i + 1) + " of " + identifiedComponentImages.length + ")" );
				dojo.create("img", { "src": image.downloadURL, "style":"width:450px;height:373px" }, li)
			});
		}
	}
	
	bladeImageGallery = $('#image-gallery').lightSlider({
		gallery:true,
		item:1,
		thumbItem:5,
		vertical:true,
		verticalHeight: 373,
		vThumbWidth: 100,
		thumbMargin: 2,
		galleryMargin:0,
		slideMargin: 0,
		speed:500,
		auto:false,
		loop:false,
		onSliderLoad: function() {
			$('#image-gallery').removeClass('cS-hidden');
		}
	});
	
	if (flightImages.length == 0 && !_.isUndefined(Z.Viewer)) {
		Z.Viewer.setImage(window.location.href + 'images/blades/blank.zif');
	}
	window.setTimeout(function() {
		dojo.style("zoomify-loading", "display", "none");
	}, 1000);
	
	if (dojo.query("#image-gallery li").length < 5) {
		window.setTimeout(function() {
			dojo.query("#bladeViewerImageGallery .lSSlideOuter").style("height", "375px");
			dojo.query("#bladeViewerImageGallery .lSGallery").style( { "height": "373px", "background": "#EEEEEE", "border":"1px solid #cccccc" });
		}, 250);
	}
	
	var status = dojo.byId("bladeViewer").getAttribute('data-blade-viewer-status');
	if (status == 'closed' && open) {
		openViewerPanel("bladeViewer");
		var z = {
			'siteViewer': 50,
			'bladeViewer': 50,
			'lasViewer': 50
		}
		z['bladeViewer'] = z['bladeViewer'] + 10;
		_.each(_.keys(z), function(i) {
			dojo.style(i, "z-index", z[i])
		})
	}
}

function getQueryResultsExtent(features) {
	var x = [], y = []
	dojo.forEach(features, function(feature) {
		x.push(feature.geometry.x);
		y.push(feature.geometry.y);
	});
	
	if (features.length > 1 && _.uniq(x).length > 1 && _.uniq(y).length > 1){
		var envelope = new esri.geometry.Extent(Math.min.apply(Math, x),Math.min.apply(Math, y), Math.max.apply(Math, x), Math.max.apply(Math, y), map.spatialReference);
	} else {
		var expand = 1000
		var envelope = new esri.geometry.Extent(x[0]-expand,y[0]-expand,x[0]+expand,y[0]+expand, map.spatialReference);
	}
	
	return envelope;
}

function shiftMapCenter(x, y, viewer) {
	/* var offset = map.getResolution() * dojo.style(viewer,"width")/2;
	var point = new esri.geometry.Point(x - offset, y, map.spatialReference);
	map.centerAt(point); */
}

function openViewerPanel(id) {
	var status = (id == 'bladeViewer') ? 'data-blade-viewer-status': (id == 'siteViewer') ? 'data-site-viewer-status' : 'data-las-viewer-status';
	
	var z = {
		'siteViewer': 50,
		'bladeViewer': 50,
		'lasViewer':50
	}
	z[id] = z[id] + 1;
	_.each(_.keys(z), function(i) {
		dojo.style(i, "z-index", z[i])
	})
	
	dojo.fx.slideTo({
		node: id, 
		left: "20", 
		top: dojo.style(id, "top"),
		beforeBegin:  function() {
			dojo.attr(id, status, 'open');
		}
	}).play();
	
	if (id == 'siteViewer' || id == 'bladeViewer') {
		var div = (id == 'siteViewer') ? '#siteViewerRecords' : '#distributionInspectionDataTableContent';
		var api = $(div).data('jsp');
		api.reinitialise();
	}
}

function closeViewerPanel(id) {
	if (id == 'bladeViewer') {
		var status = 'data-blade-viewer-status';
		var otherStatus = dojo.attr('siteViewer', 'data-site-viewer-status');
	} else if (id == 'siteViewer') {
		var status = 'data-site-viewer-status';
		var otherStatus = dojo.attr('bladeViewer', 'data-blade-viewer-status');
	} else if (id == 'lasViewer') {
		var status = 'data-las-viewer-status';
		var otherStatus = dojo.attr('siteViewer', 'data-site-viewer-status');
	}
	
	var z = {
		'siteViewer': 51,
		'bladeViewer': 51
	}
	z[id] = z[id] - 1;
	_.each(_.keys(z), function(i) {
		dojo.style(i, "z-index", z[i])
	})

	dojo.fx.slideTo({
		node: id,
		left: -(dojo.coords(id).w + 5),
		top: dojo.style(id, "top"),
		beforeBegin:  function() {
			dojo.attr(id, status, 'closed');
			if (otherStatus == 'closed') {
				centerMapOnViewerChange('close');
			}
		}
	}).play();
}

function resizeViewerPanel(id) {
	var margin = 20;
    
    if (id == "siteViewer" || id == "transmissionViewer") {
        
		var view = (id == "siteViewer") ? "site" : "transmission";
        var fullHeight = dojo.getMarginBox("siteViewerHeader").h + 
                        dojo.getMarginExtents(dojo.byId(view + 'ViewerInnerContent'), dojo.getComputedStyle(dojo.byId(view + 'ViewerInnerContent'))).h + 
                        dojo.getMarginBox(view + "ViewerInnerTop").h + 
                        dojo.getMarginBox(view + 'ViewerRecordsText').h + 
                        dojo.getMarginBox(view + 'ViewerRecordsTable').h + 
                        dojo.getMarginBox("siteViewerFooter").h;
        var mapHeight = dojo.getMarginBox("map").h - margin*2;
        var height = (fullHeight > mapHeight) ? mapHeight : fullHeight;
        
        dojo.style("siteViewer", {
            height: height + "px",
            top: margin + "px"
        });
        
        dojo.style(view + "ViewerOuterContent", { 
            height: (height - dojo.getMarginBox("siteViewerHeader").h - dojo.getMarginBox("siteViewerFooter").h) + "px"
        });
        
        var innerHeight = dojo.getMarginBox(view + "ViewerOuterContent").h - 
                        dojo.getMarginBox(view + "ViewerInnerTop").h - 
                        dojo.getMarginExtents(dojo.byId(view + 'ViewerInnerContent'), dojo.getComputedStyle(dojo.byId(view + 'ViewerInnerContent'))).h;
        dojo.style(view + "ViewerInnerCenter", { 
            height: innerHeight + "px"
        });
        dojo.style(view + "ViewerRecords", { 
            height: (innerHeight - dojo.getMarginBox(view + 'ViewerRecordsText').h) + "px"
        });
    }
    
   if (id == "bladeViewer") {
        var fullHeight = dojo.getMarginBox("bladeViewerInnerContent").h + 
                        dojo.getMarginBox("bladeViewerHeader").h + 
                        dojo.getMarginBox("bladeViewerFooter").h + 10;
        var offset = parseInt((dojo.getMarginBox("map").h - fullHeight)/2);
        var height = (offset <= margin ) ? dojo.getMarginBox("map").h - margin*2 : fullHeight;
        dojo.style("bladeViewer", {
            height: height + "px",
            top: margin + "px"
        });
        dojo.style("bladeViewerOuterContent", { 
            height: (height - dojo.getMarginBox("bladeViewerHeader").h - dojo.getMarginBox("bladeViewerFooter").h) + "px" 
        });
   }
   
   if (id == "lasViewer") {
        var fullHeight = dojo.getMarginBox("map").h - 
                        dojo.getMarginBox("lasViewerHeader").h - 
                        dojo.getMarginBox("lasViewerFooter").h;
        var offset = parseInt((dojo.getMarginBox("map").h - fullHeight)/2);
        var height = (offset <= margin ) ? dojo.getMarginBox("map").h - margin*2 : fullHeight;
        dojo.style("lasViewer", {
            height: height + "px",
            top: margin + "px"
        });
        dojo.style("lasViewerOuterContent", { 
            height: (height - dojo.getMarginBox("bladeViewerHeader").h - dojo.getMarginBox("bladeViewerFooter").h) + "px" 
        });
   }
   
    var div = (id == 'siteViewer') ? '#siteViewerRecords' : '#distributionInspectionDataTableContent';
	var api = $(div).data('jsp');
	api.reinitialise();
}

function resetBladeViewerPanel() {
	
	var viewId = (siteView == "DistributionLine") ? "distribution" : "transmission";
	
	turbineId = null;
	turbineName = null;
	
	dojo.byId("siteId").innerHTML = '';
	dojo.byId("workOrder").innerHTML = '';
	dojo.byId("turbineId").innerHTML = '';
	dojo.byId("turbineLocation").innerHTML = '';
	dojo.byId("pole-criticality").innerHTML = '';
	dojo.style(dojo.byId("pole-criticality"), "backgroundColor", "#444444");

	dojo.attr("siteId", "data-site-id", 0);
	dojo.attr("turbineId", "data-turbine-name", 0);
	dojo.attr("turbineId", "data-turbine-id", 0);
	
	dojo.style(viewId + 'InspectorPanel', 'display', 'block');
	dijit.byId('enableMoreInfo').set('label', "Hide Inspection Details");
	dojo.style('bladeViewer', 'width', '950px');
	
	var table = dojo.byId(viewId + "InspectionDataTable");
	dojo.empty(table);
	
	var api = $("#" + viewId + "InspectionDataTableContent").data('jsp');
	api.reinitialise();
	
	bladeImageGallery.destroy();
	var ul = dojo.byId("image-gallery");
	dojo.empty(ul);
	
	if (!_.isUndefined(Z.Viewer)) {
		Z.Viewer.setImage(window.location.href + 'images/blades/blank.zif');
	}
	dojo.byId("bladeViewerImageText").innerHTML = "";
	
	if (viewId == "transmission") {
		dijit.byId('inspectionEventTypeDropdown').set('value', '');
		resetZoomifyAnnotationDisplay();
		disableZoomifyAnnotationDisplay(true);
	}
}

function resetSiteViewerPanel() {
	if (dijit.byId("siteViewerGrid") != undefined) {
		dijit.byId("siteViewerGrid").destroyRecursive();
	}
	var options = dijit.byId("siteViewerDropDown").options;
	dijit.byId("siteViewerDropDown").removeOption(options);
	dijit.byId('siteViewerDropDown')._setDisplay("");
	dojo.byId("distribution_inspections_total").innerHTML = '';
	dojo.style("siteViewerRecordsTable", "backgroundImage", "none");
	var api = $("#siteViewerRecords").data('jsp');
	api.reinitialise();
	
	
	if (dijit.byId("transmissionViewerGrid") != undefined) {
		dijit.byId("transmissionViewerGrid").destroyRecursive();
	}
	var options = dijit.byId("transmissionViewerDropDown").options;
	dijit.byId("transmissionViewerDropDown").removeOption(options);
	dijit.byId('transmissionViewerDropDown')._setDisplay("");
	dojo.byId("transmission_inspections_total").innerHTML = '';
	dojo.style("transmissionViewerRecordsTable", "backgroundImage", "none");
	var api = $("#transmissionViewerRecords").data('jsp');
	api.reinitialise();
	
}

function clearSiteViewerPanel(){
	if (dijit.byId("siteViewerGrid") != undefined) {
		var store = new dojo.data.ItemFileReadStore({data: {  identifier: "",  items: []}});
		dijit.byId("siteViewerGrid").setStore(store);
		var height = dojo.style("siteViewerRecords", "height");
		dojo.style("siteViewerRecordsTable", "height", height + "px")
	}
	dojo.byId("distribution_inspections_total").innerHTML = '';
	var api = $("#siteViewerRecords").data('jsp');
	api.reinitialise();
	
	if (dijit.byId("transmissionViewerGrid") != undefined) {
		var store = new dojo.data.ItemFileReadStore({data: {  identifier: "",  items: []}});
		dijit.byId("transmissionViewerGrid").setStore(store);
		var height = dojo.style("siteViewerRecords", "height");
		dojo.style("transmissionViewerRecordsTable", "height", height + "px")
	}
	dojo.byId("transmission_inspections_total").innerHTML = '';
	var api = $("#transmissionViewerRecords").data('jsp');
	api.reinitialise();
}

function centerMapOnViewerChange(status) {
	var offset = map.__LOD.resolution * dojo.style("bladeViewer","width")/2;
	var centroid = getMapCentroid();
	var x = (status == 'open') ? centroid.x - offset : centroid.x + offset;
	var y = centroid.y;
	/* var point = new esri.geometry.Point(x, y, map.spatialReference);
	map.centerAt(point); */
}

function getMapCentroid() {
	var extent = map.extent;
	var x = (extent.xmax + extent.xmin)/2;
	var y = (extent.ymax + extent.ymin)/2;
	return { "x":x, "y":y }
}

function populatePoleRecordTable(features, selectId){
	
    var gridFields = [
        {"name":"criticality", "alias":"criticality", "width":"24px", "hidden": false },
		{"name":"poleId", "alias":"Pole ID", "width":"160px", "hidden": false },
        {"name":"dateOfAnalysis", "alias":"Analysis Date", "width":"150px", "hidden": false },
		{"name":"horizontalLoadingPercent", "alias":"Horizontal Pole Loading", "width":"162px", "hidden": false },
    ];
    
	var fields = {}
	dojo.forEach(gridFields, function (field) {
		fields[field.name] = field.alias;
	});
	
	var data = dojo.clone(siteData[siteId].workOrders[workOrderNumber].summary.store);
	var store = new dojo.data.ItemFileWriteStore({data: data});
	store.comparatorMap = {};
	store.comparatorMap["Pole ID"] = function(a,b) {
		var _a = parseInt(a);
		var _b = parseInt(b);
		var ret = 0;
		if (_a > _b) {
			ret = 1;
		}
		if (_a < _b) {
			ret = -1;
		}
		return ret;
	}
	store.comparatorMap["Horizontal Pole Loading"] = function(a,b) {
		console.log(a);
		var _a = (a == " -- ") ? 0 : a;
		var _b = (b == " -- ") ? 0 : b;
		var ret = 0;
		if (_a > _b) {
			ret = 1;
		}
		if (_a < _b) {
			ret = -1;
		}
		return ret;
	}
	
	if (dijit.byId("siteViewerGrid") == undefined) {
		var columns = [];
		dojo.forEach(gridFields, function(field){
			var header = {};
			header.field = fields[field.name];
			header.name = fields[field.name];
			header.width = field.width;
			header.hidden = field.hidden;
			header.noresize =  true; 
			header.datatype = "string";
			header.styles = "text-align:center;";
			if (header.field == 'criticality') {
				header.name = ' ';
				header.formatter = function(val, rowIdx, cell) {
					var severity = _.first(this.grid.getItem(rowIdx)["criticality"]);
					var uniqueId = _.first(this.grid.getItem(rowIdx)["uniqueId"]);
					return '<div class="blade_viewer_tool"><div id="datagrid-' + uniqueId + '" class="grid_circle blade_viewer_row" style="background:' + severityColors[severity] + ';">i</div></div>' 
				};
			}
			if (header.field == 'Horizontal Pole Loading') {
				header.formatter = function(val, rowIdx, cell) {
					return (val != " -- ") ? val + " %" : val;
				};
			}
			columns.push(header);
		});
		var uuid = {
				'name': ' ',
				'field':'uniqueId',
				'width':2, 
				'hidden': true,
				'noresize':true,
				'datatype':'string'
		};
		columns.push(uuid);
		
		// create the new dojox grid
		var grid = new dojox.grid.DataGrid({
			id: "siteViewerGrid",
			store: store,
			clientSort: false,
			noscroll: true,
			autoHeight: true,
			loadingMessage: "Data loading...",
			selectionMode: "single"
		},
		document.createElement('div'));
		grid.setStructure(columns);
		
		grid.on("RowClick", function(evt) {
			var idx = evt.rowIndex;
			var cell = evt.cell;
			var column = cell.field;
			var item = this.getItem(idx);
			var store = this.store;
			dojo.byId("siteId").innerHTML = '';
			dojo.byId("workOrder").innerHTML = '';
			dojo.byId("turbineId").innerHTML = '';
            dojo.byId("turbineLocation").innerHTML = '';
			dojo.style(dojo.byId("pole-criticality"), "backgroundColor", severityColors["NA"]);
			
			var obj = {
				id:store.getValue(item, 'uniqueId'),
				name:store.getValue(item, 'Pole ID'),
				criticality:store.getValue(item, 'criticality')
			}
			getAndSetBladeViewerAsset(obj, true);
		}, true);
		
		dojo.byId("siteViewerRecordsTable").appendChild(grid.domNode);
		grid.startup();
		grid.resize();
		grid.update();
		
		dojo.connect(grid, "onCellMouseOver", function(e){
			if (this.getItem(e.rowIndex)) {
				if (e.cell.field == "criticality") {
					var content = 'Horizontal Pole Loading (%): ' + this.getItem(e.rowIndex)["Horizontal Pole Loading"] + '<br>';
					content += 'Click to review the inspection of this pole in the Pole Viewer';
					showToolTip(e, content);
				}
			}
		});
		dojo.connect(grid, "onCellMouseOut", function(e) {
			if (tooltip) {
				tooltip.style.display = "none";
			 }
		});
		
		resizeViewerPanel("siteViewer");
	} else {
		dijit.byId("siteViewerGrid").setStore(store);
		dijit.byId("siteViewerGrid").render();
	}
	
	var height = dojo.getComputedStyle(dojo.byId('siteViewerGrid')).height;
	dojo.style("siteViewerRecordsTable", { "height": height});
	
	var api = $("#siteViewerRecords").data('jsp');
	api.reinitialise();
}

function populateStructureRecordTable(features, selectId){
	
    var gridFields = [
        {"name":"criticality", "alias":"criticality", "width":"24px", "hidden": false },
		{"name":"poleId", "alias":"Structure Number", "width":"241px", "hidden": false },
        {"name":"dateOfInspection", "alias":"Inspection Date", "width":"235px", "hidden": false },
    ];
    
	var fields = {}
	dojo.forEach(gridFields, function (field) {
		fields[field.name] = field.alias;
	});
	
	var data = dojo.clone(siteData[siteId].workOrders[workOrderNumber].summary.store);
	var store = new dojo.data.ItemFileWriteStore({data: data});
	store.comparatorMap = {};
	store.comparatorMap["Structure Number"] = function(a,b) {
		var _a = parseInt(a);
		var _b = parseInt(b);
		var ret = 0;
		if (_a > _b) {
			ret = 1;
		}
		if (_a < _b) {
			ret = -1;
		}
		return ret;
	}
	
	if (dijit.byId("transmissionViewerGrid") == undefined) {
		var columns = [];
		dojo.forEach(gridFields, function(field){
			var header = {};
			header.field = fields[field.name];
			header.name = fields[field.name];
			header.width = field.width;
			header.hidden = field.hidden;
			header.noresize =  true; 
			header.datatype = "string";
			header.styles = "text-align:center;";
			if (header.field == 'criticality') {
				header.name = ' ';
				header.formatter = function(val, rowIdx, cell) {
					var severity = _.first(this.grid.getItem(rowIdx)["criticality"]);
					var uniqueId = _.first(this.grid.getItem(rowIdx)["uniqueId"]);
					return '<div class="blade_viewer_tool"><div id="datagrid-' + uniqueId + '" class="grid_circle blade_viewer_row" style="background:' + transmissionSeverityColors[severity] + ';">i</div></div>' 
				};
			}
			columns.push(header);
		});
		var uuid = {
				'name': ' ',
				'field':'uniqueId',
				'width':2, 
				'hidden': true,
				'noresize':true,
				'datatype':'string'
		};
		columns.push(uuid);
		
		var grid = new dojox.grid.DataGrid({
			id: "transmissionViewerGrid",
			store: store,
			clientSort: false,
			noscroll: true,
			autoHeight: true,
			loadingMessage: "Data loading...",
			selectionMode: "single"
		},
		document.createElement('div'));
		grid.setStructure(columns);
		
		grid.on("RowClick", function(evt) {
			var idx = evt.rowIndex;
			var cell = evt.cell;
			var column = cell.field;
			var item = this.getItem(idx);
			var store = this.store;
			
			dojo.byId("siteId").innerHTML = '';
			dojo.byId("workOrder").innerHTML = '';
			dojo.byId("turbineId").innerHTML = '';
            dojo.byId("turbineLocation").innerHTML = '';
			dojo.style(dojo.byId("pole-criticality"), "backgroundColor", transmissionSeverityColors["NA"]);
			
			var obj = {
				id:store.getValue(item, 'uniqueId'),
				name:store.getValue(item, 'Structure Number'),
				criticality:store.getValue(item, 'criticality')
			}
			getAndSetBladeViewerAsset(obj, true);

		}, true);

		dojo.byId("transmissionViewerRecordsTable").appendChild(grid.domNode);
		grid.startup();
		grid.resize();
		grid.update();
		
		dojo.connect(grid, "onCellMouseOver", function(e){
			if (this.getItem(e.rowIndex)) {
				if (e.cell.field == "criticality") {
					var content = 'Damage Assessment: ' + this.getItem(e.rowIndex)["criticality"] + '<br>';
					content += 'Click to review the inspection of this structure in the Transmission Viewer';
					showToolTip(e, content);
				}
			}
		});
		dojo.connect(grid, "onCellMouseOut", function(e) {
			if (tooltip) {
				tooltip.style.display = "none";
			 }
		});
		
		resizeViewerPanel("transmissionViewer");
	} else {
		dijit.byId("transmissionViewerGrid").setStore(store);
		dijit.byId("transmissionViewerGrid").render();
	}
	
	var height = dojo.getComputedStyle(dojo.byId('transmissionViewerGrid')).height;
	dojo.style("transmissionViewerRecordsTable", { "height": height});
	
	var api = $("#transmissionViewerRecords").data('jsp');
	api.reinitialise();
}

function createGridDataStore(id, workOrder, data, type) {
	
	var gridFields = {
		"DistributionLine": [
			{"name":"criticality", "alias":"criticality", "width":"24px", "hidden": false },
			{"name":"poleId", "alias":"Pole ID", "width":"160px", "hidden": false },
			{"name":"dateOfAnalysis", "alias":"Analysis Date", "width":"150px", "hidden": false },
			{"name":"horizontalLoadingPercent", "alias":"Horizontal Pole Loading", "width":"162px", "hidden": false }
		],
		"TransmissionLine": [
			{"name":"criticality", "alias":"criticality", "width":"24px", "hidden": false },
			{"name":"poleId", "alias":"Structure Number", "width":"241px", "hidden": false },
			{"name":"dateOfInspection", "alias":"Inspection Date", "width":"231px", "hidden": false }
		]
	};
    
	var fields = {}
	dojo.forEach(gridFields[type], function (field) {
		fields[field.name] = field.alias;
	});
	
	gridItems = [];
	dojo.forEach(data, function (asset){
		var item = {};
		item['uniqueId'] = asset.id;
		
		if (type == "DistributionLine") {
			item[fields['poleId']] = asset.utilityId;
			item[fields['criticality']] = (!_.isEmpty(asset.assetInspection) && !_.isNull(asset.assetInspection.criticality)) ? asset.assetInspection.criticality : "NA";
			item[fields['horizontalLoadingPercent']] = (!_.isEmpty(asset.assetInspection) && !_.isNull(asset.assetInspection.horizontalLoadingPercent)) ? asset.assetInspection.horizontalLoadingPercent : " -- ";
			item[fields['dateOfAnalysis']] = (!_.isEmpty(asset.assetInspection) && !_.isNull(asset.assetInspection.dateOfAnalysis)) ? convertDate(asset.assetInspection.dateOfAnalysis, "viewer") : " -- ";
		}
		
		if (type == "TransmissionLine") {
			item[fields['poleId']] = asset.structureNumber;
			item[fields['criticality']] = (!_.isEmpty(asset.assetInspection) && !_.isNull(asset.assetInspection.severity)) ? asset.assetInspection.severity : "NA";
			item[fields['dateOfInspection']] = (!_.isEmpty(asset.assetInspection) && !_.isNull(asset.assetInspection.dateOfInspection)) ? convertDate(asset.assetInspection.dateOfInspection, "viewer") : " -- ";
		}
		
		gridItems.push(item);
	});
	/* gridItems.sort(function (a,b) {
		// this sorts the array of json objects using the name key
		var idA = (isNaN(parseInt(a[fields["poleId"]].slice(-1)))) ? a[fields["poleId"]].replace(/^([ABCDEFGHIJKLMNOPQRSTUVWXYZ]+)/gi,'') : parseInt(a[fields["poleId"]].replace(/\D/g,''));
		var idB = (isNaN(parseInt(b[fields["poleId"]].slice(-1)))) ? b[fields["poleId"]].replace(/^([ABCDEFGHIJKLMNOPQRSTUVWXYZ]+)/gi,'') : parseInt(b[fields["poleId"]].replace(/\D/g,''));
		var a1 = typeof idA, b1=typeof idB;
		return a1<b1 ? -1 :a1>b1 ? 1 : idA<idB ? -1 : idA>idB ? 1 : 0;
		
	}); */
	gridItems.sort();
	
	var data = {
		identifier:"uniqueId",
		items:gridItems
	};
    siteData[id].workOrders[workOrder].summary.store = dojo.clone(data);
}

function getAndSetBladeViewerAsset(item, open) {
	dojo.byId("siteId").innerHTML = '';
	dojo.byId("workOrder").innerHTML = '';
	dojo.byId("turbineId").innerHTML = '';
	dojo.byId("turbineLocation").innerHTML = '';
	dojo.style(dojo.byId("pole-criticality"), "backgroundColor", severityColors["NA"]);

	map.infoWindow.hide();
	var features = dojo.filter(windFeatureLayer.graphics, function(graphic) { return graphic.attributes['subStationId'] == siteId });
	var name = item.name;
	var id = item.id;
	turbineName = name;
	turbineId = id;
	var ids = dojo.map(features, function(feature){ return feature.attributes['uniqueId'] });
	var index = dojo.indexOf(ids, id);
	var graphic = features[index];

	if (item.criticality != "0") {
		populateBladeViewerContent(graphic, open);
	}

	clearHighlightSymbol();
	setSymbologyForFeature(graphic, true);

	var geometry = graphic.geometry;
	map.centerAt(geometry);
}

function setSelectedRowInSiteViewerTable(id, gridId){
	setTimeout(function(){ 
		getRowAndSelectInSiteViewerTable(id, gridId);
	}, 500);
}

function getRowAndSelectInSiteViewerTable(id, gridId) {
	if (dijit.byId(gridId + "ViewerGrid")) {
		var grid = dijit.byId(gridId + "ViewerGrid");
		grid.store.fetchItemByIdentity({
			identity: id,
			onItem : function(item, request) {
				grid.selection.clear();
				var index = grid.getItemIndex(item);
				grid.selection.setSelected(index, true);
				
				var y = index*23;
				var h = dojo.getContentBox(dojo.byId(gridId + "ViewerRecords")).h;
				y = (y < h) ? 0.01 : Math.floor(y/h)*h;
				
				var api = $("#" + gridId + "ViewerRecords").data('jsp');
				api.scrollToY(y)
			}
		});	
	}
}

function filterSiteViewerRecords(value){
	var viewId = (siteView == "DistributionLine") ? "site" : "transmission";
	
	var grid = dijit.byId(viewId + "ViewerGrid");
	var idField = (siteView == "DistributionLine") ? "Pole ID" : "Structure Number";
	
    var data = dojo.clone(siteData[siteId].workOrders[workOrderNumber].summary.store);
    var turbinesTotal = data.items.length;
    var items = [];
	var ids = []
	dojo.forEach(data.items, function(item) {
		if (item["criticality"] == value) {
			items.push(item);
			ids.push(item[idField]);
		}
	});
	
	data.items = dojo.clone(items);
    
    dojo.forEach(windFeatureLayer.graphics, function(graphic) { 
        var alpha = (dojo.indexOf(ids, graphic.attributes['poleId']) == -1) ? 0.1 : 1.0;
		
		if (!_.isNull(graphic.getNode())) {
			dojo.attr(graphic.getNode(), "opacity", alpha);
		}
        
        /* var fill = graphic.symbol.getFill();
        fill.a = alpha;
        graphic.symbol.setColor(fill);
        
        var stroke = graphic.symbol.getStroke();
        stroke.color.a = alpha;
        graphic.symbol.setOutline(stroke); */
		var select = turbineName == graphic.attributes['poleId'];
		setSymbologyForFeature(graphic, select);
    });
    
    if (grid != undefined) {
		grid.selection.clear();
		var store = new dojo.data.ItemFileReadStore({data: data});
		grid.setStore(store);
        
        if (items.length > 0) {
            window.setTimeout(function(){
				var cId = turbineName; // if using uniqueId then turbineId
				var id = (cId != "" && !_.isNull(cId) && _.contains(ids, cId)) ? cId : _.first(items)[idField];
				var idx = dojo.indexOf(ids, id);
				if (id != cId) {
					var item = items[idx];
					var obj = {
						id: item['uniqueId'],
						name: item[idField],
						criticality: item['criticality']
					}
					getAndSetBladeViewerAsset(obj, false);
				}
				setSelectedRowInSiteViewerTable(items[idx]["uniqueId"], viewId);
            }, 100);
        }
	}
    
	//dojo.byId("distribution_inspections_total").innerHTML = items.length + " (" + turbinesTotal + ")";
    
	var height = dojo.getComputedStyle(dojo.byId(viewId + 'ViewerGrid')).height;
	dojo.style(viewId + "ViewerRecordsTable", { "height": height});
	var api = $("#" + viewId + "ViewerRecords").data('jsp');
	api.reinitialise();
}

function clearFilterSiteViewerUI() {
	dojo.query(".class-legend-symbol").attr("data-filter", "");
	dojo.query(".class-legend-close").style("display", "none");
	
	//var data = dojo.clone(siteData[siteId].workOrders[workOrderNumber].summary.store);
	//dojo.byId("distribution_inspections_total").innerHTML = data.items.length;
}

function clearFilterSiteViewerRecords(){
	var viewId = (siteView == "DistributionLine") ? "site" : "transmission";
	
	var grid = dijit.byId(viewId + "ViewerGrid");
	var idField = (siteView == "DistributionLine") ? "Pole ID" : "Structure Number";
	
	var data = dojo.clone(siteData[siteId].workOrders[workOrderNumber].summary.store);
	var items = data.items;
	var ids = dojo.map(items, function(item, i) { return item[idField]; });
	
	if (grid != undefined) {
		grid.selection.clear();
		var store = new dojo.data.ItemFileReadStore({data: data});
		grid.setStore(store);
        
        if (items.length > 0) {
			
			window.setTimeout(function(){
				var tId = turbineName; // if using uniqueId then turbineId
				var id = (tId != "" && !_.isNull(tId)) ? tId : _.first(items)[idField];
				var idx = dojo.indexOf(ids, id);
				if (id != tId) {
					var item = items[idx];
					var obj = {
						id: item['uniqueId'],
						name: item[idField],
						criticality: item['criticality']
					}
					getAndSetBladeViewerAsset(obj, false);
				}
				setSelectedRowInSiteViewerTable(items[idx]["uniqueId"], viewId);
            }, 100);
        }
	}
    
	var height = dojo.getComputedStyle(dojo.byId(viewId + 'ViewerGrid')).height;
	dojo.style(viewId + "ViewerRecordsTable", { "height": height});
	var api = $("#" + viewId + "ViewerRecords").data('jsp');
	api.reinitialise();
}

function clearFilterSiteViewerFeatures() {
	dojo.forEach(windFeatureLayer.graphics, function(graphic) {
		var alpha = 1.0;
		if (!_.isNull(graphic.getNode())) {
			dojo.attr(graphic.getNode(), "opacity", alpha);
		}
		
        /* var fill = graphic.symbol.getFill();
        fill.a = 1.0;
        graphic.symbol.setColor(fill);
        
        var stroke = graphic.symbol.getStroke();
        stroke.color.a = 1.0;
        graphic.symbol.setOutline(stroke); */
		var select = turbineName == graphic.attributes['poleId'];
		setSymbologyForFeature(graphic, select);
    });
}


function wipeNode(direction , args){
	var node = dojo.byId(args.node);
	var width = (direction == "out") ? args.width : 1;
	var s = node.style;
    
    var anim = dojo.animateProperty(dojo.mixin({
        properties: {
            width: {
                end: width
            }
        }
    }, args));
    
    dojo.connect(anim, "beforeBegin", function(){
		if (direction == "out") {
			s.display = "block";
		}
    });
	
	dojo.connect(anim, "onEnd", function(){
		if (direction == "in") {
			s.display = "none";
		}
    });
    
    return anim; // dojo.Animation
}

function toggleWindSiteSelector() {
	var status = dojo.attr("mapWindSite","data-wind-selector-status");
    
    var visible  = (status == 'closed') ? "visible" : "hidden";
    dojo.query('[class*="toolTip"]').style("visibility", visible);
    
    status = (status == 'closed') ? "open" : "closed";
    dojo.attr("mapWindSite", "data-wind-selector-status", status);
}

function renderWindSiteSelector() {
    //set large width and padding to initially accommodate new content 
    dojo.style("windSiteSelectInnerContent", "width", "310px");
    dojo.style("windSiteSelectInnerContent", "padding", "15px");
    
    //get widths of new content; grab max width 
    var widths = dojo.map(dojo.query(".windSiteSelectorItem"), function(node) {
        return dojo.getMarginBox(node).w;
    });
    var width = _.max(widths);
    
    //set width to max of new content (+ padding for outer divs) 
    var padding = dojo.style("windSiteSelectInnerContent", "padding");
    dojo.style("windSiteSelectInnerContent", "width", width + "px");
    dojo.style("windSiteSelectContent", "width", (width + padding*2) + "px");
    
    //set height to min of map height or container height 
    var mh = dojo.getMarginBox("map").h - 40;
    var ch = dojo.getMarginBox("windSiteSelectInnerContent").h
    var height = (ch > mh) ? mh : ch;
    dojo.style("windSiteSelectContent", "height", height + "px");
    
    if (_.isUndefined($('#windSiteSelectContent').data("jsp"))) {
        $('#windSiteSelectContent').jScrollPane({
            verticalDragMinHeight: 24,
            verticalDragMaxHeight: 24,
            animateScroll: true
        });
    } else {
        var api = $('#windSiteSelectContent').data("jsp");
        dojo.query("#windSiteSelectContent .jspPane").style("width", (width + padding*2) + "px");
        dojo.query("#windSiteSelectContent .jspContainer").style("width", (width + padding*2) + "px");
        api.reinitialise();
    }
    
    var buttonCoords = dojo.getMarginBox("mapWindSite");
    var bh = buttonCoords.h;
    var bt = buttonCoords.t;

    var selectorCoords = dojo.getContentBox("windSiteSelectContainer");
    var sh = selectorCoords.h;
    var st = bt + bh/2 - sh/2;
    var sb = st + sh;
	
	st = (sb > mh) ? st - (sb - mh) : st;
	st = (st < 20) ? 20 : st;
    
    dojo.style("windSiteSelectContainer", "top", st + "px");
}

function hoverSiteSelector(node, state) {
    if (state == 'over') {
        dojo.addClass(node, 'siteSelecterOver');
    } else if (state == 'out') {
        dojo.removeClass(node, 'siteSelecterOver');
    }
}

function applyCssSkin(org) {
    authUserSkin = (_.has(skinTemplate, org)) ? skinTemplate[org] : skinTemplate["default"];
	
	var windamsLogoVisible = (org == "InspecToolsLLC") ? "visible" : " hidden";
	dojo.style("headerLeftDiv", "visibility", windamsLogoVisible);
    
    dojo.style('sign-in', {
        'backgroundColor': authUserSkin.css['sign-in'].background,
        'color': authUserSkin.css['sign-in'].color,
        'right': authUserSkin.css['sign-in'].right
    });
    
    dojo.style('current-user', {
        'right': authUserSkin.css['current-user'].right
    });
    
    dojo.style('loginDiv', {
        'right': authUserSkin.css['loginDiv'].right
    });
    
    dojo.style('headerRightDiv', {
        'display':authUserSkin.css['headerRightDiv'].display,
        'backgroundImage': authUserSkin.logo,
        'width': authUserSkin.css['headerRightDiv'].width
    });

    dojo.connect(dojo.byId("headerRightDiv"), "onclick", function(){ 
        window.open(authUserSkin.url);
    });
    
    dojo.connect(dojo.byId('headerRightDiv'), 'onmouseover', function() {
        dojo.style(this, 'backgroundColor', authUserSkin.css['headerRightDiv'].mouseOverBackground);
    });
    
    dojo.connect(dojo.byId('headerRightDiv'), 'onmouseout', function() {
        dojo.style(this, 'backgroundColor', authUserSkin.css['headerRightDiv'].background);
    });
    
    dojo.disconnect(eventHandles['sign-in']['onclick']);
    eventHandles['sign-in']['onclick'] = dojo.connect(dojo.byId('sign-in'), 'onclick', function() {
		signInOnClick();
	});
	
    dojo.disconnect(eventHandles['sign-in']['onmouseover']);
	eventHandles['sign-in']['onmouseover'] = dojo.connect(dojo.byId('sign-in'), 'onmouseover', function() {
		dojo.style(this, 'backgroundColor', authUserSkin.css['sign-in'].mouseOverBackground);
		dojo.style(this, 'color', authUserSkin.css['sign-in'].mouseOverColor);
	});
	
    dojo.disconnect(eventHandles['sign-in']['onmouseout']);
	eventHandles['sign-in']['onmouseout'] = dojo.connect(dojo.byId('sign-in'), 'onmouseout', function() {
		if (dojo.style('loginDiv', 'display') == 'none') {
			dojo.style(this, 'backgroundColor', authUserSkin.css['sign-in'].background);
			dojo.style(this, 'color', authUserSkin.css['sign-in'].color);
		}
	}); 
}

function initializeJqScrollPane() {
    var params = {
        verticalDragMinHeight: 48,
        verticalDragMaxHeight: 48,
        animateScroll: true
    };
	
    $('#siteViewerRecords').jScrollPane(params);
	$('#transmissionViewerRecords').jScrollPane(params);
	$('#distributionInspectionDataTableContent').jScrollPane(params);
	$('#transmissionInspectionDataTableContent').jScrollPane(params);
	$('#bladeViewerOuterContent').jScrollPane(params);
	
	$('#imageRowContentDiv').jScrollPane({
        verticalDragMinHeight: 24,
        verticalDragMaxHeight: 24,
        animateScroll: true
    });
}

function setBladeViewerContent() {
    var names = dojo.map(features, function(feature){ return feature.attributes['TURBINE_ID'] });
			
    turbineInspectionDate = item["Inspection Date"];
    
    var index = dojo.indexOf(names, name);
    if (item["Inspection Date"] != " -- ") {
        populateBladeViewerContent(features[index], true);
    } else {
        resetBladeViewerPanel();
        clearHighlightSymbol();
        setSymbologyForFeature(features[index], true);
    }
}

function exportInspectionEventImages(site, workOrder, turbine) {
    var data = (turbine) ? { "siteId": siteId, "orderNumber": workOrder, "assetId": turbine  } : { "siteId": siteId, "orderNumber": workOrder };
	var progressId = (turbine) ? "blade" : "site"
    dojo.xhrPost({
        url: windAmsDwVestasUrl + 'export/resources/inspectionEvent',
        handleAs: "json",
        headers: {
            "Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
        },
        postData: JSON.stringify(data),
        load: function(response) {
			
			dijit.byId(progressId + "InspectionDownloadProgressBar").set("value", 0);
            var css = (progressId == "blade") ? { "display":"block", "right":"10px" } : { "display":"block" };
            dojo.style(progressId + "InspectionDownloadProgress", css);
            var uuid = response.uuid;
            checkExportImagesStatus(uuid, progressId);
        },
        error: function(error){
            console.log(error);
            dojo.byId("dataWarehouseErrorContent").innerHTML = "Error retrieving images from the server. <br>" + error.message;
            dijit.byId("dataWarehouseError").show();
        }
    });

}

function checkExportImagesStatus(uuid, progressId) {        
    dojo.xhrGet({
        url: windAmsDwVestasUrl + 'export/' + uuid + '/status',
        handleAs: "json",
        headers: {
            "Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
        },
        load: function(response) {
            console.log(response.status);
            if (response.status == "Processing") {
                downloadImagesProgress(response, progressId);
                window.setTimeout(function() {
                    checkExportImagesStatus(response.uuid, progressId);
                }, 1000);
            } else if (response.status == "Completed") {
                getExportImages(uuid, progressId);
                window.setTimeout(function() {
                   dojo.style(progressId + "InspectionDownloadProgress", "display", "none");
                }, 2000);
            } else {
                console.log(response);
                dojo.byId("dataWarehouseErrorContent").innerHTML = "Error retrieving images from the server. <br>";
                dijit.byId("dataWarehouseError").show();
				
				dojo.byId(progressId + "InspectionDownloadStatus").innerHTML = "Error ...";
				dijit.byId(progressId + "InspectionDownloadProgressBar").set("value", 0);
				window.setTimeout(function() {
				   dojo.style(progressId + "InspectionDownloadProgress", "display", "none");
				}, 2000)
            } 
        },
        error: function(error){
            console.log(error);
            dojo.byId("dataWarehouseErrorContent").innerHTML = "Error retrieving images from the server. <br>" + error.message;
            dijit.byId("dataWarehouseError").show();
			
			dojo.byId(progressId + "InspectionDownloadStatus").innerHTML = "Error ...";
			dijit.byId(progressId + "InspectionDownloadProgressBar").set("value", 0);
			window.setTimeout(function() {
			   dojo.style(progressId + "InspectionDownloadProgress", "display", "none");
			}, 2000)
        }
    });
}

function getExportImages(uuid, progressId) {
    var url = windAmsDwVestasUrl + 'export/' + uuid;
    dojo.attr("downloadFrame", "src", url);
    dojo.byId(progressId + "InspectionDownloadStatus").innerHTML = "Download Complete";
    dijit.byId(progressId + "InspectionDownloadProgressBar").set("value", 1);
}

function downloadImagesProgress(response, progressId) {
    var total = response.objectCount;
    var prepCount = response.objectsPrepared;
    var zipCount = response.objectsZipped;
    
    var text = "Preparing (0/0) ...";
    var value = 0;
	if (total > 0) {
		if (prepCount/total < 1) {
			text = "Preparing (" + prepCount + "/" + total + ") ...";
			value = prepCount/total;
		} else {
			text = "Zipping (" + zipCount + "/" + total + ") ...";
			value = zipCount/total;
		}
	}
    dojo.byId(progressId + "InspectionDownloadStatus").innerHTML = text;
    dijit.byId(progressId + "InspectionDownloadProgressBar").set("value", value);    
}


function exportTurbineInspectionReport(workOrder, turbine, format){
	if (format == "excel") {
		var url = windAmsDwVestasUrl + "report/bladeInspectionReport?siteId=" + siteId + "&assetId=" + turbineId + "&orderNumber=" + workOrderNumber;
		window.open(url, '_blank');
	} else {
		var data = { "orderNumber": workOrderNumber, "assetId": turbineId  };
		dojo.xhrPost({
			url: windAmsDwVestasUrl + 'report/turbineInspectionReport',
			handleAs: "json",
			headers: {
				"Content-Type": "application/json",
				"Authorization": JSON.stringify(authRequest)
			},
			postData: JSON.stringify(data),
			load: function(response) {
				dijit.byId("bladeInspectionDownloadProgressBar").set("value", 0);
				dojo.style("bladeInspectionDownloadProgress", { "display":"block", "right":"-20px" });
				var uuid = response.uuid;
				checkExportReportStatus(uuid);
			},
			error: function(error){
				console.log(error);
				dojo.byId("dataWarehouseErrorContent").innerHTML = "Error retrieving resource from the server. <br>" + error.message;
				dijit.byId("dataWarehouseError").show();
			}
		});

	}
}

function checkExportReportStatus(uuid) {        
    dojo.xhrGet({
        url: windAmsDwVestasUrl + 'report/' + uuid + '/status',
        handleAs: "json",
        headers: {
            "Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
        },
        load: function(response) {
            console.log(response.status);
            if (response.status == "Processing") {
                downloadReportProgress(response);
                window.setTimeout(function() {
                    checkExportReportStatus(response.uuid);
                }, 1000);
            } else if (response.status == "Completed") {
                getExportReport(uuid);
                window.setTimeout(function() {
                   dojo.style("bladeInspectionDownloadProgress", "display", "none");
                }, 2000);
            } else {
                console.log(response);
                dojo.byId("dataWarehouseErrorContent").innerHTML = "Error retrieving report from the server. <br>";
                dijit.byId("dataWarehouseError").show();
				
				dojo.byId("bladeInspectionDownloadStatus").innerHTML = "Error ...";
				dijit.byId("bladeInspectionDownloadProgressBar").set("value", 0);
				window.setTimeout(function() {
				   dojo.style("bladeInspectionDownloadProgress", "display", "none");
				}, 2000)
            } 
        },
        error: function(error){
            console.log(error);
            dojo.byId("dataWarehouseErrorContent").innerHTML = "Error retrieving report from the server. <br>" + error.message;
            dijit.byId("dataWarehouseError").show();
			
			dojo.byId("bladeInspectionDownloadStatus").innerHTML = "Error ...";
			dijit.byId("bladeInspectionDownloadProgressBar").set("value", 0);
			window.setTimeout(function() {
			   dojo.style("bladeInspectionDownloadProgress", "display", "none");
			}, 2000)
        }
    });
}

function getExportReport(uuid) {
    var url = windAmsDwVestasUrl + 'report/' + uuid + '/download';
    dojo.attr("downloadFrame", "src", url);
    dojo.byId("bladeInspectionDownloadStatus").innerHTML = "Download Complete";
    dijit.byId("bladeInspectionDownloadProgressBar").set("value", 1);
}

function downloadReportProgress(response) {
    var total = response.statusCount;
    var prepCount = response.statusCompleted;
    
    var text = "Preparing (0/0) ...";
    var value = 0;
	if (total > 0) {
		if (prepCount/total < 1) {
			text = "Preparing (" + prepCount + "/" + total + ") ...";
			value = prepCount/total;
		}
	}
    dojo.byId("bladeInspectionDownloadStatus").innerHTML = text;
    dijit.byId("bladeInspectionDownloadProgressBar").set("value", value);    
}

function createBugReportForm() {

    menuDropdown = new dojo.fx.Toggler({
        node: "menuDivDropdown",
        showFunc: dojo.fx.wipeIn,
        showDuration: 300,
        hideFunc: dojo.fx.wipeOut,
        hideDuration: 300
    });
    
    dojo.connect(dojo.byId("headerMenuDiv"), "onclick", function(){
        var display = dojo.style("menuDivDropdown", "display");
        if (display == "none") {
            menuDropdown.show();
        } else {
            menuDropdown.hide();
        }
    });
    
    dojo.connect(dojo.byId("headerMenuDiv"), "onmouseover", function(){
        dojo.style(this, 'backgroundColor', authUserSkin.css['sign-in'].mouseOverBackground);
		dojo.style(this, 'color', authUserSkin.css['sign-in'].mouseOverColor);
    });
    
    dojo.connect(dojo.byId("headerMenuDiv"), "onmouseout", function(){
        dojo.style(this, 'backgroundColor', authUserSkin.css['sign-in'].background);
        dojo.style(this, 'color', authUserSkin.css['sign-in'].color);
    });
    
    dojo.forEach(dojo.query("#menuDivDropdown li a"), function(item) {
        dojo.connect(item, "onmouseover", function(){
            dojo.style(this, 'color', authUserSkin.css['sign-in'].mouseOverColor);
        });
        
        dojo.connect(item, "onmouseout", function(){
            dojo.style(this, 'color', authUserSkin.css['sign-in'].color);
        });
    })
    
    dojo.attr(dojo.byId("bugReport-title"), "placeholder", "provide a simple one-line title for the request");
    dojo.attr(dojo.byId("bugReport-summary"), "placeholder", "provide a descriptive summary of the request");
    dojo.attr(dojo.byId("bugReport-steps"), "placeholder", "provide a series of concise numbered steps on how to duplicate the defect or issue");
    dojo.attr(dojo.byId("bugReport-expected"), "placeholder", "provide what you expected to happen");
    dojo.attr(dojo.byId("bugReport-actual"), "placeholder", "provide what actually happened");
    
    var requestTypeDropdown =  new dijit.form.Select({
        id: "requestTypeDropdown",
        options: reportTypeOptions,
		style: "width:100%; font-size: 14px;",
		required: false,
		onChange: function(value) {
            if (value == "bug") {
                dojo.style("bugOptionsDiv", "display", "block");
            } else {
                dojo.style("bugOptionsDiv", "display", "none");
            } 
            var position = dojo.position(dojo.byId("bugReport"))
            var t = (map.height - position.h)/2 + dojo.position(dojo.byId("header")).h;
            dojo.style(dojo.byId("bugReport"), "top", t + "px");
		}
    }, "bugReport-type").startup();
    
    var elementTypeDropdown =  new dijit.form.Select({
        id: "elementTypeDropdown",
        options: elementTypeOptions,
		style: "width:100%; font-size: 14px;",
		required: false,
		onChange: function(value) {
            
		}
    }, "bugReport-element").startup();
    
    var severityTypeDropdown =  new dijit.form.Select({
        id: "severityTypeDropdown",
        options: severityTypeOptions,
		style: "width:80px; font-size: 14px;",
		required: false,
		onChange: function(value) {
            
		}
    }, "bugReport-severity")
	severityTypeDropdown.startup();
    
    var priorityTypeDropdown =  new dijit.form.Select({
        id: "priorityTypeDropdown",
        options: priorityTypeOptions,
		style: "width:80px; font-size: 14px;",
		required: false,
		onChange: function(value) {
            
		}
    }, "bugReport-priority")
	priorityTypeDropdown.startup();
    
    dojo.connect(dojo.byId("bugReport-title"), "keyup", function() {
        if (this.value != "" && dojo.colorFromRgb(dojo.style(this, "borderColor")).toHex() == "#c00000") {
            dojo.style("bugReport-title", { "borderColor": "#bbbbbb", "background": "#ffffff" });
            dojo.query("#bugReport-title-title span").style("color", "#bbbbbb");
        }
    })
    
    dojo.connect(dojo.byId("bugReport-summary"), "keyup", function() {
        if (this.value != "" && dojo.colorFromRgb(dojo.style(this, "borderColor")).toHex() == "#c00000") {
            dojo.style("bugReport-summary", { "borderColor": "#bbbbbb", "background": "#ffffff" });
            dojo.query("#bugReport-summary-title span").style("color", "#bbbbbb");
        }
    })
    
    dojo.connect(dojo.byId("bugReport-steps"), "keyup", function() {
        if (this.value != "" && dojo.colorFromRgb(dojo.style(this, "borderColor")).toHex() == "#c00000") {
            dojo.style(this, { "borderColor": "#bbbbbb", "background": "#ffffff" });
            dojo.query("#bugReport-steps-title span").style("color", "#bbbbbb");
        }
    })
    
    dojo.connect(dojo.byId('bugReport-submit'), 'onclick', function(){
        var complete = checkBugReportRequired();
        if (complete) {
            var body = collectBugReportValues();
            dojo.byId("bugReport-submit-link").src='mailto:support@inspectools.com?subject=' + encodeURIComponent('Software Support Request') + '&body=' + encodeURIComponent(body);
            
            dijit.byId("requestTypeDropdown").set("value","");
            dijit.byId("elementTypeDropdown").set("value","");
            dijit.byId("severityTypeDropdown").set("value","");
            dijit.byId("priorityTypeDropdown").set("value","");
            dojo.byId("bugReport-title").value  = "";
            dojo.byId("bugReport-summary").value  = "";
            dojo.byId("bugReport-steps").value  = "";
            dojo.byId("bugReport-expected").value  = "";
            dojo.byId("bugReport-actual").value  = "";
            
            bugReport.hide();
        }
    });
}

function getOsBrowser(){
    var OS = "Unknown";
    if (window.navigator.appVersion.indexOf("Win")!==-1) OS = "Windows";
    if (window.navigator.appVersion.indexOf("Mac")!=-1) OS = "Mac OSX";
    if (window.navigator.appVersion.indexOf("X11")!=-1) OS = "UNIX";
    if (window.navigator.appVersion.indexOf("Linux")!=-1) OS = "Linux";
    
    if (window.navigator.appVersion.indexOf("WOW64")!==-1) OS += " (x64)";
    
    var browser = "Unknown";
    if (dojo.isChrome) browser = "Chrome (v" + dojo.isChrome + ")";
    if (dojo.isFF) browser = "Firefox (v" + dojo.isFF + ")";
    if (dojo.isSafari ) browser = "Safari (v" + dojo.isSafari + ")";
    if (dojo.isIE) browser = "Internet Explorer (v" + dojo.isIE + ")";
    
    return { "OS":OS, "browser":browser }
}

function openBugReportForm(){
    bugReport.show();
    menuDropdown.hide();
}

function collectBugReportValues() {
    
    var requestType = dijit.byId("requestTypeDropdown").attr('displayedValue');
    var elementType = dijit.byId("elementTypeDropdown").attr('displayedValue');
    var title = dojo.byId("bugReport-title").value;
    var summary = dojo.byId("bugReport-summary").value;
    
    var user = authUser;
    var org = authUserOrg.name;
    var environment = getOsBrowser();
    var os = environment.OS;
    var browser = environment.browser;
    var screen = window.screen.width + " x " + window.screen.height;
    var viewport = window.innerWidth + " x " + window.innerHeight;
    
    var severityType = dijit.byId("severityTypeDropdown").attr('displayedValue');
    var priorityType = dijit.byId("priorityTypeDropdown").attr('displayedValue');
    var steps = dojo.byId("bugReport-steps").value;
    var expected = dojo.byId("bugReport-expected").value;
    var actual =  dojo.byId("bugReport-actual").value;
    
    var newline = "\n";
    var values = "Request: " + requestType + newline;
    values += "Category: " + elementType + newline;
    values += "Title: " + title + newline + newline;
    values += "Description/Summary" + newline;
    values += summary + newline + newline;
    
    if (dijit.byId("requestTypeDropdown").get("value") == "bug") {
        values += "---------------------- Bug Details ----------------------" + newline;
        values += "Severity: " + severityType + newline;
        values += "Priority: " + priorityType + newline;
        values += newline + newline;
        values += "Steps to Reproduce" + newline;
        values += steps + newline + newline;
        values += "Actual Results" + newline;
        values += actual + newline + newline;
        values += "Expected Results" + newline;
        values += expected + newline + newline;
        values += "---------------------- Environment ----------------------" + newline;
        values += "OS: " + os + newline;
        values += "Browser: " + browser + newline;
        values += "Screen Size: " + screen + newline;
        values += "Viewport Size: " + viewport + newline + newline;
    }
    values += "User: " + user + newline;
    values += "Organization: " + org + newline;
    values += "Date: " + currentDate;
    return values;
}

function checkBugReportRequired() {
    var title = dojo.byId("bugReport-title").value;
    var summary = dojo.byId("bugReport-summary").value;
    var steps = dojo.byId("bugReport-steps").value;
    var complete = true;
    if (title == "") {
        dojo.style("bugReport-title", { "borderColor": "#c00000", "background": "#FFF3F3" });
        dojo.query("#bugReport-title-title span").style("color", "#c00000");
        complete = false;
    }
    if (summary == "") {
        dojo.style("bugReport-summary", { "borderColor": "#c00000", "background": "#FFF3F3" });
        dojo.query("#bugReport-summary-title span").style("color", "#c00000");
        complete = false;
    }
    if (dijit.byId("requestTypeDropdown").get("value") == "bug") {
        if (steps == "") {
            dojo.style("bugReport-steps", { "borderColor": "#c00000", "background": "#FFF3F3" });
            dojo.query("#bugReport-steps-title span").style("color", "#c00000");
            complete = false;
        }
    }
    return complete;
}

function createAboutDialog() {
    dojo.byId("about-version").innerHTML = "version: " + aboutVersion;
    dojo.byId("aboutYearStart").innerHTML = aboutYearStart;
    dojo.byId("aboutYearEnd").innerHTML = aboutYearEnd;
}

function openAboutDialog(){
    about.show();
    menuDropdown.hide();
}

function getAllSiteData(name, orderNumber) {
	
	if (sitesToProcess.length <= 1) {
		dojo.query(".login-progress-tracker").style("display", "none");
		dojo.style("data-retrieve-message", "margin-bottom", "15px");
		siteDownloadProgressTable = dojo.create("table", {
			class:"siteDownloadProgress"
		}, dojo.byId("loginProgressContent"));
	}
	var tr = dojo.create("tr", {}, siteDownloadProgressTable);
	var td = dojo.create("td", {
		innerHTML:"" + siteData[name].name + " (" + orderNumber +")"
	}, tr);
	var td = dojo.create("td", {
		class:"site-download-wait",
		innerHTML:"<i class='fa fa-circle-o-notch fa-spin'></i>"
	}, tr);
	loginProgress.resize();
	
	var site = siteData[name].id;
	var data = {
		"siteId": site,
		"orderNumber": orderNumber
		//status:"Released"
	};
	var assetInspectionDeferred = dojo.xhrPost({
		url: windAmsDwVestasUrl + "assetInspection/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
		},
		postData: JSON.stringify(data),
		load: function(response) {
			return response;
		},
		error: function(error){
			console.log(error);
		}
	});

	var data = { 
		"siteId":site
	};
	var assetComponentDeferred = dojo.xhrPost({
		url: windAmsDwVestasUrl + "component/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
		},
		postData: JSON.stringify(data),
		load: function(response) {
			return response;
		},
		error: function(error){
			console.log(error);
		}
	});

	var data = { 
		"siteId":site,
		"orderNumber": orderNumber
	};
	var assetComponentInspectionDeferred = dojo.xhrPost({
		url: windAmsDwVestasUrl + "componentInspection/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
		},
		postData: JSON.stringify(data),
		load: function(response) {
			return response;
		},
		error: function(error){
			console.log(error);
		}
	});

	var data = { 
		"siteId":site,
		"orderNumber":orderNumber
	};
	var assetbladeRepairRetrofitDeferred = dojo.xhrPost({
		url: windAmsDwVestasUrl + "bladeRepairRetrofit/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
		},
		postData: JSON.stringify(data),
		load: function(response) {
			return response;
		},
		error: function(error){
			console.log(error);
		}
	});

	var data = {
		"siteId": site,
		"orderNumber": orderNumber
	};
	var inspectionEventDeferred = dojo.xhrPost({
		url: windAmsDwVestasUrl + "inspectionEvent/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": JSON.stringify(authRequest)
		},
		postData: JSON.stringify(data),
		load: function(response) {
			return response;
		},
		error: function(error){
			console.log(error);
		}
	});

	var deferreds = [assetInspectionDeferred, assetComponentDeferred, assetComponentInspectionDeferred, assetbladeRepairRetrofitDeferred,inspectionEventDeferred];
	var deferredList = new dojo.DeferredList(deferreds);
	deferredList.then(function(results) {
		var assetInspections = results[0][1];
		
		var components = {};
		var componentData = results[1][1];
		var componentInspectionStatusData = results[2][1];
		var bladeRepairRetrofitData = results[3][1];
		var inspectionEventsData = results[4][1];
		
		//filter the componentData based on componentInspectionStatusData (i.e., remove if object does not exist in inspection status)
		var componentInspectionStatusDataIds = dojo.map(componentInspectionStatusData, function(status) { return status.componentId; })
		componentData = dojo.filter(componentData, function(item) { return dojo.indexOf(componentInspectionStatusDataIds, item.id) >= 0 ; })
		
		dojo.forEach(componentData, function(component) {
			var componentInspection = _.first(dojo.filter(componentInspectionStatusData, function(item) { return item.componentId == component.id; } ));
			
			if (!components[component.assetId]) {
				components[component.assetId] = {};
				components[component.assetId]["ids"] = {};
				components[component.assetId]["inspectionStatus"] = {};
				components[component.assetId]["component"] = {};
				components[component.assetId]["bladeRepairRetrofit"] = {};
			} 
			components[component.assetId]["ids"][component.id] = component.type;
			components[component.assetId]["component"][component.id] = component;
			components[component.assetId]["inspectionStatus"][component.id] = (_.isUndefined(componentInspection)) ? null : componentInspection;
			
			var bladeRepairRetrofit = _.first(dojo.filter(bladeRepairRetrofitData, function(item) { return item.componentId == component.id; } ));
			components[component.assetId]["bladeRepairRetrofit"][component.id] = (_.isUndefined(bladeRepairRetrofit)) ? null : bladeRepairRetrofit;
		});
		
		var assets = [];
		var inspectionEventDeferreds = [];
		assetJsonResponse = dojo.filter(authUserAssets, function(feature) { return feature.siteId == site; })
		dojo.forEach(assetJsonResponse, function(item){
			var assetInspection = dojo.filter(assetInspections, function(inspection){ return inspection.assetId == item.id; })[0];
			if (!_.isUndefined(assetInspection)) {
				var asset = {
					id : item.id,
					name : item.name,
					siteId : site,
					siteName : name,
					dateOfInspection : assetInspection.dateOfInspection,
					make : item.make,
					model : item.model,
					onYear : item.dateOfInstall,
					serialNumber : item.serialNumber,
					severityValues: [],
					severityMax : 0,
					inspectionEvents : {
						loaded: false,
						events:[]
					},
					inspectionEventResources : {
						loaded : false,
						polys : []
					},
					components: (components[item.id]) ? components[item.id] : null,
					type: item.type,
					attributes: (_.has(item, "attributes")) ? item.attributes : null,
					assetInspection: assetInspection
				};
				
				var severityValues = [];
				if (!_.isNull(asset.components) && !_.isNull(asset.components.inspectionStatus)) {
					var severityValues = dojo.map(_.values(asset.components.inspectionStatus), function(inspectionEvent){ 
						var overallBladeCondition = (_.has(inspectionEvent.attributes, "overallBladeCondition")) ? parseInt(inspectionEvent.attributes.overallBladeCondition) : 0;
						overallBladeCondition = (overallBladeCondition < 0) ? 0 : overallBladeCondition;
						return overallBladeCondition; 
					});
				}
				
				var inspectionEvents = dojo.filter(inspectionEventsData, function(event) { return event.assetId == asset.id });
				if (inspectionEvents.length > 0) {
					asset.inspectionEvents.loaded = true;
					asset.inspectionEvents.events = inspectionEvents;
					var severityValues = dojo.map(inspectionEvents, function(inspectionEvent){ return inspectionEvent.severity; });
					
				}
				severityValues = _.map(severityValues, function(value) { return (_.isNaN(value) || value > 5 || value < 0) ? 0 : value; })
				asset.severityValues = severityValues;
				asset.severityMax = (severityValues.length > 0) ? _.max(severityValues) : 0;
				assets.push(asset);
				
				if (!_.isNull(asset.components) && !_.isNull(asset.components.inspectionStatus)) {
					checkInspectionStatus(asset);
				}
				
			}
		});
		siteData[name].workOrders[orderNumber].data = assets;
		sitesAreProcess.push(name);
		
		td.innerHTML = "<i class='fa fa-check-circle site-download-wait'></i>"
		
		if (sitesToProcess.length == sitesAreProcess.length) {
			
			windFeatureLayer.show();
			windTileLayer.hide();
			
			window.setTimeout(function(){
				loginProgress.hide();
				
				window.setTimeout(function(){
					dojo.query(".login-progress-tracker").style("display", "block");
					loginProgress.set("title","Logging in ...")
					dojo.byId("loginProgressContent").innerHTML = "";
					dojo.style("loginProgressContent", "width", "auto;");
				}, 2000)
				
			}, 2000)
			
			dojo.forEach(_.keys(siteData), function(s) {
				dojo.forEach(_.keys(siteData[s].workOrders), function(w) {
					var assets = siteData[s].workOrders[w].data;
					var features = dojo.filter(windFeatureLayer.graphics, function(feature) { return feature.attributes["SITE_ID"] == siteData[s].id; })
					var ids = _.pluck(assets, 'id');
					
					dojo.forEach(features, function(feature){
						var markerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,255,255,1]), 1), new dojo.Color([200,200,200,1]));
						feature.attributes["SITE_NAME"] = s; 
						
						if (_.contains(ids, feature.attributes["UNIQUE_ID"])){
							
							var index = _.indexOf(ids, feature.attributes["UNIQUE_ID"]);
							
							var year = (assets[index].dateOfInspection) ? parseInt(assets[index].dateOfInspection.slice(0,4)) : 1000;
							if (year >= 1900) {
								feature.attributes["INSPECTION_DATE"] = convertDate(assets[index].dateOfInspection, 'viewer');
							}
							feature.attributes["SeverityScore"] = assets[index].severityMax;
							feature.attributes["InspectionEvents"] = assets[index].inspectionEvents.events.length;
							
							function getStatus(assets, index, blade, status) {
								var timestamp = null;
								var inspectionStatusObject = assets[index].components.inspectionStatus[_.invert(assets[index].components.ids)[blade]];
								if (!_.isNull(inspectionStatusObject)) {
									var inspectionStatusHistory = inspectionStatusObject.statusHistory;
									var inspectionStatus = _.first(dojo.filter(inspectionStatusHistory, function(item) { return item.status == status; }));
									timestamp = inspectionStatus.timestamp;
								}
								return timestamp;
							}
							
							var componentIds = (!_.isNull(assets[index].components)) ? assets[index].components.ids : {};
							var statusStart = dojo.map(_.keys(_.invert(componentIds)).sort(), function(blade) {
								return getStatus(assets, index, blade, "InspectionStarted");
							});
							statusStart = _.without(statusStart, null);
							
							var statusComplete = dojo.map(_.keys(_.invert(componentIds)).sort(), function(blade) {
								return getStatus(assets, index, blade, "InspectionCompleted");
							});
							statusComplete = _.without(statusComplete, null);
							
							var InspectionCompleted = " -- ";
							if (statusComplete.length > 0 && statusComplete.length == _.keys(_.invert(componentIds)).length) {
								InspectionCompleted = (_.last(statusComplete.sort()) < "20000101T000000") ? feature.attributes["INSPECTION_DATE"] : convertDate(_.first(_.last(statusComplete.sort()).split("T")), "viewer");
							}
							feature.attributes["InspectionCompleted"] = InspectionCompleted;
							
							var InspectionStarted = " -- ";
							if (statusStart.length > 0) {
								InspectionStarted = (_.first(statusStart.sort()) < "20000101T000000") ? feature.attributes["INSPECTION_DATE"] : convertDate(_.first(_.first(statusStart.sort()).split("T")), "viewer");
							}
							feature.attributes["InspectionStarted"] = InspectionStarted;
							
							feature.attributes["InspectionStatus"] = (feature.attributes["InspectionCompleted"] != " -- ") ? "Complete (" + feature.attributes["InspectionCompleted"] + ")" : (feature.attributes["InspectionStarted"] != " -- ") ? "Started (" + feature.attributes["InspectionStarted"] + ")": " -- ";
							
							feature.attributes["InspectionEvents"] = (feature.attributes["InspectionStarted"] != " -- ") ? assets[index].inspectionEvents.events.length : " -- "; 
							
							dojo.forEach(["BladeA", "BladeB", "BladeC"], function(blade) {
								feature.attributes[blade] = (_.isUndefined(_.invert(componentIds)[blade])) ? " -- " : (!_.isNull(getStatus(assets, index, blade, "InspectionCompleted"))) ? "Complete" : (!_.isNull(getStatus(assets, index, blade, "InspectionStarted"))) ? "In Process": " -- ";
							});
							
							var color = new dojo.Color(severityColors[feature.attributes["SeverityScore"]]);
							color.a = 1.0;
							markerSymbol.setColor(color);
							
						} else {
							feature.attributes["INSPECTION_DATE"] = " -- ";
							feature.attributes["SeverityScore"] = 0;
							feature.attributes["InspectionEvents"] = " -- ";
							feature.attributes["BladeA"] = " -- ";
							feature.attributes["BladeB"] = " -- ";
							feature.attributes["BladeC"] = " -- ";
							feature.attributes["InspectionStarted"] = " -- ";
							feature.attributes["InspectionCompleted"] = " -- ";
							feature.attributes["InspectionStatus"] = " -- ";
						}
						
						//var symbology = setSymbologyForFeature(feature, false);
						feature.setSymbol(markerSymbol);
					});
					
				})
				
			})
			
			dojo.connect(map, 'onUpdateEnd', function(){
				dojo.style("mapProgressBar", { "display":"none" });
			});
			
			renderWindSiteSelector();
			

			var extent = getQueryResultsExtent(windFeatureGraphics);
			map.setExtent(extent.expand(1.5),true);
			authExtent = extent;
			
			var names = _.keys(siteData);
			if (names.length == 1) {
				window.setTimeout(function(){
					var name = _.first(names);
					siteName = name;
					siteId = siteData[name].id;
					dijit.byId('siteViewerDropDown').set('value', name);
					updateWorkOrderDropdown(name);
					openViewerPanel("siteViewer"); 
				}, 1000);
			}
		}
		
		
		
	})
}

function checkInspectionStatus(feature) {
	var componentInspections = feature.components.inspectionStatus;
	
	var asset = {
		"id": feature.id,
		"name":feature.name,
		"siteId": feature.siteId,
		"workOrder": feature.assetInspection.orderNumber,
		"severity":feature.severityMax,
		"status":null
	}
	
	var statusHistory = [];
	
	var inspectionStarted = [];
	var inspectionCompleted = [];
	var inspectionSubmitted = [];
	var inspectionApproved = [];
	
	dojo.forEach(_.keys(componentInspections), function(component) {
		dojo.forEach(componentInspections[component].statusHistory, function(s) {
			if (!_.isNull(s.timestamp)) {
				
				if (s.status == "InspectionStarted") {
					inspectionStarted.push(true);
				}
				if (s.status == "InspectionSubmitted") {
					inspectionSubmitted.push(true);
				}
				if (s.status == "InspectionApproved") {
					inspectionApproved.push(true);
				}
				if (s.status == "InspectionCompleted") {
					inspectionCompleted.push(true);
				}
			} 
		})
	})

	if (inspectionSubmitted.length == _.keys(componentInspections).length && inspectionSubmitted.length > 0) {
		asset.status = "Submitted";
		inspectionStatus["InspectionSubmitted"].push(asset);
	}
	if (inspectionApproved.length == _.keys(componentInspections).length && inspectionApproved.length > 0) {
		asset.status = "Approved";
		inspectionStatus["InspectionApproved"].push(asset);
	}
	if (inspectionCompleted.length == _.keys(componentInspections).length && inspectionCompleted.length > 0) {
		asset.status = "Completed";
		inspectionStatus["InspectionCompleted"].push(asset);
	}
	if ((inspectionCompleted.length != _.keys(componentInspections).length || inspectionCompleted.length == 0) && (inspectionSubmitted.length != _.keys(componentInspections).length || inspectionSubmitted.length == 0) && (inspectionApproved.length != _.keys(componentInspections).length || inspectionApproved.length == 0)) {
		asset.status = "In Process";
		inspectionStatus["InspectionInProcess"].push(asset);
	}
}