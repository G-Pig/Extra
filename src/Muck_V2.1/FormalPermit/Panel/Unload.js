/**
 * Created by YangHang on 2017/12/4
 */

// 基础菜单
ES.CloudMap.Unload = ES.CloudMap.BaseItem.extend({
    cHtml:
    '<div class="ex-permit-step-item">' +
    '<label for="form-dateStart" class="ec-u-sm-3 ec-form-label ec-padding-0 ec-text-left"><span class="ec-text-danger">(*)</span> 消纳点：</label>'+
    '   <div class="ec-form-group ec-cf">' +
    '       <div class="ec-u-sm-9 ec-padding-left-0 ec-input-group ec-margin-bottom-lg">' +
    '           <input type="text" name="form-email" id="SelectUnload" placeholder="请选择消纳点" class="ec-form-field ec-radius ec-input-sm">' +
    // '           <span class="ec-input-group-btn">' +
    // '               <button class="ec-btn ec-btn-default ec-btn-sm" type="button" style="width:75px;">画消纳点</button>' +
    // '           </span>' +
    '</div></div></div>',

    initUI:function(){

        ES.CloudMap.BaseItem.prototype.initUI.call(this);

        this.$_input = $('#SelectUnload');
        this.oUnloadSelectTree = new ES.Common.SelectTreeNode(this, {
            cBandSel: this.$_input
        }, this.oOption.oTreeOption);
        this.oUnloadSelectTree.on('selectVal', this.setVal, this);
        this.hisDraw();
    },
    //历史绘制
    hisDraw:function(){
        //如果进去存在历史
        if(this._oParent.oOption.Edit == 'true'){
            var layers = {};
            layers.MapY = this._oParent.oOption.HisData.UnloadMapY;
            layers.MapX = this._oParent.oOption.HisData.UnloadMapX;
            this.drawHislayer(layers);
            this.$_input.val(this._oParent.oOption.HisData.UnloadName);
            this._oParent.oOption.save.UnloadId = this._oParent.oOption.HisData.UnloadId;
        }
    },
    setVal:function(oData){
        this.GridEditTool(oData);
        if(oData.data===null){
            return ;
        }else{
            this._oParent.oOption.save.UnloadId = -oData.id;
            this.$_input.val(oData.text);
            $('.ex-cover-tree-select').hide().siblings('div').hide();
        }
        if($('#SelectSite').val()!==''&&$('#SelectUnload').val()!==''){
            this._oParent.oLine.$_oLi.find('.Line').removeAttr('disabled');
        }
    }

});


