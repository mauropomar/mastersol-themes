Ext.define('MasterSol.view.layout.ComboMenu', {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'MasterSol.store.layout.MenuStore',
        'MasterSol.view.layout.OpcionesController'
    ],
    xtype: 'combomenu',
    controller:'opciones',
    fieldLabel: 'Menú',
    name: 'combomenu',
    store: {
        type: 'store_menu'
    },
    valueField: 'id',
    displayField: 'nombre',
    typeAhead: false,
    hideLabel:true,
    hideTrigger:true,
    enableKeyEvents:true,
    matchFieldWidth: false,
    minChars:2,
    emptyText: 'Select a opción...',
    listConfig: {
        loadingText: 'Buscando...',
        emptyText: 'No existen opciones....',
        itemSelector: '.search-item',
        width:300
    },
    listeners:{
        keyup:'keyUpMenu'
    }
})
