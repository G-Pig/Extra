/**
 *
 * 左边的树数据显示
 * Created by liulin on 2017/5/5.
 */

ES.Report.RouteLeftTree = ES.Report.LeftTree.extend({

    initialize: function (oParent, oOption,oTreeOption) {

        ES.Common.BaseTree.prototype.initialize.call(this,oParent, oOption,oTreeOption);


    },


    selectCallBack: function (e, oThisNode) {
        //var cId = oThisNode.node.id;


        //ES.getData({}, this.oOption.cUrl, this.getDataHandler, this);
        // 选中节点时
        this._oParent.fire('Report:RouteLeftTree.select',{oNode:oThisNode.node});

    },
    readyCallBack: function (e, oThisNode) {
        //this.readyCallBack();
        var inst = oThisNode.instance;
        var obj = inst.get_node(e.target.firstChild.firstChild.lastChild);

        inst.select_node(obj);
    },


});