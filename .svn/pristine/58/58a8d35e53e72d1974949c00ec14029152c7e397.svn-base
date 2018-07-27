/**
 * 页面的操作类
 *
 * Created by liulin on 2017/8/31.
 */


ES.Muck.RemovalPermit=ES.Page.extend({

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

        var nW = $('.ex-layout-content').width();
        var nH = $('.ex-layout-content').height() - $('.ex-permit-batch').height() - $('.ex-layout-form-search').height() - 85;

        this.oGrid.initGrid({ width: nW, height: nH});


        // 查询 控件
        this.oSearch = new ES.Muck.Search(this, {});

        // 左边树结构
        this.oTree = new ES.Muck.Tree(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/Enterprise/Tree?bindcnt=1',
                    type: 'POST'
                }
            },
            checkbox:{
                tie_selection:false,
            },

            plugins: [ 'types', 'search', 'state','unique']
        });


    },

    initEvent: function () {

    }
});


