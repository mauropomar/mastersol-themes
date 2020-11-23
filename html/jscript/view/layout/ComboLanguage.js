Ext.define('MasterSol.view.layout.ComboLanguage', {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'MasterSol.store.layout.LanguageStore'
    ],
    xtype: 'combolanguage',
    fieldLabel: 'Idioma',
    name: 'combolanguage',
    store: {
        type: 'store_language'
    },
    valueField: 'id',
    displayField: 'nombre',
    typeAhead: true,
    queryMode: 'local',
    emptyText: 'Seleccione un idioma...',
    allowBlank:false,
    blankText:'Debe introducir un idioma.'
})