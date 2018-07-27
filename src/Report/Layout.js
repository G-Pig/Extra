/**
 * Created by Administrator on 2017/5/2.
 */


ES.Report.Layout = ES.Evented.extend({

    cHTML:
    '<div class="ex-layout-content ec-fr ex-overflow-y ec-g">' +
    '   <form class="ec-form ec-form-horizontal ex-layout-form-search ex-theme-form-search" id="formId" action="" target="MainFrame">' +
    '       <li class="ec-form-group ec-u-sm-3">' +
    '           <div class="ec-u-sm-12 ex-final-button">' +
    '               <button type="button" class="ec-btn ec-btn-sm ec-radius ec-btn-primary"><i class="ec-icon-search"></i> 刷新 </button>' +
    '               <button type="button" class="ec-btn ec-btn-sm ec-radius ec-btn-default ex-btn-charts"><i class="ec-icon-area-chart"></i> 导出</button>' +
    '           </div>' +
    '       </li>' +
    '   </form>'+
    '   <div class="ec-panel ec-panel-default ec-margin-bottom-0 clearfix "> ' +
    '           <div class="echarts-style-box" style="min-height:550px;">' +
    '               <div class="echarts-style echarts-style-01">' +
    '                   <div class="ec-u-sm-12">' +
    '                       <div id="echartsCar" style="min-height:250px;"></div>' +
    '                   </div>' +
    '                   <div class="ec-u-sm-12">' +
    '                       <div id="echartsCar2" style="min-height:250px;"></div>' +
    '                   </div>' +
    '               </div>' +
    '           </div>' +
    '           <div class="counter-bottom">    ' +
    '               <div id="CarGridContainer" class="dt-grid-container" style="width:100%;"></div>' +
    '               <div id="CarGridToolBarContainer" class="dt-grid-toolbar-container"></div>' +
    '           </div>' +
    '   </div>' +
    '</div>',

    oOption: {
        cPContainer: '.ex-layout-main',
        nWidth:219,
        nHeight:65,
        nSearchHeight:45
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        // 初始化界面
        this.initUI();

        this.initOn();
    },

    initOn: function () {
        this._oParent.on('Report:Layout.resize',this.resize,this);

    },

    resize: function (oData) {
        if(oData.nWidth){
            this.$_oContainer.css({width:oData.nWidth});
        }
        if(oData.nHeight){
            this.$_oContainer.css({height:oData.nHeight});
        }

    },

    reflesh: function (nWidth,nHeight) {
        this.$_oContainer.css({width:nWidth,height:nHeight});
    },

    initUI: function () {
        this.$_oContainer = $(this.cHTML);

        $(this.oOption.cPContainer).append(this.$_oContainer);

        // 主地图显示
        $('.ex-layout-content').css({ height: $(window).height() , width: $(window).width() - this.oOption.nWidth  });

        var $dtGridCantrain = $('.dt-grid-container');
        var $formSearch = $('.ex-layout-form-search');
        $dtGridCantrain.height($('.ex-layout-content').height() - $formSearch.height() - this.oOption.nSearchHeight - $('.echarts-style-box').height()- 40);
    },

});