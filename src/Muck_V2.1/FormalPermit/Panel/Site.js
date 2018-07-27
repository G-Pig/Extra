/**
 * Created by YangHang on 2017/12/4
 */

// 基础菜单
ES.CloudMap.Site = ES.CloudMap.BaseItem.extend({
    initUI:function(){

        ES.CloudMap.BaseItem.prototype.initUI.call(this);

        this.$_input = $('#SelectSite');
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
            layers.MapY = this._oParent.oOption.HisData.SiteMapY;
            layers.MapX = this._oParent.oOption.HisData.SiteMapX;
            this.drawHislayer(layers);
            this.$_input.val(this._oParent.oOption.HisData.SiteName);
            this._oParent.oOption.save.SiteId = this._oParent.oOption.HisData.SiteId;
        }
    },
    setVal:function(oData){
        this.GridEditTool(oData);

        if(oData.data===null){
            return ;
        }else{
            this._oParent.oOption.save.SiteId = -oData.id;
            this.$_input.val(oData.text);
            $('.ex-cover-tree-select').hide().siblings('div').hide();
        }

        if($('#SelectSite').val()!==''&&$('#SelectUnload').val()!==''){
            this._oParent.oLine.$_oLi.find('.Line').removeAttr('disabled');
        }
    }

});