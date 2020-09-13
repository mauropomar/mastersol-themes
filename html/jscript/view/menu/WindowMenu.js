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
    constrainTo:'panel-menu',
    requires: ['Ext.resizer.Splitter', 'Ext.layout.container.VBox', 'Ext.panel.Panel'],
    closable: false,
    autoScroll: true,
    closeAction:'destroy',
    layout: 'fit',
    isAlert:false,
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
       // resize: 'resizeWindow',
        close: function(window){
            MasterApp.section.closeWindow(window);
        },
       render:function( window , eOpts){
           MasterApp.theme.setStyleWindow(window);
       }
   }
});
