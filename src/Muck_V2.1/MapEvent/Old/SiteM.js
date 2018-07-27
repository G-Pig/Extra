/**
 * Created by Lenovo on 2017/12/13.
 */

//工地监管，添加画点画线思路
ES.MapBase.SiteM = ES.MapBase.Site.extend({

    //初始化时加载数据
    _loadOn: function () {

        //给界面赋值
        this._oParent.on("MV:Site.setSiteData", this.setSiteData, this);

        // 不需要正在出土数据
        //this._oParent.on("MV:Site.setStatusData", this.setStatusData, this)

        //监听地图放大缩小时间
        this._oMap.on("zoomend", this.drawSiteInfo, this);

        this._oParent.on("MV:Site.clearSites", this.clearSites, this);

        this._oParent.on("MV:Site.setSiteStatus", this.setSiteStatusData, this);

        this.oMap = this._oMap;
        this.oDoubtSite = new ES.MapBase.MDoubtSite(this, {});
    },

    drawSiteInfo: function () {
        var aoTemp = this.getDealSiteData();
        if (!aoTemp || aoTemp.length <= 0) return;
        this.drawSites(aoTemp);
    },


    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawSites: function (aoSiteInfo) {

        if (!aoSiteInfo) return;

        //获得当前图层层级，如果是1-5层
        var nZoom = this._oMap.getZoom();
        var k = -1;

        if (nZoom <= 8) {
            this._oSiteGroup.clearLayers();
            this._oPolygonSiteGroup.clearLayers();
            this.bClear = true;
        }
        else if (nZoom > 8 && nZoom <= 14) {
            this._oPolygonSiteGroup.clearLayers();
            for (var i = 0; i < aoSiteInfo.length; i++) {
                if (aoSiteInfo.length == 1) {
                    k = 0;
                }
                this._drawSiteMarker(aoSiteInfo[i], k);
            }
        }
        else {
            this._oSiteGroup.clearLayers();
            this.bClear = true;
            for (var i = 0; i < aoSiteInfo.length; i++) {
                if (aoSiteInfo.length == 1) {
                    k = 0;
                }
                this._drawPolygonSite(aoSiteInfo[i], k);
            }
        }
    },

    setSiteStatusData: function (oData) {
        if (!oData) return;
        this.aoSiteStutas = oData.aoSiteStutas;

        this._oSiteGroup.clearLayers();
        this._oPolygonSiteGroup.clearLayers();
        this.oDoubtSite.clearDoubtSite();

        //this.oDoubtSite.clearDoubtSite();
        //this.setSiteStatus();

        this.drawSiteInfo();

        // 绘制可疑工地
        for (var i = 0; i < this.aoSiteStutas.length; i++) {
            if (this.aoSiteStutas[i].StatusTag == 20) {
                this.oDoubtSite.drawDoubtSite({ aoData: this.aoSiteStutas[i].Datas });
            }
        }
    },

    // 形成新的画点数据，但是原始画点数据不改变
    getDealSiteData: function () {
        //this.aoSiteStutas // 工地状态数据
        //this.aoSiteInfo // 工地数据
        if (!this.aoSiteStutas || !this.aoSiteInfo || this.aoSiteInfo.length <= 0 || this.aoSiteStutas.length <= 0) return;
        var aoTemp = []
        for (var i = 0 ; i < this.aoSiteInfo.length; i++) {
            var oTemp = this.getSiteStatus(this.aoSiteInfo[i]);

            if (oTemp) aoTemp.push(oTemp);
        }

        return aoTemp;


    },

    // 判断是否存在告警，存在多少个告警
    getSiteStatus: function (oSite) {
        var aoTemp = [];
        var aoSiteStutas = this.aoSiteStutas;
        for (var i = 0; i < aoSiteStutas.length; i++) {
            if (!this.aoSiteStutas[i].Datas || this.aoSiteStutas[i].Datas.length <= 0) continue;

            $.each(this.aoSiteStutas[i].Datas, function (nIndex, oItem) {
                if (oSite.BOSSID == oItem) {
                    aoTemp.push(aoSiteStutas[i].StatusTag);
                }
            })
        }
        if (aoTemp.length > 0) {
            var oTemp = {}
            ES.Util.extend(oTemp, oSite, { aoStatus: aoTemp });

            return oTemp;
        }

        return null;
    },

    // 传递数据设置
    // 画点画线思路
    setSiteStatus: function () {
        if (!this._oSiteGroup) return;
        var self = this;
        var aoSiteStutas = this.aoSiteStutas;
        if (!aoSiteStutas || aoSiteStutas.length <= 0) return;

        // 清除图例
        this._oSiteGroup.eachLayer(function (oLayer) {
            oLayer.cStatus = "";
        })

        // 在地图中遍历cid 为Datas的数据，遍历完成后再修改点的样式
        for (var i = 0; i < aoSiteStutas.length; i++) {
            if (aoSiteStutas[i].StatusTag == 20) {
                this.oDoubtSite.drawDoubtSite({ aoData: aoSiteStutas[i].Datas });
                // 可疑工地操作
                continue;
            }

            if (!aoSiteStutas[i].Datas || aoSiteStutas[i].Datas.length <= 0) continue;

            $.each(aoSiteStutas[i].Datas, function (nIndex, oItem) {
                if (!oItem) return;

                var oLayer = self.findLayer(self._oSiteGroup, oItem);
                if (oLayer) {
                    if (!oLayer.cStatus) { oLayer.cStatus = '<div class="site-body"></div>' }
                    oLayer.cStatus = oLayer.cStatus + self.getStatusForMarker(aoSiteStutas[i].StatusTag);
                }
            })
        }

        if (aoSiteStutas.length == 1 && aoSiteStutas[0].StatusTag != 20) {
            this.oDoubtSite.clearDoubtSite();
        }

        // 更新所有的图表
        this._oSiteGroup.eachLayer(function (oLayer) {

            var cHtml = ' <div class="ex-monitor-mapicon-site green ">{cStatus}</div>';
            cHtml = ES.Util.template(cHtml, oLayer);
            var oIcon = L.divIcon({
                iconSize: [20, 20], iconAnchor: [10, 20],
                popupAnchor: [5, -20],
                className: "",
                html: cHtml,
            });
            oLayer.setIcon(oIcon);
        }, this);
    },

    // 判断在地图上画点的数据状态
    getStatusForMarker: function (cKey) {
        var cHtml = "";
        switch (cKey) {
            //今日上报工地
            case 16:
                cHtml = '<div class="site-state report"></div>';
                break;
            //今日出土工地
            case 7:
                cHtml = '<div class="site-state excavated"></div>';
                break;
            // 停工工地
            case 19:
                cHtml = '<div class="site-state stop"></div>';
                break;
            //提前出土工地
            case 17:
                cHtml = '<div class="site-state ahead"></div>';
                break;
            //未上报出土工地
            case 18:
                cHtml = '<div class="site-state unreport"></div>';
                break;
            default:
                cHtml = "";

        }
        return cHtml
    },

    // 判断地图上画什么样的多边形
    getStatusForPolygen: function (aoStatus) {
        var oHtml = es.mapConfig.oSiteConfig;
        if (!aoStatus) {
            return oHtml;
        }
        if ($.inArray(16, aoStatus) >= 0) {
            oHtml = es.mapConfig.oUnloadConfig;
        }
        if ($.inArray(18, aoStatus) >= 0) {
            oHtml = es.mapConfig.oSiteDoorConfig;
        }
        return oHtml
    },
    // 开始执行的地方,合并数据，
    setSiteData: function (oData) {
        this._oSiteGroup.clearLayers();
        this._oPolygonSiteGroup.clearLayers();
        this.oDoubtSite.clearDoubtSite();
        this.aoSiteInfo = oData.aoSiteInfo;
        this.bClear = true;

        this.drawSites(oData.aoSiteInfo);

    },

    //画单个点
    _drawSiteMarker: function (oPosInfo, nIndex) {

        if (!this._oSiteGroup) return;

        var oInfo = JSON.parse(oPosInfo.MapCoor);
        if (!oInfo) return;
        var oLayer = this.findLayer(this._oSiteGroup, oPosInfo.BOSSID);

        if (oLayer) return oLayer;

        var oBound = new L.LatLngBounds(oInfo.aoLatLag);
        var oLatLng = oBound.getCenter();
        if (oInfo.nType == '501002') {
            oLatLng = oInfo.aoLatLag[0];
        }
        var cHtml = this._getPopHtml(oPosInfo);
        var oIcon = this._getIcon(this._getIconHtml(oPosInfo));
        var oMarker = L.marker(oLatLng, { icon: oIcon });
        oMarker.oPosInfo = oPosInfo;
        oMarker.bindLabel(oPosInfo.SiteName, { offset: [20, -32], noHide: false, direction: "auto" });
        oMarker.bindPopup(cHtml);
        oMarker.cId = oPosInfo.BOSSID;
        oMarker.cStatus = "";
        oMarker.addTo(this._oSiteGroup);

        if (nIndex == 0) {
            this._oMap.panTo(oLatLng);
        }
        var oPopup = oMarker.getPopup();
        oPopup.oGpsInfo = oPosInfo;
        this.initPopup(oPopup);
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

    //工地数据
    _getIconHtml: function (oPosInfo) {
        var cHtml = ' <div class="ex-monitor-mapicon-site green "><div class="site-body"></div>{cStatus}</div>';
        var cStatus = "";
        if (oPosInfo.aoStatus) {
            // 重新赋值
            for (var i = 0; i < oPosInfo.aoStatus.length; i++) {
                cStatus += this.getStatusForMarker(oPosInfo.aoStatus[i]);
            }
        }

        cHtml = ES.Util.template(cHtml, { cStatus: cStatus });
        return cHtml;
    },


    //画多边形
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
            oPolygon.bindPopup(cHtml);
            oLatLng = oInfo.aoLatLag[0];
        }
        else {
            oPolygon = L.polygon(oInfo.aoLatLag, this.getStatusForPolygen(oPosInfo.aoStatus)).addTo(this._oPolygonSiteGroup);
            var oBound = new L.LatLngBounds(oInfo.aoLatLag);
            oLatLng = oBound.getCenter();
            oPolygon.bindPopup(cHtml);
            oPolygon.cId = oPosInfo.SID;
        }

        this.drawSmallFence(oPosInfo);

        var oMarker = L.marker(oLatLng, { icon: oIcon, bIsNotEdit: true });
        oMarker.bindLabel(oPosInfo.SiteName, { noHide: true, direction: "auto" });
        oMarker.addTo(this._oPolygonSiteGroup);
        oPolygon.oMarker = oMarker;

        var oPopup = oPolygon._popup;
        oPopup.oGpsInfo = oPosInfo;
        this.initPopup(oPopup);

        //oPosInfo.Name = oPosInfo.SiteName;
        //oPolygon.oParent = this;
        //oPolygon.oData = oPosInfo;
        //oPolygon.on('click', this.showSiteInfo);
        if (nIndex == 0) {
            //this._oParent.fire("MapSite:showSiteInfo", oPosInfo);
            this._oMap.panTo(oLatLng);
        }
        return oPolygon;
    },

    _getPopHtml: function (oGpsInfo) {
        var cHtml = "<div style='width:300px'><strong>工地名称：</strong>"
            + oGpsInfo.SiteName + " <div><div cId='divContent'></div>"
        return cHtml;
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

    // 设置车辆趟数 列表
    setVehInfo: function (oData) {
        var self = this;
        ES.getData({ sBossId: oData.BOSSID }, "/Site/GetSiteTrip", this.setVehInfoHandler, this, oData);
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
                '<td class="siteview-vehinfo-table-tb-veh" style="text-align:center">' + aoVeh[i].nCnt + '	</td>' +
                '<td class="siteview-vehinfo-table-tb-date" >' + aoVeh[i].BeginTime + '	</td>' +
                '<td  class="siteview-vehinfo-table-tb-url">' +
                '<button class="btn btn-xs btn-success" onclick= window.open("' + cUrl + '")><i class="fa fa-map-marker"></i>轨 迹</button> ' +
                '</td>' +
                '</tr>';
        }

        return cHtml
    },

    // 计算高度
    calHeigh: function (aoVehNo) {
        if (aoVehNo.length >= 3) return 100;

        return (aoVehNo.length + 1) * 25;
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
            var cSiteHtml = " <div><ul class='siteview-siteinfo1'>" +
                "<li><strong>开始出土时间：</strong> " + ((!oHtml.dWorkSiteTime) ? "" : es.comFunc.dateFormat(oHtml.dWorkSiteTime, "yyyy-MM-dd hh:mm:ss")) + "  </li>" +
                " <li><strong>最新出土时间：</strong> " + ((!oHtml.dUnloadSiteTime) ? "" : es.comFunc.dateFormat(oHtml.dUnloadSiteTime, "yyyy-MM-dd hh:mm:ss")) + " </li>" +
                " <li><strong>所属区域：</strong>" + oTemp.QIDstr + "</li>" +
                " <li><strong>工地位置：</strong>" + (oTemp.SiteAddress||"") + "</li>" +
                " <li><strong>出土次数：</strong>" + ((!oHtml.nCnt) ? 0 : oHtml.nCnt) + "</li>" +
                " <li><strong>出土车辆数：</strong>" + (aoVehNo.length ? aoVehNo.length : 0) + "</li>";
            cSiteHtml += "</ul></div>"

            var cVehInfo = '<div style="height: ' + this.calHeigh(aoVehNo) + 'px; overflow-y: auto">  <table class="siteview-vehinfo-table" style="width:100%">'
            cVehInfo += '<thead class="siteview-vehinfo-table-th"><tr>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-vehno" >车牌号</th>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-vehno" style="text-align:center">出土次数</th>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-date" style="text-align:center">出土时间</th>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-opr" style="text-align:center">   操作  </th></tr> </thead>'
            cVehInfo += '<tbody class="siteview-vehinfo-table-tb">'

            cVehInfo += (cHtml || "") + " </tbody> </table></div>"


            var cAllHtml = cSiteHtml + cVehInfo;
        }
        $("div[cId='divContent']").html(cAllHtml);


    },

})