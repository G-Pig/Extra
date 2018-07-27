//页面的布局
ES.Muck.Layout = ES.Muck.BaseLayout.extend({
    cHTML:
    '<div class="ex-layout-sider ex-theme-tree">' +
    '   <h3 class="ex-theme-sider-title">' +
    '       <i class="ec-icon-sitemap"></i>&nbsp;组织架构' +
    '   </h3>' +
    '   <div class="ex-layout-struckbox-search">' +
    '       <div class="ec-input-group">' +
    '           <input  type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">' +
    '           <span class="ec-input-group-btn">' +
    '               <button   class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>' +
    '           </span>' +
    '       </div>' +
    '   </div>' +
    '   <div class="ex-layout-struckbox-content"  ></div>' +
    '</div>' +

    '<div class="ex-layout-content ec-fr" style="width:100%">' +
    '   <form data-reactroot="" class="ec-form ec-form-horizontal ex-layout-form-search ex-theme-form-search" id="formId" action="" target="MainFrame">' +
    '       <ul class="ec-avg-sm-3 ec-avg-md-4 ec-avg-lg-5">' +
    '           <li class="ec-form-group">' +
    '               <label for="Area" class="ec-u-sm-4 ec-form-label">上报企业：</label>' +
    '               <div class="ec-u-sm-8">' +
    '                   <div class="ec-input-group">' +
    '                       <input type="text" id="Area" placeholder="请选择上报企业" class="ec-form-field" readonly>' +
    '                       <span class="ec-input-group-btn">' +
    '                           <a class="ec-btn ec-btn-default ec-btn-sm ex-btn-left-radius ex-input-clear-btn">&times;</a>' +
    '                       </span>' +
    '                       <input type="hidden" id="s_h_Area" />' +
    '                   </div>' +
    '               </div>' +
    '           </li>' +
    '           <li class="ec-form-group">' +
    '               <label for="startDate" class="ec-u-sm-4 ec-form-label">上报年份：</label>' +
    '               <div class="ec-u-sm-8">' +
    '                   <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
    '                   <input size="16" type="text" name="startDate" id="startDate" class="ec-form-field" onclick="" readonly>' +
    '                   <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>' +
    '                   </div>' +
    '               </div>' +
    '           </li>' +
    '           <li class="ec-form-group">' +
    '               <div class="ec-u-sm-12 ex-final-button">' +
    '                   <button type="button" class="ec-btn ec-btn-sm ec-btn-primary ec-radius" id="SearchBtn"' + btnAuth.search + '><i class="ec-icon-search"></i> 查询 </button>' +
    '                   <button type="button" class="ec-btn ec-btn-sm ec-btn-success ec-radius" id="AddBtn"' + btnAuth.add + '><i class="ec-icon-plus"></i> 车辆上报 </button>' +
    '                   <button type="button" class="ec-btn ec-btn-sm ec-btn-default ec-radius" id="downBtn"' + btnAuth.sample + '><i class="ec-icon-book"></i> 模版下载 </button>' +
    //'                   <button type="button" class="ec-btn ec-btn-sm ec-btn-warning ec-radius" id="ExportBtn"' + btnAuth.importSite + '><i class="ec-icon-file-excel-o"></i> 导出 </button>' +
    '               </div>' +
    '           </li>' +
    '       </ul>' +
    '   </form>' +
    '   <table id="dtGridContainer" class="dt-grid-container" style="width: 100%;"></table>' +
    '   <div id="dtGridToolBarContainer" class="dt-grid-toolbar-container"></div>' +
    '   <div style="clear:both;"></div>'+
    '</div>',
})