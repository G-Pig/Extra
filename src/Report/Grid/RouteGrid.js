/**
 * Created by liulin on 2017/5/6.
 */


ES.Report.RouteGird = ES.Common.BaseDtGrid.extend({



    initialize: function (oParent, oOption, oGridOption) {
        ES.Common.BaseDtGrid.prototype.initialize.call(this,oParent, oOption, oGridOption);

        this.initGrid();
        //this.loadGrid();
        //this.getData()
        this.initOn();
    },

    initOn: function () {
        // 监听上游的树的点击事件
        this._oParent.on('Report:RouteLeftTree.select',this.treeSelect,this);
    },
    getColumns: function () {

        var aoCol =  [{
            id: 'totalMile',
            title: '公里数',
            type: 'number',
            format: '#,###.00',
            hideType: 'xs',
            columnClass: 'ec-text-center',
            fastQuery: true,

        }, {
            id: 'subFullName',
            title: '分公司',
            type: 'string',
            columnClass: 'ec-text-center',
            fastQuery: true,
            fastQueryType: 'eq'
        }, {
            id: 'deptName',
            title: '养护所',
            type: 'string',

            columnClass: 'ec-text-center',

            fastQuery: true,
            fastQueryType: 'range'
        },{
            id: 'TechLevel',
            title: '技术等级',
            type: 'string',
            columnClass: 'ec-text-center',

            fastQuery: true,
            fastQueryType: 'range'
        },{
            id: 'PavmentType',
            title: '路面类型',
            type: 'string',
            columnClass: 'ec-text-center',

            fastQuery: true,
            fastQueryType: 'range'
        },{
            id: 'Character',
            title: '路面性质',
            type: 'string',
            columnClass: 'ec-text-center',

            fastQuery: true,
            fastQueryType: 'range'
        }]

        return aoCol;

    },

    treeSelect: function (oData) {

        var acDept = oData.oNode.children_d;
        acDept.push(oData.oNode.id);
        var selectDeptIds = acDept.join(',');
        this.getData({selectDeptIds: selectDeptIds});

    },

    getData: function (oParam) {
        if (!this.oOption.cUrl) {
            return;
        }

        ES.getData(oParam, this.oOption.cUrl, this.getDataHandler, this);
    },

    getDataHandler: function (oData) {
        this._aoData.splice(0,this._aoData.length);

        $.merge(this._aoData,oData);

        this.loadGrid();
    }

});