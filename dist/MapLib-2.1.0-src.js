/*
 ES.MapLib 2.1.0, a js library for exsun lbs instance.
 (c) 2016-2018, liulin
 武汉依迅
 http://www.exsun.cn/
 */

(function (window, document, L) {
    /**
     * Created by liulin on 2016/11/8.
     *
     *
     */


    L.MapLib = {};

    L.MapLib.Version = '0.2.0';

    L.initTag = function (oTag, oOption) {
        if (!oTag || !oOption) {
            return;
        }

        //检索对象所有属性
        for (var cItem in oOption) {
            if ($.isArray(oOption[cItem])) {
                //添加option对象
                var cTemp = cItem;
                for (var i = 0; i < oOption[cTemp].length; i++) {
                    var oItem = $('<' + cTemp + '/>');
                    this.initTag(oItem, oOption[cTemp][i]);
                    oTag.append(oItem);
                }
            }
            else if (typeof oOption[cItem] === 'object' && oOption[cItem] !== null) {
                // 重复出现
                var cTagTemp = ES.Util.replaceAll(cItem, '1', '');
                var oItem1 = $('<' + cTagTemp + '/>');
                this.initTag(oItem1, oOption[cItem]);
                oTag.append(oItem1);
            }
            else if (cItem === 'html') {
                var html = oTag.html();
                oTag.html(html + ((oOption[cItem] !== null) ? oOption[cItem] : ''));
            }
            else {
                oTag.attr(cItem, oOption[cItem]);
            }
        }
    };

    L.getData = function (oData,cUrl,fnCallBack,oContext) {
            var obj = new XMLHttpRequest();
            obj.open("POST", cUrl, true);
            obj.setRequestHeader("Content-type", "application/json");
            obj.onreadystatechange = function() {
                if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {
                    fnCallBack.call(oContext, obj.responseText);
                }
            };
        obj.send(oData);
    };

    /*
     * name :		Tooltip.js
     * des :			inside map vection div for show information
     *
     * date:			2016-11-8
     * author:		liulin
     * */


    L.MapLib.Tooltip = L.Class.extend({

        initialize: function (map) {
            this._map = map;
            this._popupPane = map._panes.popupPane;
            var container = L.DomUtil.create('div', 'leaflet-draw-tooltip', this._popupPane);
            this._container = container;// map.options.drawControlTooltips ? container : null;
            this._singleLineLabel = false;

            this._map.on('mouseout', this._onMouseOut, this);
        },

        dispose: function () {
            this._map.off('mouseout', this._onMouseOut, this);

            if (this._container) {
                this._popupPane.removeChild(this._container);
                this._container = null;
            }
        },

        updateContent: function (labelText) {
            if (!this._container) {
                return this;
            }
            labelText.subtext = labelText.subtext || '';

            // update the vertical position (only if changed)
            if (labelText.subtext.length === 0 && !this._singleLineLabel) {
                L.DomUtil.addClass(this._container, 'leaflet-draw-tooltip-single');
                this._singleLineLabel = true;
            }
            else if (labelText.subtext.length > 0 && this._singleLineLabel) {
                L.DomUtil.removeClass(this._container, 'leaflet-draw-tooltip-single');
                this._singleLineLabel = false;
            }

            this._container.innerHTML =
                (labelText.subtext.length > 0 ? '<span class="leaflet-draw-tooltip-subtext">' + labelText.subtext + '</span>' + '<br />' : '') +
                '<span>' + labelText.text + '</span>';

            return this;
        },

        updatePosition: function (latlng) {
            var pos = this._map.latLngToLayerPoint(latlng),
                tooltipContainer = this._container;

            if (this._container) {
                tooltipContainer.style.visibility = 'inherit';
                L.DomUtil.setPosition(tooltipContainer, pos);
            }

            return this;
        },

        showAsError: function () {
            if (this._container) {
                L.DomUtil.addClass(this._container, 'leaflet-error-draw-tooltip');
            }
            return this;
        },

        removeError: function () {
            if (this._container) {
                L.DomUtil.removeClass(this._container, 'leaflet-error-draw-tooltip');
            }
            return this;
        },

        _onMouseOut: function () {
            if (this._container) {
                this._container.style.visibility = 'hidden';
            }
        }
    });




    /**
     * Created by liulin on 2017/1/8.
     * 给地图添加 箭头补丁
     *
     */


    L.extend(L.SVG, {

        _initContainer: function () {
            this._container = L.SVG.create('svg');

            // makes it possible to click through svg root; we'll reset it back in individual paths
            this._container.setAttribute('pointer-events', 'none');

            this._rootGroup = L.SVG.create('g');
            this._container.appendChild(this._rootGroup);
            var oDefs = this._createArrow();
            this._container.appendChild(oDefs);
        },

        //创建箭头对象，定义不同箭头的颜色
        _createArrow: function () {
            var oDefs = L.Path.prototype._createElement('defs');
            var oMarker = L.Path.prototype._createElement('marker');
            oMarker.setAttribute('id', 'arrow');
            oMarker.setAttribute('markerUnits', 'strokeWidth');
            oMarker.setAttribute('markerWidth', '8');
            oMarker.setAttribute('markerHeight', '8');
            oMarker.setAttribute('viewBox', '0 0 12 12');
            oMarker.setAttribute('refX', '6');
            oMarker.setAttribute('refY', '6');
            oMarker.setAttribute('orient', 'auto');
            var oPath = L.Path.prototype._createElement('path');
            oPath.setAttribute('d', 'M2,2 L10,6 L2,10 L3,6 L2,2');
            oPath.setAttribute('style', 'fill: red;');
            oDefs.appendChild(oMarker);
            oMarker.appendChild(oPath);
            return oDefs;
        },
    });

// 圆的补丁
    L.Circle.include({
        getDueLat: function () {
            var d = Math.PI / 180,
                latR = (this._mRadius / L.CRS.Earth.R) / d;
            return latR;
        }

    });

    L.GeometryUtil = L.extend(L.GeometryUtil || {}, {
        // Ported from the OpenLayers implementation. See https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Geometry/LinearRing.js#L270
        geodesicAreaEx: function (latLngs) {
            var pointsCount = latLngs.length,
                area = 0.0,
                d2r = Math.PI / 180,
                p1, p2;

            if (pointsCount > 2) {
                for (var i = 0; i < pointsCount; i++) {
                    p1 = latLngs[i];
                    p2 = latLngs[(i + 1) % pointsCount];
                    area += ((p2.lng - p1.lng) * d2r) *
                        (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
                }
                area = area * 6378137.0 * 6378137.0 / 2.0;
            }

            return Math.abs(area);
        },

        readableAreaEx: function (area, isMetric) {
            var areaStr;

            if (isMetric) {
                if (area >= 10000) {
                    areaStr = (area * 0.0001).toFixed(2) + ' 平方公顷';//' ha';
                } else {
                    areaStr = area.toFixed(2) + ' 平方米';//' m&sup2;';
                }
            } else {
                area /= 0.836127; // Square yards in 1 meter

                if (area >= 3097600) { //3097600 square yards in 1 square mile
                    areaStr = (area / 3097600).toFixed(2) + ' mi&sup2;';
                } else if (area >= 4840) {//48040 square yards in 1 acre
                    areaStr = (area / 4840).toFixed(2) + ' acres';
                } else {
                    areaStr = Math.ceil(area) + ' yd&sup2;';
                }
            }

            return areaStr;
        },

        readableDistanceEx: function (distance, isMetric, useFeet) {
            var distanceStr;

            if (isMetric) {
                // show metres when distance is < 1km, then show km
                if (distance > 1000) {
                    distanceStr = (distance  / 1000).toFixed(2) + ' 千米';
                } else {
                    distanceStr = Math.ceil(distance) + ' 米';
                }
            } else {
                distance *= 1.09361;

                if (distance > 1760) {
                    distanceStr = (distance / 1760).toFixed(2) + ' miles';
                } else {
                    var suffix = ' yd';
                    if (useFeet) {
                        distance = distance * 3;
                        suffix = ' ft';
                    }
                    distanceStr = Math.ceil(distance) + suffix;
                }
            }

            return distanceStr;
        }
    });


    /**
     * Created by liulin on 2016/11/4.
     *
     * 测量的配置文件要求
     */

    L.MapLib.Measure = {};

    L.MapLib.Measure.version = '0.0.1';





    /**
     * 中文包
     * Created by Administrator on 2017/8/3.
     */

    L.MapLib.Measure.Msg = {
        TipMarker: {
            setText: {
                beginText: '开始  '
            },
            createIcon: {
                closeText: '&times;'
            },
            addTotalPenal: {
                total: ' 总共 ',
            },
            setSubTotalDistTag: {
                total: ' 共 ',
            }
        },
        Dist: {
            _getTooltipText: {
                start: '点击开始测量距离.',
                cont: '点击继续测量距离.',
                end: '双击或者点击最后一个点结束测量.'
            }
        },
        Area: {
            _getTooltipText: {
                start: '点击开始测量面积.',
                cont: '点击继续测量面积.',
                end: '双击或者点击第一个点结束测量.'
            }
        },

        error: '<strong>错误:</strong> 线段不能相交!',

    };

    /**
     * Created by liulin on 2016/9/12.
     * name:            measure.dist.js
     * des:             public distance
     * author:          liulin
     * date:            2016-09-12
     *
     * think:
     * 1.manage draw distance object
     *
     */


// inherit the class Feature
// control measure,manage distance object
    L.MapLib.Measure.DistMgr = L.Handler.extend({

        options: {},

        // catch distance obj

        initialize: function (map, options) {
            // set map for handler
            this._map = map;

            L.setOptions(this, options);
            this.aoMeasureHandker = [];

        },

        // start execute
        addHooks: function () {
            var oDist = L.MapLib.Measure.dist(this._map, this, this.options);
            this.oLastDist = oDist;
            this.aoMeasureHandker.push(oDist);
            oDist.createDist();
        },

        // end execute
        removeHooks: function () {

            this.oLastDist.removeDist();
        },

    });

    L.MapLib.Measure.distMgr = function (map, options) {

        return new L.MapLib.Measure.DistMgr(map, options);
    };





    /**
     * Created by liulin on 2016/9/12.
     * name:            measure.dist.js
     * des:             public distance
     * author:          liulin
     * date:            2016-09-12
     */



// inherit the class Feature
// draw marker  with draw one TipMarker
    L.MapLib.Measure.Dist = L.Class.extend({
        // add event for dist
        includes: L.Mixin.Events,

        statics: {
            TYPE: 'DIST'
        },

        Poly: L.Polyline,

        options: {
            allowIntersection: true,
            repeatMode: false,
            drawError: {
                color: '#b00b00',
                timeout: 2500
            },

            touchIcon: new L.DivIcon({
                iconSize: new L.Point(20, 20),
                className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon'
            }),
            guidelineDistance: 20,
            maxGuideLineLength: 4000,
            shapeOptions: {
                stroke: true,
                color: '#f06eaa',
                weight: 2,
                opacity: 1,
                fill: false,
                clickable: true
            },

            metric: true, // Whether to use the metric measurement system or imperial

            feet: true, // When not metric, to use feet instead of yards for display.
            showLength: true, // Whether to display distance in the tooltip
            //zIndexOffset: 2000 // This should be > than the highest z-index any map layers
            // is show total dist for measure
            bIsTotalDist: true
        },

        // distance for the line  when tip show de dTatol distance
        //dTotalDist: 0,
        initialize: function (map, oParent, options) {
            // if touch, switch to touch icon
            if (L.Browser.touch) {
                this.options.icon = this.options.touchIcon;
            }

            this._oParent = oParent;

            // Need to set this here to ensure the correct message is used.
            this.options.drawError.message = L.MapLib.Measure.Msg.error;

            // Merge default drawError options with custom options
            if (options && options.drawError) {
                options.drawError = L.Util.extend({}, this.options.drawError, options.drawError);
            }

            // draw type
            this.type = L.MapLib.Measure.Dist.TYPE;

            this._map = map;

            // the map outer div for control
            this._container = map._container;

            // vector layer
            this._overlayPane = map._panes.overlayPane;

            // layer for  popup obj
            this._popupPane = map._panes.popupPane;

            // Merge default shapeOptions options with custom shapeOptions
            if (options && options.shapeOptions) {
                options.shapeOptions = L.Util.extend({}, this.options.shapeOptions, options.shapeOptions);
            }

            // catch the obj
            this._oLayerGroup = L.featureGroup().addTo(map);

            L.setOptions(this, options);

        },

        // begin execute draw distance
        createDist: function () {

            if (!this._map) {
                return;
            }

            L.DomUtil.disableTextSelection();

            this._container.focus();

            this._tooltip = new L.MapLib.Tooltip(this._map);

            L.DomEvent.on(this._container, 'keyup', this._cancelDrawing, this);

            // manager marker in line distance
            this._oMarkerMgr = new L.MapLib.Measure.MarkerMgr(this._map, this);

            // manager tip marker in line distance
            this._oTipMarkerMgr = new L.MapLib.Measure.TipMarkerMgr(this._map, this, {metric: this.options.metric});

            // draw line
            this._poly = new L.Polyline([], this.options.shapeOptions);

            // uodate tooltip text
            this._tooltip.updateContent(this._getTooltipText());


            this.initEvent();
        },

        initEvent: function () {

            // Make a transparent marker that will used to catch click events. These click
            // events will create the vertices. We need to do this so we can ensure that
            // we can create vertices over other map layers (markers, vector layers). We
            // also do not want to trigger any click handlers of objects we are clicking on
            // while drawing.
            if (!this._mouseMarker) {
                this._mouseMarker = L.marker(this._map.getCenter(), {
                    icon: L.divIcon({
                        className: 'leaflet-mouse-marker',
                        iconAnchor: [20, 20],
                        iconSize: [40, 40]
                    }),
                    opacity: 0,
                    zIndexOffset: this.options.zIndexOffset
                });
            }

            if (!L.Browser.touch) {
                this._map.on('mouseup', this._onMouseUp, this); // Necessary for 0.7 compatibility
            }

            this._mouseMarker
                .on('mousedown', this._onMouseDown, this)
                .on('mouseout', this._onMouseOut, this)
                .on('mouseup', this._onMouseUp, this) // Necessary for 0.8 compatibility
                .on('mousemove', this._onMouseMove, this) // Necessary to prevent 0.8 stutter
                .addTo(this._map);

            this._map
                .on('mouseup', this._onMouseUp, this) // Necessary for 0.7 compatibility
                .on('mousemove', this._onMouseMove, this)
                .on('zoomlevelschange', this._onZoomEnd, this)
                //.on('click', this._onTouch, this)
                .on('zoomend', this._onZoomEnd, this);
        },

        // finish execute draw distance
        removeDist: function () {

            L.DomUtil.enableTextSelection();

            this._tooltip.dispose();
            this._tooltip = null;

            L.DomEvent.off(this._container, 'keyup', this._cancelDrawing, this);

            this._clearHideErrorTimeout();

            // remove last marker event
            this._oMarkerMgr.cleanUpShape();

            this._map.removeLayer(this._poly);

            delete this._poly;

            this._mouseMarker
                .off('mousedown', this._onMouseDown, this)
                .off('mouseout', this._onMouseOut, this)
                .off('mouseup', this._onMouseUp, this)
                .off('mousemove', this._onMouseMove, this);

            this._map.removeLayer(this._mouseMarker);
            delete this._mouseMarker;

            // clean up DOM
            this._clearGuides();

            this._map
                .off('mouseup', this._onMouseUp, this)
                .off('mousemove', this._onMouseMove, this)
                .off('zoomlevelschange', this._onZoomEnd, this)
                .off('zoomend', this._onZoomEnd, this)
            //.off('click', this._onTouch, this);
        },

        deleteLastVertex: function () {
            if (this._markers.length <= 1) {
                return;
            }

            var lastMarker = this._markers.pop(),
                poly = this._poly,
                latlng = this._poly.spliceLatLngs(poly.getLatLngs().length - 1, 1)[0];

            this._markerGroup.removeLayer(lastMarker);

            if (poly.getLatLngs().length < 2) {
                this._map.removeLayer(poly);
            }

            this._vertexChanged(latlng, false);
        },

        // add marker and tipmarker for dist handler
        addVertex: function (latlng) {
            var markersLength = this._oMarkerMgr.getLen();

            if (markersLength > 0 && !this.options.allowIntersection && this._poly.newLatLngIntersects(latlng)) {
                this._showErrorTooltip();
                return;
            }
            else if (this._errorShown) {
                this._hideErrorTooltip();
            }

            // add marker
            var oRelaMarker = this._oMarkerMgr.createMarker(latlng);
            // add tip marker
            this._oTipMarkerMgr.createMarker(latlng, oRelaMarker, {
                className: 'rule_text_box',
                iconAnchor: [-10, 20]
            });

            this._poly.addLatLng(latlng);

            // add line for disctance
            if (this._poly.getLatLngs().length === 2) {
                this._map.addLayer(this._poly);
            }

            this._vertexChanged(latlng, true);
        },

        completeShape: function () {
            if (this._markers.length <= 1) {
                return;
            }


            this.removeDist();

            if (this.options.repeatMode) {
                this._oParent.enable();
            }
        },


        deleteHandler: function (oRelaMarker) {
            if (!this._oMarkerMgr || this._oMarkerMgr.getLen() <= 0) {
                return;
            }
            this._oMarkerMgr.removeMarker(oRelaMarker);

            var aoLatLng = this._oMarkerMgr.getPointMarkers();
            //redraw line for handler
            //this._poly.setLatLngs(aoLatLng);
            if (this._oRtnPoly) {
                this._oRtnPoly.setLatLngs(aoLatLng);
            }
        },

        clearData: function () {
            if (!this._oMarkerMgr || this._oMarkerMgr.getLen() <= 0) {
                return;
            }
            this._oMarkerMgr.clearData();
            //this._poly.setLatLngs([]);
            if (this._oRtnPoly) {
                this._oRtnPoly.setLatLngs([]);
            }
        },

        // finish dist when click last marker
        _finishShape: function () {

            var latlngs = this._poly._defaultShape ? this._poly._defaultShape() : this._poly.getLatLngs();
            var intersects = this._poly.newLatLngIntersects(latlngs[latlngs.length - 1]);

            if ((!this.options.allowIntersection && intersects) || !this._shapeIsValid()) {
                this._showErrorTooltip();
                return;
            }

            this._oTipMarkerMgr.addCloseBtn();

            // create result for map obj
            this._oRtnPoly = new this.Poly(this._poly.getLatLngs(), this.options.shapeOptions);
            this._oRtnPoly.addTo(this._oLayerGroup);

            this._oParent.disable();


            if (this.options.bIsTotalDist) {
                this._oTipMarkerMgr.addTotalDist();
            }

            if (this.options.repeatMode) {
                this.enable();
            }
        },


        //Called to verify the shape is valid when the user tries to finish it
        //Return false if the shape is not valid
        _shapeIsValid: function () {
            return true;
        },

        _onZoomEnd: function () {
            if (this._markers !== null) {
                this._updateGuide();
            }
        },

        // move mouse update point and guide flag
        _onMouseMove: function (e) {

            // screen point to latlng
            var newPos = this._map.mouseEventToLayerPoint(e.originalEvent);
            var latlng = this._map.layerPointToLatLng(newPos);

            // Save current  latlng to update tip obj
            this._currentLatLng = latlng;

            this._updateTooltip(latlng);

            // Update the guide line
            this._updateGuide(newPos);

            // Update the mouse marker position
            this._mouseMarker.setLatLng(latlng);

            L.DomEvent.preventDefault(e.originalEvent);
        },

        _vertexChanged: function () {
            this._map.fire('draw:drawvertex', {layers: this._markerGroup});

            // update marker event,init event for last marker
            this._oMarkerMgr.updateFinishHandler();

            this._clearGuides();

            this._updateTooltip();
        },

        // start execute,get start pos is judge is distance for map
        _onMouseDown: function (e) {
            var originalEvent = e.originalEvent;
            this._mouseDownOrigin = L.point(originalEvent.clientX, originalEvent.clientY);
        },

        // besause the distance is 0 so add marker for distance
        _onMouseUp: function (e) {
            if (this._mouseDownOrigin) {
                // We detect clicks within a certain tolerance, otherwise let it
                // be interpreted as a drag by the map
                var distance = L.point(e.originalEvent.clientX, e.originalEvent.clientY)
                    .distanceTo(this._mouseDownOrigin);
                if (Math.abs(distance) < 9 * (window.devicePixelRatio || 1)) {
                    this.addVertex(e.latlng);
                }
            }
            this._mouseDownOrigin = null;
        },

        _onTouch: function (e) {
            // #TODO: use touchstart and touchend vs using click(touch start & end).
            if (L.Browser.touch) { // #TODO: get rid of this once leaflet fixes their click/touch.
                this._onMouseDown(e);
                this._onMouseUp(e);
            }
        },

        _onMouseOut: function () {
            if (this._tooltip) {
                this._tooltip._onMouseOut.call(this._tooltip);
            }
        },

        // create marker
        _createMarker: function (latlng) {
            var marker = new L.Marker(latlng, {
                icon: this.options.icon,
                zIndexOffset: this.options.zIndexOffset * 2
            });

            this._markerGroup.addLayer(marker);

            return marker;
        },

        // draw guide where move mouse  newpos is mouse pos,
        _updateGuide: function (newPos) {
            var markerCount = this._oMarkerMgr ? this._oMarkerMgr.getLen() : 0;

            if (markerCount > 0) {
                newPos = newPos || this._map.latLngToLayerPoint(this._currentLatLng);

                // draw the guide line
                this._clearGuides();
                this._drawGuide(
                    this._map.latLngToLayerPoint(this._oMarkerMgr.getLastGeoPos()),
                    newPos
                );
            }
        },

        // update text for last
        _updateTooltip: function (latLng) {
            var text = this._getTooltipText();

            if (latLng) {
                this._tooltip.updatePosition(latLng);
            }

            if (!this._errorShown) {
                this._tooltip.updateContent(text);
            }
        },

        _drawGuide: function (pointA, pointB) {
            var length = Math.floor(Math.sqrt(Math.pow((pointB.x - pointA.x), 2) + Math.pow((pointB.y - pointA.y), 2))),
                guidelineDistance = this.options.guidelineDistance,
                maxGuideLineLength = this.options.maxGuideLineLength,
                // Only draw a guideline with a max length
                i = length > maxGuideLineLength ? length - maxGuideLineLength : guidelineDistance,
                fraction,
                dashPoint,
                dash;

            //create the guides container if we haven't yet
            if (!this._guidesContainer) {
                this._guidesContainer = L.DomUtil.create('div', 'leaflet-draw-guides', this._overlayPane);
            }

            //draw a dash every GuildeLineDistance
            for (; i < length; i += this.options.guidelineDistance) {
                //work out fraction along line we are
                fraction = i / length;

                //calculate new x,y point
                dashPoint = {
                    x: Math.floor((pointA.x * (1 - fraction)) + (fraction * pointB.x)),
                    y: Math.floor((pointA.y * (1 - fraction)) + (fraction * pointB.y))
                };

                //add guide dash to guide container
                dash = L.DomUtil.create('div', 'leaflet-draw-guide-dash', this._guidesContainer);
                dash.style.backgroundColor =
                    !this._errorShown ? this.options.shapeOptions.color : this.options.drawError.color;

                L.DomUtil.setPosition(dash, dashPoint);
            }
        },

        _updateGuideColor: function (color) {
            if (this._guidesContainer) {
                for (var i = 0, l = this._guidesContainer.childNodes.length; i < l; i++) {
                    this._guidesContainer.childNodes[i].style.backgroundColor = color;
                }
            }
        },

        // removes all child elements (guide dashes) from the guides container
        _clearGuides: function () {
            if (this._guidesContainer) {
                while (this._guidesContainer.firstChild) {
                    this._guidesContainer.removeChild(this._guidesContainer.firstChild);
                }
            }
        },

        _getTooltipText: function () {
            var showLength = this.options.showLength,
                labelText, distanceStr;
            var nLen = this._oMarkerMgr.getLen();
            if (nLen === 0) {
                labelText = {
                    text: L.MapLib.Measure.Msg.Dist._getTooltipText.start
                };
            } else {
                distanceStr = showLength ? this._getMeasurementString() : '';

                if (nLen === 1) {
                    labelText = {
                        text: L.MapLib.Measure.Msg.Dist._getTooltipText.cont,
                        subtext: distanceStr
                    };
                } else {
                    labelText = {
                        text: L.MapLib.Measure.Msg.Dist._getTooltipText.end,
                        subtext: distanceStr
                    };
                }
            }
            return labelText;
        },

        // get tipMarker distance
        _getMeasurementString: function () {
            var currentLatLng = this._currentLatLng,
                previousLatLng = this._oMarkerMgr.getLastGeoPos(),//this._markers[this._markers.length - 1].getLatLng(),
                distance;

            // calculate the distance from the last fixed point to the mouse position
            //this._measurementRunningTotal + currentLatLng.distanceTo(previousLatLng);
            distance = this._oTipMarkerMgr.getTotalDist() + currentLatLng.distanceTo(previousLatLng);


            return L.GeometryUtil.readableDistance(distance, this.options.metric, this.options.feet);
        },

        _showErrorTooltip: function () {
            this._errorShown = true;

            // Update tooltip
            this._tooltip
                .showAsError()
                .updateContent({text: this.options.drawError.message});

            // Update shape
            this._updateGuideColor(this.options.drawError.color);
            this._poly.setStyle({color: this.options.drawError.color});

            // Hide the error after 2 seconds
            this._clearHideErrorTimeout();
            this._hideErrorTimeout = setTimeout(L.Util.bind(this._hideErrorTooltip, this), this.options.drawError.timeout);
        },

        _hideErrorTooltip: function () {
            this._errorShown = false;

            this._clearHideErrorTimeout();

            // Revert tooltip
            this._tooltip
                .removeError()
                .updateContent(this._getTooltipText());

            // Revert shape
            this._updateGuideColor(this.options.shapeOptions.color);
            this._poly.setStyle({color: this.options.shapeOptions.color});
        },

        _clearHideErrorTimeout: function () {
            if (this._hideErrorTimeout) {
                clearTimeout(this._hideErrorTimeout);
                this._hideErrorTimeout = null;
            }
        },


        // Cancel drawing when the escape key is pressed
        _cancelDrawing: function (e) {
            this._map.fire('draw:canceled', {layerType: this.type});
            if (e.keyCode === 27) {
                this._oParent.disable();
            }
        }
    });

    L.MapLib.Measure.dist = function (map, options) {

        return new L.MapLib.Measure.Dist(map, options);
    };





    /**
     * Created by liulin on 2016/9/12.
     * name:            measure.dist.js
     * des:             public distance
     * author:          liulin
     * date:            2016-09-12
     */


// inhicnt class
// draw marker  with draw one TipMarker
// manage marker and tip marker
    L.MapLib.Measure.MarkerMgr = L.Class.extend({
        statics: {
            TYPE: 'DIST'
        },

        //Marker data,in line marker ,where dist line in the line
        //_markers: [],

        // point total distance for map
        //_dTotalDist: 0,


        options: {
            icon: new L.DivIcon({
                iconSize: new L.Point(8, 8),
                className: 'leaflet-div-icon leaflet-editing-icon'
            }),
            zIndexOffset: 2000
        },

        initialize: function (map, oParent, options) {
            this._map = map;
            this._oParent = oParent;
            L.setOptions(this, options);

            this._dTotalDist = 0;
            this._markers = [];
            this._layerGroup = L.featureGroup();
            this._map.addLayer(this._layerGroup);

        },

        // create marker
        createMarker: function (latlng, options) {

            var oTemp = L.extend({}, options, {
                icon: this.options.icon,
                zIndexOffset: this.options.zIndexOffset * 2
            });
            var oMarker = new L.Marker(latlng, oTemp);

            this._layerGroup.addLayer(oMarker);
            this._markers.push(oMarker);
            return oMarker;
        },

        // get marker length for de array
        getLen: function () {
            if (!this._markers) {
                return 0;
            }
            return this._markers.length;

        },

        getLastMarker: function () {

            if (!this._markers || this._markers.length <= 0) {
                return null;
            }

            return this._markers[this._markers.length - 1];
        },

        getLastGeoPos: function () {
            var oMarker = this.getLastMarker();

            return oMarker.getLatLng();
        },

        // get all marker  point  in the array
        getPointMarkers: function () {
            var aoLatLng = [];
            if (!this._markers || this._markers.length <= 0) {
                return aoLatLng;
            }
            for (var i = 0; i < this._markers.length; i++) {
                aoLatLng.push(this._markers[i].getLatLng());
            }
            return aoLatLng;
        },

        // judge finish draw for map
        updateFinishHandler: function () {
            var markerCount = this._markers.length;

            // The first marker should have a click handler to close the polygon
            if (markerCount > 1) {
                this._markers[markerCount-1].on('click', this._finishShape, this);
                this._markers[markerCount-1].on('dblclick', this._finishShape, this);
            }

            // Add and update the double click handler
            if (markerCount > 2) {
                this._markers[markerCount - 2].off('click', this._finishShape, this);
                this._markers[markerCount-2].on('dblclick', this._finishShape, this);
            }
        },


        cleanUpShape: function () {

            if (this._markers <= 1) {

                return;
            }

            this.getLastMarker().off('click', this._finishShape, this);

        },


        _finishShape: function () {

            //delegated parent execute
            this._oParent._finishShape();

        },

        // delete tipmarker and marker catch
        removeMarker: function (marker) {

            // Update Tipmarker text  for distance
            for (var i = this._markers.length - 1; i >= 0; i--) {
                if (this._markers[i] === marker) {
                    // delete layer
                    this._markers.splice(i, 1);
                    break;
                }
            }

            this._layerGroup.removeLayer(marker);

        },


        updateDist: function () {
            for (var i = 0; i < this._markers; i++) {
                if (i === 0) {
                    this._tipMarkers[i].setDist(0);
                    continue;
                }

                var dist = this._tipMarkers[i].getLatLng().distanceTo(this._tipMarkers[i - 1]);
                this._tipMarkers[i].setDist(dist);
            }
        },


        clearData: function () {
            this._markers.splice(0, this._markers.length);
            this._layerGroup.clearLayers();
        },

        remove: function () {
            this._map.removeLayer(this._layerGroup);
            delete this._layerGroup;
            delete this._markers;
        }
    });


    /**
     * Created by liulin on 2016/9/12.
     * name:            measure.dist.js
     * des:             public distance
     * author:          liulin
     * date:            2016-09-12
     */


// inhicnt class
// draw marker  with draw one TipMarker
// manage marker and tip marker
    L.MapLib.Measure.TipMarkerMgr = L.Class.extend({
        statics: {
            TYPE: 'DIST'
        },


        initialize: function (map, oParent, options) {
            this._map = map;
            L.setOptions(this, options);

            this._markers = [];
            // create layergourp add marker
            this._layerGroup = L.featureGroup();
            // add marker layer
            this._map.addLayer(this._layerGroup);
            // distance
            this._oParent = oParent;
        },

        options: {metric: true},


        // create marker
        createMarker: function (oLatLng, oRelaMarker, options) {

            var tipMarker = L.MapLib.Measure.tipMarker(oLatLng, this, options);
            tipMarker.addTo(this._layerGroup);
            this._markers.push(tipMarker);


            var oPreMarker = this.getSecLastMarker();
            var dDist = this.calDist(tipMarker, oPreMarker);
            tipMarker.setDist(dDist);

            if(this._markers.length  === 1)
            {
                tipMarker.setBeginText();
            }

            if (this._markers.length > 1) {
                dDist = this.getTotalDist();
                // set sub total dist for marker
                tipMarker.setSubTotalDist(dDist);
            }

            // rela marker that show in map
            if (oRelaMarker) {
                tipMarker.oRelaMarker = oRelaMarker;
            }

            return tipMarker;
        },

        // cal distance for two marker and set label for de oCurMarker
        calDist: function (oCurMarker, oPreMarker) {

            if (!oPreMarker) {

                return 0;
            }

            var oELatLng = oCurMarker.getLatLng();
            var oBLatLng = oPreMarker.getLatLng();
            return oELatLng.distanceTo(oBLatLng);
        },

        // get total distance
        getTotalDist: function () {
            if (this._markers.length <= 0) {
                return 0;
            }
            var dToTalDist = 0;
            for (var i = 0; i < this._markers.length; i++) {
                dToTalDist += this._markers[i].dDist;
            }

            return dToTalDist;
        },

        getLastMarker: function () {

            if (!this._markers || this._markers.length <= 0) {
                return null;
            }
            return this._markers[this.getLen() - 1];
        },

        getLastGeoPos: function () {
            var oMarker = this.getLastMarker();
            return oMarker.getLatLng();
        },

        getSecLastMarker: function () {
            if (!this._markers || this._markers.length <= 1) {
                return null;
            }
            return this._markers[this.getLen() - 2];

        },

        // get marker length
        getLen: function () {
            if (!this._markers) {
                return 0;
            }
            return this._markers.length;
        },


        // when finish dist  add close btn
        addCloseBtn: function () {
            var oMarker = this.getLastMarker();
            if (!oMarker) {
                return;
            }
            oMarker.addAllClose();
        },

        // add total tag
        addTotalDist: function () {

            var oMarker = this.getLastMarker();
            if (!oMarker) {
                return;
            }
            var dDist = this.getTotalDist();
            oMarker.addTotalPenal(dDist);

        },

        setTipTotalDist: function () {

            var oMarker = this.getLastMarker();
            if (!oMarker) {
                return;
            }
            var dDist = this.getTotalDist();

            oMarker.setTotalDist(dDist);
        },

        // set all marker distance and label
        setSubDist: function () {

            if (!this._markers || this._markers.length <= 0) {
                return;
            }

            this._markers[0].setDist(0);
            this._markers[0].deleteSubTotalTag();

            for (var i = 1; i < this._markers.length; i++) {
                var dDist = this.calDist(this._markers[i], this._markers[i - 1]);
                this._markers[i].setDist(dDist);
            }
        },

        // befor cal ,you need update marker dist
        setTipSubTotalDist: function () {

            if (!this._markers || this._markers.length <= 0) {
                return;
            }


            var dDist = 0;
            for (var i = 1; i < this._markers.length; i++) {
                dDist = this._markers[i].dDist + dDist;

                this._markers[i].setSubTotalDist(dDist);
            }

        },

        update: function () {

            this.setSubDist();

            this.setTipSubTotalDist();

            if (this._oParent.options.bIsTotalDist) {
                this.addTotalDist();
            }
            else {
                this.setTipTotalDist();
            }

            this.addCloseBtn();
        },

        // delete tipmarker and marker catch
        removeTipMarker: function (marker) {

            if (this._markers.length === 2) {
                this.clearData();
                this._oParent.clearData();
                return;
            }

            // Update Tipmarker text  for distance
            for (var i = this._markers.length - 1; i >= 0; i--) {
                if (this._markers[i] === marker) {
                    // delete layer
                    this._markers.splice(i, 1);
                    break;
                }
            }

            this.update();


            if (marker.oRelaMarker) {
                // remove rela marker
                this._oParent.deleteHandler(marker.oRelaMarker);//fire("removeRelaMarker", {oRelaMarler: marker.oRelaMarler});
            }

            this._layerGroup.removeLayer(marker);


        },

        clearData: function () {
            // delete all data
            this._markers.splice(0, this._markers.length);
            this._layerGroup.clearLayers();
        },

        // delete dist,but draw dist is exist in catch
        deleteDist: function () {
            this.clearData();
            this._oParent.clearData();
        },

        remove: function () {
            this._map.removeLayer(this._layerGroup);
            delete this._layerGroup;
            delete  this._markers;
        }

    });


    /**
     * Created by liulin on 2016/9/12.
     * name:            measure.dist.js
     * des:             public distance
     * author:          liulin
     * date:            2016-09-12
     */


// inhicnt Class
// TipMarker is new obj for marker
    L.MapLib.Measure.TipMarker = L.Marker.extend({
        options: {
            oShowConfig: {
                bIsSubDist: false,
                bIsSubTotalDist: true,
                bIsSubClose: true

            },
            metric: true
        },

        // config tag is create or order,set all site
        oUIConfig: {
            oSubBeginTxt: {
                nOrder: 1,
                cTagName: 'span',
            },
            oSubDist: {
                nOrder: 2,
                cTagName: 'span',
            },
            oSubTotalDist: {
                nOrder: 3,
                cTagName: 'span'
            },
            oTotalDist: {
                nOrder: 4,
                cTagName: 'span'
            },
            oSubClose: {
                nOrder: 5,
                cTagName: 'a',
                cClassName: 'ex-dist-subclose ec-text-lg',
                cText: '',
                cHtml: L.MapLib.Measure.Msg.TipMarker.createIcon.closeText,
                bIsClick: true
            },
            oTotalClose: {
                nOrder: 6,
                cTagName: 'a',
                cClassName: 'ex-dist-close ec-icon-trash',
                cText:'',
                cHtml: '',
                //fnCallBack:null
            },
        },

        initialize: function (latlng, oParent, options) {

            L.Util.extend(this.oUIConfig, options.oUIConfig);

            for (var cKey in this.oUIConfig) {
                if (this.oUIConfig[cKey].cTagName === 'span') {
                    this.oUIConfig[cKey].metric = this.options.metric;
                }
            }

            L.Marker.prototype.initialize.call(this, latlng, options);

            this._oParent = oParent;

            // save tag for the tip marker
            this.aoTag = [];
        },

        _initIcon: function () {
            var options = this.options,
                map = this._map,
                animation = (map.options.zoomAnimation && map.options.markerZoomAnimation),
                classToAdd = animation ? 'leaflet-zoom-animated' : 'leaflet-zoom-hide';

            // create div for marker
            var icon = this.createIcon();

            L.DomUtil.addClass(icon, classToAdd);

            if (options.keyboard) {
                icon.tabIndex = '0';
            }

            this._icon = icon;

            this._initInteraction();

            if (options.riseOnHover) {
                this.on({
                    mouseover: this._bringToFront,
                    mouseout: this._resetZIndex
                });
            }


            if (options.opacity < 1) {
                this._updateOpacity();
            }

            var panes = this._map._panes;

            panes.markerPane.appendChild(this._icon);

        },

        // set position for the marker div
        _setIconStyles: function (img, name) {
            var options = this.options,
                size = L.point(options[name + 'Size']),
                anchor;

            anchor = L.point(options.iconAnchor);

            if (!anchor && size) {
                anchor = size.divideBy(2, true);
            }

            img.className = 'leaflet-marker-' + name + ' ' + options.className;

            if (anchor) {
                img.style.marginLeft = (-anchor.x) + 'px';
                img.style.marginTop = (-anchor.y) + 'px';
            }

            if (size) {
                img.style.width = size.x + 'px';
                img.style.height = size.y + 'px';
            }
        },

        // create icon and init event
        createIcon: function () {
            var divContainer = L.DomUtil.create('div', '');
            this._setIconStyles(divContainer, 'icon');

            this.oTagContanier = divContainer;
            this.createTag();

            return divContainer;
        },

        createTag: function () {
            var oShowConfig = this.options.oShowConfig;
            for (var cKey in oShowConfig) {
                if (!oShowConfig[cKey]) {
                    continue;
                }
                var cTag = cKey.replace('bIs', 'o');
                if (this.oUIConfig.hasOwnProperty(cTag)) {
                    var oTag = new L.MapLib.Measure.TipTag(this, this.oUIConfig[cTag]);
                    oTag.setFlag(cTag);
                    this.addTag(oTag);
                    if (this.oUIConfig[cTag].bIsClick) {

                        oTag.setClick(this.closeHanler, this);
                    }
                }
            }
        },


        // add html tag for list
        addTag: function (oTag) {
            var aoTag = this.aoTag;

            if (aoTag.length <= 0) {
                aoTag.push(oTag);
                this.oTagContanier.appendChild(oTag.oTag);
                return;
            }
            var nIndex = aoTag.length;
            for (var i = 0; i < aoTag.length; i++) {
                if (oTag.nOrder < aoTag[i].nOrder) {
                    nIndex = i;
                    break;
                }
            }
            if (nIndex === aoTag.length) {
                this.oTagContanier.appendChild(oTag.oTag);
                this.aoTag.push(oTag);
            }
            else {

                this.oTagContanier.insertBefore(oTag.oTag, this.aoTag[nIndex].oTag);
                this.aoTag.splice(nIndex, 0, oTag);
            }

        },

        // add tag close all marker
        addAllClose: function () {

            var oTag = this.getTagByFlag('oTotalClose');
            if (oTag) {
                return;
            }
            oTag = L.MapLib.Measure.tipTag(this, this.oUIConfig.oTotalClose);
            oTag.setFlag('oTotalClose');
            this.addTag(oTag);

            oTag.setClick(function () {

                this._oParent.deleteDist();
            }, this);
        },


        // delet oTag
        deleteTag: function (cFlag) {
            var aoTag = this.aoTag;
            if (!aoTag || aoTag.length <= 0) {
                return;
            }

            for (var i = 0; i < aoTag.length; i++) {
                if (aoTag[i].cFlag === cFlag) {
                    this.oTagContanier.removeChild(aoTag[i].oTag);
                    aoTag.splice(i, 1);
                    break;
                }
            }
        },

        deleteSubTotalTag: function () {

            this.deleteTag('oSubTotalDist');
        },

        addTotalPenal: function (dTotal) {
            var oTag = this.getTagByFlag('oTotalDist');
            if (!oTag) {
                oTag = L.MapLib.Measure.tipTag(this, this.oUIConfig.oTotalDist);
                oTag.setFlag('oTotalDist');
                this.addTag(oTag);
            }
            this.setTotalDist(dTotal, oTag);
        },

        setTotalDist: function (dTotal, oTag) {
            if (!oTag) {
                oTag = this.getTagByFlag('oTotalDist');
            }
            if (!oTag) {
                return;
            }
            this.deleteTag('oSubTotalDist');
            var cTemp = L.MapLib.Measure.Msg.TipMarker.addTotalPenal.total;

            oTag.setHTML(dTotal, cTemp);
        },

        // set marker length
        setDist: function (dDist) {
            this.dDist = dDist;
            var oTag = this.getTagByFlag('oSubDist');
            if (!oTag) {
                return;
            }

            oTag.setHTML(dDist);
        },

        setBeginText: function () {
            var cTag= 'oSubBeginTxt';
            var oTag = new L.MapLib.Measure.TipTag(this, this.oUIConfig[cTag]);
            oTag.setFlag(cTag);
            this.addTag(oTag);
            var cText = L.MapLib.Measure.Msg.TipMarker.setText.beginText;
            oTag.setHTML(cText);
        },

        getTagByFlag: function (cFlag) {
            var aoTag = this.aoTag;
            if (!aoTag || aoTag.length <= 0) {
                return undefined;
            }
            for (var i = 0; i < aoTag.length; i++) {
                if (aoTag[i].cFlag === cFlag) {
                    return aoTag[i];

                }
            }

            return undefined;
        },

        setSubTotalDist: function (dTotal) {
            var oTag = this.getTagByFlag('oSubTotalDist');
            if (!oTag) {
                return;
            }
            var cTemp = L.MapLib.Measure.Msg.TipMarker.setSubTotalDistTag.total;
            //var cDist = (dTotal / 1000).toFixed(2) + L.measure.TipMarker.setSubTotalDistTag.until;

            oTag.setHTML(dTotal, cTemp);
        },


        closeHanler: function () {

            this._oParent.removeTipMarker(this);
        },

    });


    L.MapLib.Measure.tipMarker = function (oLatLng, tipMgr, options) {

        return new L.MapLib.Measure.TipMarker(oLatLng, tipMgr, options);
    };


    /**
     * Created by liulin on 2016/9/12.
     * name:            measure.TipTag.js
     * des:             tag for the tip
     * author:          liulin
     * date:            2016-09-27
     */


// inhicnt Class
// TipMarker is new obj for markertipmarker
    L.MapLib.Measure.TipTag = L.Class.extend({
        // config tag is create or order
        options: {
            // show sub distance in marker
            cTagName: 'span',
            // class for the tag
            cClassName: '',
            // show sub marker total distance
            nOrder: 1,
            // show total dist
            cText: '',
            //metric
        },

        // init tag for control
        initialize: function (oParent, options) {
            L.setOptions(this, options);
            this._oParent = oParent;
            this.createTag();
            //this.cPreText = '';
        },


        // create icon and init event
        createTag: function () {
            var oTag = L.DomUtil.create(this.options.cTagName, '');
            this.nOrder = this.options.nOrder;
            if (this.options.cClassName) {
                L.DomUtil.addClass(oTag, this.options.cClassName);
            }

            oTag.text = this.options.cText;
            oTag.innerHTML =  this.options.cHtml||'';
            this.oTag = oTag;

            return oTag;
        },

        setFlag: function (cFlag) {
            this.cFlag = cFlag;
            this.oTag.setAttribute('cFlag', cFlag);
        },

        // set html
        setHTML: function (dDist, cPreText) {
            if (typeof dDist === 'string') {
                this.oTag.innerText = dDist;
                return;
            }

            var cDist = '';
            if (dDist !== 0) {
                //metric
                cDist = L.GeometryUtil.readableDistance(dDist, true);
            }
            this.oTag.innerHTML = (cPreText || '') + cDist;
        },

        setClick: function (fnCall, oContext) {
            L.DomEvent.on(this.oTag, 'click', fnCall, oContext);
        }

    });


    L.MapLib.Measure.tipTag = function (oParent, options) {

        return new  L.MapLib.Measure.TipTag(oParent, options);
    };


    /**
     * Created by liulin on 2016/11/7.
     */

    L.MapLib.Measure.AreaMgr = L.MapLib.Measure.DistMgr.extend({

        // start execute
        addHooks: function () {
            var oDist = L.MapLib.Measure.area(this._map, this, this.options);
            this.oLastDist = oDist;
            this.aoMeasureHandker.push(oDist);
            oDist.createDist();
        },
    });

    L.MapLib.Measure.areaMgr = function (map, options) {

        return new L.MapLib.Measure.AreaMgr(map, options);
    };


    /**
     * name:    area.js
     * desc:    measure area for the map
     *
     * Created by liulin on 2016/11/5.
     *
     */

    L.MapLib.Measure.Area = L.MapLib.Measure.Dist.extend({
        statics: {
            TYPE: 'area'
        },

        Poly: L.Polygon,

        options: {
            showArea: false,
            shapeOptions: {
                stroke: true,
                color: '#f06eaa',
                weight: 2,
                opacity: 1,
                fill: true,
                fillColor: null,
                fillOpacity: 0.2,
                clickable: true
            },
            // Whether to use the metric measurement system or imperial
            metric: true
        },

        initialize: function (map, oParent, options) {
            L.MapLib.Measure.Dist.prototype.initialize.call(this, map, oParent, options);

            // Save the type so super can fire, need to do this as cannot do this.TYPE :(
            this.type = L.MapLib.Measure.Area.TYPE;
        },

        createDist: function () {

            if (!this._map) {
                return;
            }

            L.DomUtil.disableTextSelection();

            this._container.focus();

            this._tooltip = new L.MapLib.Tooltip(this._map);

            L.DomEvent.on(this._container, 'keyup', this._cancelDrawing, this);

            // manager marker in line distance
            this._oMarkerMgr = new L.MapLib.Measure.AreaMarkerMgr(this._map, this);

            // manager tip marker in line distance
            this._oTipMarkerMgr = new L.MapLib.Measure.AreaTipMarkerMgr(this._map, this);

            // draw line
            this._poly = new L.Polyline([], this.options.shapeOptions);

            // uodate tooltip text
            this._tooltip.updateContent(this._getTooltipText());

            this.initEvent();

        },

        _getTooltipText: function () {
            var text, subtext;
            var nLen = this._oMarkerMgr.getLen();
            if (nLen === 0) {
                text = L.MapLib.Measure.Msg.Area._getTooltipText.start;
            } else if (nLen < 3) {
                text = L.MapLib.Measure.Msg.Area._getTooltipText.cont;
            } else {
                text = L.MapLib.Measure.Msg.Area._getTooltipText.end;
                subtext = this._getMeasurementString();
            }

            return {
                text: text,
                subtext: subtext
            };
        },

        _getMeasurementString: function () {
            var area = this._area;

            if (!area) {
                return null;
            }

            return L.GeometryUtil.readableArea(area, this.options.metric);
        },

        _shapeIsValid: function () {
            var nLen = this._oMarkerMgr.getLen();
            return nLen >= 3;
        },

        _vertexChanged: function (latlng, added) {
            var latLngs;

            // Check to see if we should show the area
            if (!this.options.allowIntersection && this.options.showArea) {
                latLngs = this._poly.getLatLngs();

                this._area = L.GeometryUtil.geodesicArea(latLngs);
            }

            L.MapLib.Measure.Dist.prototype._vertexChanged.call(this, latlng, added);
        },

        _cleanUpShape: function () {
            var markerCount = this._markers.length;

            if (markerCount > 0) {
                this._markers[0].off('click', this._finishShape, this);

                if (markerCount > 2) {
                    this._markers[markerCount - 1].off('dblclick', this._finishShape, this);
                }
            }
        },


    });

    L.MapLib.Measure.area = function (oMap, oParent, oOption) {
        return new L.MapLib.Measure.Area(oMap, oParent, oOption);
    };

    /**
     * Created by liulin on 2017/1/19.
     */


    L.MapLib.Measure.AreaMarkerMgr= L.MapLib.Measure.MarkerMgr.extend({

        updateFinishHandler: function () {
            var markerCount = this._markers.length;

            // The first marker should have a click handler to close the polygon
            if (markerCount === 1) {
                this._markers[0].on('click', this._finishShape, this);
            }

            // Add and update the double click handler
            if (markerCount > 2) {
                this._markers[markerCount - 1].on('dblclick', this._finishShape, this);
                // Only need to remove handler if has been added before
                if (markerCount > 3) {
                    this._markers[markerCount - 2].off('dblclick', this._finishShape, this);
                }
            }
        },

    });

    /**
     * Created by liulin on 2016/11/7.
     */

    L.MapLib.Measure.AreaTipMarkerMgr = L.MapLib.Measure.TipMarkerMgr.extend({

        statics: {
            TYPE: 'AREA'
        },

        // create marker ,cal area for current marker
        createMarker: function (oLatLng, oRelaMarker, options) {

            var tipMarker = new L.MapLib.Measure.AreaTipMarker(oLatLng, this, options);
            tipMarker.addTo(this._layerGroup);
            this._markers.push(tipMarker);

            // rela marker that show in map
            if (oRelaMarker) {
                tipMarker.oRelaMarker = oRelaMarker;
            }

            return tipMarker;
        },

        // get total area
        getTotalDist: function () {
            if (this._markers.length <= 2) {
                return 0;
            }

            var aoLatlng = this._markers.map(function (oItem) {
                return oItem.getLatLng();
            });

            var dToTalArea = L.GeometryUtil.geodesicArea(aoLatlng);
            return dToTalArea;
        },

        // delete tipmarker and marker catch
        removeTipMarker: function (marker) {

            if (this._markers.length === 3) {
                this.clearData();
                this._oParent.clearData();
                return;
            }

            // Update Tipmarker text  for distance
            for (var i = this._markers.length - 1; i >= 0; i--) {
                if (this._markers[i] === marker) {
                    // delete layer
                    this._markers.splice(i, 1);
                    break;
                }
            }

            this.update();


            if (marker.oRelaMarker) {
                // remove rela marker
                this._oParent.deleteHandler(marker.oRelaMarker);//fire("removeRelaMarker", {oRelaMarler: marker.oRelaMarler});
            }

            this._layerGroup.removeLayer(marker);

        },

        update: function () {

            if (this._oParent.options.bIsTotalDist) {
                this.addTotalDist();
            }
            else {
                this.setTipTotalDist();
            }

            this.addCloseBtn();
        },
    });

    /**
     * Created by liulin on 2016/11/7.
     */

    L.MapLib.Measure.AreaTipMarker = L.MapLib.Measure.TipMarker.extend({

        options: {
            oShowConfig: {
                bIsSubDist: false,
                bIsSubClose: true

            },
            metric: true
        },

        oUIConfig: {
            oTotalDist: {
                nOrder: 3,
                cTagName: 'span'
            },

            //oSubClose: {
            //    nOrder: 4,
            //    cTagName: 'a',
            //    cText: L.MapLib.Measure.Msg.TipMarker.createIcon.closeText,
            //    bIsClick: true
            //},
            //oTotalClose: {
            //    nOrder: 5,
            //    cTagName: 'a',
            //    cClassName: '',
            //    cText: L.MapLib.Measure.Msg.TipMarker.createIcon.closeText
            //
            //},

            oSubClose: {
                nOrder: 4,
                cTagName: 'a',
                cClassName: 'ex-dist-subclose ec-text-lg',
                cText: '',
                cHtml: L.MapLib.Measure.Msg.TipMarker.createIcon.closeText,
                bIsClick: true
            },
            oTotalClose: {
                nOrder: 5,
                cTagName: 'a',
                cClassName: 'ex-dist-close ec-icon-trash',
                cText:'',
                cHtml: '',
                //fnCallBack:null
            },
        },

        createTag: function () {
            var oShowConfig = this.options.oShowConfig;
            for (var cKey in oShowConfig) {
                if (!oShowConfig[cKey]) {
                    continue;
                }
                var cTag = cKey.replace('bIs', 'o');
                if (this.oUIConfig.hasOwnProperty(cTag)) {
                    var oTag = new L.MapLib.Measure.AreaTipTag(this, this.oUIConfig[cTag]);
                    oTag.setFlag(cTag);
                    this.addTag(oTag);
                    if (this.oUIConfig[cTag].bIsClick) {

                        oTag.setClick(this.closeHanler, this);
                    }
                }
            }
        },

        addTotalPenal: function (dTotal) {
            var oTag = this.getTagByFlag('oTotalDist');
            if (!oTag) {
                oTag = new L.MapLib.Measure.AreaTipTag(this, this.oUIConfig.oTotalDist);
                oTag.setFlag('oTotalDist');
                this.addTag(oTag);
            }
            this.setTotalDist(dTotal, oTag);
        },

    });

    /**
     * Created by liulin on 2016/11/7.
     */

    L.MapLib.Measure.AreaTipTag = L.MapLib.Measure.TipTag.extend({

        setHTML: function (dDist) {
            if (typeof dDist === 'string') {
                this.oTag.innerText = dDist;
                return;
            }

            var cDist = L.MapLib.Measure.Msg.TipMarker.setText.beginText;
            if (dDist !== 0) {
                cDist = L.GeometryUtil.readableAreaEx(dDist, this.options.metric);
            }
            this.oTag.innerHTML = cDist;
        },
    });

    /**
     * Created by liulin on 2016/11/8.
     */
    L.MapLib.LocaltionSearch = {};

    L.MapLib.LocaltionSearch.version = '0.0.1';

    L.MapLib.LocaltionSearch.Msg = {

        addHooks: {
            locText: 'move mouse to search localtion',
        },

        _onMouseMove: {
            locTemp: 'lng:{lng},lat:{lat}',
        },

    };


    /**
     * Created by liulin on 2016/11/7.
     *
     *desc:         localtion  search where move mouse on the map
     *if you want to get localtion you must click the map ,the tip close
     * then the gps catch in the clip
     *
     */


    L.MapLib.LocaltionSearch.Search = L.Handler.extend({

        statics: {
            TYPE: 'LocaltionSearch'
        },

        includes: L.Mixin.Events,

        initialize: function (map, options) {

            L.Handler.prototype.initialize.call(this, map);

            L.setOptions(this, options);

            this._uneditedLayerProps = {};

            //this.type = L.LocaltionSearch.TYPE;
        },

        enable: function () {
            if (this._enabled) {
                return;
            }

            this.fire('enabled', {handler: this.type});

            //this disable other handlers
            this._map.fire('tool:localStart', {handler: this.type});

            //allow drawLayer to be updated before beginning edition.
            L.Handler.prototype.enable.call(this);

        },

        disable: function () {
            if (!this._enabled) {
                return;
            }

            L.Handler.prototype.disable.call(this);
            this._map.fire('tool:localStop', {handler: this.type});

            this.fire('disabled', {handler: this.type});
        },

        addHooks: function () {

            var map = this._map;
            if (!map) {
                return;
            }

            map.getContainer().focus();

            this._tooltip = new L.MapLib.Tooltip(this._map);
            this._tooltip.updateContent({
                text: '',
                subtext: L.MapLib.LocaltionSearch.Msg.addHooks.locText,
            });
            L.DomUtil.addClass(this._map.getContainer(), 'toopTipClass');
            this._map.on('mousemove', this._onMouseMove, this)
                .on('click', this._onClick, this);
        },

        removeHooks: function () {
            if (this._map) {
                // Clean up selected layers.
                //this._featureGroup.eachLayer(this._disableLayerEdit, this);

                // Clear the backups of the original layers
                this._uneditedLayerProps = {};

                this._tooltip.dispose();
                this._tooltip = null;
                L.DomUtil.removeClass(this._map.getContainer(), 'toopTipClass');

                this._map.off('mousemove', this._onMouseMove, this)
                    .off('click', this._onClick, this);
            }
        },

        // copy lat lng to catch
        _onClick: function (e) {
            var oContainer = this._map.getContainer();
            var oInput = L.DomUtil.create('input', '', oContainer);
            oInput.type = 'text';

            var oLatLng = {
                lat: e.latlng.lat.toFixed(6),
                lng: e.latlng.lng.toFixed(6)
            };

            oInput.value = L.Util.template(L.MapLib.LocaltionSearch.Msg._onMouseMove.locTemp, oLatLng);
            oInput.select();
            document.execCommand('Copy');
            oContainer.removeChild(oInput);

            this.disable();
        },

        _onMouseMove: function (e) {
            var oLatLng = {
                lat: e.latlng.lat.toFixed(6),
                lng: e.latlng.lng.toFixed(6)
            };
            this._tooltip.updateContent({
                text: L.MapLib.LocaltionSearch.Msg.addHooks.locText,
                subtext: L.Util.template(L.MapLib.LocaltionSearch.Msg._onMouseMove.locTemp, oLatLng)
            });
            this._tooltip.updatePosition(e.latlng);
        },


    });

    /**
     * Created by liulin on 2016/12/21.


     name:       MapRectBox.js
     des:        地图拉框组件
     date:       2016-06-14
     author:     liulin


     继承地图拉框组件，实现地图拉框功能，监听地图拉框
     */


// L.Map 地图类，合并为地图属性，并说明是否默认执行enable，
// 如果是外部按钮触发，设置为false，如果是加载地图控件自动触发设置为true

    L.Map.mergeOptions({
        // @option boxZoom: Boolean = true
        // Whether the map can be zoomed to a rectangular area specified by
        // dragging the mouse while pressing the shift key.
        rectBox: false
    });

//
    L.Map.RectBox = L.Handler.extend({
        initialize: function (map) {
            this._map = map;
            this._container = map._container;
            this._pane = map._panes.overlayPane;
        },

        addHooks: function () {
            L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
            // 鼠标修改为手形
            L.DomUtil.addClass(this._container, 'leaflet-crosshair');
            this._map.dragging.disable();
        },

        removeHooks: function () {
            L.DomEvent.off(this._container, 'mousedown', this._onMouseDown, this);
            L.DomUtil.removeClass(this._container, 'leaflet-crosshair');
        },

        moved: function () {
            return this._moved;
        },

        _resetState: function () {
            this._moved = false;
        },

        _onMouseDown: function (e) {
            //if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

            this._resetState();

            L.DomUtil.disableTextSelection();
            L.DomUtil.disableImageDrag();

            this._startPoint = this._map.mouseEventToContainerPoint(e);

            if (L.version === '0.7.7') {
                L.DomEvent
                    .on(document, 'mousemove', this._onMouseMove, this)
                    .on(document, 'mouseup', this._onMouseUp, this)
                    .on(document, 'keydown', this._onKeyDown, this);
            } else {
                L.DomEvent.on(document, {
                    contextmenu: L.DomEvent.stop,
                    mousemove: this._onMouseMove,
                    mouseup: this._onMouseUp,
                    keydown: this._onKeyDown
                }, this);
            }

        },

        _onMouseMove: function (e) {
            if (!this._moved) {
                this._moved = true;

                this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._container);


                this._map.fire('rectboxstart');
            }

            this._point = this._map.mouseEventToContainerPoint(e);

            var bounds = new L.Bounds(this._point, this._startPoint),
                size = bounds.getSize();

            L.DomUtil.setPosition(this._box, bounds.min);

            this._box.style.width = size.x + 'px';
            this._box.style.height = size.y + 'px';
        },

        _finish: function () {

            if (this._moved) {
                if (L.version === '0.7.7') {
                    this._container.removeChild(this._box);
                    this._container.style.cursor = '';
                } else {
                    L.DomUtil.remove(this._box);
                    L.DomUtil.removeClass(this._container, 'leaflet-crosshair');
                }
            }
            this._map.dragging.enable();

            L.DomUtil.enableTextSelection();
            L.DomUtil.enableImageDrag();
            if (L.version === '0.7.7') {
                L.DomEvent
                    .off(document, 'mousemove', this._onMouseMove)
                    .off(document, 'mouseup', this._onMouseUp)
                    .off(document, 'keydown', this._onKeyDown);
            } else {
                L.DomEvent.off(document, {
                    contextmenu: L.DomEvent.stop,
                    mousemove: this._onMouseMove,
                    mouseup: this._onMouseUp,
                    keydown: this._onKeyDown
                }, this);
            }
        },

        _onMouseUp: function (e) {
            if ((e.which !== 1) && (e.button !== 1)) {
                return;
            }

            this._finish();

            if (!this._moved) {
                return;
            }
            // Postpone to next JS tick so internal click event handling
            // still see it as 'moved'.
            setTimeout(L.bind(this._resetState, this), 0);

            var bounds = new L.LatLngBounds(
                this._map.containerPointToLatLng(this._startPoint),
                this._map.containerPointToLatLng(this._point));

            this._map.fire('rectboxend', {boxBounds: bounds});

            this.endHandler(bounds);

        },

        // 拉框结束需要处理的事件，
        endHandler: function () {

        },

        _onKeyDown: function (e) {
            if (e.keyCode === 27) {
                this._finish();
            }
        }
    });

// @section Handlers
// @property boxZoom: Handler
// Box (shift-drag with mouse) zoom handler.
    L.Map.addInitHook('addHandler', 'rectBox', L.Map.RectBox);

// 拉框放大
    L.Map.ScaleBig = L.Map.RectBox.extend({

        endHandler: function (bounds) {
            if (!bounds) {
                return;
            }
            this._map.fitBounds(bounds);
            this.disable();
        },
    });

// 拉框放大
    L.Map.ScaleSmall = L.Map.RectBox.extend({

        endHandler: function (bounds) {
            if (!bounds) {
                return;
            }
            this.zoomInBounds(bounds);
            this.disable();
        },

        //添加缩小方法，在中心点处缩小一个层级
        zoomInBounds: function (bounds, options) {

            var nZoom = this._map.getZoom();

            options = options || {};
            bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);

            var paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
                paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),

                zoom = this._map.getBoundsZoom(bounds, false, paddingTL.add(paddingBR)),
                paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

                swPoint = this._map.project(bounds.getSouthWest(), zoom),
                nePoint = this._map.project(bounds.getNorthEast(), zoom),
                center = this._map.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

            var nLevel = ((zoom - nZoom) === 0) ? 1 : (zoom - nZoom);

            zoom = options && options.maxZoom ? Math.min(options.maxZoom, zoom) : nZoom - nLevel;

            return this._map.setView(center, zoom, options);
        },

    });

    /**
     * Created by liulin on 2016/11/23.
     *
     *
     *
     */


    L.Util.extend(L.LineUtil, {



        // json 数据生成 html
        //@oTag Ϊjquery
        //@oOption
        initTag: function (oTag, oOption) {
            if (!oTag || !oOption) {
                return;
            }

            //
            for (var cItem in oOption) {
                if (L.Util.isArray(oOption[cItem])) {
                    //
                    var cTemp = cItem;
                    for (var i = 0; i < oOption[cTemp].length; i++) {
                        var oItem = L.DomUtil.create(cTemp);
                        this.initTag(oItem, oOption[cTemp][i]);
                        oTag.appendChild(oItem);
                    }
                }
                else if (typeof oOption[cItem] === 'object' && oOption[cItem] !== null) {
                    //
                    var cTagTemp = L.Util.replaceAll(cItem, '1', '');
                    var oItem1 = L.DomUtil.create(cTagTemp);
                    this.initTag(oItem1, oOption[cItem]);
                    oTag.appendChild(oItem1);
                }
                else if (cItem === 'html') {
                    var html = oTag.innerHTML;
                    oTag.innerHTML = html + ((oOption[cItem] !== null) ? oOption[cItem] : '');

                }
                else {
                    oTag.setAttribute(cItem, oOption[cItem]);

                }
            }
        },

        //
        //@s
        //@s1
        //@s2
        replaceAll: function (s, s1, s2) {
            return s.replace(new RegExp(s1, 'gm'), s2);
        },

    });




    /**
     * Created by liulin on 2016/11/23.
     *
     * 只对地图 的配置，不含控件的配置
     *
     * 这个文件可以可以扩展
     */
    L.MapLib.MapMaster = {};
    L.MapLib.MapMaster.vertion = '0.0.1';
    L.MapLib.MapMaster.TileProvider = {

        oTianDiTu: {
            oNormal: {
                cName: '天地图',
                cMap: "http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}",
                cAnnotion: "http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}",
                acSubdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
            },
            oSatellite: {
                cName: '天地卫星图',
                cMap: "http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}",
                cAnnotion: "http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}",
                acSubdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
            },
            oTerrain: {
                cName: '天地地形图',
                cMap: "http://t{s}.tianditu.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}",
                cAnnotion: "http://t{s}.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}",
                acSubdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
            },
        },

        oMapABC: {
            oNormal: {
                cName: 'MapABC',
                cMap: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                acSubdomains: ["a", "b", "c"]
            }
        },

        oGaoDe: {
            oNormal: {
                cName: '高德地图',
                cMap: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                acSubdomains: ["1", "2", "3", "4"]
            },
            oSatellite: {
                cName: '高德卫星图',
                cMap: 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',

                acSubdomains: ["1", "2", "3", "4"]
            },
            oNetRoad: {
                cName: '高德路网图',
                cMap: 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
                acSubdomains: ["1", "2", "3", "4"]
            }
        },

        oExSun: {
            oNormal: {
                cName: '依迅本地图',
                cMap: 'http://192.168.1.248:9000/map/get/{x}/{y}/{z}',
                acSubdomains: ["1", "2", "3", "4"]
            },
            oNormalSvr: {
                cName: '依迅服务器图',
                cMap: 'http://221.235.53.42:8008/mapimg.aspx?t=mapabc&z={z}&x={x}&y={y}',
                acSubdomains: ["1", "2", "3", "4"]
            },
        },

        oGoogleMap: {
            oNormal: {
                cName: '谷歌地图',
                cMap: 'http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
                acSubdomains: ["1", "2", "3", "4"]
            },
            oSatellite: {
                cName: '谷歌卫星图',
                cMap: 'http://mt3.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
                acSubdomains: ["1", "2", "3", "4"]
            },
            oTopographic: {
                cName: '谷歌地形图',
                cMap: 'http://mt0.google.cn/vt/lyrs=t&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
                nMaxLevel: 16,
                acSubdomains: ["1", "2", "3", "4"]
            },

        },

        oArcMap: {
            oFoursquare: {
                cMap: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
                cName: '灰度图',
                acSubdomains: ["1", "2", "3", "4"]
            },

        },

        oTDMap: {
            oNormal: {
                cName: '立体图',
                cMap: 'https://a.tiles.mapbox.com/v3/foursquare.map-0y1jh28j/{z}/{x}/{y}.png',
                acSubdomains: ["1", "2", "3", "4"]
            },
        },


    };

// 定义快捷方式0,1,2 为天地图瓦片
    L.MapLib.MapMaster.TileProvider[0]=L.MapLib.MapMaster.TileProvider.oTianDiTu.oNormal;
    L.MapLib.MapMaster.TileProvider[1]=L.MapLib.MapMaster.TileProvider.oTianDiTu.oSatellite;
    L.MapLib.MapMaster.TileProvider[2]=L.MapLib.MapMaster.TileProvider.oTianDiTu.oTerrain;

// 定义快捷方式 3 为MABC瓦片
    L.MapLib.MapMaster.TileProvider[3]=L.MapLib.MapMaster.TileProvider.oMapABC.oNormal;

// 定义快捷方式 4，5，6 为高德瓦片
    L.MapLib.MapMaster.TileProvider[4]=L.MapLib.MapMaster.TileProvider.oGaoDe.oNormal;
    L.MapLib.MapMaster.TileProvider[5]=L.MapLib.MapMaster.TileProvider.oGaoDe.oSatellite;
    L.MapLib.MapMaster.TileProvider[6]=L.MapLib.MapMaster.TileProvider.oGaoDe.oNetRoad;

// 依迅地图瓦片
    L.MapLib.MapMaster.TileProvider[7]=L.MapLib.MapMaster.TileProvider.oExSun.oNormal;
    L.MapLib.MapMaster.TileProvider[8]=L.MapLib.MapMaster.TileProvider.oExSun.oNormalSvr;

    L.MapLib.MapMaster.TileProvider[9]=L.MapLib.MapMaster.TileProvider.oGoogleMap.oNormal;
    L.MapLib.MapMaster.TileProvider[10]=L.MapLib.MapMaster.TileProvider.oGoogleMap.oSatellite;
    L.MapLib.MapMaster.TileProvider[11]=L.MapLib.MapMaster.TileProvider.oGoogleMap.oTopographic;

    L.MapLib.MapMaster.TileProvider[12]=L.MapLib.MapMaster.TileProvider.oArcMap.oFoursquare;
    L.MapLib.MapMaster.TileProvider[13]=L.MapLib.MapMaster.TileProvider.oTDMap.oNormal;


    L.MapLib.MapMaster.Err= {

        1: '没有设置图层！',
        2: 'Map parent container not found.',

    };

    L.MapLib.MapMaster.EventName= {

        // 地图加载完毕事件
        loadFinish: 'Map:loadFinish',

    };







    /**
     * Created by liulin on 2016/11/22.
     *
     * 地图整体思想
     *
     * 1. 图层 管理
     * 2. 地图 div 容器 管理
     * 3. 地图 外围容器
     *
     * 4. 整个 代码不能出现中文
     *
     * 5. 只能出现地图相关的数据
     * 6. 地图控件编程只能出现原生的js，不能只用jquest 对象
     * 7. 其他的所有地图操作都继承他
     *
     * 加载工具栏的容器，工具栏的容器在什么位置
     *
     *
     */


    L.MapLib.MapMaster.Map = L.Evented.extend({

        //对象的固有参数
        options: {

            // 地图div
            cDidId: 'divMap',

            // 地图容器上级容器
            cDivContainerId: 'divContainer',

            // 默认的图层
            nDefaultTile: 4,

            // 地图配置
            oMapOption: {
                zoomControl: false,
                layers: [],
                center: new L.LatLng(30.55072, 114.29471),
                zoom: 10
            },

            //瓦片参数
            oTileOption: {
                maxZoom: 18,
                minZoom: 3,
                attribution: 'Map &copy;GB-20263—2018 <a target="_blank" href="#">电子地图</a> '
            },

            // 加载的瓦片,依据快捷方式加载
            anLoadTile: [4, 5, 6, 9, 10, 11, 12],

            // 地图图层提供者
            oProvider: L.MapLib.MapMaster.TileProvider,

            nMapWidth: 600,
            nMapHeight: 500

        },

        // 一下参数是一些常量
        cDiv: 'div',

        // 地图的宽度,常量
        //nMapW: 600,

        // 地图的高度，常量
        //nMapH: 500,

        //对象的构造函数,oParent为外部对象
        initialize: function (oParent, oOption) {
            L.setOptions(this, oOption);

            // 加载外部page数据
            this._oParent = oParent;


            // 加载的图层数据
            this._oBaseLayer = {};
            // 默认图层
            this._oDefaultTile = undefined;
            // 加载图层
            this._initTile();

            this._getDefaultLayer();

            return this;
        },


        //一下为公共方法，地图有创建容器，或者在已经有的容器中添加数据

        //获得默认的瓦片设置
        getDefaultTile: function () {
            var cName = this.options.oProvider[this.options.nDefaultTile].cName;
            return this._oBaseLayer[cName];
        },

        //外部要重写此方法 当前html加载到页面中后触发
        loadMapMaster: function () {

            this._loadMap();
            return this;
        },

        //获得地图控件
        getMap: function () {
            return this._oMap;
        },

        //设置基本图层，外部可以获取当前图层瓦片
        getBaseLayers: function () {

            if (!this._oBaseLayer) {
                throw new Error(L.MapLib.MapMaster.Err[1]);
            }

            return this._oBaseLayer;
        },


        //一下为私有方法，不对外公布，如果对外公布，请去掉 "_"

        //获得默认的图层设置
        _getDefaultLayer: function () {

            var cName = this.options.oProvider[this.options.nDefaultTile].cName;

            this._oDefaultTile = this._oBaseLayer[cName];
            return this._oDefaultTile;
        },

        //加载地图
        _loadMap: function () {

            // 首先要判断是否有地图div ，没有就在地图容器中加载div
            var oDiv = L.DomUtil.get(this.options.cDidId);

            var nWidth = this.options.nMapWidth;
            var nHeight = this.options.nMapHeight;

            if (!oDiv) {

                var oContainer = L.DomUtil.get(this.options.cDivContainerId);
                if (!oContainer) {

                    throw new Error(L.MapLib.MapMaster.Err[2]);
                }

                oDiv = L.DomUtil.create(this.cDiv, '', oContainer);
            }

            oDiv.style.width = nWidth + 'px';
            oDiv.style.height = nHeight + 'px';
            oDiv.id = this.options.cDidId;

            L.Util.extend(this.options.oMapOption, {layers: [this._oDefaultTile]});

            var oMap = this._oMap = new L.Map(this.options.cDidId, this.options.oMapOption);

            if (this._oParent) {
                if (this._oParent.setMap) {
                    this._oParent.setMap(oMap);
                }
                this._oParent.fire('Map:loadFinish', {oMap: oMap});

                this.fire('Map:loadFinish', {oMap: oMap});
            }

            return oMap;
        },

        // 初始化 瓦片数据
        _initTile: function () {

            var oOption = L.extend({}, this.options.oTileOption);
            var oProvider = this.options.oProvider;
            var anLoadTile = this.options.anLoadTile;

            if (!anLoadTile || anLoadTile.length <= 0) {
                return;
            }

            if (!oProvider) {
                return;
            }

            var oBaseLayer = {};
            for (var i = 0; i < anLoadTile.length; i++) {
                var oTemp = oProvider[anLoadTile[i]];
                oOption.maxZoom = oTemp.nMaxLevel || oOption.maxZoom;
                oOption.minZoom = oTemp.nMinLevel || oOption.minZoom;
                oOption.subdomains = oTemp.acSubdomains;

                var oTile = L.tileLayer(oTemp.cMap, oOption);

                oBaseLayer[oTemp.cName] = oTile;
            }

            this._oBaseLayer = oBaseLayer;

            if (this._oParent) {
                this._oParent.fire('Map:loadTileFinish', {oBaseLayer: oBaseLayer});
            }

            this.fire('Map:loadTileFinish', {oBaseLayer: oBaseLayer});

        },

        reflesh: function (nW, nH) {
            if (!this._oMap) {
                return;
            }
            var oContainer = this._oMap.getContainer();
            if (nW) {
                oContainer.style.width = nW + 'px';
            }
            if (nH) {
                oContainer.style.height = nH + 'px';
            }

            this._oMap._onResize();
        },

    });

// 地图容器的扩展 给地图容器添加控件容器，不用地图自带的容器
    L.MapLib.MapMaster.Map.include({

        cTopLeftConfig: {
            div: {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'}

        },

        cTopRightConfig: {
            div: {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'}

        },

        // 一种是自带的容器，一种是系统默认的容器
        initTopLeft: function (cHtml) {

            var oDiv = L.DomUtil.get(this.options.cDidId);
            if (!oDiv) {
                return;
            }
            // 初始化结构
            if (!cHtml) {
                L.Util.initTag(oDiv, this.cTopLeftConfig);
            } else {
                L.Util.initTag(oDiv, cHtml);
            }
        },

        initTopRight: function () {


        },

    });

    /**
     * Created by liulin on 2016/11/23.
     */

    L.MapLib.MapMaster.MapOpr =  L.Evented.extend({

        options: {

            // 飞行的最大图层
            nFlyZoom: 10,

            // 飞行的延时
            nFlyDuration: 3,

            // 允许飞行的做到图层
            nFlyMaxZoom: 15,

            // 地图飞行版本
            cFlayMapVertion: '1.0'
        },



        /**
         功能描述：页面的构造函数
         @oParent：父亲级容器，可以监听全局事件的容器
         @oOption：外部参赛设置
         */
        initialize: function (oParent, oOption,oMap) {
            oOption = L.setOptions(this, oOption);

            this._oParent = oParent;

            if( oMap && oMap instanceof L.Map ){
                this._oMap = oMap;
            }
            else
            {
                if (oParent) {
                    if (oParent._oMap &&   oParent._oMap instanceof L.Map) {
                        this._oMap = oParent._oMap;
                    } else {
                        if (oParent instanceof L.Map) {
                            this._oMap = oParent;
                        }
                        //else if (oParent.on) {
                        //oParent.on(L.MapLib.MapMaster.EventName.loadFinish, this.setMap, this);
                        //}
                    }
                }
            }
            // 添加监听事件
            this._initOn();

        },


        // 移动地图 控制 在地图 leaflet.js 1.0 b版本适用
        flyTo: function (oData, options) {
            if (!this._oMap) {
                return;
            }
            var oLatlng = null;
            if(oData.hasOwnProperty('oGpsInfo')){
                var oGpsInfo = oData.oGpsInfo;
                oLatlng = L.latLng(oGpsInfo.Lat, oGpsInfo.Lon);
            }
            if(oData instanceof  L.LatLng){
                oLatlng = oData;
            }

            if(oData.hasOwnProperty('lat') && oData.hasOwnProperty('lng')){
                oLatlng = L.latLng(oData.lat, oData.lng);
            }
            if(oData.hasOwnProperty('Lat') && oData.hasOwnProperty('Lng')){
                oLatlng = L.latLng(oData.Lat, oData.Lng);
            }

            if (L.version < this.options.cFlayMapVertion) {
                return;
            }
            // 防止地图抖动问题
            if (this._oMap.getBounds().contains(oLatlng) && this._oMap.getZoom() >= this.options.nFlyMaxZoom) {
                this._oMap.panTo(oLatlng);
                return;
            }
            this._oMap.flyTo(oLatlng, options.zoom || this.options.nFlyZoom, {duration: options.duration || this.options.nFlyDuration});
            return this;
        },

        // 刷新地图
        reflesh: function () {
            if (!this._oMap) {

                return;
            }

            this._oMap._onResize();
            return this;
        },

        //添加功能图层查找

        //在当前图层分组中查找图层，图层是根据终端号来查找的
        findLayer: function (oGroupLayer, cId) {
            if (!oGroupLayer || oGroupLayer.getLayers().length <= 0) {
                return null;
            }

            var aoLayer = oGroupLayer.getLayers();

            for (var oLayer in aoLayer) {
                if (aoLayer[oLayer].cId === cId) {
                    return aoLayer[oLayer];
                }
            }

            return null;
        },

        //在地图范围内查找图层
        findLayerInMap: function (cId) {
            if (!this._oMap) {
                return null;
            }

            var oLayer = this._oMap._layers;

            if (!oLayer) {
                return null;
            }
            var aoLayer = [];
            for (var cKey in oLayer) {
                if (oLayer[cKey].cId === cId) {
                    aoLayer.push(oLayer[cKey]);
                }
            }
            return aoLayer;
        },

        // 判断点在屏幕内
        posInSrceen: function (oLatLng) {
            if (!this._oMap) {
                return false;
            }

            var oBound = this._oMap.getBounds();
            return oBound.contains(oLatLng);
        },

        // 空点， 用于显示 label 信息
        _drawTip: function (oLatLng, oTemp) {
            var oOption = {
                cId: '1',
                cName: '测试tip',
                bNoHide: true,
            };

            L.Util.extend(oOption, oTemp);

            var oIcon = new L.DivIcon({
                html: '<div> </div>',
                className: '',
            });

            var oMarker = L.marker(oLatLng, {icon: oIcon, bIsNotEdit: true});
            oMarker.cId = 'TM_' + oOption.cId;

            //给oMarker绑定tip
            oMarker.bindLabel(oOption.cName, {noHide: oOption.bNoHide, direction: 'auto'});

            return oMarker;
        },


        /*
         功能描述：手动设置地图，如果用户不用默认地图对象时，需要手动设置地图，
         @oMap：设置的地图对象
         */
        setMap: function (oMap) {
            if (oMap instanceof L.Map) {
                this._oMap = oMap;
            }
            return this;
        },


        /*
         功能描述：删除不在屏幕范围内的点数据
         @aoPos：点数据对象数值如[{lat:30.233,lng:114.32}]
         @oBound：地图对象屏幕区间范围，如果为空取地图范围
         */
        delPosNotInScreen: function (aoPos, oBound) {
            if (!aoPos || aoPos.length <= 0) {
                return;
            }
            if (!oBound) {
                oBound = this.oMap.getBounds();
            }

            for (var i = (aoPos.length - 1); i >= 0; i--) {
                var oLatLng = L.latLng(aoPos[i].oLatLng.lat, aoPos[i].oLatLng.lng);
                if (!oBound.contains(oLatLng)) {
                    //数组中删除点
                    aoPos.splice(i, 1);
                }
            }
            return this;
        },

        //-- 私有方法

        // 加载地图图层
        _loadPage: function () {

        },


        _initOn: function () {

        },

    });

///**
// * Created by liulin on 2016/11/23.
// */
//
//L.MapLib.Control = {};
//L.MapLib.Control.vertion = '0.1.0';
//L.MapLib.Control.Config = {
//
//    regionSwitch: '区域',
//    deptName: '武汉',
//};
//
//


///**
// * Created by liulin on 2016/11/23.
// *
// *
// */
//
//L.MapLib.Control.Region = L.Control.extend({
//
//    options: {
//        position: 'topleft',
//        className:'es-map-tool',
//        autoZIndex: true,
//    },
//
//    oUIInfo: {
//        'class': 'mapLocation map-t-box',
//        div: {
//            'class': 'col-md-6',
//            div: [
//                {
//                    'class': 'ui-dropdown item',
//                    style: 'cursor: default;float: left;  margin-top: 1em;',
//                    i: {'class': 'icon-pointer', html: L.MapLib.Control.Config.regionSwitch}
//                },
//                {
//                    'class': 'ui-dropdown item  localCenter',
//                    style: "width: 7em;text-overflow: ellipsis;line-height: 3em;float: left;",//overflow: hidden;
//                    span: {cid: 'divCenterPos', html: L.MapLib.Control.Config.deptName + '&nbsp;',},
//                    i: {'class': 'fa fa-angle-down'},
//                    div: {
//                        cid: 'divMapCenter',
//                        'class': 'map-loaction sub-menu',
//                        style: "display:none",
//                    }
//                }]
//        }
//    },
//
//    // 注册事件
//    initEvent: function () {
//
//    },
//
//    // 添加控件
//    onAdd: function (map) {
//        //
//        this.map = map;
//        // 容器
//        this.controlDiv = L.DomUtil.create('div', this.options.className);
//        //初始化容器
//        L.Util.initTag( this.controlDiv , this.oUIInfo);
//
//
//        return this.controlDiv;
//    },
//
//
//
//
//});

    /**
     * Created by liulin on 2016/12/26.
     *
     * 负责管理整个界面的布局,如果有布局，就不用加载，直接加载地图
     *
     *
     */
    L.MapLib.MapControl = {};

    L.MapLib.MapControl.Layout = L.Evented.extend({

        oOption: {
            cPContainer: '.ex-layout-content',
            cDidId: 'MapView',
        },

        initialize: function (oParent, oOption) {

            ES.setOptions(this, oOption);
            this._oParent = oParent;


            this.$_oPContainer = oOption.cPContainer;
            if (typeof oOption.cContainerSel !== 'object') {
                this.$_oPContainer = $(this.oOption.cPContainer);
            }

            // 初始化界面
            this.initUI();

            // 添加项
            this.initOn();

        },

        initUI: function () {
            this.$_oContainer = $(this.cHTML);
            this.$_oContainer.attr({'id': this.oOption.cDidId});
            this.$_oPContainer.append(this.$_oContainer);
        },

        initOn: function () {
            if (!this._oParent) {
                return;
            }
            this._oParent.on('MapControl:Layout.addToolItem', this.addToolItem, this);

        },

        addToolItem: function (oData) {
            this._addToolItem(oData.cHTML);
        },

        // 添加项
        _addToolItem: function (cHTML) {
            var $_oItem = $(cHTML);
            this.$_oContainer.append($_oItem);
        },

        // 获取宽度
        getWidth: function () {
            return this.$_oContainer.width();
        },

        dueWidth: function (nWidth) {
            this.$_oContainer.width(this.$_oContainer.width() - nWidth);
        },

        // 设置grid宽度
        setWidth: function (nWidth) {
            this.$_oContainer.width(nWidth);
        },
    });

// 地图容器 和 相关的布局要求
    L.MapLib.MapControl.Layout.include({

        cHTML:
        '<div  class="ex-layout-map-content">' +
        '    <div class="ex-layout-type-wbox ex-map-bottom ex-map-right"></div>' +
        '    <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left  ec-padding-0">   </div>' +
        '    <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right"></div>' +
        '    <div class="ex-layout-monitor-wbox">  </div>' +
        ' </div>'
    });

﻿
    /*
     name:           ESMapEdit
     des:            地图图层编辑，创建图形和画图形

     引用的库为 leaflet.draw-master.js

     对围栏进行编辑

     */



    L.MapLib.MapControl.ESMapEdit = L.Evented.extend({

        oOption: {
            // 父级容器
            cParentDiv: 'MapView',
            acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left','ex-maptool-edit'],
            cBtnContain: '.ex-map-tool-edit',
            className: '',
            title: '图层编辑',
            oPenStyle: {
                stroke: true,
                color: '#0FFF05',
                dashArray: null,
                lineCap: null,
                lineJoin: null,
                weight: 3,
                opacity: 1,
                fill: true,
                fillColor: null,
                fillOpacity: 0.2,
                clickable: true,
                smoothFactor: 1.0,
                noClip: false

            },
        },

        oUIConfig: {
            div: {
                'class': 'ex-maptool-box',
                ul: {
                    'class': 'ec-avg-sm-1 ex-map-tool-edit',
                    li: [
                        {a: {href: 'javascript:void(0);', i: {'class': 'ec-icon-plus'}, html: '&nbsp;绘制'}},
                        {a: {href: 'javascript:void(0);', i: {'class': 'ec-icon-pencil'}, html: '&nbsp;编&nbsp;&nbsp;辑'}},
                        {a: {href: 'javascript:void(0);', i: {'class': 'ec-icon-power-off'}, html: '&nbsp;删&nbsp;&nbsp;除'}},
                        {a: {href: 'javascript:void(0);', i: {'class': 'ec-icon-save'}, html: '&nbsp;确&nbsp;&nbsp;定'}},
                        {
                            a: {
                                href: 'javascript:void(0);',
                                'class': 'ex-map-tool-cancel',
                                i: {'class': 'ec-icon-ban'},
                                html: '&nbsp;取&nbsp;&nbsp;消'
                            }
                        }
                    ]
                }
            }
        },

        // 构造函数
        initialize: function (oMapBase, options) {
            L.extend(this.oOption, options);
            this.oPenStyle = this.oOption.oPenStyle;
            // 获得地图控件
            this._oMapBase = oMapBase;
            this._oMap = oMapBase._oMap;

            // 添加编辑图层
            this._oDrawLayer = L.featureGroup();
            this._oDrawLayer.addTo(this._oMap);

            this._oContainer = $('.' + this.oOption.acParentDivClass.join('.'));

            this.cFlag = 'add';

            // 设置父级容器的事件，是为了屏蔽地图的操作
            this.setParentEvent();


            // 初始化画笔
            this.initPen();

            // 初始化界面
            this.initUI();

            // 加载地图回调函数
            this.initCallBack();

            this.initOn();

        },

        // 注册监听事件
        initOn: function () {
            // 触发显示编辑按钮，并默认画
            this._oMapBase._oParent.on('ESMapEdit:showEditDraw', this.showEditAdd, this);
            this._oMapBase._oParent.on('ESMapEdit:clearLayers', this.clearLayers, this);

            // 删除围栏时要这的事情
            this._oMapBase._oParent.on('ESMapEdit:deleteFence', this.deleteFence, this);
            this._oMapBase._oParent.on('ESMapEdit:editDraw', this.editDraw, this);


        },

        // 编辑围栏数据,画围栏时要表明自己的名称
        editDraw: function (oData) {
            //画线加载时，加载图标
            this.cFlag = 'edit';
            var aX = oData.MapX.split(',');
            var aY = oData.MapY.split(',');
            if (!aX || !aY || aX.length <= 0) {
                return;
            }
            var aoLatLng = [];
            for (var i = 0; i < aX.length; i++) {
                var oLatLng = L.latLng(parseFloat(aY[i]), parseFloat(aX[i]));
                aoLatLng.push(oLatLng);
            }

            var oVehLine = L.polygon(aoLatLng, this.oPenStyle).addTo(this._oDrawLayer);

            oVehLine.cId = oData.Id;
            oVehLine.oFenceInfo = oData;


            oVehLine.bindTooltip(oData.Name).openTooltip();
            //oVehLine.oTip = oTip;
            this.fitBound();

            // 点击编辑时 控制按钮显示，显示编辑，其他隐藏
            this.$_btnPlus.hide();
            this.$_btnEdit.show();
            this.$_btnDel.show();
            this.$_btnCal.hide();
            this.$_btnSave.hide();
            this.dealEditUI();
        },

        fitBound: function () {
            if (!this._oDrawLayer) return;
            var oBound = this._oDrawLayer.getBounds();
            this._oMap.fitBounds(oBound);
        },

        // 画tip
        drawTip: function (oTemp) {
            var oOption = {
                bIsNotEdit: true,
                cName: '测试tip显示名称',
                oLatLng: {lat: 30.333, lng: 113.333},
                bNoHide: true
            };
            L.extend(oOption, oTemp);
            var oIcon = new L.DivIcon({
                html: '<div> </div>',
                className: '',
            });

            var oMarker = L.marker(oOption.oLatLng, {icon: oIcon, bIsNotEdit: oOption.bIsNotEdit});
            oMarker.cId = oOption.cId;

            //给oMarker绑定tip
            oMarker.bindLabel(oOption.cName, {noHide: oOption.bNoHide, direction: 'auto'});
            return oMarker;
        },

        deleteFence: function () {
            this._oDrawLayer.clearLayers();
            this.$_btnCal.hide();
            this.$_btnEdit.hide();
            this.dealEditUI();
        },

        clearLayers: function () {
            this._oDrawLayer.clearLayers();

            // 隐藏取消按钮
            this.$_btnCal.hide();
            this.dealEditUI();
        },

        showEditAdd: function () {
            this.cFlag = 'add';

            this.show();
            this.clearLayers();
            $(this.oOption.cBtnContain).find('.ec-icon-plus').parent().click();

        },

        // 显示编辑框
        show: function () {
            this._oContainer.find('.ex-maptool-box').show();
        },

        // 隐藏编辑框
        hide: function () {
            this._oContainer.find('.ex-maptool-box').hide();
        },

        // 界面处理
        dealEditUI: function () {
            var aoA = this._oContainer.find('.ex-maptool-box').find('a');
            var bShow = false;
            for (var i = 0; i < aoA.length; i++) {
                if ($(aoA[i]).css('display') !== 'none') {
                    bShow = true;
                }
            }

            if (!bShow) {
                this.hide();
            }
            else {
                this.show();
            }
        },

        // 初始化画笔控件
        initPen: function () {

            // 画笔
            this.oDrawPen = {
                enabled: {shapeOptions: this.oPenStyle},
                handler: new L.Draw.Polygon(this._oMap, {shapeOptions: this.oPenStyle}),
                title: L.drawLocal.draw.toolbar.buttons.polygon
            };

            // 画笔
            this.oEditPen = {
                enabled: this.oPenStyle,
                handler: new L.EditToolbar.Edit(this._oMap, {
                    featureGroup: this._oDrawLayer,
                    selectedPathOptions: {
                        dashArray: '10, 10',
                        fill: true,
                        fillColor: '#fe57a1',
                        fillOpacity: 0.1,
                        maintainColor: false
                    },
                    poly: {allowIntersection: false}
                }),
                title: L.drawLocal.edit.toolbar.buttons.edit
            };
        },

        // 设置父级容器的事件
        setParentEvent: function () {

            ////屏蔽事件
            //L.DomEvent.addListener(this._oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
            //L.DomEvent.addListener(this._oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
            //L.DomEvent.addListener(this._oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

        },

        //加载工具事件，初始化工具栏
        initUI: function () {

            L.initTag(this._oContainer, this.oUIConfig);

            this.initEven();
            var cBtnContain = this.oOption.cBtnContain;

            this.$_btnPlus = $(cBtnContain).find('.ec-icon-plus').parent();
            this.$_btnEdit = $(cBtnContain).find('.ec-icon-pencil').parent();
            this.$_btnCal = $(cBtnContain).find('.ec-icon-ban').parent();
            this.$_btnSave = $(cBtnContain).find('.ec-icon-save').parent();
            this.$_btnDel = $(cBtnContain).find('.ec-icon-power-off').parent();

            this.$_btnPlus.hide();
            this.$_btnEdit.hide();
            this.$_btnCal.hide();
            this.$_btnSave.hide();
            this.$_btnDel.hide();
            this.dealEditUI();


        },

        //初始化工具栏事件
        initEven: function () {
            var self = this;

            // 对象
            $(this.oOption.cBtnContain).find('.ec-icon-plus').parent().bind('click', function () {
                self.oDrawPen.handler.enable();

                self.$_btnPlus.hide();
                self.$_btnSave.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.show();
                self.dealEditUI();
            });

            // 确定修改
            $(this.oOption.cBtnContain).find('.ec-icon-save').parent().bind('click', function () {
                // 触发结束编辑
                self.oEditPen.handler.save();
                self.oEditPen.handler.disable();
                // 清除图层
                //self._oDrawLayer.clearLayers();

                // 点击确定 隐藏自身、取消、编辑
                self.$_btnPlus.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.hide();
                $(this).hide();
                self.dealEditUI();

            });

            // 编辑
            $(this.oOption.cBtnContain).find('.ec-icon-pencil').parent().bind('click', function () {

                // 点击编辑隐藏自身，和添加功能，显示确定和取消
                $(self.oOption.cBtnContain).find('.ec-icon-plus').parent().hide();

                self.$_btnSave.show();
                $(self.oOption.cBtnContain).find('.ec-icon-ban').parent().show();
                $(this).hide();
                self.dealEditUI();
                self.oEditPen.handler.enable();
            });

            // 取消
            $(this.oOption.cBtnContain).find('.ec-icon-ban').parent().bind('click', function () {

                $(this).hide();

                if (self.cFlag === 'add') {
                    // 全部隐藏
                    self.$_btnPlus.hide();
                    self.$_btnSave.hide();
                    self.$_btnEdit.hide();
                    self.$_btnCal.hide();
                }

                if (self.cFlag === 'edit') {
                    self.$_btnPlus.hide();
                    self.$_btnSave.hide();
                    self.$_btnEdit.show();
                    self.$_btnCal.hide();
                }

                self.oDrawPen.handler.disable();
                // 撤销修改
                self.oEditPen.handler.revertLayers();
                self.oEditPen.handler.disable();

                self.dealEditUI();
            });

            // 删除
            $(this.oOption.cBtnContain).find('.ec-icon-power-off').parent().bind('click', function () {

                $(this).hide();

                if (self.cFlag === 'add') {
                    // 全部隐藏
                    self.$_btnPlus.hide();
                    self.$_btnSave.hide();
                    self.$_btnEdit.hide();
                    self.$_btnCal.hide();
                }

                if (self.cFlag === 'edit') {
                    self.$_btnPlus.hide();
                    self.$_btnSave.hide();
                    self.$_btnEdit.show();
                    self.$_btnCal.hide();
                }

                if (self.cFlag === 'del') {

                }

                self.oDrawPen.handler.disable();
                // 撤销修改
                self.oEditPen.handler.revertLayers();
                self.oEditPen.handler.disable();

                self.dealEditUI();
            });
        },

        initCallBack: function () {
            var self = this;

            this._oMap.on('draw:created', function (e) {

                var oLayer = e.layer;

                self._oDrawLayer.addLayer(oLayer);
                var oInfo = self._getGisObj(oLayer);
                self._oMapBase._oParent.fire('FenceView:UI.addFence', oInfo);

            });

            this._oMap.on('draw:edited', function (e) {

                var aoLayer = e.layers;
                aoLayer.eachLayer(function (oLayer) {
                    var oInfo = self._getGisObj(oLayer);
                    self._oDrawLayer.addLayer(oLayer);
                    oInfo.cId = oLayer.cId;
                    oInfo.oFenceInfo = oLayer.oFenceInfo;
                    self._oMapBase._oParent.fire('FenceView:UI.updateFence', oInfo);

                });
            });
        },

        // 获得所有画的model
        getDrawModeHandlers: function () {

            return [
                {
                    enabled: this.options.polyline,
                    handler: new L.Draw.Polyline(this._oMap, this.options.polyline),
                    title: L.drawLocal.draw.toolbar.buttons.polyline
                },
                {
                    enabled: {shapeOptions: this.oPenStyle},
                    handler: new L.Draw.Polygon(this._oMap, {shapeOptions: this.oPenStyle}),
                    title: L.drawLocal.draw.toolbar.buttons.polygon
                },
                {
                    enabled: this.options.rectangle,
                    handler: new L.Draw.Rectangle(this._oMap, this.options.rectangle),
                    title: L.drawLocal.draw.toolbar.buttons.rectangle
                },
                {
                    enabled: this.options.circle,
                    handler: new L.Draw.Circle(this._oMap, this.options.circle),
                    title: L.drawLocal.draw.toolbar.buttons.circle
                },
                {
                    enabled: this.options.marker,
                    handler: new L.Draw.Marker(this._oMap, this.options.marker),
                    title: L.drawLocal.draw.toolbar.buttons.marker
                }
            ];
        },

        // 获得所有的编辑model
        getEditModeHandlers: function () {

            return [
                {
                    enabled: this.oPenStyle,
                    handler: new L.EditToolbar.Edit(this._oMap, {
                        featureGroup: this._oDrawLayer,
                        selectedPathOptions: this.options.edit.selectedPathOptions,
                        poly: this.options.poly
                    }),
                    title: L.drawLocal.edit.toolbar.buttons.edit
                },
                {
                    enabled: {},
                    handler: new L.EditToolbar.Delete(this._oMap, {
                        featureGroup: this._oDrawLayer
                    }),
                    title: L.drawLocal.edit.toolbar.buttons.remove
                }
            ];
        },

        // 获得编辑对象
        _getGisObj: function (oLayer) {
            var oInfo = {};
            //var nZoom = this._oMap.getZoom();
            var oOption = oLayer.options;

            //if (oLayer.options.hasOwnProperty('original')) {
            //    oOption = L.extend({}, oLayer.options.original)
            //}

            if (oLayer instanceof L.Circle) {
                //还要取一个经纬度
                //var oBound = oLayer.getBounds();
                var oLatLng = oLayer.getLatLng();
                var oLatLngTemp = L.latLng([oLatLng.lat + oLayer._getLatRadius(), oLatLng.lng]);
                oInfo = {
                    aoLatLng: [oLatLng, oLatLngTemp],
                    dRadius: oLayer.getRadius(),
                    oOption: oOption,
                    nType: this.getObjType(oLayer)
                };
            }
            else {

                oInfo = {aoLatLng: oLayer.getLatLngs(), oOption: oOption, nType: this.getObjType(oLayer)};
            }

            return oInfo;
        },

        getObjType: function (oLayer) {
            if (oLayer instanceof L.Rectangle) {
                return 3;
            }
            if (oLayer instanceof L.Polygon) {
                return 1;
            }
            if (oLayer instanceof L.Polyline) {
                return 4;
            }
            if (oLayer instanceof L.Circle) {
                return 2;
            }
            return 1;
        }

    });




    /**
     * Created by liulin on 2016/12/22.
     */

    L.MapLib.MapControl.ESPOpMapEdit = L.MapLib.MapControl.ESMapEdit.extend({

        //初始化工具栏事件
        initEven: function () {
            var self = this;

            // 对象
            $(this.oOption.cBtnContain).find('.ec-icon-plus').parent().bind('click', function () {
                self.oDrawPen.handler.enable();

                self.$_btnPlus.hide();
                self.$_btnSave.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.show();
                self.$_btnDel.hide();
                self.dealEditUI();
            });

            // 确定修改
            $(this.oOption.cBtnContain).find('.ec-icon-save').parent().bind('click', function () {
                // 触发结束编辑
                self.oEditPen.handler.save();
                self.oEditPen.handler.disable();
                // 清除图层
                //self._oDrawLayer.clearLayers();

                // 点击确定 隐藏自身、取消、编辑
                self.$_btnPlus.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.hide();
                $(this).hide();
                self.dealEditUI();

            });

            // 编辑
            $(this.oOption.cBtnContain).find('.ec-icon-pencil').parent().bind('click', function () {

                // 点击编辑隐藏自身，和添加功能，显示确定和取消
                $(self.oOption.cBtnContain).find('.ec-icon-plus').parent().hide();

                self.$_btnSave.show();
                $(self.oOption.cBtnContain).find('.ec-icon-ban').parent().show();
                $(this).hide();
                self.$_btnDel.hide();
                self.dealEditUI();
                self.oEditPen.handler.enable();
            });

            $(this.oOption.cBtnContain).find('.ec-icon-ban').parent().bind('click', function () {

                $(this).hide();

                if (self.cFlag === 'add') {
                    // 全部隐藏
                    self.$_btnPlus.show();
                    self.$_btnSave.hide();
                    self.$_btnEdit.hide();
                    self.$_btnCal.hide();
                    self.$_btnDel.hide();
                    self.clearLayers();
                }

                if (self.cFlag === 'edit') {
                    self.$_btnPlus.hide();
                    self.$_btnSave.hide();
                    self.$_btnEdit.show();
                    self.$_btnCal.hide();
                    self.$_btnDel.hide();
                }

                self.oDrawPen.handler.disable();
                // 撤销修改
                self.oEditPen.handler.revertLayers();
                self.oEditPen.handler.disable();

                self.dealEditUI();
            });
            // 删除
            $(this.oOption.cBtnContain).find('.ec-icon-power-off').parent().bind('click', function () {

                $(this).hide();

                if (self.cFlag === 'add') {
                    // 全部隐藏
                    self.$_btnPlus.hide();
                    self.$_btnSave.hide();
                    self.$_btnEdit.hide();
                    self.$_btnCal.hide();
                    self.$_btnDel.hide();
                }

                if (self.cFlag === 'edit') {
                    self.$_btnPlus.show();
                    self.$_btnSave.hide();
                    self.$_btnEdit.hide();
                    self.$_btnCal.hide();
                    self.$_btnDel.hide();
                }


                self.deleteFence();
                //self.oDrawPen.handler.disable();
                // 撤销修改
                //self.oEditPen.handler.revertLayers();
                //self.oEditPen.handler.disable();

                self.dealEditUI();
            });
        },

        // 添加数据
        addFence: function () {
            this.$_btnPlus.show();
            this.$_btnSave.hide();
            this.$_btnEdit.hide();
            this.$_btnCal.hide();
            this.dealEditUI();
        },

        initCallBack: function () {
            var self = this;

            this._oMap.on('draw:created', function (e) {

                var oLayer = e.layer;

                self._oDrawLayer.addLayer(oLayer);
                var oInfo = self._getGisObj(oLayer);
                self._oMapBase._oParent.fire('FenceView:UI.addFence', oInfo);
                self.fire('FenceView:UI.addFence', oInfo);
            });

            this._oMap.on('draw:edited', function (e) {

                var aoLayer = e.layers;
                aoLayer.eachLayer(function (oLayer) {
                    var oInfo = self._getGisObj(oLayer);
                    self._oDrawLayer.addLayer(oLayer);
                    oInfo.cId = oLayer.cId;
                    oInfo.oFenceInfo = oLayer.oFenceInfo;

                    self._oMapBase._oParent.fire('FenceView:UI.updateFence', oInfo);
                    self.fire('FenceView:UI.updateFence', oInfo);
                });
            });
        },

    });

    /**
     * 对点进行编辑
     *
     * Created by liulin on 2017/2/27.
     */



    L.MapLib.MapControl.MapEditPos = L.Evented.extend({

        oOption: {
            // 父级容器
            cParentDiv: 'MapView',
            acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left','ex-maptool-edit'],
            cBtnContain: '.ex-map-tool-edit',
            className: '',
            title: '图层编辑',
            oPenStyle: {
                stroke: true,
                color: '#0FFF05',
                dashArray: null,
                lineCap: null,
                lineJoin: null,
                weight: 3,
                opacity: 1,
                fill: true,
                fillColor: null,
                fillOpacity: 0.2,
                clickable: true,
                smoothFactor: 1.0,
                noClip: false

            },
        },

        oUIConfig: {
            div: {
                'class': 'ex-maptool-box',
                ul: {
                    'class': 'ec-avg-sm-1 ex-map-tool-edit',
                    li: [
                        {a: {href: 'javascript:void(0);', i: {'class': 'ec-icon-plus'}, html: '&nbsp;画点'}},
                        {a: {href: 'javascript:void(0);', i: {'class': 'ec-icon-pencil'}, html: '&nbsp;编&nbsp;&nbsp;辑'}},
                        {a: {href: 'javascript:void(0);', i: {'class': 'ec-icon-power-off'}, html: '&nbsp;删&nbsp;&nbsp;除'}},
                        {a: {href: 'javascript:void(0);', i: {'class': 'ec-icon-save'}, html: '&nbsp;确&nbsp;&nbsp;定'}},
                        {
                            a: {
                                href: 'javascript:void(0);',
                                'class': 'ex-map-tool-cancel',
                                i: {'class': 'ec-icon-ban'},
                                html: '&nbsp;取&nbsp;&nbsp;消'
                            }
                        }
                    ]
                }
            }
        },

        // 构造函数
        initialize: function (oMapBase, options) {

            L.extend(this.oOption, options);
            this.oPenStyle = this.oOption.oPenStyle;
            // 获得地图控件
            this._oMapBase = oMapBase;
            this._oMap = oMapBase._oMap;

            // 添加编辑图层
            this._oDrawLayer = L.featureGroup();
            this._oDrawLayer.addTo(this._oMap);

            this._oContainer = $('.' + this.oOption.acParentDivClass.join('.'));

            this.cFlag = 'add';

            // 设置父级容器的事件，是为了屏蔽地图的操作
            this.setParentEvent();


            // 初始化画笔
            this.initPen();

            // 初始化界面
            this.initUI();

            // 加载地图回调函数
            this.initCallBack();

            this.initOn();

        },

        // 注册监听事件
        initOn: function () {
            // 触发显示编辑按钮，并默认画
            this._oMapBase._oParent.on('ESMapEdit:showEditDraw', this.showEditAdd, this);
            this._oMapBase._oParent.on('ESMapEdit:clearLayers', this.clearLayers, this);

            // 删除围栏时要这的事情
            this._oMapBase._oParent.on('ESMapEdit:deleteFence', this.deleteFence, this);
            this._oMapBase._oParent.on('ESMapEdit:editDraw', this.editDraw, this);


        },

        // 编辑围栏数据,画围栏时要表明自己的名称
        editDraw: function (oData) {
            //画线加载时，加载图标
            this.cFlag = 'edit';

            var oLatLng = L.latLng(parseFloat( oData.MapY), parseFloat(oData.MapX));
            var oVehLine = L.marker(oLatLng, {}).addTo(this._oDrawLayer);

            oVehLine.cId = oData.Id;
            oVehLine.oFenceInfo = oData;

            if(oData.Name){
                oVehLine.bindTooltip(oData.Name).openTooltip();
            }

            //this.fitBound();
            this._oMap.flyTo(oLatLng);
            // 点击编辑时 控制按钮显示，显示编辑，其他隐藏
            this.$_btnPlus.hide();
            this.$_btnEdit.show();
            this.$_btnDel.show();
            this.$_btnCal.hide();
            this.$_btnSave.hide();
            this.dealEditUI();
        },

        fitBound: function () {
            if (!this._oDrawLayer) return;
            var oBound = this._oDrawLayer.getBounds();
            this._oMap.fitBounds(oBound);
        },

        deleteFence: function () {
            this._oDrawLayer.clearLayers();
            this.$_btnCal.hide();
            this.$_btnEdit.hide();
            this.dealEditUI();
        },

        clearLayers: function () {
            this._oDrawLayer.clearLayers();

            // 隐藏取消按钮
            this.$_btnCal.hide();
            this.dealEditUI();
        },

        showEditAdd: function () {
            this.cFlag = 'add';

            this.show();
            this.clearLayers();
            $(this.oOption.cBtnContain).find('.ec-icon-plus').parent().click();

        },

        // 显示编辑框
        show: function () {
            this._oContainer.find('.ex-maptool-box').show();
        },

        // 隐藏编辑框
        hide: function () {
            this._oContainer.find('.ex-maptool-box').hide();
        },

        // 界面处理
        dealEditUI: function () {
            var aoA = this._oContainer.find('.ex-maptool-box').find('a');
            var bShow = false;
            for (var i = 0; i < aoA.length; i++) {
                if ($(aoA[i]).css('display') === 'block') {
                    bShow = true;
                }
            }

            if (!bShow) {
                this.hide();
            }
            else {
                this.show();
            }
        },

        // 初始化画笔控件
        initPen: function () {

            // 画笔
            this.oDrawPen = {
                enabled: {shapeOptions: this.oPenStyle},
                handler: new L.Draw.Marker(this._oMap, {shapeOptions: this.oPenStyle}),
                title: L.drawLocal.draw.toolbar.buttons.marker
            };

            // 画笔
            this.oEditPen = {
                enabled: this.oPenStyle,
                handler: new L.EditToolbar.Edit(this._oMap, {
                    featureGroup: this._oDrawLayer,
                    selectedPathOptions: {
                        dashArray: '10, 10',
                        fill: true,
                        fillColor: '#fe57a1',
                        fillOpacity: 0.1,
                        maintainColor: false
                    },
                    poly: {allowIntersection: false}
                }),
                title: L.drawLocal.edit.toolbar.buttons.edit
            };
        },

        // 设置父级容器的事件
        setParentEvent: function () {

            ////屏蔽事件
            L.DomEvent.addListener(this._oContainer.get(0), 'click', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(this._oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(this._oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(this._oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

        },

        //加载工具事件，初始化工具栏
        initUI: function () {

            L.initTag(this._oContainer, this.oUIConfig);

            this.initEvent();
            var cBtnContain = this.oOption.cBtnContain;

            this.$_btnPlus = $(cBtnContain).find('.ec-icon-plus').parent();
            this.$_btnEdit = $(cBtnContain).find('.ec-icon-pencil').parent();
            this.$_btnCal = $(cBtnContain).find('.ec-icon-ban').parent();
            this.$_btnSave = $(cBtnContain).find('.ec-icon-save').parent();
            this.$_btnDel = $(cBtnContain).find('.ec-icon-power-off').parent();

            this.$_btnPlus.hide();
            this.$_btnEdit.hide();
            this.$_btnCal.hide();
            this.$_btnSave.hide();
            this.$_btnDel.hide();
            this.dealEditUI();


        },

        //初始化工具栏事件
        initEvent: function () {
            var self = this;

            // 对象
            $(this.oOption.cBtnContain).find('.ec-icon-plus').parent().bind('click', function () {
                self.oDrawPen.handler.enable();

                self.$_btnPlus.hide();
                self.$_btnSave.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.show();
                self.$_btnDel.hide();
                self.dealEditUI();
            });

            // 确定修改
            $(this.oOption.cBtnContain).find('.ec-icon-save').parent().bind('click', function () {
                // 触发结束编辑
                self.oEditPen.handler.save();
                self.oEditPen.handler.disable();
                // 清除图层
                //self._oDrawLayer.clearLayers();

                // 点击确定 隐藏自身、取消、编辑
                self.$_btnPlus.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.hide();
                $(this).hide();
                self.dealEditUI();

            });

            // 编辑
            $(this.oOption.cBtnContain).find('.ec-icon-pencil').parent().bind('click', function () {

                // 点击编辑隐藏自身，和添加功能，显示确定和取消
                $(self.oOption.cBtnContain).find('.ec-icon-plus').parent().hide();

                self.$_btnSave.show();
                $(self.oOption.cBtnContain).find('.ec-icon-ban').parent().show();
                $(this).hide();
                self.$_btnDel.hide();
                self.dealEditUI();
                self.oEditPen.handler.enable();
            });

            $(this.oOption.cBtnContain).find('.ec-icon-ban').parent().bind('click', function () {

                $(this).hide();

                if (self.cFlag === 'add') {
                    // 全部隐藏
                    self.$_btnPlus.show();
                    self.$_btnSave.hide();
                    self.$_btnEdit.hide();
                    self.$_btnCal.hide();
                    self.$_btnDel.hide();
                    self.clearLayers();
                }

                if (self.cFlag === 'edit') {
                    self.$_btnPlus.hide();
                    self.$_btnSave.hide();
                    self.$_btnEdit.show();
                    self.$_btnCal.hide();
                    self.$_btnDel.hide();
                }

                self.oDrawPen.handler.disable();
                // 撤销修改
                self.oEditPen.handler.revertLayers();
                self.oEditPen.handler.disable();

                self.dealEditUI();
            });
            // 删除
            $(this.oOption.cBtnContain).find('.ec-icon-power-off').parent().bind('click', function () {

                $(this).hide();

                if (self.cFlag === 'add') {
                    // 全部隐藏
                    self.$_btnPlus.hide();
                    self.$_btnSave.hide();
                    self.$_btnEdit.hide();
                    self.$_btnCal.hide();
                    self.$_btnDel.hide();
                }

                if (self.cFlag === 'edit') {
                    self.$_btnPlus.show();
                    self.$_btnSave.hide();
                    self.$_btnEdit.hide();
                    self.$_btnCal.hide();
                    self.$_btnDel.hide();
                }


                self.deleteFence();
                //self.oDrawPen.handler.disable();
                // 撤销修改
                //self.oEditPen.handler.revertLayers();
                //self.oEditPen.handler.disable();

                self.dealEditUI();
            });
        },


        addFence: function () {
            this.$_btnPlus.show();
            this.$_btnSave.hide();
            this.$_btnEdit.hide();
            this.$_btnCal.hide();
            this.dealEditUI();
        },

        // 获得所有画的model
        getDrawModeHandlers: function () {

            return [
                {
                    enabled: this.options.polyline,
                    handler: new L.Draw.Polyline(this._oMap, this.options.polyline),
                    title: L.drawLocal.draw.toolbar.buttons.polyline
                },
                {
                    enabled: {shapeOptions: this.oPenStyle},
                    handler: new L.Draw.Polygon(this._oMap, {shapeOptions: this.oPenStyle}),
                    title: L.drawLocal.draw.toolbar.buttons.polygon
                },
                {
                    enabled: this.options.rectangle,
                    handler: new L.Draw.Rectangle(this._oMap, this.options.rectangle),
                    title: L.drawLocal.draw.toolbar.buttons.rectangle
                },
                {
                    enabled: this.options.circle,
                    handler: new L.Draw.Circle(this._oMap, this.options.circle),
                    title: L.drawLocal.draw.toolbar.buttons.circle
                },
                {
                    enabled: this.options.marker,
                    handler: new L.Draw.Marker(this._oMap, this.options.marker),
                    title: L.drawLocal.draw.toolbar.buttons.marker
                }
            ];
        },

        // 获得所有的编辑model
        getEditModeHandlers: function () {

            return [
                {
                    enabled: this.oPenStyle,
                    handler: new L.EditToolbar.Edit(this._oMap, {
                        featureGroup: this._oDrawLayer,
                        selectedPathOptions: this.options.edit.selectedPathOptions,
                        poly: this.options.poly
                    }),
                    title: L.drawLocal.edit.toolbar.buttons.edit
                },
                {
                    enabled: {},
                    handler: new L.EditToolbar.Delete(this._oMap, {
                        featureGroup: this._oDrawLayer
                    }),
                    title: L.drawLocal.edit.toolbar.buttons.remove
                }
            ];
        },

        // 获得编辑对象
        _getGisObj: function (oLayer) {
            var oInfo = {};

            var oOption = oLayer.options;

            if (oLayer instanceof L.Circle) {

                var oLatLng = oLayer.getLatLng();
                var oLatLngTemp = L.latLng([oLatLng.lat + oLayer._getLatRadius(), oLatLng.lng]);
                oInfo = {
                    aoLatLng: [oLatLng, oLatLngTemp],
                    dRadius: oLayer.getRadius(),
                    oOption: oOption,
                    nType: this.getObjType(oLayer)
                };
            }
            else if(oLayer instanceof L.Marker){

                var oLatLng = oLayer.getLatLng();
                oInfo = {
                    aoLatLng: [oLatLng],
                    oOption: {},
                    nType: this.getObjType(oLayer)
                }
            }
            else {

                oInfo = {aoLatLng: oLayer.getLatLngs(), oOption: oOption, nType: this.getObjType(oLayer)};
            }

            return oInfo;
        },

        getObjType: function (oLayer) {

            if (oLayer instanceof L.Polygon) {
                return 1;
            }
            if (oLayer instanceof L.Circle) {
                return 2;
            }
            if (oLayer instanceof L.Rectangle) {
                return 3;
            }
            if (oLayer instanceof L.Polyline) {
                return 4;
            }
            if (oLayer instanceof L.Marker) {
                return 5;
            }
            return 1;
        },

        initCallBack: function () {
            var self = this;

            this._oMap.on('draw:created', function (e) {

                var oLayer = e.layer;

                self._oDrawLayer.addLayer(oLayer);
                var oInfo = self._getGisObj(oLayer);
                self._oMapBase._oParent.fire('FenceView:UI.addFence', oInfo);
                self.fire('FenceView:UI.addFence', oInfo);
            });

            this._oMap.on('draw:edited', function (e) {

                var aoLayer = e.layers;
                aoLayer.eachLayer(function (oLayer) {
                    var oInfo = self._getGisObj(oLayer);
                    self._oDrawLayer.addLayer(oLayer);
                    oInfo.cId = oLayer.cId;
                    oInfo.oFenceInfo = oLayer.oFenceInfo;

                    self._oMapBase._oParent.fire('FenceView:UI.updateFence', oInfo);
                    self.fire('FenceView:UI.updateFence', oInfo);
                });
            });
        },
    });


﻿/*
     name:           MapTile.js
     des:            地图全屏操作
     date:           2016-06-02
     author:         liulin

     修改为用js加载

     */
    L.MapLib.MapControl.ESMapFull = L.Evented.extend({

        oOption: {
            // 加载全屏按钮容器
            cSelfDiv: 'ex-map-full',
            // 父级容器
            acParentDivClass: [
                'ex-layout-maptool',
                'ex-theme-maptool',
                'ex-map-top',
                'ex-map-right'
            ],

            cClassName: '',//ec-margin-right
            cTitle: '地图全屏',

        },

        oUIConfig: {
            div: {
                'class': 'ex-maptool-box ex-map-full',
                i: {'class': 'ec-icon-expand'},
                html: '&nbsp;&nbsp;全屏'
            }
        },

        // 构造函数
        initialize: function (oMapBase, options) {
            if(options.oUIConfig) {
                L.extend(this.oUIConfig, options.oUIConfig);
                delete  options.oUIConfig
            }

            L.extend(this.oOption, options);

            // 获得地图控件
            this._oMapBase = oMapBase;
            this._oMap = oMapBase._oMap;

            //图层
            this._layers = {};
            //记录最近一次的div Z-index
            this._lastZIndex = 0;
            var $_oMapContainer = $(this._oMap.getContainer());
            this.$_oPContainer = $_oMapContainer.find('.' + this.oOption.acParentDivClass.join('.')).eq(0);

            //var aoLayer = this._oMapBase.getBaseLayers();

            // 设置父级容器的事件
            this.setParentEvent();

            this.initUI();
        },


        // 设置父级容器的事件
        setParentEvent: function () {

            // 屏蔽事件
            //L.DomEvent.addListener(this.$_oPContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
            //L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
            //L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

        },

        //加载工具事件，初始化工具栏
        initUI: function () {
            L.initTag(this.$_oPContainer, this.oUIConfig);
            //this.$_oPContainer.find('div').addClass(this.oOption.cClassName);
            this.initToolEvent();
        },

        //初始化工具栏事件
        initToolEvent: function () {
            //地图全屏按钮
            $('.' + this.oOption.cSelfDiv).bind('click', function () {
                if (!($.AMUI.fullscreen.isFullscreen)) {
                    $('body').addClass('map_full');
                    $(this).html('<i class="ec-icon-compress"></i>&nbsp;&nbsp;恢复');
                } else {
                    $('body').removeClass('map_full');
                    $(this).html('<i class="ec-icon-expand"></i>&nbsp;&nbsp;全屏');
                }
                $.AMUI.fullscreen.toggle();
            });
        },

    });




﻿/*
     name:           MapTile.js
     des:           地图瓦片操作对象
     date:           2016-06-02
     author:         liulin

     图层切换控件的编写

     */


    L.MapLib.MapControl.ESMapTile = L.Evented.extend({

        oOption: {
            // 父级容器
            cParentDiv: 'MapView',
            acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left'],

            cClassName: '',//ec-margin-right
            title: '图层切换',

        },

        oUIConfig: {
            div: {
                'class': 'ex-maptool-box ex-control-dropmenu  map-tile',
                i: {'class': 'ec-icon-clone'},
                html: '&nbsp;&nbsp;',
                span: {html: '高德地图'},
                i11: {'class': 'ec-icon-angle-down'},
                ul: {
                    'class': 'ec-avg-sm-1 ec-dropdown-content',
                    li: [{a: {href: 'javascript:void(0);', html: '高德地图'}},
                        {a: {href: 'javascript:void(0);', html: '高德卫星图'}},
                        {a: {href: 'javascript:void(0);', html: '谷歌地图'}},
                        {a: {href: 'javascript:void(0);', html: '谷歌卫星图'}},
                        {a: {href: 'javascript:void(0);', html: '谷歌地形图'}},
                        {a: {href: 'javascript:void(0);', html: '灰度图'}}
                    ]
                }
            }
        },

        // 构造函数
        initialize: function (oMapBase, options) {

            if(options.oUIConfig)
            {
                L.extend(this.oUIConfig,options.oUIConfig);
                delete  options.oUIConfig
            }

            L.extend(this.oOption, options);

            // 获得地图控件
            this._oMapBase = oMapBase;
            this._oMap = oMapBase._oMap;

            //图层
            this._layers = {};
            //记录最近一次的div Z-index
            this._lastZIndex = 0;

            var $_oMapContainer = $(this._oMap.getContainer());
            this.$_oPContainer = $_oMapContainer.find('.' + this.oOption.acParentDivClass.join('.')).eq(0);
            //this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));
            var aoLayer = this._oMapBase.getBaseLayers();
            // 添加图层
            for (var i in aoLayer) {
                this._addLayer(aoLayer[i], i);
            }
            // 设置父级容器的事件
            this.setParentEvent();

            this.initUI();
        },

        _addLayer: function (layer, name, overlay) {
            // 获得图层id
            var id = L.stamp(layer);

            this._layers[id] = {
                layer: layer,
                name: name,
                overlay: overlay
            };

            if (this.oOption.autoZIndex && layer.setZIndex) {
                this._lastZIndex++;
                layer.setZIndex(this._lastZIndex);
            }
        },

        // 设置父级容器的事件
        setParentEvent: function () {

            ////屏蔽事件
            L.DomEvent.addListener(this.$_oPContainer.get(0), 'click', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(this.$_oPContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

            L.DomEvent.addListener(this.$_oPContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);

        },

        //加载工具事件，初始化工具栏
        initUI: function () {
            L.initTag(this.$_oPContainer.eq(0), this.oUIConfig);
            this.initToolEvent();

        },

        //初始化工具栏事件
        initToolEvent: function () {
            var self = this;
            this.$_oPContainer.find('div.map-tile>ul>li>a').bind('click', this, function () {
                var cName = $(this).get(0).innerText.trim();
                self.selectLayer(cName);
                self.$_oPContainer.find('div.map-tile>span').html(cName);

            });
            this.$_oPContainer.find('div.map-tile>ul>li>a').mouseover(function () {
                self._oMap.doubleClickZoom.disable();//禁止默认双击
            });
            this.$_oPContainer.find('div.map-tile>ul>li>a').mouseout(function () {
                self._oMap.doubleClickZoom.enable();//禁止默认双击
            });

        },

        // 选择图层
        selectLayer: function (cName) {
            if (cName === '灰度图') {
                if (this._oMap.getZoom() > 16) {
                    this._oMap.setZoom(16);
                }
            }

            //var oLayer = null;
            for (var key in this._layers) {
                var oItem = this._layers[key];
                if (oItem.name === cName && !this._oMap.hasLayer(oItem.layer)) {
                    //添加图层
                    this._oMap.addLayer(oItem.layer);
                }
                else if (this._oMap.hasLayer(oItem.layer) && oItem.name !== cName) {

                    this._oMap.removeLayer(oItem.layer);
                }
            }
        },

    });




﻿/*
     name:           ESMapToolArea.js
     des:
     date:           2016-06-02
     author:         liulin

     图层切换控件的编写

     */


    L.MapLib.MapControl.ESMapToolArea = L.Evented.extend({
        oOption: {

            acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left'],

            title: '图层切换',

            // 图片地址url
            cUrl: '',

            nZoom: 8,

            oLatLng: {lat: 30.22, lng: 113.22},

            cClassName: 'ec-margin-right',

            bIsFly: true,
        },

        oUIConfig: {
            div: {
                'class': 'ex-maptool-box ex-control-dropmenu',
                i: {'class': 'ec-icon-map-marker'},
                html: '&nbsp;&nbsp;区域：',
                span: {html: '武汉'},
                i11: {'class': 'ec-icon-angle-down'},
                ul: {
                    'class': 'ec-avg-sm-2 ec-dropdown-content',
                }
            }
        },

        // 构造函数
        initialize: function (oMapBase, options) {
            if(options.oUIConfig)
            {
                L.extend(this.oUIConfig,options.oUIConfig);
                delete  options.oUIConfig
            }

            L.extend(this.oOption, options);

            // 获得地图控件
            this._oMapBase = oMapBase;
            this._oMap = oMapBase._oMap;

            var $_oMapContainer = $(this._oMap.getContainer());
            this.$_oPContainer = $_oMapContainer.find('.' + this.oOption.acParentDivClass.join('.')).eq(0);

            // 设置父级容器的事件
            this.setParentEvent();
            this.initUI();

            this.initCity();

        },


        // 设置父级容器的事件
        setParentEvent: function () {

        },

        //加载工具事件，初始化工具栏
        initUI: function () {
            L.initTag(this.$_oPContainer.eq(0), this.oUIConfig);
            this.$_oContainer = this.$_oPContainer.eq(0).find('.ex-maptool-box');//
        },


        // 初始化界面，加载城市数据
        initCity: function () {
            if (!this.oOption.cUrl) {
                return;
            }
            L.getData({}, this.oOption.cUrl, this.initCityHandler, this);
        },

        // 设置界面
        initCityHandler: function (oData) {

            oData = JSON.parse(oData);

            if (!oData || oData.length <= 0) {
                return;
            }
            this.$_oContainer.find('div.map-tool-area>ul>li').each(function () {
                $(this).remove();
            });

            var cHtml = '<li><a href="javascript:void(0);">{Name}</a></li>';


            for (var i = 0; i < oData.length; i++) {
                var cTemp = L.Util.template(cHtml, oData[i]);
                var oLi = $(cTemp).data('oItem', oData[i]);
                this.$_oContainer.find('ul').append(oLi);
            }

            // 设置第一个元素
            this.$_oContainer.children('span').text(oData[0].Name);
            if (oData[0].Lat && oData[0].Lng && this.oOption.bIsFly) {
                this._oMap.flyTo([oData[0].Lat, oData[0].Lng], this.oOption.nZoom);
            }


            this.$_oContainer.find('ul>li>a').bind('click', this, function (e) {
                var cName = $(this).text().trim();
                e.data.$_oContainer.children('span').text(cName);

                // 触发点位
                var oItem = $(this).parent().data('oItem');

                if (oItem.Lat && oItem.Lng) {
                    e.data._oMap.flyTo([oItem.Lat, oItem.Lng],  e.data.oOption.nZoom);
                }

            });
        }
    });


﻿/*
     name:           MapTile.js
     des:           地图瓦片操作对象
     date:           2016-06-02
     author:         liulin

     图层切换控件的编写

     */


    L.MapLib.MapControl.ESMapToolBox = L.Evented.extend({

        oOption: {
            // 父级容器
            cParentDiv: 'MapView',
            acParentDivClass: ["ex-layout-maptool", "ex-theme-maptool", "ex-map-top", "ex-map-left"],

            cClassName: '',//ec-margin-right
            title: '图层切换',
        },

        oUIConfig: {
            div: {
                'class': 'ex-maptool-box ex-control-dropmenu ',
                i: {'class': 'ec-icon-briefcase'},
                html: '&nbsp;&nbsp;',
                span: {html: '工具'},
                i11: {'class': 'ec-icon-angle-down'},
                ul: {
                    'class': 'ec-avg-sm-1 ec-dropdown-content',
                    li: [{
                        a: {
                            href: 'javascript:void(0);',
                            i: {'class': 'ex-icon-maptool ex-maptool-china'},
                            html: '&nbsp;全国'
                        }
                    },
                        {
                            a: {
                                href: 'javascript:void(0);',
                                i: {'class': 'ex-icon-maptool ex-maptool-range'},
                                html: '&nbsp;测距'
                            }
                        },
                        {
                            a: {
                                href: 'javascript:void(0);',
                                i: {'class': 'ex-icon-maptool ex-maptool-area'},
                                html: '&nbsp;测面'
                            }
                        },
                        {
                            a: {
                                href: 'javascript:void(0);',
                                i: {'class': 'ex-icon-maptool ex-maptool-scale-big'},
                                html: '&nbsp;拉框放大'
                            }
                        },
                        {
                            a: {
                                href: 'javascript:void(0);',
                                i: {'class': 'ex-icon-maptool ex-maptool-scale-small'},
                                html: '&nbsp;拉框缩小'
                            }
                        },
                        {
                            a: {
                                href: 'javascript:void(0);',
                                i: {'class': 'ex-icon-maptool ex-maptool-location'},
                                html: '&nbsp;坐标查询'
                            }
                        },
                        //{ a: { href: 'javascript:void(0);', i: { 'class': 'ex-icon-maptool ex-maptool-reset' }, html: '&nbsp;清除' } }
                    ]
                }
            }
        },

        // 构造函数
        initialize: function (oMapBase, options) {

            if(options.oUIConfig)
            {
                L.extend(this.oUIConfig,options.oUIConfig);
                delete  options.oUIConfig
            }
            L.extend(this.oOption,options);


            // 获得地图控件
            this._oMapBase = oMapBase;
            this._oMap = oMapBase._oMap;

            //this.$_oContainer = $("." + this.oOption.acParentDivClass.join("."));
            var $_oMapContainer = $(this._oMap.getContainer());
            this.$_oContainer = $_oMapContainer.find('.' + this.oOption.acParentDivClass.join('.')).eq(0);


            this.initUI();

            // 设置父级容器的事件
            this.setParentEvent();

            this.initMapTool();

            this.oActHandler = null;
        },

        initMapTool: function () {
            this.oScaleBig = new L.Map.ScaleBig(this._oMap);
            this.oScaleSmall = new L.Map.ScaleSmall(this._oMap);

            //地图测距查询
            this.oDistantHandler = L.MapLib.Measure.distMgr(this._oMap);

            //地图面积查询
            this.oAreaHandler = L.MapLib.Measure.areaMgr(this._oMap, {});

            //地图坐标查询 new L.Measure.LocaltionSearch(map)
            this.oMapToolLocal = new L.MapLib.LocaltionSearch.Search(this._oMap);
        },



        // 设置父级容器的事件
        setParentEvent: function () {

            ////屏蔽事件
            L.DomEvent.addListener(this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

            L.DomEvent.addListener(this.$_oContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);

        },

        //加载工具事件，初始化工具栏
        initUI: function () {
            L.initTag(this.$_oContainer.eq(0), this.oUIConfig);
            this.initToolEvent();

        },

        //初始化工具栏事件
        initToolEvent: function () {
            var self = this;
            this.$_oContainer.find("div.map-tool-box>ul>li>a").bind('click', this, function (e) {
                var cName = $(this).get(0).innerText.trim();
                self.$_oContainer.find("div.map-tool-box>span").html(cName);
                //self._oContainer.find("span").eq(1).html(cName);
            });

            $(".ex-maptool-scale-big").parent().bind("click", function () {
                if (self.oActHandler) {
                    self.oActHandler.disable();
                }
                self.oActHandler = self.oScaleBig;
                self.oActHandler.enable();
            })

            $(".ex-maptool-scale-small").parent().bind("click", function () {
                if (self.oActHandler) {
                    self.oActHandler.disable();

                }
                self.oActHandler = self.oScaleSmall;
                self.oActHandler.enable();

            })

            $(".ex-maptool-china").parent().bind("click", function () {
                if (self.oActHandler) {
                    self.oActHandler.disable();
                }
                self._oMap.setView(new L.LatLng(35, 103.5), 4);
            })


            $(".ex-maptool-reset").parent().bind("click", function () {

                if (self.oActHandler) {
                    self.oActHandler.disable();
                }
                //self.oAreaHandler.clearPoly();
            })

            $(".ex-maptool-location").parent().bind("click", function () {
                if (self.oActHandler) {
                    self.oActHandler.disable();
                }
                self.oActHandler = self.oMapToolLocal;
                self.oActHandler.enable();

            })
            $(".ex-maptool-range").parent().bind("click", function () {

                if (self.oActHandler) {
                    self.oActHandler.disable();
                }
                self.oActHandler = self.oDistantHandler;
                self.oActHandler.enable();

            })
            $(".ex-maptool-area").parent().bind("click", function () {

                if (self.oActHandler) {
                    self.oActHandler.disable();
                }
                //self.oAreaHandler.clearPoly();
                self.oActHandler = self.oAreaHandler;
                self.oActHandler.enable();

            })

        },


    });






    /**
     * poi查询 ， 访问的是高德地图 的 api接口
     *
     * Created by liulin on 2017/1/19.
     */




    L.MapLib.MapControl.ESMapSearch = L.Evented.extend({

        oOption: {
            // 父级容器
            cParentDiv: 'MapView',
            acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left'],

            className: '',
            title: '图层切换',
            // poi 查询地址
            cUrl: '/MapView/PoiSearch',

            // 具体参数含有可以查看高德MapApi
            oParam: {
                key: '',
                keywords: '',
                types: '050301',
                location: '113.22,30.333',
                city: '',
                citylimit: '',
                datatype: 'poi',
                output: 'JSON',
            },

        },

        // 查询的html代码
        cHtml: '<div class="ex-maptool-box"><div class="ec-input-group ex-maptool-search-box"> ' +
        '   <input type="text" name="name" placeholder="搜索" class="ec-form-field"/> ' +
        '   <span class="ec-input-group-btn"> ' +
        '       <button class="ec-btn ec-btn-primary ec-btn-sm search" type="button"><span class="ec-icon-search"></span></button>   ' +
        '       <button class="ec-btn ec-btn-default ec-btn-sm clear" type="button"><span class="ec-icon-close"></span></button>' +
        '   </span>' +
        '    ' +
        '       <ul class="ex-maptool-box-search-result">      </ul>' +
        '     ' +
        ' </div> </div>',

        // 构造函数
        initialize: function (oMapBase, options) {
            L.extend(this.oOption, options);
            // 获得地图控件
            this._oMapBase = oMapBase;
            this._oMap = oMapBase._oMap;
            //图层
            this.oLayer = L.featureGroup();
            this.oInputData = null;
            this.oLayer.addTo(this._oMap);
            var $_oMapContainer = $(this._oMap.getContainer());
            this.$_oPContainer = $_oMapContainer.find('.' + this.oOption.acParentDivClass.join('.')).eq(0);
            //this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));

            this.initUI();
            this.setParentEvent();
            // 注册事件
            this.initToolEvent();
        },


        // 设置父级容器的事件
        setParentEvent: function () {

            //屏蔽事件
            L.DomEvent.addListener(this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
            L.DomEvent.addListener(this.$_oContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);
        },

        //加载工具事件，初始化工具栏
        initUI: function () {

            this.$_oContainer = $(this.cHtml);

            this.$_oPContainer.eq(0).append(this.$_oContainer);

            this.$_oSearchRtn = this.$_oContainer.find('.ex-maptool-box-search-result');

            this.$_oSearchRtn.hide();

            // 查询项
            this.$_oUL = this.$_oContainer.find('ul.ex-maptool-box-search-result');

            // 清空
            this.$_oUL.empty();

            // 查询输入框
            this.$_oInput = this.$_oContainer.find('input');

            // 清空
            this.$_btnClear = this.$_oContainer.find('button.clear');

            // 查询
            this.$_btnSearch = this.$_oContainer.find('button.search');

        },

        //初始化工具栏事件
        initToolEvent: function () {
            var self = this;
            var bTo = false;
            // 给input 注册事件,防止快捷查询
            this.$_oInput.keyup(function (e) {
                var myEvent = e || window.event;
                var keyCode = myEvent.keyCode;
                if (keyCode == 38 || keyCode == 40) {
                    return;
                }
                // 判断查询结果是否为上次的查询结果
                if(self.oInputData && self.oInputData.name === self.$_oInput.val()) {
                    return;
                }

                if (bTo) {
                    clearTimeout(bTo);
                }
                bTo = setTimeout(function () {
                    var cSearchVal = self.$_oInput.val();
                    var oLatLng = self._oMap.getCenter();
                    var oParam = {};
                    ES.extend(oParam, self.oOption.oParam, {
                        keywords: cSearchVal,
                        location: oLatLng.lng + ',' + oLatLng.lat
                    });
                    ES.getData(oParam, self.oOption.cUrl, self.searchPoiHandler, self);
                }, 250);
            });


            $(document).keydown(function (e) {
                // 没有显示不执行
                if (self.$_oSearchRtn.css("display") === "none") {
                    return;
                }
                var myEvent = e || window.event;
                var keyCode = myEvent.keyCode;

                if (keyCode === 38) {
                    self.movePrev();
                } else if (keyCode === 40) {
                    self.moveNext();
                }
                // 扑捉回车按钮 ， 然后定位当前的位置信息
                if(keyCode === 13) {
                    self.localPos();
                }
            });

            // 注册按钮时间
            this.$_btnClear.bind('click', function () {
                self.oLayer.clearLayers();
                self.$_oInput.val('');
            });

            // 查询事件
            this.$_btnSearch.bind('click', function () {
                var cSearchVal = self.$_oInput.val();
                var oLatLng = self._oMap.getCenter();
                var oParam = {};
                ES.extend(oParam, self.oOption.oParam, {
                    keywords: cSearchVal,
                    location: oLatLng.lng + ',' + oLatLng.lat
                });
                ES.getData(oParam, self.oOption.cUrl, self.searchPoiHandler, self);
            });
        },

        // 定位 当前位置,
        localPos:function() {

            this.oLayer.clearLayers();
            var $_oLI = this.$_oUL.find("li.ec-active");
            var oData = $_oLI.data('oData');

            var oMarker = L.marker([oData.lat, oData.lng]);
            oMarker.oData = oData;
            // 创建点
            oMarker.addTo(this.oLayer);

            this._oMap.flyTo([oData.lat, oData.lng], 16);
            // 给文本框赋值
            this.$_oInput.val(oData.name);

            this.oInputData = oData;

            this.$_oUL.empty();
            this.$_oSearchRtn.hide();
        },


        // 光标上移动 38
        movePrev: function () {
            var index = this.$_oUL.find("li.ec-active").prevAll().length;

            if (index == 0) {
                this.$_oInput.focus();
                // 文本框选中
                return false;                                                            //不可循环移动
            }
            else {
                this.$_oUL.find("li").removeClass('ec-active').eq(index - 1).addClass('ec-active');
                var oData = this.$_oUL.find("li").eq(index - 1).data('oData');

                this.$_oInput.val(oData.name);
            }
        },

        // 光标下移动 40
        moveNext: function () {
            var index = this.$_oUL.find("li.ec-active").prevAll().length;

            if(index === 0 && !this.$_oUL.find("li").eq(0).hasClass('ec-active')){
                this.$_oUL.find("li").eq(0).addClass('ec-active');
                var oData = this.$_oUL.find("li").eq(0).data('oData');
                this.$_oInput.val(oData.name);
                return;
            }

            if (index === this.$_oUL.find("li").length - 1) {
                return false;                                                //不可循环移动
            }
            else {
                this.$_oUL.find("li").removeClass('ec-active').eq(index + 1).addClass('ec-active');
                var oData = this.$_oUL.find("li").eq(index + 1).data('oData');
                this.$_oInput.val(oData.name);
            }
        },

        // 查询处理
        searchPoiHandler: function (oData) {
            this.$_oUL.empty();
            this.$_oSearchRtn.hide();

            if (!oData || oData.status === 0 || oData.count <= 0) {
                return;
            }
            // 加载数据
            for (var i = 0; i < oData.tips.length; i++) {
                if (oData.tips[i].lng === 0) {
                    continue;
                }
                oData.tips[i].cDist = oData.tips[i].district||'';
                var $_li = $(L.Util.template('<li class="location"><b>{name}</b><span>{cDist}</span></li>', oData.tips[i]));
                $_li.data('oData', oData.tips[i]);
                this.$_oUL.append($_li);


                $_li.bind('click',this, function (e) {
                    e.data.localPos();
                });
                $_li.bind('mouseover', function () {
                    $(this).addClass('ec-active');
                });
                $_li.bind('mouseout', function () {
                    $(this).removeClass('ec-active');
                });
            }
            this.$_oSearchRtn.show();

        }


    });

}(window, document, L));