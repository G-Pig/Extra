/**
 * Created by liulin on 2017/9/1.
 */

ES.Muck.Search = ES.Muck.BaseSearch.extend({

    initUI: function () {
        this.oSearchInput =$('#txt_name');
        // 查询
        this.oSearchBtn =$('.ex-final-button>.ec-btn').eq(0);
        // 添加
        this.oAddBtn =$('.ex-final-button>.ec-btn').eq(1);
        // 导出
        this.oExpBtn =$('.ex-final-button>.ec-btn').eq(2);
    },

    initEvent:function() {
        var self = this;
        // 注册查询事件
        this.oSearchBtn.bind('click', function () {
            var name = $("#s_sitename").val();
            //var workstart = $("#s_workstart").val();
            //var workend = $("#s_workend").val();
            var startState = $("#State").val();
            var oParam ={ Name: name,     State: startState };
            // 触发查询
            self._oParent.oGrid.query({oParam: oParam});

        });

        this.oAddBtn.bind('click', function () {
            self._oParent.oEditD = new ES.Common.Dialog(self._oParent,{bRemove:true,cUrl:'/Unload/Edit'});
            self._oParent.oEditD.addShow();
        });

        this.oExpBtn.bind('click', function () {
            self._oParent.oEditD = new ES.Common.Dialog(self._oParent,{bRemove:true,cUrl:'/Unload/Edit'});
            self._oParent.oEditD.exportExcel();
        });
    },

});