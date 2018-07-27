/**
 * 线图层，环保线路
 * Created by liulin on 2017/6/27.
 */


ES.CloudMap.LineLayer = L.MapLib.MapMaster.MapOpr.extend({
    //执行画点，画线操作
    oOption: {
        onEventDrawLayers: 'MapView:ShowLayer.DrawLayers',

        onEventClearLayers: 'MapView:ShowLayer.clearLayer',

        onEventRemoveLayers: 'MapView:ShowLayer.removeLayers',

        oStyleConfig: {

            stroke: true,
            color: 'green',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 5,
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
        this._oParent.on(this.oOption.onEventRemoveLayers, this.removeLayers, this);
        this._oParent.on('CloudMap:LineLayer.reflesh', this.reflesh, this);

    },

    removeLayers: function (oData) {

        if (!this._oPolylineGroup || !oData || oData.acId.length <= 0) {
            return;
        }

        var aoInfo = oData.acId;

        for (var i = 0; i < aoInfo.length; i++) {
            var nId = - parseInt(aoInfo[i]);


            var oLayer = this.findLayer(this._oPolylineGroup, nId);
            if (!oLayer) {
                continue;
            }

            this._oPolylineGroup.removeLayer(oLayer);
        }
    },

    clearLayer: function () {
        this._oPolylineGroup.clearLayers();
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function(oData) {

        this.clearLayer();

        if (!oData || !oData.aoData) {
            return;
        }

        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.length; i++) {
            var oLayer = this.findLayer(this._oPolylineGroup, oData.aoData[i].Id);
            if (oLayer) {
                continue;
            }
            this.drawLayer(oData.aoData[i]);

        }

        this._oMap.fitBounds(  this._oPolylineGroup.getBounds());

    },

    // 刷新线路信息数据
    reflesh: function (oData) {
        var oLayer = this.findLayer(this._oPolylineGroup, oData.Id);
        if (oLayer) {
            this._oPolylineGroup.removeLayer(oLayer);
        }

        this.drawLayer(oData);


    },

    drawLayer: function (oData) {
        if (!oData) {
            return ;
        }

        // 编辑邮路,画围栏时要表明自己的名称
        var oVehLine = this.createLayer(oData);
        if (!oVehLine) {
            return;
        }
        oVehLine.cId = oData.Id;
        oVehLine.cName  = oData.CloudName;


    },

    // 设置图层设置
    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData) {
            return oVehLine;
        }

        var oParam = JSON.parse(oData.Json);
        var aoLatLng =oParam.aoLatLng;
        // 为了显示汉字正确性，对线路进行优化显示
        if(!oParam.aoLatLng || oParam.aoLatLng.length>1) {

            if (oParam.aoLatLng[0].lng > oParam.aoLatLng[oParam.aoLatLng.length - 1].lng) {
                aoLatLng = [];
                for (var i = oParam.aoLatLng.length - 1; i >= 0; i--) {

                    aoLatLng.push(oParam.aoLatLng[i]);
                }
            }
        }

        oVehLine = L.polyline(aoLatLng, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);

        oVehLine.setText( oData.CloudName + '          ', {
            repeat: true,
            offset: 20,
            attributes: {'font-size': '14', fill: 'red'}
        });
        return oVehLine;
    },


});