/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.section_user.WindowSectionUser', {
    extend: 'Ext.window.Window',
    xtype: 'window-chart',
    closable: true,
    name: 'window-section-user',
    title: 'Configuración de Vistas',
    closeAction: 'destroy',
    control: 'MasterSol.controller.section_user.SectionUserController',
    idsection: '',
    height: 230,
    width: 350,
    layout: 'fit',
    autoShow: true,
    border: false,
    requires: [],
    items: [{
        xtype: 'form',
        frame: true,
        bodyPadding: 10,
        defaults: {
            labelAlign: 'top',
            anchor: '100%',
            labelWidth: 60
        },
        items: [{
            xtype: 'textfield',
            allowBlank: true,
            flex:1,
            fieldLabel: 'Nueva Vista',
            id: 'txt_new_view_section'
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            items: [{
                xtype: 'combo',
                id: 'combo_view_section',
                valueField: 'id',
                displayField: 'nombre',
                store: Ext.create('MasterSol.store.section_user.SectionUserStore'),
                typeAhead: true,
                fieldLabel: 'Selccione una Vista',
                queryMode: 'local',
                labelAlign:'top',
                flex:1,
                margin:'0 10 0 0',
                listConfig: {
                    cls: 'custom-list',
                    getInnerTpl: function () {
                        return '<span<tpl if="default"> class="x-section-default"</tpl>>{nombre}</span>';
                    }
                },
                listeners: {
                    select: function (combo, record) {
                        MasterApp.getController('MasterSol.controller.section_user.SectionUserController').selectView(combo, record);
                    }
                }
            },{
                xtype:'button',
                iconCls:'fa fa-undo',
                tooltip:'Resetear Sección por Defecto',
                margin:'22 0 0 0',
                handler:function(btn){
                    var window = btn.up('window');
                    MasterApp.getController('MasterSol.controller.section_user.SectionUserController').resetView(window);
                }
            }]
        }, {
            xtype: 'checkbox',
            fieldLabel: 'Por defecto',
            labelAlign: 'left',
            labelWidth: 70,
            id: 'checkbox_default',
            value: false,
            margin: '10 0 0 0'
        }]
    }],
    buttons: [{
        xtype: 'button',
        iconCls: 'fa fa-file-text',
        text: 'Mostrar',
        handler: function (btn) {
            var window = btn.up('window');
            MasterApp.getController('MasterSol.controller.section_user.SectionUserController').showView(window);
        }
    }, {
        xtype: 'button',
        iconCls: 'fa fa-save',
        text: 'Guardar',
        handler: function (btn) {
            var window = btn.up('window');
            MasterApp.getController('MasterSol.controller.section_user.SectionUserController').saveData(window);
        }
    }, {
        xtype: 'button',
        iconCls: 'fa fa-trash',
        text: 'Eliminar',
        handler: function (btn) {
            var window = btn.up('window');
            MasterApp.getController('MasterSol.controller.section_user.SectionUserController').deleteView(window);
        }
    }, {
        xtype: 'button',
        iconCls: 'fa fa-close',
        text: 'Cerrar',
        handler: function (btn) {
            var window = btn.up('window');
            window.close();
        }
    }]
});
