/**
 * Created by liulin on 2017/8/31.
 */

ES.Muck.Search = ES.Muck.BaseSearch.extend({

    initUI: function () {
        this.oSearchInput =$('#txt_vehicleNo');
        this.oSearvhBtn =$('.ex-grid-search');
    },

    initEvent:function() {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {

            var cSearchVal = self.oSearchInput.val();
            var oParam = {VehicleNo: cSearchVal};
            // 触发查询
            self._oParent.oGrid.query({oParam: oParam});

        });
    }
});