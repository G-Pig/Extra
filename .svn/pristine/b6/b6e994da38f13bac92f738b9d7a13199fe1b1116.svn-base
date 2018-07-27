/**
 * Created by liulin on 2017/8/31.
 */

ES.Muck.Search = ES.Muck.BaseSearch.extend({
    initUI: function () {
        this.oSearchBtn =$('#VehicleInfoSearch');//查询按钮
        this.oExportBtn =$('#VehicleInfoExport');//导出按钮
        this.acAreaId = "";
    },

    initEvent:function() {
        var self = this;

        // 注册查询事件
        this.oSearchBtn.bind('click', function () {

            var cSearchVal = $('#txt_vehicleNo').val();
            var cSearchType = $('#searchType').val()=="0"?0:$('#searchType').val();
            var oParam = {
                VehicleNo: cSearchVal,
                SearchType:cSearchType
            };
            // 触发查询
            self._oParent.oGrid.query({oParam: oParam});
            //查询渲染状态栏数据

        });

        //导出按钮
        this.oExportBtn.bind('click', function () {
            var cSearchVal = $('#txt_vehicleNo').val();
            var cSearchType = $('#searchType').val()=="0"?0:$('#searchType').val();
            var cDate = new Date().toLocaleDateString().replace(/\\/g, "-");

            window.location.href = "文件导出的地址?" +cSearchVal+
                "&SearchType=" + cSearchType +
                "&Date=" + cDate
        });
    },
});