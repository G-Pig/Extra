/**
 * 显示车辆聚会点
 * Created by liulin on 2017/9/16.
 */
ES.MapView.VehClusterLayer = L.MapLib.MapMaster.MapOpr.extend({
    //执行画点，画线操作
    oOption: {
        onDrawLayers: 'MapView:ClusterLayer.DrawLayers',
        onClearLayers: 'MapView:ClusterLayer.clearLayer',
        onRemoveLayers: 'MapView:ClusterLayer.removeLayers',

        cHtml: '<div cid="{devNo}" class="car-body" style="transform:rotate({dir}deg);-webkit-transform: rotate({dir}deg);"></div>' +
        '    <div class="pin-tip " style="display: none;">' +
        '        <div class="pin-dome"><b></b><c></c><d></d></div>' +
        '        <div class="pin-number">{vehNo}</div>' +
        '        <div class="pin-state">' +
        //'            <i class="o-earth"></i>' +
        //'            <i class="cover"></i>' +
        '        </div>' +
        '</div>'
    },
    oPopOption: { maxWidth: 500 ,autoPan: false},
    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);
        this._initGroup();
        this._loadOn();
    },
    // 初始化Group
    _initGroup: function () {
        var self = this;
        // 使用计划来画图
        this._oPosGroup = L.markerClusterGroup({
            animateAddingMarkers: false,
            showCoverageOnHover: false,
            maxClusterRadius: function (z) {
                if (z <= 11) {
                    return 1100;
                } else {
                    return 100;
                }
            },
            iconCreateFunction: function (cluster) {
                var childCount = cluster.getChildCount();
                var c = ' marker-cluster-';

                if (childCount == self.oOption.maxItem) {
                    return new L.DivIcon({
                        iconSize: [20, 20],
                        html: '<div class="ex-monitor-mapicon-site alert">' +
                        '           <div class="pin-tip" style="display: block;">' +
                        '               <div class="areaCount-number">' + self.oOption.areaName + '</div>' +
                        '           </div>' +
                        '           <div class="site-body areaCount">' + childCount +
                        '           </div>' +
                        '       </div>'
                    });
                } else {
                    if (childCount < 10) {
                        c += 'small';
                        return new L.DivIcon({
                            html: '<div><span>' + childCount + '</span></div>',
                            className: 'marker-cluster' + c,
                            iconSize: new L.Point(40, 40)
                        });
                    } else if (childCount < 100) {
                        c += 'medium';
                        return new L.DivIcon({
                            html: '<div><span>' + childCount + '</span></div>',
                            className: 'marker-cluster' + c,
                            iconSize: new L.Point(40, 40)
                        });
                    } else if (childCount >= 100 && childCount < self.oOption.maxItem) {
                        c += 'large';
                        return new L.DivIcon({
                            html: '<div><span>' + childCount + '</span></div>',
                            className: 'marker-cluster' + c,
                            iconSize: new L.Point(40, 40)
                        });
                    }
                }
            }
        });
        this._oMap.addLayer(this._oPosGroup);
    },
    // getLayer: function () {
    //     return this._oPosGroup;
    // },

    //初始化时加载数据
    _loadOn: function () {
        // 画所有的工地数据
        this._oParent.on(this.oOption.onDrawLayers, this.drawLayers, this);
        this._oParent.on(this.oOption.onClearLayers, this.clearLayer, this);
        this._oParent.on(this.oOption.onRemoveLayers, this.removeLayers, this);
        //this._oMap.on('moveend', this.getData, this);

        // 去除重复车辆
        this._oParent.on("MapView:ClusterLayer.removeLayer", this.removeLayer, this);
        // 添加数据
        this._oParent.on("MapView:MapLive.addMarker",function (oData) {
            this.drawLayer(oData.oGpsInfo);
        },this);
    },
    removeLayer:function (oData) {
        if (!this._oPosGroup || !oData || !oData.oGpsInfo) {
            return;
        }
        this._removeLayer(oData.oGpsInfo);
    },
    removeLayers: function (oData) {
        if (!this._oPosGroup || !oData || oData.acId.length <= 0) {
            return;
        }
        var aoInfo = oData.acId;
        for (var i = 0; i < aoInfo.length; i++) {
            var nId = -parseInt(aoInfo[i]);
            this._removeLayer(nId);
        }
    },
    _removeLayer: function (oGpsInfo) {
        var aoLayer = $.grep(this._oPosGroup.getLayers(), function (oLayer) {
            if (oLayer.cId === oGpsInfo.devNo) {
                return true;
            }
        });
        if (!aoLayer || aoLayer.length <= 0) {
            return;
        }
        for (var i = 0; i < aoLayer.length; i++) {
            this._oPosGroup.removeLayer(aoLayer[i]);
        }
    },
    clearLayer: function () {
        this._oPosGroup.clearLayers();
    },
    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function (oData) {
        if (!oData || !oData.aoData) {
            return;
        }
        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.length; i++) {
            this.drawLayer(oData.aoData[i]);
            aoLatLnt.push(oData.aoData[i].latLng);
        }
        // if (aoLatLnt && aoLatLnt.length > 0) {
        //     this._oMap.fitBounds(aoLatLnt);
        // }
    },

    drawLayer: function (oGpsInfo) {
        if (!oGpsInfo ||!oGpsInfo.latLng ) {
            return;
        }
        var oLayer = this.findLayer(this._oPosGroup, oGpsInfo.devNo);
        if (oLayer) {
            if (!this._oMap.hasLayer(oLayer)) {
                this._oMap.addLayer(oLayer);
            }
            oLayer.setLatLng(oGpsInfo.latLng);
            return;
        }
        var cCls = this.getTruckCls(oGpsInfo);
        //oGpsInfo.nDir = oGpsInfo.dir + 180;
        var oIcon = this._getIcon(cCls, ES.Util.template(this.oOption.cHtml, oGpsInfo));
        var oMarker = L.marker(oGpsInfo.latLng, {icon: oIcon}).addTo(this._oPosGroup);
        oMarker.oGpsInfo = oGpsInfo;
        oMarker.cId = oGpsInfo.devNo;

        // 绑定弹出层
        this.initEventForMarker(oMarker);
    },
    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        var self = this;
        if (!oMarker) {
            return;
        }
        oMarker.on('click', function () {
            ES.getData({devNos: [this.cId]}, ES.MapView.oConfig.curPosUrl, function (oTemp) {
                if (!oTemp) {
                    return;
                }
                var aoTemp = self._oParent.toHeartModle(oTemp);
                if (!aoTemp || aoTemp.length <= 0) {
                    return
                }
                var cHtml = self._oParent._getVecMarkerHtml(aoTemp[0]);
                this.bindPopup(cHtml, self.oPopOption);
                var oPopup = this.getPopup();
                oPopup.oGpsInfo = aoTemp[0];
                self.initPopEven(oPopup);

                this.openPopup();

                // var cCls = self.getTruckCls(aoTemp[0]);
                // aoTemp[0].nDir = aoTemp[0].dir+180;
                // var oIcon = self._getIcon(cCls, ES.Util.template(self.oOption.cHtml, aoTemp[0]));
                // this.setIcon(oIcon);
            }, oMarker);
        });
    },
    initPopEven: function (oPopup) {
        var self = this;
        if (!oPopup) return;
        oPopup.self = this;
        oPopup.on("contentupdate", function (){
            // 车辆详情按钮
            var oBtnDetail = $(".leaflet-popup").find("a.ec-icon-truck").parent();
            // 车辆轨迹按钮
            var oBtnTrack = $(".leaflet-popup").find("a.ec-icon-exchange").parent();
            var oMeassageClick = $(".leaflet-popup").find("a.ec-icon-commenting").parent();
            var oGpsInfo = this.oGpsInfo;
            // 绑定事件
            oBtnDetail.bind("click", function () {
                self._oParent.fire("MapView:VehDetail.showDetail",{oGpsInfo:oGpsInfo});
                // 取消订阅
                self._oParent.fire('HubSvr.unsubGps',{aoGpsInfo:[oGpsInfo]});
                // 移除跟踪列表
                self._oParent.fire("MapView:LiveMange.removeAll");
                // 添加跟踪
                self._oParent.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});

                // 取消其他设备订阅
                //self._oParent.fire('HubSvr.unSubAlarm');
                //订阅车辆告警
                //self._oParent.fire('HubSvr.subAlarm', {aoGpsInfo: oGpsInfo});
            });
            oBtnTrack.bind("click", function () {
                // 单独的页面打开
                window.open("/MapView/TrackViewV2?PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo);
            });
            // 发送消息
            oMeassageClick.bind("click", function () {
                ES.aWarn('系统正在开发过程！');
                //devcmd.sendMsg(oGpsInfo.VehicleNo, oGpsInfo.PhoneNum);
            });
        }, oPopup);
    },
    // 画点
    _getIcon: function (cCls,cHtml) {
        var oIcon = L.divIcon({
            iconSize: [30, 40], iconAnchor: [10, 20],
            popupAnchor: [-1, -20],
            className: cCls,
            html: cHtml,
        });
        return oIcon;
    },
    // 车辆类型 carUseIn 0 补电车 ，1 物流车，2 其他车，车辆 状态 行驶，停车/ 熄火 / 离线
    getTruckCls: function (oData) {

        var cClsType = 'ex-monitor-mapicon-truck';
        var cClsStatus = 'green';
        if (oData.carType == 0) {
            cClsType = 'ex-monitor-mapicon-tram';
        }
        if (oData.sta == '行驶' || oData.sta == '停车') {
            cClsStatus = 'green';
        }
        else if (oData.sta == '熄火') {
            cClsStatus = 'green';
        }
        else if (oData.sta == '定位失败') {
            cClsStatus = 'yellow';
        }
        else  {
            cClsStatus = 'gray';
        }
        return cClsType+' '+ cClsStatus;
    },
    getData: function () {
        ES.getData({},ES.MapView.oConfig.getVehsLoc, function (oData) {
            this.drawLayers({aoData: oData});
        }, this);
    }
});