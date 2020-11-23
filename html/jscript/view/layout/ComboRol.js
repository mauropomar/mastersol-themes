Ext.define('MasterSol.view.layout.ComboRol', {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'MasterSol.store.layout.RolStore'
    ],
    xtype: 'comborol',
    fieldLabel: 'Rol',
    name: 'comborol',
    store: {
        type: 'store_rol'
    },
    valueField: 'id',
    displayField: 'nombre',
    typeAhead: true,
    queryMode: 'local',
    emptyText: 'Seleccione un rol...',
    allowBlank:false,
    blankText:'Debe introducir un rol.'
})