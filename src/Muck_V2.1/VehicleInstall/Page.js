/**页面渲染 */
ES.Muck.VehicleInstall = ES.Page.extend({
    initialize: function (cId, oOption, oGridOpt) {
        this.oGridOpt = oGridOpt;
        this.initUI();
        this._countUrl = oGridOpt.countUrl;
        this.initCount(this.oGridOpt.postData.exparameters);
        this.initOn();
        this.initEvent();
        this.initMenu();
    },
    // 初始画界面对象
    initUI: function () {
        // 页面布局
        this.oLayout = new ES.Muck.Layout(this,{});
        // grid 查询
        this.oGrid = new ES.Muck.Grid(this, {}, this.oGridOpt);
        var nW = $('.ex-layout-content').width();
        var nH = $('.ex-layout-content').height() - $('.ex-top-charts').height() - $('.ex-layout-form-search').height()-115;
        // 未审核的表格
        this.oGrid.initGrid({ width: nW, height: nH});
        // 查询 控件
        this.oSearch = new ES.Muck.Search(this, {});
        //下单的表格
        // this.oCheckGrid = new ES.Muck.CheckGrid(this, {
        //     cContainer: '.ex-layout-content',
        //     cGridContainer: 'checkGridContainer',
        //     cPagerContainer: 'checkGridToolBarContainer'
        // }, { multiselect: true, url: '/VehicleInstall/Query' });
        //this.oCheckGrid.initGrid({ width: nW, height: nH });
        this.oEnterpriseTree = new ES.Common.SelectTreeNodeW(null, { cBandSel: $("#InstallEnterprise") },
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
        this.oEnterpriseTree.on("selectVal", function (oData) {
            if (oData.data.type <= 2) {
                ES.aWarn("请选择企业！")
            } else {
                $("#s_h_InstallEnterprise").val(oData.id);
                $("#InstallEnterprise").val(oData.text);
                $('.ex-cover-tree-select').hide().siblings('div').hide();
            }
        });
        // this.oAreaTree = new ES.Common.SelectTreeNodeW(null, { cBandSel: $("#InstallArea") },
        //     {
        //         core: {
        //             'animation': 0,
        //             'check_callback': true,
        //             'state': { 'opened': true },
        //             'data': {
        //                 'url': '/Site/Tree',
        //             }
        //         },
        //         plugins: ["search"],
        //     });
        // this.oAreaTree.on("selectVal", function (oData) {
        //     if (oData.data.type != 2) {
        //         ES.aWarn("请选择区域！")
        //     } else {
        //         $("#s_h_InstallArea").val(oData.id);
        //         $("#InstallArea").val(oData.text);
        //         $('.ex-cover-tree-select').hide().siblings('div').hide();
        //     }
        // });
        var cDate = new Date().toLocaleDateString().replace(/\//g, "-");
        $('#indexTime').val(cDate)
        $('#exTime').val(cDate)
    },
    initOn: function(){
        this.on('VehicleInstall.initCount',this.initCount,this)
    },
    initEvent: function (id) {
        var self = this;
        $('.aClick').on('click',function () {
            $(".aClick").removeClass("ec-active");
            $(this).addClass("ec-active");
            var gType = parseInt($(this).attr('data-index'));
            if (gType == "1")//审核的表格
            {
                // $("#checkGrid").show();
                // $("#getDoneGrid").hide();
                var oParam = { CkType: gType };
                // 触发查询
                self.oGrid.query({ oParam: oParam });
            }
            else if(gType == "2")//下单的表格
            {
                // $("#checkGrid").hide();
                // $("#getDoneGrid").show();
                var oParam = { CkType: gType };
                self.oGrid.query({ oParam: oParam });
                // 触发查询
                //self.oCheckGrid.query({ oParam: oParam });
            }else{
                // $("#checkGrid").show();
                // $("#getDoneGrid").hide();
                var oParam = {CkType: gType};
                self.oGrid.query({ oParam: oParam });
            }
        })
    },
    // 初始化第一条记录
    initMenu: function () {
        $(".ex-sider-menu>li").eq(0).click();
    },
    //渲染echarts的数据
    initCount:function(oData){
        var cDate = new Date().toLocaleDateString().replace(/\//g, "-");
        if(!oData.StartTime) {
            oData = {
                StartTime: this.oSearch.oStartTime.val() + ' 00:00:00',
                EndTime: this.oSearch.oExTime.val() + ' 23:59:59',
                EnterpriceId: this.oSearch.oOEnterprise.val()
            }
        }
        $.post(this._countUrl,oData,function(data){
            var CountItems = $('.ex-top-charts ul li .item-info .boxNum strong');
            CountItems.eq(0).html(data.allVehs_count);//车辆总数
            CountItems.eq(1).html(data.NotCheck_count);//待报装
            //CountItems.eq(2).html(data.never);//已下单
            CountItems.eq(2).html(data.allVehs_install_count);//已安装
            CountItems.eq(3).html(data.Vehs_other_count);//未安装
            var itm = $('.ex-sider-menu .aClick a span');
            itm.eq(0).html(data.all_order_count);
            itm.eq(1).html(data.NotCheck_count);
            itm.eq(2).html(data.Check_count);
        })
    },
});