/**
 * Created by YangHang on 2018/3/2.
 */


ES.MapView.RectLayer = L.MapLib.MapMaster.MapOpr.extend({

    //执行画点，画线操作
    oOption: {
        onEvenSetData: 'MV:Rect.setSiteData',
        onEvenSetStatusData: 'MV:Rect.setStatusData',
        onEvenClearSites: 'MV:Rect.clearSites',

        cHtml: '<div class="{cCls}"><div class="{cBCls}"></div><div class="{cTCls}">{Name}</div></div>',
        oRectConfig: {
            stroke: true,
            color: '#6a7ac3',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 3,
            opacity: 1,
            fill: true,
            fillColor: "#6a7ac3",
            fillOpacity: 0.2,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false
        },
        oVehLineConfig:{
            stroke: true,
            color: '#00bd01',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 5,
            opacity: 1,
        }
    },

    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);
        // 执行自己的方法
        this._initGroup();
        this._loadOn();
        this.initPen();
        this.initOn();

        this._oParam = null;
    },
    initPen: function () {
        this.oDrawPen = {
            enabled: {shapeOptions: this.oOption.oRectConfig},
            handler: new L.Draw.Rectangle(this._oMap, {shapeOptions: this.oOption.oRectConfig}),
            title: L.drawLocal.draw.toolbar.buttons.rectangle
        };
    },
    initOn:function(){
        var self = this;
        self._oMap.on('draw:created', this.createdCallBack, this)
    },
    createdCallBack:function(e){
        var oLayer = e.layer;

        this._oRectGroup.addLayer(oLayer);

        var aoLatLng = oLayer.getLatLngs();

        var _aoLatLng = aoLatLng[0].map(function (oItem) {

            return {lat: oItem.lat, lng: oItem.lng}
        });
        var oB = oLayer.getBounds()

        this._oParam = {
            LeftPoint: { Lon: oB.getWest(), Lat: oB.getNorth() },
            RightPoint: { Lon: oB.getEast(), Lat: oB.getSouth()}
        };

        this._oParent.fire('RectSearch:setLayerGps',{oParam:this._oParam})

    },
    // 初始化Group
    _initGroup: function () {

        //新建拉框图层
        this._oRectGroup = L.layerGroup();
        this._oMap.addLayer(this._oRectGroup);
        //新建车辆轨迹图层
        this._oVehicleLine = L.layerGroup();
        this._oMap.addLayer(this._oVehicleLine);

        this.aoSiteInfo = null;
    },

    //初始化时加载数据
    _loadOn: function () {

        // 通过id获得工地数据
        this._oParent.on("RectView:layer", this.drawRectLayer, this);

        this._oParent.on("unRectView:layer", this.clearRectLayer, this);

        this._oParent.on("VehicleLine:layer", this.drawVehicleLineLayer, this);

        this._oParent.on("unVehicleLine:layer", this.clearVehicleLineLayer, this);
    },

    drawRectLayer:function(oData){
        this.oDrawPen.handler.enable();
    },
    clearRectLayer:function(){
        this._oRectGroup.clearLayers();
    },
    drawVehicleLineLayer:function(oData){

        this.clearVehicleLineLayer();

        var data = oData.oGpsInfo;
        var aoLatLng=[];
        $.each(data,function(i,v){
            aoLatLng.push({lat:v.Lat,lng:v.Lon})
        });

        if(aoLatLng.length === 1 ){

            var oIcon = this._getIcon(0);
            oRectTrack = L.marker(aoLatLng[0],{ icon: oIcon}).addTo(this._oVehicleLine);
        }else{
            var oIconStart = this._getIcon(1);
            var oIconEnd = this._getIcon(2);
            oRectTrack = L.polyline(aoLatLng, this.oOption.oVehLineConfig).addTo(this._oVehicleLine);
            oRectTrack.startMarker = L.marker(aoLatLng[aoLatLng.length-1],{ icon: oIconStart}).addTo(this._oVehicleLine);
            oRectTrack.EndMarker = L.marker(aoLatLng[0],{ icon: oIconEnd}).addTo(this._oVehicleLine);
        }
    },
    clearVehicleLineLayer:function(){
        this._oVehicleLine.clearLayers();
    },

    _getIcon:function(type){
        switch (type){
            case 0:
                var oIcon = L.divIcon({
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-1, -32],
                    className: "parkMarker",
                });
                break;
            case 1:
                var oIcon = L.divIcon({
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-1, -32],
                    className: "beginMarker",
                });
                break;
            case 2:
                var oIcon = L.divIcon({
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-1, -32],
                    className: 'endMarker',
                });
                break;
        }

        return oIcon;
    }

});


ES.MapView.RectLayer.include({
    cHtml:
    '<div class="{cCls}">' +
    '   <div class="pin-tip" style="display: none;">' +
    '       <div class="pin-dome"><b></b><c></c><d></d></div>' +
    '       <div class="pin-number">{Name}</div>' +
    '   </div>' +
    '   <div class="site-body">' +
    '   </div>' +
    '</div>',

});