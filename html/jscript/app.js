Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false
});
Ext.application({
    name: 'MasterSol',
    appFolder: 'html/jscript',
    launch: function () {
        MasterApp = this;
        MasterApp.globals = MasterApp.getController('MasterSol.controller.util.GlobalController');
        MasterApp.login = MasterApp.getController('MasterSol.controller.login.LoginController');
        MasterApp.alert = MasterApp.getController('MasterSol.controller.alert.AlertController');
        this.showPanel();
    },

    showPanel() {
        var url = window.location.href;
        if (url.indexOf('theme') == -1) {
            MasterApp.getController('MasterSol.controller.login.LoginController').showLogin();
        } else {
            Ext.create('MasterSol.view.layout.Viewport');
            this.loadAllOptions();
        }
    },

    loadAllOptions(){
        MasterApp.login.loadOptions();
    }

});