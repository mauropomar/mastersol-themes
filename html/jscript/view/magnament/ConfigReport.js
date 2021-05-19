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
        flex: 1,
        renderer: function (value, metaData, record) {
            return MasterApp.register.renderName(value, metaData, record);
        }
    }, {
        text: 'Valor',
        dataIndex: 'valor',
        flex: 3,
        editor: {
            xtype: 'textfield',
        },
        renderer: function (value, metaData, record) {
            return MasterApp.util.afteredit(value, metaData, record);
        }
    }],
    features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{name}'
    }],
    viewConfig: {},
    tbar: [{
        iconCls: 'fa fa-save',
        id: 'btn_save_config-report',
        tooltip: 'Guardar Cambios',
        handler: function () {
            //  MasterApp.register.saveChanges();
        }
    }, {
        iconCls: 'fa fa-close',
        tooltip: 'Cancelar',
        handler: function () {
            //  MasterApp.register.onChangesReject();
        }
    }, '->', {
        xtype: 'tbtext',
        text: 'Reporte',
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
        },
    }
});