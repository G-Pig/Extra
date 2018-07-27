/**
 * Created by YangHang on 2017/12/19.
 *
 * 工地车辆列表
 */


ES.MapView.BaseTabPanel.SuspicUnloadVehLst = ES.MapView.BaseTabPanel.BaseLst.extend({

    // 初始化界面
    initData: function (nPage, fnCall) {

        ES.Util.loadAn(this.$_oLstContainer);
        var oTemp = {vehNo: this.oSearchInput.val()};
        var _anDeptId = [];
        if (this.anDeptId && this.anDeptId.length > 0) {
            for(var i= 0;i<this.anDeptId.length;i++){
                if(this.anDeptId[i]<0)_anDeptId.push(-parseInt(this.anDeptId[i]));
            }
            //this.anDeptId = _anDeptId;
            ES.extend(oTemp, {WorkSiteIds: _anDeptId,WorkSiteType:2});

        } else {
            ES.extend(oTemp, {WorkSiteIds: _anDeptId,WorkSiteType:2});
        }

        ES.extend(oTemp, {
            pageSize: ES.MapView.oConfig.nMaxPageSize,
            page: nPage
        });

        ES.getData(oTemp, this.oOption.cUrl, fnCall, this);
    },

    toModle: function (oData) {

        var aoGps = [];
        if (!oData || !oData.dataList || oData.dataList.length <= 0) {
            return aoGps;
        }
        for (var i = 0; i < oData.dataList.length; i++) {
            var item = oData.dataList[i];

            var oModel =  {
                id: item.VehicleId,
                vehNo: item.VehicleNo,
                devNo: item.DeviceNo,
                latLng: null,
                gpsDate: '',
                dir: 0,
                poi: '',
                speed: 0,
                status: null,
                currentState: '',
                mile: 0,
                gpsTime: 0,
                dayStart:item.Details[0].StartTime.split(" ")[0],
                dayEnd:item.Details[0].EndTime.split(" ")[0],
                company:item.CompanyName,
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
        else {
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

    initEvent:function () {
        var self = this;

        var $_check =  this.$_oStruck.find('.ex-layout-carlist-query');

        this.$_oOpenBtn.bind('click', function () {
            //$struckList.fadeIn(500);
            //self._oParent.fire("MapView:Struct.show");
            self.$_oStruck.css({ "opacity": "1"});
            //self.$_oStruck.animate({"left": "220px", "opacity": "1"}, 300);
            self.$_oCloseBtn.show();
            $(this).hide();

            self._oParent.openTree();
            //treeList("click");
        });

        //车辆列表父选框隐藏事件
        this.$_oCloseBtn.bind('click', function () {
            //$struckList.fadeOut(500);
            //self._oParent.fire("MapView:Struct.hide");
            self.$_oStruck.css({"opacity": "1"});
            //self.$_oStruck.animate({"left": "0", "opacity": "1"}, 300);
            self.$_oOpenBtn.show();
            $(this).hide();
            self._oParent.closeTree();
            //self._oParent._oParent.fire('MapView:LayoutContent.resize', {nWidth: $(window).width() - 260});
        });


    },
    initVehLst: function (oData) {
        this.anDeptId = oData.acId;
        var self = this;
        this.initData(1, function (oData) {
            var aoGps =  self.toModle(oData);
            self.$_oTitle.find('span').text(oData.records+' 辆')
            self.vehHandler(aoGps);

            self.initPager(oData);
        });
    },


    cHtml: '<div class="ex-layout-carlist">' +
    '   <div class="ex-layout-carlist-title">' +
    '       <h4 class="ec-align-left">车辆列表 [共4000辆]</h4>' +
    '       <a href="javascript:;" class="ex-icon-turn on" ><i class="ec-icon-arrow-circle-left"></i></a>' +
    '       <a href="javascript:;" class="ex-icon-turn off" style="display:none;"><i class="ec-icon-arrow-circle-right"></i></a>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-wrap">' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group"  style="width:100%; float:left">' +
    '               <input type="text" class="ec-form-field" placeholder="请输入车牌号或设备号">' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs" type="button"><span class="ec-icon-search"></span> </button>' +
    '               </span>' +
    '           </div> ' +
    '           <div class="clearfix"></div>' +
    '       </div>' +
    '       <div class="ex-layout-carlist-content"></div>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-page">' +
    '       <ul class="ec-pagination ec-pagination-center">' +
    '           <li class="ec-disabled"><a href="javascript:;">&laquo;</a></li>' +
    '           <li class="ec-active"><a href="javascript:;">1</a></li>' +
    '           <li><a href="javascript:;">2</a></li>' +
    '           <li><a href="javascript:;">3</a></li>' +
    '           <li><a href="javascript:;">4</a></li>' +
    '           <li><a href="javascript:;">5</a></li>' +
    '           <li><a href="javascript:;">&raquo;</a></li>' +
    '       </ul>' +
    '   </div>' +
    '</div>',


});

ES.MapView.BaseTabPanel.SuspicUnloadVehLst.include({

    cItemHtml:
    '<li class="slideup in" style="display: list-item;">' +
    '   <div class="carlist-card">' +
    '       <i class="{cCls}"></i>' +
    '       <div class="carlist-title">' +
    '           <h2 class="num">{vehNo}</h2>' +
    '           <p class="dayTime">{dayStart} 至 {dayEnd}</p>' +
    '       </div>' +
    '       <div class="">' +//
    '           <em class="ec-icon-star" style="float: right;"></em>' +
    //'           <em class="ec-icon-star"></em>' +
    //'           <em class="ec-icon-star"></em>' +
    '       </div>' +
    '           <p class="company">{company}</p>' +
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