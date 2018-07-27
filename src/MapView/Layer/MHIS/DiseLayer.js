/**
 * 病害图层的展示
 *
 * Created by Administrator on 2017/6/3.
 */


ES.MapView.DiseLayer = L.MapLib.MapMaster.MapOpr.extend({
    //执行画点，画线操作
    oOption: {
        onEventDrawLayers: 'MapView:DiseLayer.DrawLayers',

        onEventClearLayers: 'MapView:DiseLayer.clearLayer',

        onEventRemoveLayers: 'MapView:DiseLayer.removeLayers',

        cUrl:'/Disease/MapDisePopUrl',

        cHtml: '<div class="ex-monitor-mapicon-pin  {icon}">' +
        '   <i></i>' +
        '   <div class="pin-tip">' +
        '       <div class="pin-dome"></div>' +
        '       <div class="pin-number">{typeName}</div>' +
        '   </div>' +
        '</div>'
    },

    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);

        this._initGroup();
        this._loadOn();
    },

    // 初始化Group
    _initGroup: function () {

        // 使用计划来画图
        this._oPosGroup = L.markerClusterGroup();

        this._oMap.addLayer(this._oPosGroup);

    },

    //初始化时加载数据
    _loadOn: function () {

        // 画所有的工地数据
        this._oParent.on(this.oOption.onEventDrawLayers, this.drawLayers, this);
        this._oParent.on(this.oOption.onEventClearLayers, this.clearLayer, this);
        this._oParent.on(this.oOption.onEventRemoveLayers, this.removeLayers, this);

    },

    removeLayers: function (oData) {

        if (!this._oPosGroup || !oData || oData.acId.length <= 0) {
            return;
        }

        var aoInfo = oData.acId;

        for (var i = 0; i < aoInfo.length; i++) {
            var nId = -parseInt(aoInfo[i]);
            this._removeLayers(nId);
        }
    },

    _removeLayers: function (nId) {

        var aoLayer = $.grep(this._oPosGroup.getLayers(), function (oLayer, i) {
            if (oLayer.nSegmentId === nId) {
                return true;
            }
        });

        if (!aoLayer || aoLayer.length <= 0) {
            return;
        }

        for (var i = 0; i < aoLayer.length; i++) {

            this._oPosGroup.removeLayer(aoLayer[i]);
        }
    },

    clearLayer: function () {
        this._oPosGroup.clearLayers();
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function (oData) {

        if (!oData || !oData.aoData) {
            return;
        }
        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.length; i++) {
            this.drawLayer(oData.aoData[i]);
            $.merge(aoLatLnt, [{lat: oData.aoData[i].lat, lng: oData.aoData[i].lng}]);
        }

        if (aoLatLnt && aoLatLnt.length > 0) {
            this._oMap.fitBounds(aoLatLnt);
        }
    },

    drawLayer: function (oData) {
        if (!oData) {
            return;
        }

        // 编辑邮路,画围栏时要表明自己的名称
        var oMarker = this.createLayer(oData);
        if (!oMarker) {
            return;
        }
        oMarker.nSegmentId = oData.segmentId;
        oMarker.cId = oData.id;

        // 绑定弹出层
        this.initEventForMarker(oMarker);

    },


    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        var self = this;
        if (!oMarker) {
            return;
        }

        oMarker.on('click', function () {

            ES.Util.reqData({
                    url: self.oOption.cUrl,
                    data: {id: this.cId},
                    dataType: 'html',

                },
                function (oData) {
                    this.bindPopup(oData.rtnData,{maxWidth:400});
                    var oPopup = this.getPopup();
                    this.openPopup();
                },
                this);

        }, oMarker);

    },


    // 设置图层设置
    createLayer: function (oData) {
        var oVehLine = null;
        if (!oData) {
            return oVehLine;
        }
        var oIcon = this._getIcon(ES.Util.template(this.oOption.cHtml, oData));

        oVehLine = L.marker([oData.lat, oData.lng], {icon: oIcon}).addTo(this._oPosGroup);

        return oVehLine;
    },

    // 画点
    _getIcon: function (cHtml) {

        var oIcon = L.divIcon({
            iconSize: [20, 20], iconAnchor: [10, 20],
            popupAnchor: [-1, -20],
            className: "",
            html: cHtml,
        });
        return oIcon;
    },

});