/**
 * Created by liulin on 2016/12/23.
 *
 * 工地图层操作
 *
 *
 */



ES.MapView.SiteLayer = L.MapLib.MapMaster.MapOpr.extend({

    //执行画点，画线操作
    oOption: {
        onEvenSetData: 'MV:Site.setSiteData',
        onEvenSetStatusData: 'MV:Site.setStatusData',
        onEvenClearSites: 'MV:Site.clearSites',
        cHtml: '<div class="{cCls}"><div class="{cBCls}"></div><div class="{cTCls}">{Name}</div></div>'
    },

    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);
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

        //给界面赋值，并画工地
        this._oParent.on(this.oOption.onEvenSetData, this.setSiteData, this);

        // 通过id获得工地数据
        this._oParent.on("siteTree:layer", this.getSiteId, this);

        this._oParent.on("unsiteTree:layer", this.getUncheckSiteId, this);

        // 设置工地状态
        this._oParent.on(this.oOption.onEvenSetStatusData, this.setStatusData, this);

        //监听地图放大缩小时间
        this._oMap.on("zoomend", this.drawSites, this);

        // 清除工地
        this._oParent.on(this.oOption.onEvenClearSites, this.clearSites, this);

        this._oParent.on('SiteLayer:clearAll', this.clearAll, this);
    },

    getUncheckSiteId: function (oData) {
        var anId = [];
        for (var i = 0; i < oData.acUncheckId.length; i++) {
            if (oData.acUncheckId[i].indexOf('-') !== 0) {
                continue;
            }
            anId.push(parseInt( oData.acUncheckId[i].replace('-', '')));
        }
        this.clearSites({anId:anId});
    },

    getSiteId: function (oData) {

        var aoSiteInfo = oData.acData;
        for(var i = 0;i<aoSiteInfo.length;i++){
            aoSiteInfo[i].Points =[];
            var lats = aoSiteInfo[i].MapY.split(",");
            var lngs = aoSiteInfo[i].MapX.split(",");
            for(var j=0;j<lats.length;j++){
                aoSiteInfo[i].Points.push({lat:lats[j],lng:lngs[j]});
            }
        }
        this.setSiteData({aoSiteInfo: aoSiteInfo});
    },

    clearAll: function () {
        if (this.aoSiteInfo && this.aoSiteInfo.length > 0) {
            this.aoSiteInfo.splice(0, this.aoSiteInfo.length);
        }

        // 清空数据
        this._oSiteGroup.clearLayers();
        this._oPolygonSiteGroup.clearLayers();
    },

    // 保存节点状态数据
    setStatusData: function (oData) {
        this.aoStatusData = oData.aoStatusData;
    },

    //设置数据时才进行操作
    setSiteData: function (oData) {
        // 把数据保存到界面上
        this.addSiteData(oData)
        // 画当前工地
        this.drawSites(oData);
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawSites: function (oData) {

        var aoSiteInfo = this.aoSiteInfo;
        if (!aoSiteInfo) {
            return;
        }

        //获得当前图层层级，如果是1-5层
        var nZoom = this._oMap.getZoom();

        for (var i = 0; i < aoSiteInfo.length; i++) {
            if (!aoSiteInfo[i].Points || aoSiteInfo[i].Points.length <= 0) {
                continue;
            }
            if (nZoom <= 4) {
                this._oSiteGroup.clearLayers();
                this._oPolygonSiteGroup.clearLayers();
            }
            else if (nZoom > 4 && nZoom <= 12) {
                this._oPolygonSiteGroup.clearLayers();
                this._drawSiteMarker(aoSiteInfo[i]);
            }
            else {
                this._oSiteGroup.clearLayers();
                this._drawPolygonSite(aoSiteInfo[i]);
            }
        }

        if (oData.aoSiteInfo && oData.aoSiteInfo.length === 1) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup,oData.aoSiteInfo[0].Id);
            if(oLayer){

                this._oMap.fitBounds(oLayer.getLatLngs());
            }

            oLayer = this.findLayer(this._oSiteGroup,oData.aoSiteInfo[0].Id);
            if(oLayer){
                var oLatLng = oLayer.getLatLng();
                this.flyTo({oGpsInfo: {Lat: oLatLng.lat, Lon: oLatLng.lng}}, {zoom: 16});

            }
        }
    },

    // 画单个点
    _drawSiteMarker: function (oPosInfo) {

        if (!this._oSiteGroup || !oPosInfo) return;

        var oLayer = this.findLayer(this._oSiteGroup, oPosInfo.Id);
        if (oLayer) {
            return oLayer;
        }


        var oBound = new L.LatLngBounds(oPosInfo.Points);
        var oLatLng = oBound.getCenter()
        if (oPosInfo.FenceType == 2) {
            oLatLng = oPosInfo.Points[0];
        }

        var oIcon = this._getIcon(this._getIconHtml(oPosInfo));

        var oMarker = L.marker(oLatLng, { icon: oIcon });

        oMarker.cId = oPosInfo.Id;
        oMarker.oPosInfo = oPosInfo;

        oMarker.addTo(this._oSiteGroup);

        this.initEventForMarkerV2(oMarker);
        return oMarker;
    },

    initPopup:function(oLayer){

        //更新弹出层的信息,修改的目的是防止注册2次点击事件
        var oPopup = oLayer.getPopup();
        if(!oPopup){
            oPopup = oLayer.bindPopup('<div></div>', {maxWidth:960}).getPopup();
        }
        // 在次注册事件
        oPopup.oPosInfo = oLayer.oPosInfo;

        //oPopup.setContent('<div></div>');

        return oPopup;
    },

    initPopupEventV2:function (oLayer) {
        var self = this;
        var oPopup = oLayer.getPopup();

        oPopup.once("contentupdate", function () {
            var siteid = $("#h_siteid").val();
            $popTabTitle = $('.ex-layout-pop-tab-title');
            $popTabContent = $('.ex-layout-pop-tab-content');

            $popTabTitle.children('li').bind('click', function () {
                var _i = $(this).index();
                $popTabTitle.children('li').removeClass('ec-active').eq(_i).addClass('ec-active');
                ES.loadAn($popTabContent, null);
                setTimeout(function () {
                    $popTabContent.children('li').removeClass('ec-active in').eq(_i).addClass('ec-active in');
                    ES.removeAn($popTabContent, null);
                    oMapMaster.reflesh(600, 400);
                }, 200);
            });

            $("#gridEvent").jqGridExt({
                url: "/Event/QueryPaging",
                mtype: "POST",
                width: 600,
                height: 325,
                pager: "gridEventToolbar",
                colModel: [
                    { label: '案件编号', name: 'EventNo', align: "center", sortable: false, width: 130 },
                    { label: '发生时间', name: 'EventTime', align: "center", sortable: false },
                    { label: '案件类型', name: 'EventTypeName', align: "center", sortable: false },
                    { label: '相关车辆', name: 'VehicleNo', align: "center", sortable: false },
                    //{ label: '案件来源', name: 'EventFromName', align: "center", sortable: false },
                    { label: '案件状态', name: 'EventStatusName', align: "center", sortable: false },
                    { label: '最后更新时间', name: 'LastTaskTime', align: "center", sortable: false }
                ],
                data: { SiteId: siteid }
            }).data("jqGridExt");

            $("#gridPermit").jqGridExt({
                url: "/RemovalPermit/ListPaging",
                mtype: "POST",
                width: 600,
                height: 325,
                pager: "gridPermitToolbar",
                colModel: [
                    { label: '编号', name: 'SerialNum', editable: true, align: 'center', width: 80 },
                    { label: '类型', name: 'TypeName', editable: true, align: 'center', width: 60 },
                    { label: '工地', name: 'SiteName', editable: true, align: 'center', width: 80 },
                    { label: '消纳点', name: 'UnloadName', editable: true, align: 'center', width: 80 },
                    { label: '线路', name: 'Route', editable: true, align: 'center', width: 120 },
                    {
                        label: '有效期', name: '', editable: true, align: 'center', width: 120,
                        formatter: function (cellValue, options, rowObject) {
                            var content = rowObject.DayStart + ' 至 ' + rowObject.DayEnd;
                            return content;
                        }
                    }
                ],
                data: { SiteId: siteid }
            }).data("jqGridExt");

            $("#gridWorkVeh").jqGridExt({
                url: "/Reports/getSiteWorkDetailPaging",
                data: { SiteId: siteid, SiteType: 1,  RetType: 1 },
                width: 600,
                height: 325,
                pager: "#gridWorkVehToolbar",
                colModel: [
                    { label: '车牌号', name: 'VehicleNo', align: "center", sortable: false },
                    { label: '所属企业', name: 'DeptName', align: "center", sortable: false },
                    { label: '出土时间', name: 'FirstTime', align: "center", sortable: false },
                    {
                        label: '查看轨迹', name: 'FirstTime', align: "center", sortable: false, width: 130, fixed: true,
                        formatter: function (val, opt, item) {
                            var html = [];
                            var p = {
                                PhoneNum: item.PhoneNum,
                                VehicleNo: item.VehicleNo,
                                StartTime: new Date(item.FirstTime).getTime() / 1000,
                                EndTime: new Date(item.LastTime).getTime() / 1000 + 600
                            };
                            p.SiteId = item.SiteId;
                            if (item.siteType == 3) { //可疑工地

                                p.LngLat = item.LngLat[0] + "," + item.LngLat[1];
                                p.LeftTop = item.LeftTop[0] + "," + item.LeftTop[1];
                                p.RightBottom = item.RightBottom[0] + "," + item.RightBottom[1];
                            }
                            var url = "/MapView/TrackView?" + $.param(p);
                            html.push("<a class=\"ec-btn ec-btn-xs ec-btn-default\" onclick=\"window.open('" + url + "')\"><i class=\"ec-icon-map-marker\"></i>  轨迹</a>");
                            return html.join(" ");
                        }
                    }
                ]
            });

            L.MapLib.MapControl.mapDraw =L.MapLib.MapControl.ESMapEdit.extend({
                //1 画多边形 2 画线路
                editDraw:function(oData,type){
                    this.cFlag = 'edit';
                    if(type == 2){
                        if(oData.MapX == null) {
                            return ;
                        }
                        var aX = oData.MapX.substr(0, oData.MapX.length - 1).split(',');
                        var aY = oData.MapY.substr(0, oData.MapX.length - 1).split(',');
                    }else{
                        var aX = oData.MapX.split(',');
                        var aY = oData.MapY.split(',');
                    }

                    if (!aX || !aY || aX.length <= 0||aX[0] == "") {
                        return;
                    }
                    var aoLatLng = [];
                    for (var i = 0; i < aX.length; i++) {
                        var oLatLng = L.latLng(parseFloat(aY[i]), parseFloat(aX[i]));
                        aoLatLng.push(oLatLng);
                    }

                    if(type == 1){
                        var oVehLine = L.polygon(aoLatLng, {
                            fillOpacity: 0.2,
                            fill: true,
                            color: '#0FFF05',
                        }).addTo(this._oDrawLayer);
                        oVehLine.bindTooltip(oData.Name).openTooltip();
                    }else if(type == 2){
                        var oVehLine = L.polyline(aoLatLng, {
                            opacity: 1,
                            color: 'blue',
                            weight: 2,
                        }).addTo(this._oDrawLayer);
                        this.fitBound();
                    }

                    oVehLine.cId = oData.Id;
                    oVehLine.oFenceInfo = oData;
                },
                initOn:function(){
                }
            });

            var oMapMaster = new L.MapLib.MapMaster.Map("", {
                cDidId: 'DivMapPopId',
                oMapOption: {
                    zoomControl: false,
                    layers: [],
                    center: { lat: $("#h_CenterLat").val(), lng: $("#h_CenterLng").val() },
                    zoom: 15
                },
                nMapWidth: 600,
                nMapHeight: 400,
            });
            oMapMaster.loadMapMaster();
            var mX =$("#h_MapX").val();
            var mY =$("#h_MapY").val();
            var Name = $("#h_ShortName").val();
            var oToolEdit = new L.MapLib.MapControl.mapDraw(oMapMaster, {});

            //画工地
            oToolEdit.editDraw({ MapX: mX, MapY: mY, Id:siteid, Name: Name},1);

        }, oPopup);


    },

    //注册点击事件在弹出层
    initEventForMarkerV2:function (oMarker) {
        if (!oMarker) {
            return;
        }
        var self =this;
        oMarker.on('click', function () {
            this.bindPopup('数据加载中...',{maxWidth:600}).openPopup();
            ES.getData({id: this.oPosInfo.Id}, '/Site/MapDetail', function (cHtml) {

                var oPopup = this.getPopup();

                // 在次注册事件
                oPopup.oPosInfo = this.oPosInfo;

                oPopup.setContent(cHtml);
                self.initPopupEventV2(this);
                this.openPopup();

            }, this, null, {dataType: 'html'});
        },oMarker);


    },




    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        if (!oMarker) {
            return;
        }

        oMarker.on('click', function () {
            // 以地图自带的形式更新
            var oPop = new ES.MapView.PopSiteInfo(this, oMarker.oPosInfo);
            oPop.showModal();
        }, this);

    },

    // 画多边形
    _drawPolygonSite: function (oPosInfo) {
        if (!this._oPolygonSiteGroup || !oPosInfo) {
            return;
        }
        var oTemp = this.findLayer(this._oPolygonSiteGroup, oPosInfo.Id);
        if (oTemp) {
            return;
        }

        var oPolygon = null;


        // 中心点
        var oLatLng = null;
        if (oPosInfo.FenceType === 2) {
            var nZoom = this.oMap.getZoom();
            var oBPos = this.oMap.options.crs.latLngToPoint(L.latLng(oPosInfo.Points[0]), nZoom);
            var oEPos = this.oMap.options.crs.latLngToPoint(L.latLng(oPosInfo.Points[1]), nZoom);
            oPolygon = L.circle(oPosInfo.Points[0], oBPos.distanceTo(oEPos), oInfo.oOption).addTo(this._oPolygonSiteGroup);

            oLatLng = oPosInfo.Points[0];
        }
        else {
            oPolygon = L.polygon(oPosInfo.Points,  ES.MapView.oConfig.oSiteConfig).addTo(this._oPolygonSiteGroup);
            var oBound = new L.LatLngBounds(oPosInfo.Points);
            oLatLng = oBound.getCenter();

            oPolygon.cId = oPosInfo.Id;
        }
        oPolygon.bindTooltip(oPosInfo.Name)
        //oPolygon.bindTooltip(oPosInfo.Name).openTooltip();
        oPolygon.oPosInfo = oPosInfo;
        //this.initEventForMarker(oPolygon);
        this.initEventForMarkerV2(oPolygon);
        return oPolygon;
    },

    // 工地数据
    _getIconHtml: function (oPosInfo) {
        oPosInfo.cCls = 'ex-monitor-mapicon-site now';
        oPosInfo.cBCls = 'site-body'
        oPosInfo.cTCls = 'site-title';


        if(oPosInfo.icon ==="SiteNow"){
            //上报正常出土工地
            oPosInfo.cCls = 'ex-monitor-mapicon-site now';
        }else if(oPosInfo.icon ==="SiteAdvance"){
            // 上报提前出土工地
            oPosInfo.cCls = 'ex-monitor-mapicon-site temp-site';
        }else if(oPosInfo.icon ==="Site"){
            // 上报未出土工地
            oPosInfo.cCls = 'ex-monitor-mapicon-site no-report';
        }else if(oPosInfo.icon ==="UnSiteNow"){
            // 未上报出土工地
            oPosInfo.cCls = 'ex-monitor-mapicon-site alert';
        }

        var cHtml = ES.Util.template(this.cHtml, oPosInfo);

        return cHtml;
    },

    // 画点
    _getIcon: function (cHtml) {

        var oIcon = L.divIcon({
            iconSize: [20, 20], iconAnchor: [10, 20],
            popupAnchor: [-1, -20],
            className: "",
            html: cHtml,
        });
        return oIcon;
    },

    // 获得弹出层的内容
    _getPopHtml: function (oPosInfo) {

        return '';
    },

    // 清空界面所有的工地数据
    clearSites: function (oData) {
        //this.oInfo = null;
        this.clearPolygonSite(oData);
        this.clearMarkerSite(oData);
        this.deleteSite(oData);
    },

    // 删除对象
    deleteSite: function (oData) {
        if (!this.aoSiteInfo || !oData || !oData.anId || oData.anId.length <= 0) return;
        var aoSiteInfo = this.aoSiteInfo
        var anId = oData.anId;
        for (var i = aoSiteInfo.length - 1; i >= 0; i--) {

            var aoTemp = $.grep(anId, function (k, nIndex) {
                if (aoSiteInfo[i].Id === parseInt(k)) {
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

    clearPolygonSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolygonSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolygonSiteGroup.removeLayer(oLayer);
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

    // 删除所有的数据
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

});


ES.MapView.SiteLayer.include({
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