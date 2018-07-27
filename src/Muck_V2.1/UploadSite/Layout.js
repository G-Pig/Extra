//页面的布局
ES.Muck.Layout = ES.Muck.BaseLayout.extend({
    cHTML:
    '<div class="ex-layout-content" style="width:100%">' +
    '   <div class="ec-form ec-form-horizontal ex-layout-form-search ex-theme-form-search">' +
    '       <ul class="ec-avg-sm-3 ec-avg-md-4 ec-avg-lg-5">' +
    '           <li class="ec-form-group">' +
    '               <label for="startDate" class="ec-u-sm-4 ec-form-label">企业名称：</label>' +
    '               <div class="ec-u-sm-8">' +
    '                   <div class="ec-input-group">'+
    '                       <input type="text" id="EnterpriceId" placeholder="请选择企业" class="ec-form-field" readonly>' +
    '                       <span class="ec-input-group-btn">'+
    '                           <a class="ec-btn ec-btn-default ec-btn-sm ex-btn-left-radius ex-input-clear-btn">&times;</a>'+
    '                       </span>'+
    '                       <input type="hidden" id="s_h_EnterpriceId" />' +
    '                   </div>'+
    '               </div>' +
    '           </li>' +
    '           <li class="ec-form-group">' +
    '               <label for="startDate" class="ec-u-sm-4 ec-form-label">区域名称：</label>' +
    '               <div class="ec-u-sm-8">' +
    '                   <div class="ec-input-group">'+
    '                       <input type="text" id="SiteName" placeholder="请选择区域" class="ec-form-field" readonly>' +
    '                       <span class="ec-input-group-btn">'+
    '                           <a class="ec-btn ec-btn-default ec-btn-sm ex-btn-left-radius ex-input-clear-btn">&times;</a>'+
    '                       </span>'+
    '                       <input type="hidden" id="s_h_SiteName" />' +
    '                   </div>'+
    '               </div>' +
    '           </li>' +
    '           <li class="ec-form-group">' +
    '               <label for="startDate" class="ec-u-sm-4 ec-form-label">上报时间：</label>' +
    '               <div class="ec-u-sm-8">' +
    '                   <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
    '                   <input size="16" type="text" name="startDate" id="startDate" class="ec-form-field" onclick="" readonly>' +
    '                   <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>' +
    '                   </div>' +
    '               </div>' +
    '           </li>' +
    '           <li class="ec-form-group">' +
    '               <label for="status" class="ec-u-sm-4 ec-form-label">审核状态：</label>' +
    '               <div class="ec-u-sm-8">' +
    '                   <select class="ec-form-field ec-radius ec-input-sm" name="form-select" id="status">' +
    '                       <option value="">请选择</option>' +
    '                   </select>' +
    '               </div>' +
    '           </li>' +
    '       </ul>' +
    '       <ul class="ec-avg-sm-1">'+
    '           <li class="ec-form-group">' +
    '               <div class="ec-u-sm-12 ex-final-button">' +
    '                   <button type="button" class="ec-btn ec-btn-sm ec-btn-primary ec-radius" id="SearchBtn"' + btnAuth.search + '><i class="ec-icon-search"></i> 查询 </button>' +
    '                   <button type="button" class="ec-btn ec-btn-sm ec-btn-warning ec-radius" id="ExportBtn"' + btnAuth.importSite + '><i class="ec-icon-file-excel-o"></i> 导出 </button>' +
    '                   <button type="button" class="ec-btn ec-btn-sm ec-btn-default ec-radius" id="downBtn"' + btnAuth.sample + '><i class="ec-icon-book"></i> 模版下载 </button>' +
    '                   <button type="button" class="ec-btn ec-btn-sm ec-btn-danger ec-radius" id="SiteBtn"' + btnAuth.importSite + '><i class="ec-icon-file-excel-o"></i> 上报工地 </button>' +
    '                   <button type="button" class="ec-btn ec-btn-sm ec-btn-success ec-radius" id="UploadBtn"' + btnAuth.exportSite + '><i class="ec-icon-plus"></i> 上报车辆 </button>' +
    '               </div>' +
    '           </li>' +
    '       </ul>'+
    '   </div>' +
    '   <table id="dtGridContainer" class="dt-grid-container"></table>' +
    '   <div id="dtGridToolBarContainer" class="dt-grid-toolbar-container" style="display:inline-block; line-height:2.2;"></div>' +
    '   <div style="clear:both;"></div>' +
    '</div>',
    initUI: function () {
        $(this.oOption.cPContainer).append($(this.cHTML));
    }
})
