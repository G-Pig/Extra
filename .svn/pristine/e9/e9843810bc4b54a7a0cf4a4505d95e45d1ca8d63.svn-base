/**
 * Created by Lenovo on 2017/12/13.
 */


// 监控页面的可疑工地
ES.MapBase.MDoubtSite = ES.MapBase.DoubtSite.extend({
    //执行画点，画线操作
    oOption: {
        cEvenDraw: "SiteMap:drawMDoubtSite",
        cEvenClear: 'SiteMap:clearMDoubtSite',
        cLabel: '可疑工地:',
        cHtml: '<div class="ex-monitor-mapicon-site unknow "><div class="site-body"></div></div>'
    },

    _loadOn: function () { },

    _getPopHtml: function (oPosInfo) {
        var cHtml = '<h4><b>' + this.oOption.cLabel + oPosInfo.Address + '</b></h4>';

        return cHtml;
    },

    // 画可疑工地
    _drawSiteMarker: function (oPosInfo, nIndex) {

        if (!this._oSiteGroup) return;

        var oLayer = this.findLayer(this._oSiteGroup, "s" + nIndex);

        if (oLayer) return oLayer;

        var oLatLng = L.latLng(oPosInfo.Gps.Lat, oPosInfo.Gps.Lon);

        //var cHtml = this._getPopHtml(oPosInfo);
        var oIcon = this._getIcon(this._getIconHtml(oPosInfo));
        var oMarker = L.marker(oLatLng, { icon: oIcon });
        oMarker.cId = "s" + nIndex;
        oMarker.oPosInfo = oPosInfo;

        oMarker.bindLabel(oPosInfo.Address, { offset: [20, -32], noHide: false, direction: "auto" });

        // 绑定弹出层要做修改
        var oPopContent = this.dealSiteData(oPosInfo);
        var cHtml = this.getPopupContent(oPopContent, oPosInfo);
        oMarker.bindPopup(cHtml);
        oMarker.addTo(this._oSiteGroup);

        return oMarker;
    },

    _getIcon: function (cHtml) {

        var oIcon = L.divIcon({
            iconSize: [20, 20], iconAnchor: [10, 20],
            popupAnchor: [5, -20],
            className: "",
            html: cHtml,
        });
        return oIcon;
    },

    // 对每个工地数据进行处理
    dealSiteData: function (oGpsInfo) {
        if (!oGpsInfo) return;
        // 保存车辆数据
        var aoVehData = [];
        // 记录工地开始出土时间，结束出土时间
        var nBeginTick = 0;
        var nEndTick = 0;
        for (var i = 0; i < oGpsInfo.TripList.length; i++) {
            var oItem = {};
            ES.Util.extend(oItem, oGpsInfo.TripList[i])
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
            nCnt: oGpsInfo.TripList.length,
            // 出土车辆
            nCntVeh: aoVehData.length,
        }
    },

    // 数据分析， 分析每个工地的数据
    getPopupContent: function (oPopContent, oGpsInfo) {
        var cRegion = "";
        var aoRegion = oGpsInfo.Address.split(',');
        if (aoRegion && aoRegion.length > 0) {
            cRegion = aoRegion[0];
        }
        var cVehHtml = this.setSiteTable(oGpsInfo.TripList);
        {
            // 设置工地详情
            var cSiteHtml = "<div style='width:300px'><strong>名称：</strong>" + oGpsInfo.Address + " <div>" +
                "<div cId='divContent'>" +
                " <div><ul class='siteview-siteinfo'>" +
                "<li><strong>开始出土时间：</strong> " + ((!oPopContent.nBeginTick) ? "" : es.comFunc.dateFormat(oPopContent.nBeginTick * 1000, "yyyy-MM-dd hh:mm:ss")) + "  </li>" +
                " <li><strong>最新出土时间：</strong> " + ((!oPopContent.nEndTick) ? "" : es.comFunc.dateFormat(oPopContent.nEndTick * 1000, "yyyy-MM-dd hh:mm:ss")) + " </li>" +
                " <li><strong>所属区域：</strong>" + cRegion + "</li>" +
                //" <li><strong>工地位置：</strong>" + oGpsInfo.SiteAddress + "</li>" +
                " <li><strong>出土次数：</strong>" + ((!oPopContent.nCnt) ? 0 : oPopContent.nCnt) + "</li>" +
                " <li><strong>出土车辆数：</strong>" + (oPopContent.nCntVeh ? oPopContent.nCntVeh : 0) + "</li>";
            cSiteHtml += "</ul></div>"

            var cVehInfo = '<div style="height: ' + this.calHeigh(oGpsInfo.TripList) + 'px; overflow-y: auto">  <table class="siteview-vehinfo-table" style="width:100%">'
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

    //删除所有的数据
    clearDoubtSite: function (oData) {

        if (!this._oSiteGroup) return;
        this._oSiteGroup.clearLayers();


    },
})