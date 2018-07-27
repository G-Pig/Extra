/**
 * Created by YangHang on 2017/12/4
 */

// 基础菜单
ES.CloudMap.Vehicle = ES.CloudMap.BaseItem.extend({
    cHtml:
    '<div class="ex-permit-step-item">'+
    '   <fieldset class="ex-box-title ec-margin-0">'+
    '       <legend align="center">绑定车辆</legend>'+
    '   </fieldset>'+
    '   <div class="ex-permit-step-vehicle">'+
    '       <a class="ec-btn ec-btn-primary ec-btn-block ec-btn-sm Select">添加绑定车辆</a>'+
    '       <ul class="ex-permit-vehicle-content ec-avg-sm-3">'+
    '       </ul>'+
    '   </div>'+
    '</div>',
    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this._oPage = oParent._oParent;

        this._oMap = this._oPage.getMap();
        this._oDrawLayer = L.featureGroup();
        this._oDrawLayer.addTo(this._oMap);

        this.$_oLi = null;
        this.oPen = null;


        this.initUI();
        this.hisDraw();
        this.initOn();

    },
    initOn:function(){

        ES.CloudMap.BaseItem.prototype.initOn.call(this);
        var self = this;
        // if(this._oParent.oOption.HisData == undefined){
        //     this.Vehicles = this._oParent.oOption.save.Vehicles;
        // }else{
        //     this.Vehicles = this._oParent.oOption.save.Vehicles = this._oParent.oOption.HisData.Vehicles;
        // }


        $('.Select').bind('click',function(){
            var content = $('.ex-permit-vehicle-content li');
            self.Vehicles = [];
            for(var i = 0 ;i<content.length;i++){
                self.Vehicles.push({VehicleId:content.eq(i).attr('data-id'),VehicleNo:content.eq(i).html()})
            }

            self.oConfigD = new ES.CloudMap.PermitSelectTruck(self._oParent,
                {bRemove:true},
                { title: "添加绑定车辆"});
            self.oConfigD.showModal(self._oParent.oOption.PermitId,self.Vehicles);
        });
    },
    hisDraw:function(){
        if(this._oParent.oOption.Edit == 'true'){
            var oData = this._oParent.oOption.HisData.Vehicles;
            this._oParent.oOption.save.Vehicles = oData;
            var content = '';
            $.each(oData,function(index,value){
                content += '<li data-id="'+ value.VehicleId +'">'+ value.VehicleNo +'</li>';
            });
            $('.ex-permit-vehicle-content').append(content);
        }
    }
});