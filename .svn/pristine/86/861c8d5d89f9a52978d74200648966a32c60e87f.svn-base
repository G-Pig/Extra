/**
 * 负责加载grid数据
 * Created by liulin on 2017/8/31.
 */
ES.Muck.Grid = ES.Common.BaseJqGrid.extend({
    setColumns: function () {
        var list = [
            { label: '车辆编号', name: 'ShortName', width: 60,sortable: false, align: 'center' },
            { label: '车牌号', name: 'VehicleNo', width: 100,sortable: false, align: 'center' },
            { label: '设备号', name: '_MainDeviceNo', width: 150,sortable: false, align: 'center' },
            //{ label: 'SIM卡号', name: '_MainDeviceSim', width: 150, align: 'center' },
            //{ label: '服务号', name: '_MainServiceNum', width: 150, align: 'center' },
            { label: '企业名称', name: 'ResourceTypeName', width: 200, sortable: false,align: 'center' },
            {
                label: '保险到期时间', name: 'InsureTime', width: 120, sortable: false, align: 'center', sortable: false,
                formatter: function (val, opt, item) {
                    var content = '';
                    var shell = item.ExpireTimeStatu;
                    if (shell == 1) {
                        content += '<label class = Weak style="color:red">' + item.ExpireTime + '</lable>';
                    }
                    else if (shell == "0" && item.ExpireTime != null) {
                        content += '<label class = Weak style="color:write">' + item.ExpireTime + '</lable>';
                    }
                    return content;
                }
            },
            {
                label: '年检截止时间', name: 'EndTime', width: 120, sortable: false, align: 'center', sortable: false,
                formatter: function (val, opt, item) {
                    var content = '';
                    var shell = item.FinalTimeStatu;
                    if (shell == 1) {
                        content += '<label class = Weak style="color:red">' + item.FinalTime + '</lable>';
                    }
                    else if (shell == "0" && item.ExpireTime != null) {
                        content += '<label class = Weak style="color:write">' + item.FinalTime + '</lable>';
                    }
                    return content;
                }
            },
            //{ label: '车辆品牌', name: 'DeviceBrandStr', width: 120, align: 'center' },
            //{ label: '道路运营许可证号', name: 'TransportBusiness', width: 120, align: 'center' },
            // { label: '资质状态', name: 'TransportBusiness', width: 120, align: 'center' },
            // { label: '是否安装设备', name: 'TransportBusiness', width: 120, align: 'center' },
            {
                label: '操作',title: false, name: "Id", align: "center", 100: 120, sortable: false,
                formatter: function (val, opt, item) {
                    var content = '';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-primary bind"' + VehnicleInfoAuth.vehnicleBind + '><i class="ec-icon-edit bind"></i>  绑定司机</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-primary edit"' + VehnicleInfoAuth.vehnicleEdit + '><i class="ec-icon-edit edit"></i>  编辑</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-default detail"' + VehnicleInfoAuth.vehnicleDetail + '><i class="ec-icon-eye detail"></i>  详情</button>';

                    return content;
                }
            }
        ];
        this.aoCol = list;
    },
    gridComplete: function () {
        afterCompleteFunction();
    },
    initClick: function (e, oModel) {
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('edit')) {
            this._oParent.oEditD = new ES.Common.vehicleEdit(this._oParent, { bRemove: true, cUrl: '/Vehicle/Edit' }, { title: "车辆信息编辑" });
            this._oParent.oEditD.editShow(oModel);
        }
        if ($(e.target).hasClass('detail')) {
            this._oParent.oDetailD = new ES.Common.Detail(this._oParent, { bRemove: true, cUrl: '/Vehicle/Detail'}, { title: "车辆详情" });
            this._oParent.oDetailD.showModal(oModel);
        }
        if ($(e.target).hasClass('bind')) {
            var url = "/Vehicle/bind?id="+oModel.Id;

            loadAnimate($("body"), null);
            $.get(url, function (resp) {
                frmWin = dialog({
                    resizable: true,
                    dragable: true,
                    title: "绑定司机",
                    content: resp,
                    okValue: "确定",
                    ok: function (resp) {

                        var arr = new Array();
                        $("input[ck_sitetype='2']").each(function () {
                            var t = $(this);
                            if (t.prop("checked")) {
                                //arr.push({ RegionId: t.attr("rId"), SId: t.attr("sId") });
                                arr.push(t.attr("sId"));
                            }
                        });
                        $.post("/Vehicle/bind?id=" + oModel.Id, { Time: $("#hid_edit_time").val(), SIds: arr },
                            function (resp) {
                                if (resp.IsSuccess) {
                                    $.ExBox.success("车辆司机绑定成功", function () {
                                        frmWin.remove();
                                    });
                                }
                                else {
                                    $.ExBox.error(resp.Message);
                                }
                                frmWin.remove();
                            });
                        return false;
                    },
                    cancelValue: '取消',
                    cancel: function () { }
                });
                frmWin.showModal();
                loadAnimate(null, "remove");
            });
        }
    }
});
function afterCompleteFunction() {
    //获取列表数据
    var ids = $("#dtGridContainer").jqGrid("getDataIDs");
    var rowDatas = $("#dtGridContainer").jqGrid("getRowData");
    for (var i = 0; i < ids.length; i++) {
        var rowData = rowDatas[i];
        $("#" + ids[i] + " td").css("background-color", "pink");
    }
    return true;
}




