/**
 * Created by liulin on 2017/9/1.
 */

ES.Muck.Layout= ES.Muck.BaseLayout.extend({

    initUI: function () {
        //this.$_oContainer = $('.ex-layout-content');

        //$(this.oOption.cPContainer).append(this.$_oContainer);

        // 主地图显示
        $('.ex-layout-content').css({ height: $(window).height() , width: $(window).width() - this.oOption.nWidth  });
        var $dtGridCantrain = $('.dt-grid-container');
        var $formSearch = $('.ex-layout-form-search');
        $dtGridCantrain.height($('.ex-layout-content').height() - $formSearch.height() - this.oOption.nSearchHeight - $('.echarts-style-box').height()- 40);
    },

});