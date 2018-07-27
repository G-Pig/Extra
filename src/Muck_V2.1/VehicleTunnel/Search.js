/**
 * Created by liulin on 2017/8/31.
 */
ES.Muck.Search = ES.Muck.BaseSearch.extend({
    initUI: function () {
        this.oSearchBtn =$('#SearchBtn');//查询按钮
        this.oExportBtn =$('#ExportBtn');//导出按钮
        this.oStartDate = $('#startDate');//选择时间
        this.oEndDate = $('#endDate');//选择时间
        this.oVehicleNo = $('#VehicleNo');//车牌号
        this.oSpeed = $('#Speed');//速度
        this.oType = $('#goType');//往返类型
    },
    initEvent:function() {
        var self = this;
        // 注册查询事件
        this.oSearchBtn.bind('click', function (id) {
            if(self._oParent.DeptIds){
                var treeNode = self._oParent.DeptIds;
            }else{
                var treeNode = []
            }
            // var treeNode = self._oParent.oTree.$_oTree.get_selected();
            var oParam = {
                Speed:self.oSpeed.val(),
                VehicleNo:self.oVehicleNo.val(),
                BeginTime:self.oStartDate.val(),
                EndTime:self.oEndDate.val(),
                DeptIds:treeNode,
                Type:self.oType.val()
            };
            self._oParent.oGrid.query({oParam: oParam});
        });
        //时间控件
        var cDate = new Date().toLocaleDateString().replace(/\//g, "-");
        this.oStartDate.val(cDate + " 00:00:00");
        this.oEndDate.val(cDate + " 23:59:59");
        this.oStartDate.click(function () {
            WdatePicker({
                dateFmt: "yyyy-MM-dd HH:mm:ss",
                isShowClear: false,
                maxDate:"%y-%M-%d"
            });
        });
        this.oEndDate.click(function () {
            WdatePicker({
                dateFmt: "yyyy-MM-dd HH:mm:ss",
                isShowClear: false,
                maxDate:"%y-%M-%d"
            });
        });
        //导出按钮
        // this.oExportBtn.bind('click', function () {
        //     var treeNode = self._oParent.oTree.$_oTree.get_selected();
        //     window.location.href = "/Reports/AreaVehAlermExport?deptId=" +treeNode+ "&StartDate=" + self.oStartDate.val()+"&Speed="+self.oVehicleNo.val();
        // });
    },
});