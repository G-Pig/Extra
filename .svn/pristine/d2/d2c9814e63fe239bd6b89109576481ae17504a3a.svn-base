/**
 * Created by liulin on 2017/3/17.
 *
 * 只负责编辑点，需要地图控件
 */



ES.CloudMap.MarkerLayer = L.MapLib.MapMaster.MapOpr.extend({

    //执行画点，画线操作
    oOption: {
        onEventDrawLayers: 'ES:CloudMap.DrawCtrlLayer',

        onEventClearLayers: 'ES:CloudMap.ClearCtrlLayer',

        onEventRemoveLayers: 'ES:CloudMap.RemoveCtrlLayer',

        cIcon:'/Asset/img/ex_default/control_big_icon.png',

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
        this._oCtrlGroup = L.featureGroup();
        this._oMap.addLayer(this._oCtrlGroup);
    },

    //初始化时加载数据
    _loadOn: function () {

        //this._oParent.fire('MV:Site.setSiteData', { aoSiteInfo: oData });
        //给界面赋值，并画工地
        this._oParent.on(this.oOption.onEventDrawLayers, this.drawLayers, this);

        // 清除工地
        this._oParent.on(this.oOption.onEventClearLayers, this.clearAll, this);


    },

    clearAll: function () {
        // 清空数据
        this._oCtrlGroup.clearLayers();
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function (oData) {

        this.clearAll();

        if (!oData || !oData.aoData) {
            return;
        }

        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.length; i++) {
            var oLayer = this.findLayer(this._oCtrlGroup, oData.aoData[i].Id);
            if (oLayer) {
                continue;
            }
            this.drawLayer(oData.aoData[i]);
        }

        this._oMap.fitBounds(this._oCtrlGroup.getBounds());
    },

    // 画单个点
    drawLayer: function (oData) {

        if (!this._oCtrlGroup || !oData) {
            return;
        }

        var oParam = JSON.parse(oData.Json);
        var oIcon = this._getIcon();

        var oMarker = L.marker(oParam.aoLatLng[0],{icon: oIcon});

        L.circle(oParam.aoLatLng[0], {radius: 3000}).addTo(this._oCtrlGroup);

        oMarker.cId = oData.Id;
        oMarker.oData = oData;

        oMarker.addTo(this._oCtrlGroup);

        oMarker.bindTooltip(oData.CloudName).openTooltip();
        //this.initEventForMarker(oMarker);

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

    // 画点
    _getIcon: function () {

        var oIcon = L.icon({
            iconUrl: this.oOption.cIcon,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            //popupAnchor: [-3, -76],
            //shadowUrl: 'my-icon-shadow.png',
            //shadowSize: [68, 95],
            //shadowAnchor: [22, 94]
        });
        return oIcon;
    },

    // 获得弹出层的内容
    _getPopHtml: function (oPosInfo) {

        return '';
    },

    clearMarkerSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oCtrlGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oCtrlGroup.removeLayer(oLayer.oMarker);
            }
            this._oCtrlGroup.removeLayer(oLayer);
        };
    },

});