/**
 * 资产评定
 * 线路评定计算
 *
 * Created by Administrator on 2017/6/10.
 *
 */

ES.MapView.AssessSegmentLayer = ES.MapView.LineLayer.extend({


    //执行画点，画线操作
    oOption: {
        onEventDrawLayers: 'MapView:Target.show',

        onEventClearLayers: 'MapView:Target.hide',

        oStyleConfig: {

            stroke: true,
            color: 'green',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 3,
            opacity: 1,
            fill: false,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

        oStyleSmallConfig: {

            stroke: true,
            color: 'green',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: false,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

        cHtml: '<div class="{cCls}"><div class="{cBCls}"></div><div class="{cTCls}">{Name}</div></div>'
    },


    _getLineColor: function (oData, cTarget) {

        if (!m_oConfig || !m_oConfig[cTarget] || m_oConfig[cTarget].length <= 0) {
            return {color: 'red'};
        }

        for (var i = 0; i < m_oConfig[cTarget].length; i++) {
            if (m_oConfig[cTarget][i]['MaxValue'] === 100) {
                if (oData[cTarget] >= m_oConfig[cTarget][i]['MinValue']) {
                    return {color: m_oConfig[cTarget][i]['Color'],weight:m_oConfig[cTarget][i]['Width']};
                }
            } else if (oData[cTarget] >= m_oConfig[cTarget][i]['MinValue'] && oData[cTarget] < m_oConfig[cTarget][i]['MaxValue']) {
                return {color: m_oConfig[cTarget][i]['Color'],weight:m_oConfig[cTarget][i]['Width']};
            }
        }

        return {color: 'red'};
    },


    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);
        // 执行自己的方法
        this._initGroup();
        this._loadOn();
    },

    // 初始化Group
    _initGroup: function () {

        this._oPolylineGroup = L.featureGroup();

        this._oMap.addLayer(this._oPolylineGroup);

    },

    //初始化时加载数据
    _loadOn: function () {

        // 画所有的工地数据
        this._oParent.on(this.oOption.onEventDrawLayers, this.drawLayers, this);
        this._oParent.on(this.oOption.onEventClearLayers, this.clearLayer, this);
        //this._oParent.on(this.oOption.onEventRemoveLayers, this.removeLayers, this);

        this._oMap.on('moveend', function () {

            if (!this._oPolylineGroup) return;
            this._oPolylineGroup.eachLayer(function (oLayer) {
               if(oLayer.cType == 'AssessLayer') {

                   if (this._oMap.getZoom() <= 8) {

                       oLayer.setStyle({weight: 2});
                   }
                   else {
                           oLayer.setStyle({weight: this.oOption.oStyleConfig.weight});
                   }
               }
            }, this);

        },this);
    },


    clearLayer: function () {
        this._oPolylineGroup.clearLayers();
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function (oData) {

        this.clearLayer();

        if (!oData || !oData.aoData) {
            return;
        }

        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.length; i++) {
            //var oLayer = this.findLayer(this._oPolylineGroup, oData.aoData[i].id);
            //if (oLayer) {
            //    continue;
            //}
            this.drawLayer(oData.aoData[i], oData.cTarget);

            $.merge(aoLatLnt, oData.aoData[i].lstLatLng);
        }

        if (aoLatLnt && aoLatLnt.length > 0) {
            this._oMap.fitBounds(aoLatLnt);
        }


    },

    drawLayer: function (oData, cTarget) {
        if (!oData) {
            return;
        }

        // 编辑邮路,画围栏时要表明自己的名称
        var oVehLine = this.createLayer(oData, cTarget);
        if (!oVehLine) {
            return;
        }
        oVehLine.cId = oData.id;
        oVehLine.cName = oData.name;
        oVehLine.SegmentCode=oData.SegmentCode;

    },

    initEventForMarker: function (oMarker) {
        var self = this;
        if (!oMarker) {
            return;
        }

        oMarker.on('click', function () {

            ES.Util.reqData({
                    url: '/AssessSegment/GetMapPopup',
                    data: {Mseg: this.SegmentCode},
                    dataType: 'html',
                },
                function (oData) {
                    this.bindPopup(oData.rtnData,{maxWidth:400});
                    this.openPopup();
                },
                this);

        }, oMarker);

    },

    // 设置图层设置
    createLayer: function (oData, cTarget) {
        var oVehLine = null;
        if (!oData) {
            return oVehLine;
        }

        var aoLatLng = [];
        for (var i = oData.lstLatLng.length - 1; i >= 0; i--) {

            aoLatLng.push(oData.lstLatLng[i]);
        }

        ES.extend(this.oOption.oStyleConfig, this._getLineColor(oData, cTarget));
        ES.extend(this.oOption.oStyleSmallConfig, this._getLineColor(oData, cTarget), {weight: 2});
        oVehLine = L.polyline(aoLatLng, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);
        oVehLine.cType = 'AssessLayer';
        this.initEventForMarker(oVehLine);
        //oVehLine.setText(oData.MaintainName + ':' + oData.name + '        ', {
        //    repeat: true,
        //    offset: 20,
        //    attributes: {'font-size': '16', fill: 'red'}
        //});
        return oVehLine;
    },

});
