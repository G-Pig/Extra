/**
 * 设置菜单，白鹤滩的菜单页面
 * Created by liulin on 2018/3/16.
 */

ES.MapView.Menu = ES.MapView.BaseMenu.extend({

    initUI: function () {
        var $_oContainer = $('<ul class="ex-layout-menu ec-avg-md-1"></ul>');

        if (this.oOption.bIsCreate) {
            $_oContainer = $(this.cHTML);
            $(this.oOption.cContainerSel).append($_oContainer);
        }

        // 设置菜单的宽度和高度 显示菜单的文本
        $_oContainer.width(this.oOption.nWidth);
        //$_oContainer.children('li').width(this.oOption.nWidth);
        if(this.oOption.bShowMenu){
            $_oContainer.find('span').show();
        }

        this.$_oContainer = $_oContainer;


        // 初始化事件
        this.initMenuEvent();

        this.initAn();

        this._oParent.AuthValue(this.oOption.MapViewAuthLeft,this.$_oContainer);
    },

    // 创建面板
    createPanel: function (oTemp) {
        var bIn = false;
        if (this._aoPanel.length <= 0) {
            var oPenel = new ES.MapView.TabPanel(this._oParent, oTemp);
            this._aoPanel.push(oPenel);
            this.oCurPanel = oPenel;
            return;
        }

        var bIn = false;
        for (var i = 0; i < this._aoPanel.length; i++) {
            if (this._aoPanel[i].cFlag === oTemp.cFlag) {
                this._aoPanel[i].showBox();
                this.oCurPanel = oPenel;
                bIn = true;
            }
            else {
                this._aoPanel[i].hideBox();
            }
        }
        if (!bIn) {
            var oPenel = new ES.MapView.TabPanel(this._oParent, oTemp);
            oPenel.showBox();
            this.oCurPanel = oPenel;
            this._aoPanel.push(oPenel);
        }
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
                cFlag: $(this).attr('menu-flag'),
                cTreeUrl: $(this).attr('tree-url'),
                cTreeTitle: $(this).attr('tree-title'),
                cTreeObject:$(this).attr('tree-object'),
                cListObject:$(this).attr('list-object'),
                cListTitle:$(this).attr('list-title'),
                cListUrl:$(this).attr('list-url'),
                cCheckEventName:$(this).attr('tree-check-event'),
                cUncheckEventName:$(this).attr('tree-uncheck-event'),
                cViewUrl:$(this).attr('view-url'),
                cViewTitle:$(this).attr('view-title'),
                cViewObject:$(this).attr('view-object'),
                closeList:$(this).attr('list-show')=="close"?false:true,
            }

            self.createPanel(oTemp);


        });

        // 有查询面板的查询
        $_oContainer.find('li').not('.level').bind('click', function () {

            var _i = $(this).index();

            $('.ex-layout-menu > li').removeClass('ec-active in').eq(_i).addClass('ec-active in');
            // 广播 点击事件
            self._oParent.fire('MapView:StruckBox.showBox', {oParam: {cTitle: $(this).text()}});

            var oTemp = {
                // 当前面板的标志
                cFlag: $(this).attr('menu-flag'),
                cTreeUrl: $(this).attr('tree-url'),
                cTreeTitle: $(this).attr('tree-title'),
                cTreeObject:$(this).attr('tree-object'),
                cListObject:$(this).attr('list-object'),
                cListTitle:$(this).attr('list-title'),
                cListUrl:$(this).attr('list-url'),
                cCheckEventName:$(this).attr('tree-check-event'),
                cUncheckEventName:$(this).attr('tree-uncheck-event'),
                cViewUrl:$(this).attr('view-url'),
                cViewTitle:$(this).attr('view-title'),
                cViewObject:$(this).attr('view-object'),
                closeList:$(this).attr('list-show')=="close"?false:true,
            };

            self.createPanel(oTemp);

        });

        $_oContainer.find('li').eq(0).click();
    },

});

// html
ES.MapView.Menu.include({
    cHTML:
    '<ul class="ex-layout-menu ec-avg-md-1">' +
    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="deptVehView" ' +
    '           tree-url ="deptTree" ' +
    '           tree-title="组织架构" ' +
    '           tree-check-event="deptTree:layer" ' +
    '           tree-uncheck-event="undeptTree:layer" ' +
    '           tree-object="ES.MapView.TabPanel.DeptTreeView" ' +
    '           list-object="ES.MapView.BaseTabPanel.DeptVehLst"' +
    '           list-title="车辆列表" ' +
    '           monitor-obj="ES.MapView.VehicleMonitor"' +
    '           list-url="vehLstUrl"'+btnAuth.vehicleList+'><i class="ec-icon-sitemap"></i> <span>车辆列表</span>' +

    '       </li>' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="attend" ' +
    '           list-object="ES.MapView.BaseTabPanel.VehLst"' +
    '           list-title="关注车辆" ' +
    '           list-url="getFollowVeh"'+btnAuth.focus+'><i class="ec-icon-star"></i> <span>关注车辆</span>' +
    '       </li>' +

    // '       <li class="ec-active flip in level" ' +
    // '           menu-flag ="lineVeh" ' +
    // '           tree-url ="lineTree" ' +
    // '           tree-title="限速路段" ' +
    // '           tree-object="ES.MapView.TabPanel.DeptTreeView" ' +
    // '           tree-check-event="lineTree:layer" ' +
    // '           tree-uncheck-event="unlineTree:layer" ' +
    // '           list-object="ES.MapView.BaseTabPanel.VehLst"' +
    // '           list-title="车辆列表" ' +
    // '           list-show = "close"' +
    // '           list-url="getLineVeh"><i class="ec-icon-road"></i> <span>限速路段</span>' +
    // '       </li>' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="siteMap" ' +
    '           tree-url ="siteTree" ' +
    '           tree-title="工地列表" ' +
    '           tree-check-event="siteTree:layer" ' +
    '           tree-uncheck-event="unsiteTree:layer" ' +
    '           tree-object="ES.MapView.TabPanel.SiteTreeView" ' +
    '           list-object="ES.MapView.BaseTabPanel.SiteVehLst"' +
    '           list-title="当日出土车辆列表" ' +
    '           monitor-obj="ES.MapView.SiteMonitor"' +
    '           list-show = "close"' +
    '           list-url="QueryNormalVeh" '+btnAuth.site+'><i class="ec-icon-building"></i> <span>工地列表</span>' +
    '       </li>' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="unloadMap" ' +
    '           tree-url ="unloadTree" ' +
    '           tree-title="消纳点列表" ' +
    '           tree-check-event="UnloadTree:layer" ' +
    '           tree-uncheck-event="unUnloadTree:layer" ' +
    '           tree-object="ES.MapView.TabPanel.SiteTreeView" ' +
    '           list-object="ES.MapView.BaseTabPanel.UnloadVehLst"' +
    '           list-title="当日消纳车辆列表" ' +
    '           monitor-obj="ES.MapView.UnloadMonitor"' +
    '           list-show = "close"' +
    '           list-url="QueryNormalVeh" '+btnAuth.unload+'><i class="ec-icon-download"></i> <span>消纳点列表</span>' +
    '       </li>' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="SpeedLimit" ' +
    '           tree-url ="speedLimitTree" ' +
    '           tree-title="路段限速" ' +
    '           tree-check-event="SpeedLimitTree:layer" ' +
    '           tree-uncheck-event="unSpeedLimitTree:layer" ' +
    '           tree-object="ES.MapView.TabPanel.SpeedLimitTreeView" ' +
    '           list-object=""' +
    '           list-title="" ' +
    '           monitor-obj=""' +
    '           list-show = "close"' +
    '           list-url="" '+btnAuth.limitSpeed+'><i class="ec-icon-road"></i> <span>路段限速</span>' +
    '       </li>' +


    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="AlarmVehView" ' +
    '           list-object="ES.MapView.BaseTabPanel.AlarmVehLst"' +
    '           list-title="违规车辆列表" ' +
    '           list-url="AlarmVehLstUrl"'+
    '           tree-check-event ="AlarmType:Vehicle" ' +
    '           view-url ="AlarmType:Vehicle" ' +
    '           view-object="ES.MapView.BaseTabPanel.AlarmTypes"' +
    '           view-title="车辆告警类型" '+btnAuth.alarmType+'><i class="ec-icon-warning"></i> <span>告警分类</span>' +
    '       </li>' +
    '</ul>',
});