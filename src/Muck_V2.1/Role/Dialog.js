/**
 * 弹出层的解决方案
 * 新增 修改
 * Created by liulin on 2017/9/1.
 */




ES.Common.Dialog =ES.Common.DialogEdit.extend({

    afterOpen:function(id) {
        var oParam = {
            url: '/Role/Edit',
            data: {Id:  this.oBusData},
            dataType: 'html',
            type:'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
        }, this);
    },

    save: function () {
        ES.loadAn($(this.oDialog.node));
        ES.getData($("#frm_roleedit").serialize(),"/Role/Edit",this.saveHandler,this);

    },

    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oGrid.query({});
        }
    }
});



ES.Common.DelEntity =ES.Common.DialogDel.extend({

    saveHandler: function (oData) {
        ES.Common.DialogDel.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oGrid.query({});
        }
    }
});


ES.Common.EditTreeDia =ES.Common.DialogTree.extend({

    cHtml:
    '<div style="padding-left:30px;" class = "{cContentCls}"> ' +
    '       <div class="ex-layout-struckbox-search">  ' +
    '          <div class="ec-input-group"> ' +
    '               <input type="text" class="ec-form-field ex-tree-search-ipt ex-tree-search-ipt-1" placeholder="请输入关键字"> ' +
    '                   <span class="ec-input-group-btn"> ' +
    '                       <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn ex-tree-search-btn-1" type="button"> ' +
    '                           <span class="ec-icon-search"></span>' +
    '                       </button>  ' +
    '                   </span>  ' +
    '           </div>  ' +
    '       </div>  ' +
    '       <div class="ex-layout-struckbox-content-1" style="height: 300px;overflow: auto;"></div>  ' +
    '   </div>',


    afterOpen: function () {
        this.initTreeUI();
        this.initTree();
        this.initSearchEvent();
    },

    // 点击确定时触发
    save: function () {

        ES.loadAn($(this.oDialog.node));

        // 回调保存接口
        var anId = this.getTreeCheckNode();
        var nId = this.oBusData.Id;



        //获取到选取的Id
        //Id、ModuleId、RoleId、
        ES.getData({ permissionIds: anId ,roleId:nId}, this.oOption.cUrl, this.saveHandler, this);

    },
    getTreeCheckNode: function () {
        // 获得所有选中的数组
        var aoNodeId = this.$_oTree.get_checked();
        var thisTree = this.$_oTree;
        var newRolePermission = [];
        //for (var i = 0; i < aoNodeId.length; i++) {

        //  newRolePermission.push({ ModuleId: getParent, BtnIds: getChildrenDom, BtnStrs: getNodeData })
        // }
        // 获得所有选中的数组
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var btnIds = [];
        //三级节点的ID
        for (var i = 0; i < aoNodeId.length; i++) {
            if (!aoNodeId[i]) {
                continue;
            }
            if (aoNodeId[i].indexOf("_") > 0 || thisTree.is_leaf(aoNodeId[i])) {
                btnIds.push(aoNodeId[i])
            }

        }
        if (!btnIds || btnIds.length <= 0) {
            return [];
        }
        var nId = this.oBusData.Id;
        var bBtnIds = [];
        for (var i = 0; i < btnIds.length; i++) {
            var getParent = thisTree.get_parent(btnIds[i]).toString();
            var getNodeData = thisTree.get_node(btnIds[i]).data;
            if (getNodeData) {
                getNodeData.toString();
            }
            bBtnIds.push(btnIds[i]);
            newRolePermission.push({ BtnStrs: getNodeData, BtnIds: btnIds[i], ModuleId: getParent, roleId: nId })
        }
        var newMap = {};
        var newArr = [];
        for (var i = 0; i < newRolePermission.length; i++) {
            var di = newRolePermission[i];
            var n = di.ModuleId;
            var b = di.BtnStrs;
            if (!newMap[n]) {
                newMap[n] = di.BtnIds;
                newMap[b] = di.BtnStrs;
                newArr.push(di);
            } else {
                for (var j = 0; j < newArr.length; j++) {
                    var aj = newArr[j];
                    if (aj.ModuleId == n) {
                        aj.BtnIds += "," + di.BtnIds;
                        aj.BtnStrs += "," + di.BtnStrs;
                        break;
                    }
                }
            }
        }
        return newArr

    },
    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.$_oSearchBtn.bind('click', function () {
            if (!self.$_oTree) {
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
});



