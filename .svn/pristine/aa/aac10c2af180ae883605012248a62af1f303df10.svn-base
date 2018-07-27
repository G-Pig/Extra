/**
 * Created by YangHang on 2017/12/12.
 */
ES.CloudMap.SitesPanel = ES.CloudMap.BasePanel.extend({
    oOption: {
        // 外层容器
        cDivContainer: '.ex-mapview-panel-siteType',
    },
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
    },
    initUI: function () {
    },
    initOn:function(){
        this._oParent.on("MV:Site.setSiteCards", this.setSiteCards, this);

    },
    setSiteCards:function(oData){
        var showId= [5,6,7,9,10],showItem=[];
        for(var i =0;i<oData.aoSiteCards.length;i++){
            if($.inArray(oData.aoSiteCards[i].id,showId)>=0){
                showItem.push(oData.aoSiteCards[i]);
            }
        }
        this.oOption.item = showItem;
        var self = this;
        this.$_oPContainer.empty();
        $.each(this.oOption.item,function(i,v){
            var _Units = v.id!=8?'个':'立方米';
            var oTemp = $(ES.template(self.cHtml, {cTitle: v.text,Data:v.count,Id:v.id,Units:_Units}));
            if(v.id == 7 && authBtn.suspicSearch.indexOf('true')>-1){
                oTemp.css('cursor',"pointer")
            }else if(v.id != 7 && authBtn.search.indexOf('true')>-1){
                oTemp.css('cursor',"pointer")
            }
            oTemp.bind('click',function(){
                var dataId = $(this).find('.ex-siteType-item').attr('data-id'), oParams;
                if(dataId == 7 && authBtn.suspicSearch.indexOf('true')>-1){
                    oParams={
                        cUrl: "/Reports/SuspicSiteDayStat",
                        cName:"可疑工地每日出土",
                        cId: 351
                    }
                    window.top.oWebFrame.oMenuFrame.oFooter._oParent.fire('TabPanel.addPage', oParams);//添加底层tab
                    window.top.oWebFrame.oTabPanel._oParent.fire('TabPanel.addPage', oParams);//添加iframe
                } else if(dataId != 7 && authBtn.search.indexOf('true')>-1){
                    oParams={
                        cUrl: "/Reports/SiteDayStat",
                        cName:"核准工地每日出土",
                        cId: 350
                    }
                    window.top.oWebFrame.oMenuFrame.oFooter._oParent.fire('TabPanel.addPage', oParams);//添加底层tab
                    window.top.oWebFrame.oTabPanel._oParent.fire('TabPanel.addPage', oParams);//添加iframe
                };
                //window.top.oWebFrame.oMenuFrame.fire('TabPanel.showMenu', {cId: cId});//定位到菜单
            });
            self.$_oPContainer.append(oTemp);
        });
    },
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