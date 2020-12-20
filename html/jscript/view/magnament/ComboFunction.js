Ext.define('MasterSol.view.magnament.ComboFunction', {
    extend: 'Ext.form.field.ComboBox',
    requires: ['MasterSol.store.magnament.FunctionStore'],
    xtype: 'combo-function',
    valueField: 'nombre',
    displayField: 'nombre',
    triggerAction: 'all',
    queryMode: 'local',
    store: {
        type: 'store-function'
    },
    listeners: {
        specialKey: 'specialKey',
        beforequery: function(record){
            record.query = new RegExp(record.query, 'ig');
        }
    }
})