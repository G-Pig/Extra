/**
 * Created by Lenovo on 2017/12/13.
 */


// 加载消纳点
ES.MapBase.Unload = ES.MapBase.Site.extend({

    //执行画点，画线操作
    oOption: {
        cEventName: "SiteMap:drawUnload",
        oStyle: {
            "color": "#ff7800",
            "weight": 3,
            "opacity": .25
        },
    },
    _loadPage: function () {

        this._loadOn();
    },
    //初始化时加载数据
    _loadOn: function () {

        this._oParent.on("SiteMap:drawUnload", this.drawUnload, this);
        this._oParent.on("SiteMap:drawRegion", this.drawRegion, this);

        //把所有的圆点区域绘制在分组图层中
        this._oSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oSiteGroup);

        this._oPolygonUnloadGroup = L.layerGroup();
        this._oMap.addLayer(this._oPolygonUnloadGroup);

        this._oParent.on("Map:showHideUnload", this.showHideUnload, this);

        //对地图操作函数
        this._oMap.on("Map:setRegionStyle", this.setRegionStyle, this);

        this._oParent.on("SiteMap:clearRegion", this.clearRegion, this);

        this._oParent.on("SiteMap:drawOneUnload", this.drawOneUnload, this);

        this._oParent.on("SiteMap:clearPolygonUnload", this.clearPolygonUnload, this);
        this._oParent.on("SiteMap:clearAllPolygonUnload", this.clearAllPolygonUnload, this);
    },

    showHideUnload: function (oData) {

        if (oData.bFlag) {
            if (!this.aoLayer || this.aoLayer.length <= 0) return;
            for (var i = 0; i < this.aoLayer.length; i++) {
                this._oSiteGroup.addLayer(this.aoLayer[i]);
            }
        }
        else {
            this.aoLayer = this._oSiteGroup.getLayers();
            this._oSiteGroup.clearLayers();
        }


    },

    _getPopHtml: function (oPosInfo) {
        var cHtml = '<div style="min-width:300px"><h4><b>消纳点:' + oPosInfo.PlaceName + '</b></h4>'
            + '<b>区域：' + oPosInfo.QStr + '</b><br />'
            + '<b>占地面积：' + (oPosInfo.FloorArea || 0) + ' m²</b><br />'
            + '<b>可容量：' + (oPosInfo.Capacity || 0) + ' 立方 </b><br />'
            + '<b>位置：' + (oPosInfo.Addr || "") + '</b><br />'
            + '<a cid="U' + oPosInfo.Id + '" class="btn btn-sm btn-success"  onclick="addTask(this,5)"  style="float:right;margin-bottom: 10px;color: #fff;">发布任务</a></div>'

        return cHtml;
    },

    drawUnload: function (oData) {
        if (!oData) return;

        this.drawOneUnload(oData);
    },

    //画点
    _drawTip: function (oTemp) {
        return;
        var oOption = {
            cId: "1",
            bIsNotEdit: true,
            cName: '测试tip',
            oLatLng: { lat: 30.333, lng: 113.333 },
        }

        L.Util.extend(oOption, oTemp);

        var oIcon = new L.DivIcon({
            html: "<div> </div>",
            className: '',
        });

        var oMarker = L.marker(oOption.oLatLng, { cDevId: oOption.cId, cMFlag: oOption.cFlag, icon: oIcon, bIsNotEdit: oOption.bIsNotEdit });

        //给oMarker绑定tip
        oMarker.bindLabel(oOption.cName, { noHide: false, direction: "auto" });

        oMarker.addTo(this._oLayerGroup);

        return oMarker;
    },

    //起点只画一次，如果图层中存在就返回
    drawSiteMarker: function (oPosInfo) {

        if (!this._oSiteGroup) return;

        var oInfo = JSON.parse(oPosInfo.Map);
        if (!oInfo) return;
        var oLayer = this.findLayer(this._oSiteGroup, oPosInfo.Id);

        if (oLayer) return oLayer;

        var cHtml = "";
        if (oPosInfo.PlaceState == 11001) {
            cHtml = '<i class="map-poi map-storage-poi-now"><b></b></i>';

        }
        else if (oPosInfo.StateDID == 11002) {

            cHtml = '<i class="map-poi map-storage-poi-normal"><b></b></i>';
        }
        else {
            cHtml = '<i class="map-poi map-storage-poi-stop"><b></b></i>';
        }

        var oIcon = L.divIcon({
            iconSize: [20, 20],
            iconAnchor: [10, 20],
            popupAnchor: [-1, -20],
            className: "poi-storage poi-n",//poi-storage poi-n
            html: cHtml,
        });


        var oBound = new L.LatLngBounds(oInfo.aoLatLag);
        var oLatLng = oBound.getCenter()
        if (oInfo.nType == '501002') {
            oLatLng = oInfo.aoLatLag[0];
        }

        var cHtml = this._getPopHtml(oPosInfo);
        var oMarker = L.marker(oLatLng, { cDevId: oPosInfo.Id, icon: oIcon, cData: oPosInfo });
        oMarker.bindLabel(oPosInfo.Name, { offset: [20, -32], noHide: false, direction: "auto" });
        oMarker.bindPopup(cHtml);
        oMarker.addTo(this._oSiteGroup);
        return oMarker;
    },

    clearPolygonUnload: function (oData) {
        if (!oData) return;
        var oLayer = this.findLayer(this._oPolygonUnloadGroup, oData.id);
        if (!oLayer) return;
        if (oLayer.oMarker) {
            this._oPolygonUnloadGroup.removeLayer(oLayer.oMarker);
        }
        this._oPolygonUnloadGroup.removeLayer(oLayer);
    },

    //删除所有的数据
    clearAllPolygonUnload: function (oData) {
        if (!oData || !oData.anId) return;

        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oPolygonUnloadGroup, anId[i]);
            if (oLayer.oMarker) {
                this._oPolygonUnloadGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolygonUnloadGroup.removeLayer(oLayer);
        }
    },

    //画多边形
    drawPolygonSite: function (oPosInfo) {

        if (!this._oPolygonUnloadGroup) return;

        var oTemp = this.findLayer(this._oPolygonUnloadGroup, oPosInfo.Id);
        if (oTemp) return;

        var oInfo = JSON.parse(oPosInfo.Map);
        if (!oInfo) return;
        var Polygon = null;

        var oIcon = new L.DivIcon({
            html: "<div></div>",
            className: '',
        });
        oInfo.oOption.cData = oPosInfo;

        var cHtml = this._getPopHtml(oPosInfo);
        if (oInfo.nType == '501002') {

            var nZoom = this.oMap.getZoom();
            var oBPos = this.oMap.options.crs.latLngToPoint(L.latLng(oInfo.aoLatLag[0]), nZoom);
            var oEPos = this.oMap.options.crs.latLngToPoint(L.latLng(oInfo.aoLatLag[1]), nZoom);

            Polygon = L.circle(oInfo.aoLatLag[0], oBPos.distanceTo(oEPos), oInfo.oOption).addTo(this._oPolygonUnloadGroup);
            var oMarker = L.marker(oInfo.aoLatLag[0], { cDevId: oPosInfo.Id, icon: oIcon, cData: oPosInfo, bIsNotEdit: true });

            Polygon.oMarker = oMarker;
            Polygon.cId = oPosInfo.Id;
            oMarker.bindLabel(oPosInfo.Name, { noHide: false, direction: "auto" });
            oMarker.addTo(this._oPolygonUnloadGroup);
            Polygon.bindPopup(cHtml);
        }
        else {
            Polygon = L.polygon(oInfo.aoLatLag, es.mapConfig.oUnloadConfig).addTo(this._oPolygonUnloadGroup);
            var oBound = new L.LatLngBounds(oInfo.aoLatLag);
            var oLatLng = oBound.getCenter();
            var oMarker = L.marker(oLatLng, { cDevId: oPosInfo.Id, icon: oIcon, bIsNotEdit: true });

            Polygon.oMarker = oMarker;
            Polygon.cId = oPosInfo.Id;
            oMarker.bindLabel(oPosInfo.Name, { noHide: false, direction: "auto" });
            oMarker.addTo(this._oPolygonUnloadGroup);
            Polygon.bindPopup(cHtml);

            var oPopup = Polygon._popup;
            oPopup.oGpsInfo = oPosInfo;
            this.initPopup(oPopup);

        }

        return Polygon;
    },

    initPopup: function (oPopup) {
        var self = this;

        if (!oPopup) return;

        oPopup.on("contentupdate", function () {

            var oGpsInfo = this.oGpsInfo;
            $("a[cid='U" + oGpsInfo.Id + "']").data("oGpsInfo", oGpsInfo);

        })
    },

    drawOneUnload: function (oData) {
        if (!oData) return;

        var aoLatLng = [];
        var oInfo = oData;
        var oLayer = null;

        //获得当前图层层级，如果是1-5层
        var oLayer = null;


        for (var i in oInfo) {
            if (!oInfo[i].MapCoor) continue;
            oInfo[i].Map = oInfo[i].MapCoor;
            $.merge(aoLatLng, JSON.parse(oInfo[i].MapCoor).aoLatLag);
            oInfo[i].Id = oInfo[i].XID;
            oInfo[i].Name = oInfo[i].PlaceName;
            oLayer = this.drawPolygonSite(oInfo[i]);

        }

        var oBound = new L.LatLngBounds(aoLatLng);
        this._oMap.fitBounds(oBound);
        return oBound;
    },

    drawUnload_old: function (oData) {
        if (!oData) return;

        var aoLatLng = [];
        var oInfo = oData;
        var oLayer = null;

        //获得当前图层层级，如果是1-5层
        var nZoom = 18;
        var oLayer = null;

        //获得地图中心点
        this._oSiteGroup.clearLayers();
        this._oPolygonUnloadGroup.clearLayers();

        if (nZoom <= 5) {
            this._oSiteGroup.clearLayers();
        }
        else if (nZoom > 5 && nZoom <= 20) {
            for (var i in oInfo) {
                if (!oInfo[i].MapCoor) continue;
                oInfo[i].Map = oInfo[i].MapCoor;
                $.merge(aoLatLng, JSON.parse(oInfo[i].MapCoor).aoLatLag);
                oInfo[i].Id = oInfo[i].XID;
                oInfo[i].Name = oInfo[i].PlaceName;
                oLayer = this.drawSiteMarker(oInfo[i]);
                oLayer.oParent = this;
                oLayer.oData = oInfo[i];
                oLayer.on('click', this.showSiteInfo);
            }

        }
        else {

            for (var i in oInfo) {
                if (!oInfo[i].MapCoor) continue;
                oInfo[i].Map = oInfo[i].MapCoor;
                $.merge(aoLatLng, JSON.parse(oInfo[i].MapCoor).aoLatLag);
                oInfo[i].Id = oInfo[i].XID;
                oInfo[i].Name = oInfo[i].PlaceName;
                oLayer = this.drawPolygonSite(oInfo[i]);
                oLayer.oData = oInfo[i];
                oLayer.on('click', this.showSiteInfo);
                this._oParent.fire("MapSite:showSiteInfo", oInfo[i]);
                this.showSiteInfo()
                this.clearRegion();
            }
        }
        var oBound = new L.LatLngBounds(aoLatLng);

        return oBound;
    },
})
