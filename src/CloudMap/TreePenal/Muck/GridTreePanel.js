/**
 * Created by YangHang on 2017/10/17.
 */

ES.CloudMap.GridTreePanel = ES.CloudMap.BaseTreePanel.extend({
    selectDeal: function (oNode) {
        if (!oNode || !oNode.node) {
            return;
        }

        // 如果是部门 就显示部门信息
        if(oNode.node.id ==='0' || oNode.node.id.indexOf('_')!==0) {

            // 请求后台 画所有的线路
            ES.Util.reqData({data: {deptId: oNode.node.id}, url: '/Line/GetLineInfo'}, function (oData) {

                this._oParent.fire('MapView:ShowLayer.DrawLayers', {aoData: oData.rtnData});

            }, this);

            return;
        }else{
            var oTemp = this.oPopTree.$_oTree.get_node(oNode.node.parent);
            oNode.node.parentText = oTemp.text;
            this._oParent.fire('CloudMap:EditTool.edit', {oNode: oNode.node});
        }

    },

});
