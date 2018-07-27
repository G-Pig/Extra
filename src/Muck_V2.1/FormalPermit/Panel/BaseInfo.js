/**
 * Created by YangHang on 2017/12/4
 */

// 基础菜单
ES.CloudMap.BaseInfo = ES.CloudMap.BaseItem.extend({
    cHtml:
    '<div class="ex-permit-step-item">'+
    '   <fieldset class="ex-box-title ec-margin-0">'+
    '       <legend align="center">填写基本信息</legend>'+
    '   </fieldset>'+
    '   <ul class="ec-avg-sm-1">'+
    '       <li class="ec-form-group ec-margin-0">'+
    '           <label for="form-dateStart" class="ec-u-sm-4 ec-form-label ec-padding-0 ec-text-left"><span class="ec-text-danger">(*)</span> 有效期起：</label>'+
    '           <div class="ec-u-sm-8  ec-padding-left-0">'+
    '               <div class="ec-input-group ec-input-group-sm date ec-form-datetime">'+
    '                   <input size="16" type="text"  id="form-dateStart" class="ec-form-field">'+// onfocus="WdatePicker({ dateFmt: \'yyyy-MM-dd\'})"
    '                   <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>'+
    '               </div>'+
    '           </div>'+
    '       </li>'+
    '       <li class="ec-form-group ec-margin-0">'+
    '           <label for="form-dateEnd" class="ec-u-sm-4 ec-form-label ec-padding-0 ec-text-left"><span class="ec-text-danger">(*)</span> 有效期止：</label>'+
    '           <div class="ec-u-sm-8 ec-padding-left-0">'+
    '               <div class="ec-input-group ec-input-group-sm date ec-form-datetime">'+
    '                   <input size="16" type="text"  id="form-dateEnd" class="ec-form-field" >'+//onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"
    '                   <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>'+
    '               </div>'+
    '           </div>'+
    '       </li>'+
    '   </ul>'+
    '</div>',
    initUI:function(){

        ES.CloudMap.BaseItem.prototype.initUI.call(this);

        $("#form-dateStart").click(function () {
            WdatePicker({
                dateFmt: "yyyy-MM-dd",
                isShowClear: false,
                maxDate:'#F{$dp.$D(\'form-dateEnd\')}'
            });
        });
        $("#form-dateEnd").click(function () {
            WdatePicker({
                dateFmt: "yyyy-MM-dd",
                isShowClear: false,
                minDate:'#F{$dp.$D(\'form-dateStart\')}'
            });
        });


        this.hisDraw();



    },
    //历史绘制
    hisDraw:function(){
        //如果进去存在历史
        if(this._oParent.oOption.Edit == 'true'){
            $('#form-dateStart').val(this.hisDateFormat(this._oParent.oOption.HisData.DayStart.substr(6,13)));
            $('#form-dateEnd').val(this.hisDateFormat(this._oParent.oOption.HisData.DayEnd.substr(6,13)));
        }
    },
    hisDateFormat:function(date){
        var time = new Date(parseInt(date));
        var y= time.getFullYear();
        var m = ("0" + ( time.getMonth()+ 1)).slice(-2);
        var d = ("0" +time.getDate()).slice(-2);
        return y+'-'+m+'-'+d;
    }

});