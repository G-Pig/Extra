/**
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.RealTrack = {};

ES.TrackView.RealTrack.BaseRealTrack = L.MapLib.MapMaster.MapOpr.extend({
    initialize: function (oParent, oOption) {

        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oOption);

        this._oParent = oParent;

        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    // 灯的转换
    getLight: function (oGpsInfo) {
        var oClass = { cClsLight: 'gray', cClsDoor: 'red', cClsWeight: 'yellow' };

        if (oGpsInfo.nGreenOn === 1) {
            oGpsInfo.cLight = "绿灯";
            oClass.cClsLight = "green";
            return;
        }
        if (oGpsInfo.nRedOn === 1) {
            oGpsInfo.cLight = "红灯";
            oClass.cClsLight = "red";
            return;
        }

        if (oGpsInfo.nYelloOn === 1) {
            oGpsInfo.cLight = "黄灯";
            oClass.cClsLight = "yellow";
            return;
        }

        oGpsInfo.cLight = "白灯";
        oClass.cClsLight = "gray";
        return oClass;
    },

    // 轨迹点tooltip
    getVecMarkerHtmlNotBtn: function (oGpsInfo) {

        var oClass = this.getLight(oGpsInfo);

        //要判断
        var oTemp = {};
        ES.extend(oTemp, oGpsInfo,
            {
                cDir: ES.TrackHelper.getDire(oGpsInfo.Direction),
                cGpsDateTime: oGpsInfo.GpsDateTime.replace("T", " "),
                dMileage: (parseFloat(oGpsInfo.Mileage) / 1000).toFixed(2),
                cPoiInfo: oGpsInfo.Poi.Address || '',
                //VehicleNo:m_VehicleNo
            }, oClass);

        var popupContent = ES.Util.template(
            '<div class="ex-maptip-ztc">' +
            '   <div class="ex-content-info-box">'+
            '       <ul class="ec-u-sm-12">' +
            '           <li><span>车牌号：{VehicleNo}</span></li>'+
            '           <li><span>企业：{CompanyName}</span></li>'+
            //'         <li><span>所属区：{VehicleNo}</span></li>'+
            '           <li><span>载重：{sWeightValue}</span></li>'+
            '           <li><span>速度：{Speed} Km/h <span></li>' +
            '           <li><span>方向：{cDir} </span></li>' +
            '           <li><span>位置：{cPoiInfo} </span></li>' +
            '           <li><span>时间：{cGpsDateTime} </span></li>' +
            '       </ul>'+
            '   </div>' +
            '</div>', oTemp)
        return popupContent;
    },

    // 实时点为车辆时 才能 设置 该点信息获得实时跟踪点, 地图统计点数据
    _getPosIconInfo: function (oItem, oOption) {

        // var cHtml ='"<div cid='" + oItem.PhoneNum + "' class='car-body' style='transform: rotate(" +
        //     (oItem.Direction + 180) + "deg);-webkit-transform: rotate(" + (oItem.Direction + 180) + "deg);'></div> <div class='car-state'></div>"'

        var cHtml =
            '<div cid="{PhoneNum}"  class="car-body" ' +
            '   style="transform:rotate({nDir}deg);-webkit-transform: rotate({nDir}deg);">' +
            '</div>    ' +
            '<div class="pin-tip " style="display: none;">        ' +
            '   <div class="pin-dome"><b></b><c></c><d></d></div>        ' +
            '   <div class="pin-number">{VehicleNo}</div>        ' +
            '   <div class="pin-state"> </div>' +
            '</div>'
        oItem.nDir = oItem.Direction + 180;

        cHtml = ES.template(cHtml,oItem);

        return new L.DivIcon({
            html: cHtml,
            className: "ex-monitor-mapicon-truck green",
            iconSize: L.point(oOption.nSize, oOption.nSize),
            iconAnchor:L.point(16, 16),
            popupAnchor: L.point(-0, -20),

        });
    },

    // 设置车辆的角度
    _setHeading: function (oGpsInfo, nInitDir) {
        if (!oGpsInfo) return;
        if (!nInitDir) nInitDir = 0;
        var nDir = oGpsInfo.Direction + nInitDir;
        $("div[cId='" + oGpsInfo.PhoneNum + "']").attr('style', 'transform: rotate('
            + nDir + 'deg);-webkit-transform: rotate('
            + nDir + 'deg);');
    },

    // 初始化图层
    initGroup: function () {
        this._oLayerGroup = new L.featureGroup();
        this._oLayerGroup.addTo(this._oMap);
    },

    clearMap: function () {
        if (!this._oLayerGroup) {
            return;
        }
        this._oLayerGroup.clearLayers();
    },
});