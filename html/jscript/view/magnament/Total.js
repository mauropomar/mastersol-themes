Ext.define('MasterSol.view.magnament.Total', {
    extend: 'Ext.grid.Panel',
    xtype: 'total-view',
    controller: 'total',
    requires: [
        'Ext.grid.feature.Grouping',
        'MasterSol.store.magnament.TotalStore',
        'Ext.selection.CellModel',
        'MasterSol.view.magnament.ComboFunction'
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
            xtype: 'combofunction'
        }
    }],
    /*   features: [{
           ftype: 'grouping',
           groupHeaderTpl: '{name}'
       }],*/
    viewConfig: {},
    tbar: [{
        iconCls:'fa fa-check',
        handler: 'saveChanges',
        tooltip: 'Save changes'
    }, {
        iconCls: 'fa fa-eraser',
        tooltip: 'Limpiar filtro',
        handler: 'clean'
    },'->',{
        xtype:'tbtext',
        text:'Totales',
        style: {
            fontSize:'15px',
            fontWeight:'bold'
        }
    }],
    listeners:{
        beforeedit:'beforeedit'
    }
});