/**
 * 树加载对象
 * 选择车辆接口，也可以导入车辆接口
 * 对应的 html 为 selectTruckTpl.csHtml
 * Created by liulin on 2017/8/31.
 *
 *  ！！！线路绑车  规则绑车 ！！！两个页面同用一个js模块，但是得更换地址  TODO 有提醒注释
 */

ES.SelectRoad = {};

ES.SelectRoad.Dialog = ES.Evented.extend({

    initialize: function (cId, oOption, oDOption) {

        //this.oGridOpt = oGridOpt;
        this.cId = cId;
        ES.setOptions(this, oOption);
        this.oDOption = oDOption;

        this.initButton();

        this.initDialog();

        this.initUI();

        this.selectBox = $('.ex-layout-selected-road');

        this.initEvent();
    },

    // 初始化 dialog
    initDialog: function () {

        var  oDOption={
            fixed: true,
            align: 'right bottom',
            title: this.oDOption.title,
            content: ES.Util.template($('#selectRoadTpl').html(), { divSelectTruck: 'divVeh' }),
        };
        ES.extend(oDOption,this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },

    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },

    // 初始画界面对象
    initUI: function () {

        var nMapWidth = 620;
        var nMapHeight = 430;

        this.oMapMaster = new L.MapLib.MapMaster.Map(this, {
            cDidId: 'RoadModelMap',
            oMapOption: {
                zoomControl: false,
                layers: [],
                center: new L.LatLng(27.344276, 103.723296),
                zoom: 9,
                attributionControl: false,
            },
            nMapWidth: nMapWidth,
            nMapHeight: nMapHeight,
        });

        this.oMapMaster.loadMapMaster();

        this.oMapMaster.reflesh(nMapWidth, nMapHeight);


        // 左边树结构
        this.oTree = new ES.SelectRoad.Tree(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/CloudMap/LineTree',
                    type: 'GET',
                }
            },
            plugins: ['types', 'search', 'unique','checkbox'],
            'checkbox': {
                'tie_selection': false
            },
        });

        this.oRoadLayer =  new ES.SelectRoad.RoadLayer(this,{},this.oMapMaster);

    },

    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen();
            }

        });

        this.oDialog.addEventListener('close',function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });

        this.selectBox.on('click','label',function(){
            var id = $(this).attr('cid');
            self.fire('RoadTree:fitBounds',{cid:id})
        });

        this.selectBox.on('click','label>a',function(e){
            var id = ['_'+parseInt($(this).parent().attr('cid'))];

            self.oTree.$_oTree.uncheck_node(id);
            e.stopPropagation()
        })

    },

    initButton: function () {
        var self = this;
        var aoButton = [
            {
                value: ES.Lang.BaseDialog[1],
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
            {
                value: ES.Lang.BaseDialog[2],
                callback: function () {
                    if (self.oOption.bRemove) {
                        this.remove();
                    }
                    else {
                        this.close();
                    }
                    return false;
                }
            }
        ];
        this.oDOption.button = aoButton;
    },

    afterOpen:function() {
        var ids=[];
        var items = $('.ex-layout-selected-roadlist').find('label');
        for(var i = 0;i<items.length;i++){
            var id = '_'+items.eq(i).attr('cid');
            ids.push(id);
        }
        this.oTree.oTree.on('loaded.jstree',function(e, data){
            var inst = data.instance;
            inst.check_node(ids);
        })
    },

    appendRoad: function(data){
        if(!data)return;
        //var limit =
        var content = "";

        var items = this.selectBox.find('label');
        var ids = [];
        for(var i=0;i<items.length;i++){
            var id = parseInt($(items[i]).attr('cid'));
            ids.push(id)
        }
        var self = this;
        $.each(data, function (i, oNode) {

            var oData = oNode.data;
            if (!oData || !oData.Id) {
                return;
            }
            if ($.inArray(oData.Id, ids) < 0) {
                oData.cSpeed = !oData.speed ? '' : '<b>' + oData.speed + '</b>';
                content += ES.template(self.cItemHtml, oData);
            }

        });


        this.selectBox.append(content)

    },

    removeRoad:function(aoData){
        if(!aoData ||aoData.length<=0) {
            return;
        }

        for (var i = 0; i < aoData.length; i++) {
            if (!aoData[i].data || !aoData[i].data.Id) {
                continue;
            }
            var removeId = parseInt(aoData[i].data.Id);
            this.selectBox.find('label[cid="' + removeId + '"]').remove();
        }

    },

    save: function () {
        var items = this.selectBox.find('label');
        var saveContent = '';
        for(var i=0;i<items.length;i++){
            var id = $(items[i]).attr('cid');
            var name = $(items[i]).find('span').html();
            saveContent+='<label cid="'+ id +'"> '+ name +' </label>'
        }

        $('.ex-layout-selected-roadlist').html(saveContent);

        if (this.oOption.bRemove) {
            this.oDialog.remove();
        }
        else {
            this.oDialog.close();
        }
    },
});

ES.SelectRoad.Dialog.include({

    // item 数据
    cItemHtml:
    '<label cid="{Id}"> {cSpeed} <span>{Name}</span> <a class="ec-btn ec-btn-sm">&times;</a></label>',

    //这个弹出层的html
    cHtml:
    '<div style="width:1100px; display:inline-block; margin:-.5rem;border-bottom: 1px solid #ddd;" id="{AreaSelectId}"> ' +
    '    <div class="ex-selcar-sider left" style="width: 240px;height: 500px">' +
    '        <fieldset class="ec-u-sm-12 ex-box-title">' +
    '            <legend><i class="ec-icon-sitemap"></i>&nbsp;{dept}</legend>' +
    '        </fieldset>' +

    '        <div class="ex-layout-struckbox-search">' +
    '            <div class="ec-input-group">' +
    '                <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">' +
    '                <span class="ec-input-group-btn">' +
    '                     <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>' +
    '                </span>' +
    '            </div>' +
    '        </div>' +
    '        <div class="ex-layout-struckbox-content left-tree" ></div>' +
    '    </div>' +
    '    <div class="ex-selcar-contet" style="height:500px;">' +
    '        <div class="ex-model-road-map" id="{mapId}"></div>' +
    '    </div>' +
    '    <div class="ex-selcar-sider right" style="height: auto;  border-left: 1px solid #ddd;">' +
    '        <fieldset class="ec-u-sm-12 ex-box-title">' +
    '            <legend><i class="ec-icon-user"></i>&nbsp;{selectArea}</legend>' +
    '        </fieldset>' +
    '        <div class="ex-layout-selected-user ex-layout-selected-road" ' +
    '             style="top: 20px;margin-top: 20px;overflow-y: auto;height: 480px;width: 178px;"> </div>' +
    '    </div>' +
    '</div>',

});

