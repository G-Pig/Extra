
/**
 * Created by Administrator on 2017/7/25.
 *
 * 显示车辆列表
 */
ES.MapView.BaseTabPanel.VehLst = ES.MapView.BaseTabPanel.BaseLst.extend({

    // 初始化界面
    initData: function (nPage, fnCall) {

        ES.Util.loadAn(this.$_oLstContainer);
        var oTemp = {plateNumOrDev: this.oSearchInput.val()};
        if (this.anDeptId) {
            ES.extend(oTemp, {deptIds: this.anDeptId});
        } else {
            this.anDeptId = [];
        }

        ES.extend(oTemp, {
            pageSize: this.oOption.nPageSize,
            pageIndex: nPage
        });

        ES.getData(oTemp, this.oOption.cUrl, fnCall, this);
    },

    // 初始化分页
    initPager: function (oData) {
        // 初始化分页控件
        this._oParent.fire("MapView:Pager.reflashPager", { nTotalCnt: oData.obj.totalElements });
    },

    vehHandler: function (aoGps) {

        ES.Util.removeAn(this.$_oLstContainer);

        if(!aoGps || aoGps.length<=0){
            return;
        }
        var $_oUL = this.initVehItems(aoGps);
        if (!$_oUL) {
            return;
        }

        this.vehItemEvent($_oUL);
        this.initVehByAnimate($_oUL);
        this.initVehLocal();

    },

    // 车辆类型 carUseIn 0 补电车 ，1 物流车，2 其他车，车辆 状态 行驶，停车/ 熄火 / 离线
    getTruckCls: function (oData) {

        var cClsType = 'truck';
        var cClsStatus = 'green';
        if (oData.carUseIn == 0) {
            cClsType = 'tram';
        }


        if (oData.currentState == '行驶' || oData.currentState == '停车') {
            cClsStatus = 'online';
        }
        else if (oData.currentState == '为定位') {
            cClsStatus = 'offline';
        }
        else  {
            cClsStatus = 'wireless';
        }

        return cClsType+' '+ cClsStatus;
    },

    // 初始化所有车辆列表
    initVehItems:function(aoGps) {
        var $_oUL = $("<ul></ul>");
        if (!aoGps || aoGps.length <= 0) {
            this.initVehByAnimate($_oUL);
            return;
        }

        for (var i = 0; i < aoGps.length; i++) {
            aoGps[i].cCls = this.getTruckCls(aoGps[i]);
            var cHtml = ES.Util.template(this.cItemHtml, aoGps[i]);
            var oLi = $(cHtml);
            oLi.data("data", aoGps[i]);

            $_oUL.append(oLi);
        }

        return $_oUL;
    },

    cItemHtml:
    '<li class="slideup in" style="display: list-item;">' +
    '   <div class="carlist-card">' +
    '       <i class="{cCls}"></i>' +
    '       <div class="carlist-title">' +
    '           <h2 class="num">{vehNo}</h2>' +
    '           <p class="time">{gpsDate}</p>' +
    '       </div>' +
    '       <div class="carlist-fav">' +
    '           <em class="ec-icon-star"></em>' +
    '           <em class="ec-icon-star"></em>' +
    '           <em class="ec-icon-star"></em>' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '   <div class="carlist-bottom">' +
    '       <div class="carlist-btn">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-secondary" href="javascript:void(0);">详细</a>'+ '' +
    '       </div>' +
    '       <div class="carlist-btn">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default">轨迹</a>' +
    '       </div>' +
    '       <div class="carlist-btn">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default">消息</a>' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '</li>',
});
