Ext.define('MasterSol.view.layout.MenuPanel', {
    extend: 'Ext.tab.Panel',
    requires: [
        'Ext.layout.container.Card',
          'MasterSol.view.layout.TreeOptions',
         'MasterSol.view.layout.TreeConfig',
        'MasterSol.view.layout.FormUser'
    ],
    xtype: 'menu-panel',
    style: 'background-color:#dfe8f6;',
    width: 300,
    height: 400,
    defaults: {
        bodyPadding: 15
    },
    items: [
        {
            xtype: 'tree-options',
            title: 'Opciones'
        },
        {
            xtype: 'form-user',
            title: 'Usuario'
        },
        {
            xtype: 'tree-config',
            title: 'Configuración'
        }
    ],
   /* listeners: {
        tabchange: 'tabchangeMenu'
    }*/
});