/**
 * 页面的操作类
 *
 * Created by liulin on 2017/8/31.
 */


ES.Muck.Role = ES.Page.extend({

    initialize: function (cId, oOption, oGridOpt) {

        this.oGridOpt = oGridOpt;
        this.oGridOpt.url = "/RolePermissionScope/ListPaging";
        this.cId = cId;
        this.initUI();
        this.initEvent();

    },

    // 初始画界面对象
    initUI: function () {

        // 页面布局
        this.oLayout = new ES.Muck.RoleLayout(this, {});
        // grid 查询
        this.oGrid = new ES.Muck.RoleGrid(this, {}, this.oGridOpt);

        this.oGrid.initGrid({});

        // 查询 控件
        this.oSearch = new ES.Muck.RoleSearch(this, {});



    },

    initEvent: function () {

    },
});