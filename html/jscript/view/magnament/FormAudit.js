Ext.define('MasterSol.view.magnament.FormAudit', {
    extend: 'Ext.window.Window',
    requires: ['MasterSol.store.magnament.PropertyStore', 'MasterSol.store.magnament.ActionStore', 'MasterSol.store.magnament.UsersStore'],
    xtype: 'form-audit',
    bodyPadding: 10,
    height: MasterApp.theme.getHeight('form-audit'),
    width: 400,
    title: 'Filtro Auditoría',
    modal: true,
    layout: 'fit',
    items: [{
        xtype: 'form',
        border: false,
        bodyPadding: 10,
        items: [{
            xtype: 'fieldcontainer',
            layout: 'hbox',
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 40
            },
            items: [
                {
                    xtype: 'combobox',
                    publishes: 'id',
                    fieldLabel: 'Propiedades',
                    id: 'combo-property',
                    flex:2,
                    valueField:'id',
                    displayField: 'nombre',
                    emptyText: 'Seleccione...',
                    store: {
                        type: 'store-property'
                    },
                    minChars: 0,
                    queryMode: 'local',
                    typeAhead: true,
                    margin: '0 10 0 0'
                }, {
                    xtype: 'combobox',
                    publishes: 'id',
                    fieldLabel: 'Acción',
                    valueField:'id',
                    flex:2,
                    displayField: 'nombre',
                    emptyText: 'Seleccione...',
                    store: {
                        type: 'store-action'
                    },
                    id: 'combo-action',
                    minChars: 0,
                    queryMode: 'local',
                    typeAhead: true
                }]
        }, {
            xtype: 'fieldcontainer',
            layout: 'fit',
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 40
            },
            items: [{
                xtype: 'combobox',
                publishes: 'id',
                fieldLabel: 'Usuarios',
                valueField:'id',
                displayField: 'nombre',
                emptyText: 'Seleccione...',
                store: {
                    type: 'store-users'
                },
                id: 'combo-users',
                minChars: 0,
                queryMode: 'local',
                typeAhead: true,
            }]
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 40
            },
            items: [
                {
                    xtype: 'datefield',
                    fieldLabel: 'Desde',
                    format: 'd/m/Y',
                    name: 'startdt',
                    id: 'startdt',
                    flex:2,
                    margin: '0 10 0 0',
                    value: new Date(),
                    listeners: {
                        change: function(field, newValue, oldValue){
                            MasterApp.audit.selectDateStart(field, newValue, oldValue);
                        }
                    }
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'Hasta',
                    format: 'd/m/Y',
                    name: 'enddt',
                    flex:2,
                    id: 'enddt',
                    value: new Date(),
                    listeners: {
                        change: function(field, newValue, oldValue){
                            MasterApp.audit.selectDateEnd(field, newValue, oldValue);
                        }
                    }
                }]
        }]
    }
    ],
    buttons: [
        {
            text: 'Aceptar',
            handler:function(){
                MasterApp.audit.onFilter()
            }
        },
        {
            text: 'Cancelar',
            handler:function(){
                MasterApp.audit.onCancel()
            }
        }
    ],
    listeners:{
        afterrender:function(){
            var date = new Date();
            Ext.ComponentQuery.query('#enddt')[0].setMinValue(date);
            Ext.ComponentQuery.query('#startdt')[0].setMaxValue(date);
        }
    }
})