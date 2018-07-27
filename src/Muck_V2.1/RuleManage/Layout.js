/**
 * Created by liulin on 2017/8/31.
 */

ES.Muck.Layout= ES.Muck.BaseLayout.extend({
    initUI: function () {

        $('.ex-layout-content').css({ height: $(window).height() , width: $(window).width() - $('.ex-layout-sider.RuleManage').width()});
        var $dtGridCantrain = $('.dt-grid-container');
        var $formSearch = $('.ex-layout-form-search');
        $dtGridCantrain.height($('.ex-layout-content').height() - $formSearch.height() - 40);
    },
})