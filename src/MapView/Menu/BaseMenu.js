/**
 * Created by liulin on 2016/12/19.
 *
 * 菜单控件，负责div tab 的切换
 *
 */


ES.MapView.BaseMenu = ES.Evented.extend({

    oOption: {
        // 是否动态创建
        bIsCreate: true,
        cContainerSel: '.ex-layout-main',
        acContainer: ['ex-layout-menu', 'ex-theme-menu', 'ec-avg-md-1'],

        // 菜单宽度
        nHideWidth:40,
        nShowWidth:120,
        //是否显示菜单文档
        bShowMenu:false,
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        ES.extend(this.oMenuConfig,oOption.oMenuConfig);
        this._aoPanel = [];

        // 当前显示那个panel
        this.oCurPanel = null;

        // 初始化界面
        this.initUI();

    },

    // 加载菜单选项
    initUI: function () {
        //var $_oContainer = null;

        this.getRight();
    },

    // 设置标题
    setTitle: function () {

    },

    getRight: function () {

        ES.Util.reqData({data:{nModelId :this.oOption.nModelId},url:'/Active/GetActive'},this.getRightHandler,this)

    },

    // 加载 菜单
    getRightHandler: function (oData) {
        // 加载菜单、
        if (!oData.rtnData || oData.rtnData.length <= 0) {
            return;
        }

        var $_oContainer = $('<ul class="ex-layout-menu ec-avg-md-1"></ul>');

        for (var i = 0; i < oData.rtnData.length; i++) {
            $_oContainer.append($(oData.rtnData[i].Html));
        }
        //return $_oContainer;

        if (this.oOption.bIsCreate) {
            //$_oContainer = $(this.cHTML);
            $(this.oOption.cContainerSel).append($_oContainer);
        }

        $_oContainer.children('li').width(this.oOption.nShowWidth);

        this.$_oContainer = $_oContainer;

        // 初始化事件
        this.initMenuEvent();

        this.initAn();
    },

    // 初始化节点
    initMenuEvent: function () {

        var self = this;
        var $_oContainer = this.$_oContainer;

        // 没有查询面板的查询，侧边栏选项显示车辆列表和父选框事件
        $_oContainer.find('li.level').bind('click', function () {

            var _i = $(this).index();

            $('.ex-layout-menu > li').removeClass('ec-active in').eq(_i).addClass('ec-active in');

            // 隐藏显示查询树
            self._oParent.fire('MapView:StruckBox.showBox',{oParam: {cTitle: $(this).text()}});

            // 触发在线查询接口
            self._oParent.fire($(this).attr('data-band'), {
                oSearchParam: {cFlag: $(this).attr('data-param')}
            });

            self.setTitle($(this).attr('lst-title'));
            // 点击时 ，直接传数据到lst列表

            var oTemp = {
                // 当前面板的标志
                cFlag: $(this).attr('data-param'),
                cTitle: $(this).attr('tree-title'),
                cObject:$(this).attr('tree-object'),
                cListView:$(this).attr('list-view'),
                cListTitle:$(this).attr('list-title'),
                cCheckEventName:$(this).attr('tree-check-event'),
                cUrl:$(this).attr('list-url'),
                cMonitor:$(this).attr('monitor-object'),

            }
            self.createPanel(oTemp);
            self._oParent.fire('MapView:MonitorMgr.initMonitor',oTemp);
            //self._oParent.resize(400);

        });

        // 有查询面板的查询
        $_oContainer.find('li').not('.level').bind('click', function () {

            var _i = $(this).index();

            $('.ex-layout-menu > li').removeClass('ec-active in').eq(_i).addClass('ec-active in');

            self._oParent.fire('MapView:StruckBox.showBox', {oParam: {cTitle: $(this).text()}});

            var oTemp = {
                // 当前面板的标志
                cFlag: $(this).attr('data-param'),
                cTitle: $(this).attr('tree-title'),
                cObject:$(this).attr('tree-object'),
                cListView:$(this).attr('list-view'),
                cListTitle:$(this).attr('list-title'),
                cMonitor:$(this).attr('monitor-object'),
                cCheckEventName:$(this).attr('tree-check-event'),
                cUrl:$(this).attr('list-url'),
            };

            // 点击菜单，触发左边菜单
            self._oParent.fire('MapView:MonitorMgr.initMonitor',oTemp);

            self.createPanel(oTemp);

            self._oParent.resize(400);
        });

        $_oContainer.find('li').eq(0).click();



        //侧边栏选项显示文字事件
        //$_oContainer.bind('mouseover', function () {
        //    $(this).stop().animate({ "width": "120px" }, 100);
        //    $(this).children('li').width(120);
        //    $(this).find('span').show();
        //    //resizeMap(true, $extaned);
        //})
        //
        ////侧边栏选项隐藏文字事件
        //$_oContainer.bind('mouseout', function () {
        //    //$(this).stop().animate({ "width": "40px" }, 100);
        //    //$(this).children('li').width(40);
        //    //$(this).find('span').hide();
        //    $(this).stop().animate({ "width": "120px" }, 100);
        //    $(this).children('li').width(120);
        //    $(this).find('span').show();
        //    //$(this).find('span').hide();
        //    //resizeMap(false, $extaned);
        //})
    },

    // 加载动画
    initAn: function () {
        var self = this;
        var $_oContainer = this.$_oContainer;
        //侧边栏选项显示文字事件
        $_oContainer.bind('mouseover', function () {
            $(this).stop().animate({"width": self.oOption.nShowWidth + "px"}, 100);
            $(this).children('li').width(self.oOption.nShowWidth);
            $(this).find('span').show();

            //改变地图宽度发送消息
            self._oParent.fire('MapView:Menu.resize',{nWidth:self.oOption.nShowWidth});
        });

        //侧边栏选项隐藏文字事件
        $_oContainer.bind('mouseout', function () {
            $(this).stop().animate({"width": self.oOption.nHideWidth + "px"}, 100);
            $(this).children('li').width(self.oOption.nHideWidth);
            $(this).find('span').hide();
            self._oParent.fire('MapView:Menu.resize',{nWidth:self.oOption.nHideWidth});
        });

    },

    // 创建面板
    createPanel: function (oTemp) {
        var bIn = false;
        if( this._aoPanel.length<=0){
            var oPenel = new ES.MapView.TabPanel(this._oParent, oTemp);
            this._aoPanel.push(oPenel);
            return;
        }

        var bIn = false;
        for (var i = 0; i < this._aoPanel.length; i++) {
            if (this._aoPanel[i].cFlag === oTemp.cFlag) {
                this._aoPanel[i].showBox();
                bIn = true;
                //this._oParent.fire('MapView:LayoutContent.resize', {nWidth: $(window).width()  - this._aoPanel[i].getWidth()});
            }
            else {
                this._aoPanel[i].hideBox();
            }
        }
        if (!bIn) {
            var oPenel = new ES.MapView.TabPanel(this._oParent, oTemp);
            this._aoPanel.push(oPenel);
        }
    },

    getWidth:function () {
        if(!this.oCurPanel ) {
            return 340;
        }
        return this.oCurPanel.getWidth();
    },

});

ES.MapView.BaseMenu.include({

    cHTML:
    '<ul class="ex-layout-menu ec-avg-md-1">' +
    '       <li class="ec-active flip in level" tree-title="车辆区域" ' +
    '           data-param ="AssetLayer" ' +
    '           tree-object="ES.MapView.TabPanel.AssetPanel" ' +
    '           monitor-object="ES.MapView.AssetMonitor"><i class="ec-icon-sitemap"></i> <span>车辆区域</span>' +
    '       </li>' +

    '       <li class="flip in level" tree-title="资产图层" ' +
    '           data-param ="AssetMaintainLayer" ' +
    '           tree-object="ES.MapView.TabPanel.AssetPanel" ' +
    '           monitor-object="ES.MapView.AssetMaintainMonitor"><i class="ec-icon-sitemap"></i> <span>(M)资产图层</span>' +
    '       </li>' +

    '       <li class="flip level" data-type="NetWorks" tree-title="分公司" ' +
    '           data-param ="SubDept" ' +
    '           tree-object="ES.MapView.TabPanel.SubDeptPanel" ' +
    '           monitor-object="ES.MapView.SubDeptMonitor"><i class="ec-icon-forumbee"></i> <span>路网分析</span></li>' +

    '       <li class="flip level" data-type="NetWorks" tree-title="养护段" ' +
    '           data-param ="Maintain" ' +
    '           tree-object="ES.MapView.TabPanel.MaintainPanel" ' +
    '           monitor-object="ES.MapView.MaintainMonitor"><i class="ec-icon-forumbee"></i> <span>(M)路网分析</span></li>' +


    '       <li class="flip level" data-type="NetWorks" tree-title="病害分析" ' +
    '           data-param ="SubDeptDise" ' +
    '           tree-object="ES.MapView.TabPanel.DiseSubDeptPanel" ' +
    '           monitor-object="ES.MapView.DiseMonitor"><i class="ec-icon-forumbee"></i> <span>病害分析</span></li>' +

    '       <li class="flip level" data-type="NetWorks" tree-title="养护段" ' +
    '           data-param ="MaintainDise" ' +
    '           tree-object="ES.MapView.TabPanel.MaintainPanel" ' +
    '           monitor-object="ES.MapView.MaintainMonitor"><i class="ec-icon-forumbee"></i> <span>(M)病害分析</span></li>' +


    '       <li class="flip level" data-type="PlanUser"><i class="ec-icon-users"></i> <span>日常巡维</span></li>' +
    '       <li class="flip level" data-type="PlanTruck"><i class="ec-icon-truck"></i> <span>养护工程</span></li>' +
    '       <li class="flip level"><i class="ec-icon-video-camera"></i> <span>影像信息</span></li>' +
    '   </ul>',
})

