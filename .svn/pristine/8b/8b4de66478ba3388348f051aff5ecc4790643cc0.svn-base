/**
 * Created by YangHang on 2017/12/20.
 */

ES.MapView.UnloadMonitor = ES.MapView.BaseMonitor.extend({
    cHTML:
    '<div class="ex-layout-monitor-wbox-content ec-align-left ex-lg">' +
    '<div class="ex-title">' +
    '     <h2>' +
    '        <font>{cFlag}<sub>( {cTime} )</sub></font>' +
    '        <span class="ec-align-right ec-margin-left-sm">' +
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
    '       <i class="icon-tree"></i> ' +
    '       <div class="ex-scroll-title"><p>{FeatureName}</p></div> ' +
    '       <span class="num"><strong>消纳 {Count} 次</strong></span>' +
    '   </div>' +
    '</div>',
    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag: '消纳点消纳工地数据统计',

        cUrl: '/AssetStatic/ReportAssetStatic',
        //cTime:'2017/12/28 18:00 至现在',
        cDayHour:5,
        data:{
            rtnData:{
                Tech:[
                    { TypeId:1,TypeName: "消纳点1", Cnt: (Math.floor(Math.random() * 50) + 51), Icon: "Assets" },
                    { TypeId:2,TypeName: "消纳点2", Cnt: (Math.floor(Math.random() * 50) + 1), Icon: "Denoter" },
                ],
                TechGroup:[
                    {Value:[
                        { TypeId:1,AlarmName: "工地1", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "工地2", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "工地3", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "工地4", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "工地5", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "工地6", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                    ],TypeId:1,TypeName:'武汉市',OnlineRate:[
                        {Name:"违规工地",Value: (Math.floor(Math.random() * 50) + 1),type:1},
                        {Name:"正常工地",Value:(Math.floor(Math.random() * 50) + 1),type:2}
                    ]},
                    {Value:[
                        { TypeId:1,AlarmName: "工地1", Cnt: (Math.floor(Math.random() * 10) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "工地2", Cnt: (Math.floor(Math.random() * 10) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "工地3", Cnt: (Math.floor(Math.random() * 10) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "工地4", Cnt: (Math.floor(Math.random() * 10) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "工地5", Cnt: (Math.floor(Math.random() * 10) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "工地6", Cnt: (Math.floor(Math.random() * 10) + 1), Icon: "Traffic" },
                    ],TypeId:2,TypeName:'蔡甸区',OnlineRate:[
                        {Name:"违规工地",Value: (Math.floor(Math.random() * 50) + 1),type:1},
                        {Name:"正常工地",Value:(Math.floor(Math.random() * 50) + 1),type:2}
                    ]}
                ],

            }
        }

    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {
        this.nTotal = 0;
        this.setDefaultData();
        this.initChart();
        // 包括资产类型和资产类型数据
        //ES.Util.reqData({url: this.oOption.cUrl, data: {}}, this.initMenuBoxHandler, this);
        //this.initMenuBoxHandler(this.oOption.data);
        var self = this;
        ES.getData({},'/MapView/NormalUnloadStat',function(data){
            self.initMenuBoxHandler(data);
            self.removeAn(self.$_oContainer);
            if(data.length == 0){
                self.noData(self.$_oContainer);
            }else{
                //self.$_oMinitorOpenBtn.click();
            }
        })



    },
    // 初始化类型
    initMenuBoxHandler: function (oData) {
        if (!oData) {
            return;
        }

        this.oBusData = oData;

        for(var i = 0;i< oData.length;i++) {
            oData[i].FeatureId = oData[i].Id;
            oData[i].FeatureName = oData[i].Name;
            // 初始化图表和菜单
            var cLi = ES.template(this.cItem, oData[i]);

            $_oLi = $(cLi);
            $_oLi.data('data', oData[i]);
            this.$_oRoadBox.append($_oLi);

        }
        //this.nTotal = oData[0].Total;
        this.initEvent();
    },

    // 要执行父类方法
    initEvent: function () {

        var self = this;
        this.$_oRoadBox.find('.ex-monitor-wbox').bind('click', function () {
            $(this).find('.box').addClass('ec-active');
            $(this).siblings().find('.box').removeClass('ec-active');

            var dataId = $(this).find('.box').attr('data-id');
            // 添加数据
            var oData = null;

            for (var i = 0; i < self.oBusData.length; i++) {
                if (self.oBusData[i].Id === parseInt(dataId)) {
                    oData = self.oBusData[i];
                    break;
                }
            }
            self.updateChart(oData);


            var latlng = {lat:oData.Lat,lng:oData.Lng};
            var item = $('.unloadMap .ex-layout-struckbox-content').jstree('get_node', -dataId);
            if(!item.state.checked){
                $('.unloadMap .ex-layout-struckbox-content').jstree('check_node', -dataId);
                if($('.unloadMap .ex-layout-struckbox-content').jstree('get_checked').length>1){
                    self._oParent._oMap.setView( latlng,16);
                }
            }else{
                //定位就行
                self._oParent._oMap.setView( latlng,16);
            }


        });

        this.$_oRoadBox.find('.ex-monitor-wbox').eq(0).click();

        if(!this._Interval){
            this._Interval = window.setInterval(function(){
                self.$_oRoadBox.find('.ex-scroll-title>p').toggleClass('ec-active');
            },10000);
        }else{
            window.clearInterval(this._Interval);
            this._Interval = window.setInterval(function(){
                self.$_oRoadBox.find('.ex-scroll-title>p').toggleClass('ec-active');
            },10000);
        }
    }

});

ES.MapView.UnloadMonitor.include({

    // 设置默认值
    setDefaultData: function () {
        this.oDeptStatic = [ ];
        this.aoSer = [];
        this.aoDept=[];
        this.nMaxMile =1;

        //this.nTotal = 0
    },

    // 初始化图表
    initChart: function () {
        var oChart = echarts.init(this.$_oChart.get(0));
        this.oChart = oChart;
        this.getOption();
        oChart.setOption(this.oOpt);
    },


    // 更新chart 图表数据
    updateChart: function (oData) {

        if (!oData) {
            return;
        }

        this.aoDept.splice(0, this.aoDept.length);
        this.aoSer.splice(0, this.aoSer.length);


        for (var i = 0; i < (oData.Sites.length<5?oData.Sites.length:5); i++) {
            this.aoDept.unshift(oData.Sites[i].Name);
        }
        this.aoSer = [];


        var aoTemp = []
        for (var j = 0; j < (oData.Sites.length<5?oData.Sites.length:5); j++) {
            aoTemp.unshift(oData.Sites[j].Count);
            //this.nTotal = this.nTotal + oData.rtnData.Sites[i].Count;
            if (oData.Sites[j].Count > this.nMaxMile) {
                this.nMaxMile = oData.Sites[j].Count;
            }
        }

        var oSer = {
            name: oData.Name,
            type: 'bar',
            stack: 'chart',
            silent: true,
            z: 3,
            label: {
                normal: {
                    position: 'right',
                    show: true
                }
            },
            data: aoTemp
        }

        this.aoSer.push(oSer);


        //var oPie = this.getPieConfig(oData);

        //this.aoSer.push(oPie);

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getPieConfig: function (oData) {
        var aoData =  oData.rtnData.OnlineRate;
        this.oDeptStatic.splice(0, this.oDeptStatic.length);
        var oPie = {
            type: 'pie',
            radius: [0, '30%'],
            center: ['75%', '25%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: this.oDeptStatic
        }

        for(var i=0;i< aoData.length;i++){
            this.oDeptStatic.push({name:aoData[i].Name,value:aoData[i].Value,itemStyle:{normal:{color:aoData[i].type==1?'#f72b2e':'#2bb743'}}});
        };

        return oPie;
    },


    // 设置图表参数
    getOption: function () {
        // 指定图表的配置项和数据
        var oOpt = {
            title: [{
                text: '消纳点工地消纳排名前5',
                //subtext: '总计 '+ this.nTotal +' 个工地',
                x: '50%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 15
                }
            },
            //     {
            //     text: '违规率',
            //
            //     x: '75%',
            //     textAlign: 'center',
            //     textStyle: {
            //         fontSize: 14
            //     }
            // }
            ],
            tooltip :{
                formatter: "{b} : {c} ({d}%)"
            },
            grid: [{
                top: 50,
                width: '90%',
                bottom: '0',
                left: 10,
                containLabel: true
            }],
            xAxis: [{
                type: 'value',
                max: this.nMaxMile * 1.5,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false,
                },

            }],
            yAxis: [{
                type: 'category',
                data: this.aoDept,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    formatter: function (value) {
                        if(value.length>7){
                            var _t = parseInt(value.length/7)+1;
                            var content="";
                            for(var i =0;i<_t;i++){
                                content += value.substr(i*7,7)+'\n';
                            }
                            return content;

                        }else{
                            return value;
                        }
                    },
                    rich: {
                        value: {
                            verticalAlign:'middle',
                            align: 'center',
                            width:90,
                        }
                    }

                }
            }],
            series: this.aoSer
        };

        this.oOpt = oOpt;
    },


});

