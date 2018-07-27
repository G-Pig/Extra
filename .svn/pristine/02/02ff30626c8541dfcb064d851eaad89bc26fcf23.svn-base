/**
 * Created by liulin on 2017/4/24.
 */


ES.CloudMap.BaseTreePanel = ES.Evented.extend({

    oOption: {
        // 树的ur
        cUrl: '',
        // 外层容器
        cDivContainer: '.tree-layout-map',

        cCheckUrl: '',
        // 树节点容器
        cTreeContainerSel: '.ex-layout-struckbox-content',
        // 查询框容器
        cSearchInputSel: '.ex-tree-search-ipt',
        // 查询btn容器
        cSearchBtnSel: '.ex-tree-search-btn',
        // 监听事件，对外接口
        cEventName: 'cPermission',

        cTitle:'组织架构',
        nHeight:350,
        nWidth:280,
    },


    oTreeOption: {
        // 树的url
        //cTreeUrl: '',
        // 树所用的插件
        //acPlugin: ['checkbox', 'types', 'search', 'state', 'unique'],
        // 树的check数据来源
    },

    initialize: function (oParent, oOption, oTOption) {
        //this.initContain(oOption);
        this._oParent = oParent;

        this.oTOption = {};
        ES.setOptions(this,oOption);
        ES.extend(this.oTOption, this.oTreeOption, oTOption);

        if (typeof this.oOption.cDivContainer === 'object') {
            this.$_oPContainer = this.oOption.cDivContainer;
        }
        else {
            this.$_oPContainer = $(this.oOption.cDivContainer);
        }

        this.initOn();

        this.$_oContainer = null;
        this.oPopTree = null;
        this.oTreeContainer = null;
        this.oSearchInput = null;
        this.oSearvhBtn = null;
        // 缓存上次树选择的节点数据
        this._oSelData = null;
    },

    // 给树的上级容器做id
    initContain: function (oOption) {
        // 设置container 容器的id
        oOption.content = ES.template(oOption.content, oOption);
    },

    initOn: function () {
        this._oParent.on('PostPosTreeView.reflesh',this.reflesh,this);
    },

    reflesh: function () {
        if (!this.oPopTree) {
            return;
        }
        //this.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
        this.oPopTree.$_oTree.refresh();
    },

    initButton: function () {

        var self = this;

        var aoButton = [
            {
                value: ES.Lang.Boss[1],
                callback: function () {
                    self.ok();
                    return false;
                },
                autofocus: true
            }
        ];

        this.oOption.button = aoButton;
    },

    initUI: function () {
        var oTemp = $(ES.template(this.cHtml, {cTitle: this.oOption.cTitle})).addClass(this.oOption.cFlag);

        this.$_oPContainer.append(oTemp);
        oTemp.find('div.ex-layout-sider').width(this.oOption.nWidth);
        this.$_oContainer = oTemp;
        this.oTreeContainer = this.$_oContainer.find(this.oOption.cTreeContainerSel);

        this.oTreeContainer.css({'margin-bottom':10,height:this.oOption.nHeight});

        this.oSearchInput = this.$_oContainer.find(this.oOption.cSearchInputSel);
        this.oSearvhBtn = this.$_oContainer.find(this.oOption.cSearchBtnSel);
        this.initSearchEvent();
        this.initTree();

        this.setParentEvent();

    },

    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.addListener(this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

        L.DomEvent.addListener(this.$_oContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);

    },


    show: function (oData) {
        if (this.$_oContainer) {
            this.$_oContainer.show();
        }
        else {

            this.initUI();
            this.$_oContainer.show();
        }

    },

    hide: function (oData) {
        if(!this.$_oContainer) {
            return;
        }
        this.$_oContainer.hide();
    },

    // 根据id重新初始化树
    clearTree: function () {
        this.oPopTree.uncheckAll();
        // 加载选择节点
        if (this.oTOption.cCheckUrl) {
            ES.getData({nRoleId: this.oBusData.RoleId}, this.oTOption.cCheckUrl, this.initCheck, this);
        }
    },

    initCheck: function (anPerm) {
        if (!anPerm || anPerm.length <= 0) {
            return;
        }
        this.oPopTree.uncheckAll();
        this.oPopTree.setCheckNode(anPerm);

    },

});

// 注册查询事件 高度控制由外层来完成
ES.CloudMap.BaseTreePanel.include({

    cHtml:
    '<div class="ex-maptool-box ex-maptool-box-white ex-maptool-property ec-padding-0">' +
    '   <div class="ex-layout-sider ex-theme-tree ec-fl"  >' +
    '       <h3 class="ex-theme-sider-title">' +
    '           <i class="ec-icon-sitemap"></i>&nbsp;{cTitle}' +

    '       </h3>' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group">' +
    '               <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字"> </input>' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>' +
    '               </span>' +
    '           </div>' +
    '       </div>' +
    '       <div class="ex-layout-struckbox-content" ></div>' +
    '   </div>' +
    '</div>',

    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {
            if (!self.oPopTree) {
                return;
            }
            var cSearchVal = self.oSearchInput.val();
            // 触发查询
            self.oPopTree.oTree.jstree(true).search(cSearchVal);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.oSearchInput.val();
                self.oPopTree.oTree.jstree(true).search(cSearchVal,false,true);
            }, 250);
        });
    },

    // 初始化树
    initTree: function () {
        var self = this;
        if (!this.oPopTree) {
            this.oPopTree = new ES.Common.JsTree(this._oParent,
                {cPContainer: this.oTreeContainer},
                this.oTOption);
            this.oPopTree.readyCallBack = function () {
                //self.drawNode();
            };
            this.oPopTree.refreshCallBack = function () {
                //self.drawNode();
            };
            this.oPopTree.selectCallBack = function (e, oNode) {
                self.selectDeal(oNode);
            }
        }
    },

    selectDeal: function (oNode) {
        if (!oNode || !oNode.node) {
            return;
        }

        // 如果是部门 就显示部门信息
        if(oNode.node.id ==='0' || oNode.node.id.indexOf('d_')===0) {

            // 请求后台 画所有的线路
            ES.Util.reqData({data: {deptId: oNode.node.id}, url: '/Line/GetLineInfo'}, function (oData) {

                this._oParent.fire('MapView:ShowLayer.DrawLayers', {aoData: oData.rtnData});

            }, this);

            return;
        }

        var oTemp = this.oPopTree.$_oTree.get_node(oNode.node.parent);
        oNode.node.parentText = oTemp.text;
        this._oParent.fire('CloudMap:EditTool.edit', {oNode: oNode.node});

    },

    getChildNode: function (oNode) {

        if (!oNode) {
            return;
        }

        var aoNode = [];

        if (!oNode.children_d || oNode.children_d.length <= 0) {
            return
        }
        for (var i = 0; i < oNode.children_d.length; i++) {
            var oTemp = this.oPopTree.$_oTree.get_node(oNode.children_d[i]);

            if (!oTemp.data) {
                continue;
            }
            aoNode.push(oTemp.data);
        }
        return aoNode;
    },
});
