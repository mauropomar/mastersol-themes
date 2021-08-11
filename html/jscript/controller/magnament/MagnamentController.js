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
        if (newCard.xtype === 'register-view') {
            MasterApp.register.editRegister(0);
            return;
        }
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
        if (newCard.xtype === 'config-report-view') {
            // MasterApp.report.getAll();
        }
    },

    getData: function (grid, columnIndex = 1) {
        var idmenu = grid.idmenu;
        var idsection = grid.idsection;
        var tabMagnament = Ext.ComponentQuery.query('#tabmagnament')[0];
        var optionActive = tabMagnament.getActiveTab();
        tabMagnament.show();
        tabMagnament.expand(false);
        tabMagnament.setDisabled(false);
        tabMagnament.idmenumag = idmenu;
        tabMagnament.idsectionmag = idsection;
        var rec = MasterApp.globals.getRecordSection();
        optionActive.idrecordsection = (rec !== null) ? rec.data.id : null;
        var window = grid.up('window');
        if (window.isAlert || grid.read_only) {
            tabMagnament.child('#register-view').tab.hide();
            Ext.ComponentQuery.query('#register-view')[0].hide();
            Ext.ComponentQuery.query('#tabmagnament')[0].setActiveTab(1);
        } else {
            if (!tabMagnament.child('#register-view').tab.isVisible()) {
                tabMagnament.child('#register-view').tab.show();
                Ext.ComponentQuery.query('#register-view')[0].show();
            }
        }
        if (optionActive.xtype === 'register-view') {
            MasterApp.register.editRegister(columnIndex);
            return;
        }
        if (optionActive.xtype === 'filter-view') {
            MasterApp.filter.getAll(columnIndex);
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
        if (optionActive.xtype === 'config-report-view') {
            MasterApp.report.getAll();
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
            MasterApp.totals.clean();
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
            return;
        }
        if (optionActive.xtype === 'config-report-view') {
            MasterApp.report.clean();
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
        var title = MasterApp.util.getTitleSectionSelected();
        Ext.ComponentQuery.query('#tbtext_magnament_register')[0].setText('Register: ' + title);
    },

    isMenuTabMagnament: function (window) {
        var tabMagnament = Ext.ComponentQuery.query('tabmagnament')[0];
        if (window.idmenu == tabMagnament.idmenumag || tabMagnament.idmenumag == null) {
            tabMagnament.idsectionmag = null;
            MasterApp.globals.resetGridSection();
            tabMagnament.hide();
            tabMagnament.collapse();
            tabMagnament.setActiveTab(0);
        }
    },

    resize: function () {
        MasterApp.util.resizeAllWindow();
    },

    expand: function () {
        //  MasterApp.util.resizeAllWindow();
    },

    resetTitle: function () {
        Ext.ComponentQuery.query('#tbtext_magnament_note')[0].setText('Notas');
        Ext.ComponentQuery.query('#tbtext_magnament_register')[0].setText('Register');
        Ext.ComponentQuery.query('#tbtext_magnament_attached')[0].setText('Adjuntos');
        Ext.ComponentQuery.query('#tbtext_magnament_note')[0].setText('Notas');
        Ext.ComponentQuery.query('#tbtext_magnament_total')[0].setText('Totales');
        Ext.ComponentQuery.query('#tbtext_magnament_filter')[0].setText('Filtros');
    },

    aplyKeyMap: function () {
        document.addEventListener('keydown', function (e) {
            if (e.key === 'F2' || e.key === 'F3' || e.key === 'F4' || e.key === 'F5' || e.key === 'F6'|| e.key === 'F7') {
                e.cancelBubble = true;
                e.cancelable = true;
                e.stopPropagation();
                e.preventDefault();
                e.returnValue = false;
                var tabMagnament = Ext.ComponentQuery.query('#tabmagnament')[0];
                tabMagnament.show();
                tabMagnament.expand(false);
                tabMagnament.setDisabled(false);
                var gridSection = MasterApp.globals.getGridSection();
                tabMagnament.idmenumag = gridSection.idmenu;
                tabMagnament.idsectionmag = gridSection.idsection;
                if(e.key === 'F2'){
                    Ext.ComponentQuery.query('#tabmagnament')[0].setActiveTab(0);
                    MasterApp.register.editRegister(0);
                }
                if(e.key === 'F3'){
                    Ext.ComponentQuery.query('#tabmagnament')[0].setActiveTab(1);
                    MasterApp.filter.getAll(0);
                }
                if(e.key === 'F4'){
                    Ext.ComponentQuery.query('#tabmagnament')[0].setActiveTab(2);
                    MasterApp.totals.getAll(0);
                }
                if(e.key === 'F5'){
                    Ext.ComponentQuery.query('#tabmagnament')[0].setActiveTab(3);
                    MasterApp.attached.getAll();
                }
                if(e.key === 'F6'){
                    Ext.ComponentQuery.query('#tabmagnament')[0].setActiveTab(4);
                    MasterApp.note.getAll();
                }
                if(e.key === 'F7'){
                    Ext.ComponentQuery.query('#tabmagnament')[0].setActiveTab(5);
                    MasterApp.audit.getAll();
                }
            }

        });
    }

})