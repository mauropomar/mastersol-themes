Ext.define('MasterSol.controller.magnament.AuditController', {
        extend: 'Ext.app.Controller',
        init: function () {

        },

        showWindow: function () {
            var window = Ext.create('MasterSol.view.magnament.FilterAudit');
            window.show();
            this.loadfilter();
        },

        filter: function () {
            var grid = Ext.ComponentQuery.query('audit-view')[0];
            var store = grid.getStore();
            var idsection = MasterApp.util.getIdSectionActive();
            var idmenu = MasterApp.util.getIdMenuActive();
            var record = MasterApp.globals.getRecordSection();
            idrecordsection = record.data.id;
            var gridsection = MasterApp.globals.getGridSection();
            var window = Ext.ComponentQuery.query('audit-filter')[0];
            var property = Ext.ComponentQuery.query('#combo_property')[0].getValue();
            var action = Ext.ComponentQuery.query('#combo_action')[0].getValue();
            var user = Ext.ComponentQuery.query('#combo_users')[0].getValue();
            var datestart = Ext.ComponentQuery.query('datefield')[0].getValue();
            var dateend = Ext.ComponentQuery.query('datefield')[1].getValue();
            var idsection = MasterApp.util.getIdSectionActive();
            var idmenu = MasterApp.util.getIdMenuActive();
            var idrecordparent = gridsection.up('panel').idrecordparent;
            var idregisterparent = (idrecordparent) ? idrecordparent : 0;
            var idparentsection = MasterApp.util.getIdParentSectionActive();
            var record = MasterApp.globals.getRecordSection();
            idrecordsection = record.data.id;
            datestart = Ext.Date.format(datestart, 'm/d/Y');
            dateend = Ext.Date.format(dateend, 'm/d/Y');
            if (property === null && action === null && user === null && datestart === '' && dateend === '') {
                Ext.Msg.show({
                    title: 'Informaci&oacute;n',
                    msg: "Debe seleccionar al menos un criterio de b&uacute;squeda.",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
                return;
            }
            var mask = new Ext.LoadMask(window, {
                msg: 'Filtrando...'
            });
            mask.show();
            var filter = {
                url: 'php/manager/getfilterauditorias.php',
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
                    'desde': datestart,
                    'hasta': dateend
                },
                success: function (response) {
                    mask.hide();
                    var json = Ext.JSON.decode(response.responseText);
                    var data = json.datos;
                    if (data != null) {
                        store.loadData(data);
                    } else {
                        MasterApp.util.showMessageInfo('No existen datos en auditoría.');
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
            var store_property = Ext.ComponentQuery.query('#combo_property')[0].getStore();
            store_property.proxy.extraParams = {
                idsection: idsection
            }
            store_property.load();
            var store_users = Ext.ComponentQuery.query('#combo_users')[0].getStore();
            store_users.load();
        },

        onFormCancel: function () {
            var window = Ext.ComponentQuery.query('audit-filter')[0];
            window.close();
        },

        clean: function () {
            var grid = Ext.ComponentQuery.query('audit-view')[0];
            grid.getStore().removeAll();
        },

        getAll: function () {
            var idsection = MasterApp.util.getIdSectionActive();
            var record = MasterApp.globals.getRecordSection();
            idrecordsection = record.data.id;
            var idmenu = MasterApp.util.getIdMenuActive();
            var grid = Ext.ComponentQuery.query('audit-view')[0];
            var store = grid.getStore();
            store.proxy.extraParams = {
                idregister: idrecordsection,
                idsection: idsection,
                idmenu: idmenu
            };
            store.load();
        },

        selectDateStart: function (field, newValue, oldValue) {
            Ext.ComponentQuery.query('#txt_fecha_start')[0].setMinValue(newValue);
        },

        selectDateEnd: function (field, newValue, oldValue) {
            Ext.ComponentQuery.query('#txt_fecha_end')[0].setMaxValue(newValue);
        }
    }
)