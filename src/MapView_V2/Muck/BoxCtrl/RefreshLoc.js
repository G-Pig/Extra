/**
 * 刷新车辆实时位置
 *
 * Created by liulin on 2018/4/28.
 */


ES.MapView.RefreshLoc   = L.Evented.extend({

    oOption: {
        // 加载全屏按钮容器
        cSelfDiv: 'ex-map-reflesh',
        // 父级容器
        acParentDivClass: [
            'ex-layout-maptool',
            'ex-theme-maptool',
            'ex-map-top',
            'ex-map-right'
        ],

        // 地图图层的默认id
        cPContainer: '#MapView',

        cTitle: '刷新车辆位置',

    },

    oUIConfig: {
        div: {
            'class': 'ex-maptool-box ex-map-reflesh',
            i: {'class': 'ec-icon-refresh'},
            html: '&nbsp;&nbsp;刷新'
        }
    },

    // 构造函数
    initialize: function (oParent, options) {
        if (options.oUIConfig) {
            L.extend(this.oUIConfig, options.oUIConfig);
            delete  options.oUIConfig
        }

        L.extend(this.oOption, options);

        // 获得地图控件
        this._oParent= oParent;
        this.$_oPContainer =$(this.oOption.cPContainer).find('.' + this.oOption.acParentDivClass.join('.')).eq(0);

        // 设置父级容器的事件
        this.setParentEvent();

        this.initUI();
    },

    // 设置父级容器的事件
    setParentEvent: function () {
        // 屏蔽事件
        //L.DomEvent.addListener(this.$_oPContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
    },

    //加载工具事件，初始化工具栏
    initUI: function () {
        L.initTag(this.$_oPContainer, this.oUIConfig);

        this.initToolEvent();
    },

    //初始化工具栏事件
    initToolEvent: function () {
        var self = this;
        //地图全屏按钮
        $('.' + this.oOption.cSelfDiv).bind('click', function () {
            // 刷新地图数据
            self._oParent.fire('VehClusterMange:refreshLoc');
        });
    },

});