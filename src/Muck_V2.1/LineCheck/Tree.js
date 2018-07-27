/**
 * 左侧树
 * Created by liulin on 2017/9/1.
 */
ES.Muck.Tree = ES.Muck.LeftTree.extend({

    selectCallBack:function (e,node ) {
        var acAreaId = this.getSelfChildId(node.node);
        this._oParent.oGrid.query({oParam:{AreaIds:acAreaId}});
    }
});