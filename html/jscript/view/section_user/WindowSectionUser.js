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
    idmenu:'',
    height:230,
    width: 350,
    layout: 'fit',
    autoShow: true,
    border: false,
    requires: [],
    items: [{
        xtype: 'form',
        frame:true,
        bodyPadding: 10,
        defaults: {
            labelAlign: 'top',
            anchor: '100%',
            labelWidth: 60
        },
        items: [{
            xtype: 'textfield',
            allowBlank: true,
            fieldLabel: 'Nueva Vista',
            id: 'txt_new_view_section'
        }, {
            xtype: 'combo',
            id: 'combo_view_section',
            valueField:'Id',
            displayField:'Nombre',
            store:Ext.create('MasterSol.store.section_user.SectionUserStore'),
            typeAhead: true,
            fieldLabel: 'Selccione una Vista',
            queryMode: 'local',
            emptyText: 'Seleccione una vista...',
            allowBlank:false,
            blankText:'Debe introducir una vista.'
        },{
            xtype:'checkbox',
            fieldLabel:'Por defecto',
            labelAlign: 'left',
            labelWidth:80,
            id: 'checkbox_default',
            value:false,
            margin:'10 0 0 0'
        }]
    }],
    buttons:[{
        xtype:'button',
        iconCls:'fa fa-file-text',
        text:'Mostrar'
    },{
        xtype:'button',
        iconCls:'fa fa-save',
        text:'Guardar',
        handler:function(btn){
            var window = btn.up('window');
           MasterApp.getController('MasterSol.controller.section_user.SectionUserController').saveData(window);
        }
    },{
        xtype:'button',
        iconCls:'fa fa-close',
        text:'Cerrar'
    }]
});
