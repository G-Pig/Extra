/**
 * Created by YangHang on 2018/1/22.
 */
ES.MapView.BHTSearch = L.MapLib.MapControl.ESMapSearch.extend({
    cHtml: '<div class="ex-maptool-box">' +
    '           <div class="ec-input-group ex-maptool-search-box"> ' +
    '               <input type="text" name="name" placeholder="搜索" class="ec-form-field"/> ' +
    '               <span class="ec-input-group-btn"> ' +
    '                  <button class="ec-btn ec-btn-primary ec-btn-sm search" type="button"><span class="ec-icon-search"></span></button>   ' +
    '                  <button class="ec-btn ec-btn-default ec-btn-sm clear" type="button"><span class="ec-icon-close"></span></button>' +
    '               </span>' +
    '               <ul class="ex-maptool-box-search-result">      </ul>' +
    '           <span class="ec-align-left ec-margin-left" style="    height: 20px;line-height: 15px;">'+
    '              <a href="javascript:void(0);" class="ex-btn-close-left" style="color:#334690;    font-size: 15px;"><i class="ec-icon-arrow-left"></i></a>'+
    '              <a href="javascript:void(0);" class="ex-btn-close-right" style="color:#334690;    font-size: 15px;display:none;"><i class="ec-icon-arrow-right"></i></a>'+
    '           </span>'+
    '           </div>' +
    '       </div>',
    // 构造函数
    initialize: function (oMapBase, options) {
        L.extend(this.oOption, options);
        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;
        //图层
        this.oLayer = L.featureGroup();
        this.oInputData = null;
        this.oLayer.addTo(this._oMap);
        var $_oMapContainer = $(this._oMap.getContainer());
        this.$_oPContainer = $_oMapContainer.find('.' + this.oOption.acParentDivClass.join('.')).eq(0);
        //this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));

        this.initUI();
        this.setParentEvent();
        // 注册事件
        this.initToolEvent();
        this.initBtn();
    },
    initBtn: function () {
        var nWidth = -(this.$_oPContainer.width() - 6);
        this.$_oMinitorOpenBtn = this.$_oContainer.find('a.ex-btn-close-right');
        this.$_oMinitorCloseBtnvar = this.$_oContainer.find('a.ex-btn-close-left');
        this.$_oMinitorCloseBtnvar.show();
        this.$_oMinitorOpenBtn.hide();
        //this.$_oPContainer.stop().animate({ "left": '1rem' }, 800);
        this.$_oPContainer.css({ "left": "1rem" });
        //this.$_oList = this.$_oContainer.find('.ex-layout-monitor-wbox-content');
        var self =this;
        this.$_oMinitorCloseBtnvar.bind('click', function () {
            self.$_oMinitorOpenBtn.show();
            $(this).hide();
            self.$_oPContainer.stop().animate({ "left": nWidth + 32 }, 800);
        });
        this.$_oMinitorOpenBtn.bind('click', function () {
            self.$_oMinitorCloseBtnvar.show();
            $(this).hide()
            self.$_oPContainer.stop().animate({ "left": "1rem" }, 800);
        });
    },
});