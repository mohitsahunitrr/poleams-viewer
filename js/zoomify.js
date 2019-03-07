var assetInspectionEventsData = [];
var inspectionEventsJson = [];
var tempInspectionData = {};
var rollbackInspectionData = {};
var hotspotConnects = [];
var inspectorEvent = null;

function sendServerRequest(method,url, data) {
	switch(method){
		case "get":
			var deferred = dojo.xhrGet({
				url: serviceApiUrl + url,
				handleAs: "json",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + accessToken
				},
				load: function(response) {
					console.log(response);
					return response;
				},
				error: function(error){
					console.log(error);
					return error;
				}
			})
			break;
		case "put":
			var deferred = dojo.xhrPut({
				url: serviceApiUrl + url,
				handleAs: "json",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + accessToken
				},
				putData: data,
				load: function(response) {
					console.log(response);
					return response;
				},
				error: function(error){
					console.log(error);
					return error;
				}
			})
			break;
		case "post":
			// reminder that must post full json object if updating a resource's data
			var deferred = dojo.xhrPost({
				url: serviceApiUrl + url,
				handleAs: "json",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + accessToken
				},
				postData: data,
				load: function(response) {
					console.log(response);
					return response;
				},
				error: function(error){
					console.log(error);
					return error;
				}
			})
			break;
		case "delete":
			var deferred = dojo.xhrDelete({
				url: serviceApiUrl + url,
				handleAs: "json",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + accessToken
				},
				load: function(response) {
					console.log(response);
					return response;
				},
				error: function(error){
					console.log(error);
					return error;
				}
			})
			break;
	}
	
	return deferred;
}

function createInspectionDisplay() {
    
    var inspectionEventOptions = [{ label: "--", value: "" }];
	if (assetInspectionEventsData.length > 0) {
		assetInspectionEventsData.sort(byEventId);
		dojo.forEach(assetInspectionEventsData, function(obj){
			var name = obj.name;
			var value = obj.id;
			inspectionEventOptions.push({ label: name, value: value });
		});
	}
	
	var inspectionEventTypeDropdown =  new dijit.form.Select({
        id: "inspectionEventTypeDropdown",
        options: inspectionEventOptions,
		style: "width:100%; font-size: 14px;",
		onChange: function(value) {
			 if (value != '') {
				Z.Viewport.setCurrentLabel(value);
				
				populateTemporaryInspectionEvent(value);
				populateRollbackInspectionEvent(value);
				
				dijit.byId('findingTypeDropdown').set('value', tempInspectionData.findingType);
				dijit.byId('positionTypeDropdown').set('value', tempInspectionData.position);
				dijit.byId('severityScoreSlider').set('value',  tempInspectionData.severity);
				dijit.byId('commentTextBox').set('value', tempInspectionData.comment);
				populateInspectionEventImages(tempInspectionData.images);
				
				setAnnotationToolDisplay('modifyPolygon', true);
				
			} else {
				resetZoomifyAnnotationDisplay();
			}
		},
        onClick: function() {
            //check if in fullscreen mode and then place menu div in the ViewerDisplay
            /* if (zoomifyFullScreenMode) {
                dojo.place("inspectionEventTypeDropdown_dropdown","ViewerDisplay","last")
                dojo.style("inspectionEventTypeDropdown_dropdown", "z-index", "9999999999");
            } */
        },
		required: false
    });
	inspectionEventTypeDropdown.placeAt(dojo.byId('inspectionEventRowDropDown'));
	inspectionEventTypeDropdown.startup();
	
	var options = [{ label: "--", value: "" }];
	if (_.has(translationJson.fields, "inspectionEvent.findingType")) {
		dojo.forEach(translationJson.fields["inspectionEvent.findingType"].listValues, function(field) {
			options.push({ label: field.label, value: field.value });
		})
	}
	var findingTypeDropdown =  new dijit.form.Select({
        id: "findingTypeDropdown",
        options: options,
		style: "width:100%; font-size: 14px;",
		onChange: function(value) {
			if (inspectorEvent == 'addEvent' || inspectorEvent == 'modifyEvent') {
				tempInspectionData.findingType = value;
                clearInspectionEventFieldHighlight("finding");
			}
		},
        onClick: function() {
            //check if in fullscreen mode and then place menu div in the ViewerDisplay
            /* if (zoomifyFullScreenMode) {
                dojo.place("findingTypeDropdown_dropdown","ViewerDisplay","last")
                dojo.style("findingTypeDropdown_dropdown", "z-index", "9999999999");
            } */
        },
		required: false,
		disabled: true
    })
	findingTypeDropdown.placeAt(dojo.byId('findingTypeRow'));
	findingTypeDropdown.startup();
	
	var options = [{ label: "--", value: "" }];
	if (_.has(translationJson.fields, "inspectionEvent.position")) {
		dojo.forEach(translationJson.fields["inspectionEvent.position"].listValues, function(field) {
			options.push({ label: field.label, value: field.value });
		})
	}
	var positionTypeDropdown =  new dijit.form.Select({
        id: "positionTypeDropdown",
        options: options,
		style: "width:100%; font-size: 14px;",
		required: false,
		disabled: true,
		onChange: function(value) {
			tempInspectionData.position = value;
            clearInspectionEventFieldHighlight("position");
		},
        onClick: function() {
            //check if in fullscreen mode and then place menu div in the ViewerDisplay
            /* if (zoomifyFullScreenMode) {
                dojo.place("positionTypeDropdown_dropdown","ViewerDisplay","last")
                dojo.style("positionTypeDropdown_dropdown", "z-index", "9999999999");
            } */
        }
    })
	positionTypeDropdown.placeAt(dojo.byId('positionTypeRow'));
	positionTypeDropdown.startup();
	
	var rulesNode = dojo.create("div", { id: 'severitySliderRule' }, dojo.byId('severityRowContentDiv'), 'first');
	var sliderRules = new dijit.form.HorizontalRule({
		container:"topDecoration",
		count:3,
		style: "height: 5px;"
	}, rulesNode);
	
	var labelsNode = dojo.create("div", { id: 'severitySliderLabels' }, dojo.byId('severityRowContentDiv'), 'first');
	var sliderLabels = new dijit.form.HorizontalRuleLabels({
		container: "topDecoration",
		labelStyle: "font-size: 14px; font-weight: bolder; top: -20px;",
		labels: ['<span id="severity1-sliderLabel" class="severity-sliderLabel" style="color:' + appConfig["TransmissionLine"]["default"].colors[1] + ';" onclick="setSeveritySliderValue(1)">' + appConfig["TransmissionLine"]["default"].sliderLabels[1] + '</span>', '<span id="severity2-sliderLabel" class="severity-sliderLabel" style="color:' + appConfig["TransmissionLine"]["default"].colors[2] + ';" onclick="setSeveritySliderValue(2)">' + appConfig["TransmissionLine"]["default"].sliderLabels[2] + '</span>', '<span id="severity3-sliderLabel" class="severity-sliderLabel" style="color:' + appConfig["TransmissionLine"]["default"].colors[3] + ';" onclick="setSeveritySliderValue(3)">' + appConfig["TransmissionLine"]["default"].sliderLabels[3] + '</span>']
	}, labelsNode);
	
	var severityScoreSlider = new dijit.form.HorizontalSlider({
		id: "severityScoreSlider",
		value: 1,
		minimum: 1,
		maximum: 3,
		discreteValues: 3,
		intermediateChanges: false,
		style: "width:100%;",
		showButtons: false,
		clickSelect: true,
		disabled: true,
		onChange: function(value){
			 var tab = dojo.query("#transmissionToggleButtons .btn.active")[0].value;
			 if (!_.isUndefined(tempInspectionData.id) && tab == "Analyst") {
				
				tempInspectionData.severity = value;
				
				var eventId = tempInspectionData.id;
				dojo.forEach(dojo.query("div .imageInspectionEvent"), function(node){
					var imageId = dojo.attr(node.id, "data-event-image-id");
					var image = getImageById(imageId);
					if (dojo.some(image.polys, function(poly) { return poly.id.indexOf(eventId) > -1; })) {
						 var hotspots = dojo.filter(image.polys, function(poly) { return poly.id.indexOf(eventId) > -1 });
					} else {
						var hotspots = false;
					}
					
					if (hotspots) {
						dojo.forEach(hotspots, function(hotspot) {
							hotspot.severity = value;
						});
					}
				});
				
				var image = getCurrentImage();
				if (dojo.some(image.polys, function(poly) { return poly.id.indexOf(eventId) > -1; })) {
					 var hotspots = dojo.filter(image.polys, function(poly) { return poly.id.indexOf(eventId) > -1 });
				} else {
					var hotspots = false;
				}
				if (hotspots) {
					dojo.forEach(hotspots, function(hotspot) {
						Z.Viewport.modifyHotspot(hotspot.id, 'lineColor', appConfig["TransmissionLine"][authUserOrgKey].colors[value]);
						Z.Viewport.modifyHotspot(hotspot.id, 'fillColor', appConfig["TransmissionLine"][authUserOrgKey].colors[value]);
					});
				}
				
			} 
		}
	}, "severityRowContentDiv");
	
	severityScoreSlider.startup();
	sliderRules.startup();
	sliderLabels.startup();
	
	dojo.forEach(dijit.byId("severitySliderLabels").domNode.childNodes, function(node) {
		var id = node.firstChild.firstChild.id;
		var key = _.first(id.split("-"));
		dojo.connect(dojo.byId(id), 'onmouseover', function(event) {
			showToolTip(event, legendMessages[key], "top")
		});
		dojo.connect(dojo.byId(id), 'onmouseout', function(event) {
			if (tooltip) { tooltip.style.display = "none";} 
		});
	});
	
	var commentTextBox = new dijit.form.TextBox({
		id: "commentTextBox",
		value: "",
		placeHolder: "Additional Comments",
		style: "width:100%; font-size: 13px;",
		disabled: true,
		onChange: function(value) {
			tempInspectionData.comment = value;
		}
	}, "commentTextBoxDiv");
    
    dojo.connect(dojo.byId('commentTextBox'), 'onfocus', function() {
        dojo.byId('commentTextBox').select();
    });
	
	if (assetInspectionEventsData.length > 0) {
		var object = _.first(assetInspectionEventsData);
		dijit.byId('inspectionEventTypeDropdown').set('value', object.id);
	}
	
	setAnnotationToolDisplay('addPolygon', true);
	dojo.connect(dojo.byId('addPolygon'), 'onclick', function(){
		if (inspectorEvent == 'addEvent' || inspectorEvent == 'modifyEvent') {
			confirmInspectionEventSave.show();
		} else {
			createInspectionEvent();
		}
	});
    
    dojo.connect(dojo.byId('removePolygon'), 'onclick', function(){
        confirmInspectionEventDelete.show();
    });    
	
    dojo.connect(dojo.byId('cancelDelete'), 'onclick', function(){
        confirmInspectionEventDelete.hide();
    });
    
	dojo.connect(dojo.byId('confirmDelete'), 'onclick', function(){
		deleteInspectionEvent();
	});
	
	dojo.connect(dojo.byId('modifyPolygon'), 'onclick', function(){
	if (dijit.byId('inspectionEventTypeDropdown').get('value') != "") {
			inspectorEvent = 'modifyEvent';
			
			disableZoomifyAnnotationDisplay(false);
			dijit.byId('inspectionEventTypeDropdown').set('disabled', true);
			showZoomifyAnnotationRequiredFieldLabels(true);
		}
	});
	
	dojo.connect(dojo.byId('cancelPolygon'), 'onclick', function(){ 
        undoInspectionEventEdits(true);
	});

	dojo.connect(dojo.byId('savePolygon'), 'onclick', function(){
		if (checkInspectionEventFields()) {
			saveInspectionEventEdits(true);
		}
	});
    
    dojo.connect(dojo.byId('confirmSave'), 'onclick', function(){
        if (checkInspectionEventFields()) {
            saveInspectionEventEdits(false);
            window.setTimeout(function(){
                createInspectionEvent();
                confirmInspectionEventSave.hide();
            }, 500);
        }
    });
    
    dojo.connect(dojo.byId('cancelSave'), 'onclick', function(){
        undoInspectionEventEdits(false);
        window.setTimeout(function(){
            createInspectionEvent();
            confirmInspectionEventSave.hide();
        }, 500);
    });
	
	dojo.connect(dojo.byId('digitizePolygon'), 'onclick', function(){
		startInspectionEventLabelEdits();
	});
	
	dojo.connect(dojo.byId('addPolygon'), 'onmouseenter', function(evt) {
		showToolTip(evt, 'Add new inspection event');
	});	
	dojo.connect(dojo.byId('addPolygon'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId('removePolygon'), 'onmouseenter', function(evt) {
		showToolTip(evt, 'Remove current inspection event');
	});	
	dojo.connect(dojo.byId('removePolygon'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId('modifyPolygon'), 'onmouseenter', function(evt) {
		showToolTip(evt, 'Edit current inspection');
	});	
	dojo.connect(dojo.byId('modifyPolygon'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId('cancelPolygon'), 'onmouseenter', function(evt) {
		showToolTip(evt, 'Undo current inspection edits');
	});	
	dojo.connect(dojo.byId('cancelPolygon'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId('savePolygon'), 'onmouseenter', function(evt) {
		showToolTip(evt, 'Save current inspection');
	});	
	dojo.connect(dojo.byId('savePolygon'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId('digitizePolygon'), 'onmouseenter', function(evt) {
		showToolTip(evt, 'Draw or edit an inspection event ' + shapeMode + ". Toogle between rectangle or polygon by pressing R or P while editing the image.");
	});	
	dojo.connect(dojo.byId('digitizePolygon'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
    
    dojo.connect(dojo.byId('zoomify'), 'onmouseover', function(evt) {
		zoomifyOver = true;
	});
    dojo.connect(dojo.byId('zoomify'), 'onmouseout', function(evt) {
		zoomifyOver = false;
	});
    
    dojo.connect(document, 'onkeydown', function(evt) {
		var kc = evt.keyCode;
        switch (kc) {
            //alt-c to set mode to digitizing if currently in view mode;
            case 67:
                if (Z.editing != null && zoomifyOver && evt.altKey) { 
                    if (_.isNull(zoomifyHotspotCurrent)) {
                        var inpectionEventId = dijit.byId('inspectionEventTypeDropdown').get('value');
                        var inspectionEventName = dijit.byId('inspectionEventTypeDropdown').attr('displayedValue');
                        var imageId = dojo.attr("zoomify", "data-active-image-id");
                        var hotspotId = convertToInspectionEventHotspotId(inpectionEventId, imageId);
                        
                        var hotspots = Z.Viewport.getAllHotspots();
                        var eventHotspots = dojo.filter(hotspots, function(h) { return h.id.indexOf(hotspotId) > -1; });
                        var nums = dojo.map(eventHotspots, function(h) { 
                            var end = h.id.split('_').pop();
                            var val = (end.split('-').length > 1) ? 0 : end;
                            return parseInt(val);
                        }).sort();
                        var hotspotNum = _.last(nums) + 1;
                        var hotspotIndex = (hotspots && hotspots.length > 0) ? '_' + hotspotNum : '';
                        var id = hotspotId + hotspotIndex;
                        zoomifyHotspotCurrent = id
                        
                        createInspectionEventHotspotFromParameters(id, inspectionEventName, inpectionEventId, imageId, true);

                        var labels = dojo.map(Z.Viewport.getAllHotspots(), function(hotspot) { 
                            return {"text": hotspot.name, "value": hotspot.internalID, "poiID": hotspot.poiID };
                        })
                        Z.Viewport.updateLabelHotspotLabelList(labels);
                    }
                    Z.Viewport.setCurrentHotspot(zoomifyHotspotCurrent);
                    Z.labelMode = shapeMode;
                    Z.Viewport.setEditModeLabel(Z.labelMode, true, 'polygon', true);
                    dojo.style("digitizePolygon", "backgroundImage", "url(" + (window.location.origin + window.location.pathname) + "images/zoomifyAnnotationDisplay/digitize-" + shapeMode + ".png)");
                    dojo.style('hotspotDisplay', 'cursor', 'crosshair');
                    
                    dojo.byId('edit-mode').innerHTML = 'Edit';
                    dojo.byId('shape-mode').innerHTML = '(' + shapeMode + ')';
                    dojo.style("zoomify-edit-mode", {
                        left: dojo.style("ViewerDisplay", "width")/2 + dojo.style(dojo.query(".lSPager.lSGallery")[0], "width") - dojo.getMarginBox("zoomify-edit-mode").w/2 + "px"
                    });
                }
                break;
            //alt-k to remove current hotspot;
            case 75:
                if (Z.editing != null && zoomifyOver && evt.altKey) {
                    var zHotspot = Z.Viewport.getCurrentLabel();
                    if (zHotspot) {
                        var polys = tempInspectionData.hotspots[getCurrentImage().resourceId];
                        var hotspotIndex = getIndexByValueFromJsonArray(zHotspot.id, 'id', polys);
                        polys.splice(hotspotIndex,1);
                        
                        Z.Viewport.deleteLabel(zHotspot.internalID, true);
                        Z.Viewport.redisplayViewerHotspots();
                    }
                }
                break;
            //alt-n to create a new polygon for the current inspection event;
            case 78:
                /* if (Z.editing != null && zoomifyOver && evt.altKey) {
                    var zHotspot = Z.Viewport.getCurrentLabel();
                    if (zHotspot) {
                        var poly = getImageHotspotById(zHotspot.id);
                        poly.center = { X: zHotspot.x, Y: zHotspot.y };
                        poly.geometry = dojo.map(zHotspot.polygonPts, function(point){
                                return { X: point.x, Y: point.y }
                        });
                        Z.Viewport.saveEditsLabel(false);
                    }
                    
                    Z.editMode = 'edit';
                    Z.editing = 'editLabel';
                    Z.Viewport.setCurrentHotspot(null);
                    
                    var inpectionEventId = dijit.byId('inspectionEventTypeDropdown').get('value');
                    var inspectionEventName = dijit.byId('inspectionEventTypeDropdown').attr('displayedValue');
                    var gridNodeId = dojo.query("div[data-grid-status=on]")[0].id
                    var imageId = dojo.attr(gridNodeId, "data-grid-image-id");
                    var hotspotId = convertToInspectionEventHotspotId(inpectionEventId, imageId);
                    
                    var hotspots = Z.Viewport.getAllHotspots();
                    var eventHotspots = dojo.filter(hotspots, function(h) { return h.id.indexOf(hotspotId) > -1; });
                    var nums = dojo.map(eventHotspots, function(h) { 
                        var end = h.id.split('_').pop();
                        var val = (end.split('-').length > 1) ? 0 : end;
                        return parseInt(val);
                    }).sort();
                    var hotspotNum = _.last(nums) + 1;
                    var hotspotIndex = (hotspots && hotspots.length > 0) ? '_' + hotspotNum : '';
                    var id = hotspotId + hotspotIndex;
                    
                    createInspectionEventHotspotFromParameters(id, inspectionEventName, inpectionEventId, imageId, true);
                    zoomifyHotspotCurrent = id;
                    Z.Viewport.setCurrentHotspot(zoomifyHotspotCurrent);
                    
                    Z.labelMode = shapeMode;
                    Z.Viewport.setEditModeLabel(Z.labelMode, true, 'polygon', true);
                    
                    var labels = dojo.map(Z.Viewport.getAllHotspots(), function(hotspot) { 
                        return {"text": hotspot.name, "value": hotspot.internalID, "poiID": hotspot.poiID };
                    })
                    Z.Viewport.updateLabelHotspotLabelList(labels);
                    //Z.Viewport.redisplayViewerHotspots();
                } */
                break;
            //alt-p key to toggle polygon editing mode;
            case 80:
                if (Z.editing != null && zoomifyOver && evt.altKey) {
                    shapeMode = 'polygon';
                    Z.labelMode = shapeMode;
                    Z.Viewport.setEditModeLabel(shapeMode, true, 'polygon', true);
                    dojo.style("digitizePolygon", "backgroundImage", "url(" + (window.location.origin + window.location.pathname) + "images/zoomifyAnnotationDisplay/digitize-" + shapeMode + ".png)");
                    dojo.style('hotspotDisplay', 'cursor', 'crosshair');
                    
                    dojo.byId('shape-mode').innerHTML = '(' + shapeMode + ')';
                    dojo.style("zoomify-edit-mode", {
                        left: dojo.style("ViewerDisplay", "width")/2 + dojo.style(dojo.query(".lSPager.lSGallery")[0], "width") - dojo.getMarginBox("zoomify-edit-mode").w/2 + "px"
                    });
                }
                break;
            //alt-r key to toggle rectangle editing mode;
            case 82:
                if (Z.editing != null && zoomifyOver && evt.altKey) {
                    shapeMode = 'rectangle';
                    Z.labelMode = shapeMode;
                    Z.Viewport.setEditModeLabel(shapeMode, true, 'polygon', true);
                    dojo.style("digitizePolygon", "backgroundImage", "url(" + (window.location.origin + window.location.pathname) + "images/zoomifyAnnotationDisplay/digitize-" + shapeMode + ".png)");
                    dojo.style('hotspotDisplay', 'cursor', 'crosshair');
                    
                    dojo.byId('shape-mode').innerHTML = '(' + shapeMode + ')';
                    dojo.style("zoomify-edit-mode", {
                        left: dojo.style("ViewerDisplay", "width")/2 + dojo.style(dojo.query(".lSPager.lSGallery")[0], "width") - dojo.getMarginBox("zoomify-edit-mode").w/2 + "px"
                    });
                }
                break;
            //alt-v to temporarily finish a polygon, save polygon geometry to client-side image object, and set view mode to facilitate navigation;
            case 86:
                if (Z.editing != null && zoomifyOver && evt.altKey) {
                    var zHotspot = Z.Viewport.getCurrentLabel();
                    if (zHotspot) {
                        var poly = getImageHotspotById(zHotspot.id);
                        poly.center = { X: zHotspot.x, Y: zHotspot.y };
                        poly.geometry = dojo.map(zHotspot.polygonPts, function(point){
                                return { X: point.x, Y: point.y }
                        });
                    }
                    dojo.style('hotspotDisplay', 'cursor', 'pointer');
                    Z.Viewport.setEditModeLabel('view');
                    Z.Viewport.redisplayViewerHotspots();
                    
                    dojo.byId('edit-mode').innerHTML = 'View';
                    dojo.byId('shape-mode').innerHTML = '';
                    dojo.style("zoomify-edit-mode", {
                        left: dojo.style("ViewerDisplay", "width")/2 + dojo.style(dojo.query(".lSPager.lSGallery")[0], "width") - dojo.getMarginBox("zoomify-edit-mode").w/2 + "px"
                    });
                }
                break;
            //alt-x to remove current hotspot geometry;
            case 88:
                if (Z.editing != null && zoomifyOver && evt.altKey) {
                    var zHotspot = Z.Viewport.getCurrentLabel();
                    if (zHotspot) {
                        var poly = getImageHotspotById(zHotspot.id);
                        poly.center = null;
                        poly.geometry = null;
                        Z.Viewport.modifyHotspot(zHotspot.id, 'polygonPts', null, true, false);
                        Z.Viewport.redisplayViewerHotspots();
                    }
                }
                break;
        }

	});
	
	dojo.connect(dojo.byId('addInspectionEventImage'), 'onclick', function(){
		if (inspectorEvent == 'addEvent' || inspectorEvent == 'modifyEvent')  {
			addImageToInspectionEvent();
		}
	});
	dojo.connect(dojo.byId('addInspectionEventImage'), 'onmouseenter', function(evt) {
		if (inspectorEvent == 'addEvent' || inspectorEvent == 'modifyEvent') {
			var html = 'Click to add current image to inspection event';
		} else {
			var html = '(Disabled) Not currently creating or modifying an inspection event';
		}
		showToolTip(evt, html);
	});	
	dojo.connect(dojo.byId('addInspectionEventImage'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.connect(dojo.byId('removeInspectionEventImage'), 'onclick', function(){
		if (inspectorEvent == 'addEvent' || inspectorEvent == 'modifyEvent')  {
			removeImageFromInspectionEvent();
		}
	});
	dojo.connect(dojo.byId('removeInspectionEventImage'), 'onmouseenter', function(evt) {
		if (inspectorEvent == 'addEvent' || inspectorEvent == 'modifyEvent')  {
			var html = 'Click to remove current image from inspection event';
		} else {
			var html = '(Disabled) Not currently creating or modifying an inspection event';
		}
		showToolTip(evt, html);
	});	
	dojo.connect(dojo.byId('removeInspectionEventImage'), 'onmouseout', function(evt) {
		if (tooltip) { tooltip.style.display = "none";}
	});
	
	dojo.query("#transmissionToggleButtons .btn").on("click", function(){
		var tab = this.value;
		
		dojo.query(".btn").removeClass("active");
        dojo.addClass(this,"active");
		
		var visibility = (tab == "Analyst") ? "visible" : "hidden";
		dojo.query(".inspection-only").style("visibility", visibility);
		
		if (siteView == "TransmissionLine") {
			populateInspectionEventsDropdown();
		}
		// load zoomify image
		if (!_.isUndefined(getCurrentImage())) {
			var currentImage = getCurrentImage();
			updateZoomifyViewer('zoomify', currentImage.zoomifyURL.split("?")[0], currentImage.resourceId);
		}
		
		var disabled = (tab == "Analyst") ? false : true;
		dijit.byId('inspectionEventTypeDropdown').set('disabled', disabled);
		
		/* if (inspectorEvent == 'addEvent' || inspectorEvent == 'modifyEvent') {
			confirmInspectionEventSave.show();
		} */ 
		
	});
}

function getTransmissionInspectionEvents(site, workOrder, assetId) {
	/* post request for inspectionEvents associated with a site, workOrder, and asset */
	var data = { "siteId":site, "assetId":assetId, "orderNumber": workOrder };
	var deferredInspectionEventQuery = dojo.xhrPost({
		url: serviceApiUrl + "inspectionEvent/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + accessToken
		},
		postData: JSON.stringify(data),
		load: function(response) {
			if (response.length > 0) {
				processTurbineInspectionEvents(assetId, response);
			}
		},
		error: function(error){
			console.log(error);
			dojo.byId("dataWarehouseErrorContent").innerHTML = "Error retrieving inspection events from the server. <br>" + error.message;
			dijit.byId("dataWarehouseError").show();
		}
	});
}

function processTurbineInspectionEvents(id, response){
	var inspectionEventsJsonResponse = dojo.map(response, function(evt){
		return convertInspectionEvent(evt, 'viewer');
	});
	getInspectionEventResources(siteId, workOrderNumber, id, inspectionEventsJsonResponse);
}

function getInspectionEventResources(site, workOrder, assetId, inspectionEventsJsonResponse){
	var asset = _.findWhere(siteData[siteId].workOrders[workOrderNumber].summary.data, { id: assetId });
	asset.assetInspection.inspectionEvents.events = inspectionEventsJsonResponse;
	asset.assetInspection.inspectionEvents.loaded = true;
	
	var severityValues = dojo.map(inspectionEventsJsonResponse, function(inspectionEvent){ return inspectionEvent.severity; });
	asset.assetInspection.severityValues = severityValues;
	asset.assetInspection.severityMax = asset.assetInspection.severity;
	
	var resourceDeferreds = [];
	/* post request for inspectionEventResources associated with a site, workOrder, asset, and inspectionEvent */
	dojo.forEach(inspectionEventsJsonResponse, function(inspectionEvent) {
		var data = { "siteId":site, "assetId":assetId, "orderNumber":workOrder, "inspectionEventId": inspectionEvent.id  };
		var resourceDeferred = dojo.xhrPost({
			url: serviceApiUrl + "inspectionEventResource/search",
			handleAs: "json",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + accessToken
			},
			postData: JSON.stringify(data),
			load: function(response) {
				//console.log(response);
			},
			error: function(error){
				console.log(error);
				dojo.byId("dataWarehouseErrorContent").innerHTML = "Error retrieving inspection events resources from the server. <br>" + error.message;
				dijit.byId("dataWarehouseError").show();
			}
		});
		
		resourceDeferreds.push(resourceDeferred);
	});
	
	var resourceDeferredList = new dojo.DeferredList(resourceDeferreds);
	resourceDeferredList.then(function(response) {
		if (response.length > 0) {
			var inspectionEventResources = dojo.map(response, function(r) { return r[1] });
			
			var asset = _.findWhere(siteData[siteId].workOrders[workOrderNumber].summary.data, { id: assetId });
			if (!_.has(asset.assetInspection, "inspectionEventResources")) {
				asset.assetInspection.inspectionEventResources = {};
			}
			asset.assetInspection.inspectionEventResources.loaded = true;
			asset.assetInspection.inspectionEventResources.polys = inspectionEventResources;
			
			dojo.forEach(inspectionEventResources, function(resource, i) {
				var inspectionEvent = asset.assetInspection.inspectionEvents.events[i];
				processTurbineInspectionEventResources(resource, inspectionEvent, asset);
			})
			assetInspectionEventsData = asset.assetInspection.inspectionEvents.events;
			
			if (dijit.byId("inspectionEventTypeDropdown").get("options").length == 1) {
				populateInspectionEventsDropdown();
			}
		}
	});
}

function processTurbineInspectionEventResources(resources, inspectionEvent, asset) {
	dojo.forEach(resources, function(resource) {
		var resourceId = resource.resourceId;
		var polygons = convertInspectionEventResourceToViewer(resource);
		var image = _.findWhere(asset.assetInspection.flightImages, { "resourceId" : resourceId });
		inspectionEvent.images.push(resourceId);
		
		if (!_.isUndefined(image) && resource.inspectionEventId != "" && polygons.length > 0) {
			image.polys = (_.has(image, "polys")) ? image.polys : [];
			dojo.forEach(polygons, function(polygon) {
				polygon.source = inspectionEvent.source;
				image.polys.push(polygon);
			})
			
		} else {
			if (_.isUndefined(image)) {
				console.log("Missing Resource -> id: " + resource.id + ", resourceId: " + resource.resourceId);
			}
			if (resource.inspectionEventId == "") {
				console.log("Missing inspectionEventId -> id: " + resource.id + ", inspectionEventId: " + resource.inspectionEventId);
			}
		}
	})
	
	dojo.style("zoomify-loading", "display", "none");
	// load zoomify image
	var currentImage = getCurrentImage();
	updateZoomifyViewer('zoomify', currentImage.zoomifyURL.split("?")[0], currentImage.resourceId);
}

function convertInspectionEvent(inspectionEvent, to) {
	switch(to) {
		case 'warehouse':
			var object = {
				"id": inspectionEvent.id,
				"siteId": siteId,
				"orderNumber": workOrderNumber,
				"assetId": inspectionEvent.assetId,
				"componentId": null,
				"name": inspectionEvent.name,
				"findingType": inspectionEvent.findingType,
				"position": inspectionEvent.position,
				"severity": inspectionEvent.severity,
				"comment": inspectionEvent.comment,
				"size": {
					"depth": 0,
					"height": 0,
					"width": 0
				},
				"userId": inspectionEvent.userId,
				"date": convertDate(inspectionEvent.date, 'warehouse'),
				"source": inspectionEvent.source
			};
		break;
		
		case 'viewer':
			var object = {
				"id": inspectionEvent.id,
				"assetId": inspectionEvent.assetId,
				"name": inspectionEvent.name,
				"findingType": inspectionEvent.findingType,
				"position": inspectionEvent.position,
				"severity": inspectionEvent.severity,
				"comment": inspectionEvent.comment,
				"images": [ ],
				"user" : inspectionEvent.userId,
				"date": convertDate(inspectionEvent.date, 'viewer'),
				"images": [],
				"source": inspectionEvent.source
			};
		break;
	}
	
	return object;
}

function convertInspectionEventResourceToViewer(resources) {
	var inspectionEventResourceId = resources.id;
	var inspectionEventId = resources.inspectionEventId;
	var polygons = dojo.map(resources.polygons, function(polygon) {
		var shape = {
			"id": polygon.id,
			"inspectionEventResourceId": inspectionEventResourceId,
			"inspectionEventId": inspectionEventId,
			"name": polygon.name,
			"severity": polygon.severity,
			"center": null,
			"geometry": null
		}
		if (polygon.geometry) {
			shape.center = { "X": polygon.center.x, "Y": polygon.center.y },
			shape.geometry = dojo.map(polygon.geometry, function(point){
				return { "X": point.x, "Y": point.y}
			})
		}
		return shape;
	});
	return polygons;
}

function convertInspectionEventIdToDisplayName(inspectionEvent){
    var id = inspectionEvent.id;
	return inspectionEvent.name;
}

function getDateTimeUTC() {
    var date = new Date();
    var utcDate = date.getUTCFullYear() + "" + (((date.getUTCMonth())<9) ? "0" + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1)) + "" + ((date.getUTCDate()<10) ? "0" + date.getUTCDate() : date.getUTCDate());
    var utcTime = (((date.getUTCHours())<9) ? "0" + (date.getUTCHours()) : (date.getUTCHours())) + "" + ((date.getUTCMinutes()<10) ? "0" + date.getUTCMinutes() : date.getUTCMinutes()) + "" + ((date.getUTCSeconds()<10) ? "0" + date.getUTCSeconds() : date.getUTCSeconds());
    return utcDate + "T" + utcTime + ".000+0000";
}

function getCurrentImage(){
	var imageId = dojo.attr(dojo.byId("zoomify"), "data-active-image-id");
	var image = getImageById(imageId);
	return image;
}

function getImageHotspotForInspectionEvent(imageId, inspectionEventId) {
	var inspectionEvent = (Z.editing === 'addLabel' || Z.editing === 'editLabel') ? tempInspectionData : getInspectionEventById(inspectionEventId);
	inspectionEvent = (inspectionEvent) ? inspectionEvent : tempInspectionData;
	
	if (dojo.some(inspectionEvent.images, function(image) { return image == imageId; })) {
		var image = getImageById(imageId);
		if (image.polys.length > 0) {
			var hotspotId = convertToInspectionEventHotspotId(inspectionEventId, imageId);
			var hotspots = dojo.filter(image.polys, function(poly) {
				return poly.id.indexOf(hotspotId) > -1;
			});
			if (hotspots.length > 0) {
				return hotspots;
			} else {
				return false;
			}
		}
	} else {
        return false;
    }
}

function getCurrentImageHotspotForInspectionEvent() {
	var inspectionEventId = dijit.byId('inspectionEventTypeDropdown').get('value');
	var inspectionEvent = (Z.editing === 'addLabel' || Z.editing === 'editLabel') ? tempInspectionData : getInspectionEventById(inspectionEventId);
	inspectionEvent = (inspectionEvent) ? inspectionEvent : tempInspectionData;
	var imageId = dojo.attr("zoomify", "data-active-image-id");
	
	if (dojo.some(inspectionEvent.images, function(image) { return image == imageId; })) {
		var image = getImageById(imageId);
		if (image.polys.length > 0) {
			var hotspotId = convertToInspectionEventHotspotId(inspectionEventId, imageId);
			var hotspots = dojo.filter(image.polys, function(poly) {
				return poly.id.indexOf(hotspotId) > -1;
			});
			if (hotspots.length > 0) {
				return hotspots;
			} else {
				return false;
			}
		}
	} else {
        return false;
    }
}

function getAnnotationObjects(image) {
	var data = image.polys;
	var tab = dojo.query("#transmissionToggleButtons .btn.active")[0].value;
	var data = dojo.filter(data, function(item) { return item.source == tab });
	if (data.length > 0) {
		var hotspots = [];
		dojo.forEach(data, function(poly) {
			if (poly.geometry) {
				var item = dojo.clone(poly);
				var inspectionEventId = item.inspectionEventId;
				var inspectionEvent = getInspectionEventById(inspectionEventId);
				item.user = (inspectionEvent) ? inspectionEvent.user : authUser;
				item.date = (inspectionEvent) ? inspectionEvent.date : currentDate;
				hotspots.push(item);
			}
		});
	} else {
		var hotspots = [];
	}
	return hotspots;
}

function convertToInspectionEventId(input) {
	var id = input.split("_")[0];
	return id;
}

function convertToInspectionEventHotspotId(inspectionEventId, imageId) {
	var id = inspectionEventId + '_' + imageId;
	return id;
}

function getInspectionEventById(inspectionEventId) {
	var inspectionEvent = _.findWhere(assetInspectionEventsData, { "id" : inspectionEventId });
	return inspectionEvent;
}

function getImageById(resourceId) {
	var asset = _.findWhere(siteData[siteId].workOrders[workOrderNumber].summary.data, { "id" : turbineId });
	var image = _.findWhere(asset.assetInspection.flightImages, { "resourceId" : resourceId });
	return image;
}

function getImageHotspotById(id) {
	var imageId = id.split("_")[1];
	var image = getImageById(imageId);
	
	if (dojo.some(image.polys, function(poly) { return poly.id == id; })) {
		 return dojo.filter(image.polys, function(poly) { return poly.id == id })[0];
	} else {
		return false;
	}
}

function makeAnnotationObjects(data){
	var hotSpotColors = appConfig["TransmissionLine"][authUserOrgKey].colors;
	var hotspots = dojo.map(data, function(obj){
        var name = obj.name;
        var hotspot = { 
				"ID": obj.id, 
				"NAME": name, 
				"MEDIATYPE": "polygon", 
				"MEDIA": "polygon", 
				"X": obj.center.X, 
				"Y": obj.center.Y, 
				"ZOOM": "12", 
				"XSCALE": "100", 
				"YSCALE": "100", 
				"CLICKURL": "function", 
				"URLTARGET": "setInspectionEventDropdownOnHotspotClick('" + obj.id + "')",
				"POIID": "0",
				"ROLLOVER": "1", 
				"CAPTION": name, 
				"TOOLTIP": name,
				"CATEGORY": "event",				
				"USER": (!_.isUndefined(obj.user)) ? obj.user : "", 
				"DATE": obj.date, 
				"LINECOLOR": (!_.isUndefined(hotSpotColors[obj.severity])) ? hotSpotColors[obj.severity].replace('#',"") : hotSpotColors[0].replace('#',""), 
				"FILLCOLOR": (!_.isUndefined(hotSpotColors[obj.severity])) ? hotSpotColors[obj.severity].replace('#',"") : hotSpotColors[0].replace('#',""),
				"FILLVISIBLE": "1",
				"BACKVISIBLE": "1",
				"CAPTIONPOSITION": "5", 
				"POLYGON": { 
					"POINT": obj.geometry
				}
			}
		return hotspot;
	});
	var annotationObject = { 
		"ZAS": { 
			"SETUP": { 
				"PANELPOSITION": "4", 
				"INITIALVISIBILITY": "0",
				"POIVISIBILITY" : "0",
				"NOTEVISIBILITY": "0",
				"MINSCALE": "0.20", 
				"MAXSCALE": "2" 
			}, 
			"POI": { 
				"ID": "0", 
				"NAME": "Whole Image", 
				"X": "center", 
				"Y": "center", 
				"ZOOM": "-1", 
				"USER": "Reviewer", 
				"DATE": currentDate, 
				"LABELS": {
					"LABEL": hotspots
				}
			}
		}
	};

	return annotationObject;
}

function initiateZoomifyViewer(id, viewerPath) {
	var params = {
		'zSkinPath':'images/zoomify/skins/default',
		'zNavigatorVisible':3,
		'zToolbarVisible':1,
		'zMeasureVisible': 0,
		'zLogoVisible':0,
		'zHelpVisible':0,
		'zProgressVisible':0,
		'zNavigatorWidth':50,
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
    Z.showImage(id, viewerPath, params);
    Z.noPost = true;
	Z.editAdmin = true;
	
	Z.setCallback('annotationsLoaded', function(labels){
		if (inspectorEvent == 'modifyEvent' || inspectorEvent == 'addEvent') {
			var eventId = tempInspectionData.id;
			var imageId = getCurrentImage().id;
			var id = convertToInspectionEventHotspotId(eventId, imageId);
			if (dojo.indexOf(labels, id) >= 0) {
				Z.Viewport.setCurrentHotspot(id);
				zoomifyHotspotCurrent = id;
				shapeMode = Z.Viewport.getCurrentLabel().mediaType;
				Z.labelMode = shapeMode;
				
				Z.Viewport.editCurrentLabel();
				Z.editing = 'editLabel';
				
				Z.Viewport.setEditModeLabel(shapeMode, true, 'polygon', true);
				dojo.style("digitizePolygon", "backgroundImage", "url(" + (window.location.origin + window.location.pathname) + "images/zoomifyAnnotationDisplay/digitize-" + shapeMode + ".png)");
				dojo.style('hotspotDisplay', 'cursor', 'crosshair');
				
				dojo.byId('shape-mode').innerHTML = '(' + shapeMode + ')';
				dojo.style("zoomify-edit-mode", {
					left: dojo.style("ViewerDisplay", "width")/2 + dojo.style(dojo.query(".lSPager.lSGallery")[0], "width") - dojo.getMarginBox("zoomify-edit-mode").w/2 + "px"
				});
			} else {
				dojo.style('hotspotDisplay', 'cursor', 'pointer');
				Z.editing = 'editLabel';
				Z.Viewport.setEditModeLabel('view');
				zoomifyHotspotCurrent = null;
				Z.Viewport.setCurrentHotspot(zoomifyHotspotCurrent);
				
				dojo.byId('edit-mode').innerHTML = 'View';
				dojo.byId('shape-mode').innerHTML = '';
				dojo.style("zoomify-edit-mode", {
					left: dojo.style("ViewerDisplay", "width")/2 + dojo.style(dojo.query(".lSPager.lSGallery")[0], "width") - dojo.getMarginBox("zoomify-edit-mode").w/2 + "px"
				});
			}
		}
	});
	Z.setCallback('viewUpdateCompleteGetLabelIDs', function(labels){	
		if (inspectorEvent == 'modifyEvent') {
			var eventId = tempInspectionData.id;
			var imageId = getCurrentImage().id;
			var id = convertToInspectionEventHotspotId(eventId, imageId);
			if (dojo.indexOf(labels, id) >= 0) {
				Z.Viewport.setCurrentHotspot(id);
			}
		}
	});
	
	// delay to allow zoomify viewer to fully reinitialise; insert full view inspector into zoomify ViewerDisplay and enable dragging functionality to inspector panel
	/* window.setTimeout(function() {
	   if (dojo.byId("ViewerDisplay") && dojo.byId("zoomify-inspector")) {
		   dojo.place("zoomify-overview", "ViewerDisplay","last");
		   dojo.place("zoomify-inspector", "ViewerDisplay","last");
		   
		   var zoomifyOverviewMoveableDiv = new dojo.dnd.move.parentConstrainedMoveable("zoomify-overview", {
				handle: dojo.byId("zoomify-overviewHeader"),
				area: "border",
				within: true
			});
			
			var zoomifyInspectorMoveableDiv = new dojo.dnd.move.parentConstrainedMoveable("zoomify-inspector", {
				handle: dojo.byId("zoomify-inspectorHeader"),
				area: "border",
				within: true
			});
	   }
	}, 2000); */
}

function updateZoomifyViewer2(id, viewerPath, image) {
	var currentImage = dojo.filter(bladeImagesData, function(item){ return item.id == image })[0];
	var data = getAnnotationObjects(currentImage);
	var annotationObjects = makeAnnotationObjects(data);
	var params = {
		'zSkinPath':'images/zoomify/skins/default',
		'zNavigatorVisible':3,
		'zToolbarVisible':1,
		'zMeasureVisible': 0,
		'zLogoVisible':0,
		'zHelpVisible':0,
		'zProgressVisible':0,
		'zNavigatorWidth':50,
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
        'zHotspotsDrawOnlyInView': 0,
        'zAnnotationJSONObject': annotationObjects
    };
	
	if ((!Z.Viewer) || (Z.imagePath != viewerPath)) {
		if (firstImageLoad) {
            firstImageLoad = false;
			Z.showImage(id, viewerPath, params);
			Z.editAdmin = true;
            Z.setCallback('annotationsLoaded', function(labels){
                if (inspectorEvent == 'modifyEvent' || inspectorEvent == 'addEvent') {
                    var eventId = tempInspectionData.id;
                    var imageId = getCurrentImage().id;
                    var id = convertToInspectionEventHotspotId(eventId, imageId);
                    if (dojo.indexOf(labels, id) >= 0) {
                        Z.Viewport.setCurrentHotspot(id);
                        zoomifyHotspotCurrent = id;
                        shapeMode = Z.Viewport.getCurrentLabel().mediaType;
                        Z.labelMode = shapeMode;
                        
                        Z.Viewport.editCurrentLabel();
                        Z.editing = 'editLabel';
                        
                        Z.Viewport.setEditModeLabel(shapeMode, true, 'polygon', true);
                        dojo.style("digitizePolygon", "backgroundImage", "url(" + (window.location.origin + window.location.pathname) + "images/zoomifyAnnotationDisplay/digitize-" + shapeMode + ".png)");
                        dojo.style('hotspotDisplay', 'cursor', 'crosshair');
                        
                        dojo.byId('shape-mode').innerHTML = '(' + shapeMode + ')';
                        dojo.style("zoomify-edit-mode", {
                            left: dojo.style("ViewerDisplay", "width")/2 + dojo.style(dojo.query(".lSPager.lSGallery")[0], "width") - dojo.getMarginBox("zoomify-edit-mode").w/2 + "px"
                        });
                    } else {
                        dojo.style('hotspotDisplay', 'cursor', 'pointer');
                        Z.editing = 'editLabel';
                        Z.Viewport.setEditModeLabel('view');
                        zoomifyHotspotCurrent = null;
                        Z.Viewport.setCurrentHotspot(zoomifyHotspotCurrent);
                        
                        dojo.byId('edit-mode').innerHTML = 'View';
                        dojo.byId('shape-mode').innerHTML = '';
                        dojo.style("zoomify-edit-mode", {
                            left: dojo.style("ViewerDisplay", "width")/2 + dojo.style(dojo.query(".lSPager.lSGallery")[0], "width") - dojo.getMarginBox("zoomify-edit-mode").w/2 + "px"
                        });
                    }
                }
            });
            Z.setCallback('viewUpdateCompleteGetLabelIDs', function(labels){	
                if (inspectorEvent == 'modifyEvent') {
                    var eventId = tempInspectionData.id;
                    var imageId = getCurrentImage().id;
                    var id = convertToInspectionEventHotspotId(eventId, imageId);
                    if (dojo.indexOf(labels, id) >= 0) {
                        Z.Viewport.setCurrentHotspot(id);
                    }
                }
            });
            
            // delay to allow zoomify viewer to fully reinitialise; insert full view inspector into zoomify ViewerDisplay and enable dragging functionality to inspector panel
            window.setTimeout(function() {
               if (dojo.byId("ViewerDisplay") && dojo.byId("zoomify-inspector")) {
                   dojo.place("zoomify-overview", "ViewerDisplay","last");
                   dojo.place("zoomify-inspector", "ViewerDisplay","last");
				   
                   var zoomifyOverviewMoveableDiv = new dojo.dnd.move.parentConstrainedMoveable("zoomify-overview", {
                        handle: dojo.byId("zoomify-overviewHeader"),
                        area: "border",
                        within: true
                    });
                    
                    var zoomifyInspectorMoveableDiv = new dojo.dnd.move.parentConstrainedMoveable("zoomify-inspector", {
                        handle: dojo.byId("zoomify-inspectorHeader"),
                        area: "border",
                        within: true
                    });
               }
            }, 2000);
            
		} else {
            dojo.place("zoomify-overview", "zoomify","last");
            dojo.place("zoomify-inspector", "zoomify","last");
            
            //hack to remove navigator display from the dom as it gets appended by zoomify every setImage call even if it already exists in the dom
            dojo.destroy("navigatorDisplay0");
            
            Z.Viewer.setImage(viewerPath, params);
			Z.editAdmin = true;
            
            //delay to allow zoomify viewer to fully load image then redisplay hotspots in the viewer since setImage does not display them properly; insert full view inspector into zoomify ViewerDisplay
            window.setTimeout(function(){
                Z.Viewport.redisplayViewerHotspots();
                dojo.place("zoomify-overview", "ViewerDisplay","last");
                dojo.place("zoomify-inspector", "ViewerDisplay","last");
                
                var labels = dojo.map(Z.Viewport.getAllHotspots(), function(hotspot) { 
                    return {"text": hotspot.name, "value": hotspot.internalID, "poiID": hotspot.poiID };
                })
                Z.Viewport.updateLabelHotspotLabelList(labels);
                
            }, 1000);
        }
        
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
}

function setInspectionEventDropdownOnHotspotClick(id) {
	if (Z.editing == null || Z.editing == 'view') {
		if (dijit.byId('inspectionEventTypeDropdown')) {
			dijit.byId('inspectionEventTypeDropdown').set('value', convertToInspectionEventId(id));
		}
	}
}

function populateTemporaryInspectionEvent(id) {
	tempInspectionData = dojo.clone(getInspectionEventById(id));
    tempInspectionData.hotspots = {};
	dojo.forEach(tempInspectionData.images, function (imageId){
		var image = getImageById(imageId);
		if (!_.isUndefined(image)) {
			tempInspectionData.hotspots[imageId] = [];
			dojo.forEach(image.polys, function(poly){
				var inspectionEventId = convertToInspectionEventId(poly.id);
				if (inspectionEventId == tempInspectionData.id) {
					tempInspectionData.hotspots[imageId].push(dojo.clone(poly));
				}
			});
		} else {
			console.log(image);
			console.log(imageId);
		}
	});
	tempInspectionData.resourcesToDelete = [];
}

function populateRollbackInspectionEvent(id) {
	// can't I just clone tempInspectionData?
	rollbackInspectionData = dojo.clone(getInspectionEventById(id));
	rollbackInspectionData.hotspots = {}
	dojo.forEach(rollbackInspectionData.images, function (imageId){
		var image = getImageById(imageId);
		if (!_.isUndefined(image)) {
			rollbackInspectionData.hotspots[imageId] = [];
			dojo.forEach(image.polys, function(poly){
				var inspectionEventId = convertToInspectionEventId(poly.id);
				if (inspectionEventId == rollbackInspectionData.id) {
					rollbackInspectionData.hotspots[imageId].push(dojo.clone(poly));
				}
			});
		} else {
			console.log(image);
			console.log(imageId);
		}
	});
}

function createInspectionEvent(){
    inspectorEvent = 'addEvent';
    
    var site = siteId;
    var assetName = turbineName;
	var tab = dojo.query("#transmissionToggleButtons .btn.active")[0].value;
	var evtName = (tab == "Analyst") ? "Evt" : "Prediction";
	var inspectionEvents = dojo.filter(assetInspectionEventsData, function(evt) { return evt.source == tab });
    var evtNumber = ((inspectionEvents.length > 0) ? parseInt(_.last(_.last(inspectionEvents).name.split(' '))) + 1 : 1)
    
    var id = (uuids.length > 0) ? uuids.pop(): "";
	
    var name = 'Structure ' + assetName + ' - ' + evtName + ' ' + evtNumber;
    createInspectionEventFromParameters(turbineId, id, name);
	
	var inspectionEvents = dojo.filter(assetInspectionEventsData, function(evt) { return evt.source == tab });
	console.log(inspectionEvents);
    
    var inspectionEventOptions = [{ label: "--", value: "" }];
    if (inspectionEvents.length > 0) {
        inspectionEvents.sort(byEventName)
        dojo.forEach(inspectionEvents, function(obj){
			var name = obj.name;
            var value = obj.id;
            inspectionEventOptions.push({ label: name, value: value });
        });
    }
	
	resetZoomifyAnnotationDisplay();
    showZoomifyAnnotationRequiredFieldLabels(true);
	
    dijit.byId('inspectionEventTypeDropdown').set('options', inspectionEventOptions);
    dijit.byId('inspectionEventTypeDropdown').set('value', id);
    disableZoomifyAnnotationDisplay(false);
    dijit.byId('inspectionEventTypeDropdown').set('disabled', true);
    
    //add current image to inspection event as the initial image; assume that the user has located damage on current image and is initiating an event as a result; delay so that event properties are fully initiated before adding image.
    window.setTimeout(function(){
        addImageToInspectionEvent();
    }, 1000);
}

function createInspectionEventFromParameters(assetId, id, name) {
	var tab = dojo.query("#transmissionToggleButtons .btn.active")[0].value;
	var inspectionEvent = { 
		assetId: assetId,
		id: id, 
		name: name, 
		findingType: "", 
		position: "",
		severity: (tab == 'Analyst') ? 1 : 0,
		images: [],
		comment: "",
		userId: authUserObject.userId,
		date: currentDate,
		source: _.first(dojo.query(".btn.active")).value
	}
	
	assetInspectionEventsData.push(inspectionEvent);
	
	var asset = _.findWhere(siteData[siteId].workOrders[workOrderNumber].summary.data, { id: assetId });
	var severityValues = dojo.map(assetInspectionEventsData, function(inspectionEvent){ return inspectionEvent.severity; });
	asset.assetInspection.severityValues = severityValues;
	asset.assetInspection.severityMax = _.max(severityValues);
	
	tempInspectionData = dojo.clone(inspectionEvent);
	tempInspectionData.resourcesToDelete = [];
}

function startInspectionEventLabelEdits(){
    var hotspot = getCurrentImageHotspotForInspectionEvent();
    if (hotspot) {
        hotspot = _.first(hotspot);
        var id = hotspot.id;
        var geometry = getImageHotspotById(id).geometry;
        if (geometry) {
            Z.Viewport.setCurrentHotspot(id);
            shapeMode = Z.Viewport.getCurrentLabel().mediaType;
        } else {
            var imageId = getCurrentImage().resourceId;
            createInspectionEventHotspotFromParameters(id, hotspot.name, hotspot.inspectionEventId, imageId, true);
            Z.Viewport.setCurrentHotspot(id);
        }
    } else {
        var inpectionEventId = dijit.byId('inspectionEventTypeDropdown').get('value');
        var inspectionEventName = dijit.byId('inspectionEventTypeDropdown').attr('displayedValue');
		var imageId = getCurrentImage().resourceId;
        var id = convertToInspectionEventHotspotId(inpectionEventId, imageId);
        createInspectionEventHotspotFromParameters(id, inspectionEventName, inpectionEventId, imageId, true);
        Z.Viewport.setCurrentHotspot(id);
        addImageToInspectionEvent();
    }
    zoomifyHotspotCurrent = id;
    Z.labelMode = shapeMode;
    Z.editMode = 'edit';
    Z.editing = 'editLabel';
    Z.Viewport.setEditModeLabel(Z.labelMode, true, 'polygon', true);
    
    var labels = dojo.map(Z.Viewport.getAllHotspots(), function(hotspot) { 
        return {"text": hotspot.name, "value": hotspot.internalID, "poiID": hotspot.poiID };
    })
    Z.Viewport.updateLabelHotspotLabelList(labels);
    
    dojo.style("digitizePolygon", "backgroundImage", "url(" + (window.location.origin + window.location.pathname) + "images/zoomifyAnnotationDisplay/digitize-" + shapeMode + ".png)");
    dojo.style('hotspotDisplay', 'cursor', 'crosshair'); //added to change cursor when digitizing a polygon
    
    dojo.style('zoomify-edit-mode', 'display', 'block');
    dojo.byId('edit-mode').innerHTML = 'Edit';
    dojo.byId('shape-mode').innerHTML = '(' + shapeMode + ')';
    dojo.style("zoomify-edit-mode", {
        left: dojo.style("ViewerDisplay", "width")/2 + dojo.style(dojo.query(".lSPager.lSGallery")[0], "width") - dojo.getMarginBox("zoomify-edit-mode").w/2 + "px"
    });
}

function undoInspectionEventEdits(exit) {
    if (inspectorEvent == 'addEvent') {
        dojo.forEach(tempInspectionData.images, function(imageId){
            var image = getImageById(imageId);
            
            var eventId = tempInspectionData.id.replace(new RegExp('-' ,'g'),'_');
            if (dojo.some(image.polys, function(poly) { return poly.id.indexOf(eventId) > -1; })) {
                 var hotspots = dojo.filter(image.polys, function(poly) { return poly.id.indexOf(eventId) > -1 });
            } else {
                var hotspots = false;
            }

            var imageIndex = dojo.indexOf(tempInspectionData.images, image.id)
            if(imageIndex > -1) {
                tempInspectionData.images.splice(imageIndex,1);
            }
            
            //loop through and remove additional hotspots created during the current edit session.
            if (hotspots) {
                dojo.forEach(hotspots, function(hotspot) {
                    var hotstpotIndex = getIndexByValueFromJsonArray(hotspot.id, 'id', image.polys);
                    image.polys.splice(hotstpotIndex,1);
                    
                    if (image.id == getCurrentImage().id) {
                        Z.Viewport.setCurrentHotspot(hotspot.id);
                        var currentLabel = Z.Viewport.getCurrentLabel();
                        var value = currentLabel.internalID;
                        Z.Viewport.deleteLabel(value, true);
                        Z.Viewport.saveEditsLabel(false);
                    }
                    
                });
            }

            var severity = dojo.map(image.polys, function(poly){
                return poly.severity;
            });
            var gridNodeSeverity = (severity.length > 0) ? _.max(severity) : 0;
            //rollbackOverviewGridSeverity(imageId, gridNodeSeverity);
        });
        
        var inspectionEvent = dijit.byId('inspectionEventTypeDropdown').get('value');
        var i = getIndexByValueFromJsonArray(inspectionEvent, 'id', assetInspectionEventsData);
        assetInspectionEventsData.splice(i,1);
        updateInspectionEventTypeDropdown(inspectionEvent);
        
        resetZoomifyAnnotationDisplay();
        
    } else {
        rollbackZoomifyAnnotationDisplay();
    }
    
    if (exit) {
        disableZoomifyAnnotationDisplay(true);
        dijit.byId('inspectionEventTypeDropdown').set('disabled', false);
        dijit.byId('statusDropdown').set('disabled', false);
        
        dojo.style('zoomify-edit-mode', 'display', 'none');
        dojo.byId('edit-mode').innerHTML = 'View';
        dojo.byId('shape-mode').innerHTML = '';
        dojo.style("zoomify-edit-mode", {
            left: dojo.style("ViewerDisplay", "width")/2 - dojo.getMarginBox("zoomify-edit-mode").w/2 + "px"
        });
        showZoomifyAnnotationRequiredFieldLabels(false);
    }
    
    inspectorEvent = null;
    
    Z.editing = null;
    Z.Viewport.setEditModeLabel("view");
    Z.Viewport.redisplayViewerHotspots();
    
    dojo.style('hotspotDisplay', 'cursor', 'pointer'); //change cursor in zoomify viewer after finished digitizing a polygon
}

function saveInspectionEventEdits(exit){
    if (inspectorEvent == 'addEvent' || inspectorEvent == 'modifyEvent') {
        var id = dijit.byId('inspectionEventTypeDropdown').get('value');
        var imageId = getCurrentImage().resourceId;
        var zHotspot = Z.Viewport.getCurrentLabel();
		
		if (zHotspot) {
			var poly = getImageHotspotById(zHotspot.id);
			poly.center = { X: zHotspot.x, Y: zHotspot.y };
			poly.geometry = dojo.map(zHotspot.polygonPts, function(point){
					return { X: point.x, Y: point.y }
			});
			
			var tempPoly = _.findWhere(tempInspectionData.hotspots[imageId], { "id" : zHotspot.id });
			if (tempPoly) {
				tempPoly.center = { X: zHotspot.x, Y: zHotspot.y };
				tempPoly.geometry = dojo.map(zHotspot.polygonPts, function(point){
						return { X: point.x, Y: point.y }
				});
			}
		}
		var inspectionEventDeferreds = [];

        //check that the inspection event already exists in the data warehouse
        var inspectionEvent = convertInspectionEvent(tempInspectionData, 'warehouse');
        updateSiteDataInspectionEvent(inspectionEvent);
        var saveInspectionEventDeferred = saveInspectionEventDataToWarehouse(JSON.stringify(inspectionEvent), 'inspectionEvent', inspectorEvent);
        inspectionEventDeferreds.push(saveInspectionEventDeferred);
		
		// remove any inspection event resources (hotspot) if deleted by removing an image resource from the event
		dojo.forEach(tempInspectionData.resourcesToDelete, function(inspectionEventResourceId) {
			dojo.xhrDelete({
				url: serviceApiUrl + 'inspectionEventResource/' + inspectionEventResourceId,
				handleAs: "json",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + accessToken
				}
			});
			removeSiteDataInspectionEventResource(inspectionEventResourceId)
		});
		tempInspectionData.resourcesToDelete = [];

        dojo.forEach(tempInspectionData.images, function(image){
            var hotspots = tempInspectionData.hotspots[image];
			if (!_.isUndefined(hotspots) && hotspots.length > 0) {
                dojo.forEach(hotspots, function(hotspot) {
                    var hotspotPolygon = {
                        "id": hotspot.id,
                        "name": hotspot.name,
                        "severity": tempInspectionData.severity,
                        "center": null,
                        "geometry": null
                    }
                    if (!_.isNull(hotspot.geometry)) {
                        if (image == imageId && zHotspot && zHotspot.id == hotspot.id) {
                            Z.Viewport.setCurrentLabel(hotspot.id);
                            Z.Viewport.modifyHotspot(hotspot.id, 'zoom', 20, true, false);
                            var hotspotShape = Z.Viewport.getCurrentLabel();
                        } else {
                            var hotspotShape = {
                                "x": hotspot.center.X,
                                "y": hotspot.center.Y,
                                "polygonPts": dojo.map(hotspot.geometry, function(pt){
                                    return { "x": pt.X, "y": pt.Y }
                                })
                            }
                        }
                        hotspotPolygon.center = { "x": hotspotShape.x, "y": hotspotShape.y },
                        hotspotPolygon.geometry =  dojo.map(hotspotShape.polygonPts, function(point){
                            return { "x": point.x, "y": point.y}
                        })
                    }
                    
                    var status = (hotspot.inspectionEventResourceId) ? "modifyEvent" : "addEvent";
                    var hotspotObject = {
                        "id": null,
                        "siteId": siteId,
                        "orderNumber": workOrderNumber,
                        "assetId": dojo.attr("turbineId", "data-turbine-id"),
                        "resourceId": image,
                        "inspectionEventId": id, 
                        "polygons": [hotspotPolygon]
                    }
                    if (hotspot.inspectionEventResourceId) {
                        hotspotObject.id = hotspot.inspectionEventResourceId;
                    }
                    updateSiteDataInspectionEventResource(hotspotObject);
                    var saveInspectionEventResourceDeferred = saveInspectionEventDataToWarehouse(JSON.stringify(hotspotObject), 'inspectionEventResource', status);
                    inspectionEventDeferreds.push(saveInspectionEventResourceDeferred);
                });
            } else {
                var hotspotPolygon = {
                    "id": convertToInspectionEventHotspotId(id, image),
                    "name": tempInspectionData.name,
                    "severity": tempInspectionData.severity,
                    "center": null,
                    "geometry": null
                }
                
                var hotspotObject = {
                    "siteId": siteId,
					"componentId": null,
                    "orderNumber": workOrderNumber,
                    "assetId": dojo.attr("turbineId", "data-turbine-id"),
                    "resourceId": image,
                    "inspectionEventId": id, 
                    "polygons": [hotspotPolygon]
                }
                updateSiteDataInspectionEventResource(hotspotObject);
                var saveInspectionEventResourceDeferred = saveInspectionEventDataToWarehouse(JSON.stringify(hotspotObject), 'inspectionEventResource', 'addEvent');
                inspectionEventDeferreds.push(saveInspectionEventResourceDeferred);
            }
            
            //check if hotspot has been deleted from an image associated with the event
            var hotspotIds = dojo.map(tempInspectionData.hotspots[getImageById(image).resourceId], function(h) { return h.id; });
            var rollBackHotspots = rollbackInspectionData.hotspots[image];
            dojo.forEach(rollBackHotspots, function(hotspot) {
                if (dojo.indexOf(hotspotIds, hotspot.id) == -1) {
                    console.log('removing existing hotspot from warehouse that has been deleted in viewer...');
                    var imageObject = getImageById(image);
                    var hotspotIndex = getIndexByValueFromJsonArray(hotspot.id, 'id', imageObject.polys);
                    imageObject.polys.splice(hotspotIndex,1); 
                    
                    var deleteInspectionEventResourceDeferred = dojo.xhrDelete({
                        url: serviceApiUrl + 'inspectionEventResource/' + hotspot.inspectionEventResourceId,
                        handleAs: "json",
                        headers: {
                            "Content-Type": "application/json",
							"Authorization": "Bearer " + accessToken
                        }
                    });
                    removeSiteDataInspectionEventResource(hotspot.inspectionEventResourceId);
                    inspectionEventDeferreds.push(deleteInspectionEventResourceDeferred);
                }
            });
        })

        var resourceDeferredList = new dojo.DeferredList(inspectionEventDeferreds)
        resourceDeferredList.then(function(results) {
            saveInspectionEvent(id);
            /* results.shift();
            dojo.forEach(results, function(result) {
                if (result[1].id) {
                    var inspectionEventResource = result[1];
                    var inspectionEventResourcePolygon = _.first(inspectionEventResource.polygons);
                    var resource = { 
                        "id": inspectionEventResourcePolygon.id,
                        "inspectionEventResourceId": inspectionEventResource.id,
                        "inspectionEventId": inspectionEventResource.inspectionEventId,
                        "resourceId": inspectionEventResource.resourceId,
                        "name": inspectionEventResourcePolygon.name,
                        "severity": inspectionEventResourcePolygon.severity,
                        "x": null,
                        "y": null,
                        "polygonPts": null
                    }
                    if (inspectionEventResourcePolygon.geometry) {
                        resource.x = inspectionEventResourcePolygon.center.x;
                        resource.y = inspectionEventResourcePolygon.center.y;
                        resource.polygonPts = inspectionEventResourcePolygon.geometry;
                    }
                    saveHotspot(resource);
                }
            }) */
            
            if (exit) {
                disableZoomifyAnnotationDisplay(true);
                dijit.byId('inspectionEventTypeDropdown').set('disabled', false);
                inspectorEvent = null;
                
                Z.Viewport.saveEditsLabel(false);
                Z.editing = null;
                Z.labelMode = "view";
                
                dojo.style('zoomify-edit-mode', 'display', 'none');
                dojo.byId('edit-mode').innerHTML = 'View';
                dojo.byId('shape-mode').innerHTML = '';
                dojo.style("zoomify-edit-mode", {
                    left: dojo.style("ViewerDisplay", "width")/2 - dojo.getMarginBox("zoomify-edit-mode").w/2 + "px"
                });
                showZoomifyAnnotationRequiredFieldLabels(false);
            }
            
            dojo.style('hotspotDisplay', 'cursor', 'pointer'); //change cursor in zoomify viewer after finished digitizing a polygon
            updateSiteViewerAndFeatureLayerRecords();
        });
    }
}

function deleteInspectionEvent() {
    var getInspectionEventResourcesDeferred = dojo.xhrPost({
        url: serviceApiUrl + 'inspectionEventResource/search',
        handleAs: "json",
        headers: {
            "Content-Type": "application/json",
			"Authorization": "Bearer " + accessToken
        },
        postData: '{ "inspectionEventId": "' + tempInspectionData.id + '" }'
    });
    getInspectionEventResourcesDeferred.then(function(results){
        var inspectionEventDeferreds = [];
        var deleteInspectionEventDeferred = dojo.xhrDelete({
            url: serviceApiUrl + 'inspectionEvent/' + tempInspectionData.id,
            handleAs: "json",
            headers: {
                "Content-Type": "application/json",
				"Authorization": "Bearer " + accessToken
            }
        });
        removeSiteDataInspectionEvent(tempInspectionData.id);
        inspectionEventDeferreds.push(deleteInspectionEventDeferred);
        
        dojo.forEach(results, function(inspectionEventResource){
            var deleteInspectionEventResourceDeferred = dojo.xhrDelete({
                url: serviceApiUrl + 'inspectionEventResource/' + inspectionEventResource.id,
                handleAs: "json",
                headers: {
                    "Content-Type": "application/json",
					"Authorization": "Bearer " + accessToken
                }
            });
            removeSiteDataInspectionEventResource(inspectionEventResource.id);
            inspectionEventDeferreds.push(deleteInspectionEventResourceDeferred);
        })
        var resourceDeferredList = new dojo.DeferredList(inspectionEventDeferreds);
        resourceDeferredList.then(function(results) {
            var hotspots = getCurrentImageHotspotForInspectionEvent();
            if (hotspots) {
                dojo.forEach(hotspots, function(hotspot) {
                    if (hotspot.geometry){
                        deleteHotspotFromViewer(hotspot.id);
                    }
                });
            }
            
            var inspectionEventId = dijit.byId('inspectionEventTypeDropdown').get('value');
            dojo.forEach(tempInspectionData.images, function(imageId){
                var image = getImageById(imageId);
                var hotspots = getImageHotspotForInspectionEvent(imageId, inspectionEventId);
                dojo.forEach(hotspots, function(hotspot){
                    var hotspotIndex = getIndexByValueFromJsonArray(hotspot.id, 'id', image.polys);
                    if (hotspotIndex >= 0) {
                        image.polys.splice(hotspotIndex,1);
                        var severity = dojo.map(image.polys, function(poly){
                            return poly.severity;
                        });
                        //var gridNodeSeverity = (severity.length > 0) ? _.max(severity) : 0;
                        //rollbackOverviewGridSeverity(imageId, gridNodeSeverity);
                    }
                })
            });
            
            dojo.forEach(rollbackInspectionData.images, function(imageId){
                var image = getImageById(imageId);
                var hotspots = getImageHotspotForInspectionEvent(imageId, inspectionEventId);
                dojo.forEach(hotspots, function(hotspot){
                    var hotspotIndex = getIndexByValueFromJsonArray(hotsot.id, 'id', image.polys);
                    if (hotspotIndex >= 0) {
                        image.polys.splice(hotspotIndex,1);
                        var severity = dojo.map(image.polys, function(poly){
                            return poly.severity;
                        });
                        //var gridNodeSeverity = (severity.length > 0) ? _.max(severity) : 0;
                        //rollbackOverviewGridSeverity(imageId, gridNodeSeverity);
                    }
                })
            });
            
            updateInspectionEventTypeDropdown(inspectionEventId);
            resetZoomifyAnnotationDisplay();
            disableZoomifyAnnotationDisplay(true);
            showZoomifyAnnotationRequiredFieldLabels(false);
            dijit.byId('inspectionEventTypeDropdown').set('disabled', false);
            var i = getIndexByValueFromJsonArray(inspectionEventId, 'id', assetInspectionEventsData);
            assetInspectionEventsData.splice(i,1);
            
            Z.editing = null;
            Z.labelMode = 'view';
            Z.Viewport.setEditModeLabel("view");
            inspectorEvent = null;
            dojo.style('hotspotDisplay', 'cursor', 'pointer'); //change cursor in zoomify viewer after finished digitizing a polygon
			
            confirmInspectionEventDelete.hide();
			
			window.setTimeout(function() {
				updateSiteViewerAndFeatureLayerRecords();
			}, 1000);
        });
    })
    
    dojo.style('zoomify-edit-mode', 'display', 'none');
    dojo.byId('edit-mode').innerHTML = 'View';
    dojo.byId('shape-mode').innerHTML = '';
    dojo.style("zoomify-edit-mode", {
        left: dojo.style("ViewerDisplay", "width")/2 + dojo.style(dojo.query(".lSPager.lSGallery")[0], "width") - dojo.getMarginBox("zoomify-edit-mode").w/2 + "px"
    });
}

function updateSiteDataInspectionEvent(inspectionEvent){
    var inspectionEventId = inspectionEvent.id;
    var asset = _.findWhere(siteData[siteId].workOrders[workOrderNumber].summary.data, { "id" : turbineId } );      
    
	if (asset.assetInspection.inspectionEvents.events.length > 0) {
		var assetInspectionEvent = _.findWhere(asset.assetInspection.inspectionEvents.events, { "id" : inspectionEventId } ); 
        if (!_.isUndefined(assetInspectionEvent)){
            assetInspectionEvent = inspectionEvent;
        } else {
            asset.assetInspection.inspectionEvents.events.push(inspectionEvent);
        }
    } else {
        asset.assetInspection.inspectionEvents.events.push(inspectionEvent);
    }
	var severityValues = dojo.map(asset.assetInspection.inspectionEvents.events, function(event) { return event.severity });
    asset.assetInspection.severityValues = severityValues;
	asset.assetInspection.severityMax = (severityValues.length > 0) ? _.max(severityValues) : 0;
	asset.assetInspection.severity = asset.severityMax;
}

function updateSiteDataInspectionEventResource(inspectionEventResource){
    var inspectionEventResourceId = inspectionEventResource.id;
    var asset = _.findWhere(siteData[siteId].workOrders[workOrderNumber].summary.data, { "id" : turbineId });
    if (asset.assetInspection.inspectionEventResources.polys.length > 0 ) {
        var i = getIndexByValueFromJsonArray(inspectionEventResourceId, 'id', asset.assetInspection.inspectionEventResources.polys);
        if (i > -1){
            asset.assetInspection.inspectionEventResources.polys[i] = inspectionEventResource;
        } else {
            asset.assetInspection.inspectionEventResources.polys.push(inspectionEventResource);
        }
    } else {
        asset.assetInspection.inspectionEventResources.polys.push(inspectionEventResource);
    }
}

function removeSiteDataInspectionEvent(inspectionEventId) {
   var asset = _.findWhere(siteData[siteId].workOrders[workOrderNumber].summary.data, { "id" : turbineId });
   var i = getIndexByValueFromJsonArray(inspectionEventId, 'id', asset.assetInspection.inspectionEvents.events);
   asset.assetInspection.inspectionEvents.events.splice(i,1);
   asset.assetInspection.severityValues.splice(i,1)
   asset.assetInspection.severityMax = _.max(asset.assetInspection.severityValues);
   asset.assetInspection.severity = _.max(asset.assetInspection.severityValues);
}

function removeSiteDataInspectionEventResource(inspectionEventResourceId){
   var asset = _.findWhere(siteData[siteId].workOrders[workOrderNumber].summary.data, { "id" : turbineId });
   var i = getIndexByValueFromJsonArray(inspectionEventResourceId, 'id', asset.assetInspection.inspectionEventResources.polys);
   asset.assetInspection.inspectionEventResources.polys.splice(i,1);
}

function updateSiteViewerAndFeatureLayerRecords(){
	var data = {
		"siteId": siteId,
		"assetId": turbineId,
		"orderNumber": workOrderNumber
	};
	
	var inspectionEventDeferred = dojo.xhrPost({
		url: serviceApiUrl + "inspectionEvent/search",
		handleAs: "json",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + accessToken
		},
		postData: JSON.stringify(data),
		load: function(response) {
			var inspectionEvents = response;
            var assets = siteData[siteId].workOrders[workOrderNumber].summary.data;
			var asset = _.findWhere(assets, { "id" : turbineId} );
			
			if (inspectionEvents.length > 0) {
				var severityValues = dojo.map(inspectionEvents, function(inspectionEvent){ return inspectionEvent.severity; });
				asset.assetInspection.severityValues = severityValues;
				asset.assetInspection.severityMax = _.max(severityValues);
				asset.assetInspection.severity = asset.assetInspection.severityMax;
				//asset.assetInspection.inspectionEvents.loaded = true;	
				//asset.assetInspection.inspectionEvents.events = inspectionEvents;	
				var criticality = asset.assetInspection.severityMax;
			} else {
				asset.assetInspection.severityValues = [];
				asset.assetInspection.severityMax = null;
				asset.assetInspection.severity = null;
				var criticality = "NA";
			}
			var feature = _.first(dojo.filter(windFeatureLayer.graphics, function(graphic) { return graphic.attributes['uniqueId'] == turbineId }));
			feature.attributes["criticality"] = criticality;
			//feature.attributes["InspectionEvents"] = asset.assetInspection.inspectionEvents.events.length;
			
			setSymbologyForFeature(feature, true);
			
			var index = (dijit.byId("transmissionViewerGrid")) ? dijit.byId("transmissionViewerGrid").selection.selectedIndex : -1;
			if (index >= 0) {
				var item = dijit.byId("transmissionViewerGrid").getItem(index);
				var store = dijit.byId("transmissionViewerGrid").store;
				var contents = '<div class="blade_viewer_tool"><div class="grid_circle blade_viewer_row" style="background:' + appConfig["TransmissionLine"][authUserOrgKey].colors[criticality] + ';">i</div></div>';
				
				// Update store values for fields, if changing table (fields of field names) must change these accordingly
				store.setValue(item,"criticality", criticality);
				store.setValue(item," ", contents);
				//store.setValue(item,"Records", asset.assetInspection.inspectionEvents.events.length);
				store.save();
			}
			if (dijit.byId("transmissionViewerGrid")) {
				dijit.byId("transmissionViewerGrid").update();
			}
			
			//var view = (dojo.style("siteViewerOuterContent", "display") == "block") ? "site" : "inspection";
			/* if (view == "site") {
				if (dojo.byId("datagrid-" + turbineId)) {
					dojo.style("datagrid-" + turbineId, "backgroundColor", severityColors[asset.severityMax]);
				}
				populateSiteViewerFilterDropdown(assets);
			} */
						
			var node = dojo.byId("pole-criticality");
			dojo.style(node, "backgroundColor",  appConfig["TransmissionLine"][authUserOrgKey].colors[criticality]);
			
			summarizeCriticality();
		},
		error: function(error){
			console.log(error);
            dojo.byId("dataWarehouseErrorContent").innerHTML = "Error retrieving inspection events from the server. <br>" + error.message;
            dijit.byId("dataWarehouseError").show();
		}
	});    
}

function populateInspectionEventsDropdown() {
	if (dijit.byId('inspectionEventTypeDropdown')) {
		var inspectionEventOptions = [{ label: "--", value: "" }];
		var tab = dojo.query("#transmissionToggleButtons .btn.active")[0].value;
		var inspectionEvents = dojo.filter(assetInspectionEventsData, function(evt) { return evt.source == tab });
		
		if (inspectionEvents.length > 0) {
			inspectionEvents.sort(byEventName);
			dojo.forEach(inspectionEvents, function(obj){
				var name = obj.name;
				var value = obj.id;
				inspectionEventOptions.push({ label: name, value: value });
			});
			dijit.byId('inspectionEventTypeDropdown').set('options', inspectionEventOptions);
			dijit.byId('inspectionEventTypeDropdown').set('value', inspectionEvents[0].id);
		} else {
			dijit.byId('inspectionEventTypeDropdown').set('options', inspectionEventOptions);
			dijit.byId('inspectionEventTypeDropdown').set('value', '');
		}
	}
}

function updateInspectionEventTypeDropdown(id) {
	var options = dijit.byId('inspectionEventTypeDropdown').get('options');
	var i = getIndexByValueFromJsonArray(id, 'value', options);
	options.splice(i,1);
	dijit.byId('inspectionEventTypeDropdown').set('options', options);
	dijit.byId('inspectionEventTypeDropdown').set('value', '');
}

function createInspectionEventHotspotFromParameters(inId, name, inspectionEventId, imageId, geometry) {
	var hotSpotColors = appConfig["TransmissionLine"][authUserOrgKey].colors;
	var id = inId;
	var name = name;
	var inspectionEventResourceId = null;
	var severity = dijit.byId('severityScoreSlider').get('value');
	var mediaType = "polygon"; //add ability to use rectangle
	var media = "polygon";
	var audio = null;
	var x = -1000;
	var y = -1000;
	var zoom = 20;
	var xScale = 100;
	var yScale = 100;
    var radius = 10;
	//var url = null;
    var zMin = 0;
    var zMax = 0;
    var clickURL = "";
	var urlTarget = "_blank";
	var rollover = true;
	var caption = name;
	var tooltip = caption;
	var textColor = "#FFFFFF";
	var backColor = "#000000";
	var lineColor = hotSpotColors[severity];
	var fillColor = hotSpotColors[severity];
	var textVisible = true;
	var backVisible = true;
	var lineVisible = true;
	var fillVisible = true;
	var captionPosition = "5";
	var saved = "0";
	var internalID = null;
	var poiID = "0";
	var captionHTML = "";
	var tooltipHTML = "";
	var polyClosed = "0";
	var polygonPts = null;
	var geometry = (geometry) ? [] : polygonPts;
	var showFor = "0";
	var transition = null;
	var changeFor = "0";
	var rotation = 0;
    var editable = null;
    var popup = null;
    var popupOffsetX = 0;
    var popupOffsetY = 0;
    var comment = "";
    var user = authUser;
    var date = currentDate;

	//Z.Viewport.createHotspotFromParameters(id, name, mediaType, media, audio, x, y, zoom, xScale, yScale, url, urlTarget, rollover, caption, tooltip, textColor, backColor, lineColor, fillColor, textVisible, backVisible, lineVisible, fillVisible, captionPosition, saved, internalID, poiID, captionHTML, tooltipHTML, polyClosed, polygonPts, showFor, transition, changeFor, rotation);
    
    Z.Viewport.createHotspotFromParameters(id, name, mediaType, media, audio, x, y, zoom, xScale, yScale, radius, zMin, zMax, clickURL, urlTarget, rollover, caption, tooltip, textColor, backColor, lineColor, fillColor, textVisible, backVisible, lineVisible, fillVisible, captionPosition, saved, internalID, poiID, captionHTML, tooltipHTML, polyClosed, polygonPts, showFor, transition, changeFor, rotation, editable, popup, popupOffsetX, popupOffsetY, comment, user, date);
	
	Z.Viewport.modifyHotspot(id, 'date', currentDate, true, false);
	Z.Viewport.modifyHotspot(id, 'user', authUser, true, false);
	Z.Viewport.modifyHotspot(id, 'polygonPts', null, true, false);
	
	createInspectionEventHotspotForImage(id, name, inspectionEventId, inspectionEventResourceId, severity, x, y, geometry, imageId);
}

function createInspectionEventHotspotForImage(id, name, inspectionEventId, inspectionEventResourceId, severity, x, y, geometry, imageId){
    if (dojo.indexOf(tempInspectionData.images, imageId) == -1) {
        addImageToInspectionEvent();
        highlightInspectionEventImage();
    }
    
    var hotspot = {
		id: id,
		name: name,
		inspectionEventId: inspectionEventId,
		inspectionEventResourceId: inspectionEventResourceId,
		severity: severity,
		center: { X: x, Y: y },  
		geometry: geometry
	}
	
	var image = getImageById(imageId);
	var imagePolys = dojo.filter(image.polys, function(poly){ return poly.id == id }); 
	if (imagePolys.length == 0) {
		image.polys.push(hotspot);
	}
    
    var imagePolys = dojo.filter(tempInspectionData.hotspots[image.resourceId], function(poly){ return poly.id == id }); 
	if (imagePolys.length == 0) {
        if (_.isUndefined(tempInspectionData.hotspots[image.resourceId])) {
            tempInspectionData.hotspots[image.resourceId] = [];
        }
        tempInspectionData.hotspots[image.resourceId].push(hotspot);
	}
	
	var asset = _.findWhere(siteData[siteId].workOrders[workOrderNumber].summary.data, { "id": turbineId });
	asset.assetInspection.inspectionEventResources.polys.push(hotspot);
}

function saveInspectionEvent(id) {
	var inspectionEvent = getInspectionEventById(id);
	inspectionEvent.assetId = tempInspectionData.assetId;
	inspectionEvent.findingType = tempInspectionData.findingType; 
	inspectionEvent.position = tempInspectionData.position;
	inspectionEvent.severity = tempInspectionData.severity;
	inspectionEvent.images = tempInspectionData.images;
	inspectionEvent.comment = tempInspectionData.comment;
	inspectionEvent.user = tempInspectionData.user;
	inspectionEvent.date = tempInspectionData.date;
	
	var severity = tempInspectionData.severity;
	dojo.forEach(dojo.query("div .imageInspectionEvent"), function(node){
		var imageId = dojo.attr(node.id, "data-event-image-id");
		var image = getImageById(imageId);
		value = (image.polys.length > 0) ? _.max(dojo.map(image.polys, function(poly){ return poly.severity; })) : 0;
		severity = (severity > value) ? severity : value;
	});
	
	/* var node = dojo.byId("pole-criticality");
	dojo.style(node, "backgroundColor",  transmissionSeverityColors[severity]); */
	
	var asset = _.findWhere(siteData[siteId].workOrders[workOrderNumber].summary.data, { id: inspectionEvent.assetId });
	var severityValues = dojo.map(asset.assetInspection.inspectionEvents.event, function(inspectionEvent){ return inspectionEvent.severity; });
	asset.assetInspection.severityValues = severityValues;
	asset.assetInspection.severityMax = severity;
}

function saveHotspot(hotspot) {
	var poly = getImageHotspotById(hotspot.id);
	if (!poly) {
		createInspectionEventHotspotForImage(hotspot.id, hotspot.name, hotspot.inspectionEventId, hotspot.inspectionEventResourceId, hotspot.severity, null, null, null, hotspot.resourceId)
	}
	poly.inspectionEventResourceId = hotspot.inspectionEventResourceId;
	poly.severity = hotspot.severity;
	if (hotspot.polygonPts) {
		poly.center = { X: hotspot.x, Y: hotspot.y };
		poly.geometry = dojo.map(hotspot.polygonPts, function(point){
				return { X: point.x, Y: point.y }
		});
	}
	
	var asset = _.findWhere(siteData[siteId].workOrders[workOrderNumber].summary.data, { id: turbineId });
	var inspectionPoly = _.findWhere(asset.assetInspection.inspectionEventResources.polys, { "id": hotspot.id });
	inspectionPoly.inspectionEventResourceId = hotspot.inspectionEventResourceId;
	inspectionPoly.severity = hotspot.severity;
	if (hotspot.polygonPts) {
		inspectionPoly.center = { X: hotspot.x, Y: hotspot.y };
		inspectionPoly.geometry = dojo.map(hotspot.polygonPts, function(point){
				return { X: point.x, Y: point.y }
		});
	}
	
}

function saveInspectionEventDataToWarehouse(data, url, status) {
	switch(status){
		case 'addEvent':
			var deferred = dojo.xhrPut({
				url: serviceApiUrl + url,
				handleAs: "json",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + accessToken
				},
				putData: data,
				load: function(response) {
					return response;
				},
				error: function(error){
					console.log(error);
                    dojo.byId("dataWarehouseErrorContent").innerHTML = "Error saving inspection event to the server. <br>" + error.message;
                    dijit.byId("dataWarehouseError").show();
					return error;
				}
			})
			break;
		case 'modifyEvent':
			var deferred = dojo.xhrPost({
				url: serviceApiUrl + url,
				handleAs: "json",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + accessToken
				},
				postData: data,
				load: function(response) {
					return response;
				},
				error: function(error){
					console.log(error);
                    dojo.byId("dataWarehouseErrorContent").innerHTML = "Error saving inspection event to the server. <br>" + error.message;
                    dijit.byId("dataWarehouseError").show();
					return error;
				}
			})
			break;
	}
	return deferred;
}

function deleteHotspotFromInspectionEvent(target, hotspot){
	var name = (target.title) ? target.title : target.innerHTML;
	if (name == tempInspectionData.name) {
		deleteHotspotFromInspectionEventImage(hotspot);
	}
}

function deleteHotspotFromInspectionEventImage(hotspot){
	var image = getCurrentImage();
	var imageIndex = dojo.indexOf(tempInspectionData.images, image.resourceId)
    if(imageIndex > -1) {
        tempInspectionData.images.splice(imageIndex,1);
    }
	
	var hotspotIndex = getIndexByValueFromJsonArray(hotspot.id, 'id', image.polys);
	image.polys.splice(hotspotIndex,1);
    
	// add variable to hold on to inspectionEventResources that should be deleted on save if removed using this function
    var hotspotIndex = getIndexByValueFromJsonArray(hotspot.id, 'id', tempInspectionData.hotspots[image.resourceId]);
	tempInspectionData.hotspots[image.resourceId].splice(hotspotIndex,1);
	tempInspectionData.resourcesToDelete.push(hotspot.inspectionEventResourceId);

	deleteHotspotFromViewer(hotspot.id);
	Z.Viewport.saveEditsLabel(false);

	populateInspectionEventImages(tempInspectionData.images);
}

function deleteHotspotFromViewer(id){
	Z.Viewport.setCurrentHotspot(id);
    var currentLabel = Z.Viewport.getCurrentLabel();
	/* var labels = Z.Viewport.getLabelListDP();
	if (labels.length > 0) {
		var value = dojo.filter(labels, function(label){ return label.text == currentLabel.name; })[0].value;
	} else {
		var value = currentLabel.internalID;
	} */
	if (!_.isNull(currentLabel)) {
		var value = currentLabel.internalID;
		Z.Viewport.deleteLabel(value, true);
	}
}

function rollbackZoomifyAnnotationDisplay() {
	var hotSpotColors = appConfig["TransmissionLine"][authUserOrgKey].colors;
	var data = rollbackInspectionData;
	
	dijit.byId('damageTypeDropdown').set('value', data.damageType);
	window.setTimeout(function(){
		dijit.byId('findingTypeDropdown').set('value', data.findingType);
	}, 150);
	dijit.byId('surfaceTypeDropdown').set('value', data.surfaceType);
	dijit.byId('severityScoreSlider').set('value',  data.severity);
    
	populateInspectionEventImages(data.images);

	dijit.byId('commentTextBox').set('value', data.comment);
	dijit.byId('sizeX').set('value', data.size.X);
	dijit.byId('sizeY').set('value', data.size.Y);
	dijit.byId('rootDistance').set('value', data.location.root);
	dijit.byId('leDistance').set('value', data.location.le);
	dijit.byId('userTextBox').set('value', data.user);
	dijit.byId('dateTextBox').set('value', data.date);
    
    //rollback hotspots on images
    dojo.forEach(tempInspectionData.images, function(imageId) {
        var image = getImageById(imageId);
        if (dojo.indexOf(data.images, imageId) > -1) {
            
            var rollBackHotspots = data.hotspots[imageId];
            var rollBackHotspotIds = dojo.map(rollBackHotspots, function(h) { return h.id; });
            
            dojo.forEach(dojo.clone(image.polys), function(hotspot) {
                var rollBackIndex = dojo.indexOf(rollBackHotspotIds, hotspot.id);
                if (rollBackIndex > -1) {
                    var rollBackHotspot = rollBackHotspots[rollBackIndex];
                    
                    console.log('rollback existing hotspot...')
                    if (image.id == getCurrentImage().id) {
                        Z.Viewport.modifyHotspot(hotspot.id, 'X', rollBackHotspot.center.X, true, false);
                        Z.Viewport.modifyHotspot(hotspot.id, 'Y', rollBackHotspot.center.Y, true, false);
                        Z.Viewport.modifyHotspot(hotspot.id, 'lineColor', hotSpotColors[rollBackHotspot.severity], true, false);
                        Z.Viewport.modifyHotspot(hotspot.id, 'fillColor', hotSpotColors[rollBackHotspot.severity], true, false);
                        var geometry = dojo.map(rollBackHotspot.geometry, function(pt){
                            return { 'x': pt.X, 'y': pt.Y}
                        })
                        Z.Viewport.modifyHotspot(hotspot.id, 'polygonPts', geometry, true, false);
                    }
                    
                } else {
                    var hotstpotIndex = getIndexByValueFromJsonArray(hotspot.id, 'id', image.polys);
                    image.polys.splice(hotstpotIndex,1);
                    
                    console.log('removing new hotspot from existing image...')
                    if (image.id == getCurrentImage().id) {
                        Z.Viewport.setCurrentHotspot(hotspot.id);
                        var currentLabel = Z.Viewport.getCurrentLabel();
                        var value = currentLabel.internalID;
                        Z.Viewport.deleteLabel(value, true);
                        Z.Viewport.saveEditsLabel(false);
                    }
                }
            });
            
        } else {
            var hotspotIds = dojo.map(image.polys, function(h) { return h.id; });
            dojo.forEach(hotspotIds, function(hotspotId) {
                var hotstpotIndex = getIndexByValueFromJsonArray(hotspotId, 'id', image.polys);
                image.polys.splice(hotstpotIndex,1);
                
                console.log('removing new hotspot from new image...');
                if (image.id == getCurrentImage().id) {
                    Z.Viewport.setCurrentHotspot(hotspotId);
                    var currentLabel = Z.Viewport.getCurrentLabel();
                    var value = currentLabel.internalID;
                    Z.Viewport.deleteLabel(value, true);
                    Z.Viewport.saveEditsLabel(false);
                }
            })

        }
        
    })
    
    //delay to allow hotspot rollback to complete
    window.setTimeout(function(){
        dojo.forEach(tempInspectionData.images, function(imageId){
            var image = getImageById(imageId);
            var severity = dojo.map(image.polys, function(poly){
                return poly.severity;
            });
            var gridNodeSeverity = (severity.length > 0) ? _.max(severity) : 0;
            //rollbackOverviewGridSeverity(imageId, gridNodeSeverity);
        });
    }, 500);
	
	/* var params = Z.parameters;
	var image = getCurrentImage();
	var data = getAnnotationObjects(image);
	var annotationObjects = makeAnnotationObjects(data);
	params['zAnnotationJSONObject'] = annotationObjects;
	Z.Viewer.setImage(Z.imagePath, params);
            
    //delay to allow zoomify viewer to load image; hack to load annotations in the viewer since setImage does not load them even though passed as params to the call; insert full view inspector into zoomify ViewerDisplay
    window.setTimeout(function(){
        var xmlText = Z.Utils.jsonConvertObjectToXMLText(Z.annotationJSONObject);
        var xmlDoc = Z.Utils.xmlConvertTextToDoc(xmlText);
        Z.Viewport.parseAnnotationsXML(xmlDoc);
        dojo.place("zoomify-inspector", "ViewerDisplay","last");
        dojo.place("zoomify-overview", "ViewerDisplay","last");
    }, 1000); */
}

function rollbackOverviewGridSeverity(imageId, gridNodeSeverity){
	var hotSpotColors = appConfig["TransmissionLine"][authUserOrgKey].colors;
	var gridNodeId = _.first(dojo.query("div[data-grid-image-id='" + imageId + "']"));;
	dojo.style(gridNodeId, "backgroundColor",  hotSpotColors[gridNodeSeverity]);
	if (imageId !== getCurrentImage().resourceId) {
		dojo.style(gridNodeId, "borderColor",  hotSpotColorss[gridNodeSeverity]);
	}
	dojo.attr(gridNodeId, "data-grid-severity", gridNodeSeverity);
}

function rollbackCurrentLabel(id) {
	var hotSpotColors = appConfig["TransmissionLine"][authUserOrgKey].colors;
	var data = getImageHotspotById(id);
	if (data) {
		Z.Viewport.modifyHotspot(id, 'X', data.center.X, true, false);
		Z.Viewport.modifyHotspot(id, 'Y', data.center.Y, true, false);
		Z.Viewport.modifyHotspot(id, 'lineColor', hotSpotColors[data.severity], true, false);
		Z.Viewport.modifyHotspot(id, 'fillColor', hotSpotColors[data.severity], true, false);
		var geometry = dojo.map(data.geometry, function(pt){
			return { 'x': pt.X, 'y': pt.Y}
		})
		Z.Viewport.modifyHotspot(id, 'polygonPts', geometry, true, false);
	}
};

function updateZoomifyFindingTypeDropdown(input) {
	 if (input == "") {
		dijit.byId('findingTypeDropdown').set('options', [{ label: " -- ", value: "" }]);
		dijit.byId('findingTypeDropdown').set('value', "");
	 } else {
		var options = (authUserOrg.key == "Vestas") ? findingTypeOptions : findingTypeOptionsMap[input];
		dijit.byId('findingTypeDropdown').set('options', options);
		dijit.byId('findingTypeDropdown').set('value', options[0].value);
	}
}

function showZoomifyAnnotationRequiredFieldLabels(editing){
    /* if (editing){
        dojo.byId("damageTypeRowLabel").innerHTML = "Observation Type<span class='required'> * </span>:";
        dojo.byId("findingTypeRowLabel").innerHTML = "Finding Type<span class='required'> * </span>:";
        dojo.byId("surfaceTypeRowLabel").innerHTML = "Surface<span class='required'> * </span>:";  
    } else {
        dojo.byId("damageTypeRowLabel").innerHTML = "Observation Type:";
        dojo.byId("findingTypeRowLabel").innerHTML = "Finding Type:";
        dojo.byId("surfaceTypeRowLabel").innerHTML = "Surface:"; 
    } */
}

function checkInspectionEventFields(){
    var check = true;
    /* if (dijit.byId('findingTypeDropdown').get('value') == "") {
        check = false;
        dojo.addClass(dojo.byId("findingTypeDropdown"), "highlightInspectionEventField");
        dojo.addClass(dojo.byId("findingTypeRowLabel"), "highlightInspectionEventLabel");
    }
    if (dijit.byId('positionTypeDropdown').get('value') == "") {
        check = false;
        dojo.addClass(dojo.byId("positionTypeDropdown"), "highlightInspectionEventField");
        dojo.addClass(dojo.byId("positionTypeRowLabel"), "highlightInspectionEventLabel");
    } */
    return check;
}

function clearInspectionEventFieldHighlight(name) {
    dojo.removeClass(dojo.byId(name + "TypeDropdown"), "highlightInspectionEventField");
    dojo.removeClass(dojo.byId(name + "TypeRowLabel"), "highlightInspectionEventLabel");
}

function resetZoomifyAnnotationDisplay(){
	dojo.byId('inspectionDateRow').innerHTML = '';
	dijit.byId('findingTypeDropdown').set('value', '');
	dijit.byId('positionTypeDropdown').set('value', '');
	dijit.byId('severityScoreSlider').set('value', 1);
	clearInspectionEventImages();
	dijit.byId('commentTextBox').set('value', '');
}

function disableZoomifyAnnotationDisplay(show){
	dijit.byId('findingTypeDropdown').set('disabled', show);
	dijit.byId('positionTypeDropdown').set('disabled', show);
	dijit.byId('severityScoreSlider').set('disabled', show);
	dijit.byId('commentTextBox').set('disabled', show);
    
    setAnnotationToolDisplay('digitizePolygon', (show) ? false : true);
    setAnnotationToolDisplay('cancelPolygon', (show) ? false : true);
    setAnnotationToolDisplay('savePolygon', (show) ? false : true);
	setAnnotationToolDisplay('removePolygon', (show) ? false : true);
	
	if (dijit.byId("inspectionEventTypeDropdown").get("value") == "") {
		setAnnotationToolDisplay('modifyPolygon', (show) ? false : true);
	}
}

function setAnnotationToolDisplay(tool, show) {
    var backgroundColor = (show) ? '#888888' : '#aaaaaa';
    var borderColor = (show) ? '#666666' : '#aaaaaa';
    var gradient = "linear-gradient(top, #888888, #666666)";
    var linearGradient = (dojo.isFF) ? "-moz-" + gradient : (dojo.isChrome || dojo.isSafari || dojo.isOpera) ? "-webkit-" + gradient : (dojo.isIE) ? "-ms-" + gradient : gradient;
    var backgroundImage = _.first(dojo.style(tool, 'backgroundImage').split(', '));
    backgroundImage = (show) ? backgroundImage + ', ' + linearGradient :  backgroundImage;
    
    dojo.style(tool, { 
        'backgroundColor': backgroundColor,
        'borderColor': borderColor,
        'backgroundImage': backgroundImage
    });
	
	dojo.attr(dojo.byId(tool), 'data-enabled', show);
}

function closeZoomifyAnnotationDisplay() {
	if (dijit.byId("inspectionEventTypeDropdown")) {
		dijit.byId('inspectionEventTypeDropdown').set('value', '');
		resetZoomifyAnnotationDisplay();
		disableZoomifyAnnotationDisplay(true);
	}
    dojo.style('bladeViewer', 'width', '610px');
	dojo.style('bladeViewerOuterContent', 'width', '610px');
	dojo.style('bladeInspectorPanel', 'display', 'none');
	dijit.byId("enableBladeInspector").set('label', "Show Inspector");
	
	var api = $('#bladeViewerOuterContent').data("jsp");
	api.reinitialise();
}

function getIndexByValueFromJsonArray(value, property, array) {
	var values = dojo.map(array, function(obj){
		return obj[property];
	});
	return dojo.indexOf(values, value);
}

function advanceToNextZoomifyBladeImage(id){
	if (Z.editing === 'addLabel' || Z.editing === 'editLabel') {
		var hotspot = Z.Viewport.getCurrentLabel();
		if (hotspot) {
			var hotspotId = hotspot.id;
			Z.Viewport.modifyHotspot(hotspotId, 'zoom', 20, true, false);
			Z.Viewport.saveEditsLabel(false);
			var poly = getImageHotspotById(hotspotId);
			poly.severity = tempInspectionData.severity
			poly.center = { X: hotspot.x, Y: hotspot.y };
			poly.geometry = dojo.map(hotspot.polygonPts, function(point){
					return { X: point.x, Y: point.y }
			});
		}
	}
}

function addImageToInspectionEvent(){
	var imageId = dojo.attr(dojo.byId("zoomify"), "data-active-image-id");
	if (!dojo.byId(imageId)) {
		tempInspectionData.images.push(imageId);
		tempInspectionData.images = _.uniq(tempInspectionData.images)
		populateInspectionEventImages(tempInspectionData.images);
	}
}

function removeImageFromInspectionEvent(){
	var imageId = dojo.attr(dojo.byId("zoomify"), "data-active-image-id");
	if (dojo.byId(imageId)) {
		dojo.destroy(dojo.byId(imageId));
		var i = dojo.indexOf(tempInspectionData.images, imageId);
		if (i > -1) {
            tempInspectionData.images.splice(i,1);
        }
		
		var image = getImageById(imageId);
		var id = convertToInspectionEventHotspotId(tempInspectionData.id, imageId);
        var hotspots = getImageHotspotForInspectionEvent(imageId, tempInspectionData.id);
        if (hotspots) {
            dojo.forEach(hotspots,function(hotspot){
                deleteHotspotFromInspectionEventImage(hotspot);
            })
        }
        updateInspectionEventImageContainer();
	}
}

function clickRemoveImageFromInspectionEvent(image){
	if (inspectorEvent == 'addEvent' || inspectorEvent == 'modifyEvent') {
        dojo.destroy(dojo.byId(image));
		var i = dojo.indexOf(tempInspectionData.images, image);
        if (i > -1) {
            tempInspectionData.images.splice(i,1);
        }
        updateInspectionEventImageContainer();
	}
}

function populateInspectionEventImages(imageIds) {
	clearInspectionEventImages();
	if (imageIds.length > 0) {
		var eventImages = [];
        dojo.forEach(imageIds, function(id){
			var node = _.first(dojo.query("[data-image-id=" + id + "]"));
            if (!_.isUndefined(node)) {
                eventImages.push({id: id, name: dojo.attr(node, "data-image-name") });
            }
		});
		eventImages.sort(by('name'));
        
        var currentImageId = getCurrentImage().resourceId;
		dojo.forEach(eventImages, function(image) {
            var div = dojo.create('div', {id: image.id, innerHTML: image.name, 'class': 'imageInspectionEvent'});
			dojo.byId('imageRowContainer').appendChild(div);
			dojo.attr(div, "data-event-image-id", image.id);
			dojo.attr(div, "data-event-image-name", image.name);
            if (currentImageId == image.id) { dojo.addClass(image.id,"imageActive") }
			
			dojo.connect(div, 'onclick', function(e){
				var id = this.id;
			});
		});
	}
    
    updateInspectionEventImageContainer();
}

function highlightInspectionEventImage() {
    dojo.query(".imageInspectionEvent").removeClass("imageActive");
	var gridNode = dojo.byId(getCurrentImage().resourceId);
    if (gridNode.length > 0) {
		var gridNodeId = gridNode[0].id;
		var imageId = dojo.attr(gridNodeId, "data-grid-image-id");
		if (dojo.exists(imageId)) {
			dojo.addClass(imageId, "imageActive");
		}
	}
}

function clearInspectionEventImages() {
	dojo.empty('imageRowContainer');
    updateInspectionEventImageContainer();
}

function updateInspectionEventImageContainer(){
    var api = $('#imageRowContentDiv').data("jsp");
    api.reinitialise();
    if (api.getIsScrollableV()) {
        dojo.query(".imageInspectionEvent").style("marginLeft","7px");
    } else {
        dojo.query(".imageInspectionEvent").style("marginLeft","9px");
    }
    api.reinitialise();
}

function setHotspotsVisibility() {
	var status = dojo.attr("toggle-polygons", "data-polygons-status");
	var statusUpdate = (status == "on") ? "off" : "on";
	var visible = (status == "on") ? false : true;
	
	var image = _.first(dojo.style("toggle-polygons", "backgroundImage").split("_"));
	dojo.style("toggle-polygons", "backgroundImage", image + "_" + statusUpdate + ".png");
	dojo.attr("toggle-polygons", "data-polygons-status", statusUpdate);
	
	Z.Viewport.setHotspotsVisibility(visible);
}

var by = function (name, minor) {
    return function (o, p) {
        var a, b;
        if (typeof o === 'object' && typeof p === 'object' && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return typeof minor === 'function' ? minor(o, p) : o;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        } else {
            throw {
                name: 'Error',
                message: 'Expected an object when sorting by ' + name
            };
        }
    }
};

function byArrayNumber(a,b) {
    return a - b;
}

function byObjectAltitude(a, b){
    return a.altitude - b.altitude;
}

function byObjectTimestamp(a, b){
    return a.timestamp - b.timestamp;
}

function byEventName(a, b){
	var aId = parseInt(_.last(a.name.split(" ")));
	var bId = parseInt(_.last(b.name.split(" ")));
    return aId - bId;
}

function setSeveritySliderValue(value) {
    var slider = dijit.byId("severityScoreSlider");
    var sliderValue = slider.get("value");
    if (!slider.get("disabled") && value != sliderValue) {
        slider.set("value",value);
    }
}

function toggleFullViewInspectorPanel(){
    if (dojo.style('bladeInspectorButtonDiv', 'display') == 'block') {
        var display = (dojo.style("zoomify-inspector", "display") == "none") ? "block" : "none";
        dojo.style("zoomify-inspector", "display", display);
        
        if (display == "block") {
            dojo.style('bladeViewer', 'width', '950px');
            dojo.style('bladeInspectorPanel', 'display', 'block');
            dijit.byId("enableBladeInspector").set('label', "Hide Inspector");
            
            var api = $('#zoomify-inspectorOuterContent').data("jsp");
            api.reinitialise();
            
        } else {
            dojo.style('bladeViewer', 'width', '610px');
            dojo.style('bladeInspectorPanel', 'display', 'none');
            dijit.byId("enableBladeInspector").set('label', "Show Inspector");
        }
    }
}

function toggleFullViewOverviewPanel(){
    var display = (dojo.style("zoomify-overview", "display") == "none") ? "block" : "none";
    dojo.style("zoomify-overview", "display", display);
}


function prepareZoomifyNavigation(create){
    if (create) {
        dojo.place("zoomify-up", "ViewerDisplay","last");
        dojo.place("zoomify-right", "ViewerDisplay","last");
        dojo.place("zoomify-down", "ViewerDisplay","last");
        dojo.place("zoomify-left", "ViewerDisplay","last");
        dojo.place("zoomify-loading", "ViewerDisplay","last");
    } else {
        dojo.place("zoomify-up", "zoomify","last");
        dojo.place("zoomify-right", "zoomify","last");
        dojo.place("zoomify-down", "zoomify","last");
        dojo.place("zoomify-left", "zoomify","last");
        dojo.place("zoomify-loading", "zoomify","last");
    }
}

function prepareZoomifyInspector(create){
    if (dojo.style('bladeInspectorButtonDiv', 'display') == 'block') {
		if (create) {
            dojo.place("zoomify-inspector", "ViewerDisplay","last");
            //dojo.place(tooltip, "ViewerDisplay","last");
            dojo.place("zoomifyAnnotationPanel","zoomify-inspectorContent","first");
			
			dojo.place("annotationToolsContainer","zoomifyAnnotationPanel","last");
			dojo.style('annotationToolsContainer', 'width', '300px');
			dojo.style('removePolygon', 'display', 'block');
			dojo.style('digitizePolygon', 'display', 'block');
			dojo.style('submitMoreInfoData', 'display', 'none');
			dojo.style('submitApproveMoreInfoData', 'display', 'none');

            dojo.style("zoomify-inspector", "display", dojo.style('bladeInspectorPanel', 'display'));
            dojo.place("toggle-inspector", "ViewerDisplay","last");
            dojo.style("toggle-inspector", "display", "block");
            dojo.place("zoomify-edit-mode", "ViewerDisplay","last");

            dojo.place("confirmInspectionEventDelete", "ViewerDisplay","last");
            dojo.place("confirmInspectionEventSave", "ViewerDisplay","last");
            if (dojo.query(".dijitDialogUnderlayWrapper").length > 0) {
                dojo.query(".dijitDialogUnderlayWrapper").forEach(function(node) {
                    dojo.place(node, "ViewerDisplay", "last");
                });    
            }

            var windowHeight = window.screen.height;
            var width = (windowHeight < 860) ? 357 : 345;
            var height = (windowHeight < 860) ? windowHeight - 60 : 820;
			dojo.style("zoomify-inspector", "width", width + "px");
            dojo.style("zoomify-inspectorOuterContent", "height", height + "px");
            
			var api = $('#zoomify-inspectorOuterContent').data("jsp");
			if (_.isUndefined(api)) {
                var params = {
                    verticalDragMinHeight: 48,
                    verticalDragMaxHeight: 48,
                    animateScroll: true
                };
				api = $('#zoomify-inspectorOuterContent').jScrollPane(params);
			}
			api.reinitialise();
            
        } else {
            dojo.place("zoomifyAnnotationPanel","bladeInspectorPanelInnerContent","first");
			dojo.place("annotationToolsContainer","annotationToolsDiv","last");

            dojo.place("zoomify-inspector", "zoomify","last");
            dojo.style("zoomify-inspector", { "display":"none", "top": "5px", "right": "35px" });
            dojo.place("toggle-inspector", "zoomify","last");
            dojo.style("toggle-inspector", "display", "none");
            dojo.place("zoomify-edit-mode", "zoomify","last");
            
            dojo.place("confirmInspectionEventDelete", dojo.body(), "last");
            dojo.place("confirmInspectionEventSave", dojo.body(), "last");
            if (dojo.query(".dijitDialogUnderlayWrapper").length > 0) {
                dojo.query(".dijitDialogUnderlayWrapper").forEach(function(node) {
                    dojo.place(node, dojo.body(), "last");
                });    
            }
			
			var inspectorState = dojo.style('bladeInspectorPanel', 'display');
			var moreInfoState = dojo.style('bladeMoreInfoPanel', 'display');
			
			if (moreInfoState == 'block' && inspectorState == 'block') {
				dojo.style('bladeViewer', 'width', '1280px');
			} else if ((moreInfoState == 'none' && inspectorState == 'block') || (moreInfoState == 'block' && inspectorState == 'none')) {
				dojo.style('bladeViewer', 'width', '960px');
			} else if (moreInfoState == 'none' && inspectorState == 'none') {
				dojo.style('bladeViewer', 'width', '610px');
			}
			updateToolsContainer();
			
			var api = $("#bladeViewerOuterContent").data('jsp');
			api.reinitialise();
			
        }        
	}
}

function prepareZoomifyOverview(create){
    if (create) {
        dojo.place("toggle-overview", "ViewerDisplay","last");
        dojo.place("toggle-polygons", "ViewerDisplay","last");
        dojo.place("zoomify-overview", "ViewerDisplay","last");
        //dojo.place(tooltip, "ViewerDisplay","last");
        dojo.place("bladeViewerOverviewPanelInnerPanel","zoomify-overviewContent","last");
        dojo.style("bladeViewerOverviewText", { "position":"relative", "top":"-10px" });
        dojo.style("bladeViewerOverviewLeadingEdge", {  "left":"70px", "bottom": "18px" });
        dojo.style("zoomify-overview", "display", "block");
        dojo.style("toggle-overview", "display", "block"); 
    } else {
        dojo.place("bladeViewerOverviewPanelInnerPanel","bladeViewerInnerCenterContent","first");
        dojo.style("bladeViewerOverviewText", { "position":"absolute", "top":"-30px" });
        dojo.style("bladeViewerOverviewLeadingEdge", {  "left":"30px", "bottom": "-12px" });
        dojo.place("zoomify-overview", "zoomify","last");
        dojo.style("zoomify-overview", { "display":"none", "top": "5px", "left": "35px" });
        dojo.place("toggle-overview", "zoomify","last");
        dojo.style("toggle-overview", "display", "none");
        dojo.place("toggle-polygons", "zoomify","last");
        //dojo.place(tooltip, dijit.byId('center').domNode,"last");
    }
}

function placeFullScreenZoomifyDialogUnderlay(id){
    if (dojo.byId(id).parentNode.id == "ViewerDisplay") {
        window.setTimeout(function(){
            dojo.query(".dijitDialogUnderlayWrapper").forEach(function(node) {
                if (node.parentNode.id != "ViewerDisplay") {
                    console.log("moving to fullscreen div");
                    dojo.place(node, "ViewerDisplay", "last");
                }
            }); 
        }, 100)

    }   
}