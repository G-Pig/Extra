/**
 * Created by liulin on 2017/5/9.
 */

ES.Report.AssetLayout = ES.Report.Layout.extend({

    cHTML:
    '<div class="ex-layout-content ec-fr ex-overflow-y ec-g">' +
    '   <form class="ec-form ec-form-horizontal ex-layout-form-search ex-theme-form-search" id="formId" action="" target="MainFrame">' +
    '       <li class="ec-form-group ec-u-sm-3">' +
    '           <div class="ec-u-sm-12 ex-final-button">' +
    '               <button type="button" class="ec-btn ec-btn-sm ec-radius ec-btn-primary"><i class="ec-icon-search"></i> 刷新 </button>' +
    '               <button type="button" class="ec-btn ec-btn-sm ec-radius ec-btn-default ex-btn-charts"><i class="ec-icon-area-chart"></i> 导出</button>' +
    '           </div>' +
    '       </li>' +
    '   </form>'+
    '   <div class="ec-panel ec-panel-default ec-margin-bottom-0 clearfix "> ' +
    '           <div class="echarts-style-box" style="min-height:550px;" >' +
    '               <div class="echarts-style echarts-style-01">' +
    '                   <div class="ec-u-sm-12">' +
    '                       <div id="echartsCar" style="min-height:550px;"  ></div>' +
    '                   </div>' +

    '               </div>' +
    '           </div>' +
    '           <div class="counter-bottom">    ' +
    '               <div id="CarGridContainer" class="dt-grid-container" style="width:100%;"></div>' +
    '               <div id="CarGridToolBarContainer" class="dt-grid-toolbar-container"></div>' +
    '           </div>' +
    '   </div>' +
    '</div>',


})