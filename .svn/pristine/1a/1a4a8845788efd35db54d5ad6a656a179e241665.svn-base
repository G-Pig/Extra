/**
 * Created by YangHang on 2017/12/20.
 *
 * 工地图层操作
 *  可疑工地
 *
 */



ES.MapView.SuspicSiteLayer = L.MapLib.MapMaster.MapOpr.extend({

    //执行画点，画线操作
    oOption: {
        onEvenSetData: 'MV:SuspicSite.setSiteData',
        onEvenSetStatusData: 'MV:SuspicSite.setStatusData',
        onEvenClearSites: 'MV:SuspicSite.clearSites',

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
        this._oSuspicSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oSuspicSiteGroup);

        this._oPolygonSuspicSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oPolygonSuspicSiteGroup);

        this.aoSuspicSiteInfo = null;
    },

    //初始化时加载数据
    _loadOn: function () {

        //this._oParent.fire('MV:Site.setSiteData', { aoSuspicSiteInfo: oData });
        //给界面赋值，并画工地
        this._oParent.on(this.oOption.onEvenSetData, this.setSiteData, this);

        // 通过id获得工地数据
        this._oParent.on("SuspicSiteTree:layer", this.getSiteId, this);

        this._oParent.on("unSuspicSiteTree:layer", this.getUncheckSiteId, this);

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
            if (oData.acUncheckId[i].indexOf('s') !== 0) {
                continue;
            }
            anId.push(parseInt( oData.acUncheckId[i].replace('s', '')));
        }
        this.clearSites({anId:anId});
    },

    // 在地图上绘制可疑工地
    getSiteId: function (oData) {
        var acSuspicSiteData = oData.acData;
        for(var i = 0;i<acSuspicSiteData.length;i++){
            acSuspicSiteData[i].Points =[];
            acSuspicSiteData[i].Points.push({lat:acSuspicSiteData[i].lefttop[1],lng:acSuspicSiteData[i].lefttop[0]},
                {lat:acSuspicSiteData[i].rightbottom[1],lng:acSuspicSiteData[i].lefttop[0]},
                {lat:acSuspicSiteData[i].rightbottom[1],lng:acSuspicSiteData[i].rightbottom[0]},
                {lat:acSuspicSiteData[i].lefttop[1],lng:acSuspicSiteData[i].rightbottom[0]}
            );
            acSuspicSiteData[i].Name = acSuspicSiteData[i].name;
            acSuspicSiteData[i].Id = acSuspicSiteData[i].id;
        }
        this.setSiteData({aoSuspicSiteInfo: acSuspicSiteData});
    },

    clearAll: function () {
        if (this.aoSuspicSiteInfo && this.aoSuspicSiteInfo.length > 0) {

            this.aoSuspicSiteInfo.splice(0, this.aoSuspicSiteInfo.length);
        }

        // 清空数据
        this._oSuspicSiteGroup.clearLayers();
        this._oPolygonSuspicSiteGroup.clearLayers();
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

        var aoSuspicSiteInfo = this.aoSuspicSiteInfo;
        if (!aoSuspicSiteInfo) {
            return;
        }

        //获得当前图层层级，如果是1-5层
        var nZoom = this._oMap.getZoom();

        for (var i = 0; i < aoSuspicSiteInfo.length; i++) {
            if (!aoSuspicSiteInfo[i].Points || aoSuspicSiteInfo[i].Points.length <= 0) {
                continue;
            }
            if (nZoom <= 4) {
                this._oSuspicSiteGroup.clearLayers();
                this._oPolygonSuspicSiteGroup.clearLayers();
            }
            else if (nZoom > 4 && nZoom <= 12) {
                this._oPolygonSuspicSiteGroup.clearLayers();
                this._drawSiteMarker(aoSuspicSiteInfo[i]);
            }
            else {
                this._oSuspicSiteGroup.clearLayers();
                this._drawPolygonSite(aoSuspicSiteInfo[i]);
            }
        }



        if (oData.aoSuspicSiteInfo && oData.aoSuspicSiteInfo.length === 1) {
            var oLayer = this.findLayer(this._oPolygonSuspicSiteGroup,oData.aoSuspicSiteInfo[0].Id);
            if(oLayer){

                this._oMap.fitBounds(oLayer.getLatLngs());
            }

            oLayer = this.findLayer(this._oSuspicSiteGroup,oData.aoSuspicSiteInfo[0].Id);
            if(oLayer){
                var oLatLng = oLayer.getLatLng();
                this.flyTo({oGpsInfo: {Lat: oLatLng.lat, Lon: oLatLng.lng}}, {zoom: 16});

            }
        }
    },

    // 画单个点
    _drawSiteMarker: function (oPosInfo) {

        if (!this._oSuspicSiteGroup || !oPosInfo){
            return;
        }
        var oLayer = this.findLayer(this._oSuspicSiteGroup, oPosInfo.Id);
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

        oMarker.addTo(this._oSuspicSiteGroup);

        this.initEventForMarkerV2(oMarker);

        return oMarker;
    },

    //注册点击事件在弹出层
    initEventForMarkerV2:function (oMarker) {
        if (!oMarker) {
            return;
        }
        var self =this;
        oMarker.on('click', function () {
            this.bindPopup('<h2>数据加载中...</h2>',{maxWidth:600}).openPopup();
            ES.getData({SiteId: this.oPosInfo.Id,SiteType:3} , '/Reports/MapSiteWorkDetail', function (cHtml) {
                var oPopup = this.getPopup();
                // 在次注册事件
                oPopup.oPosInfo = this.oPosInfo;
                oPopup.setContent(cHtml);
                self.initPopupEventV2(this);
                this.openPopup();
            }, this, null, {dataType: 'html'});
        },oMarker);

    },

    // 给弹出层加载数据
    initPopupEventV2:function (oLayer) {
        var self = this;
        var oPopup = oLayer.getPopup();

        oPopup.once("contentupdate", function () {

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

            var mX = $("#h_MapX").val();
            var mY = $("#h_MapY").val();
            var cName = $("#h_ShortName").val();
            var siteId = $("#h_siteId").val();
            var siteType = $("#h_siteType").val();
            var day = $("#h_day").val();


            $("#gridWorkDetial1").jqGridExt({
                url: "/Reports/getSiteWorkDetailPaging",
                data: {SiteId: siteId, SiteType: siteType, Day: day, RetType: 1},
                width: 600,
                height: 320,
                pager: "#gridWorkDetialToolbar1",
                colModel: [
                    {label: '车牌号', name: 'VehicleNo', align: "center", sortable: false},
                    {label: '所属企业', name: 'DeptName', align: "center", sortable: false},
                    {label: '出土时间', name: 'FirstTime', align: "center", sortable: false},
                    {
                        label: '查看轨迹', name: 'FirstTime', align: "center", sortable: false, width: 130, fixed: true,
                        formatter: function (val, opt, item) {
                            var html = [];
                            var p = {
                                PhoneNum: item.PhoneNum,
                                VehicleNo: item.VehicleNo,
                                StartTime: new Date(item.FirstTime).getTime() / 1000,
                                EndTime: new Date(item.LastTime).getTime() / 1000+600
                            };
                            if (siteType == 1) { //核准工地
                                p.SiteId = item.SiteId;
                            }
                            else if (siteType == 3) { //可疑工地
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

            $("#gridWorkDetial2").jqGridExt({
                url: "/Reports/getSiteWorkDetailPaging",
                data: {SiteId: siteId, SiteType: siteType, Day: day, RetType: 2},
                width: 600,
                height: 320,
                pager: "#gridWorkDetialToolbar2",
                colModel: [
                    {label: '车牌号', name: 'VehicleNo', align: "center", sortable: false},
                    {label: '所属企业', name: 'DeptName', align: "center", sortable: false},
                    {label: '运输次数', name: 'TripCount', align: "center", sortable: false},
                    {label: '最早出土时间', name: 'FirstTime', align: "center", sortable: false},
                    {label: '最近出土时间', name: 'LastTime', align: "center", sortable: false}
                ]
            })

            $("#gridWorkDetial3").jqGridExt({
                url: "/Reports/getSiteWorkDetailPaging",
                data: {SiteId: siteId, SiteType: siteType, Day: day, RetType: 3},
                width: 600,
                height: 320,
                pager: "#gridWorkDetialToolbar3",
                colModel: [
                    {label: '企业名称', name: 'DeptName', align: "center", sortable: false},
                    {label: '运输次数', name: 'TripCount', align: "center", sortable: false},
                    {label: '运输车辆数', name: 'VehicleCount', align: "center", sortable: false},
                    {label: '最早出土时间', name: 'FirstTime', align: "center", sortable: false},
                    {label: '最近出土时间', name: 'LastTime', align: "center", sortable: false}
                ]
            });

            $(".ex-layout-pop-tab-content").find("button.ex-grid-search").click(function () {
                var vehno = $("input[name='sVehicleNo']:visible").val();
                var gridId = $(".ex-layout-pop-tab-content .dt-grid-container:visible").attr("id");
                $("#" + gridId).data("jqGridExt").reload({VehicleNo: vehno});
            });

            L.MapLib.MapControl.SiteMap = L.MapLib.MapControl.ESMapEdit.extend({
                //1 画多边形 2 画线路
                editDraw: function (oData, type) {
                    this.cFlag = 'edit';
                    if (type == 2) {
                        if (oData.MapX == null) {
                            return;
                        }
                        var aX = oData.MapX.substr(0, oData.MapX.length - 1).split(',');
                        var aY = oData.MapY.substr(0, oData.MapX.length - 1).split(',');
                    } else {
                        var aX = oData.MapX.split(',');
                        var aY = oData.MapY.split(',');
                    }

                    if (!aX || !aY || aX.length <= 0 || aX[0] == "") {
                        return;
                    }
                    var aoLatLng = [];
                    for (var i = 0; i < aX.length; i++) {
                        var oLatLng = L.latLng(parseFloat(aY[i]), parseFloat(aX[i]));
                        aoLatLng.push(oLatLng);
                    }

                    var color = '#0FFF05';
                    if (siteType == "3") {
                        color = "orange"
                    }

                    if (type == 1) {
                        var oVehLine = L.polygon(aoLatLng, {
                            fillOpacity: 0.1,
                            color: color,
                            fill: true,
                        }).addTo(this._oDrawLayer);
                        oVehLine.bindTooltip(oData.Name).openTooltip();
                    } else if (type == 2) {
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

                initOn: function () {
                },
            });

            var oMapMaster = new L.MapLib.MapMaster.Map("", {
                cDidId: 'DivMapPopId',
                oMapOption: {
                    zoomControl: false,
                    layers: [],
                    center: {lat: $("#h_CenterLat").val(), lng: $("#h_CenterLng").val()},
                    zoom: 15
                },
                nMapWidth: 600,
                nMapHeight: 400,
            });

            oMapMaster.loadMapMaster();
            var oToolEdit = new L.MapLib.MapControl.SiteMap(oMapMaster, {});
            //画工地
            oToolEdit.editDraw({MapX: mX, MapY: mY, Id: siteId, Name: cName}, 1);
        }, oPopup);


    },

    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        if (!oMarker) {
            return;
        }

        oMarker.on('click', function () {
            var oPop = new ES.MapView.PopSiteInfo(this, oMarker.oPosInfo);
            oPop.showModal();
        }, this);

    },

    // 画多边形
    _drawPolygonSite: function (oPosInfo) {
        if (!this._oPolygonSuspicSiteGroup || !oPosInfo) {
            return;
        }
        var oTemp = this.findLayer(this._oPolygonSuspicSiteGroup, oPosInfo.Id);
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
            oPolygon = L.circle(oPosInfo.Points[0], oBPos.distanceTo(oEPos), oInfo.oOption).addTo(this._oPolygonSuspicSiteGroup);

            oLatLng = oPosInfo.Points[0];
        }
        else {
            oPolygon = L.polygon(oPosInfo.Points,  ES.MapView.oConfig.oSuspicSiteConfig).addTo(this._oPolygonSuspicSiteGroup);
            var oBound = new L.LatLngBounds(oPosInfo.Points);
            oLatLng = oBound.getCenter();
            oPolygon.cId = oPosInfo.Id;
        }
        this.drawSuspicPos(oPosInfo,oPolygon);
        oPolygon.bindTooltip(oPosInfo.Name);
        oPolygon.oPosInfo = oPosInfo;
        this.initEventForMarkerV2(oPolygon);
        return oPolygon;
    },

    // 画可疑出土点,获得车辆可以出土点，并在地图上标注出来
    drawSuspicPos:function (oPosInfo,oPolygon) {
        if (oPolygon.oData) {
            this.drawSuspicPosHandler(oPolygon);
            return;
        }

        var oParam = {
            'exparameters':{SiteId: oPosInfo.Id, SiteType: 3,   RetType: 1},
            '_search': false,
            'nd': (new Date()).getTime(),
            'rows':20,
            'page': 1,
            'sidx': '',
            'sord': 'asc'
        };
        // 分页请求数据
        ES.getData(
            JSON.stringify(oParam),
            '/Reports/getSiteWorkDetailPaging',
            this.drawSuspicPosHandler,
            this,oPolygon);

    },

    drawSuspicPosHandler:function (oPolygon) {

        if (!oPolygon.oData ||  !oPolygon.oData.dataList ||oPolygon.oData.dataList.length<=0) {
            return;
        }

        var aoMarker =[]
        for(var i =0;i< oPolygon.oData.dataList.length;i++){
            var oItem = oPolygon.oData.dataList[i];
            //画一个默认点
            var oM = L.marker([oItem.LngLat[1],oItem.LngLat[0]]);
            var cHtml='<h2>出土点</h2><p>运输车辆：{VehicleNo}</p>' +
               '<p>开始时间：{FirstTime}</p>' +
               '<p>结束时间：{LastTime}</p>'

            oM.bindPopup(ES.template(cHtml,oItem));
            this._oPolygonSuspicSiteGroup.addLayer(oM);
            aoMarker.push(oM);
        }

        oPolygon.aoMarker = aoMarker;
    },

    // 工地数据
    _getIconHtml: function (oPosInfo) {
        oPosInfo.cCls = 'ex-monitor-mapicon-site green '
        oPosInfo.cBCls = 'site-body'
        oPosInfo.cTCls = 'site-title';
        // 核准工地
        if(oPosInfo.SiteType ===1){

            oPosInfo.cCls = 'ex-monitor-mapicon-site green';
            if(oPosInfo.ApprovalType ===1)
            {
                oPosInfo.cCls = 'ex-monitor-mapicon-site green-unearthed';
            }

            oPosInfo.cBCls = 'site-body'

            oPosInfo.cTCls = 'site-title green';
        }
        else if(oPosInfo.SiteType ===2){
            // 临时工地
            oPosInfo.cCls = 'ex-monitor-mapicon-site  yellow ';
            oPosInfo.cBCls = 'site-body'
            oPosInfo.cTCls = 'site-title green';
        }
        else if(oPosInfo.SiteType ===3){
            // 违规工地
            oPosInfo.cCls = 'ex-monitor-mapicon-site  red';
            oPosInfo.cBCls = 'site-body'
            oPosInfo.cTCls = 'site-title green';
        }
        //  核准工地 没有开工
        else if(oPosInfo.SiteType ===4){
            // 核准未开工工地
            oPosInfo.cCls = 'ex-monitor-mapicon-site  gray';
            oPosInfo.cBCls = 'site-body'
            oPosInfo.cTCls = 'site-title green';
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
        if (!this.aoSuspicSiteInfo || !oData || !oData.anId || oData.anId.length <= 0) return;
        var aoSuspicSiteInfo = this.aoSuspicSiteInfo
        var anId = oData.anId;
        for (var i = aoSuspicSiteInfo.length - 1; i >= 0; i--) {

            var aoTemp = $.grep(anId, function (k, nIndex) {
                if (aoSuspicSiteInfo[i].Id === parseInt(k)) {
                    return true;
                }
            })
            if (!aoTemp || aoTemp.length <= 0) continue;

            aoSuspicSiteInfo.splice(i, 1);
        }
    },

    addSiteData: function (oData) {
        //测试结果
        if (!this.aoSuspicSiteInfo) {
            this.aoSuspicSiteInfo = oData.aoSuspicSiteInfo;
            return;
        }

        $.merge(this.aoSuspicSiteInfo, oData.aoSuspicSiteInfo);

    },

    clearPolygonSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oPolygonSuspicSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolygonSuspicSiteGroup.removeLayer(oLayer.oMarker);
            }
            if(oLayer.aoMarker){
                for(var i =0;i< oLayer.aoMarker.length;i++){
                    this._oPolygonSuspicSiteGroup.removeLayer(oLayer.aoMarker[i]);
                }
                oLayer.aoMarker = null;
            }
            this._oPolygonSuspicSiteGroup.removeLayer(oLayer);
        };


    },

    clearMarkerSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oSuspicSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oSuspicSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oSuspicSiteGroup.removeLayer(oLayer);
        };


    },

    // 删除所有的数据
    clearAllPolygonSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oPolygonSuspicSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolygonSuspicSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolygonSuspicSiteGroup.removeLayer(oLayer);
        }
    },

});


ES.MapView.SuspicSiteLayer.include({
    cHtml:
    '<div class="ex-monitor-mapicon-site hacked">' +
    '   <div class="pin-tip" style="display: none;">' +
    '       <div class="pin-dome"><b></b><c></c><d></d></div>' +
    '       <div class="pin-number">{Name}</div>' +
    '   </div>' +
    '   <div class="site-body">' +
    '   </div>' +
    '</div>'
});