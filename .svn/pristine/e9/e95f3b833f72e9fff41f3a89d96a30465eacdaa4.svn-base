//选择树
ES.Common.SelectTreeNodeW = ES.Common.SelectTreeNode.extend({
    cHtml:
    '<div class="ex-tree-select">' +
    '   <div class="ec-input-group">' +
    '       <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">' +
    '       <span class="ec-input-group-btn">' +
    '       <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button">' +
    '           <span class="ec-icon-search"></span>' +
    '       </button>' +
    '       </span>' +
    '   </div>' +
    '   <div class="ex-layout-struckbox-content ex-tree-dom" style="width:260px"></div>' +
    '</div>',

})
ES.Muck.Tree = ES.Muck.LeftTree.extend({
    selectCallBack: function (e, oNode) {
        var self = this,DepartmentIds=[];
        if (oNode.node.parents.length < 2) {
            for (var i = 0; i < oNode.node.children_d.length; i++) {
                var id = oNode.node.children_d[i];
                DepartmentIds.push(id);
            }
            for (var i = 0; i < oNode.node.children.length; i++) {
                var id = oNode.node.children[i];
                DepartmentIds.push(id);
            }
        } else {
            DepartmentIds.push(parseInt(oNode.node.id.replace("s", "")));
            for (var i = 0; i < oNode.node.children_d.length; i++) {
                var id = oNode.node.children_d[i];
                if (id.indexOf("s") > -1) {
                    DepartmentIds.push(parseInt(id.replace("s", "")));
                }
            }
        }
        this._oParent.oGrid.query({oParam:{DepartmentIds:DepartmentIds}});
    },
    reload: function () {
        this.$_oTree.refresh();
    },
});