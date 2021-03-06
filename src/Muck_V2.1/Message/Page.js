/**
 * 页面的操作类
 * Created by liulin on 2017/8/31.
 */
ES.Muck.MessageManage = ES.Page.extend({
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
        var nH = $('.ex-layout-content').height() - $('.ex-layout-form-search').height() - $('.ex-rule-tabs').height() - 83;

        this.oGrid.initGrid({ width: nW, height: nH });

        // var gType = parseInt($('.ex-rule-tab>li.active').attr('data-index'));
        // var oParam = {Type: gType};
        // this.oGrid.query({oParam: oParam});

        // 查询 控件
        this.oSearch = new ES.Muck.Search(this, {});
        this.oGrid_recive = new ES.Muck.Grid_recive(this, {
            cContainer: '.ex-layout-content',
            cGridContainer: 'dtGridContainer_Recive',
            cPagerContainer: 'dtGridToolBarContainer_Recive'
        }, { multiselect: false, url: '/Message/QueryMessReceive' });
        this.oGrid_recive.initGrid({ width: nW, height: nH });
    },

    initEvent: function () {
        var self = this;
        $('.ex-rule-tab').on('click', 'li', function () {
            $(this).addClass('active').siblings().removeClass('active');
            var gType = parseInt($(this).attr('data-index'));
            if (gType == "1")
            {
                $("#div_sendid").show();
                $("#div_reciveid").hide();
                var oParam = { Type: gType };
                // 触发查询
                self.oGrid.query({ oParam: oParam });
            }
            else
            {
                $("#div_reciveid").show();
                $("#div_sendid").hide();

                var oParam = { Type: gType };
                // 触发查询
                self.oGrid.query({ oParam: oParam });
            }
        })
    },
});


