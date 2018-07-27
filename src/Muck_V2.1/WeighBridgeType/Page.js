/**
 * 地磅车辆配置
 * Created by liulin on 2017/9/1.
 */

ES.Muck.WeighBridgeType=ES.Page.extend({

    initialize: function (cId, oOption, oGridOpt) {
        this.oOption = oOption;
        this.oGridOpt = oGridOpt;
        this.cId = cId;
        this.initUI();
        this.initEvent();
    },
    // 初始画界面对象
    initUI: function () {
        // 页面布局
        this.oLayout = new ES.Muck.Layout(this, {});
        // grid 查询
        this.oGrid = new ES.Muck.Grid(this, {}, this.oGridOpt);
        var nW = $('.ex-layout-content').width();
        var nH = $('.ex-layout-content').height() - $('.ex-layout-form-search').height() - 79;
        this.oGrid.initGrid({ width: nW, height: nH});
        // 查询 控件
        this.oSearch = new ES.Muck.Search(this, {});
    },
    initEvent: function () {
    }
});


