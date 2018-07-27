/**
 * Created by liulin on 2017/1/7.
 */
ES.MapView.MapLive = L.MapLib.MapMaster.MapOpr.extend({
    /**
     为构造函数
     @oParent 为父级页面对象
     @oOption 为参数，设置当前的参数
     */
    initialize: function (oParent, oOption,oMap) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oOption, oMap);
        // 添加图层
        this._loadLayerGroup();
        // 注册监听事件
        //this._initOn();
        this.devNo = oOption.devNo || "-1";
        this.cId = null;
    },
    setOption: function(oGpsInfo) {
        if(oGpsInfo.hasOwnProperty('vehNo')){
            delete  oGpsInfo.vehNo;
        }
        if(oGpsInfo.hasOwnProperty('CompanyName')){
            delete  oGpsInfo.CompanyName;
        }
        if(oGpsInfo.hasOwnProperty('currentState')){
            delete  oGpsInfo.currentState;
        }
        return ES.extend(this.options, oGpsInfo);
    },
    // 收到点击详情详情时设置的参数
    setFristGps:function(oGpsInfo) {
        this.oFristGps = oGpsInfo;
    },
    // 初始化监听事件
    _initOn: function () {
        this._oMap.on("moveend", this._mapMoveHandler, this);
        // 画实时点
        this._oParent.on("MV:Real.drawLiveTrack", this.drawLiveTrack, this);
        // 判断是否显示弹出层
        this._oParent.on("MV:Real.showVecMarkerPop", this._showVecMarkerPop, this);
        // 放大实时监控点
        this._oParent.on("MV:Real.setLiveZoomIn", this.setLiveZoomIn, this);
        // 清除实时跟踪的点、历史点、轨迹线
        this._oParent.on("MV:Real.clearLiveTrack", this.clearLiveTrack, this);
        this._oParent.on("MapView:MapLive.setZoomIn", this.setZoomIn, this);
    },
    // 实现地图放大
    setZoomIn:function(oData) {
        if (!oData || !oData.oGpsInfo) {
            return;
        }
        var oGpsInfo = oData.oGpsInfo;
        var oLayer = this.findLayer(this._oLivePosGroup, oGpsInfo.devNo);
        if (!oLayer) {
            return;
        }
        var oLatLng = oLayer.getLatLng();
        this.flyTo(oLatLng, {zoom: 16});
        // 打开popup层显示车辆数据
        oLayer.openPopup();
    },
    // 关闭事件
    offEven: function () {
        this._oMap.off("moveend", this._mapMoveHandler, this);
        // 画实时点
        this._oParent.off("MV:Real.drawLiveTrack", this.drawLiveTrack, this);
        //解决聚合和实时同时存在问题
        this._oParent.off("MV:Real.unVisibleMarker");
        // 判断是否显示弹出层
        this._oParent.off("MV:Real.showVecMarkerPop", this._showVecMarkerPop, this);
        // 放大实时监控点
        this._oParent.off("MV:Real.setLiveZoomIn", this.setLiveZoomIn, this);
        // 清楚实时跟踪的点、历史点、轨迹线
        this._oParent.off("MV:Real.clearLiveTrack", this.clearLiveTrack, this);
    },
    //添加实时跟踪状态数据
    _loadLayerGroup: function () {
        //线路
        this._oLineGroup = L.featureGroup();
        this._oMap.addLayer(this._oLineGroup);
        //轨迹点
        this._oTrackGroup = L.featureGroup();
        this._oMap.addLayer(this._oTrackGroup);
        //实时跟踪点
        this._oLivePosGroup = L.featureGroup();
        this._oMap.addLayer(this._oLivePosGroup);
    },
    //判断弹出层是否应该弹出，如果地图为当前获得页，就弹出层，否则不弹出
    //对地图进行了放大缩小操作
    _showVecMarkerPop: function (oData) {
        if (!this._oLivePosGroup) return;
        var bActive = $("#Map").hasClass("active");
        var oGpsInfo = oData.oGpsInfo;
        this._oLivePosGroup.eachLayer(function (oLayer) {
            if (oGpsInfo.cDevId != oLayer.cId) {
                oLayer.closePopup();
                return;
            }
            if (bActive) {
                this._oMap.setView(oLayer.getLatLng(), 17);
                oGpsInfo.bOpenBubble ? oLayer.openPopup() : oLayer.closePopup();
            }
            else {
                oLayer.closePopup();
            }
        }, this)
    },
    //修改弹出层样式错误，
    _updateVecMarkerPop: function (oLivePosLayer, cHtml) {
        if (!oLivePosLayer) return;
        oLivePosLayer.setPopupContent(cHtml);
    },
    //画布,实时跟踪绘制，如线，轨迹点等，oPosInfo，为当前点信息
    _drawLiveHis: function ( ) {
        var oGpsInfo =  this.oGpsInfo;
        var oPrePosInfo = null;
        var oLineLayer = this.findLayer(this._oLineGroup, oGpsInfo.devNo);
        if (!oLineLayer) {
            //创建线图层
            var oPloyLine = L.polyline([oGpsInfo.latLng], ES.MapView.oConfig.oLiveLineConfig);
            oPloyLine.cId = oGpsInfo.devNo;
            oPloyLine.oPrePosInfo = oGpsInfo;
            oPloyLine.addTo(this._oLineGroup);
        }
        else {
            oPrePosInfo = oLineLayer.oPrePosInfo;
            oLineLayer.oPrePosInfo = oGpsInfo;
            oLineLayer.addLatLng(oGpsInfo.latLng);
        }
        //创建轨迹图层
        if (oPrePosInfo) {
            var oTrackLayer = L.circleMarker(oPrePosInfo.latLng, ES.MapView.oConfig.oLiveCircleMarkerConfig);
            oTrackLayer.addTo(this._oTrackGroup);
            oTrackLayer.oGpsInfo = oGpsInfo;
            // 设置对象的弹出层
            this.initPopup(oTrackLayer);
            this.initPopupEvent(oTrackLayer);
            //oGpsInfo.bOpenBubble ? oTrackLayer.openPopup() : oTrackLayer.closePopup();
        }
    },
    // 创建实时跟踪点
    _createLive: function (oGpsInfo) {
        var oLatLng = oGpsInfo.latLng;
        var oLayer = L.Marker.movingMarker([oLatLng], [], {
            icon: this._getPosIconInfo(oGpsInfo, {nWidth: 30, nHeight: 40, nInitDir: 180})
        });
        oLayer.cId = oGpsInfo.devNo;
        oLayer.oData = oGpsInfo;
        return oLayer;
    },
    // 在地图上绘制实时跟踪的点
    _drawLive: function () {
        if (!this._oLivePosGroup) {
            return;
        }
        var  oGpsInfo = this.oGpsInfo;
        var oLayer = this.findLayer(this._oLivePosGroup, oGpsInfo.devNo);
        if (!oLayer) {
            this.clearLiveTrackFrom(oGpsInfo);
            oLayer = this._createLive(oGpsInfo);
            oLayer.addTo(this._oLivePosGroup);
            oLayer.oGpsInfo = oGpsInfo;
            this.initPopup(oLayer);
            this.initPopupEvent(oLayer);
            //oGpsInfo.bOpenBubble ? oLayer.openPopup() : oLayer.closePopup();
            this.oLayer = oLayer
            this.flyTo(oLayer.getLatLng(), {zoom: 13});
        }
        else {
            oLayer.moveTo(oGpsInfo.latLng,5000);
            if (oLayer.oCircle) {
                oLayer.oCircle.setLatLng(oGpsInfo.latLng);
            }
            oLayer.oGpsInfo = oGpsInfo;
            this.initPopup(oLayer);
        }
        this._setHeading(oGpsInfo, 180);
        this.selectLi(oGpsInfo);
        oLayer._bringToFront();
        return oLayer;
    },
    //WQ通过class获取li
    selectLi: function (oPosInfo) {
        var cId = oPosInfo.devNo;
        var oLi = $(".ex-layout-carlist-content").find("li");
        for (var i = 0; i < oLi.length; i++) {
            var oLiData = $(oLi[i]).data("data");
            if (oLiData.devNo == cId) {
                $(oLi[i]).removeData("data");
                $(oLi[i]).data("data", oPosInfo)
            }
        }
    },
    // 地图监控移动设置
    _mapMoveHandler: function () {
        if (!this._oLivePosGroup) return;
        this._oLivePosGroup.eachLayer(function (oLayer) {
            if (!oLayer._bringToFront) return;
            oLayer._bringToFront();
        }, this);
    },
    // 清除实时跟踪的点，给其他图层添加点
    clearLiveTrack: function () {
        this._oLivePosGroup.clearLayers();
        this._oLineGroup.clearLayers();
        this._oTrackGroup.clearLayers();
        //this.options.lat =  this.options.Lat ||this.options.lat;
        //this.options.lng =  this.options.Lng ||this.options.lng;
        //在图层上添加车辆图表
        this._oParent.fire("MapView:MapLive.addMarker", {oGpsInfo:this.options});
    },
    // 清除实时跟踪的对象，为自己
    clearLiveTrackFrom: function (oGpsInfo) {
        this._oLivePosGroup.clearLayers();
        this._oLineGroup.clearLayers();
        this._oTrackGroup.clearLayers();
        this._oParent.fire("MapView:ClusterLayer.removeLayer", {oGpsInfo:oGpsInfo});
    },
    // 画实时跟踪轨迹数据
    drawLiveTrack: function (oData) {
        if (!oData.oGpsInfo.latLng) {
            return;
        }
        // 数据缓存到 this.oGpsInfo
        this.oGpsInfo = oData.oGpsInfo;
        //this.oGpsInfo.vehNo = this.oFristGps.vehNo;
        this._drawLiveHis();
        this._drawLive();
    },
    // 放大地图,放大
    setLiveZoomIn: function () {
        var aoLayer = this._oLivePosGroup.getLayers();
        if (!aoLayer || aoLayer.length <= 0) {
            return;
        }
        if (!aoLayer[0].getLatLng) {
            return;
        }
        var oLatLng = aoLayer[0].getLatLng();
        var nMaxZoom = this._oMap.getMaxZoom();
        this._oMap.setView(oLatLng, nMaxZoom - 1);
    },
});
// 车辆实时跟踪的基本操作
ES.MapView.MapLive.include({
    // 设置弹出层的位置
    oPopOption: { maxWidth: 500 ,autoPan: false},
    // 获得实时跟踪点, 地图统计点数据
    _getPosIconInfo: function (oItem, oOption) {
        oItem.nDir = oItem.dir + oOption.nInitDir;
        return new L.DivIcon({
            html: ES.template(this._getIconHtml(), oItem),
            className: this.getLeightOnCls(oItem),//'ex-monitor-mapicon-truck  yellow ',
            iconSize: L.point(oOption.nWidth, oOption.nHeight),
            popupAnchor: L.point(-0, -20),
        });
    },
    _getIconHtml: function () {
        var cHtml =
           '<div cid="{devNo}" class="car-body" style="transform:rotateZ({nDir}deg);-webkit-transform: rotate({nDir}deg);"></div>' +
           '    <div class="pin-tip " style="display: none;">' +
           '        <div class="pin-dome"><b></b><c></c><d></d></div>' +
           '        <div class="pin-number">{vehNo}</div>' +
           '        <div class="pin-state">' +
           //'            <i class="o-earth"></i>' +
           //'            <i class="cover"></i>' +
           '        </div>' +
           '</div>';
        return cHtml;
    },
    // 设置车辆的角度
    _setHeading: function (oPosInfo, nInitDir) {
        if (!oPosInfo) {
            return;
        }
        if (!nInitDir) {
            nInitDir = 0;
        }
        oPosInfo.nDir = oPosInfo.dir + nInitDir;
        $('div[cId="' + oPosInfo.devNo + '"]').attr('style',ES.template( 'transform: rotate({nDir}deg);-webkit-transform: rotate({nDir}deg);',oPosInfo));
    },
    //根据告警类型，生成告警样式
    alarmToCls: function (oGpsInfo) {
        // 获得车辆的样式 和 车辆告警样式
        var oClass = { cAlarm: "" };
        oGpsInfo.cClsLight = "green";
        // 车灯要修改
        if (!oGpsInfo) return oClass;
        if (oGpsInfo.Speed > 60) {
            oClass.cAlarm = "car-state speed";
        }
        return oClass;
    },
});
// 弹出层的事件操作
ES.MapView.MapLive.include({
    // 注册弹出层事件,弹出层绑定对象,每次不是最新oGpsInfo数据，不能用匿名的函数，需要注销
    initPopupEvent: function (oLayer) {
        var self = this;
        var oPopup = oLayer.getPopup();
        if(!oPopup){
            return;
        }
        oPopup.on("contentupdate", function (){
            // 车辆详情按钮
            var oBtnDetail = $(".leaflet-popup").find("a.ec-icon-truck").parent();
            // 车辆轨迹按钮
            var oBtnTrack = $(".leaflet-popup").find("a.ec-icon-exchange").parent();
            var oMeassageClick = $(".leaflet-popup").find("a.ec-icon-commenting").parent();
            var oGpsInfo = this.oGpsInfo;
            // 绑定事件
            oBtnDetail.bind("click", function () {
                self._oParent.fire("MapView:VehDetail.showDetail",{oGpsInfo:oGpsInfo});
                // 取消订阅
                self._oParent.fire('HubSvr.unsubGps',{aoGpsInfo:[oGpsInfo]});
                // 移除跟踪列表
                self._oParent.fire("MapView:LiveMange.removeAll");
                // 添加跟踪
                self._oParent.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});
            });
            oBtnTrack.bind("click", function () {
                window.open("/MapView/TrackViewV2?PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo);
            });
            // 发送消息
            oMeassageClick.bind("click", function () {
                ES.aWarn('系统正在开发过程！');
            });
        }, oPopup);
    },
    initPopup:function(oLayer){
        if(!this._oParent || !this._oParent._getVecMarkerHtml) {
            var i = 1;
        }
        var cHtml = this._oParent._getVecMarkerHtml(oLayer.oGpsInfo);
        //更新弹出层的信息,修改的目的是防止注册2次点击事件
        var oPopup = oLayer.getPopup();
        if(!oPopup){
            oPopup = oLayer.bindPopup(cHtml, this.oPopOption).getPopup();
        }
        // 再次注册事件
        oPopup.oGpsInfo = oLayer.oGpsInfo;
        oPopup.setContent(cHtml);
        oLayer.oGpsInfo.bOpenBubble ? oLayer.openPopup() : oLayer.closePopup();
        return oPopup;
    },
    // 设置车辆gps信息 和 网络信息
    setMobileInfo: function (oGpsInfo) {
        //去掉on状态
        var $_oIMobile = $(".ex-icon-mobile");
        var $_oIBD = $(".ex-icon-bd");
        $_oIMobile.removeClass("on").removeClass("off");
        $_oIBD.removeClass("on").removeClass("off");
        //判断当前位置信息
        if (oGpsInfo.VehicleStatus == "行驶"
            || oGpsInfo.VehicleStatus == "停车"
            || oGpsInfo.VehicleStatus == "熄火") {
            $_oIMobile.addClass("on");
            $_oIBD.addClass("on");
        }
        else if (oGpsInfo.VehicleStatus == "通讯中断") {
            $_oIMobile.addClass("l-mobile-off");
            $_oIBD.addClass("l-bd-off");
        }
        else if (oGpsInfo.VehicleStatus == "定位失败") {
            $_oIMobile.addClass("on");
            $_oIBD.addClass("off");
        }
        else {
            $_oIMobile.addClass("off");
            $_oIBD.addClass("off");
        }
    },
    // 车辆类型 carUseIn 0 补电车 ，1 物流车，2 其他车，车辆 状态 行驶，停车/ 熄火 / 离线
    getLeightOnCls: function (oData) {
        var cClsType = 'ex-monitor-mapicon-truck';
        var cClsStatus = 'gray';
        if (oData.carType == 0) {
            cClsType = 'ex-monitor-mapicon-tram';
        }
        if (oData.sta == '行驶' || oData.sta == '停车') {
            cClsStatus = 'green';
        }
        else if (oData.sta == '熄火') {
            cClsStatus = 'green';
        }
        else if(oData.sta == '定位失败'){
            cClsStatus = 'yellow';
        }else if(oData.sta == '通讯中断'){
            cClsStatus = 'gray';
        }
        return cClsType+' '+ cClsStatus;
    },
})