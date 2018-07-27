/**
 * Created by YangHang on 2018/2/26.
 */



ES.MapView.TabPanel.FenceTreeView = ES.MapView.TabPanel.DeptTreeView.extend({

    checkCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cCheckEventName,{acId:this.getCheckId(),acData:this.getCheckData(this.getCheckId())});
    },
    getCheckData:function(acId){
        if (!acId || acId.length <= 0) {
            return;
        }
        var Data = [];
        for (var i = 0; i < acId.length; i++) {
            if(acId[i]<0||acId[i].indexOf("_") >= 0){
                var _data=this.$_oTree.get_node(acId[i]).data;
                _data.icon = this.$_oTree.get_node(acId[i]).icon.split(" ")[1];
                Data.push(_data);
            }
        }
        return Data;

    },
    checkAllCallBack:function(){
        this._oPage.fire(this.oOption.cCheckEventName,{acId:this.getCheckId(),acData:this.getCheckData(this.getCheckId())});
    },
    uncheckAllCallBack:function(){
        this._oPage.fire(this.oOption.cUncheckEventName, {acId:this.getCheckId(), acUncheckId: this.getSelfChildId(oNode.node)});
    },
    readyCallBack:function () {
        // this.checkAll();
        // this.checkCallBack();
    },
});