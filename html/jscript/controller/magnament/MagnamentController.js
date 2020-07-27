/**
 * @author mauro
 */
Ext.define('MasterSol.controller.magnament.MagnamentController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    getData: function () {
        this.cleanAll();
        var tabMagnament = Ext.ComponentQuery.query('tabmagnament')[0];
        var optionActive = tabMagnament.getActiveTab();
        Ext.ComponentQuery.query('tabmagnament')[0].show();
        Ext.ComponentQuery.query('tabmagnament')[0].expand(false);
        Ext.ComponentQuery.query('tabmagnament')[0].setDisabled(false);
        var rec = MasterApp.globals.getRecordSection();
        optionActive.idrecordsection = rec.data.id;
        if (optionActive.xtype === 'register-view') {
            MasterApp.register.getAll();
            return;
        }
        if (optionActive.xtype === 'filter-view') {
            MasterApp.filter.getAll();
            return;
        }
        if (optionActive.xtype === 'total-view') {
            MasterApp.total.getAll();
            return;
        }
        if (optionActive.xtype === 'adjunt-view') {
            MasterApp.adjunt.getAll();
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
        if (optionActive.xtype === 'adjunt-view') {
            MasterApp.adjunt.clean();
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
})