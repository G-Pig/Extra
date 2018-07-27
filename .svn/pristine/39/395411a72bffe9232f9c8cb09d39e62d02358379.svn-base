/**
 * Created by liulin on 2017/9/4.
 */

ES.Common.Dialog =ES.Common.BaseDialog.extend({

    afterOpen: function (id) {
        var oParam = {
            url: '/Line/SelectSiteUnload',
            data: {},
            dataType: 'html',
            type: 'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
        }, this);
    },

    save: function () {
        this.oOption.fnCallBack.call(this.oOption.oContext, {
            oSite: $('#SiteName').data('data'),
            oUnload: $('#UnloadName').data('data'),
        });

        if (this.oOption.bRemove) {
            this.oDialog.remove();
        }
        else {
            this.oDialog.close();
        }
    },


});