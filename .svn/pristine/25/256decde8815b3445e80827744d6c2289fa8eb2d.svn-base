/**
 * 负责加载grid数据
 *
 * Created by liulin on 2017/8/31.
 */

ES.AnnualSurvey.Grid = ES.Common.BaseJqGrid.extend({

    setColumns:function(){
        if(this.oOption.Import){
            var list =  [

                { label: '车辆ID', name: 'Id', align: 'center', width: 60, hidden:true},
                { label: '车牌号', name: 'VehicleNo', align: 'center', width: 40 },
                // { label: '原所属企业', name: 'Name', align: 'center', width: 60 },
                //  { label: '现所属企业', name: 'Name', align: 'center', width: 60 },
                { label: '所属企业', name: 'CompanyName', align: 'center', width: 80 },
                { label: '所属区域', name: 'DistName', align: 'center', width: 60 },
                { label: '最近变更时间', name: 'CheckDate', align: 'center', width: 60 },
                { label: '年度扣分', name: '', align: 'center', width: 30 },
                //{ label: '不在线总时长', name: '', align: 'center', width: 60 },
                { label: '资质状态', name: 'Flag2', align: 'center', width: 40 },

            ];
        }else{
            var list =  [

                { label: '车辆ID', name: 'Id', align: 'center', width: 60, hidden:true},
                { label: '车牌号', name: 'VehicleNo', align: 'center', width: 40 },
                // { label: '原所属企业', name: 'Name', align: 'center', width: 60 },
                //  { label: '现所属企业', name: 'Name', align: 'center', width: 60 },
                { label: '所属企业', name: 'CompanyName', align: 'center', width: 80 },
                { label: '所属区域', name: 'DistName', align: 'center', width: 60 },
                { label: '最近变更时间', name: 'CheckDate', align: 'center', width: 60 },
                { label: '年度扣分', name: '', align: 'center', width: 30 },
                //{ label: '不在线总时长', name: '', align: 'center', width: 60 },
                { label: '资质状态', name: 'Flag', align: 'center', width: 40 },
                { label: '备注', name: 'Remark', align: 'center', width: 30 },
            ];
        }


        this.aoCol = list;
    },

    initClick: function (e, oModel,checked) {
        if (!e) {
            return;
        }
    },
    initGrid: function (oOpt) {
        var self = this;
        ES.extend(
            this.oJqGridOption,
            {
                onSelectAll: function (cId, d, e) {
                    //选择车辆
                    for (var i = 0; i < cId.length; i++) {
                        var record = $(this).data('oData').dataList[i];
                        if(record.Id===0){
                            self.oJqGrid.jqGrid("setSelection", parseInt(cId[i]),false);
                        }else{
                            self.gridCheck(record,d);
                        }
                    }
                },
                onSelectRow: function (cId, d, e) {
                    //选择车辆
                    var record = $(this).data('oData').dataList[parseInt(cId) - 1];
                    if(record.Id===0){
                        self.oJqGrid.jqGrid("setSelection", parseInt(cId),false);
                    }else{
                        self.gridCheck(record,d);
                    }
                },
                colModel: this.aoCol,
                pager: '#' + this.oOption.cPagerContainer,
                loadComplete: function (xhr) {
                    self.gridData = xhr;
                    //缓存数据到控件
                    $(this).data('oData', xhr);

                    //添加开始
                    var list = xhr;
                    var selUsers = self.getSelectUsers();
                    $('#' + self.oOption.cGridContainer).jqGrid("resetSelection");//这行很重要
                    for (var i = 0; i < list.dataList.length; i++) {
                        var data = list.dataList[i];
                        for (var j = 0; j < selUsers.length; j++) {
                            var user = selUsers[j];
                            if (user.id == data.Id) {
                                $('#' + self.oOption.cGridContainer).jqGrid("setSelection", (i + 1), true);
                                break;
                            }
                        }
                    }
                    //添加结束

                    //加载查询按钮数量
                    for(var key in xhr.userdata){
                        $('.ex-selcar-contet-type>ul').find('.'+key).html(xhr.userdata[key]);
                    }


                }
            });
        ES.extend(this.oJqGridOption, oOpt);
        this.oJqGrid = $('#' + this.oOption.cGridContainer).jqGrid(this.oJqGridOption);

    },
    //获取已选中车辆[{name:xx,id:1}]
    getSelectUsers:function () {
        var $u = $(".ex-layout-selected-user label");
        var arr = [];
        $u.each(function () {
            arr.push({ name: $(this).text().replace(" ×", ""), id: $(this).find("a").attr("_uid") });
        });
        return arr;
    },
    //右侧添加车辆
    appendUser:function (id, name,company,DeviceNo) {
        var self = this;
        var $label = $("<label> " + name + " <a class=\"ec-close ec-close-alt  ec-close-spin\" _uid=\"" + id + "\"  _company = \""+ company +"\" _deviceNo = \""+ DeviceNo +"\">&times;</a></label>");
        $(".ex-layout-selected-user").append($label);
        this.oOption.addUserCount++
        $('.ex-theme-sider-title.model>span').html(this.oOption.addUserCount);
        $label.click(function () {
            $(this).remove();
            var userid = $(this).find("a").attr("_uid");
            var rowids = $('#' + self.oOption.cGridContainer).jqGrid("getDataIDs");
            for (var i = 0; i < rowids.length; i++) {
                var rowdata = $('#' + self.oOption.cGridContainer).jqGrid("getRowData", rowids[i]);
                if (rowdata.Id == userid) {
                    $('#' + self.oOption.cGridContainer).jqGrid("setSelection", rowids[i], false);
                    break;
                }
            }
            self.oOption.addUserCount--
            $('.ex-theme-sider-title.model>span').html(self.oOption.addUserCount);
        });
    },

    //点击checkbox发生操作
    gridCheck : function (oModel, checked) {
        var $aa = $(".ex-layout-selected-user").find("a[_uid='" + oModel.Id + "']");
        if (checked) {
            if ($aa.length == 0) {
                this.appendUser(oModel.Id, oModel.VehicleNo,oModel.Name,oModel.DeviceNo);
            }
        }
        else {
            if ($aa.length > 0) {
                $aa.parent("label").remove();
                this.oOption.addUserCount--;
                $('.ex-theme-sider-title.model>span').html(this.oOption.addUserCount);
            }
        }
    },
    resizeBody:function(){

    },

});



