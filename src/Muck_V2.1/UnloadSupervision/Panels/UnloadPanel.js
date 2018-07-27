/**
 * Created by YangHang on 2017/12/12.
 */
ES.CloudMap.SitesPanel = ES.CloudMap.BasePanel.extend({
    oOption: {
        // 外层容器
        cDivContainer: '.ex-mapview-panel-siteType',
    },
    initUI: function () {
    },
    initOn:function(){
        this._oParent.on("MV:Site.setSiteCards", this.setSiteCards, this);
    },
    setSiteCards:function(oData){
        this.oOption.item = oData.aoSiteCards;
        var self = this;
        this.$_oPContainer.empty();
        $.each(this.oOption.item,function(i,v){
            var _Units = v.id!=8?'个':'立方米';
            var oTemp = $(ES.template(self.cHtml, {cTitle: v.text,Data:v.count,Id:v.id,Units:_Units}));
            self.$_oPContainer.append(oTemp);
        });
    }
});

ES.CloudMap.SitesPanel.include({
    cHtml:
        '<li>'+
        '    <div class="ex-siteType-item" data-id="{Id}">'+
        '        <span class="ex-siteType-item-icon"></span>'+
        '        <h4>{cTitle}</h4>'+
        '        <p><span class="cardData">{Data}</span>{Units}</p>'+
        '    </div>'+
        '</li>',
});