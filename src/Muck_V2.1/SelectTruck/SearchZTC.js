/**
 * Created by liulin on 2017/8/31.
 */

ES.SelectTruck.Search = ES.Muck.BaseSearch.extend({

    initUI: function () {
        this.oSearchVeh =$('#txt_vehNo');
        this.oSearchEnt =$('#txt_entName');
        this.oSearchBtn =$('.ex-grid-search');
    },

    initEvent:function() {
        var self = this;
        // 注册查询事件
        this.oSearchBtn.bind('click', function () {

            var cVeh =self.oSearchVeh.val();
            // var cEnt =self.oSearchEnt.val();
            var oParam = {
                VehicleNo: cVeh,
                // EnterpriseName :cEnt
            };
            // 触发查询
            self._oParent.oGrid.query({oParam: oParam});

        });

    }
});