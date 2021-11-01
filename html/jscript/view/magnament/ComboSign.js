Ext.define('MasterSol.view.magnament.ComboSign', {
    extend: 'Ext.form.field.ComboBox',
    requires: ['MasterSol.store.magnament.SignStore'],
    xtype: 'combo-sign',
    valueField: 'simbolo',
    displayField: 'simbolo',
    triggerAction: 'all',
    queryMode: 'local',
    listConfig: {
        minWidth: 100,
        getInnerTpl: function () {
            return '<span<tpl></tpl>>{simbolo} ({nombre})</span>';
        }
    },
    store: {
        type: 'store-sign'
    },
    listeners: {
        select: function (combo, record) {
            var grid = combo.up('gridpanel');
            if (grid.xtype === 'filter-view')
                MasterApp.filter.selectOperator(combo, record)
        },
        specialKey: function (field, e) {
            MasterApp.filter.specialKey(field, e)
        }
    }
})
