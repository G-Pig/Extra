/**
 * 用户管理
 *
 * Created by liulin on 2017/9/1.
 */


ES.Muck.Site=ES.Page.extend({

    initialize: function (cId, oOption, oGridOpt) {

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

        // 左边树结构
        this.oTree = new ES.Muck.Tree(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/Department/DistrictTree2?cloudtype=6',
                    type: 'GET',
                }
            },
            plugins: [ 'types', 'search', 'state', 'unique']
        });

    },

    initEvent: function () {

    },

    // 导出
    exportExcel:function () {

        var search= {
            Name: $("#s_sitename").val(), StartDate: $("#s_starttime").val(), EndDate: $("#s_endtime").val(), Approval: $("input[name='s_approval']:checked").val() || "",
            StartState: $("#ddl_StartState").val(), SiteType :1
        };
        location.href = "/Site/SiteExport?" + $.param(search);
    }
});


