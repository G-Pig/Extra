/**
 * Created by liulin on 2017/9/1.
 */

ES.Muck.Search = ES.Muck.BaseSearch.extend({

    initUI: function () {
        // 查询
        this.oSearchBtn =$('.ex-final-button>.ec-btn').eq(0);
        // 添加
        this.oAddBtn =$('.ex-final-button>.ec-btn').eq(1);
        // 导出
        //this.oExportBtn =$('.ex-final-button>.ec-btn').eq(2);

        this.acAreaId = "";
    },

    initEvent:function() {
        var self = this;
        // 注册查询事件
        this.oSearchBtn.bind('click', function () {

            var code  = $('#txt_VehicleNo').val();
             var oParam ={ Code: code};

            // 触发查询
            self._oParent.oGrid.query({oParam:oParam});

        });
        var oParent = self._oParent;
        this.oAddBtn.bind('click', function () {
            oParent.oEditD = new ES.Common.AddDialog(oParent,{bRemove:true,cUrl:'/WeighBridgeType/Edit'},{width:800});
            oParent.oEditD.addShow();
        });
    }

});