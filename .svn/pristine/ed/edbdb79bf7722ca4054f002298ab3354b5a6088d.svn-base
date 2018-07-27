/**
 * 左侧树
 * Created by liulin on 2017/9/1.
 */
ES.Muck.Tree = ES.Muck.LeftTree.extend({
    selectCallBack: function (e, oNode) {
        var DeptIds=[];
        if(oNode.node.children_d.length!=0){
            for(var i=0;i<oNode.node.children_d.length;i++){
                DeptIds.push(oNode.node.children_d[i]);
            }
            DeptIds.push(oNode.node.id)
        }else{
            DeptIds.push(oNode.node.id)
        }
        this._oParent.DeptIds = DeptIds;
        var oParam = {
            DeptIds:DeptIds,
            // VehicleNo:$('#VehicleNo').val(),
            BeginTime:$('#startDate').val(),
            EndTime:$('#endDate').val(),
        }
        this._oParent.oGrid.query({oParam:oParam});
    },
    reload: function () {
        this.$_oTree.refresh();
    },
});