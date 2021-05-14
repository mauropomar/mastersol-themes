Ext.require([
    'Ext.data.*',
    'Ext.util.*',
    'Ext.view.View',
    'Ext.ux.DataView.DragSelector',
    'Ext.ux.DataView.LabelEditor'
]);

Ext.onReady(function () {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var product = urlParams.get('tipo');
    var title = urlParams.get('title');
    Ext.create('Ext.Viewport', {
        layout: 'border',
        title: 'Reporte',
        items: [{
            xtype: 'panel',
            title:title,
            region: 'center',
            tbar: [{
                xtype:'button',
                iconCls:'fa fa-file-excel-o',
                tooltip: 'Exportar a Excel',
                tooltipType: 'title'
            },'-',{
                xtype:'button',
                iconCls:'fa fa-file-word-o',
                tooltip: 'Exportar a Word',
                tooltipType: 'title'
            },'-',{
                xtype:'button',
                iconCls:'fa fa-file-pdf-o',
                tooltip: 'Exportar a Pdf',
                tooltipType: 'title'
            },'-',{
                xtype:'button',
                iconCls:'fa fa-file-code-o',
                tooltip: 'Exportar Odt',
                tooltipType: 'title'
            },'-',{
                xtype:'button',
                iconCls:'fa fa-print',
                tooltip: 'Imprimir',
                tooltipType: 'title'
            }]
        }]
    });
});