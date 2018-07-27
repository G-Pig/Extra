/**
 * Created by YangHang on 2017/12/12.
 */



ES.MapBase.Site = ES.MapBase.extend({

    //执行画点，画线操作
    oOption: {
    },

    initialize: function (oParent, oOption) {
        ES.MapBase.prototype.initialize.call(this, oParent, oOption);

        // 执行自己的方法
        this._initGroup();
        this._loadOn();
    },

    // 初始化Group
    _initGroup: function () {

        //把所有的圆点区域绘制在分组图层中
        this._oSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oSiteGroup);

        this._oPolygonSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oPolygonSiteGroup);

        this.aoSiteInfo = null;
    },

    //初始化时加载数据
    _loadOn: function () {

        //给界面赋值
        this._oParent.on("MV:Site.setSiteData", this.setSiteData, this);
        this._oParent.on("MV:Site.setStatusData", this.setStatusData, this)

        //监听地图放大缩小时间
        this._oMap.on("zoomend", this.drawSites, this);

        this._oParent.on("MV:Site.clearSites", this.clearSites, this);
    },

    //保存节点状态数据
    setStatusData: function (oData) {
        this.aoStatusData = oData.aoStatusData;
    },

    //设置数据时才进行操作
    setSiteData: function (oData) {

        this.addSiteData(oData)
        this.drawSites(1);
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawSites: function (nKey) {
        if (nKey === 1) {
            nKey = 0;
        }
        else {
            nKey = 10;
        }
        var aoSiteInfo = this.aoSiteInfo;
        if (!aoSiteInfo) return;

        //获得当前图层层级，如果是1-5层
        var nZoom = this._oMap.getZoom();
        var k = -1;
        for (var i = 0; i < aoSiteInfo.length; i++) {
            if (!aoSiteInfo[i].MapCoor) continue;
            if (nZoom <= 8) {
                this._oSiteGroup.clearLayers();
                this._oPolygonSiteGroup.clearLayers();
            }
            else if (nZoom > 8 && nZoom <= 14) {
                this._oPolygonSiteGroup.clearLayers();
                if (aoSiteInfo.length == 1) {
                    k = 0 || nKey;
                }
                this._drawSiteMarker(aoSiteInfo[i], k);
            }
            else {
                this._oSiteGroup.clearLayers();
                if (aoSiteInfo.length == 1) {
                    k = 0 || nKey;
                }
                this._drawPolygonSite(aoSiteInfo[i], k);
            }
        }
    },

    //画单个点
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
        if (nIndex == 0)
            this._oMap.panTo(oLatLng);
        oMarker.bindLabel(oPosInfo.SiteName, { offset: [20, -32], noHide: false, direction: "auto" });
        oMarker.bindPopup(cHtml);
        oMarker.addTo(this._oSiteGroup);

        // 给点对象添加tip
        //this.addPopup(oPosInfo, oMarker);

        return oMarker;
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
            var oSiteConfig = es.mapConfig.oSiteConfig;
            if (oPosInfo.bIsThen) {
                oSiteConfig.color = '#0096ff';
                oSiteConfig.fillColor = "#0FFF05";
            }
            oPolygon = L.polygon(oInfo.aoLatLag, oSiteConfig).addTo(this._oPolygonSiteGroup);
            var oBound = new L.LatLngBounds(oInfo.aoLatLag);
            oLatLng = oBound.getCenter();
            oPolygon.bindPopup(cHtml);
            oPolygon.cId = oPosInfo.SID;
        }

        this.drawSmallFence(oPosInfo);

        if (nIndex == 0) {
            this._oMap.panTo(oLatLng);
        }


        var oMarker = L.marker(oLatLng, { icon: oIcon, bIsNotEdit: true });
        oMarker.bindLabel(oPosInfo.SiteName, { noHide: true, direction: "auto" });
        oMarker.addTo(this._oPolygonSiteGroup);
        oPolygon.oMarker = oMarker;
        return oPolygon;
    },


    //绑定数据到列表中

    //工地数据
    _getIconHtml: function (oPosInfo) {

        var cHtml = '<i class="map-poi map-site-poi-gray"><b></b></i>';
        if (!this.aoStatusData) return cHtml;

        //如果是开工状态为now
        $.each(this.aoStatusData, function (nIndex, oItem) {
            if (oItem.SiteId == oPosInfo.SID) {
                cHtml = '<i class="map-poi map-site-poi-now"><b></b></i>';

            }
        })

        return cHtml;
    },

    _getIcon: function (cHtml) {

        var oIcon = L.divIcon({
            iconSize: [20, 20], iconAnchor: [10, 20],
            popupAnchor: [5, -20],
            className: "poi-site poi-n",
            html: cHtml,
        });
        return oIcon;
    },

    _getPopHtml: function (oPosInfo) {
        var cHtml = '<h4><b>工地:' + oPosInfo.SiteName + '</b></h4>'
            + '<b>区域：' + (oPosInfo.QIDstr||"") + '</b><br />'
            + '<b>核准时间：' + (oPosInfo.ApprovedTimeStr||"") + ' </b><br />'
            + '<b>出土时间起：' + (oPosInfo.UnearthedStartStr||"") + '</b><br />'
            + '<b>出土时间止：' + (oPosInfo.UnearthedEndStr||"") + '</b><br />'
            + '<b>计划出土量：' + (oPosInfo.UnearthedAmount || 0) + ' 立方 </b><br />'
            + '<b>位置：' + ((!oPosInfo.SiteAddress) ? "" : oPosInfo.SiteAddress) + '</b><br />';


        return cHtml;
    },

    //清空界面所有的工地数据
    clearSites: function (oData) {

        this.clearPolygonSite(oData);
        this.clearMarkerSite(oData);
        this.deleteSite(oData);
    },

    //删除对象
    deleteSite: function (oData) {
        if (!this.aoSiteInfo || !oData || !oData.anId || oData.anId.length <= 0) return;
        var aoSiteInfo = this.aoSiteInfo
        var anId = oData.anId;
        for (var i = aoSiteInfo.length - 1; i >= 0; i--) {

            var aoTemp = $.grep(anId, function (k, oItem) {
                if (aoSiteInfo[i].SID === k) {
                    return true;
                }
            })
            if (!aoTemp || aoTemp.length <= 0) continue;

            aoSiteInfo.splice(i, 1);
        }
    },

    addSiteData: function (oData) {
        //测试结果
        if (!this.aoSiteInfo) {
            this.aoSiteInfo = oData.aoSiteInfo;
            return;
        }

        $.merge(this.aoSiteInfo, oData.aoSiteInfo);

    },

    showHideSite: function (oData) {

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

    //画工地
    drawSite: function (oData) {
        if (!oData) return;
        this.drawOneSite(oData);
    },

    //点击点的时候出发详情显示事件
    showSiteInfo: function (oParam) {

        this.oParent._oParent.fire("MapSite:showSiteInfo", this.oData);

    },

    clearPolygonSite: function (oData) {
        var anId = oData.anId;
        var self = this;
        for (var i = 0; i < anId.length; i++) {
            var aoLayer = this.findLayers(this._oPolygonSiteGroup, anId[i]);
            if (!aoLayer || aoLayer.length <= 0) continue;
            $.each(aoLayer, function (nIndex, oLayer) {
                if (oLayer.oMarker) {
                    self._oPolygonSiteGroup.removeLayer(oLayer.oMarker);
                }
                self._oPolygonSiteGroup.removeLayer(oLayer);
            })
        };


    },

    clearMarkerSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oSiteGroup.removeLayer(oLayer);
        };


    },

    //删除所有的数据
    clearAllPolygonSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolygonSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolygonSiteGroup.removeLayer(oLayer);
        }
    },

})

// 添加小围栏数据
ES.MapBase.include({

    drawSmallFence: function (oPosInfo) {
        if (!oPosInfo.SmallFence || oPosInfo.SmallFence.length <= 0) return;
        // 画小围栏数据
        for (var i = 0; i < oPosInfo.SmallFence.length ; i++) {
            var aoLatLng = oPosInfo.SmallFence[i].Points.map(function (oItem, i) {
                return [oItem.Lat, oItem.Lon];
            })
            var oPolygon = L.polygon(aoLatLng, es.mapConfig.oSiteDoorConfig).addTo(this._oPolygonSiteGroup);
            //oPolygon.cId = oPosInfo.SID;
            var cHtml = this._getSmallFencePopHtml(oPosInfo.SmallFence[i]);
            oPolygon.bindPopup(cHtml);
            oPolygon.cId = oPosInfo.SID;
            var oPopup = oPolygon._popup;
            oPopup.oSmallFence = oPosInfo.SmallFence[i];
            this.initSmallFencePopup(oPopup);
        }
    },

    _getSmallFencePopHtml: function (oPosInfo) {
        var cHtml = "<div style='width:300px'><strong>小围栏名称：</strong>" + oPosInfo.Name + " <div>" +
            " <div><ul class='siteview-siteinfo' style='padding-left: 0px;'>" +
            " <li><strong>小围栏：</strong>" + (oPosInfo.Poi || "") + "</li>" +
            " <li cId='liBandSmallFenceVehCnt'><strong>绑定车辆数：</strong><span> 0</span> <a cid='" + oPosInfo.Id + "' class='btn btn-sm btn-success'  style='float: right;  background-color: green; border-radius: 4px; padding-left: 4px; padding-right: 4px; color: white; cursor: pointer;'>清除车辆</a></li>" +

            "</ul></div>"+
            "<div cId='divContent'></div>"

        return cHtml;
    },

    initSmallFencePopup: function (oPopup) {

        var self = this;

        if (!oPopup) return;

        oPopup.on("contentupdate", function () {

            var oGpsInfo = this.oSmallFence;
            self.setSmallFenceVehInfo(oGpsInfo);

            $("li[cid='liBandSmallFenceVehCnt']").find("a").bind("click", function () {

                ES.getData({ aoSmall: [oGpsInfo.Id] }, "/Site/DelVehInfoBySmallFenceIds",
                    self.DelSmallFenceVehInfoHandler, self);

            })
        })
    },

    DelSmallFenceVehInfoHandler: function (oData) {
        if (oData.IsSuccess) {
            $.MsgBox.success("清除小围栏成功！");
            $("div[cId='divContent']").html("");
        } else {
            $.MsgBox.error("错误", data.Msg);
        }

    },

    // 设置车辆趟数 列表
    setSmallFenceVehInfo: function (oData) {
        var self = this;//GetSiteTrip
        ES.getData({ Id: oData.Id }, "/Site/GetSmallFenceVehInfo", this.setSmallFenceVehInfoHandler, this, oData);
    },

    setSmallFenceVehInfoHandler: function (oTemp) {

        var aoVehNo = oTemp.oData;

        $("li[cid='liBandSmallFenceVehCnt']").find("span").html(aoVehNo.length);

        var cHtml = this.getSmallFenceTrHtml(aoVehNo);

        {
            var cVehInfo = '<div style="height: ' + this.calSmallFenceHeigh(aoVehNo) + 'px; overflow-y: auto">  <table class="siteview-vehinfo-table" style="width:100%">'
            cVehInfo += '<thead class="siteview-vehinfo-table-th"><tr>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-vehno" style="padding: 0 10px;text-align: center;">车牌号</th></thead>'
            cVehInfo += '<tbody class="siteview-vehinfo-table-tb">'

            cVehInfo += (cHtml || "") + " </tbody> </table></div>"
        }
        $("div[cId='divContent']").html(cVehInfo);
    },

    // 设置工地表格
    setSmallFenceSiteTable: function (oData, aoVehNo) {

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
    getSmallFenceTrHtml: function (aoVeh) {
        var cHtml = "";
        if (!aoVeh || aoVeh.length <= 0) return cHtml;

        for (var i = 0; i < aoVeh.length; i++) {
            cHtml += '<tr >' +
                '<td class="siteview-vehinfo-table-tb-veh" >' + aoVeh[i].VehicleNo + '	</td>' +
                '</tr>';
        }
        return cHtml
    },

    calSmallFenceHeigh: function (aoVehNo) {
        if (aoVehNo.length >= 3) return 100;

        return (aoVehNo.length + 1) * 25;
    },
    addSmallFencePopup: function (oGpsInfo, oLayer) {
        if (!oGpsInfo || !oLayer) return;
        this._oLayerPop = oLayer;
        this.setVehInfo(oGpsInfo);
    }
})