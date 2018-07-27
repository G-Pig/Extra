/**
 * Created by liulin on 2017/8/31.
 */

ES.Muck.Layout= ES.Muck.BaseLayout.extend({

    initUI: function () {
        $('.ex-layout-content').css({ height: $(window).height() , width: $(window).width() - this.oOption.nWidth});
        // var $dtGridCantrain = $('.dt-grid-container');
        // var $formSearch = $('.ex-layout-form-search');
        // $dtGridCantrain.height($('.ex-layout-content').height() - $formSearch.height() - this.oOption.nSearchHeight - $('.echarts-style-box').height()- 40);
        $('.ex-vehicle-batch').height(0);
    }
})