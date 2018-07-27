
/**
 * Created by liulin on 2017/7/23.
 *
 * 工地树--包括工地查询面板、工地树等信息
 *
 *
 * 查询面板 可能为树，可能为 查询控件
 *
 * 对资源进行操作
 *
 * 树 查询 组装 控件
 */


ES.MapView.BaseTabPanel.BaseTreeView = ES.Evented.extend({

    // 查询面板控件
    oOption: {
        // 树的ur
        cUrl: '',
        // 面板的最上级容器，不是树容器
        cPContainer: '#classContainer',
        // 树节点容器
        cTreeContainerSel: '.ex-layout-struckbox-content',
        // 查询框容器
        cSearchInputSel: '.cls-search-text',
        // 查询btn容器
        cSearchBtnSel: '.cls-search-btn',
    },


    // 车辆列表构造函数
    initialize: function (oParent, oOption, oTOption) {

        // 树配置文档
        this.oTreeOption = oTOption;

        //设置当前树面板参数
        ES.setOptions(this, oOption);
        this._oParent = oParent;


        // 整个页面通信容器
        this._oPage = oParent._oParent;

        // JS 树对象，非jquery 对象
        this.oTree = null;

        this.$_oTreeContainer = null;
        this.$_oSearchInput = null;
        this.$_oSearchBtn = null;

        this.bCheck = true;

        // 初始化界面
        this.initOn();

        if (typeof this.oOption.cPContainer === 'object') {

            this.$_oPContainer = this.oOption.cPContainer
        }
        else {
            this.$_oPContainer = $(this.oOption.cPContainer);
        }

        this.initUI();

    },

    initUI: function () {

        this.$_oStruck = $(this.cHtml);
        this.$_oPContainer.append(this.$_oStruck);
        this.show();
        this.$_oTreeContainer = this.$_oStruck.find(this.oOption.cTreeContainerSel);
        this.$_oSearchInput = this.$_oStruck.find(this.oOption.cSearchInputSel);
        this.$_oSearchBtn = this.$_oStruck.find(this.oOption.cSearchBtnSel);

        this.$_OpenBtn = this.$_oStruck.find('a.ex-icon-turn.off');
        this.$_CloseBtn = this.$_oStruck.find('a.ex-icon-turn.on');

        this.$_oStruck.find('h4').html(this.oOption.cTitle);

        this.initSearchEvent();

        this.initTree();

        this.$_OpenBtn.hide();
        this.$_CloseBtn.show();

        var self = this;

        //车辆列表父选框显示事件
        this.$_OpenBtn.bind('click', function () {
            self._oParent.showBox();
            self.$_CloseBtn.show();
            $(this).hide();
        });

        //车辆列表父选框隐藏事件
        this.$_CloseBtn.bind('click', function () {
            //self.$_oPContainer.fadeOut(500);
            self._oParent.hideBox();
            self.$_OpenBtn.show();
            $(this).hide();
            //self._oPage.resize(120);

        });
    },

    onOffCtrl: function (bOn) {
        if(bOn){
            this.$_CloseBtn.hide();
            this.$_OpenBtn.show();
        }
        else{
            this.$_CloseBtn.show();
            this.$_OpenBtn.hide();
        }

    },

    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.$_oSearchBtn.bind('click', function () {
            if (!self.oPopTree) {
                return;
            }
            var cSearchVal = self.$_oSearchInput.val();
            // 触发查询
            self.$_oTree.search(cSearchVal, false, true);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.$_oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.$_oSearchInput.val();

                self.$_oTree.search(cSearchVal, false, true);
            }, 250);
        });
    },

    // 移除绘制工地
    removeDrawSite: function (oNode) {
        var anId = this.oPopTree.getSelfChildNode(oNode);
        this._oPage.fire('MV:Site.clearSites', {anId: anId});
    },

    // 画选中的工地
    drawCheckSite: function () {
        //获得所有的工地
        var anSiteId = this.oPopTree.getTreeCheckNode();
        if (!anSiteId || anSiteId.length <= 0) {
            return;
        }
        // 获得工地的GPS信息
        ES.getData({anSiteId: anSiteId}, ES.MapView.oConfig.cSiteInfoUrl, this.drawSite, this);
    },

    // 画一个工地
    drawOneSite: function (nSiteId) {
        ES.getData({anSiteId: [nSiteId]}, ES.MapView.oConfig.cSiteInfoUrl, this.drawSite, this);
    },

    initCheckHandler: function () {
        var self = this;
        this.oPopTree.checkCallBack = function (e, oThisNode) {
            if(self.bCheck) {
                // 定位到当前位置上
                if(oThisNode.node.children && oThisNode.node.children.length>0){
                    self.drawCheckSite();
                }
                else
                {
                    var cId = oThisNode.node.id;
                    self.drawOneSite(parseInt(cId.replace('s', '')));
                }
            }
        };
    },

    // 根据id重新初始化树
    clearTree: function () {
        this.oPopTree.uncheckAll();
        this.initCheckHandler();
    },

    // 显示面板
    show: function () {
        this.$_oStruck.show();
        //this.$_oStruck.fadeIn(500);
    },

    // 隐藏面板
    hide: function () {
        this.$_oStruck.hide();
        //this.$_oStruck.fadeOut(500);
    },

    // 画工地,对地图图层集合操作
    drawSite: function (oData) {
        this._oPage.fire('MV:Site.setSiteData', {aoSiteInfo: oData});
    },

    // 初始化界面
    initOn: function () {
        // 内部面板监听
        this._oParent.on("MapView:Struct.show", this.show, this);
        this._oParent.on("MapView:Struct.hide", this.hide, this);

        // 外部面板监听
        this._oPage.on("MapView:SiteStatic.Select", this.selectNode, this);
    },

    selectNode: function (oData) {
        if (!this.oPopTree || !oData || !oData.anLst) {
            return;
        }

        // 在树上找到id，选择
        this.oPopTree.uncheckAll();
        if(oData.anLst<=0){
            return;
        }

        var acItem = oData.anLst.map(function (nItem) {
            return 's' + nItem;
        });
        this.bCheck = false;
        this.oPopTree.setCheckNode(acItem);
        this.bCheck = true;
        this.drawCheckSite();
    },

    // 获得外层容器的宽度
    // getWidth: function () {
    //     return  this.$_oStruck.width();
    // },
    // 获得外层容器的宽度
    // setWidth: function (nWidth) {
    //     this.$_oStruck.width(nWidth);
    // },

    initTreeTitle: function () {
        this.$_oStruck.find("a").each(function () {
            $(this).attr("title", $(this).text());
        });
    },

});

// html 资源
ES.MapView.BaseTabPanel.BaseTreeView.include({
    cHtml:
    '<div class="ex-layout-struckbox">'+
    '   <div class="ex-layout-struckbox-title">'+
    '       <h4 class="ec-align-left">车辆区域</h4>'+
    //'       <a href="javascript:;" class="ex-icon-turn"><i class="ec-icon-times-circle"></i></a>'+
    '   </div>'+
    '   <div class="ex-layout-struckbox-wrap">'+
    '       <div class="ex-layout-struckbox-search">'+
    '           <div class="ec-input-group">'+
    '               <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">'+
    '               <span class="ec-input-group-btn">'+
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>'+
    '               </span>'+
    '           </div>'+
    '       </div>'+
    '       <div class="ex-layout-struckbox-content"></div>'+

    '       <div class="ex-layout-advance-search" style="display:none;">'+

    '       </div>'+
    '   </div>'+
    '</div>',

});

// 树结构得包装
ES.MapView.BaseTabPanel.BaseTreeView.include({

    // 构建树
    initTree: function () {

        this.oTree = this.$_oTreeContainer.jstree(this.oTreeOption);

        this.$_oTree = this.$_oTreeContainer.jstree(true);

        this.initTreeEvent();

        this.initCheckEven();
    },

    // 初始化树的事件
    initTreeEvent: function () {
        var self = this;

        this.oTree.on('ready.jstree', function (e, oThisNode) {
            if (!self.readyCallBack) {
                return;
            }
            self.readyCallBack(e, oThisNode);
        });

        this.oTree.on('after_open.jstree', function (e, oThisNode) {
            if (!self.afterOpen) {
                return;
            }
            self.afterOpen(e, oThisNode);
        });

        this.oTree.on('refresh.jstree', function (e, oThisNode) {
            if (!self.refreshCallBack) {
                return;
            }
            self.refreshCallBack(e, oThisNode);
        });

        this.oTree.on('select_node.jstree', function (e, oThisNode) {
            if (!self.selectCallBack) {
                return;
            }
            self.selectCallBack(e, oThisNode);
        });

        this.oTree.on("changed.jstree", function (e, oThisNode) {
            if (!self.changedCallBack) {
                return;
            }
            self.changedCallBack(e, oThisNode);
        });

        this.oTree.on("dblclick.jstree", function (e, oThisNode) {
            if (!self.dblclickCallBack) {
                return;
            }
            self.dblclickCallBack(e, oThisNode);
        });
    },

    // checkbox 相关的事件
    initCheckEven: function () {
        var self = this;

        this.oTree.on('check_node.jstree', function (e, oThisNode) {
            if (!self.checkCallBack) {
                return;
            }
            self.checkCallBack(e, oThisNode);
        });

        // 取消 check 是的查询
        this.oTree.on('uncheck_node.jstree', function (e, oThisNode) {
            if (!self.uncheckCallBack) {
                return;
            }
            // 获得所有选中的数组
            self.uncheckCallBack(e, oThisNode);
        });

        // 选择所有节点触发
        this.oTree.on('check_all.jstree', function (e, oThisNode) {
            if (!self.checkAllCallBack) {
                return;
            }
            self.checkAllCallBack(e, oThisNode);
        });

        this.oTree.on('uncheck_all.jstree', function (e, oThisNode) {
            if (!self.uncheckAllCallBack) {
                return;
            }
            self.uncheckAllCallBack(e, oThisNode);
        });

    },

    /*
     * 树的节点操作
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    getCheckId: function () {
        var cPrefix = this.oOption.cPrefix;
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var acRtn = null;

        if (cPrefix) {
            acRtn = aoNodeId.map(function (cItem) {
                if (cItem.indexOf(cPrefix) === 0) {
                    return cItem;
                }
            });
        }
        else {
            acRtn = aoNodeId;
        }
        return acRtn;
    },

    // 获得自己和 孩子节点id
    getSelfChildId: function (oNode) {
        var acNodeId = [];
        if (!oNode) {
            return;
        }

        acNodeId.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {
            if (cPrefix) {
                if (acNodeId[0].indexOf(cPrefix) === 0) {
                    return acNodeId[0];
                }
                else {
                    return [];
                }
            }
            else {
                return acNodeId;
            }
        }

        $.merge(acNodeId, oNode.children_d);
        var cPrefix = this.oOption.cPrefix;
        var acRtn = null;
        if (cPrefix) {
            acRtn = $.grep(acNodeId, function (cItem, i) {
                if (cItem.indexOf(cPrefix) === 0) {
                    return true;
                }
            });
        }
        else {
            acRtn = acNodeId
        }

        return acRtn;
    },

    // 获得操作节点 自己得和 所有孩子
    getSelfChildNode: function (oNode) {
        var acNodeId = [];
        if (!oNode) {
            return;
        }
        var aoRtn = [];
        acNodeId.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {

            if(cPrefix) {
                if (acNodeId[0].indexOf(cPrefix) === 0) {
                    aoRtn.push(this.$_oTree.get_node(acNodeId[0]));
                }
            }
            else
            {
                aoRtn.push(this.$_oTree.get_node(acNodeId[0]));
            }

            return aoRtn;
        }

        $.merge(acNodeId, oNode.children_d);

        var cPrefix = this.oOption.cPrefix;


        for(var i = 0;i< acNodeId.length;i++){
            if(cPrefix) {
                if (acNodeId[i].indexOf(cPrefix) === 0) {
                    aoRtn.push(this.$_oTree.get_node(acNodeId[i]));
                }
            }
            else
            {
                aoRtn.push(this.$_oTree.get_node(acNodeId[i]));
            }

        }


        return aoRtn;
    },

    /*
     * 勾选回调函数
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    checkCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cCheckEventName,{acId:this.getCheckId()});
    },

    // 取消所有选择
    uncheckCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cUncheckEventName, {acId:this.getCheckId(), acUncheckId: this.getSelfChildId(oNode.node)});
    },
    checkAllCallBack:function(){
        this._oPage.fire(this.oOption.cCheckEventName,{acId:this.getCheckId()});
    },
    uncheckAllCallBack:function(){
        this._oPage.fire(this.oOption.cUncheckEventName, {acId:this.getCheckId(), acUncheckId: this.getSelfChildId(oNode.node)});
    },

    // 取消所有的选择
    uncheckAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.uncheck_all) {
            return;
        }
        this.$_oTree.uncheck_all();
    },

    // 勾选 所有的选择
    checkAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.check_all) {
            return;
        }
        this.$_oTree.check_all();
    },

    // 设置叶子节点为check，参数为叶子节点id
    setCheckNode: function (anData) {
        if (!anData || anData.length <= 0) {
            return;
        }
        for (var i = 0; i < anData.length; i++) {
            this.$_oTree.check_node(this.$_oTree.get_node(anData[i]));
        }
    },
});