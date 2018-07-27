/**
 * Created by liulin on 2017/9/1.
 */

ES.Muck.Search = ES.Muck.BaseSearch.extend({

    initUI: function () {
        // 查询
        this.oSearchBtn =$('.ex-final-button>.ec-btn').eq(0);
        // 添加
        this.oEditBtn =$('.ex-final-button>.ec-btn').eq(1);
        //导出
        this.oExcelBtn =$('.ex-final-button>.ec-btn').eq(2);
    },

    initEvent:function() {
        var self = this;
        // 注册查询事件
        this.oSearchBtn.bind('click', function () {
            var name = $("#s_sitename").val();
            var workstart = $("#s_workstart").val();
            var workType = $("#slt_WorkType").val();
            var isUploading = $("#slt_isUploading").val();
            var oParam ={  Name: name, WorkTimeStart: workstart, WorkType:workType , IsUploading: isUploading};

            // 触发查询
            self._oParent.oGrid.query({oParam:oParam});

        });

        var oParent = self._oParent;
        this.oEditBtn.bind('click', function () {
            oParent.oEditD = new ES.Common.Dialog(oParent,{bRemove:true,cUrl:'/Site/PartialSelectSite'});
            oParent.oEditD.addShow();
        });

        this.oExcelBtn.bind('click', function () {
            self._oParent.oExpD = new ES.Common.Dialog(oParent,{bRemove:true,cUrl:'/Site/Edit'});
            self._oParent.exportExcel();
        });

    }

});