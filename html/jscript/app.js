


Ext.application({
    name: 'MasterSol',
    appFolder: 'html/jscript',
    launch: function () {
        MasterApp = this;
        this.setNameClass(this);
        this.showPanel();
    },

    showPanel:function() {
        var url = window.location.href;
        if (url.indexOf('theme') == -1) {
            MasterApp.login.showLogin();
        } else {
            Ext.create('MasterSol.view.layout.Viewport');
            MasterApp.theme.setStyle();
            this.loadAllOptions();
        }
    },

    loadAllOptions:function(){
        MasterApp.login.loadOptions();
    },

    setNameClass:function(MasterApp){
        MasterApp.globals = MasterApp.getController('MasterSol.controller.util.GlobalController');
        MasterApp.login = MasterApp.getController('MasterSol.controller.login.LoginController');
        MasterApp.alert = MasterApp.getController('MasterSol.controller.alert.AlertController');
        MasterApp.theme = MasterApp.getController('MasterSol.controller.util.ThemeController');
        MasterApp.menu = MasterApp.getController('MasterSol.controller.menu.MenuController');
        MasterApp.tools = MasterApp.getController('MasterSol.controller.util.ToolsController');
        MasterApp.containersections = MasterApp.getController('MasterSol.controller.util.ContainerSectionsController');
    }


});