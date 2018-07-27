/**
 * 左侧树
 * Created by liulin on 2017/9/1.
 */
ES.Muck.Tree = ES.Muck.LeftTree.extend({
    selectCallBack:function (e,node ) {

        if(node.node.id.indexOf("_")>=0){
            var Param = {CloudMapId: parseInt(node.node.id.slice(1,node.node.id.length)), Type: 2}
            this._oParent.echart.reset();
            this._oParent.echart.getMonitorData(Param);
            this._oParent.oGrid.query({oParam:Param});

            this._oParent.oLayer.getSiteId({acData:[node.node.data]});
        }

    },
    readyCallBack:function(e,node){
        //$('.ex-layout-struckbox-content').find('[id^="_"]>a').eq(0).trigger('click');
    },
    reload: function () {
        this.$_oTree.refresh();
    },
});