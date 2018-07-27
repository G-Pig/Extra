/**
 * Created by liulin on 2017/5/15.
 */


ES.Report.AssetGird = ES.Common.BaseDtGrid.extend({



    initialize: function (oParent, oOption, oGridOption) {
        ES.Common.BaseDtGrid.prototype.initialize.call(this,oParent, oOption, oGridOption);

        this.initGrid();
        //this.loadGrid();
        //this.getData({});
        this.initOn();
    },

    initOn: function () {
        // 监听上游的树的点击事件
        this._oParent.on('Report:RouteLeftTree.select',this.treeSelect,this);
    },

    gridComplete: function () {
        ES.Common.BaseDtGrid.prototype.gridComplete.call(this);
        $('.ex-lightgallery').lightGallery({exThumbImage: 'data-exthumbimage',closable: false});
    },

    getColumns: function () {

        var aoCol =  [{ id: 'Id', title: '序号', columnClass: 'ec-text-center' },
            { id: 'DeptName', title: '权属单位', columnClass: 'ec-text-center' },
            { id: 'FullName', title: '管养单位', columnClass: 'ec-text-center' },
            { id: 'MainTypeName', title: '主类型', columnClass: 'ec-text-center' },
            { id: 'TypeName', title: '资产类型', columnClass: 'ec-text-center' },
            { id: 'AssetCode', title: '资产编码', columnClass: 'ec-text-center' },
            { id: 'RouteCode', title: '路线编码', columnClass: 'ec-text-center' },
            {  id: 'Direction', title: '方向', columnClass: 'ec-text-center' },

            {id: 'Position', title: '位置', columnClass: 'ec-text-center'},
            { id: 'Lane', title: '车道', columnClass: 'ec-text-center' },
            {
                id: 'BeginMile', title: '起点桩号', columnClass: 'ec-text-center',
                resolution: function (value, record, column, grid, dataNo, columnNo) {
                    return CommonLib.fnTransMileage(value);
                }
            },
            {
                id: 'EndMile', title: '终点桩号', columnClass: 'ec-text-center' ,
                resolution: function (value, record, column, grid, dataNo, columnNo) {
                    return CommonLib.fnTransMileage(value);
                }
            },

            {
                id: 'operation',
                title: '资产图片路径',
                type: 'string',
                columnClass: 'ec-text-center',
                resolution: function (value, record, column, grid, dataNo, columnNo) {
                    var content = '';
                    if (!record || !record.ImageUrl) {
                        return content;
                    }
                    //**第一个img,外面展示，直接放地址显示
                    content += '<div class="ex-lightgallery-box">' +
                        '<img src=' + m_cHttpPath + record.ImageUrl + ' class="ec-img-thumbnail ex-img-sm" />';
                    content += '<ul class="ex-lightgallery">';

                    content += '<li data-exthumbimage="' + m_cHttpPath + record.ImageUrl + '" data-src="' + m_cHttpPath + record.ImageUrl + '"></li>';

                    content += '</ul></div>';
                    content += '  ';
                    return content;
                }
            },

            { id: 'Description', title: '描述', columnClass: 'ec-text-center' },
            { id: 'CreateDate', title: '创建时间', columnClass: 'ec-text-center' }]

        return aoCol;

    },

    treeSelect: function (oData) {

        var acDept = oData.oNode.children_d;
        acDept.push(oData.oNode.id);
        var selectDeptIds = acDept.join(',');
        this.getData({selectDeptIds: selectDeptIds});

    },
    
    // 获得数据绑定grid
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