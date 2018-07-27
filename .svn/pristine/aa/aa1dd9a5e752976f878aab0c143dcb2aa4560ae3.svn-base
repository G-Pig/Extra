/**
 * 资产图层的处理方式
 *
 * Created by Administrator on 2017/5/7 0007.
 */



ES.MapView.AssetPosLayer = L.MapLib.MapMaster.MapOpr.extend({


    //执行画点，画线操作
    oOption: {
        onEvenSetData: 'MV:Site.setAssetData',
        onEvenSetStatusData: 'MV:Site.setStatusData',
        onEvenClearSites: 'MV:Site.clearAsset',
        oSiteConfig: ES.MapView.oConfig.oSiteConfig,
        cHtml:
        '<div class="ex-monitor-mapicon-pin  {icon} ">' +
        '   <i></i>' +
        '   <div class="pin-tip">' +
        '       <div class="pin-dome"></div>' +
        '       <div class="pin-number">{name}</div>' +
        '   </div>' +
        '</div>'
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
        this._oAssetGroup = L.featureGroup();
        this._oMap.addLayer(this._oAssetGroup);
        this.aoInfo = null;
    },

    //初始化时加载数据
    _loadOn: function () {

        //this._oParent.fire('MV:Site.setSiteData', { aoSiteInfo: oData });
        //给界面赋值，并画工地
        this._oParent.on(this.oOption.onEvenSetData, this.setData, this);

        // 设置工地状态
        this._oParent.on(this.oOption.onEvenSetStatusData, this.setStatusData, this);

        //监听地图放大缩小时间
        //this._oMap.on("zoomend", this.drawSites, this);

        // 清除工地
        this._oParent.on(this.oOption.onEvenClearSites, this.clearSites, this);

        this._oParent.on('AssetLayer:clearAll', this.clearAll, this);
    },

    clearAll: function () {
        if (this.aoInfo && this.aoInfo.length > 0) {

            this.aoInfo.splice(0, this.aoInfo.length);
        }

        // 清空数据
        this._oAssetGroup.clearLayers();
        //this._oPolygonSiteGroup.clearLayers();
    },

    // 保存节点状态数据
    setStatusData: function (oData) {
        this.aoStatusData = oData.aoStatusData;
    },

    //设置数据时才进行操作
    setData: function (oData) {
        // 把数据保存到界面上
        //this.addData(oData)
        // 画当前工地
        this.drawSites(oData);
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawSites: function (oData) {

        if (!oData) {
            return;
        }
        for (var i = 0; i < oData.lst.length; i++) {
            oData.lst[i].icon = oData.icon.replace('icon-tree','');
            oData.lst[i].MapPopUrl = oData.MapPopUrl;
            this._drawMarker(oData.lst[i]);
        }

        if (oData.lst && oData.lst.length === 1) {
            oLayer = this.findLayer(this._oAssetGroup, oData.lst[0].Id);
            if (oLayer) {
                var oLatLng = oLayer.getLatLng();
                this.flyTo({oGpsInfo: {Lat: oLatLng.lat, Lon: oLatLng.lng}}, {zoom: 16});
            }
        }
    },

    // 画单个点
    _drawMarker: function (oPosInfo) {

        if (!this._oAssetGroup || !oPosInfo) return;

        var oLayer = this.findLayer(this._oAssetGroup, oPosInfo.Id);
        if (oLayer) {
            return oLayer;
        }

        var oIcon = this._getIcon( ES.Util.template(this.oOption.cHtml, oPosInfo));

        var oMarker = L.marker(oPosInfo.lstLatLng[0], { icon: oIcon });

        oMarker.cId = oPosInfo.Id;
        oMarker.oPosInfo = oPosInfo;

        oMarker.addTo(this._oAssetGroup);

        this.initEventForMarker(oMarker);

        return oMarker;
    },

    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        var self = this;
        if (!oMarker) {
            return;
        }

        oMarker.on('click', function () {

            ES.Util.reqData({
                    url: this.oPosInfo.MapPopUrl,
                    data: {id: this.oPosInfo.Id},
                    dataType: 'html',

                },
                function (oData) {
                    this.bindPopup(oData.rtnData,{maxWidth:400});
                    var oPopup = this.getPopup();
                    oPopup.id = this.cId;
                    oPopup.on('contentupdate', function () {
                        $('li[band-id=' + this.id + ']').unbind('click');
                        $('li[band-id=' + this.id + ']').bind('click', function () {
                            var aa = 0;
                            // 创建弹出层
                            var oD = new ES.MapView.PopAssetInfo(self, {
                                cId: $(this).attr('band-id'),
                                cUrl: $(this).attr('band-url'),
                                cTypeName: $(this).attr('band-type')
                            });

                            oD.showModal();

                        });
                    });

                    this.openPopup();
                },
                this);

        }, oMarker);

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
            oPolygon = L.polygon(oPosInfo.Points, this.oOption.oSiteConfig).addTo(this._oPolygonSiteGroup);
            var oBound = new L.LatLngBounds(oPosInfo.Points);
            oLatLng = oBound.getCenter();

            oPolygon.cId = oPosInfo.Id;
        }

        oPolygon.bindTooltip(oPosInfo.Name).openTooltip();
        oPolygon.oPosInfo = oPosInfo;
        this.initEventForMarker(oPolygon);
        return oPolygon;
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
            var oLayer = this.findLayer(this._oAssetGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oAssetGroup.removeLayer(oLayer.oMarker);
            }
            this._oAssetGroup.removeLayer(oLayer);
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