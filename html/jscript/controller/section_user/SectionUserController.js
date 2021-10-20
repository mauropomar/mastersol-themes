Ext.define('MasterSol.controller.section_user.SectionUserController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showWindow:function(){
       Ext.create('MasterSol.view.section_user.WindowSectionUser');
    },

    click:function(){
        MasterApp.util.showMessageInfo('Succesful!!!');
    }
});
