/**
 *  面的操作
 *
 * Created by liulin on 2018/3/22.
 */
ES.SelectArea={};

// 弹出面选择界面
ES.SelectArea.Dialog =  ES.Common.BaseDialog.extend({

    oOption: {
        cPContainer: '.ex-layout-main',
        nMapWidth: 680,
        nMapHeight: 500,

    },

    // 设置界面的html参数
    oUIConfig: {
        // 地图容器名称id
        AreaSelectId: 'AreaSelect',
        dept: '组织架构',
        selectArea: '已选对象',
        mapId: 'AreaMap',

    },

    initialize: function (oParent, oOption, oUIConfig) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);

        var oDOption = {content: ES.template(this.cHtml, this.oUIConfig),title:'选择电子边界'};

        ES.extend(this.oDOption, oDOption);

        // 注册监听事件
        this.initOn();
        this.initUI();
        // 监听窗体事件
        this.initEvent();
    },

    initUI: function () {
        this.initButton();
        this.initDialog();
        this.initMap();
        this.initTree();

        this.oRoadLayer = new ES.SelectArea.Layer(this, {});

        // 选择框的数据集合
        this.selectBox = $('#' + this.oUIConfig.AreaSelectId).find('.ex-layout-selected-road');
    },

    // 初始化窗体
    initDialog: function () {

        var oDiaLog = dialog(this.oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },

    // 初始化地图部分
    initMap: function () {
        var nMapWidth = this.oOption.nMapWidth;
        var nMapHeight = this.oOption.nMapHeight;

        this.oMapMaster = new L.MapLib.MapMaster.Map(this, {
            cDidId: this.oUIConfig.mapId,
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

        this._oMap = this.oMapMaster.getMap();
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

    initTree: function () {

        // 左边树结构
        this.oTree = new ES.SelectArea.Tree(this, {cContainer: '#' + this.oUIConfig.AreaSelectId}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/CloudMap/CloudMapTreeByMapType?MapType=1',
                    type: 'GET',
                }
            },
            plugins: ['types', 'search', 'unique', 'checkbox'],
            checkbox: {
                tie_selection: false
            },
        });
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

    appendRoad: function (data) {
        if (!data)return;

        var content = "";

        var items = this.selectBox.find('label');
        var ids = [];
        for (var i = 0; i < items.length; i++) {
            var Id = parseInt($(items[i]).attr('cid'));
            ids.push(Id)
        }
        var self = this;
        $.each(data, function (i, oNode) {

            var oData = oNode.data;
            if (!oData || !oData.Id) {
                return;
            }
            if ($.inArray(oData.Id, ids) < 0) {
                content += ES.template(self.cItemHtml, oData);
            }

        });


        this.selectBox.append(content)

    },

    removeRoad: function (aoData) {

        if (!aoData) {
            return;
        }
        for (var i = 0; i < aoData.length; i++) {
            if (!aoData[i].data || !aoData[i].data.Id) {
                continue;
            }

            this.selectBox.find('label[cid="' + aoData[i].data.Id + '"]').remove();
        }
    },

    // 确定后返回值到界面中
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

ES.SelectArea.Dialog.include({

    // item 数据
    cItemHtml:
    '<label cid="{Id}" style="width:  90%; position: relative"><span>{Name}</span> ' +
    //'   <a class="ec-btn ec-btn-sm" style="position: absolute;right: 10px;line-height: 7px;" >&times;</a>' +
    '       <a class="ec-close ec-close-alt  ec-close-spin" style="position: absolute;right: 10px" >×</a>'+
    '</label>',

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