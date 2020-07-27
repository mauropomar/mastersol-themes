Ext.define('MasterSol.view.magnament.ComboFk', {
    extend: 'Ext.form.field.ComboBox',
    requires: ['MasterSol.store.magnament.FkStore'],
    xtype: 'comboforeingk',
    valueField: 'nombre',
    displayField: 'nombre',
    triggerAction: 'all',
    queryMode: 'local',
    matchFieldWidth: false,
    store: {
        type: 'store-fK'
    },
    listeners: {
        specialkey: 'specialKey'
    }
})