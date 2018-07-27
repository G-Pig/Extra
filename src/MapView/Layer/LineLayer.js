/**
 * Created by liulin on 2018/3/16.
 */

ES.MapView.LineLayer = L.MapLib.MapMaster.MapOpr.extend({
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

        if (!oData || !oData.aoData) {
            return;
        }

        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.length; i++) {
            var oLayer = this.findLayer(this._oPolylineGroup, oData.aoData[i].id);
            if (oLayer) {
                continue;
            }
            this.drawLayer(oData.aoData[i]);

            $.merge(aoLatLnt, oData.aoData[i].lstLatLnt);
        }

        if (aoLatLnt && aoLatLnt.length > 0) {
            this._oMap.fitBounds(aoLatLnt);
        }
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
        oVehLine.cId = oData.id;
        oVehLine.cName  = oData.name;


    },
    // 设置图层设置
    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData) {
            return oVehLine;
        }

        var aoLatLng = [];
        for (var i = oData.lstLatLnt.length - 1; i >= 0; i--) {

            aoLatLng.push(oData.lstLatLnt[i]);
        }


        oVehLine = L.polyline(aoLatLng, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);

        oVehLine.setText(oData.MaintainName + ':' + oData.name + '        ', {
            repeat: true,
            offset: 20,
            attributes: {'font-size': '16', fill: 'red'}
        });
        return oVehLine;
    },


});
