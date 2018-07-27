/**
 * Created by yanghang on 2017/9/1.
 */


ES.Muck.SelectTruckPhoto = ES.SelectTruck.Dialog.extend({
    afterOpen:function(id) {
        var pageVInfo = [];
        var pageVcontent = $(".ex-photoWall-carList-panel>ul").find('li.ex-PW-carList-item');
        for(var i = 0;i<pageVcontent.length;i++){
            var carInfo = {};
            carInfo.Name = pageVcontent.eq(i).find('h3').text();
            carInfo.Id = pageVcontent.eq(i).find('h3').attr('_cid');
            carInfo.Company = pageVcontent.eq(i).find('.car-company').text();
            carInfo.DeviceNo = pageVcontent.eq(i).find('h3').attr('_deviceNo');
            pageVInfo.push(carInfo);
        }

        for (var i = 0; i < pageVInfo.length; i++) {
            this.oGrid.appendUser(pageVInfo[i].Id, pageVInfo[i].Name,pageVInfo[i].Company,pageVInfo[i].DeviceNo);
        }

    },
    save:function(){
        ES.loadAn($(this.oDialog.node));
        var VInfo = [];
        var Vcontent = $(".ex-layout-selected-user").find('label>a');
        for(var i = 0;i<Vcontent.length;i++){
            var carInfo = {};
            carInfo.Name = Vcontent.eq(i).parent().text().replace(' ×','');
            carInfo.Id = Vcontent.eq(i).attr('_uid');
            carInfo.Company = Vcontent.eq(i).attr('_company');
            carInfo.DeviceNo = Vcontent.eq(i).attr('_deviceNo');
            VInfo.push(carInfo);
        }
        $('.ex-PW-carList-add').hide();
        $('.ex-photoWall-carList-panel').show();
        this.saveThing(VInfo);
        this.saveHandler({IsSuccess:true})
    },
    saveThing:function(data){
        var deviceNos =[];
        var listHtml = "";
        $.each(data,function(i,v){
            listHtml += '<li class="ex-PW-carList-item">' +
                '<h3 _cid = "'+v.Id+'" _deviceNo = "'+v.DeviceNo+'">'+v.Name +'</h3>' +
                '<p class="car-company">'+ v.Company +'</p>' +
                '<a class="car-delete">×</a>' +
                '</li>';
            deviceNos.push(v.DeviceNo);
        });
        $('.ex-photoWall-carList-panel>ul').html(listHtml);
        //生成图片
        var startTime = $('#start_Photo').val();
        var endTime = $('#end_Photo').val();
        var oParam = {
            PhoneNums:deviceNos,
            ExtenstionName:0,
            PageIndex:1,
            PageSize:20,
            StartTime:startTime,
            EndTime:endTime,
        };
        new ES.Muck.PhotoList(this,oParam);
    },
    saveHandler: function(oData){
        ES.removeAn($(this.oDialog.node));
        //var oData = oTemp.oData;
        var bAdd = false;
        if(!oData) {
            ES.aErr(ES.Lang.BaseDialog[34]);
            return;
        }

        if (oData.IsSuccess) {
            $('.ex-grid-search-main').trigger('click');

            if (this.oOption.bRemove) {
                this.oDialog.remove();
            }
            else {
                this.oDialog.close();
            }
        }
        else {

            ES.aErr('操作失败: {message}', oData);
        }
    }
});