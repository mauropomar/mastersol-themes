Ext.define('MasterSol.view.layout.ComboIdioma', {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'MasterSol.store.layout.IdiomaStore'
    ],
    xtype: 'comboidioma',
    fieldLabel: 'Idioma',
    name: 'comboidioma',
    store: {
        type: 'store_idioma'
    },
    valueField: 'id',
    displayField: 'nombre',
    typeAhead: true,
    queryMode: 'local',
    emptyText: 'Select un idioma...'
})