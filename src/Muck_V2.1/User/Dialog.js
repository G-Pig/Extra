/**
 * 弹出层的解决方案
 * 新增 修改
 * Created by liulin on 2017/9/1.
 */
ES.Common.Dialog =ES.Common.DialogEdit.extend({

    afterOpen:function(id) {
        var oParam = {
            url: '/User/Edit',
            data: {Id:  this.oBusData},
            dataType: 'html',
            type:'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
            $("#IsDel").attr("disabled", "disabled");
        }, this);
    },

    save: function () {
        ES.loadAn($(this.oDialog.node));
        ES.getData($("#frm_useredit").serialize(),"/User/Edit",this.saveHandler,this);

    },

    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oGrid.query({});
            this._oParent.oTree.reload();
        }
    },
});


ES.Common.DelEntity =ES.Common.DialogDel.extend({

    saveHandler: function (oData) {
        ES.Common.DialogDel.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oGrid.query({});
            this._oParent.oTree.reload();
        }
    },
});


ES.Common.RoleDialog =ES.Common.DialogEdit.extend({

    afterOpen:function(id) {
        var oParam = {
            url: '/User/Roles',
            data: {Id:  this.oBusData},
            dataType: 'html',
            type:'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
        }, this);
    },

    save: function () {
        ES.loadAn($(this.oDialog.node));


        var RId =$("#frm_usereditrole").serialize().replace(/RId=/g,'').split("&")
        for(var i = 0;i<RId.length;i++){RId[i] = parseInt(RId[i])};
        var nId = this.oBusData;

        var oParam = {RoleIds:RId,UserId:nId}


        ES.getData(oParam,"/User/SetRoles",this.saveHandler,this);

    },

    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oGrid.query({});
            this._oParent.oTree.reload();
        }
    },
    editShow: function (oData) {
        this.oBusData = oData;
        this.oDialog.title('用户角色编辑');

        this.oDialog.showModal();
    },
});

