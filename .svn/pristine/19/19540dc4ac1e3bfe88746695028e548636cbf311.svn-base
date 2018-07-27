/**
 * 左侧树
 * Created by liulin on 2017/9/1.
 */
ES.SelectTruck.Tree = ES.Common.BaseTree.extend({

    initUI: function () {

        this.$_oContainer = $('#divVeh');
        this.$_oTreeContainer = this.$_oContainer.find('.ex-layout-struckbox-content.left-tree');
        this.$_oSearchInput = this.$_oContainer.find('.ex-tree-search-ipt');
        this.$_oSearchBtn = this.$_oContainer.find('.ex-tree-search-btn');
        this.$_oContainer.find('h3').html(this.oOption.cTitle);
    },
    selectCallBack:function (e,node ) {
        var acAreaId = this.getSelfChildId(node.node);
        this._oParent.oGrid.query({oParam:{ResourceTypeIds:acAreaId,VehicleNo:'',ResourceTypeName:''}});
        $('#txt_vehNo').val('');
        $('#txt_entName').val('');
    },
    readyCallBack:function(e,node){
        $('.ex-layout-struckbox-content.left-tree').find('[aria-level="1"]>a').trigger('click');
    }

});