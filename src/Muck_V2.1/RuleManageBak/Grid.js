/**
 * 负责加载grid数据
 *
 * Created by liulin on 2017/8/31.
 */

ES.Muck.Grid = ES.Common.BaseJqGrid.extend({
    setColumns:function(){
       var list =  [
            //{ label: '角色ID', name: 'RoleId', align: 'center', width: 40 },
            { label: '规则名称', name: 'Name', align: 'center', width: 100 },
            // { label: '规则生效时间', name: 'BeginDate', align: 'center', width: 120 },
            // { label: '规则结束时间', name: 'EndDate', align: 'center' , width: 120},
            { label: '规则属性', name: 'OffSetValue', align: 'center', width: 100,
                formatter: function (cellValue, options, rowObject) {
                   var content ='';
                   switch(rowObject.Type){
                       case 1:
                           content+=' 线路偏移值: '+cellValue+' 米';
                           break;
                       case 2:
                           content+=' 禁入偏移值: '+cellValue+' 米';
                           break;
                       case 3:
                           content+=' 禁出偏移值: '+cellValue+' 米';
                           break;
                       case 4:
                           content+=' 超速界限: '+cellValue+' km/h';
                           break;
                       case 5:
                           content+=' 路段限速: '+cellValue+' km/h';
                           break;
                       case 6:
                           content+=' 禁入偏移值: '+cellValue+' 米';
                           break;
                       default:
                           content+=' 禁出偏移值: '+cellValue+' 米';
                           break;
                   }
                   return content;
                }
            },
            {
                label: '关联项目', name: 'RfName', align: 'center', width: 100,
                formatter:function(val,opt,itm){
                    var content = '';
                    content += '<button class="ec-btn ec-radius ec-btn-xs ec-btn-default itemDetail"' + AlarmRuleAuth.alarmruledetail + '><i class="ec-icon-book itemDetail"></i> 详情</button>';
                    return content;

                }
            },
            {
                label: "操作",
                name: "actions",
                align: 'center',
                width: 100,title: false,
                formatter: function formatHtml(cellValue, options, rowObject) {

                    var content = '';
                    if(rowObject.Type === 5){
                        content+= '<button class="ec-btn ec-radius ec-btn-xs ec-btn-success linkTruck"' + AlarmRuleAuth.alarmrulelink + '><i class="ec-icon-cog linkTruck"></i> 下发指令</button>';
                    }
                    content+= '  ';
                    content+= '<button class="ec-btn ec-radius ec-btn-xs ec-btn-success editTruck"' + AlarmRuleAuth.alarmrulebindvehicle + '><i class="ec-icon-truck editTruck"></i> 车辆绑定</button>';
                    content+= '  ';
                    content+= '<button class="ec-btn ec-radius ec-btn-xs ec-btn-primary edit"' + AlarmRuleAuth.alarmruleedit + '><i class="ec-icon-edit edit"></i> 编辑</button>';
                    content+= '  ';
                    content+= '<button class="ec-btn ec-btn-xs ec-btn-default ec-radius del"' + AlarmRuleAuth.alarmruledel + '><i class="ec-icon-trash-o del"></i> 删除</button>';
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
        if ($(e.target).hasClass('editTruck')) {
            this._oParent.oConfigD = new ES.SelectTruck.Dialog(this._oParent,{bRemove:true,cUrl:'/Site/Configure',isAll:oModel.IsAll,type:true},{ title: "规则绑定车辆"});
            this._oParent.oConfigD.showModal(oModel.Id);
        }
        if ($(e.target).hasClass('edit')) {
            this._oParent.oEditD = new ES.Common.DialogRuleEdit(this._oParent, {
                bRemove: true,
                cUrl: '/RuleManage/EditRSpeedLimit'
            });
            this._oParent.oEditD.editShow({Id: oModel.Id, TypeId:oModel.Type});
        }
        if ($(e.target).hasClass('del')) {
            this._oParent.oDelD = new ES.Common.DelEntity(this._oParent,{bRemove:true,cUrl:'/RuleManage/Delete'},{
                title: '删除操作-规则',
                content: '是否要删除数据！'});
            this._oParent.oDelD.del(oModel);
        }
        if ($(e.target).hasClass('linkTruck')) {
            this._oParent.oLinkD = new ES.Common.linkTruck(this._oParent,{bRemove:true,cUrl:'/DeviceCommand/SetLine'},{
                title: "下发指令",
                content: '是否将当前规则下发给绑定车辆！'});
            this._oParent.oLinkD.del(oModel.Id);
        }
        if ($(e.target).hasClass('itemDetail')) {
            alert("详情面板!")
        }
    }
});



