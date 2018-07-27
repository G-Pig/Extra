/**
 * Created by Administrator on 2017/5/2.
 */

ES.Report.LeftTree = ES.Common.BaseTree.extend({

    cUIConfig:
    '<div class="ex-layout-sider ex-theme-tree">' +
    '   <h3 class="ex-theme-sider-title">  ' +
    '   <i class="ec-icon-sitemap"></i>&nbsp;养护部门</h3>' +
    '   <div class="ex-layout-struckbox-search">   ' +
    '       <div class="ec-input-group">' +
    '           <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">' +
    '           <span class="ec-input-group-btn">' +
    '               <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>' +
    '           </span>' +
    '       </div>' +
    '   </div>' +
    '   <div class="ex-layout-struckbox-content"></div>' +
    '</div>',

    oOption: {
        // 树使用的容器
        cPContainer: '.ex-layout-struckbox-wrap',

        nWidth:219,
        nHeight:65,
    },

    initUI: function () {

        this.$_oContainer = $(this.cUIConfig);
        this.$_oPContainer.append(this.$_oContainer);

        this.$_oTreeContainer = this.$_oContainer.find('.ex-layout-struckbox-content');
        this.$_oSearchInput = this.$_oContainer.find('.ex-tree-search-ipt');
        this.$_oSearchBtn = this.$_oContainer.find('.ex-tree-search-btn');

        this.$_oContainer.find('h3').html(this.oOption.cTitle);
        this.$_oContainer.width(this.oOption.nWidth);

    },



});