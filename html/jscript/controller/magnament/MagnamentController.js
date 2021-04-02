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
                tabchange: 'tabChange'
            }
        })
    },

    tabChange: function (tabPanel, newCard) {
        if (newCard.xtype === 'filter-view') {
            MasterApp.filter.getAll();
            return;
        }
        if (newCard.xtype === 'total-view') {
            MasterApp.totals.getAll();
            return;
        }
        if (newCard.xtype === 'attached-view') {
            MasterApp.attached.getAll();
            return;
        }
        if (newCard.xtype === 'note-view') {
            MasterApp.note.getAll();
            return;
        }
        if (newCard.xtype === 'audit-view') {
            MasterApp.audit.getAll();
        }
    },

    getData: function (grid, columnIndex = 1) {
        var idmenu = grid.idmenu;
        var idsection = grid.idsection;
        var tabMagnament = Ext.ComponentQuery.query('#tabmagnament')[0];
        tabMagnament.idmenumag = idmenu;
        tabMagnament.idsectionmag = idsection;
        var optionActive = tabMagnament.getActiveTab();
        tabMagnament.show();
        tabMagnament.expand(false);
        tabMagnament.setDisabled(false);
        var rec = MasterApp.globals.getRecordSection();
        optionActive.idrecordsection = (rec !== null) ? rec.data.id : null;
        var window = grid.up('window');
        if (window.isAlert)
            tabMagnament.child('#register-view').tab.hide();
        else
            tabMagnament.child('#register-view').tab.show();
        if (optionActive.xtype === 'register-view') {
            MasterApp.register.editRegister(columnIndex);
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
        if (window.idmenu == tabMagnament.idmenumag) {
            tabMagnament.idmenumag = null;
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
        tabMagnament.idmenumag = null;
        this.resetTitle();
    },

    resetTitle:function(){
        Ext.ComponentQuery.query('#tbtext_magnament_note')[0].setText('Notas');
        Ext.ComponentQuery.query('#tbtext_magnament_register')[0].setText('Register');
        Ext.ComponentQuery.query('#tbtext_magnament_attach')[0].setText('Adjuntos');
        Ext.ComponentQuery.query('#tbtext_magnament_note')[0].setText('Notas');
        Ext.ComponentQuery.query('#tbtext_magnament_total')[0].setText('Totales');
        Ext.ComponentQuery.query('#tbtext_magnament_filter')[0].setText('Filtros');

    }

})