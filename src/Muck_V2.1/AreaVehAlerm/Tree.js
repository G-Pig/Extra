/**
 * 左侧树
 * Created by liulin on 2017/9/1.
 */
ES.Muck.Tree = ES.Muck.LeftTree.extend({
    selectCallBack: function (e, oNode) {
        ES.loadAn($('.ex-layout-main'));
        var deptId = oNode.node.id;
        var nType = $("#nType").val();
        var oParam = {
            deptId:deptId,
            nType:nType,
            AlarmType:100
        }
        this._oParent.oGrid.query({oParam:oParam});
        this._oParent.initEchart(oParam);

        //this._oParent.oSearch.acAreaId = node.node.id;
        // $.post("/Reports/GetAreaVehAlerm?nType="+nType+"&deptId="+deptId+"&AlarmType=100", function (data) {
        //     $('#online_veh').text(data.online_veh);
        //     $('#online_veh_').text(data.online_veh_);
        //     $('#isFrontDoor').text(data.isFrontDoor_total);
        //     $('#OverSpeed').text(data.isOverSpeed_total);
        //     $('#OverWeight').text(data.isOverWeight_total);
        //     $('#Overline').text(data.isOverline_total);
        //     ES.removeAn($('.ex-layout-main'));
        // });
    },
    reload: function () {
        this.$_oTree.refresh();
    },
});