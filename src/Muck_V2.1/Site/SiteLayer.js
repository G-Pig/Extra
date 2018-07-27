/**
 *  绘制工地图层
 *
 * Created by liulin on 2018/5/20.
 */

ES.Muck.SiteLayer = L.MapLib.MapMaster.MapOpr.extend({

    //执行画点，画线操作
    oOption: {

        oStyleConfig: {
            stroke: true,
            color: 'green',
            dashArray: '5, 5',
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 0.6,
            fill: true,
            fillColor: 'green',
            fillOpacity: 0.1,
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

    },


    _getLineColor: function (oData, cTarget) {

        return {color: 'green'};
    },


    initialize: function (oParent, oOption,oMap) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oMap);

        ES.setOptions(this, oOption);
        // 执行自己的方法
        this._initGroup();
        this._loadOn();

        this.initUI();

    },

    //初始化工地数据
    initUI:function(){

        ES.Util.reqData({data:{},url: '/Site/SiteInfoForTrack'}, function (oData) {
            //self._oParent.fire('TrackView.SiteLayer:DrawArea', {aoData: oData.rtnData});
            this.drawLayers({aoData: oData.rtnData});
        }, this);

    },

    // 初始化Group
    _initGroup: function () {

        this._oPolylineGroup = L.featureGroup();

        this._oMap.addLayer(this._oPolylineGroup);

    },

    //初始化时加载数据
    _loadOn: function () {

        // 画所有的工地数据
        this._oParent.on('TrackView.SiteLayer:DrawArea', this.drawLayers, this);
        this._oParent.on('TrackView.SiteLayer:ClearArea', this.clearLayer, this);
        this._oParent.on('TrackView.SiteLayer:RemoveArea', this.removeLayers, this);

    },

    removeLayers: function (oData) {
        var aoData = oData.aoData;
        for (var i = 0; i < aoData.length; i++) {
            var oLayer = this.findLayer(this._oPolylineGroup, aoData[i].Id);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolylineGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolylineGroup.removeLayer(oLayer);
        };
    },

    clearLayer: function () {
        this._oPolylineGroup.clearLayers();
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function (oData) {

        if (!oData || !oData.aoData) {
            return;
        }

        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.length; i++) {

            var oLayer = this.findLayer(this._oPolylineGroup, oData.aoData[i].Id);
            if (oLayer) {
                continue;
            }
            this.drawLayer(oData.aoData[i], oData.cTarget);
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
        oVehLine.cId = oData.Id;
        oVehLine.bindTooltip(oData.Name);
        // var cHtml = ES.Util.template(this.cHtml, oData);
        //
        // var oIcon = this._getIcon(cHtml);
        //
        // var oMarker = L.marker(oVehLine.getCenter(), { icon: oIcon });
        //
        // oMarker.addTo(this._oPolylineGroup);
        // oVehLine.oMarker = oMarker;
    },

    _getIcon: function (cHtml) {

        var oIcon = L.divIcon({
            iconSize: [0, 0], iconAnchor: [15,20],
            popupAnchor: [-1, -20],
            className: "ex-monitor-mapicon-truck",
            html: cHtml,
        });
        return oIcon;
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
                    this.bindPopup(oData.rtnData, {maxWidth: 400});
                    this.openPopup();
                },
                this);

        }, oMarker);

    },

    // 设置图层设置
    createLayer: function (oData, cTarget) {

        var oVehLine = this.findLayer(this._oPolylineGroup, oData.Id)

        if (oVehLine) {
            return oVehLine;
        }
        if (!oData  || !oData.MapY) {
            return oVehLine;
        }

        var aoLatLng = [];
        var lats = oData.MapY.split(",");
        var lngs = oData.MapX.split(",");
        for (var j = 0; j < lats.length; j++) {
            aoLatLng.push({lat: lats[j], lng: lngs[j]});
        }

        //ES.extend(this.oOption.oStyleConfig, this._getLineColor(oData, cTarget));

        oVehLine = L.polygon(aoLatLng, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);


        return oVehLine;
    },


});

ES.Muck.SiteLayer.include({
    cHtml:
    '<div class="car-body"></div>' +
    '<div class="pin-tip" style="display: block;">' +
    '     <div class="areaCount-number" ' +
    '           style="height: 22px;' +
    '           position: absolute;' +
    '           left: 13px;bottom: -25px;' +
    '           z-index: 17;background-color: #447e2a;color: #fff;' +
    '           border: 2px solid #fff;white-space: nowrap;' +
    '           box-shadow: 0 0 3px rgba(0,0,0,.55);' +
    '           padding: 0 10px 0 20px;border-radius: 0 2rem 2rem 0;">{Name}' +
    '   </div>' +
    '</div>'  ,

});