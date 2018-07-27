/**
 *
 * 指标数据显示
 *
 * Created by liulin on 2017/4/18.
 */



ES.MapView.Target = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-type-wbox', 'ex-map-bottom', 'ex-map-right'],

        className: '',
        title: '工地显示',
        cUrl: '/Site/GetMapMonitorSiteStatic'
        //cMapTileUrl: '/Asset/scripts/ESLib/MapControl/DivMapTile.html',
    },



    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);

        // 获得地图控件
        this._oParent = oParent;

        this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));

        this.initUI();


        this.initEvent();
    },


    //加载工具事件，初始化工具栏
    initUI: function () {
        //ES.initTag(this._oContainer.eq(0), this.oUIConfig);
        //this.initData();
        //ES.getData({nDeptId: ES.MapView.oConfig.nDeptId}, this.oOption.cUrl, this.dataHandler, this);

        this.$_oContainer = $(this.cHTML);
        this.$_oPContainer.append(this.$_oContainer);


        this.$_oTargetOpenBtn = this.$_oContainer.find('a.ex-btn-close-left');       // $('.ex-layout-type-wbox a.ex-btn-close-left');
        this.$_oTargetCloseBtn = this.$_oContainer.find('a.ex-btn-close-right');  //$('.ex-layout-type-wbox a.ex-btn-close-right');
        this.$_oTargetCloseBtn.show();
        this.$_oTargetOpenBtn.hide();
    },

    // 给
    initEvent: function () {
        var self =this;
        this.$_oContainer.find('td.title').bind('click', function () {

            if ($(this).parent().hasClass('ec-active')) {

                // 广播给外部面板 显示指标
                self._oParent.fire('MapView:Target.hide', {cTarget: $(this).text()});

                // 改变 选择颜色
                $(this).parent().removeClass('ec-active');
            }
            else {

                self.getAssessData( {cTarget: $(this).text()});
                // 广播给外部面板 显示指标
                //self.fire('MapView:Target.show', {cTarget: $(this).text()});
                // 改变 选择颜色
                $(this).parent().addClass('ec-active');
                $(this).parent().siblings().removeClass('ec-active');

                //显示统计报表
                var oTemp = {
                    // 当前面板的标志,监控面板的标准
                    cFlag: $(this).text(),
                    cMonitor:'ES.MapView.AssessSegmentMonitor',
                }
                self._oParent.fire('MapView:MonitorMgr.initMonitor', oTemp);
            }

        });

        var nTargetWidth = -(this.$_oContainer.width() - 38);
        //地图展示下沉
        this.$_oTargetCloseBtn.bind('click', function () {
           self.$_oTargetOpenBtn.show();

            $(this).hide();

            self.$_oPContainer.stop().animate({ "right": nTargetWidth }, 800);
        })

        //地图展示上升
        this.$_oTargetOpenBtn.bind('click', function () {
            self.$_oTargetCloseBtn.show();

            $(this).hide()
            self.$_oPContainer.stop().animate({ "right": "1rem" }, 800);
        })
    },

    getAssessData:function(oData){
        ES.Util.reqData({url: '/AssessSegment/GetAssessSegment'}, this.getAssessDataHandler, this,oData);


    },
    getAssessDataHandler: function (oRtn) {
        if (!oRtn || !oRtn.rtnData) {
            return;
        }

        var aoData = oRtn.rtnData;

        this._oParent.fire("MapView:Target.show", {aoData:aoData,cTarget:oRtn.cTarget});

    },
});


// UI 设置
ES.MapView.Target.include({

    cHTML:
    '<div class="ex-maptool-type">'+
    '   <h3>路况示例'+
    '       <span class="ec-align-left ec-margin-right">'+
    '           <a href="javascript:void(0);" class="ex-btn-close-left" style="color:#fff;display:none"><i class="ec-icon-arrow-left"></i></a>'+
    '           <a href="javascript:void(0);" class="ex-btn-close-right" style="color:#fff;"><i class="ec-icon-arrow-right"></i></a>'+
    '       </span>'+
    '   </h3>'+
    '   <table class="ec-table ec-text-center">'+
    '    <thead>'+
    '       <tr>'+
    '           <th>指标</th>'+
    '           <th colspan="5" class="ec-text-center">指标等级对应颜色</th>'+
    '       </tr>'+
    '    </thead>'+
    '    <tbody>'+
    '       <tr >'+ //class="ec-active"
    '           <td class="title">MQI</td>'+
    '           <td class="green">优</td>'+
    '           <td class="blue">良</td>'+
    '           <td class="cyan">中</td>'+
    '           <td class="purple">次</td>'+
    '           <td class="red">差</td>'+
    '       </tr>'+
    '       <tr>'+
    '           <td class="title">PQI</td>'+
    '           <td class="green">优</td>'+
    '           <td class="blue">良</td>'+
    '           <td class="cyan">中</td>'+
    '           <td class="purple">次</td>'+
    '           <td class="red">差</td>'+
    '       </tr>'+
    '       <tr>'+
    '           <td class="title">PCI</td>'+
    '           <td class="green">优</td>'+
    '           <td class="blue">良</td>'+
    '           <td class="cyan">中</td>'+
    '           <td class="purple">次</td>'+
    '           <td class="red">差</td>'+
    '       </tr>'+
    '       <tr>'+
    '           <td class="title">RQI</td>'+
    '           <td class="green">优</td>'+
    '           <td class="blue">良</td>'+
    '           <td class="cyan">中</td>'+
    '           <td class="purple">次</td>'+
    '           <td class="red">差</td>'+
    '       </tr>'+
    '       <tr>'+
    '           <td class="title">RDI</td>'+
    '           <td class="green">优</td>'+
    '           <td class="blue">良</td>'+
    '           <td class="cyan">中</td>'+
    '           <td class="purple">次</td>'+
    '           <td class="red">差</td>'+
    '       </tr>'+
    '       <tr>'+
    '           <td class="title">PSSI</td>'+
    '           <td class="green">优</td>'+
    '           <td class="blue">良</td>'+
    '           <td class="cyan">中</td>'+
    '           <td class="purple">次</td>'+
    '           <td class="red">差</td>'+
    '       </tr>'+
    '       <tr>'+
    '           <td class="title">SRI</td>'+
    '           <td class="green">优</td>'+
    '           <td class="blue">良</td>'+
    '           <td class="cyan">中</td>'+
    '           <td class="purple">次</td>'+
    '           <td class="red">差</td>'+
    '       </tr>'+
    '    </tbody>'+

    '   </table>'+
    '</div>',
});