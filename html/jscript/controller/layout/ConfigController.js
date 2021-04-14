Ext.define('MasterSol.controller.layout.ConfigController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    select:function(record){
        var controller = MasterApp.menu;
        controller.menu.id = record.data.id;
        controller.menu.idsection = record.data.sectionId;
        controller.menu.name = record.data.text;
        controller.getData(record);
    },

    getConfigure: function () {
        var obt = {
            url: 'app/menuconfiguration',
            method: 'GET',
            scope: this,
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                if (json.length > 0) {
                    var root = {
                        text: 'Opciones',
                        id: 'opciones',
                        expanded: true,
                        children: json
                    };
                    var store = Ext.ComponentQuery.query('tree-config')[0].store;
                    store.setRootNode(root);
                }
            }
        };
        Ext.Ajax.request(obt);
    }
})