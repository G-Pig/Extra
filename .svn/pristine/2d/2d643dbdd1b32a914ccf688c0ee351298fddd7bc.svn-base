/**
 * 弹出层的解决方案
 * 新增 修改
 * Created by liulin on 2017/9/1.
 */
//消息的详情
ES.Common.MessageDetail = ES.Common.BaseDialog.extend({
    afterOpen: function (id) {
        var oParam = {
            url: '/Message/Edit',
            data: { Id: this.oBusData == null ? null : this.oBusData.Id },
            dataType: 'html',
            type: 'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
            if (this.oBusData != null) {
                $("#Content").val(this.oBusData.Content);
                if(this.oBusData.ReceiveNames){
                    var ReceiveNames = this.oBusData.ReceiveNames.replace(/,/g, " ");
                }else{
                    var ReceiveNames = this.oBusData.ReceiveUserName.replace(/,/g, " ");
                }
                $("#RfName").val(ReceiveNames);
                //var RfName = $("#RfName").val();
                $("#Content").attr("readonly", "readonly");
                $(".addProgram").hide();
            }
        }, this);
    },
    initButton: function () { }
});
//Send Messages
ES.Common.Dialog = ES.Common.DialogEdit.extend({
    afterOpen: function (id) {
        var oParam = {
            url: '/Message/Edit',
            data: { Id: this.oBusData == null ? null : this.oBusData.Id },
            dataType: 'html',
            type: 'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
            if (this.oBusData != null) {
                $("#Content").val(this.oBusData.Content);
                var ReceiveNames = this.oBusData.ReceiveNames.replace(/,/g, " ");
                $("#RfName").val(ReceiveNames);
                //var RfName = $("#RfName").val();
                $("#Content").attr("readonly", "readonly");
                $(".addProgram").hide();
            }
        }, this);
    },
    save: function () {
        ES.loadAn($(this.oDialog.node));
        //var VIds = $("#RfId").val();
        var psDta = { content: $("#Content").val(), users: VIds };
        ES.getData(psDta, "/Message/AddMessSend", this.saveHandler, this);
    },
    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
        if (oData.IsSuccess) {
            var gType = parseInt($('.ex-rule-tab>li.active').attr('data-index'));
            var oParam = { Type: gType };
            this._oParent.oGrid.query({ oParam: oParam });
        }
    },
    editShow: function (oData) {
        this.oBusData = oData;
        this.oDialog.title('详情');
        this.oDialog.showModal();
    },
});
//Delete Message
ES.Common.DelEntity = ES.Common.DialogDel.extend({
    saveHandler: function (oData) {
        ES.Common.DialogDel.prototype.saveHandler.call(this, oData);
        if (oData.IsSuccess) {
            var gType = parseInt($('.ex-rule-tab>li.active').attr('data-index'));
            var oParam = { Type: gType };
            if (oData.ReturnCode == "1") {
                this._oParent.oGrid.query({ oParam: oParam });
            }
            if (oData.ReturnCode == "2") {
                this._oParent.oGrid_recive.query({ oParam: oParam });
            }
        }
    }
});