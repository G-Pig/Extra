/*
	ES.MapLib 0.1.0, a js library for exsun lbs instance.
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

L.Map.mergeOptions({
	touchExtend: true
});

L.Map.TouchExtend = L.Handler.extend({

	initialize: function (map) {
		this._map = map;
		this._container = map._container;
		this._pane = map._panes.overlayPane;
	},

	addHooks: function () {
		L.DomEvent.on(this._container, 'touchstart', this._onTouchStart, this);
		L.DomEvent.on(this._container, 'touchend', this._onTouchEnd, this);
		L.DomEvent.on(this._container, 'touchmove', this._onTouchMove, this);
		if (this._detectIE()) {
			L.DomEvent.on(this._container, 'MSPointerDown', this._onTouchStart, this);
			L.DomEvent.on(this._container, 'MSPointerUp', this._onTouchEnd, this);
			L.DomEvent.on(this._container, 'MSPointerMove', this._onTouchMove, this);
			L.DomEvent.on(this._container, 'MSPointerCancel', this._onTouchCancel, this);

		} else {
			L.DomEvent.on(this._container, 'touchcancel', this._onTouchCancel, this);
			L.DomEvent.on(this._container, 'touchleave', this._onTouchLeave, this);
		}
	},

	removeHooks: function () {
		L.DomEvent.off(this._container, 'touchstart', this._onTouchStart);
		L.DomEvent.off(this._container, 'touchend', this._onTouchEnd);
		L.DomEvent.off(this._container, 'touchmove', this._onTouchMove);
		if (this._detectIE()) {
			L.DomEvent.off(this._container, 'MSPointerDowm', this._onTouchStart);
			L.DomEvent.off(this._container, 'MSPointerUp', this._onTouchEnd);
			L.DomEvent.off(this._container, 'MSPointerMove', this._onTouchMove);
			L.DomEvent.off(this._container, 'MSPointerCancel', this._onTouchCancel);
		} else {
			L.DomEvent.off(this._container, 'touchcancel', this._onTouchCancel);
			L.DomEvent.off(this._container, 'touchleave', this._onTouchLeave);
		}
	},

	_touchEvent: function (e, type) {
		// #TODO: fix the pageX error that is do a bug in Android where a single touch triggers two click events
		// _filterClick is what leaflet uses as a workaround.
		// This is a problem with more things than just android. Another problem is touchEnd has no touches in
		// its touch list.
		var touchEvent = {};
		if (typeof e.touches !== 'undefined') {
			if (!e.touches.length) {
				return;
			}
			touchEvent = e.touches[0];
		} else if (e.pointerType === 'touch') {
			touchEvent = e;
            if (!this._filterClick(e)) {
                return;
            }
		} else {
			return;
		}

		var containerPoint = this._map.mouseEventToContainerPoint(touchEvent),
			layerPoint = this._map.mouseEventToLayerPoint(touchEvent),
			latlng = this._map.layerPointToLatLng(layerPoint);

		this._map.fire(type, {
			latlng: latlng,
			layerPoint: layerPoint,
			containerPoint: containerPoint,
			pageX: touchEvent.pageX,
			pageY: touchEvent.pageY,
			originalEvent: e
		});
	},

    /** Borrowed from Leaflet and modified for bool ops **/
    _filterClick: function (e) {
        var timeStamp = (e.timeStamp || e.originalEvent.timeStamp),
            elapsed = L.DomEvent._lastClick && (timeStamp - L.DomEvent._lastClick);

        // are they closer together than 500ms yet more than 100ms?
        // Android typically triggers them ~300ms apart while multiple listeners
        // on the same event should be triggered far faster;
        // or check if click is simulated on the element, and if it is, reject any non-simulated events
        if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
            L.DomEvent.stop(e);
            return false;
        }
        L.DomEvent._lastClick = timeStamp;
        return true;
    },

	_onTouchStart: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchstart';
		this._touchEvent(e, type);

	},

	_onTouchEnd: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchend';
		this._touchEvent(e, type);
	},

	_onTouchCancel: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchcancel';
		if (this._detectIE()) {
			type = 'pointercancel';
		}
		this._touchEvent(e, type);
	},

	_onTouchLeave: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchleave';
		this._touchEvent(e, type);
	},

	_onTouchMove: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchmove';
		this._touchEvent(e, type);
	},

	_detectIE: function () {
		var ua = window.navigator.userAgent;

		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// IE 12 => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		// other browser
		return false;
	}
});

L.Map.addInitHook('addHandler', 'touchExtend', L.Map.TouchExtend);

// This isn't full Touch support. This is just to get makers to also support dom touch events after creation
// #TODO: find a better way of getting markers to support touch.
L.Marker.Touch = L.Marker.extend({

	_initInteraction: function () {
		if (!this.addInteractiveTarget) {
			// 0.7.x support
			return this._initInteractionLegacy();
		}
		// TODO this may need be updated to re-add touch events for 1.0+
		return L.Marker.prototype._initInteraction.apply(this);
	},

	// This is an exact copy of https://github.com/Leaflet/Leaflet/blob/v0.7/src/layer/marker/Marker.js
	// with the addition of the touch events on line 15.
	_initInteractionLegacy: function () {

		if (!this.options.clickable) {
			return;
		}

		// TODO refactor into something shared with Map/Path/etc. to DRY it up

		var icon = this._icon,
			events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu', 'touchstart', 'touchend', 'touchmove'];
		if (this._detectIE) {
			events.concat(['MSPointerDown', 'MSPointerUp', 'MSPointerMove', 'MSPointerCancel']);
		} else {
			events.concat(['touchcancel']);
		}

		L.DomUtil.addClass(icon, 'leaflet-clickable');
		L.DomEvent.on(icon, 'click', this._onMouseClick, this);
		L.DomEvent.on(icon, 'keypress', this._onKeyPress, this);

		for (var i = 0; i < events.length; i++) {
			L.DomEvent.on(icon, events[i], this._fireMouseEvent, this);
		}

		if (L.Handler.MarkerDrag) {
			this.dragging = new L.Handler.MarkerDrag(this);

			if (this.options.draggable) {
				this.dragging.enable();
			}
		}
	},
	_detectIE: function () {
		var ua = window.navigator.userAgent;

		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// IE 12 => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		// other browser
		return false;
	}
});


/*
 * L.LatLngUtil contains different utility functions for LatLngs.
 */

L.LatLngUtil = {
	// Clones a LatLngs[], returns [][]
	cloneLatLngs: function (latlngs) {
		var clone = [];
		for (var i = 0, l = latlngs.length; i < l; i++) {
			// Check for nested array (Polyline/Polygon)
			if (Array.isArray(latlngs[i])) {
				clone.push(L.LatLngUtil.cloneLatLngs(latlngs[i]));
			} else {
				clone.push(this.cloneLatLng(latlngs[i]));
			}
		}
		return clone;
	},

	cloneLatLng: function (latlng) {
		return L.latLng(latlng.lat, latlng.lng);
	}
};


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


L.Util.extend(L.LineUtil, {
	// Checks to see if two line segments intersect. Does not handle degenerate cases.
	// http://compgeom.cs.uiuc.edu/~jeffe/teaching/373/notes/x06-sweepline.pdf
	segmentsIntersect: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2, /*Point*/ p3) {
		return	this._checkCounterclockwise(p, p2, p3) !==
				this._checkCounterclockwise(p1, p2, p3) &&
				this._checkCounterclockwise(p, p1, p2) !==
				this._checkCounterclockwise(p, p1, p3);
	},

	// check to see if points are in counterclockwise order
	_checkCounterclockwise: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
		return (p2.y - p.y) * (p1.x - p.x) > (p1.y - p.y) * (p2.x - p.x);
	}

});




L.Polyline.include({
	// Check to see if this polyline has any linesegments that intersect.
	// NOTE: does not support detecting intersection for degenerate cases.
	intersects: function () {
		var points = this._getProjectedPoints(),
			len = points ? points.length : 0,
			i, p, p1;

		if (this._tooFewPointsForIntersection()) {
			return false;
		}

		for (i = len - 1; i >= 3; i--) {
			p = points[i - 1];
			p1 = points[i];


			if (this._lineSegmentsIntersectsRange(p, p1, i - 2)) {
				return true;
			}
		}

		return false;
	},

	// Check for intersection if new latlng was added to this polyline.
	// NOTE: does not support detecting intersection for degenerate cases.
	newLatLngIntersects: function (latlng, skipFirst) {
		// Cannot check a polyline for intersecting lats/lngs when not added to the map
		if (!this._map) {
			return false;
		}

		return this.newPointIntersects(this._map.latLngToLayerPoint(latlng), skipFirst);
	},

	// Check for intersection if new point was added to this polyline.
	// newPoint must be a layer point.
	// NOTE: does not support detecting intersection for degenerate cases.
	newPointIntersects: function (newPoint, skipFirst) {
		var points = this._getProjectedPoints(),
			len = points ? points.length : 0,
			lastPoint = points ? points[len - 1] : null,
			// The previous previous line segment. Previous line segment doesn't need testing.
			maxIndex = len - 2;

		if (this._tooFewPointsForIntersection(1)) {
			return false;
		}

		return this._lineSegmentsIntersectsRange(lastPoint, newPoint, maxIndex, skipFirst ? 1 : 0);
	},

	// Polylines with 2 sides can only intersect in cases where points are collinear (we don't support detecting these).
	// Cannot have intersection when < 3 line segments (< 4 points)
	_tooFewPointsForIntersection: function (extraPoints) {
		var points = this._getProjectedPoints(),
			len = points ? points.length : 0;
		// Increment length by extraPoints if present
		len += extraPoints || 0;

		return !points || len <= 3;
	},

	// Checks a line segment intersections with any line segments before its predecessor.
	// Don't need to check the predecessor as will never intersect.
	_lineSegmentsIntersectsRange: function (p, p1, maxIndex, minIndex) {
		var points = this._getProjectedPoints(),
			p2, p3;

		minIndex = minIndex || 0;

		// Check all previous line segments (beside the immediately previous) for intersections
		for (var j = maxIndex; j > minIndex; j--) {
			p2 = points[j - 1];
			p3 = points[j];

			if (L.LineUtil.segmentsIntersect(p, p1, p2, p3)) {
				return true;
			}
		}

		return false;
	},

	_getProjectedPoints: function () {
		if (!this._defaultShape) {
			return this._originalPoints;
		}
		var points = [],
			_shape = this._defaultShape();

		for (var i = 0; i < _shape.length; i++) {
			points.push(this._map.latLngToLayerPoint(_shape[i]));
		}
		return points;
	}
});


L.Polygon.include({
	// Checks a polygon for any intersecting line segments. Ignores holes.
	intersects: function () {
		var polylineIntersects,
			points = this._getProjectedPoints(),
			len, firstPoint, lastPoint, maxIndex;

		if (this._tooFewPointsForIntersection()) {
			return false;
		}

		polylineIntersects = L.Polyline.prototype.intersects.call(this);

		// If already found an intersection don't need to check for any more.
		if (polylineIntersects) {
			return true;
		}

		len = points.length;
		firstPoint = points[0];
		lastPoint = points[len - 1];
		maxIndex = len - 2;

		// Check the line segment between last and first point. Don't need to check the first line segment (minIndex = 1)
		return this._lineSegmentsIntersectsRange(lastPoint, firstPoint, maxIndex, 1);
	}
});


/**
 * Created by liulin on 2016/11/4.
 *
 * 测量的配置文件要求
 */

L.MapLib.Measure = {};

L.MapLib.Measure.version = '0.0.1';

L.MapLib.Measure.Msg = {
    TipMarker: {
        setText: {
            beginText: 'begin  '
        },
        createIcon: {
            closeText: '&times;'
        },
        addTotalPenal: {
            total: ' total ',
        },
        setSubTotalDistTag: {
            total: ' subtotal ',
        }
    },
    Dist: {
        _getTooltipText: {
            start: 'Click to start measure  dist.',
            cont: 'Click to continue measure dist.',
            end: 'Click last point to finish measure.'
        }
    },
    Area: {
        _getTooltipText: {
            start: 'Click to start measure  Area.',
            cont: 'Click to continue measure Area.',
            end: 'Click last point to finish measure.'
        }
    },

    error: '<strong>Error:</strong> shape edges cannot cross!',

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
            .on('click', this._onTouch, this)
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
            .off('click', this._onTouch, this);
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
        if (markerCount === 1) {
            this._markers[0].on('click', this._finishShape, this);
        }

        // Add and update the double click handler
        if (markerCount >= 2) {
            this._markers[markerCount - 1].on('dblclick', this._finishShape, this);
            // Only need to remove handler if has been added before
            if (markerCount > 3) {
                this._markers[markerCount - 2].off('dblclick', this._finishShape, this);
            }
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
        oSubDist: {
            nOrder: 1,
            cTagName: 'span',
        },
        oSubTotalDist: {
            nOrder: 2,
            cTagName: 'span'
        },
        oTotalDist: {
            nOrder: 3,
            cTagName: 'span'
        },
        oSubClose: {
            nOrder: 4,
            cTagName: 'a',
            cClassName: 'ex-dist-close ec-text-lg',
            cText: '',// L.MapLib.Measure.Msg.TipMarker.createIcon.closeText,
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

        var cDist = L.MapLib.Measure.Msg.TipMarker.setText.beginText;
        if (dDist !== 0) {
            //metric
            cDist = L.GeometryUtil.readableDistanceEx(dDist, this.options.metric);
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
            cClassName: 'ex-dist-close ec-text-lg',
            cText: '',// L.MapLib.Measure.Msg.TipMarker.createIcon.closeText,
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

//L.MapLib.MapMaster.EventName= {
//
//    // 地图加载完毕事件
//    loadFinish: 'Map:loadFinish',
//
//};







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
            attribution: 'Map &copy;GB-20263—2018 <a target="_blank" href="#">浩宇天辰</a> '
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


        this._oParent.fire('Map:loadTileFinish', {oBaseLayer: oBaseLayer});
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

    options: {// 飞行的最大图层
        nFlyZoom: 10,

        // 飞行的延时
        nFlyDuration: 3,

        // 允许飞行的做到图层
        nFlyMaxZoom: 15,

        // 地图飞行版本
        cFlayMapVertion: '1.0'},



    /*
     功能描述：页面的构造函数
     @oParent：父亲级容器，可以监听全局事件的容器
     @oOption：外部参赛设置
     */
    initialize: function (oParent, oOption) {
        oOption = L.setOptions(this, oOption);

        this._oParent = oParent;

        if (oParent) {
            if (oParent._oMap) {
                this._oMap = oParent._oMap;
            } else {
                if (oParent instanceof L.Map) {
                    this._oMap = oParent;
                }
                else if (oParent.on) {
                    oParent.on(L.MapLib.MapMaster.EventName.loadFinish, this.setMap, this);
                }
            }
        }

        // 初始化图层
        //this._loadPage();

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
        this._oMap = oMap;
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

}(window, document, L));