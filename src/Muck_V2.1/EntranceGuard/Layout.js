/**
 * Created by liulin on 2017/8/31.
 */

ES.Muck.Layout= ES.Muck.BaseLayout.extend({
    oOption: {
        cPContainer: '.ex-layout-main',
        nWidth:300,
        nHeight:65,
        nSearchHeight:45
    },

    initUI: function () {

        $('.ex-layout-site-content').css({ height: $(window).height() , width: $(window).width() - this.oOption.nWidth  });
        var $dtGridCantrain = $('.dt-grid-container');
        var $formSearch = $('.ex-layout-form-search');
        var $treeContent = $('.ex-layout-site-sider');
        $dtGridCantrain.height($('.ex-layout-content').height() - $formSearch.height() - this.oOption.nSearchHeight - $('.echarts-style-box').height()- 40);
        $treeContent.width(this.oOption.nWidth);
    }
})