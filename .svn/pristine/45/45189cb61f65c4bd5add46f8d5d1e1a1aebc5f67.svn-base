/**
 * Created by YangHang on 2018/3/8.
 */


ES.Muck.echart=ES.Evented.extend({

    initialize: function (oParent, oOption) {

        this.oOption = oOption;
        this.oParent = oParent;

        this.onceTime = true;
        this.$_oChart = $("#"+ this.oOption.parentId);
        this.$_oContainer = $('.ex-vehicle-echart').parent();
        this.getMonitorData();

        this.initEvent();

    },
    getMonitorData:function(Param){
        this.loadAn(this.$_oContainer);
        var self = this;
        this.xList=[];
        this.yValue = [];
        this.dataMax = 1;
        if(!Param){
            var oParam = this.oOption.monitorParam;
        }else{
            var oParam = $.extend(this.oOption.monitorParam,Param)
        }
      ES.getData(oParam,this.oOption.Url,function(oData){
          self.oData = oData;
          self.dataMax = oData.Chart[0].HSum;
          $.each(oData.Chart,function(i,v){
              self.xList.push(v.HDay);
              self.yValue.push(v.HSum);
              if(v.HSum > self.dataMax)self.dataMax =v.HSum;
          });

          self.initCountData(oData);


          self.initUI();
      },this)

    },

    initUI:function(){
        if(this.xList==[]||this.yValue==[])return;
        if(this.onceTime){
            var oChart = echarts.init(this.$_oChart.get(0));
            this.oChart = oChart;
            this.getOption();
            oChart.setOption(this.oOpt);
            this.removeAn(this.$_oContainer);
            this.onceTime = false;
        }else{
            this.getOption();
            // 刷新图表
            this.oChart.setOption(this.oOpt, true);
            this.removeAn(this.$_oContainer);
        }

    },
    getOption:function(){
        var option = {
            tooltip: {
                trigger: 'axis',
                formatter: '{b}<br/>车流量：{c} 次'
            },
            visualMap: [{
                show: false,
                type: 'continuous',
                seriesIndex: 0,
                min: 0,
                max: this.dataMax,
                inRange: {
                    color: ['#20b36a', '#fccf31', 'red']
                }
            }],
            grid: {
                left: '1%',
                right: '3%',
                bottom: '7%',
                top:'13%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.xList,
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                axisTick:{
                    show:false
                },
                axisLabel: {
                    formatter: '{value} 次'
                },
                max: (this.dataMax*1.5+1)
            },
            series: [{
                data: this.yValue,
                type: 'line',
                smooth: true,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255, 0, 0, 0.4)'
                        },
                            {
                                offset: 0.5,
                                color: 'rgba(252, 207, 49, 0.25)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(32, 179, 106, 0.1)'
                            }
                        ])
                    }
                },
            }]
        };
        this.oOpt = option;
    },
    initCountData:function(oData){
        var Title = $('.ex-fence-vehicle-title b');
        var beginTime = $('.ex-fence-vehicle-title sub').find('span.ex-count-beginTime');
        var endTime = $('.ex-fence-vehicle-title sub').find('span.ex-count-endTime');
        var $_TotalCount = $('#FenceVehicleData li').eq(0).find('span');
        var $_ToDayCount = $('#FenceVehicleData li').eq(1).find('span');
        var $_Lift = $('#FenceVehicleData li').eq(1).find('i');
        var $_Ratio = $('#FenceVehicleData li').eq(1).find('em');

        $_TotalCount.html(oData.TotalCount);
        $_ToDayCount.html(oData.ToDayCount);
        Title.html(oData.FenceName);
        beginTime.html(oData.StartTime);
        endTime.html(oData.EndTime);
        switch (oData.Lift){
            case 1:
                $_Lift.parent().removeClass().addClass('ec-text-danger');
                $_Lift.removeClass().addClass('ec-icon-caret-up');
                $_Ratio.html(oData.Ratio);
                break;
            case 2:
                $_Lift.parent().removeClass().addClass('ec-text-success');
                $_Lift.removeClass().addClass('ec-icon-caret-down');
                $_Ratio.html(oData.Ratio);
                break;
            case 3:
                $_Lift.parent().removeClass().addClass('ec-text-warning');
                $_Lift.removeClass().addClass('ec-icon-caret-minus');
                $_Ratio.html(0);
                break;
        }
    },
    changeCountTime:function(FT,ST){
        var timeItems = $('.ex-fence-vehicle-echart .ex-fence-vehicle-title > h3>sub>span');
        timeItems.eq(0).html(FT);
        timeItems.eq(1).html(ST);
    },
    initEvent:function(){
        var self = this;
        $_TimeType = $(".ex-fence-vehicle-dropdown > .ec-dropdown-content");
        $_TimeSelect = $('.ex-fence-vehicle-type > ul');
        $_TimeBtn = $('.ex-dropdown-type>button');

        $_TimeType.on('click','a',function(){
            var Param = {Type:parseInt($(this).attr('cid'))};

            $(this).parent().addClass('ec-active').siblings().removeClass('ec-active');
            switch (Param.Type){
                case 2:
                    Param.StartTime = "";
                    Param.EndTime = "";
                    $_TimeBtn.html($(this).html()).removeAttr('data-on');
                    $_TimeSelect.slideUp();
                    // self.changeCountTime(self.desendDay(new Date(),0).Format("yyyy/MM/dd"),(new Date()).Format("yyyy/MM/dd"));
                    break;
                case 3:
                    Param.StartTime = "";
                    Param.EndTime = "";
                    $_TimeBtn.html($(this).html()).removeAttr('data-on');
                    $_TimeSelect.slideUp();
                    // self.changeCountTime(self.desendDay(new Date(),6).Format("yyyy/MM/dd"),(new Date()).Format("yyyy/MM/dd"));
                    break;
                case 4:
                    Param.StartTime = "";
                    Param.EndTime = "";
                    $_TimeBtn.html($(this).html()).removeAttr('data-on');
                    $_TimeSelect.slideUp();
                    // self.changeCountTime(self.desendDay(new Date(),30).Format("yyyy/MM/dd"),(new Date()).Format("yyyy/MM/dd"));
                    break;
                case 5:
                    Param.StartTime = $('#dateStart').val();
                    Param.EndTime = $('#dateEnd').val();
                    $_TimeSelect.slideDown();
                    $_TimeBtn.html("查&nbsp;&nbsp;询").attr('data-on',"");
                    // self.changeCountTime((new Date($('#dateStart').val())).Format("yyyy/MM/dd"),(new Date($('#dateEnd').val())).Format("yyyy/MM/dd"));
                    break;

            }
            $_TimeSelect.click();
            self.oParent.oGrid.query({oParam:Param});
            self.getMonitorData(Param);
        })


        $('.ex-dropdown-type').on('click','button[data-on]',function(){
            var Param = {};
            Param.StartTime = $('#dateStart').val();
            Param.EndTime = $('#dateEnd').val();
            self.getMonitorData(Param);
        })

    },
    reset:function(){
        $_TimeSelect = $('.ex-fence-vehicle-type > ul');
        $_TimeBtn = $('.ex-dropdown-type>button');
        $_TimeBtn.html("今&nbsp;&nbsp;日").removeAttr('data-on');
        $_TimeBtn.siblings().find('a[cid="2"]').parent().addClass('ec-active').siblings().removeClass('ec-active');
        $_TimeSelect.slideUp();
    },
    desendDay:function(date,day){

        day=parseInt(day);

        var   interTimes=day*24*60*60*1000;

        interTimes=parseInt(interTimes);

        return   new Date(Date.parse(date)-interTimes);

    },
    loadAn: function (cTag, cFlag) {
        //加载进度条
        var loadMaskHtml = '<div class="ex-layout-loading FenceMonitor">' +
            '                   <div id="loading-center">' +
            '                       <div id="loading-center-absolute">'+
            '                           <div class="object" id="object_one"></div>'+
            '                           <div class="object" id="object_two" style="left:20px;"></div>'+
            '                           <div class="object" id="object_three" style="left:40px;"></div>'+
            '                           <div class="object" id="object_four" style="left:60px;"></div>'+
            '                           <div class="object" id="object_five" style="left:80px;"></div>'+
            '                       </div>' +
            '                   </div>' +
            '               </div>';
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

});