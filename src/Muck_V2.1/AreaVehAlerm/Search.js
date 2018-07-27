/**
 * Created by liulin on 2017/8/31.
 */

ES.Muck.Search = ES.Muck.BaseSearch.extend({
    initUI: function () {
        this.oSearchBtn =$('#VehicleInfoSearch');//查询按钮
        this.oExportBtn =$('#VehicleInfoExport');//导出按钮
        this.oNType = $('#nType');//选择时间类型
        this.acAreaId = "";
    },
    initEvent:function() {
        var self = this;

        // 注册查询事件
        this.oSearchBtn.bind('click', function (id) {
            ES.loadAn($('.ex-layout-main'));
            var treeNode = self._oParent.oTree.$_oTree.get_selected();
            var nType = $('#nType').val();
            // $.post("/Reports/GetAreaVehAlerm?nType="+nType+"&deptId="+treeNode+"&AlarmType=100", function (data) {
            //     $('#online_veh').text(data.online_veh);
            //     $('#online_veh_').text(data.online_veh_);
            //     $('#isFrontDoor').text(data.isFrontDoor_total);
            //     $('#OverSpeed').text(data.isOverSpeed_total);
            //     $('#OverWeight').text(data.isOverWeight_total);
            //     $('#Overline').text(data.isOverline_total);
            //     ES.removeAn($('.ex-layout-main'));
            // });
            var oParam = {
                deptId:treeNode.toString(),
                nType:nType,
                AlarmType:100
            };
            self._oParent.oGrid.query({oParam: oParam});
            self._oParent.initEchart(oParam);
        });
        //导出按钮
        this.oExportBtn.bind('click', function () {
            var treeNode = self._oParent.oTree.$_oTree.get_selected();
            var nType = $('#nType').val();
            var AlarmType;
            var iAlarmType = $('li.ec-active .item-data>p>b').attr('id');
            var nType = $('#nType').val();
            if(iAlarmType == "isFrontDoor"){AlarmType = 100}
            if(iAlarmType == "OverSpeed"){AlarmType = 106}
            if(iAlarmType == "OverWeight"){AlarmType = 101}
            if(iAlarmType == "Overline"){AlarmType = 107}
            window.location.href = "/Reports/AreaVehAlermExport?deptId=" +treeNode+
                "&nType=" + nType+"&AlarmType="+AlarmType;
        });
        //时间改变
        this.oNType.on('change',function(data){
            var nType = $('#nType').val();
            if(!nType){
                return;
            }
            if(nType == "2"){
                $('#showCurrentTime').html(timeData_2);
            }
            if(nType == "3"){
                $('#showCurrentTime').html(timeData_3);
            }
            if(nType == "4"){
                $('#showCurrentTime').html(timeData_4);
            }
            if(nType == "1"){
                $('#showCurrentTime').html("");
            }
        })
    },
});