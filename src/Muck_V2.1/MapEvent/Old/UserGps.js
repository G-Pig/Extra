/**
 * Created by Lenovo on 2017/12/13.
 */


// 在地图上画人员列表
ES.MapBase.UserGps = ES.MapBase.extend({

    //执行画点，画线操作
    oOption: {

    },

    initialize: function (oParent, oOption) {
        ES.MapBase.prototype.initialize.call(this, oParent, oOption);

        // 执行自己的方法
        this._initGroup();
        this._loadOn();

        this.oMsg = new ES.MapBase.UserGps.Msg(this, {});
        this.oUserConfig = new ES.UserGps.UserConfig(this, {});
    },

    // 初始化Group
    _initGroup: function () {

        //把所有的圆点区域绘制在分组图层中
        this._oUserGroup = L.featureGroup();
        this._oMap.addLayer(this._oUserGroup);

    },

    //初始化时加载数据
    _loadOn: function () {

        //给界面赋值
        this._oParent.on("MV:UserGps.drawUsers", this.drawUsers, this);
        this._oParent.on("MV:UserGps.updateUsers", this.updateUsers, this);
        this._oParent.on("MV:UserGps.clearUserByIds", this.clearUserByIds, this)

        this._oParent.on("MV:UserGps.clearUser", this.clearUser, this);
        //this._oParent.fire("MV:UserGps.localUsers", { oUserInfo: nodeData });
        this._oParent.on("MV:UserGps.localUsers", this.localUsers, this);
    },

    localUsers: function (oData) {
        if (!oData || !oData.oUserInfo) return;
        var oLayer = this.findLayer(this._oUserGroup, -oData.oUserInfo.id);
        if (!oLayer) { return; }
        this._oMap.setView(oLayer.getLatLng(), 15);
        oLayer.openPopup();
    },

    clearUser: function () {
        if (!this._oUserGroup) return;
        this._oUserGroup.clearLayers();
    },

    // 在地图上画人员点，增量画，有就更新人员列表，没有就添加人员列表
    drawUsers: function (oData) {
        if (!oData || !oData.aoUser || oData.aoUser.length <= 0) return;
        var aoUser = oData.aoUser;
        for (var i = 0; i < aoUser.length; i++) {
            aoUser[i].aoIsGps = oData.aoIsGps;
            var oLatLng = L.latLng([aoUser[i].Lat, aoUser[i].Lon]);
            var oLayer = this.findLayer(this._oUserGroup, aoUser[i].UserId);
            if (oLayer) {
                oLayer.setLatLng(oLatLng);
            } else {
                var cHtml = this._getPopHtml(aoUser[i]);
                var cIconHtml = this._getIconHtml(aoUser[i]);
                var oIcon = this._getIcon(cIconHtml);
                var oMarker = L.marker(oLatLng, { icon: oIcon });
                oMarker.cId = aoUser[i].UserId;
                oMarker.oPosInfo = aoUser[i];

                oMarker.bindLabel(aoUser[i].Name, { offset: [20, -32], noHide: false, direction: "auto" });
                oMarker.bindPopup(cHtml);
                oMarker.addTo(this._oUserGroup);

                var oPopup = oMarker.getPopup();
                oPopup.oUserInfo = aoUser[i];
                this.initPopEven(oPopup)
                if (aoUser.length == 1) {
                    oMarker.openPopup();
                }
            }
        }
        if (aoUser.length == 1) {
            this._oMap.setView([aoUser[0].Lat, aoUser[0].Lon], 13);
        } else {
            // 定位到地图
            var oBound = this._oUserGroup.getBounds();
            this._oMap.fitBounds(oBound);
        }

    },

    // 更新人员位置信息
    updateUsers:function(oData){
        if (!oData || !oData.aoUser || oData.aoUser.length <= 0) return;
        var aoUser = oData.aoUser;
        for (var i = 0; i < aoUser.length; i++) {
            var oLatLng = L.latLng([aoUser[i].Lat, aoUser[i].Lon]);
            var oLayer = this.findLayer(this._oUserGroup, aoUser[i].UserId);
            if (oLayer) {
                oLayer.setLatLng(oLatLng);
                var oIcon = $(oLayer._icon).find("div.ex-theme-map-user-pin");
                if (aoUser[i].nLocal == 0) {
                    oIcon.removeClass("offline");
                    oIcon.addClass("offline")
                }
                else {
                    oIcon.removeClass("offline");
                }
            }
        }
        // 定位到地图
        //var oBound = this._oUserGroup.getBounds();
        //this._oMap.fitBounds(oBound);
    },

    //工地数据
    _getIconHtml: function (oPosInfo) {
        var cHtml = '<div class="ex-theme-map-user-pin"></div>';
        if (oPosInfo.nLocal === 0)
        {
            cHtml = '<div class="ex-theme-map-user-pin offline"></div>';
        }
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
        var bIsGps = true;
        if (oPosInfo.aoIsGps && oPosInfo.aoIsGps.length > 0) {
            for (var i = 0; i < oPosInfo.aoIsGps.length; i++) {
                if (oPosInfo.aoIsGps[i].nId == oPosInfo.UserId) {
                    bIsGps = oPosInfo.aoIsGps[i].bIsGps;
                    break;
                }
            }
        }


        oPosInfo.cMsg = es.comFunc.getDateMsg(es.comFunc.toDate(oPosInfo.LocationDate).getTime())
        oPosInfo.cPoi = oPosInfo.Poi || "";
        oPosInfo.cStatus = oPosInfo.nLocal == 1 ? "在线" : "离线";
        var cHtml = '<div class="headlines" style="display: inline-block;width: 100%;"><b style="font-size:16px">{Name}</b>  '
            + (bIsGps ? '<span style="float:right;">{LocationDate}{cMsg}</span>' : '')
            + (bIsGps ? '<div style="float:left;clear:both;margin-top:5px; font-size:14px; color:#f60;">当前状态:<span cid="spanVehName"> {cStatus}</span></div>' : '')
            + (bIsGps ? '<div class="car-bd l-bd-on l-mobile-on">  <div class="car-acc-bd"></div> <div class="car-acc-mobile"></div> </div>' : '')
            + '</div>'
            + '<div class="vehicle-information">'
            + '<div class="vehicle-information-left" style="width:200px;">'
            + '<h5>区域：{RegionNameEx}</h5>'
            + (bIsGps ? ' <b> {cPoi}</b><br>' : '')
            + ' <ul class="pop-control">'
            + (bIsGps ? '<li cid="liHisTrack"> <i class="fa fa-exchange"></i> <label>轨迹</label> </li>' : '')
            + (bIsGps ? '<li cid="liUserCall"> <i class="fa fa-send"></i><label>点名</label></li>' : '')
            + '<li cid="liUerMsg"> <i class="fa fa-commenting"></i><label>消息</label></li>'
            + '<li cid="liTasks" onclick="addTask(this,6)"> <i class="fa fa-tasks"></i> <label>任务</label> </li>'
            + (bIsGps ? '<li cid="liUserConfig"> <i class="fa fa-cogs"></i> <label>设置</label> </li>' : '')
            + '</ul> </div><div class="vehicle-information-right" style="width:130px;height:auto">'
            + '<img src="/Content/style/img/user.png" class="photo-car"> </div>'
            + '<div class="vehicle-information-row"></div></div>'

        cHtml = ES.Util.template(cHtml, oPosInfo);

        return cHtml;
    },

    clearUserByIds: function (oData) {
        var anId = oData.anUserId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oUserGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oUserGroup.removeLayer(oLayer.oMarker);
            }
            this._oUserGroup.removeLayer(oLayer);
        };
    },

})

// 加载弹出层
ES.MapBase.UserGps.include({

    initPopEven: function (oPopup) {

        var self = this;
        if (!oPopup) return;

        oPopup.on("contentupdate", function () {
            // 当前弹出层缓存的gps
            var oUserInfo = this.oUserInfo;
            //es.comFunc.getData({ phonenum: oUserInfo.UserId }, "/Vehicle/GetVehicleDetail", self.setPopInfo, self);
            $("li[cid='liHisTrack']").bind("click", function () {
                //打开新的窗体
                window.open("/Track/UserTrackView?UserId=" + oUserInfo.UserId + "&UserName=" + oUserInfo.Name);
            })


            $("li[cid='liUerMsg']").bind("click", function () {
                //打开新的窗体
                self.oMsg.showWnd(oUserInfo);
            })

            // 点名
            $("li[cid='liUserCall']").bind("click", function () {
                ES.getData({ uid: oUserInfo.UserId }, "../user/RollCall", function (data) {
                    if (data.IsSuccess) {
                        $.MsgBox.success(data.Msg);
                    } else {
                        $.MsgBox.error("错误", data.Msg);
                    }
                }, self)
            })

            // 设置当前状态
            $(".headlines>.car-bd").removeClass("l-bd-on").removeClass("l-mobile-on");
            $(".headlines>.car-bd").removeClass("l-bd-off").removeClass("l-mobile-off");
            if (oUserInfo.nLocal == 1) {
                $(".headlines>.car-bd").addClass("l-bd-on")
            } else {
                $(".headlines>.car-bd").addClass("l-bd-off")
            }
            if (oUserInfo.nOnline == 1) {
                $(".headlines>.car-bd").addClass("l-mobile-on")
            } else {
                $(".headlines>.car-bd").addClass("l-mobile-off")
            }

            $("li[cid='liTasks']").data("oGpsInfo", oUserInfo);

            $("li[cid='liUserConfig']").bind("click", function () {
                self.oUserConfig.showWnd(oUserInfo);
            })
        })
    }

})

// 加载消息框
ES.MapBase.UserGps.Msg = ES.Class.extend({

    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);

    },

    initWnd: function () {
        if (this.oWnd) {
            return;
        }
        var oWnd = $("#divUserMsg").kendoWindow({
            title: "下发消息",
            modal: true,
            resizable: false,
            width: 420,
            height: 200,
        }).data("kendoWindow");
        this.initEven();
        this.oWnd = oWnd
    },

    showWnd: function (oUserInfo) {
        this.oUserInfo = oUserInfo;
        //ES.setOptions(this, oOption);
        this.initWnd();
        this.initWndOn();
        this.oWnd.open().center();

    },

    // 注册按钮弹出事件
    initWndOn: function () {
        var self = this;
        // 绑定窗体完全打开事件
        self.oWnd.bind("activate", function (e) {
            $("#divUserMsg").find("#txt_contacts").val('');
        })
    },

    initEven: function () {
        $("#btnMsgOk").bind("click", this, this.fnOk);
        $("#btnMsgCancel").bind("click", this, this.fnCancle)
    },

    // 点击确定按钮事件
    fnOk: function (e) {
        var self = e.data;
        ES.getData({
            content: $("#divUserMsg").find("#txt_contacts").val(),
            users: [{
                Id: self.oUserInfo.UserId,
                Name: self.oUserInfo.Name,
                UserName: self.oUserInfo.UserName,
                DepId: self.oUserInfo.DeptId
            }]
        }, "../Message/AddMessSend", self.fnOkHandler, self)

    },

    fnOkHandler: function (oData) {

        if (oData.IsSuccess) {
            $.MsgBox.success("下发消息成功！");
            this.oWnd.close();

        } else {
            $.MsgBox.error("提示", "下发消息失败！原因：" + oData.msg);
        }
    },

    // 点击取消按钮事件
    fnCancle: function (e) {
        if (!e.data.oWnd) {
            return;
        }
        e.data.oWnd.close();
    },

})

