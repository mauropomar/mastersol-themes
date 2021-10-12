/* File Created: June 14, 2013 */
/* Author : Sebastian */
Ext.define("MasterSol.view.magnament.Audit", {
    extend: 'Ext.grid.Panel',
    xtype: 'audit-view',
    border: 0,
    page: 0,
    isRemoveAudit: false,
    margins: '2 2 2 2',
    scrollable: true,
    frame: false,
    iconCls: 'fa fa-eye',
    requires: [
        'MasterSol.store.magnament.AuditStore'
    ],
    plugins: [{
        ptype: 'rowexpander',
        rowBodyTpl: new Ext.XTemplate(
            '<p><b>Usuario:</b> {usuario}</p>',
            '<p><b>Valor Anterior:</b> {valor_anterior}</p>',
            '<p><b>Nuevo Valor:</b> {valor_nuevo}</p>'
        )
    }],
    tbar: [{
        iconCls: 'fa fa-filter',
        tooltip: 'Filtrar',
        handler: function () {
            MasterApp.audit.showWindow();
        }
    }, '-', {
        iconCls: 'fa fa-eraser',
        tooltip: 'Limpiar filtro',
        handler: function () {
            MasterApp.audit.clean();
        }
    }, '-', {
        iconCls: 'fa fa-list-alt',
        tooltip: 'Mostrar Elimnados',
        handler: function (btn) {
            var grid = btn.up('gridpanel');
            grid.getStore().removeAll();
            grid.isRemoveAudit = true;
            MasterApp.audit.getAllRemoved(false);
        }
    }, '->', {
        xtype: 'tbtext',
        text: 'Auditoría',
        id: 'tbtext_magnament_audit',
        style: {
            fontSize: '10px',
            fontWeight: 'bold'
        }
    }],
    store: {
        type: 'store-audit'
    },
    columns: [{
        text: 'Propiedad',
        dataIndex: 'propiedad',
        width: 150,
        renderer: function (value, metaData, record, rowIdx, colIdx, store) {
            metaData.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }
    }, {
        text: 'Acción',
        dataIndex: 'accion',
        width: 110,
        renderer: function (value, metaData, record, rowIdx, colIdx, store) {
            metaData.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }
    }, {
        text: 'Fecha',
        dataIndex: 'fecha',
        width: 130,
        renderer: function (value, metaData, record, rowIdx, colIdx, store) {
            metaData.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }
    }],
    viewConfig: {
        loadMask: true,
        loadingText: 'Cargando...'
    },
    listeners: {
        afterrender: function (comp) {
            MasterApp.audit = MasterApp.getController('MasterSol.controller.magnament.AuditController');
            comp.getTargetEl().on('mouseup', function (e, t) {
                if (t.scrollTop > 0) {
                    var height = comp.getTargetEl().getHeight();
                    if (height + t.scrollTop >= t.scrollHeight) {
                        if (comp.isRemoveAudit)
                            MasterApp.audit.getAllRemoved(true);
                    }
                }
            });
        }
    }
});