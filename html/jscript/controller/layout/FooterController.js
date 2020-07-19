Ext.define('MasterSol.controller.layout.FooterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.footer',
    clickAccessDirect: function (tree, record) {
        if (record.isLeaf()) {
            var controller = Ext.ComponentQuery.query('tree-options')[0].controller;
            controller.record.id = record.data.id;
            controller.record.nombre = record.data.text;
            controller.record.idsection = record.data.sectionId;
            // controller.obtenerProducto(record);
        } else {
            // MasterApp.util.showMessageInfo('Debe seleccionar una opción a último nivel');
        }
    },
    tabChangeMenu: function (tabPanel, newCard) {
        if (newCard.xtype == 'tree-opciones') {
            // MasterApp.getController('MasterSol.view.login.LoginController').obtenerOpciones();
        }
        if (newCard.xtype == 'tree-config') {
            //  MasterApp.getController('MasterSol.view.login.LoginController').obtenerAccesos();
        }
    },
    selectMenu: function (combo, record) {
        var controller = Ext.ComponentQuery.query('tree-options')[0].controller;
        controller.record.id = record.data.id;
        controller.record.idsection = record.data.sectionId;
        controller.record.nombre = record.data.nombre;
        controller.getProduct(record);
        if (combo.xtype == 'combomenu')
            combo.reset();
    }
})