/**
 * Created by liulin on 2017/8/31.
 */

ES.Muck.Search = ES.Muck.BaseSearch.extend({
    initUI: function () {
        this.oSearchBtn =$('#PermitSearch');//查询按钮
        this.oExportBtn =$('#PermitExport');//导出按钮
        this.oFormalPermit = $('#FormalPermit');//正式处置证办理
        this.oTemporaryPermit = $('#TemporaryPermit');//临时处置证办理
    },

    initEvent:function() {
        var self = this;

        // 注册查询事件
        this.oSearchBtn.bind('click', function () {

            var cSerialNum = $('#txt_serialNum').val();
            var cType = $('#txt_type').val() == "0" ? "" : parseInt($('#txt_type').val());
            var oParam = {
                SerialNum: cSerialNum,
                Type: cType,
            };
            // 触发查询
            self._oParent.oGrid.query({oParam: oParam});

        });

        //导出按钮
        this.oExportBtn.bind('click', function () {
            var omodelId = self._oParent.oGrid.gridData.dataList["0"].Id
            window.location.href = '/RemovalPermit/ExportPdf?id=' + omodelId;
        });
        //正式处置证办理
        this.oFormalPermit.bind('click',function(){
            var PermitId = $(this).attr('data-PermitId');
            window.top.oWebFrame.oMenuFrame.oFooter._oParent.fire('TabPanel.addPage', {cId:'+'+PermitId,cUrl:'/RemovalPermit/FormalPermit?CompanyId='+PermitId,cName:'正式处置证办理'});
            window.top.oWebFrame.oTabPanel._oParent.fire('TabPanel.addPage', {cId:'+'+PermitId,cUrl:'/RemovalPermit/FormalPermit?CompanyId='+PermitId,cName:'正式处置证办理'});
            // window.top.oWebFrame.fire('TabPanel.addPage',{cId:'+'+PermitId,cUrl:'/RemovalPermit/FormalPermit?CompanyId='+PermitId,cName:'正式处置证办理'});
        });
        //临时处置证办理
        this.oTemporaryPermit.bind('click',function(){
            var PermitId = $(this).attr('data-PermitId');
            window.top.oWebFrame.oMenuFrame.oFooter._oParent.fire('TabPanel.addPage', {cId:'-'+PermitId,cUrl:'/RemovalPermit/FormalPermit?CompanyId='+PermitId + '&Temp=true',cName:'临时处置证办理'});
            window.top.oWebFrame.oTabPanel._oParent.fire('TabPanel.addPage', {cId:'-'+PermitId,cUrl:'/RemovalPermit/FormalPermit?CompanyId='+PermitId + '&Temp=true',cName:'临时处置证办理'});
            //window.open('/RemovalPermit/FormalPermit?CompanyId='+PermitId + '&Temp=true');
            // window.top.oWebFrame.fire('TabPanel.addPage',{cId:'-'+PermitId,cUrl:'/RemovalPermit/FormalPermit?CompanyId='+PermitId + '&Temp=true',cName:'临时处置证办理'});

        });

    }
});