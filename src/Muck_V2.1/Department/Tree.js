/**
 * 左侧树
 * Created by liulin on 2017/9/1.
 */
ES.Muck.Tree = ES.Muck.LeftTree.extend({

    // 选择节点触发
   // selectCallBack:function (e,node ) {

        //this._oParent.oGrid.query({oParam:{ResourceTypeId:node.node.id}});
   // }
    readyCallBack: function () {
        this.checkAll();
    },
    checkCallBack: function (e, oNode) {
        this._oParent.oGrid.query({ oParam: { DepartmentIds: this.getCheckId() } });
    },
    checkAllCallBack: function (e, oNode) {
        this._oParent.oGrid.query({ oParam: { DepartmentIds: this.getCheckId() } });
    },
    uncheckCallBack: function (e, oNode) {
        this._oParent.oGrid.query({ oParam: { DepartmentIds: this.getCheckId() } });
    },
    reload: function () {
        this.$_oTree.refresh();
    },
});