Ext.application({
    name: 'MasterSol',
    appFolder: 'html/jscript',
    launch: function () {
        MasterApp = this;
        this.setAliasClass(this);
        this.showPanel();
    },

    showPanel: function () {
        var url = window.location.href;
        if (url.indexOf('theme') == -1) {
            MasterApp.login.showLogin();
        } else {
            Ext.create('MasterSol.view.layout.Viewport');
            MasterApp.theme.setStyle();
            this.loadAllOptions();
        }
    },

    loadAllOptions: function () {
        MasterApp.login.loadOptions();
    },

    setAliasClass: function (MasterApp) {
        MasterApp.util = MasterApp.getController('MasterSol.controller.util.UtilController');
        MasterApp.theme = MasterApp.getController('MasterSol.controller.util.ThemeController');
        MasterApp.globals = MasterApp.getController('MasterSol.controller.util.GlobalController');
        MasterApp.login = MasterApp.getController('MasterSol.controller.login.LoginController');
        MasterApp.menu = MasterApp.getController('MasterSol.controller.menu.MenuController');
        MasterApp.header = MasterApp.getController('MasterSol.controller.layout.HeaderController');
        MasterApp.home = MasterApp.getController('MasterSol.controller.layout.HomeController');
        MasterApp.footer = MasterApp.getController('MasterSol.controller.layout.FooterController');
        MasterApp.option = MasterApp.getController('MasterSol.controller.layout.OptionController');
        MasterApp.config = MasterApp.getController('MasterSol.controller.layout.ConfigController');
    }
});