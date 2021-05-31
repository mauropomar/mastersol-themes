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
    var title = urlParams.get('title');
    var html = urlParams.get('html');
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
                tooltipType: 'title',
                handler:function(){
                    downloadReport(urlParams,'excel');
                }
            },'-',{
                xtype:'button',
                iconCls:'fa fa-file-word-o',
                tooltip: 'Exportar a Word',
                tooltipType: 'title',
                handle:function(){
                    downloadReport('word');
                }
            },'-',{
                xtype:'button',
                iconCls:'fa fa-file-pdf-o',
                tooltip: 'Exportar a Pdf',
                tooltipType: 'title',
                handle:function(){
                    downloadReport('pdf');
                }
            },'-',{
                xtype:'button',
                iconCls:'fa fa-file-code-o',
                tooltip: 'Exportar Odt',
                tooltipType: 'title',
                handle:function(){
                    downloadReport('odt');
                }
            },'-',{
                xtype:'button',
                iconCls:'fa fa-print',
                tooltip: 'Imprimir',
                tooltipType: 'title',
                handle:function(){
                    downloadReport('print');
                }
            }]
        }]
    });

    function downloadReport(urlParams, type){
        var download = {
            url: 'app/executebuttons',
            method: 'GET',
            scope: this,
            params: {
                idregister: urlParams.get('idregister'),
                idsection:  urlParams.get('idsection'),
                idmenu: urlParams.get('idmenu'),
                idbutton: urlParams.get('idbutton'),
                name: urlParams.get('namebutton'),
                action:urlParams.get('action'),
                extra_params:urlParams.get('extra_params'),
                report_format:type
            },
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
            }
        };
        Ext.Ajax.request(download);
    }
});