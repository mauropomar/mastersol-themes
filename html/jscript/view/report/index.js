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
    var url = urlParams.get('url');
    url = getUrl(url);
 
    Ext.create('Ext.Viewport', {
        layout: 'border',
        title: 'Reporte',
        items: [{
            xtype: 'panel',
            title: title,
            region: 'center',
         //   id:'content_iframe',
             html: '<iframe height="100%"  width="100%" src="'+url+'" id="mainBuffer" name="mainBuffer"></iframe>',
            tbar: [{
                xtype: 'button',
                iconCls: 'fa fa-file-excel-o',
                tooltip: 'Exportar a Excel',
                tooltipType: 'title',
                handler: function () {
                    downloadReport(urlParams, 'excel');
                }
            }, '-', {
                xtype: 'button',
                iconCls: 'fa fa-file-word-o',
                tooltip: 'Exportar a Word',
                tooltipType: 'title',
                handle: function () {
                    downloadReport(urlParams,'word');
                }
            }, '-', {
                xtype: 'button',
                iconCls: 'fa fa-file-pdf-o',
                tooltip: 'Exportar a Pdf',
                tooltipType: 'title',
                handle: function () {
                    downloadReport(urlParams,'pdf');
                }
            }, '-', {
                xtype: 'button',
                iconCls: 'fa fa-file-code-o',
                tooltip: 'Exportar Odt',
                tooltipType: 'title',
                handle: function () {
                    downloadReport(urlParams,'odt');
                }
            }, '-', {
                xtype: 'button',
                iconCls: 'fa fa-print',
                tooltip: 'Imprimir',
                tooltipType: 'title',
                handle: function () {
                    downloadReport(urlParams,'print');
                }
            }]
        }]
    });
  //  var iframe = Ext.get('mainBuffer');
   // iframe.dom.src = './report.html';
    function downloadReport(urlParam, type) {
        var download = {
            url: 'app/executebuttons',
            method: 'GET',
            scope: this,
             params: {
                idregister: urlParam.get('idregister'),
                idsection: urlParam.get('idsection'),
                idmenu: urlParam.get('idmenu'),
                idbutton: urlParam.get('idbutton'),
                name: urlParam.get('namebutton'),
                action: urlParam.get('action'),
                extra_params: urlParam.get('extra_params'),
                report_format: type
            },
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
            }
        };
        Ext.Ajax.request(download);
    }

    function getUrl(url) {
        var link = document.createElement('a');
        link.href = url;
        return link.href;
    }
});