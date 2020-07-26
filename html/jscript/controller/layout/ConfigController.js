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
    }
})