/**
 * Created by Lenovo on 2017/12/13.
 */
// 地图监控工地显示编写
ES.MapBase.SiteMap = ES.MapBase.Site.extend({

    // 重新写弹出层 在设置弹出层消息时访问后台设置弹出层
    _drawSiteMarker: function (oPosInfo, nIndex) {

        if (!this._oSiteGroup) return;

        var oInfo = JSON.parse(oPosInfo.MapCoor);
        if (!oInfo) return;
        var oLayer = this.findLayer(this._oSiteGroup, oPosInfo.SID);

        if (oLayer) return oLayer;


        var oBound = new L.LatLngBounds(oInfo.aoLatLag);
        var oLatLng = oBound.getCenter()
        if (oInfo.nType == '501002') {
            oLatLng = oInfo.aoLatLag[0];
        }

        var cHtml = this._getPopHtml(oPosInfo);
        var oIcon = this._getIcon(this._getIconHtml(oPosInfo));
        var oMarker = L.marker(oLatLng, { icon: oIcon });
        oMarker.cId = oPosInfo.SID;
        oMarker.oPosInfo = oPosInfo;

        oMarker.bindLabel(oPosInfo.SiteName, { offset: [20, -32], noHide: false, direction: "auto" });
        oMarker.bindPopup(cHtml);

        var oPopup = oMarker.getPopup();
        oPopup.oGpsInfo = oPosInfo;
        this.initPopup(oPopup);

        oMarker.addTo(this._oSiteGroup);

        if (nIndex == 0) {
            this._oMap.panTo(oLatLng);
            oMarker.openPopup();
        }
        // 给点对象添加tip
        //this.addPopup(oPosInfo, oMarker);

        return oMarker;
    },
    _drawPolygonSite: function (oPosInfo, nIndex) {
        if (!this._oPolygonSiteGroup) return;
        var oTemp = this.findLayer(this._oPolygonSiteGroup, oPosInfo.SID);
        if (oTemp) return;

        var oInfo = JSON.parse(oPosInfo.MapCoor);
        if (!oInfo) return;
        var oPolygon = null;
        var oIcon = new L.DivIcon({
            html: "<div></div>",
            className: '',
        });
        oInfo.oOption.cData = oPosInfo;
        var cHtml = this._getPopHtml(oPosInfo);

        // 中心点
        var oLatLng = null;
        if (oInfo.nType == '501002') {
            var nZoom = this.oMap.getZoom();
            var oBPos = this.oMap.options.crs.latLngToPoint(L.latLng(oInfo.aoLatLag[0]), nZoom);
            var oEPos = this.oMap.options.crs.latLngToPoint(L.latLng(oInfo.aoLatLag[1]), nZoom);
            oPolygon = L.circle(oInfo.aoLatLag[0], oBPos.distanceTo(oEPos), oInfo.oOption).addTo(this._oPolygonSiteGroup);

            oLatLng = oInfo.aoLatLag[0];
        }
        else {
            var oSiteConfig = ES.extend({},es.mapConfig.oSiteConfig);
            if (oPosInfo.bIsThen) {
                oSiteConfig.color = '#0096ff';
                oSiteConfig.fillColor = "#0FFF05";
            }
            oPolygon = L.polygon(oInfo.aoLatLag, oSiteConfig).addTo(this._oPolygonSiteGroup);
            var oBound = new L.LatLngBounds(oInfo.aoLatLag);
            oLatLng = oBound.getCenter();
            oPolygon.cId = oPosInfo.SID;
        }

        // 画双围栏数据
        this.drawSmallFence(oPosInfo);

        oPolygon.bindPopup(cHtml);
        var oMarker = L.marker(oLatLng, { icon: oIcon, bIsNotEdit: true });
        oMarker.bindLabel(oPosInfo.SiteName, { noHide: true, direction: "auto" });
        oMarker.addTo(this._oPolygonSiteGroup);

        var oPopup = oPolygon._popup;
        oPopup.oGpsInfo = oPosInfo;
        this.initPopup(oPopup);
        if (nIndex == 0) {
            this._oMap.panTo(oLatLng);
            oPolygon.openPopup();
        }
        oPolygon.oMarker = oMarker;
        return oPolygon;
    },

    // 注册弹出层事件,弹出层绑定对象
    initPopup: function (oPopup) {

        var self = this;

        if (!oPopup) return;

        oPopup.on("contentupdate", function () {

            var oGpsInfo = this.oGpsInfo;
            self.setVehInfo(oGpsInfo);

        })
    },

    _getPopHtml: function (oGpsInfo) {
        var cHtml = "<div style='width:300px'><strong>工地名称：</strong>" + oGpsInfo.SiteName + " <div><div cId='divContent'></div>"

        return cHtml;
    },

    // 设置车辆趟数 列表
    setVehInfo: function (oData) {
        var self = this;//GetSiteTrip
        ES.getData({ sBossId: oData.BOSSID }, "/Site/GetSiteTrip", this.setVehInfoHandler, this, oData);
    },

    setVehInfoHandler: function (oTemp) {
        var oData = oTemp.oData;
        var dWorkSiteTime = 0;
        var dUnloadSiteTime = 0;

        var aoVehNo = [];
        var oHtml = this.setSiteTable(oData, aoVehNo);
        var cHtml = this.getTrHtml(aoVehNo);

        {
            // 设置工地详情
            var cSiteHtml = " <div><ul class='siteview-siteinfo'>" +
                "<li><strong>开始出土时间：</strong> " + ((!oHtml.dWorkSiteTime) ? "" : es.comFunc.dateFormat(oHtml.dWorkSiteTime, "yyyy-MM-dd hh:mm:ss")) + "  </li>" +
                " <li><strong>最新出土时间：</strong> " + ((!oHtml.dUnloadSiteTime) ? "" : es.comFunc.dateFormat(oHtml.dUnloadSiteTime, "yyyy-MM-dd hh:mm:ss")) + " </li>" +
                " <li><strong>所属区域：</strong>" + oTemp.QIDstr + "</li>" +
                " <li><strong>工地位置：</strong>" + (oTemp.SiteAddress||"") + "</li>" +
                " <li><strong>出土次数：</strong>" + ((!oHtml.nCnt) ? 0 : oHtml.nCnt) + "</li>" +
                " <li><strong>出土车辆数：</strong>" + (aoVehNo.length ? aoVehNo.length : 0) + " <a cid='" + oTemp.BOSSID + "' class='btn btn-xs btn-success' onclick='addTask(this,2)' style='position: absolute;right: 15px;color: #fff;'>发布任务</a></li>" ;
            cSiteHtml += "</ul></div>"

            var cVehInfo = '<div style="height: ' + this.calHeigh(aoVehNo) + 'px; overflow-y: auto">  <table class="siteview-vehinfo-table" style="width:100%">'
            cVehInfo += '<thead class="siteview-vehinfo-table-th"><tr>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-vehno" >车牌号</th>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-vehCnt" style="text-align:center">出土次数</th>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-date" style="text-align:center">出土时间</th>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-opr" style="text-align:center">	操作  </th></tr> </thead>'
            cVehInfo += '<tbody class="siteview-vehinfo-table-tb">'

            cVehInfo += (cHtml || "") + " </tbody> </table></div>"


            var cAllHtml = cSiteHtml + cVehInfo;
        }

        $("div[cId='divContent']").html(cAllHtml)

        $("a[cid='" + oTemp.BOSSID + "']").data("oGpsInfo", oTemp);
    },

    // 设置工地表格
    setSiteTable: function (oData, aoVehNo) {

        if (!oData || oData.length <= 0) return "";
        var nCnt = 0;
        var dWorkSiteTime = 0;
        var dUnloadSiteTime = 0;

        // 情况列
        for (var i = 0; i < oData.length; i++) {
            var nIndex = ES.Util.arrayIndex(aoVehNo, oData[i], "VehicleNo");
            if (nIndex < 0) {
                var oTemp = {};
                ES.extend(oTemp, oData[i]);
                oTemp.nBeginTime = new Date(oData[i].BeginTime).getTime();
                oTemp.nEndTime = new Date(oData[i].EndTime).getTime();
                aoVehNo.push(oTemp);
                oTemp.nCnt = 1;
            }
            else {
                // 更新时间
                var nBT = new Date(oData[i].BeginTime).getTime();
                var nET = new Date(oData[i].EndTime).getTime();
                if (aoVehNo[nIndex].nBeginTime > nBT) {
                    aoVehNo[nIndex].nBeginTime = nBT;
                    aoVehNo[nIndex].BeginTime = oData[i].BeginTime;
                }
                if (aoVehNo[nIndex].nEndTime < nET) {
                    aoVehNo[nIndex].nEndTime = nET;
                    aoVehNo[nIndex].EndTime = oData[i].EndTime;
                }

                aoVehNo[nIndex].nCnt = aoVehNo[nIndex].nCnt + 1;
            }

            nCnt = nCnt + 1;
            if (i == 0) {
                dWorkSiteTime = new Date(oData[i].BeginTime).getTime();
                dUnloadSiteTime = new Date(oData[i].EndTime).getTime();
            }
            else {
                if (dWorkSiteTime > new Date(oData[i].WorkSiteTime).getTime()) {
                    dWorkSiteTime = new Date(oData[i].WorkSiteTime).getTime()
                }
                if (dUnloadSiteTime < new Date(oData[i].UnloadSiteTime).getTime()) {
                    dUnloadSiteTime = new Date(oData[i].UnloadSiteTime).getTime()
                }
            }
        }

        return { nCnt: nCnt, dWorkSiteTime: dWorkSiteTime, dUnloadSiteTime: dUnloadSiteTime };
    },

    // 初始化tr 的html数据
    getTrHtml: function (aoVeh) {
        var cHtml = "";
        if (!aoVeh || aoVeh.length <= 0) return cHtml;

        for (var i = 0; i < aoVeh.length; i++) {
            var cUrl = "/Track/TrackView_V3?cDevId=" + aoVeh[i].PhoneNum + "&cVehNo=" + aoVeh[i].VehicleNo
                + "&nBTick=" + (aoVeh[i].nBeginTime / 1000) + "&nETick=" + (aoVeh[i].nEndTime / 1000);
            cHtml += '<tr >' +
                '<td class="siteview-vehinfo-table-tb-veh" >' + aoVeh[i].VehicleNo + '	</td>' +
                '<td class="siteview-vehinfo-table-tb-vehCnt"  style="text-align:center">' + aoVeh[i].nCnt + '	</td>' +
                '<td class="siteview-vehinfo-table-tb-date" >' + aoVeh[i].BeginTime + '	</td>' +
                '<td  class="siteview-vehinfo-table-tb-url">' +
                '<button class="btn btn-xs btn-success" onclick= window.open("' + cUrl + '")><i class="fa fa-map-marker"></i>轨 迹</button> ' +
                '</td>' +
                '</tr>';
        }

        return cHtml
    },

    calHeigh: function (aoVehNo) {
        if (aoVehNo.length >= 3) return 100;

        return (aoVehNo.length + 1) * 25;
    },
    addPopup: function (oGpsInfo, oLayer) {
        if (!oGpsInfo || !oLayer) return;
        this._oLayerPop = oLayer;
        this.setVehInfo(oGpsInfo);
    }
})