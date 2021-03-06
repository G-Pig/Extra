/**
 *
 * 停留点，停留请求,停留点的数据有停留面板决定
 *
 * Created by liulin on 2017/2/22.
 */



ES.TrackView.PointLayer.ParkMarkerMgr = ES.TrackView.PointLayer.BaseMarker.extend({

    // 监听多个事件
    initOn: function () {

        // 设置停留点的数据
        this._oParent.on(this._oParent.getEvenName("setParkData"), this.setParkData, this);
        //通知定时器开始执行播放轨迹
        this._oParent.on("Track:Bar.dealParkMarkers", this.dealParkMarkers, this);

        this._oParent.on("Track:Bar.clearParkMarkers", this.clearMarkers, this);

        this._oParent.on(this._oParent.getEvenName("localParkMarker"), this.localParkMarker, this);
        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },
    getIcon: function () {
        var oIcon = L.divIcon({
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [-1, -32],
            className: '',
            html: '<div class="track-marker track-park-marker"></div>',
        });
        return oIcon
    },
    // 定位点
    localParkMarker: function (oData) {
        if (!oData ||!oData.oItem) {
            return;
        }
        var oItem = oData.oItem;

        this.drawMarker(oItem);

        // 定位
        var oLatLng = L.latLng(oItem.oEndPos.Lat, oItem.oEndPos.Lon);
        this.flyTo(oLatLng);
    },

    setParkData: function (oData) {
        this.aoData = oData.DataStop;
    },

    // 画停留点的入口
    dealParkMarkers: function (oData) {
        if (!oData) return;

        if (oData.bIsDraw) {
            this.drawMarkers()
        } else {
            this.clearMarkers();
        }
    },

    drawMarkers: function () {
        if (!this.aoData || this.aoData.length <= 0) return;
        for (var i = 0; i < this.aoData.length ; i++) {
            this.drawMarker(this.aoData[i]);
        }
    },

    clearMarkers: function () {
        if (!this._oMarkerGroup) return;

        this._oMarkerGroup.clearLayers();
    },

    drawMarker: function (oData) {

        var oLayer = this.findLayer(this._oMarkerGroup, oData.nIndex);
        if (!oLayer) {
            oLayer = L.marker([oData.oEndPos.Lat, oData.oEndPos.Lon], { icon: this.getIcon() });
            oLayer.cId = oData.nIndex;
            oLayer.addTo(this._oMarkerGroup);
            oLayer.bindPopup(this.getHtml(oData));
        } else {
            // 更新位置信息
            oLayer.setLatLng([oData.oEndPos.Lat, oData.oEndPos.Lon]);
            oLayer.openPopup();
        }
    },

    // 获得popup 的html
    getHtml: function (oGpsInfo) {
        var nTime = ES.Util.toDate(oGpsInfo.cEndDate).getTime() - ES.Util.toDate(oGpsInfo.cBeginDate).getTime();
        var oTime = ES.TrackHelper.getTrackDateMsg(nTime);

        var nParkdue = oTime.nTime + " " + oTime.cMsg;
        var cParkTime = oGpsInfo.cBeginDate + ' 到 ' + oGpsInfo.cEndDate;

        var cHtml =
        '<div class="ex-maptip-ztc">' +
        '   <div class="ex-content-info-box ">'+
        '       <ul class="ec-u-sm-12">' +
        '           <li><span><b>停车点</b></span></li>'+
        '           <li><span>停车时长：' + nParkdue + ' <span></li>' +
        '           <li><span>停车位置：' + oGpsInfo.cEndAddr + ' </span></li>' +
        '           <li><span>停车时间：' + cParkTime + ' </span></li>' +
        '       </ul>'+
        '   </div>' +
        '</div>';
        return cHtml;
    },
})