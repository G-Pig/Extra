/**
 * 设置菜单
 * Created by liulin on 2017/9/18.
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
            if($(this).attr('data-obj')){
                //加载数据统计面板
                var oTemp = eval($(this).attr('data-obj'));
                setTimeout(function(){
                    self.DataMonitor = new oTemp(self._oParent, {});
                },1000)
            }else{
                $('.ex-layout-monitor-wbox').empty();
            }

            //self._oParent.resize(400);

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
            if($(this).attr('data-obj')){
                //加载数据统计面板
                var oTemp = eval($(this).attr('data-obj'));
                setTimeout(function(){
                    self.DataMonitor = new oTemp(self._oParent, {});
                },1000)
            }else{
                $('.ex-layout-monitor-wbox').empty();
            }
            self._oParent.resize(400);
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
    '           data-obj="ES.MapView.VehicleMonitor"' +
    '           list-url="vehLstUrl"><i class="ec-icon-sitemap"></i> <span>车辆列表</span>' +

    '       </li>' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="attend" ' +
    '           list-object="ES.MapView.BaseTabPanel.VehLst"' +
    '           list-title="关注车辆" ' +
    '             list-url="getFollowVeh"'+btnAuth.focus+'><i class="ec-icon-star"></i> <span>关注车辆</span>' +
    '       </li>' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="lineVeh" ' +
    '           tree-url ="lineTree" ' +
    '           tree-title="审批线路" ' +
    '           tree-object="ES.MapView.TabPanel.DeptTreeView" ' +
    '           tree-check-event="lineTree:layer" ' +
    '           tree-uncheck-event="unlineTree:layer" ' +
    '           list-object="ES.MapView.BaseTabPanel.VehLst"' +
    '           list-title="车辆列表" ' +
    '            list-url="getLineVeh"'+btnAuth.line+'><i class="ec-icon-road"></i> <span>线路车辆</span>' +
    '       </li>' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="siteMap" ' +
    '           tree-url ="siteTree" ' +
    '           tree-title="工地列表" ' +
    '           tree-check-event="siteTree:layer" ' +
    '           tree-uncheck-event="unsiteTree:layer" ' +
    '           tree-object="ES.MapView.TabPanel.SiteTreeView" ' +
    '           list-object="ES.MapView.BaseTabPanel.SiteVehLst"' +
    '           list-title="当日出土车辆列表" ' +
    '           data-obj="ES.MapView.SiteMonitor"' +
    '           list-show = "close"' +
    '            list-url="QueryNormalVeh" '+btnAuth.site+'><i class="ec-icon-building"></i> <span>工地列表</span>' +
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
    '           data-obj="ES.MapView.UnloadMonitor"' +
    '           list-show = "close"' +
    '            list-url="QueryNormalVeh" '+btnAuth.unload+'><i class="ec-icon-download"></i> <span>消纳点列表</span>' +
    '       </li>' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="suSpicSite" ' +
    '           tree-url ="SuspicSiteTree" ' +
    '           tree-title="可疑工地列表" ' +
    '           tree-check-event="SuspicSiteTree:layer" ' +
    '           tree-uncheck-event="unSuspicSiteTree:layer" ' +
    '           tree-object="ES.MapView.TabPanel.SiteTreeView" ' +
    '           list-object="ES.MapView.BaseTabPanel.SuspicSiteVehLst"' +
    '           list-title="可疑出土车辆列表" ' +
    '           data-obj="ES.MapView.SuspicSiteMonitor"' +
    '           list-show = "close"' +
    '            list-url="QuerySuspicVeh" '+btnAuth.susSite+'><i class="ec-icon-upload"></i> <span>可疑工地</span>' +
    '       </li>' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="suSpicUnloadMap" ' +
    '           tree-url ="SuspicUnloadTree" ' +
    '           tree-title="可疑消纳点列表" ' +
    '           tree-check-event="SuspicUnloadTree:layer" ' +
    '           tree-uncheck-event="unSuspicUnloadTree:layer" ' +
    '           tree-object="ES.MapView.TabPanel.SiteTreeView" ' +
    '           list-object="ES.MapView.BaseTabPanel.SuspicUnloadVehLst"' +
    '           list-title="可疑消纳车辆列表" ' +
    '           data-obj="ES.MapView.SuspicUnloadMonitor"' +
    '           list-show = "close"' +
    '            list-url="QuerySuspicVeh" '+btnAuth.susUnload+'><i class="ec-icon-download"></i> <span>可疑消纳点</span>' +
    '       </li>' +


    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="AlarmVehView" ' +
    '           list-object="ES.MapView.BaseTabPanel.AlarmVehLst"' +
    '           list-title="今日违规车辆列表" ' +
    '           list-url="AlarmVehLstUrl"'+
    '           tree-check-event ="AlarmType:Vehicle" ' +
    '           view-url ="AlarmType:Vehicle" ' +
    '           view-object="ES.MapView.BaseTabPanel.AlarmTypes"' +
    '           view-title="车辆告警类型" '+
    '             '+btnAuth.alarmType+'><i class="ec-icon-warning"></i> <span>告警分类</span>' +
    '       </li>' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="fenceMap" ' +
    '           tree-url ="FenceTree" ' +
    '           tree-title="围栏" ' +
    '           tree-check-event="fenceTree:layer" ' +
    '           tree-uncheck-event="unfenceTree:layer" ' +
    '           tree-object="ES.MapView.TabPanel.FenceTreeView" ' +
    '           list-object="ES.MapView.BaseTabPanel.FenceVehLst"' +
    '           list-title="当日经过车辆" ' +
    //'           list-show = "close"' +
    '            list-url="FenceVehLstUrl" '+btnAuth.fence+'><i class="ec-icon-map-signs"></i> <span>围栏</span>' +
    '       </li>' +
    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="rectVehView" ' +
    '           list-object="ES.MapView.BaseTabPanel.RectVehLst"' +
    '           list-title="框内车辆" ' +
    '           list-url="RectVehLstUrl"'+
    '           tree-check-event ="RectSearch:Vehicle" ' +
    '           view-url ="RectSearch:Vehicle" ' +
    '           view-object="ES.MapView.BaseTabPanel.RectSearch"' +
    '           view-title="拉框搜索" '+
        '             '+btnAuth.areaSearch+'><i class="ec-icon-object-group"></i> <span>拉框搜索</span>' +
    '       </li>' +
    '</ul>',
});