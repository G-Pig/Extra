//初始化页面
ES.Muck.VehicleRegister = ES.Page.extend({

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

        this.oGrid.initGrid({ width: nW, height: nH });

        //this.oGrid.initGrid({});

        // 查询 控件
        this.oSearch = new ES.Muck.Search(this, {});
        this.oSiteTree = new ES.Common.SelectTreeNodeW(null, { cBandSel: $("#Area") },
            {
                core: {
                    'animation': 0,
                    'check_callback': true,
                    'state': { 'opened': true },
                    'data': {
                        'url': '/Enterprise/Tree',
                    }
                },
                plugins: ['search'],
            });
        this.oSiteTree.on("selectVal", function (oData) {
            if (oData.data.type <= 2) {
                ES.aWarn("请选择企业！")
            } else {
                $("#s_h_Area").val(oData.id);
                $("#Area").val(oData.text);
                $('.ex-cover-tree-select').hide().siblings('div').hide();
            }
        });
        // 左边树结构
        this.oTree = new ES.Muck.Tree(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,
                'state': {'opened': true},
                'data': {
                    url: '/Enterprise/Tree',
                    type: 'POST'
                }
            },
            checkbox:{
                tie_selection:false,
            },
            plugins: [ 'types', 'search', 'state','unique']
        });
        this.oTree.reload();
    },
    initEvent: function () {

    },
});