/**
 * 左侧树
 * Created by liulin on 2017/9/1.
 */
ES.Muck.Tree = ES.Muck.LeftTree.extend({
    selectCallBack:function (e,node ) {
        var self = this;
        if(node.node.data.type!==6){
            if( node.node.parent == "#" ){
                this._oParent.oGrid.query({oParam:{ResourceTypeIds:""}});
                this._oParent.oGrid.initCount("");
                this._oParent.oSearch.acAreaId = "";
            }else{
                var _ids = node.node.children.concat(node.node.id);
                this._oParent.oGrid.query({oParam:{ResourceTypeIds:_ids}});
                this._oParent.oGrid.initCount(_ids);
                this._oParent.oSearch.acAreaId = _ids;
            }
            $('#AnnualSurvey,#AnnualSurveyImport,#BatchAssigned,#BatchApproval').removeAttr('data-ResourceId').removeAttr('data-ResourceName');
            $('.ex-vehicle-batch').height(0);
        }else{
            this._oParent.oGrid.query({oParam:{ResourceTypeIds:[node.node.id]}});
            this._oParent.oGrid.initCount(node.node.id);
            $('#AnnualSurvey,#AnnualSurveyImport,#BatchAssigned,#BatchApproval').attr({'data-ResourceId':node.node.id,'data-ResourceName':node.node.text});
            $('.ex-vehicle-batch>label span.NewCompany').html(node.node.text);
            $('.ex-vehicle-batch').height(44);
            this._oParent.oSearch.acAreaId = [node.node.id];
        }

        setTimeout(function(){
            $('#dtGridContainer').setGridWidth($('.ex-layout-content').width());
            $('#dtGridContainer').setGridHeight($('.ex-layout-content').height() - $('.ex-vehicle-batch').height() - $('.ex-layout-form-search').height() - 85);

        },300)

    },
    reload: function () {
        //this.oTree.data('jstree', false).empty().jstree(this.oTreeOption);
        this.$_oTree.refresh();
    },
});