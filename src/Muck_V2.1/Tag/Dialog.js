/**
 * 弹出层的解决方案
 * 新增 修改
 * Created by liulin on 2017/9/1.
 */
ES.Common.Dialog =ES.Common.DialogEdit.extend({

    afterOpen:function(id) {
        var oParam = {
            url: '/Tag/Edit',
            data: {Id:  this.oBusData},
            dataType: 'html',
            type:'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
            if ($("#Id").val()) {
                if ($("#Name_1") == null) {
                    $("#Name_1").attr("readonly", "readonly");
                } else {
                    $("#Name_2").attr("readonly", "readonly");
                }
            }

        }, this);
    },

    save: function () {
        ES.loadAn($(this.oDialog.node));
        ES.getData($("#frm_TagEdit").serialize(),"/Tag/Edit",this.saveHandler,this);

    },

    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oGrid.query({});
        }
    }
});

ES.Common.DelEntity =ES.Common.DialogDel.extend({

    saveHandler: function (oData) {
        ES.Common.DialogDel.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oGrid.query({});
        }
    }
});

ES.Common.FileDig =ES.Common.DialogDel.extend({
    afterOpen:function(id) {

    },
    del: function (oData) {
        this.oBusData = oData;
        this.hideFooter();
        this.oDialog.showModal();
    }
});
