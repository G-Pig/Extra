/**
 * 页面的操作类
 *
 * Created by liulin on 2017/8/31.
 */


ES.Muck.MapViewTest=ES.Page.extend({

    initialize: function (cId, oOption, oGridOpt) {

        this.oGridOpt = oGridOpt;
        this.cId = cId;
        this.initUI();
        this.initEvent();

    },

    // 初始画界面对象
    initUI: function () {

        // 页面布局
        this.oLayout = new ES.Muck.Layout(this,{});
        // grid 查询
        this.oGrid = new ES.Muck.Grid(this, {}, this.oGridOpt);

        this.oGrid.initGrid();

        // 查询 控件
        this.oSearch = new ES.Muck.BaseSearch(this, {});



    },

    initEvent: function () {

    },
});


