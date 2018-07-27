/**
 * Created by YangHang on 2018/2/26.
 */


/**
 * Created by YangHang on 2017/11/17.
 */

ES.MapView.BaseTabPanel.RectSearch = ES.MapView.BaseTabPanel.BaseLst.extend({

    initOn:function(){

    },
    // 高级查询
    initEvent: function () {
        var self =this;
        this.$_SearchBtn.on('click',function(){

            if(self.$_oStruck.siblings().width()==0){
                self.$_oStruck.siblings().find('a.ex-icon-turn.on').click();
            }

            if(self.restTimeType==0){
                self.oParam.StartTs = $('#RectBeginTime').val();
                self.oParam.EndTs = $('#RectEndTime').val();
            }else{
                self.oParam.StartTs =self.desendMinutes(new Date(),5).Format('yyyy-MM-dd HH:mm:ss');
                self.oParam.EndTs = new Date().Format('yyyy-MM-dd HH:mm:ss');
            }

            self.saveSearch();

        });

        this.$_restType.on('click','button.edit',function(){
            $(this).hide().siblings().show();
            self.DrawRect();
        });

        this.$_restType.on('click','button.clear',function(){
            $(this).hide().siblings().show();

            self.reSetSearch();
        });

        this.$_restTimeType.on('click','button',function(){
            $(this).removeClass('white').siblings().addClass('white');
            var _historyBox = $(this).parent().siblings('div.ex-rect-time-history');
            if($(this).index()==0){
                self.restTimeType = 0;
                _historyBox.find('.ex-rect-time').show().siblings('.ex-rect-time-now').hide();
            }else{
                self.restTimeType = 1;
                _historyBox.find('.ex-rect-time-now').show().siblings('.ex-rect-time').hide()

            }
        });

        $("#RectBeginTime").click(function () {
            WdatePicker({
                dateFmt: "yyyy-MM-dd HH:mm:ss",
                isShowClear: false,
                maxDate: '#F{$dp.$D(\'RectEndTime\')}'
            });
        });
        $("#RectEndTime").click(function () {
            WdatePicker({
                dateFmt: "yyyy-MM-dd HH:mm:ss",
                isShowClear: false,
                minDate: '#F{$dp.$D(\'RectBeginTime\')}'
            });
        });
        this._oPage.on("RectSearch:setLayerGps",this.setLayerGps,this)
    },

    DrawRect:function(){
        this._oPage.fire("RectView:layer")

    },
    setLayerGps:function(oData){
        this.oParam =oData.oParam;
        this.$_SearchBtn.removeClass('ec-disabled');
    },
    saveSearch:function(){
        this._oPage.fire(this.oOption.cCheckEventName,{Data:this.oParam})
    },
    reSetSearch:function(){
        this._oPage.fire("unRectView:layer");
        this._oPage.fire("unVehicleLine:layer");
        this._oPage.fire(this.oOption.cCheckEventName,{Data:{}})
        this.$_SearchBtn.addClass('ec-disabled');
    },

    initUI: function () {
        // 当前对象集合
        this.$_oStruck = $(this.cHtml);
        this.$_oContainer.append(this.$_oStruck);
        // 车辆容器

        this.$_oTitle = this.$_oStruck.find('h4');
        this.$_oTitle.html(this.oOption.cTitle);
        this.$_SearchBtn = this.$_oStruck.find('#rectSearch')
        this.$_restType = this.$_oStruck.find('.ex-btn-restType');
        this.$_restTimeType = this.$_oStruck.find('.ex-rect-time-select');
        this.initEvent();
        this.restTimeType = 0;
        this.oParam = {};
    },
    desendMinutes:function(date,minutes){

        minutes=parseInt(minutes);

        var   interTimes=minutes*60*1000;

        interTimes=parseInt(interTimes);

        return   new Date(Date.parse(date)-interTimes);

    }


});

// html数据
ES.MapView.BaseTabPanel.RectSearch.include({
    cHtml: '<div class="ex-layout-carlist">' +
    '   <div class="ex-layout-carlist-title">' +
    '       <h4 class="ec-align-left">车辆列表 [共4000辆]</h4>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-wrap">' +
    '      <div class="ex-rect-box">' +
    '           <ul>' +
    '               <li>' +
    // '                   <h2>选择拉框类型：</h2>' +
    '                   <div class="ec-btn-group ex-btn-restType">' +
    '                       <button type="button" class="ec-btn ec-btn-primary ec-btn-block ec-radius white edit"> 绘制矩形拉框 </button>' +
    '                       <button type="button" class="ec-btn ec-btn-primary ec-btn-block ec-radius clear" style="display:none;margin: 0;"> 清除拉框 </button>' +
    '                   </div>' +
    '               </li>' +
    '               <li>' +
    '                   <h2>查询时间：</h2>' +
    '                   <div class="ec-btn-group ex-rect-time-select">' +
    '                       <button type="button" class="ec-btn ec-btn-primary ec-round">查询历史</button>' +
    '                       <button type="button" class="ec-btn ec-btn-primary ec-round white">查询实时</button>' +
    '                   </div>' +
    '                   <div class="ex-rect-time-history">' +
    '                       <div class="ex-rect-time">' +
    '                           <label for="">开始时间</label>' +
    '                           <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
    '                               <input size="16" type="text" value="" id="RectBeginTime" class="ec-form-field" ">' +
    '                               <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>' +
    '                           </div>' +
    '                       </div>' +
    '                       <div class="ex-rect-time">' +
    '                           <label for="">结束时间</label>' +
    '                           <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
    '                               <input size="16" type="text" value="" id="RectEndTime" class="ec-form-field" ">' +
    '                               <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>' +
    '                           </div>' +
    '                       </div>' +
    '                       <div class="ex-rect-time-now">' +
    '                           <h3>查询当前时间五分钟内的车辆列表</h3>' +
    '                       </div>' +
    '                   </div>' +
    '               </li>' +
    '               <li>' +
    '                   <a type="button"  class="ec-btn ec-btn-success ec-radius ec-btn-block ec-disabled" id="rectSearch"><i class="ec-icon-search"></i>&nbsp;&nbsp;查&nbsp;&nbsp;&nbsp;&nbsp;询</a>' +
    // '                   <div class="ec-btn-group ex-rect-reset">' +
    // '                       <button type="button" class="ec-btn ec-btn-danger ec-radius">重置拉框</button>' +
    // '                       <button type="button" class="ec-btn ec-btn-primary ec-radius">刷新查询</button>' +
    // '                   </div>' +
    '               </li>' +
    '           </ul>' +
    '      </div>'+
    '   </div>' +
    '</div>',
});