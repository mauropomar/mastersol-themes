Ext.define('MasterSol.controller.magnament.AuditController', {
        extend: 'Ext.app.Controller',
        init: function () {

        },

        showWindow: function () {
            var window = Ext.create('MasterSol.view.magnament.FormAudit');
            window.show();
            this.loadfilter();
        },

        onFilter: function () {
            var window = Ext.ComponentQuery.query('form-audit')[0];
            var mask = new Ext.LoadMask(window, {
                msg: 'Filtrando...'
            });
            mask.show();
            var grid = Ext.ComponentQuery.query('audit-view')[0];
            var store = grid.getStore();
            var record = MasterApp.globals.getRecordSection();
            idrecordsection = (record != null) ? record.data.id : null;
            var gridsection = MasterApp.globals.getGridSection();
            var window = Ext.ComponentQuery.query('audit-filter')[0];
            var property = Ext.ComponentQuery.query('#combo-property')[0].getValue();
            var action = Ext.ComponentQuery.query('#combo-action')[0].getValue();
            var user = Ext.ComponentQuery.query('#combo-users')[0].getValue();
            var startdt = Ext.ComponentQuery.query('#startdt')[0].getValue();
            var enddt = Ext.ComponentQuery.query('#enddt')[0].getValue();
            var idsection = MasterApp.util.getIdSectionActive();
            var idmenu = MasterApp.util.getIdMenuActive();
            var idrecordparent = gridsection.up('panel').idrecordparent;
            var idregisterparent = (idrecordparent) ? idrecordparent : 0;
            var idparentsection = MasterApp.util.getIdParentSectionActive();
            var record = MasterApp.globals.getRecordSection();
            idrecordsection = record.data.id;
            startdt = Ext.Date.format(startdt, 'm/d/Y');
            enddt = Ext.Date.format(enddt, 'm/d/Y');
            if (property === null && action === null && user === null && startdt === '' && enddt === '') {
                mask.hide();
                Ext.Msg.show({
                    title: 'Informaci&oacute;n',
                    msg: "Debe seleccionar al menos un criterio de b&uacute;squeda.",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                return;
            }
            var filter = {
                url: 'app/filterauditorias',
                //url: '../mastersol/app/data/producto.json',
                method: 'GET',
                scope: this,
                params: {
                    'idregistro': idrecordsection,
                    'idsection': idsection,
                    'idseccionpadre': idparentsection,
                    'idpadreregistro': idregisterparent,
                    'idmenu': idmenu,
                    'propiedad': property,
                    'accion': action,
                    'usuario': user,
                    'desde': startdt,
                    'hasta': enddt
                },
                success: function (response) {
                    mask.hide();
                    var json = Ext.JSON.decode(response.responseText);
                    var data = json.datos;
                    if (data != null) {
                        store.loadData(data);
                    } else {
                        MasterApp.util.showMessageInfo('No existen datos en auditoría para este filtro.');
                    }
                    window.close();
                },
                failure: function (response) {
                    mask.hide();
                }
            };
            Ext.Ajax.request(filter);
        },

        loadfilter: function () {
            var idsection = MasterApp.util.getIdSectionActive();
            var store_property = Ext.ComponentQuery.query('#combo-property')[0].getStore();
            store_property.proxy.extraParams = {
                idsection: idsection
            };
            store_property.load();
            var store_users = Ext.ComponentQuery.query('#combo-users')[0].getStore();
            store_users.load();
        },

        onCancel: function () {
            var window = Ext.ComponentQuery.query('form-audit')[0];
            window.close();
        },

        clean: function () {
            this.getAll();
        },

        getAll: function () {
            var idsection = MasterApp.util.getIdSectionActive();
            var record = MasterApp.globals.getRecordSection();
            idrecordsection = (record != null) ? record.data.id : null;
            var idmenu = MasterApp.util.getIdMenuActive();
            var grid = Ext.ComponentQuery.query('audit-view')[0];
            grid.isRemoveAudit = false;
            var store = grid.getStore();
            store.proxy.extraParams = {
                idregister: idrecordsection,
                idsection: idsection,
                idmenu: idmenu
            };
            store.load();
            var title = MasterApp.util.getTitleSectionSelected();
            Ext.ComponentQuery.query('#tbtext_magnament_audit')[0].setText('Auditoría: ' + title);
        },

        selectDateStart: function (field, newValue, oldValue) {
            Ext.ComponentQuery.query('#enddt')[0].setMinValue(newValue);
        },

        selectDateEnd: function (field, newValue, oldValue) {
            Ext.ComponentQuery.query('#startdt')[0].setMaxValue(newValue);
        },

        getAllRemoved: function (onScroll) {
            var grid = Ext.ComponentQuery.query('audit-view')[0];
            var store = grid.getStore();
            var mask = new Ext.LoadMask(grid, {
                msg: 'Cargando...'
            });
            mask.show();
            grid.page = (!onScroll) ? 0 : grid.page;
            var start = 50 * grid.page;
            var idsection = MasterApp.util.getIdSectionActive();
            var getAll = {
                url: 'app/auditorias_eliminados',
                method: 'GET',
                scope: this,
                params: {
                    'idsection': idsection,
                    'start': start,
                    'limit': 50
                },
                success: function (response) {
                    mask.hide();
                    var data = Ext.JSON.decode(response.responseText);
                    if (data.length > 0) {
                        var count = store.getCount();
                        for (var j = 0; j < data.length; j++) {
                            store.insert(count, data[j]);
                            count++;
                        }
                        grid.page++;
                    } else {
                        if (!onScroll)
                            MasterApp.util.showMessageInfo('No existen datos eliminados.');
                    }
                },
                failure: function (response) {
                    mask.hide();
                }
            };
            Ext.Ajax.request(getAll);
        }
    }
)