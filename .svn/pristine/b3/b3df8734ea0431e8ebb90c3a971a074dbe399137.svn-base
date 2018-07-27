/**
 * 左侧树
 * Created by liulin on 2017/9/1.
 */
ES.Muck.Tree = ES.Muck.LeftTree.extend({
    selectCallBack:function (e,node ) {
        var self = this;
        if(node.node.data.type!==6){
            if( node.node.parent == "#" ){
                this._oParent.oGrid.query({oParam:{CompanyIds:""}});
            }else{
                var _ids = node.node.children.concat(node.node.id);
                this._oParent.oGrid.query({oParam:{CompanyIds:_ids}});
            }
            $('#FormalPermit,#TemporaryPermit').removeAttr('data-PermitId').removeAttr('data-PermitName');
            $('.ex-permit-batch').height(0);
        }else{
            this._oParent.oGrid.query({oParam:{CompanyIds:[node.node.id]}});
            $('#FormalPermit,#TemporaryPermit').attr({'data-PermitId':node.node.id,'data-PermitName':node.node.text});
            $('.ex-permit-batch>label span.NewCompany').html(node.node.text);
            $('.ex-permit-batch').height(44);
        }

        setTimeout(function(){
            $('#dtGridContainer').setGridWidth($('.ex-layout-content').width());
            $('#dtGridContainer').setGridHeight($('.ex-layout-content').height() - $('.ex-permit-batch').height() - $('.ex-layout-form-search').height() - 85);

        },300)

    }
});