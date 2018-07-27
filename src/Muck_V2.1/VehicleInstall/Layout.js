/**页面布局 */
ES.Muck.Layout= ES.Muck.BaseLayout.extend({
    cHTML:
    '<div class="ex-layout-sider ex-theme-tree">'+
    '   <ul class="ex-sider-menu">'+
    '       <li data-index="0" class="ec-active aClick" '+btnAuth.all+'>' +
    '           <a href="#"><label>全部</label>' +
    '               <span class="ec-badge ec-badge-danger ec-round ec-fr" id="records">0</span>' +
    '           </a>' +
    '       </li>'+
    '       <li data-index="1" class="aClick"  '+btnAuth.unCheck+'>' +
    '           <a href="#"><label>待审核</label>' +
    '               <span class="ec-badge ec-badge-danger ec-round ec-fr">0</span>' +
    '           </a>' +
    '       </li>'+
    '       <li data-index="2" class="aClick" '+btnAuth.checked+'>' +
    '           <a href="#"><label>已审核</label>' +
    '               <span class="ec-badge ec-badge-danger ec-round ec-fr">0</span>' +
    '           </a>' +
    '       </li>'+
    '       <li style="margin:1em 3.5em;" '+btnAuth.add+'>' +
    '           <button type="button" class="ec-btn ec-btn-md ec-btn-success ec-radius" id="newReport"> 新增报装单</button>' +
    '       </li>'+
    '   </ul>'+
    '</div>'+
    '<div class="ex-layout-content ec-fr" style="width:100%;">' +
    '   <div class="ex-top-charts" style="padding:1em;text-align:center">' +
    '       <ul class="ec-avg-sm-5" style="padding:1em;border:1px dotted #ccc">' +
    '           <li class="item">' +
    '               <i class="ec-icon-btn ec-primary ec-icon-database"></i>' +
    '               <div class="item-info">' +
    '                   <p>报装车辆数</p>' +
    '                   <p class="boxNum"><strong id="total">0</strong></p>' +
    '               </div>' +
    '           </li>' +
    '           <li class="item">' +
    '               <div class="item-info">' +
    '               <i class="ec-icon-btn ec-warning ec-icon-hourglass-start"></i>' +
    '                   <p>待审核报装单</p>' +
    '                   <p class="boxNum"><strong id="uncheck">0</strong></p>' +
    '               </div>' +
    '           </li>' +
    // '           <li class="item">' +
    // '               <div class="item-info">' +
    // '               <i class="ec-icon-btn ec-warning ec-icon-hourglass-end"></i>' +
    // '                   <p>已下单车辆数</p>' +
    // '                   <p class="boxNum"><strong id="ordered">0</strong></p>' +
    // '               </div>' +
    // '           </li>' +
    '           <li class="item">' +
    '               <div class="item-info">' +
    '               <i class="ec-icon-btn ec-success ec-icon-check-square-o"></i>' +
    '                   <p>已安装车辆数</p>' +
    '                   <p class="boxNum"><strong id="installed">0</strong></p>' +
    '               </div>' +
    '           </li>' +
    '           <li class="item">' +
    '               <div class="item-info">' +
    '               <i class="ec-icon-btn ec-danger ec-icon-star-o"></i>' +
    '                   <p>未安装车辆数</p>' +
    '                   <p class="boxNum"><strong id="unInstall">0</strong></p>' +
    '               </div>' +
    '           </li>' +
    '       </ul>'+
    '   </div>' +
    //'<div id="checkGrid" style="display:block">' +
    '   <form data-reactroot="" class="ec-form ec-form-horizontal ex-layout-form-search ex-theme-form-search" id="" action="" target="MainFrame">' +
    '       <ul class="ec-avg-sm-3 ec-avg-md-4 ec-avg-lg-5">' +
    '           <li class="ec-form-group">' +
    '               <label for="InstallEnterprise" class="ec-u-sm-4 ec-form-label">报装企业：</label>' +
    '               <div class="ec-u-sm-8">' +
    '                   <div class="ec-input-group">' +
    '                       <input type="text" id="InstallEnterprise" placeholder="请选择报装企业" class="ec-form-field" readonly>' +
    '                       <span class="ec-input-group-btn">' +
    '                           <a class="ec-btn ec-btn-default ec-btn-sm ex-btn-left-radius ex-input-clear-btn">&times;</a>' +
    '                       </span>' +
    '                       <input type="hidden" id="s_h_InstallEnterprise" />' +
    '                   </div>' +
    '               </div>' +
    '           </li>' +
    '           <li class="ec-form-group">' +
    '               <label for="indexTime" class="ec-u-sm-4 ec-form-label">安装时间：</label>' +
    '               <div class="ec-u-sm-8">' +
    '                   <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
    '                   <input size="16" type="text" name="StartTime" id="indexTime" class="ec-form-field" readonly>' +
    '                   <span class="ec-input-group-label add-on">至</span>' +
    '                   <input size="16" type="text" name="exTime" id="exTime" class="ec-form-field" readonly>' +
    '                   </div>' +
    '               </div>' +
    '           </li>' +
    // '           <li class="ec-form-group">' +
    // '               <label for="exTime" class="ec-u-sm-4 ec-form-label">截止时间：</label>' +
    // '               <div class="ec-u-sm-8">' +
    //
    // '               </div>' +
    // '           </li>' +
    '           <li class="ec-form-group">' +
    '               <div class="ec-u-sm-12 ex-final-button">' +
    '                   <button type="button" class="ec-btn ec-btn-sm ec-btn-primary ec-radius" id="SearchBtn"  '+btnAuth.search+'><i class="ec-icon-search"></i> 查询 </button>' +
    //'                   <button type="button" class="ec-btn ec-btn-sm ec-btn-warning ec-radius" id="allIn"  '+btnAuth.allIn+'><i class="ec-icon-file-excel-o"></i> 批量下单 </button>' +
    '               </div>' +
    '           </li>' +
    '       </ul>' +
    '   </form>' +
    '   <table id="dtGridContainer" class="dt-grid-container" style="width: 100%;overflow:auto;"></table>' +
    '   <div id="dtGridToolBarContainer" class="dt-grid-toolbar-container" style="position:fixed;bottom:0"></div>' +
    '   <div style="clear:both;"></div>' +
    //'</div>' +
    // '<div id="getDoneGrid" style="display:none">' +
    // '   <form data-reactroot="" class="ec-form ec-form-horizontal ex-layout-form-search ex-theme-form-search" id="" action="" target="MainFrame">' +
    // '       <ul class="ec-avg-sm-3 ec-avg-md-4 ec-avg-lg-5">' +
    // '           <li class="ec-form-group">' +
    // '               <label for="InstallArea" class="ec-u-sm-4 ec-form-label">报装区域：</label>' +
    // '               <div class="ec-u-sm-8">' +
    // '                   <div class="ec-input-group">' +
    // '                       <input type="text" id="InstallArea" placeholder="请选择报装区域" class="ec-form-field" readonly>' +
    // '                       <span class="ec-input-group-btn">' +
    // '                           <a class="ec-btn ec-btn-default ec-btn-sm ex-btn-left-radius ex-input-clear-btn">&times;</a>' +
    // '                       </span>' +
    // '                       <input type="hidden" id="s_h_InstallArea" />' +
    // '                   </div>' +
    // '               </div>' +
    // '           </li>' +
    // '           <li class="ec-form-group">' +
    // '               <label for="InstallEnterprise" class="ec-u-sm-4 ec-form-label">报装企业：</label>' +
    // '               <div class="ec-u-sm-8">' +
    // '                   <div class="ec-input-group">' +
    // '                       <input type="text" id="InstallEnterprise" placeholder="请选择报装企业" class="ec-form-field" readonly>' +
    // '                       <span class="ec-input-group-btn">' +
    // '                           <a class="ec-btn ec-btn-default ec-btn-sm ex-btn-left-radius ex-input-clear-btn">&times;</a>' +
    // '                       </span>' +
    // '                       <input type="hidden" id="s_h_InstallEnterprise" />' +
    // '                   </div>' +
    // '               </div>' +
    // '           </li>' +
    // '           <li class="ec-form-group">' +
    // '               <label for="indexTime" class="ec-u-sm-4 ec-form-label">报装时间：</label>' +
    // '               <div class="ec-u-sm-8">' +
    // '                   <input size="16" type="text" name="StartTime" id="indexTime" class="ec-form-field" onclick="">' +
    // '               </div>' +
    // '           </li>' +
    // '           <li class="ec-form-group">' +
    // '               <div class="ec-u-sm-12 ex-final-button">' +
    // '                   <button type="button" class="ec-btn ec-btn-sm ec-btn-primary ec-radius" id="SearchBtn"><i class="ec-icon-search"></i> 查询 </button>' +
    // '                   <button type="button" class="ec-btn ec-btn-sm ec-btn-warning ec-radius" id="allIn"><i class="ec-icon-file-excel-o"></i> 批量下单 </button>' +
    // '               </div>' +
    // '           </li>' +
    // '       </ul>' +
    // '   </form>' +
    // '   <table id="checkGridContainer" class="dt-grid-container" style="width: 100%;"></table>' +
    // '   <div id="checkGridToolBarContainer" class="dt-grid-toolbar-container" style="position:fixed;bottom:0"></div>' +
    // '   <div style="clear:both;"></div>' +
    // '</div>' +
    '</div>',
    //     initUI: function () {
    //         $(this.oOption.cPContainer).append(this.cHTML);
    //
    //     // $('.ex-layout-content').css({ height: $(window).height() , width: $(window).width() - this.oOption.nWidth  });
    //     // $('.ex-vehicle-batch').height(0);
    // }
})