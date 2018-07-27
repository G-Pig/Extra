/**
 * 弹出层的解决方案
 * 新增 修改
 * Created by liulin on 2017/9/1.
 */



// 新建工地接口，新建工地完成
ES.Common.Dialog =ES.Common.DialogEdit.extend({

    afterOpen:function(id) {
        var oParam = {
            url: '/Department/Edit',
            data: this.oBusData,
            dataType: 'html',
            type:'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
            var CloudMapIDs_1 = "";
            if ($("#CloudMapIDs_1").val()) {
                CloudMapIDs_1 = $("#CloudMapIDs_1").val().split(",");
            }
            var CloudMapIDs = $("#CloudMapIDs").val(CloudMapIDs_1);
            $("#CloudMapIDs").trigger("chosen:updated");
        }, this);
    },
    save: function () {
        ES.loadAn($(this.oDialog.node));
        // ES.getData($("#frm_departmentedit").serialize(), "/Department/Edit", this.saveHandler, this);
        var CloudMapIDs = "";
        if ($("#CloudMapIDs").val() != null)
        {
            if ($("#CloudMapIDs").val().length > 0)
            {
                CloudMapIDs =  $("#CloudMapIDs").val().join(",");
            }
        }
        var nId = this.oBusData == null ? 0 : this.oBusData.Id;
        var submitData = {
            "Id":this.oBusData==null?0: nId,
            "Name": $("#Name").val(),
            "ShortName": $("#ShortName").val(),
            "ParentName": $("#ParentName").val(),
            "ParentId": $("#ParentId").val(),
            "Contacts": $("#Contacts").val(),
            "ContactsTel": $("#ContactsTel").val(),
            "Remark": $("#Remark").val(),
            "SortId": $("#SortId").val(),
            "TagName": $("#TagName").val(),
            "TagId": $("#TagId").val(),
            "DepartRole": $("#DepartRole").val(),
            "CloudMapIDs": CloudMapIDs,
        };
        ES.getData(submitData, "/Department/Edit", this.saveHandler, this);
    },

    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oGrid.query({});
            this._oParent.oTree.reload();
        }
    },
});

// 删除工地界面js，删除完成
ES.Common.DelEntity =ES.Common.DialogDel.extend({

    saveHandler: function (oData) {
        ES.Common.DialogDel.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oGrid.query({});
            this._oParent.oTree.reload();
        }
    },
});
