
/**
 * Created by Administrator on 2017/7/25.
 *
 * 显示车辆列表
 */
ES.MapView.BaseTabPanel.VehLst = ES.MapView.BaseTabPanel.BaseLst.extend({

    // 初始化界面
    initData: function (nPage, fnCall) {

        ES.Util.loadAn(this.$_oLstContainer);
        var oTemp = {vehNo: this.oSearchInput.val()};
        var bSpeed = this.$_oStruck.find('.ex-layout-carlist-query').find('input[type="checkbox"].speed').is(':checked')?1:"";
        var bAcc = this.$_oStruck.find('.ex-layout-carlist-query').find('input[type="checkbox"].acc').is(':checked')?3:"";
        var bStop = this.$_oStruck.find('.ex-layout-carlist-query').find('input[type="checkbox"].stop').is(':checked')?2:"";
        var bLocal = this.$_oStruck.find('.ex-layout-carlist-query').find('input[type="checkbox"].local').is(':checked')?4:"";
        var bLost = this.$_oStruck.find('.ex-layout-carlist-query').find('input[type="checkbox"].lost').is(':checked')?5:"";

        if (this.anDeptId && this.anDeptId.length > 0) {
            ES.extend(oTemp, {deptIds: this.anDeptId});
        } else {
            this.anDeptId = "";
            ES.extend(oTemp, {deptIds: this.anDeptId});
        }

        ES.extend(oTemp, {
            pageSize: ES.MapView.oConfig.nMaxPageSize,
            page: nPage
        });

        ES.extend(oTemp, {
            status: [bAcc,bSpeed,bStop,bLocal,bLost]
        });

        ES.getData(oTemp, this.oOption.cUrl, fnCall, this);
    },

    toModle: function (oData) {

        var aoGps = [];
        if (!oData || !oData.dataList || oData.dataList.length <= 0) {
            return aoGps;
        }
        for (var i = 0; i < oData.dataList.length; i++) {

            var vehNo = oData.dataList[i].VehicleNo;

            var oModel =  {
                    id: oData.dataList[i].Id,
                    vehNo: vehNo,
                    devNo: oData.dataList[i]._MainDeviceNo,
                    latLng: null,
                    gpsDate: '',
                    dir: 0,
                    poi: '',
                    speed: 0,
                    status: null,
                    currentState: '',
                    mile: 0,
                    gpsTime: 0,

                };
            aoGps.push(oModel);
        }

        return aoGps;
    },

    // 初始化分页
    initPager: function (oData) {
        // 初始化分页控件
        this._oParent.fire("MapView:Pager.reflashPager", {nTotalCnt: oData.records});
    },

    vehHandler: function (aoGps) {

        ES.Util.removeAn(this.$_oLstContainer);

        if (!aoGps) {
            return;
        }
        var $_oUL = this.initVehItems(aoGps);
        if (!$_oUL) {
            return;
        }
        this.initVehLocal($_oUL);
        this.vehItemEvent($_oUL);
        this.initVehByAnimate($_oUL);
        this.initAttendEvent();
        this.initAttend();
    },

    // 车辆类型 carUseIn 0 补电车 ，1 物流车，2 其他车，车辆 状态 行驶，停车/ 熄火 / 离线
    getTruckCls: function (oData) {

        var cClsType = 'truck';
        var cClsStatus = 'gray';
        if (oData.carUseIn == 0) {
            cClsType = 'tram';
        }

        if (oData.sta == '行驶' || oData.sta == '停车'|| oData.sta == '熄火') {
            cClsStatus = 'green';
        }
        else if(oData.sta == "定位失败"){
            cClsStatus = 'yellow';
        }
        else if(oData.sta == "通讯中断"){
            cClsStatus = 'gray';
        }

        return cClsType + ' ' + cClsStatus;
    },

    // 初始化所有车辆列表
    initVehItems: function (aoGps) {
        var $_oUL = $("<ul></ul>");
        if (!aoGps) {
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

});

ES.MapView.BaseTabPanel.VehLst.include({

    cItemHtml:
    '<li class="slideup in" style="display: list-item;">' +
    '   <div class="carlist-card">' +
    '       <i class="{cCls}"></i>' +
    '       <div class="carlist-title">' +
    '           <h2 class="num">{vehNo}</h2>' +
    '           <p class="time">{gpsDate}</p>' +
    '       </div>' +
    '       <div class="">' +//
    '           <em class="ec-icon-star" style="float: right;"></em>' +
        //'           <em class="ec-icon-star"></em>' +
        //'           <em class="ec-icon-star"></em>' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '   <div class="carlist-bottom">' +
    '       <div class="carlist-btn">' +//ec-btn-secondary
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">跟踪</a>'+ '' +
    '       </div>' +
    '       <div class="carlist-btn">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">轨迹</a>' +
    '       </div>' +
    '       <div class="carlist-btn">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">详情</a>' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '</li>',

});