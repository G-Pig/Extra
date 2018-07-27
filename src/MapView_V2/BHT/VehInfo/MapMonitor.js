/**
 * 小地图监控
 * Created by liulin on 2017/9/27.
 */

ES.VehInfo.MapMonitor = L.MapLib.MapMaster.Map.extend({

    oGpsInfo:null,

    initialize:function(oParent,oOption) {
        ES.extend(oOption, {nMapHeight: 300});
        L.MapLib.MapMaster.Map.prototype.initialize.call(this, oParent, oOption);

        //执行自己的方法
        this.loadCtrl()
    },
    // 加载地图控件
    loadCtrl: function () {

        this.loadMapMaster();

        // new L.MapLib.MapControl.ESMapToolArea(this, {
        //     acParentDivClass: [
        //         'ex-layout-maptool',
        //         'ex-theme-maptool',
        //         'ex-map-top',
        //         'ex-map-right'
        //     ],
        //     cUrl: ES.MapView.oConfig.mapAreaLocal,
        //     nZoom:13,
        //     bIsFly:false,
        //     oUIConfig: {
        //         div: {
        //             'class': 'ex-maptool-box ex-control-dropmenu',
        //             i: {'class': 'ec-icon-map-marker'},
        //             html: '&nbsp;&nbsp;区域：',
        //             span: {html: '荆州市'},
        //             i11: {'class': 'ec-icon-angle-down'},
        //             ul: {
        //                 'class': 'ec-avg-sm-2 ec-dropdown-content',
        //             }
        //         }
        //     }});

        // 工具条
        // new L.MapLib.MapControl.ESMapToolBox(this, {
        //     acParentDivClass: [
        //         'ex-layout-maptool',
        //         'ex-theme-maptool',
        //         'ex-map-top',
        //         'ex-map-right'
        //     ]});

        // 地图瓦片
        new L.MapLib.MapControl.ESMapTile(this, {
            acParentDivClass: [
                'ex-layout-maptool',
                'ex-theme-maptool',
                'ex-map-top',
                'ex-map-right'
            ]
        });

    },

    // 设置当前定位的实时车辆信息,第一次设置，或者切换车辆,
    setGpsInfo: function (oGpsInfo) {
        if (!oGpsInfo) {
            //console.log(ESLang.VehInfo.MapMonitor.setGpsInfo.Err);
            return;
        }
        else {
            if (!oGpsInfo.hasOwnProperty("devNo"))
            {
                //console.log(ESLang.VehInfo.MapMonitor.setGpsInfo.ErrPh);
                return;
            }
        }

        if (!this.oGpsInfo || this.oGpsInfo.devNo != oGpsInfo.devNo) {
            this.oGpsInfo = oGpsInfo;
            if (this.oMapLive) {
                this.oMapLive.offEven();
                this.oMapLive.clearLiveTrack();
                // 释放对象
                delete this.oMapLive;
            }
            // 设置监控实体
            this.oMapLive = new ES.VehInfo.MapLive(this._oParent, {}, this._oMap);
            //this.oMapLive.setFristGps(oGpsInfo);
            //画第一点
            oGpsInfo.bOpenBubble = false;
            this.oMapLive.drawLiveTrack({ oGpsInfo: oGpsInfo });

            // 定位到当前车辆点
            //this.flyTo({ oGpsInfo: oGpsInfo });
        }
    },

    // 设置实时推送数据
    setHubGpsInfo: function (oGpsInfo) {

        if (!oGpsInfo) return;

        if (!this.oMapLive) return;

        this.oMapLive.drawLiveTrack({ "oGpsInfo": oGpsInfo });

        // 要判断是否在地图范围内，不再地图范围内，平移地图
        var oBound = this._oMap.getBounds();

        //var oLatlng = L.latLng(oGpsInfo.Lat, oGpsInfo.Lon);
        //if (!oBound.contains(oLatlng)) {
        //    this.flyTo({ oGpsInfo: oGpsInfo });
        //}

    },
    //加载地图
    _loadMap: function () {

        // 首先要判断是否有地图div ，没有就在地图容器中加载div
        var oDiv = L.DomUtil.get(this.options.cDidId);

        var nWidth = this.options.nMapWidth;
        var nHeight = this.options.nMapHeight;

        if (!oDiv) {

            var oContainer = L.DomUtil.get(this.options.cDivContainerId);
            if (!oContainer) {

                throw new Error(L.MapLib.MapMaster.Err[2]);
            }

            oDiv = L.DomUtil.create(this.cDiv, '', oContainer);
        }

        //oDiv.style.width = nWidth + 'px';
        oDiv.style.height = nHeight + 'px';
        oDiv.id = this.options.cDidId;

        L.Util.extend(this.options.oMapOption, {layers: [this._oDefaultTile]});

        var oMap = this._oMap = new L.Map(this.options.cDidId, this.options.oMapOption);

        if (this._oParent) {
            if (this._oParent.setMap) {
                this._oParent.setMap(oMap);
            }
            this._oParent.fire('Map:loadFinish', {oMap: oMap});

            this.fire('Map:loadFinish', {oMap: oMap});
        }

        return oMap;
    },

});