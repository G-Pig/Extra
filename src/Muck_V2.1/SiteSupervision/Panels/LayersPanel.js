/**
 * Created by YangHang on 2017/12/12.
 */


ES.CloudMap.LayersPanel = ES.CloudMap.BasePanel.extend({
    initialize: function (oParent, oOption) {
        this._oParent = oParent;

        ES.setOptions(this,oOption);

        if (typeof this.oOption.cDivContainer === 'object') {
            this.$_oPContainer = this.oOption.cDivContainer;
        }
        else {
            this.$_oPContainer = $(this.oOption.cDivContainer);
        }
        this.initUI();
        this.initOn();
        this.setParentEvent();
        this.getType();
    },
    getType:function(){
        var chk_value =[];
        var chk_now = []
        $.each(this.oOption.item,function(i,v){
            chk_value.push(v.cValue);
            if(v.check == "checked"){chk_now.push(v.cValue)}
        });
        this.oOption.checkStatus = chk_value;
        this.oOption.checkStatusNow = chk_now;
    },
    initOn:function(){
        var self = this;
        this.$_oPContainer.on('change','input.ec-ucheck-checkbox',function(){

            var chk_value =[];
            self.$_oPContainer.find('input[name="form-checkbox"]:checked').each(function(){
                chk_value.push(parseInt($(this).val()));
            });
            self.oOption.checkStatusNow = chk_value;
        });
        this.$_oPContainer.on('change','input#StateCP',function(){
            if(self.$_oPContainer.find('input#StateCP:checked').length == 0){
                self._oParent.fire("MV:Site.hideStateCpData");
            }else{
                self._oParent.fire("MV:Site.setStateCpData");
            }
        });
        this.$_oPContainer.on('change','input#SuspiciousSite',function(){
            if(self.$_oPContainer.find('input#SuspiciousSite:checked').length == 0){
                self._oParent.fire("MV:Site.hideSuspSiteData");
            }else{
                self._oParent.fire("MV:Site.setSuspSiteData");
            }
        });
        this.$_oPContainer.on('change','input#Bayonet',function(){
            if(self.$_oPContainer.find('input#Bayonet:checked').length == 0){
                self._oParent.fire("MV:Site.hideBayonetData");
            }else{
                self._oParent.fire("MV:Site.setBayonetData");
            }
        })
    },
});