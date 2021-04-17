Ext.define('MasterSol.view.magnament.Filter', {
    extend: 'Ext.grid.Panel',
    xtype: 'filter-view',
    requires: [
        'MasterSol.store.magnament.FilterStore',
        'Ext.selection.CellModel',
        'MasterSol.view.magnament.ComboSign',
        'MasterSol.view.plugins.DateTime'
    ],
    /*  features: [{
          ftype: 'grouping',
          groupHeaderTpl: '{name}'
      }],*/
    iconCls: 'fa fa-filter',
    frame: true,
    idrecordSection: null,
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],
    store: {
        type: 'store-filter'
    },
    columns: [{
        text: 'Nombre',
        sortable: false,
        hideable: false,
        dataIndex: 'nombrecampo',
        flex: 1
    }, {
        text: '',
        dataIndex: 'operador',
        align: 'center',
        hideable: false,
        sortable: false,
        flex: 0.3,
        editor: {
            xtype: 'combo-sign'
        }
    }, {
        text: 'Valor Inicio',
        dataIndex: 'valor1',
        sortable: false,
        hideable: false,
        align: 'center',
        flex: 1,
        editor: {
            xtype: 'textfield',
        },
        renderer: function (value, metaData, record) {
            return MasterApp.filter.renderVal(value, metaData, record);
        }
    }, {
        text: 'Valor Fin',
        dataIndex: 'valor2',
        sortable: false,
        hideable: false,
        align: 'center',
        flex: 1,
        editor: {
            xtype: 'textfield',
        },
        renderer: function (value, metaData, record) {
            return MasterApp.filter.renderVal(value, metaData, record);
        }
    }],
    viewConfig: {},
    tbar: [{
        iconCls: 'fa fa-check',
        tooltip: 'Filtrar',
        handler: function () {
            MasterApp.filter.saveChanges();
        }
    }, {
        iconCls: 'fa fa-eraser',
        tooltip: 'Limpiar filtro',
        handler: function () {
            MasterApp.filter.new();
        }
    }, '->', {
        xtype: 'tbtext',
        text: 'Filtrar',
        id:'tbtext_magnament_filter',
        style: {
            fontSize: '10px',
            fontWeight: 'bold'
        }
    }],
    listeners: {
        afterrender: function () {
            MasterApp.filter = MasterApp.getController('MasterSol.controller.magnament.FilterController');
        },
        beforeedit: function (editor, e, eOpts) {
            MasterApp.filter.beforeedit(editor, e, eOpts)
        },
        edit: function (editor, e, eOpts) {
            MasterApp.filter.edit(editor, e)
        }
    }
});
