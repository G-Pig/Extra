/**
 *  Created by liulin on 2017/7/23.
 *
 *  沃特玛 资产管理 菜单 列表
 *
 */


ES.MapView.Menu = ES.MapView.BaseMenu.extend({

    initUI: function () {
        var $_oContainer = $('<ul class="ex-layout-menu ec-avg-md-1"></ul>');

        if (this.oOption.bIsCreate) {
            $_oContainer = $(this.cHTML);
            $(this.oOption.cContainerSel).append($_oContainer);
        }

        // 设置菜单的宽度和高度 显示菜单的文本
        $_oContainer.width(120);
        $_oContainer.children('li').width(120);
        $_oContainer.find('span').show();

        this.$_oContainer = $_oContainer;
        // 初始化事件
        this.initMenuEvent();

        this.initAn();
    },

    // 创建面板
    createPanel: function (oTemp) {
        var bIn = false;
        if (this._aoPanel.length <= 0) {
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
            }
            self.createPanel(oTemp);
            //self._oParent.fire('MapView:MonitorMgr.initMonitor',oTemp);
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
            };

            // 点击菜单，触发左边菜单
            //self._oParent.fire('MapView:MonitorMgr.initMonitor',oTemp);

            self.createPanel(oTemp);

            //self._oParent.resize(400);
        });

        $_oContainer.find('li').eq(0).click();
    },
});

ES.MapView.Menu.include({

    cHTML:
    '<ul class="ex-layout-menu ec-avg-md-1">' +
    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="deptVehView" ' +
    '           tree-url ="deptTree" ' +
    '           tree-title="组织架构" ' +
    '           tree-object="ES.MapView.TabPanel.DeptTreeView" ' +
    '           list-object="ES.MapView.BaseTabPanel.VehLst"' +
    '           list-title="车辆列表" ' +
    '           list-url="vehLstUrl"><i class="ec-icon-sitemap"></i> <span>车辆列表</span>' +
    '       </li>' +
    '   </ul>',
});