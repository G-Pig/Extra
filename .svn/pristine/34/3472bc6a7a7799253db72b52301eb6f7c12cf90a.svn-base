/**
 * 负责加载grid数据
 *
 * Created by liulin on 2017/8/31.
 */

ES.Muck.Grid = ES.Common.BaseJqGrid.extend({
    initialize: function (oParent, oOption,oJqGridOption) {
        ES.setOptions(this, oOption);

        this._oParent = oParent;

        this.aoCol = [];
        this.setColumns();
        this.initOn();
        this.initUI();

        this._countUrl = oJqGridOption.countUrl;
        this.initCount("");

        this.oSearchInput = $('#form-event-type-name');
        this.oSearchBtn = $('#form-event-type-search');

        var self = this;
        ES.extend(
            this.oJqGridOption,
            oJqGridOption,
            {
                onSelectRow: function (cId, d, e) {
                    var record = $(this).data('oData').dataList[parseInt(cId) - 1];
                    self.initClick(e, record);
                },
                colModel: this.aoCol,
                pager: '#' + this.oOption.cPagerContainer,
                loadComplete: function (data) {
                    self.gridData = data;
                    //缓存数据到控件
                    $(this).data('oData', data);
                },
                gridComplete: function () {
                    $('.ec-btn-dropdown button').on('click', function (e) {
                        $(this).parents('tr.ui-widget-content').siblings('tr.ui-widget-content').find('.ec-dropdown-content').hide(200)
                        $(this).siblings().toggle('fast');
                        var self = $(this);
                        $("body").one("click", function () {//对document绑定一个影藏Div方法
                            self.siblings().hide(200);
                        });
                        e.stopPropagation();
                    })

                }
            });
        this.initEvent();
    },

    setColumns:function(){
       var list =  [
            { label: '车牌号', name: 'VehicleNo', editable: true ,width:60, align: 'center'},
            { label: '企业名称', name: '', editable: true,width:120, align: 'center' },
            { label: '所属区域', name: '', editable: true,width:60, align: 'center' },
            { label: '是否密闭', name: '', editable: true,width:100, align: 'center',
                formatter: function (val, opt, obj) {
                    if(val == 0){
                        return "是"
                    }else{
                        return "否"
                    }
                }
            },
            { label: '是否线路偏移', name: '', editable: true , align: 'center',
                formatter: function (val, opt, obj) {
                    if(val == 0){
                        return "是"
                    }else{
                        return "否"
                    }
                }
            },
            { label: '是否超速', name: '', editable: true, align: 'center' ,width:80,
                formatter: function (val, opt, obj) {
                    if(val == 0){
                        return "是"
                    }else{
                        return "否"
                    }
                }
            },
            { label: '是否超载', name: '', editable: true ,width:75, align: 'center',
                formatter: function (val, opt, obj) {
                    if(val == 0){
                        return "是"
                    }else{
                        return "否"
                    }
                }
            },
            {
                label: '操作',
                name: 'actions',
                width: 100,
                align: 'center',title: false,
                formatter: function (cellValue, options, rowObject) {
                    var content = '';
                    content += '<button  class="ec-btn ec-btn-xs ec-btn-default ec-radius view"' + VehnicleInfoAuth.vehnicleDetail + '><i class="ec-icon-eye view"></i>  详情</button>';
                    return content;
                }
            }
        ];

        this.aoCol = list;
    },

    initClick: function (e, oModel) {
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('view')) {
            this._oParent.oDetailD = new ES.Common.Detail(this._oParent, { bRemove: true, cUrl: '/VehicleState/Detail'},
                { title: '车辆详情 — 车牌号：'+oModel.VehicleNo }
                );
            this._oParent.oDetailD.showModal(oModel);
        }
    },
    initCount:function(ResourceTypeId){
            ES.getData({ResourceTypeIds:ResourceTypeId},this._countUrl,function(data){
            var CountItems = $('.ex-vehicle-classify>li>span');
            CountItems.eq(0).html(data.total);//车辆总数
            CountItems.eq(1).html(data.normal);//资质车辆
            CountItems.eq(2).html(data.never);//备案车辆
            CountItems.eq(3).html(data.expired);//资质过期
        })
    },
    resizeBody: function () {
        var self = this;
        $(window).resize(function () {
            $(self.oOption.cContainer).css("width", $(window).width() - $('.ex-layout-sider').width()+'px');
            $(self.oOption.cContainer).css({ height: $(window).height() });
            $('#' + self.oOption.cGridContainer).setGridWidth($(self.oOption.cContainer).width());
            $('#' + self.oOption.cGridContainer).setGridHeight($(self.oOption.cContainer).height() - $('.ex-vehicle-batch').height() - $('.ex-layout-form-search').height() - 85);
        });

    },
});



