/**
 * 弹出层的解决方案
 * 新增 修改
 * Created by liulin on 2017/9/1.
 */



// 新建工地接口，新建工地完成
ES.Common.Dialog =ES.Common.DialogEdit.extend({

    afterOpen:function( ) {
        var oParam = {
            url: '/Unload/Edit',
            data:   this.oBusData ,
            dataType: 'html',
            type:'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
        }, this);
    },

    save: function () {
        ES.loadAn($(this.oDialog.node));
        ES.getData($("#_UnloadFrm").serialize(),"/Unload/Edit",this.saveHandler,this);

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
// 详情页面
ES.Common.Detail = ES.Common.BaseDialog.extend({

    afterOpen: function (id) {
        var oParam = {
            url: '/Unload/detail',
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

