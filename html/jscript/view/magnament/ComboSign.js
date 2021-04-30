Ext.define('MasterSol.view.magnament.ComboSign', {
    extend: 'Ext.form.field.ComboBox',
    requires:['MasterSol.store.magnament.SignStore'],
    xtype: 'combo-sign',
    valueField: 'simbolo',
    displayField: 'simbolo',
    triggerAction: 'all',
    queryMode:'local',
    store: {
        type: 'store-sign'
    },
    listeners:{
        select : function(combo, record){
           MasterApp.filter.selectOperator(combo, record)
        },
        specialKey:function(field, e){
            MasterApp.filter.specialKey(field, e)
        }
    }
})