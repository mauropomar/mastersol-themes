/**
 * Demonstrates a basic window control.
 */
Ext.define('MasterSol.view.menu.WindowMenu', {
    extend: 'Ext.window.Window',
    xtype: 'window-menu',
    idComp: null,
    scrollable: true,
    name: 'window-menu',
    isminimize: false,
    bodyPadding: 3,
    constrain: true,
    constrainTo:'panel-center',
    requires: ['Ext.resizer.Splitter', 'Ext.layout.container.VBox', 'Ext.panel.Panel'],
    closable: false,
    autoScroll: true,
    closeAction:'destroy',
    layout: 'fit',
    isAlert:false,
    childs:[],
    tabs:[],
   // tools:this.tools,
    items: [{
        xtype: 'panel',
        name: 'container-menu',
        layout: 'fit',
        items: [{
            xtype: 'container',
            layout: {
                type: 'vbox', // Arrange child items vertically
                align: 'stretch', // Each takes up full width
                //  padding: 5
            }
        }]
    }],
   listeners: {
        resize: function(window){
            MasterApp.section.resizeWindow(window);
        },
        close: function(window){
            MasterApp.section.closeWindow(window);
        },
       render:function( window , eOpts){
           MasterApp.theme.setStyleWindow(window);
       }
   }
});
