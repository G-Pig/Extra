/**
 * 弹出层的解决方案
 * 新增 修改
 * Created by liulin on 2017/9/1.
 */




ES.Common.Dialog =ES.Common.DialogEdit.extend({

    afterOpen:function(id) {
        var oParam = {
            url: '/ContractManager/Edit',
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
        ES.getData($("#frm_contractManagerEdit").serialize(),"/ContractManager/Edit",this.saveHandler,this);

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

        var upload = $('#CMFile').AmazeuiUpload({
            url: 'UpLoadRefImage?Id='+this.oBusData,
            downloadUrl: 'GetContractManagerFileList?Id='+this.oBusData,
            downloadFileUrl: 'DownLoadFile',
            deleteUrl: 'ContractFileDelete',
            maxFiles: 50, // 单次上传的数量
            maxFileSize: 20, // 单个文件允许的大小 (M)
            multiThreading: false, // true为同时上传false为队列上传
            useDefTemplate: true, //是否使用表格模式
            dropType: false, //是否允许拖拽
            pasteType: false //是否允许粘贴
        });

        ES.getData({ Id: this.oBusData },"GetContractManagerFileList",function(data){ upload.setResult(data)});


    },
    del: function (oData) {
        this.oBusData = oData;
        this.hideFooter();
        this.oDialog.showModal();
    }
});


ES.Common.EditTreeDia =ES.Common.DialogTree.extend({

    cHtml:
    '<div style="padding-left:30px;" class = "{cContentCls}"> ' +
    '       <div class="ex-layout-struckbox-search">  ' +
    '          <div class="ec-input-group"> ' +
    '               <input type="text" class="ec-form-field ex-tree-search-ipt ex-tree-search-ipt-1" placeholder="请输入关键字"> ' +
    '                   <span class="ec-input-group-btn"> ' +
    '                       <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn ex-tree-search-btn-1" type="button"> ' +
    '                           <span class="ec-icon-search"></span>' +
    '                       </button>  ' +
    '                   </span>  ' +
    '           </div>  ' +
    '       </div>  ' +
    '       <div class="ex-layout-struckbox-content-1" style="height: 300px;overflow: auto;"></div>  ' +
    '   </div>',

    // 点击确定时触发
    save: function () {

        ES.loadAn($(this.oDialog.node));

        // 回调保存接口
        var anId = this.getTreeCheckNode();
        var nId = this.oBusData.RoleId;

        ES.getData({ roleId: nId,resourceTypeIds: anId,permissionIds:anId}, this.oOption.cUrl, this.saveHandler, this);

    }


});



