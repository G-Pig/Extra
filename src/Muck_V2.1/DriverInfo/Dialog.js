/**
 * 弹出层的解决方案
 * 新增 修改
 * Created by liulin on 2017/9/1.
 */
ES.Common.Dialog = ES.Common.DialogEdit.extend({

    afterOpen: function (id) {
        var oParam = {
            url: '/DriverInfo/Edit',
            data: { Id: this.oBusData },
            dataType: 'html',
            type: 'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);

        }, this);
    },

    save: function () {
        ES.loadAn($(this.oDialog.node));
        var self = this;
        $("#frm_driveredit").ajaxSubmit({
            success: function (str) {
                self.saveHandler(str);
            },
            error: function (error) { alert(error); },
            url: '/DriverInfo/Edit', /*设置post提交到的页面*/
            type: "post", /*设置表单以post方法提交*/
            dataType: "json" /*设置返回值类型为文本*/
        });
    },

    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
        if (oData.IsSuccess) {
            this._oParent.oGrid.query({});
        }
    }
});



ES.Common.DelEntity = ES.Common.DialogDel.extend({

    saveHandler: function (oData) {
        ES.Common.DialogDel.prototype.saveHandler.call(this, oData);
        if (oData.IsSuccess) {
            this._oParent.oGrid.query({});
        }
    }
});


ES.Common.EditTreeDia = ES.Common.DialogTree.extend({

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


    afterOpen: function () {
        this.initTreeUI();
        this.initTree();
        this.initSearchEvent();
    },

    // 点击确定时触发
    save: function () {

        ES.loadAn($(this.oDialog.node));

        // 回调保存接口
        var anId = this.getTreeCheckNode();
        var nId = this.oBusData.Id;



        //获取到选取的Id
        ES.getData({}, this.oOption.cUrl, this.saveHandler, this);

    },
    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.$_oSearchBtn.bind('click', function () {
            if (!self.$_oTree) {
                return;
            }
            var cSearchVal = self.$_oSearchInput.val();
            // 触发查询
            self.$_oTree.search(cSearchVal, false, true);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.$_oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.$_oSearchInput.val();
                self.$_oTree.search(cSearchVal, false, true);
            }, 250);
        });
    },
});



