Ext.define('MasterSol.view.magnament.ConfigReport', {
    extend: 'Ext.grid.Panel',
    xtype: 'config-report-view',
    requires: [
        //  'Ext.grid.feature.Grouping',
        'MasterSol.store.magnament.ConfigReportStore',
        'Ext.selection.CellModel'
    ],
    iconCls: 'fa fa-file-text-o',
    frame: true,
    idrecordSection: null,
    selModel: {
        type: 'cellmodel'
    },
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    store: {
        type: 'store-config-report'
    },
    columns: [{
        text: 'Nombre',
        dataIndex: 'name',
        flex: 1
    }, {
        text: 'Valor',
        dataIndex: 'valor',
        flex: 3,
        editor: {
            xtype: 'textfield',
        },
        renderer: function (value, metaData, record) {
            return MasterApp.filter.renderVal(value, metaData, record);
        }
    }],
    features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{name}'
    }],
    viewConfig: {},
    tbar: [{
        iconCls: 'fa fa-file-text-o',
        tooltip: 'Generar Reporte',
        handler: function () {
            MasterApp.report.configReport();
        }
    },{
        iconCls: 'fa fa-close',
        tooltip: 'Cancelar',
        handler: function () {
              MasterApp.report.new();
        }
    },  '->', {
        xtype: 'tbtext',
        text: 'Parámetros de reportes',
        id: 'tbtext_magnament_report',
        style: {
            fontSize: '10px',
            fontWeight: 'bold'
        }
    }],
    listeners: {
        beforeedit: function (editor, e, eOpts) {
            MasterApp.report.beforeedit(editor, e, eOpts);
        },
        edit: function (editor, e) {
            MasterApp.register.edit(editor, e);
        }
    }
});