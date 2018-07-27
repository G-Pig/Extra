/**
 * 弹出层的解决方案
 * 新增 修改
 * Created by liulin on 2017/9/1.
 */
// 车辆详情
ES.Common.Detail = ES.Common.BaseDialog.extend({
    afterOpen: function (id) {
        var oParam = {
            url: '/Vehicle/Detail',
            data: this.oBusData,
            dataType: 'html',
            type: 'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
        }, this);
    },
    initButton: function () { }
});
//司机绑定
ES.Common.Bind = ES.Common.DialogEdit.extend({
    afterOpen: function (id) {
        var oParam = {
            url: '/Vehicle/Bind',
            data: this.oBusData,
            dataType: 'html',
            type: 'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
        }, this);
    },
    save: function () {
        ES.loadAn($(this.oDialog.node));
        ES.getData($("#frm_vehiclebind").serialize(), "/Vehicle/Bind", this.saveHandler, this);
    },

    saveHandler: function (oData) {
        var arr = new Array();
        $("input[ck_sitetype='2']").each(function () {
            var t = $(this);
            if (t.prop("checked")) {
                //arr.push({ RegionId: t.attr("rId"), SId: t.attr("sId") });
                arr.push(t.attr("sId"));
            }
        });
        ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
        if (oData.IsSuccess) {
            this._oParent.oGrid.query({ oParam: arr });
            this._oParent.oTree.reload();
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
// 车辆信息编辑
ES.Common.vehicleEdit = ES.Common.DialogEdit.extend({
    afterOpen: function (id) {
        var oParam = {
            url: '/Vehicle/Edit',
            data: this.oBusData,
            dataType: 'html',
            type: 'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
            if (this.oBusData != null) {
                $("#VehicleNo").attr("readonly", "readonly");
                $("#DeviceNo").attr("readonly", "readonly");
                $("#ResourceTypeName").attr("readonly", "readonly");
            }
        }, this);
    },
    save: function () {
        ES.loadAn($(this.oDialog.node));
        ES.getData($("#frm_vehicleedit").serialize(), "/Vehicle/Edit", this.saveHandler, this);
    },

    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
        if (oData.IsSuccess) {
            this._oParent.oGrid.query({});
            this._oParent.oTree.reload();
        }
    }
});