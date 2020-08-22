/**
 * @author mauro
 */
Ext.define('MasterSol.controller.magnament.MagnamentController', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'tabmagnament': {
                collapse: 'collapse',
                expand: 'expand',
                resize: 'resize',
                tabchange: 'getData'
            }
        })
    },

    getData: function (grid) {
        var idmenu = grid.idmenu;
        var idsection = grid.idsection;
        var tabMagnament = Ext.ComponentQuery.query('#tabmagnament')[0];
        tabMagnament.idmenu = idmenu;
        tabMagnament.idsectionmag = idsection;
        var optionActive = tabMagnament.getActiveTab();
        tabMagnament.show();
        tabMagnament.expand(false);
        tabMagnament.setDisabled(false);
        var rec = MasterApp.globals.getRecordSection();
        optionActive.idrecordsection = rec.data.id;
        var window = grid.up('window');
        if (window.isAlert)
            tabMagnament.child('#register-view').tab.hide();
        else
            tabMagnament.child('#register-view').tab.show();
        if (optionActive.xtype === 'register-view') {
            MasterApp.register.editRegister();
            return;
        }
        if (optionActive.xtype === 'filter-view') {
            MasterApp.filter.getAll();
            return;
        }
        if (optionActive.xtype === 'total-view') {
            MasterApp.totals.getAll();
            return;
        }
        if (optionActive.xtype === 'attached-view') {
            MasterApp.attached.getAll();
            return;
        }
        if (optionActive.xtype === 'note-view') {
            MasterApp.note.getAll();
            return;
        }
        if (optionActive.xtype === 'audit-view') {
            MasterApp.audit.getAll();
        }
    },

    cleanAll: function () {
        var tabMagnament = Ext.ComponentQuery.query('tabmagnament')[0];
        var optionActive = tabMagnament.getActiveTab();
        if (!tabMagnament.isVisible())
            return;
        if (optionActive.xtype === 'register-view') {
            MasterApp.register.clean();
            return;
        }
        if (optionActive.xtype === 'filter-view') {
            MasterApp.filter.clean();
            return;
        }
        if (optionActive.xtype === 'total-view') {
            MasterApp.total.clean();
            return;
        }
        if (optionActive.xtype === 'attached-view') {
            MasterApp.attached.clean();
            return;
        }
        if (optionActive.xtype === 'note-view') {
            MasterApp.note.clean();
            return;
        }
        if (optionActive.xtype === 'audit-view') {
            MasterApp.audit.clean();
        }
    },

    //llama a la funcion para crear un nuevo registo
    newRegister: function (window) {
        var tabMagnament = Ext.ComponentQuery.query('tabmagnament')[0];
        tabMagnament.show();
        tabMagnament.expand(false);
        tabMagnament.setDisabled(false);
        tabMagnament.setActiveTab(0);
        MasterApp.register.new(window);
    },

    isMenuTabMagnament: function (window) {
        var tabMagnament = Ext.ComponentQuery.query('tabmagnament')[0];
        if (window.idmenu == tabMagnament.idmenu) {
            tabMagnament.idmenu = null;
            tabMagnament.idsectionmag = null;
            tabMagnament.hide();
            //  tabMagnament.setDisabled(true);
            tabMagnament.collapse();
        }
    },

    resize: function () {
        MasterApp.util.resizeAllWindow();
    },

    expand: function () {
        MasterApp.util.resizeAllWindow();
    },

    collapse: function () {
        var tabMagnament = Ext.ComponentQuery.query('tabmagnament')[0];
        tabMagnament.idmenu = null;
        MasterApp.util.resizeAllWindow();
    }

})