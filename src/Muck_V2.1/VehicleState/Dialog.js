/**
 * 弹出层的解决方案
 * 新增 修改
 * Created by Eric_Fu on 2018-2-26.
 */
ES.Common.Detail = ES.Common.BaseDialog.extend({

    afterOpen: function (id) {
        var oParam = {
            url: '/VehicleState/Detail',
            data: this.oBusData,
            dataType: 'html',
            type: 'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
        }, this);
    },
    initButton:function(){}
});