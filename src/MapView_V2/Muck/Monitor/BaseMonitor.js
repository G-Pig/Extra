/**
 *
 * 监控 基础 页面
 *
 * 每次初始化图表时都 清空 上次显示的数据 减轻数据加载
 *
 *
 * Created by liulin on 2017/4/17.
 *
 */
ES.MapView.BaseMonitor = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag:'demo',

        cUrl:'/MapView/GetSubDeptByTotal',

    },

    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this.oPenStyle = this.oOption.oPenStyle;
        // 获得地图控件
        this._oParent = oParent;

        //this._oContainer = $('.' + this.oOption.acParentDivClass.join('.'));

        // 初始化界面
        this.initUI();

        // 初始化事件
        this.initOn();


        this.initMenuBox();

        this.initBtn();

        // 设置父级容器的事件，是为了屏蔽地图的操作
        this.setParentEvent();
    },


    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);

    },


    initUI: function () {

        this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));
        this.TimeFormat(0);
        this.$_oContainer = $(ES.template(this.cHTML, this.oOption));
        this.$_oPContainer.html(this.$_oContainer);

        this.loadAn(this.$_oContainer);

        // 用于查询
        this.$_oRoadBox = this.$_oContainer.find('.ex-monitor-road-wbox');
        this.$_oChart = this.$_oContainer.find('.ex-layout-monitor-charts-content');
    },
    TimeFormat:function(type){
        if(type == 0){
            var _h = ("0"+this.oOption.cDayHour).slice(-2);
        }else{
            var _h = ("0"+this.oOption.cNightHour).slice(-2);
        }
        var newDate = new Date();
        var _y = newDate.getFullYear();
        var _M = ("0"+(newDate.getMonth()+1)).slice(-2);
        var _d = ("0"+newDate.getDate()).slice(-2);

        this.oOption.cTime= _y+' / '+_M+' / '+_d+' '+_h+':00 至现在';
    },
    initBtn: function () {
        var nWidth = -(this.$_oPContainer.width() - 6);

        this.$_oMinitorOpenBtn = this.$_oContainer.find('a.ex-btn-close-right');
        this.$_oMinitorCloseBtnvar = this.$_oContainer.find('a.ex-btn-close-left');

        this.$_oMinitorCloseBtnvar.hide();
        this.$_oMinitorOpenBtn.show();
        //this.$_oPContainer.stop().animate({ "left": '1rem' }, 800);
        this.$_oPContainer.css({ "left": nWidth + 32 });
        //this.$_oList = this.$_oContainer.find('.ex-layout-monitor-wbox-content');


        var self =this;
        this.$_oMinitorCloseBtnvar.bind('click', function () {
            self.$_oMinitorOpenBtn.show();
            $(this).hide();
            self.$_oPContainer.stop().animate({ "left": nWidth + 32 }, 800);
        });

        this.$_oMinitorOpenBtn.bind('click', function () {
            self.$_oMinitorCloseBtnvar.show();
            $(this).hide()
            self.$_oPContainer.stop().animate({ "left": "1rem" }, 800);
        });
    },



    show: function () {
        this.$_oContainer.show();
    },

    hide: function () {
        this.$_oContainer.hide();
    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {

        // 包括资产类型和资产类型数据
        ES.Util.reqData({url:this.oOption.cUrl,data:{}},this.initMenuBoxHandler,this);


    },

    // 初始化类型
    initMenuBoxHandler:function(oData) {
        if (!oData.rtnData || oData.rtnData.length<=0) {
            return;
        }

        // 初始化图表和菜单
        for (var i = 0; i < oData.rtnData.length; i++) {
            var cLi = ES.template(this.cItem, oData.rtnData[i]);
            this.$_oRoadBox.append($(cLi));
        }

        this.$_oRoadBox.find('.ex-monitor-wbox').bind('click', function () {
            $(this).find('.box').addClass('ec-active');
            $(this).siblings().find('.box').removeClass('ec-active');
        });

    },

    initOn:function(){
        var self = this;
        if(!$('#switch-onText')){}else{
            $('#switch-onText').bootstrapSwitch();
            $('#switch-onText').on('switchChange.bootstrapSwitch', function(event, state) {
                //console.log(this); // DOM element
                //console.log(event); // jQuery event
                //console.log(state); // true | false
                if(state){
                    self.initMenuBoxHandler(self.DayData);
                    self.TimeFormat(0);
                    $('.ex-title>h2>font>sub').html('( '+ self.oOption.cTime +' )');
                }else{
                    self.initMenuBoxHandler(self.NightData);
                    self.TimeFormat(1);
                    $('.ex-title>h2>font>sub').html('( '+ self.oOption.cTime +' )');
                }
            });
        }
    },
    loadAn: function (cTag, cFlag) {
        //加载进度条
        var loadMaskHtml = '<div class="ex-layout-loading monitor"><div class="spinner"></div></div>';
        var oDiv = $(loadMaskHtml);
        if (typeof cTag === 'object') {
            cTag.append(oDiv);
            return;
        }

        if (!cFlag) {
            cFlag = '.';
        }

        $(cFlag + cTag).append(oDiv);
    },
    removeAn: function (cTag, cFlag) {
        if (typeof cTag === 'object') {
            cTag.find('.ex-layout-loading').remove();
            return;
        }

        if (!cFlag) {
            cFlag = '.';
        }
        $(cFlag + cTag).find('.ex-layout-loading').remove();
    },
    noData: function (cTag, cFlag) {
        //加载进度条
        var loadMaskHtml = '<div class="ex-layout-loading noData"></div>';
        var oDiv = $(loadMaskHtml);
        if (typeof cTag === 'object') {
            cTag.append(oDiv);
            return;
        }

        if (!cFlag) {
            cFlag = '.';
        }
        $(cFlag + cTag).append(oDiv);
    },
    removeNoData: function (cTag, cFlag) {
        if (typeof cTag === 'object') {
            cTag.find('.ex-layout-loading.noData').remove();
            return;
        }

        if (!cFlag) {
            cFlag = '.';
        }
        $(cFlag + cTag).find('.ex-layout-loading.noData').remove();

    },

});


ES.MapView.BaseMonitor.include({

    cHTML:
    '<div class="ex-layout-monitor-wbox-content ec-align-left">' +
    '<div class="ex-title">' +
    '     <h2>' +
    '        <font>{cFlag}<sub>( {cTime} )</sub></font>' +
    '        <span class="ec-align-right ec-margin-left">' +
    '              <a href="javascript:void(0);" class="ex-btn-close-left" style="color:#fff;display:none"><i class="ec-icon-arrow-left"></i></a>' +
    '              <a href="javascript:void(0);" class="ex-btn-close-right" style="color:#fff"><i class="ec-icon-arrow-right"></i></a>' +
    '          </span>' +
    '    </h2>' +
    '</div>' +
    '   <div class="ex-layout-monitor-charts">' +
    '       <div class="ex-layout-monitor-charts-content"></div>' +
    '   </div>' +
    '   <div class="ex-monitor-road-wbox ec-align-right"></div>' +
    '</div>',



    cItem:
' <div class="ex-monitor-wbox">' +
'   <div class="box" data-id="{FeatureId}"> ' +
'       <i class="icon-tree"></i>  {FeatureName}' +
//'       <span class="num"><strong>{Total}</strong></span>' +
'   </div>' +
'</div>'




});