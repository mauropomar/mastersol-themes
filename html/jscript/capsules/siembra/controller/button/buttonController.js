Ext.define('Capsules.siembra.controller.button.buttonController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    render:function(comp){
        Ext.ComponentQuery.query('#footer-panel')[0].insert(3,comp);
    },

    click:function(){
        MasterApp.util.showMessageInfo('Succesful!!!');
    }
});