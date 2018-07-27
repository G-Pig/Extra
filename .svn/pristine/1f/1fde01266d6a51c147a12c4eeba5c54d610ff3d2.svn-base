/**
 * Created by Administrator on 2017/8/2.
 */

ES.CloudMap.DelWnd = ES.Common.DialogDel.extend({
    initOn: function () {
        this._oParent.on('CloudMap:DelCloudMap.del', this.del, this);
    },

    save: function () {
        if (!this.oBusData) {
            ES.aWarn(ES.Lang.BaseDialog[30]);
            return;
        }

        ES.loadAn($(this.oDialog.node));

        ES.getData({Id:this.oBusData.Id}, this.oOption.cUrl, this.saveHandler, this);
    },

    saveHandler: function (oData) {
        ES.removeAn($(this.oDialog.node));

        if (oData && oData.IsSuccess) {
            ES.aSucess(ES.Common.Lang[32]);

            this._oParent.fire('PostPosTreeView.reflesh');
            this._oParent.fire('CloudMap:EditTool.calEdit');
            this._oParent.addDrawToUI();
            this._oParent.clearLayers();
        }
        else {
            ES.aErr(ES.template(ES.Common.Lang[33], oData));
        }

        this.oDialog.close();
    },
    afterClose:function(){
        this._oParent.fire('CloudMap:BaseTool.removeActive');
    }

});