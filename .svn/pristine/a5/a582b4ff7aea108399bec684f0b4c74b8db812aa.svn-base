/**点击树*/
ES.Muck.Tree = ES.Muck.LeftTree.extend({
    selectCallBack:function (e, oNode) {
        var node = oNode.node;
        if(node.id.indexOf('_')>-1){
            this._oParent.fire('SiteGuard.getHtml',node);
        }else{
            return;
        }
    },
});