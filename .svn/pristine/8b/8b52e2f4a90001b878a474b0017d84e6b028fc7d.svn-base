/**
 * Created by liulin on 2017/8/31.
 */

ES.Muck.Search = ES.Muck.BaseSearch.extend({

    initUI: function () {
        this.oSearchInput =$('#ruleName');
        this.oSearvhBtn =$('.ex-grid-search');
        this.oAddBtn =$('.ex-grid-add');
    },

    initEvent:function() {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {

            var cSearchVal = self.oSearchInput.val();
            var gType =parseInt($('.ex-rule-tab>li.active').attr('data-index'));
            var oParam = {Name: cSearchVal,Type: gType};
            // 触发查询
            self._oParent.oGrid.query({oParam: oParam});

        });
        var oParent = this._oParent;

        this.oAddBtn.bind('click',function(){
            var nIndex = parseInt($('.ex-layout-sider  .ex-rule-tab').find('li.active').attr('data-index'));

            if(!nIndex){
                oParent.oAddD = new ES.Common.AddType(oParent,{bRemove:true},{title: '新增 —— 类型选择',
                    content:'<div class="ex-rule-tabs modelType">'+
                    '           <ul class="ex-rule-tab ec-avg-sm-5">'+
                    '               <li data-index="1" '+AlarmRuleAuth.line+'><i class="ex-rule-tab5"></i><span>线路偏移</span></li>'+
                    '               <li data-index="2" '+AlarmRuleAuth.enter+'><i class="ex-rule-tab2"></i><span>禁入规则</span></li>'+
                    '               <li data-index="3" '+AlarmRuleAuth.out+'><i class="ex-rule-tab3"></i><span>禁出规则</span></li>'+
                    '               <li data-index="4" '+AlarmRuleAuth.overspeed+'><i class="ex-rule-tab12"></i><span>超速规则</span></li>'+
                    '               <li data-index="5" '+AlarmRuleAuth.limitspeed+'><i class="ex-rule-tab6"></i><span>路段限速</span></li>'+
                    //'               <li data-index="6" '+AlarmRuleAuth.stop+'><i class="ex-rule-tab2"></i><span>非法停车规则</span></li>'+
                    '           </ul>'+
                    '         </div>'});
                oParent.oAddD.del();
            }else{
                self._oParent.addModel = new ES.Common.DialogRuleEdit(self._oParent,{bRemove:true,cUrl:'/RuleManage/EditRSpeedLimit'});

                self._oParent.addModel.addShow({ TypeId:nIndex});
            }

        });

    },
});