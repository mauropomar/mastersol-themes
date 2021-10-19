Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
      //  'Capsules': 'html/jscript/capsules',
        'Capsules': 'capsules'
    }
});


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
        MasterApp.user = MasterApp.getController('MasterSol.controller.layout.UserController');
        MasterApp.home = MasterApp.getController('MasterSol.controller.layout.HomeController');
        MasterApp.footer = MasterApp.getController('MasterSol.controller.layout.FooterController');
        MasterApp.option = MasterApp.getController('MasterSol.controller.layout.OptionController');
        MasterApp.config = MasterApp.getController('MasterSol.controller.layout.ConfigController');
        MasterApp.alert = MasterApp.getController('MasterSol.controller.alert.AlertController');
        MasterApp.section = MasterApp.getController('MasterSol.controller.menu.SectionController');
        MasterApp.containersections = MasterApp.getController('MasterSol.controller.util.ContainerSectionsController');
        MasterApp.gridsections = MasterApp.getController('MasterSol.controller.util.GridSectionController');
        MasterApp.gridtotal = MasterApp.getController('MasterSol.controller.util.GridTotalController');
        MasterApp.tools = MasterApp.getController('MasterSol.controller.util.ToolsController');
        MasterApp.magnament = MasterApp.getController('MasterSol.controller.magnament.MagnamentController');
        MasterApp.register = MasterApp.getController('MasterSol.controller.magnament.RegisterController');
        MasterApp.filter = MasterApp.getController('MasterSol.controller.magnament.FilterController');
        MasterApp.totals = MasterApp.getController('MasterSol.controller.magnament.TotalController');
        MasterApp.report = MasterApp.getController('MasterSol.controller.magnament.ConfigReportController');
        MasterApp.capsule = MasterApp.getController('MasterSol.controller.capsule.CapsuleExportController');
    },
});
