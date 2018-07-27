/**
 * Created by Lenovo on 2017/12/13.
 */

// 画可疑工地
ES.MapBase.DoubtSite = ES.MapBase.Site.extend({

    //执行画点，画线操作
    oOption: {
        cEvenDraw: "SiteMap:drawDoubtSite",
        cEvenClear: 'SiteMap:clearDoubtSite',
        cLabel: '可疑工地:',
        cHtml: '<i class="map-poi map-site-poi-stop"><b></b></i>'
    },

    _loadPage: function () {

        this._loadOn();

        this._initGroup();
    },


    // 初始化Group
    _initGroup: function () {

        //把所有的圆点区域绘制在分组图层中
        this._oSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oSiteGroup);


        this.aoSiteInfo = null;
    },

    //初始化时加载数据
    _loadOn: function () {

        this._oParent.on(this.oOption.cEvenDraw, this.drawDoubtSite, this);

        this._oParent.on(this.oOption.cEvenClear, this.clearDoubtSite, this);

    },

    // 画批量的数据
    drawDoubtSite: function (oData) {
        if (!oData || !oData.aoData || oData.aoData.length <= 0) return;
        var self = this;
        $.each(oData.aoData, function (nIndex, oItem) {
            self._drawSiteMarker(oItem, nIndex);
        })
    },

    _getIcon: function (cHtml) {

        var oIcon = L.divIcon({
            iconSize: [20, 20], iconAnchor: [10, 20],
            popupAnchor: [-1, -20],
            className: "poi-site poi-n",
            html: cHtml,
        });
        return oIcon;
    },

    //工地数据
    _getIconHtml: function (oPosInfo) {

        var cHtml = this.oOption.cHtml;
        return cHtml;
    },

    _getPopHtml: function (oPosInfo) {
        var cHtml = '<h4><b>' + this.oOption.cLabel + oPosInfo.PlaceName + '</b></h4>';

        return cHtml;
    },

    _drawSiteMarker: function (oPosInfo, nIndex) {

        if (!this._oSiteGroup) return;

        var oLayer = this.findLayer(this._oSiteGroup, oPosInfo.id);

        if (oLayer) return oLayer;

        var oLatLng = L.latLng(oPosInfo.Point.Lat, oPosInfo.Point.Lon);

        //var cHtml = this._getPopHtml(oPosInfo);
        var oIcon = this._getIcon(this._getIconHtml(oPosInfo));
        var oMarker = L.marker(oLatLng, { icon: oIcon });
        oMarker.cId = oPosInfo.id;
        oMarker.oPosInfo = oPosInfo;
        if (nIndex == 0)
            this._oMap.panTo(oLatLng);
        oMarker.bindLabel(oPosInfo.PlaceName, { offset: [20, -32], noHide: false, direction: "auto" });

        // 绑定弹出层要做修改
        var oPopContent = this.dealSiteData(oPosInfo);
        var cHtml = this.getPopupContent(oPopContent, oPosInfo);
        oMarker.bindPopup(cHtml);
        oMarker.addTo(this._oSiteGroup);

        var oPopup = oMarker.getPopup();
        oPopup.oGpsInfo = oPosInfo;
        this.initPopup(oPopup);

        return oMarker;
    },

    initPopup: function (oPopup) {

        var self = this;

        if (!oPopup) return;

        oPopup.on("contentupdate", function () {

            var oGpsInfo = this.oGpsInfo;
            $("a[cid='DS" + oGpsInfo.id + "']").data("oGpsInfo", oGpsInfo);

        })
    },

    // 数据分析， 分析每个工地的数据
    getPopupContent: function (oPopContent, oGpsInfo) {

        var cVehHtml = this.setSiteTable(oGpsInfo.Vehs);
        {
            // 设置工地详情
            var cSiteHtml = "<div style='width:300px'><strong>名称：</strong>" + oGpsInfo.PlaceName + " <div>" +
                "<div cId='divContent'>" +
                " <div><ul class='siteview-siteinfo'>" +
                "<li><strong>开始出土时间：</strong> " + ((!oPopContent.nBeginTick) ? "" : es.comFunc.dateFormat(oPopContent.nBeginTick * 1000, "yyyy-MM-dd hh:mm:ss")) + "  </li>" +
                " <li><strong>最新出土时间：</strong> " + ((!oPopContent.nEndTick) ? "" : es.comFunc.dateFormat(oPopContent.nEndTick * 1000, "yyyy-MM-dd hh:mm:ss")) + " </li>" +
                " <li><strong>所属区域：</strong>" + oGpsInfo.cRegion + "</li>" +
                //" <li><strong>工地位置：</strong>" + oGpsInfo.SiteAddress + "</li>" +
                " <li><strong>出土次数：</strong>" + ((!oPopContent.nCnt) ? 0 : oPopContent.nCnt) + "</li>" +
                " <li><strong>出土车辆数：</strong>" + (oPopContent.nCntVeh ? oPopContent.nCntVeh : 0) + "</li>"+
                " <li><a cid='DS" + oGpsInfo.id + "' class='btn btn-sm btn-success' onclick='addTask(this,3)'  style='position: absolute;top: 35%;right: 15px;color: #fff;'>发布任务</a></li>";




            cSiteHtml += "</ul></div>"

            var cVehInfo = '<div style="height: ' + this.calHeigh(oGpsInfo.Vehs) + 'px; overflow-y: auto">  <table class="siteview-vehinfo-table" style="width:100%">'
            cVehInfo += '<thead class="siteview-vehinfo-table-th"><tr>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-vehno" style=""> 车牌号</th>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-date" style="">出土时间</th>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-opr" style="">	操作  </th></tr> </thead>'
            cVehInfo += '<tbody class="siteview-vehinfo-table-tb">'
            cVehInfo += (cVehHtml || "") + " </tbody> </table></div></div>"
            var cAllHtml = cSiteHtml + cVehInfo;
        }
        return cAllHtml;
    },

    calHeigh: function (aoVehNo) {
        if (aoVehNo.length >= 3) return 100;

        return (aoVehNo.length + 1) * 25;
    },


    // 设置工地表格
    setSiteTable: function (aoVehNo) {

        if (!aoVehNo || aoVehNo.length <= 0) return "";
        var cHtml = "";
        // 情况列
        for (var i = 0; i < aoVehNo.length; i++) {

            var cUrl = "/Track/TrackView_V3?cDevId=" + aoVehNo[i].PhoneNum + "&cVehNo=" + aoVehNo[i].VehicleNo
                + "&nBTick=" + aoVehNo[i].AlarmStartTime + "&nETick=" + aoVehNo[i].LastUpdateTime
            cHtml += '<tr >' +
                '<td class="siteview-vehinfo-table-tb-veh" >' + aoVehNo[i].VehicleNo + '	</td>' +
                '<td class="siteview-vehinfo-table-tb-date" >' + es.comFunc.dateFormat(aoVehNo[i].AlarmStartTime * 1000, "yyyy-MM-dd hh:mm:ss") + '	</td>' +
                '<td  class="siteview-vehinfo-table-tb-url">' +
                '<button class="  btn btn-xs btn-success" onclick= window.open("' + cUrl + '")><i class="fa fa-map-marker"></i>轨 迹</button> ' +
                '</td>' +
                '</tr>';
        }

        return cHtml;
    },

    // 对每个工地数据进行处理
    dealSiteData: function (oGpsInfo) {
        if (!oGpsInfo) return;
        // 保存车辆数据
        var aoVehData = [];
        // 记录工地开始出土时间，结束出土时间
        var nBeginTick = 0;
        var nEndTick = 0;
        for (var i = 0; i < oGpsInfo.Vehs.length; i++) {
            var oItem = {};
            ES.Util.extend(oItem, oGpsInfo.Vehs[i])
            if (aoVehData.length <= 0) {
                aoVehData.push(oItem);
                nBeginTick = oItem.AlarmStartTime;
                nEndTick = oItem.LastUpdateTime;
            }
            else {

                var nI = ES.Util.arrayIndex(aoVehData, oItem, "VehicleNo");
                if (nI < 0) {
                    aoVehData.push(oItem);
                }
                else {
                    // 更新时间
                    if (aoVehData[nI].AlarmStartTime > oItem.AlarmStartTime) {
                        aoVehData[nI].AlarmStartTime = oItem.AlarmStartTime;
                    }
                    if (aoVehData[nI].LastUpdateTime < oItem.LastUpdateTime) {
                        aoVehData[nI].LastUpdateTime = oItem.LastUpdateTime;
                    }
                }

                if (nBeginTick > oItem.AlarmStartTime) {
                    nBeginTick = oItem.AlarmStartTime;
                }
                if (nEndTick < oItem.LastUpdateTime) {
                    nEndTick = oItem.LastUpdateTime;
                }
            }
        }

        return {
            // 开始时间
            nBeginTick: nBeginTick,
            // 结束时间
            nEndTick: nEndTick,
            // 车辆列表
            aoVehData: aoVehData,
            // 出土次数
            nCnt: oGpsInfo.Vehs.length,
            // 出土车辆
            nCntVeh: aoVehData.length,
        }
    },

    //删除所有的数据
    clearDoubtSite: function (oData) {
        if (!oData || !oData.aoData) return;

        var aoData = oData.aoData;
        for (var i = 0; i < aoData.length; i++) {
            var oLayer = this.findLayer(this._oSiteGroup, aoData[i].id);
            if (oLayer && oLayer.oMarker) {
                this._oSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oSiteGroup.removeLayer(oLayer);
        }
    },


})