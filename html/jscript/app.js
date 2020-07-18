Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false
});
Ext.application({
    name: 'MasterSol',
    appFolder:'html/jscript',
    launch: function () {
        MasterApp = this;
     //   Ext.create('MasterSol.view.layout.Viewport');
        MasterApp.globals =  MasterApp.getController('MasterSol.controller.util.GlobalController');
        MasterApp.getController('MasterSol.controller.login.LoginController').showLogin();
    }
});