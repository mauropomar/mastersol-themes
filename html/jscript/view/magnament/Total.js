Ext.define('MasterSol.view.magnament.Total', {
    extend: 'Ext.grid.Panel',
    xtype: 'total-view',
    requires: [
        'Ext.grid.feature.Grouping',
        'MasterSol.store.magnament.TotalStore',
        'Ext.selection.CellModel',
        'MasterSol.view.magnament.ComboFunction',
        'MasterSol.controller.magnament.TotalController'
    ],
    iconCls: 'fa fa-calculator',
    frame: true,
    selModel: {
        type: 'cellmodel'
    },
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    store: {
        type: 'store-total'
    },
    columns: [{
        text: 'Propiedad',
        dataIndex: 'nombrecampo',
        flex: 2
    }, {
        text: 'Función',
        dataIndex: 'nombrefuncion',
        flex: 1,
        editor: {
            xtype: 'combo-function'
        }
    }],
    /*   features: [{
           ftype: 'grouping',
           groupHeaderTpl: '{name}'
       }],*/
    viewConfig: {},
    tbar: [{
        iconCls:'fa fa-check',
        tooltip: 'Guardar Cambios',
        handler: function () {
            MasterApp.totals.saveChanges();
        }
    }, {
        iconCls: 'fa fa-eraser',
        tooltip: 'Limpiar filtro',
        handler: function () {
           MasterApp.totals.new();
        }
    },'->',{
        xtype:'tbtext',
        text:'Totales',
        id:'tbtext_magnament_total',
        style: {
            fontSize:'10px',
            fontWeight:'bold'
        }
    }],
    listeners:{
        beforeedit: function (editor, e, eOpts) {
           MasterApp.totals.beforeedit(editor, e, eOpts);
        }
    }
});