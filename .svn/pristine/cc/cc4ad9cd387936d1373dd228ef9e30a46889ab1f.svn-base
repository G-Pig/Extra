/**
 * Created by YangHang on 2017/12/5.
 */


ES.CloudMap.PermitSelectTruck = ES.SelectTruck.Dialog.extend({
    initialize: function (oParent, oOption, oDOption) {

        //this.oGridOpt = oGridOpt;
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};

        this.initButton();

        this.initDialog();

        this.initEvent();

        this.initUI();
    },
    initUI: function () {

        // grid 查询
        this.oGrid = new ES.SelectTruck.Grid(this, {
            cContainer:'.ex-selcar-contet',
            cGridContainer:'dtTruckGridContainer_model',
            cPagerContainer:'dtTruckGridToolBarContainer_model'
        }, {multiselect:true,url:'/Vehicle/GetListByResourceTypeId',rowNum: 100000});

        var nW = 560;
        var nH = 386-38;

        this.oGrid.initGrid({ width: nW, height: nH});

        // 查询 控件
        this.oSearch = new ES.SelectTruck.Search(this, {});

        // 左边树结构
        this.oTree = new ES.SelectTruck.Tree(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/Enterprise/Tree',
                    type: 'GET',
                }
            },
            plugins: ['types', 'search', 'unique']
        });

    },
    showModal: function (oData,Vehicles) {
        this.oBusData = oData;
        this.data = Vehicles;
        this.oDialog.showModal();
    },
    afterOpen:function(){
        for (var i = 0; i < this.data.length; i++) {
            this.oGrid.appendUser(this.data[i].VehicleId, this.data[i].VehicleNo,this.data[i].Name,this.data[i].DeviceNo);
        }
    },
    save:function(){
        ES.loadAn($(this.oDialog.node));
        var VIds = [];
        var Vcontent = $(".ex-layout-selected-user").find('label>a');
        for(var i = 0;i<Vcontent.length;i++){
            var item = {};
            item.VehicleId = Vcontent.eq(i).attr('_uid');
            item.VehicleNo = Vcontent.eq(i).parent().html().split('<')[0].replace(/\s/g, "")
            VIds.push(item);
        }

        this.saveHandler(VIds);

    },
    saveHandler:function(oData){
        this._oParent.oOption.save.Vehicles = oData;
        ES.aSucess('选择成功');
        var content = '';
        $.each(oData,function(index,value){
            content += '<li data-id="'+ value.VehicleId +'">'+ value.VehicleNo +'</li>';
        });
        $('.ex-permit-vehicle-content').html(content);

        ES.removeAn($(this.oDialog.node));
        if (this.oOption.bRemove) {
            this.oDialog.remove();
        }
        else {
            this.oDialog.close();
        }
    }


});
