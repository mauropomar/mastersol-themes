Ext.define('MasterSol.controller.layout.HomeController', {
    extend: 'Ext.app.Controller',
    alias: 'controller.home',
    init: function () {

    },

    renderDataView: function (view) {
        this.setDropConfig(view);
        this.setContextMenu();
    },

    setDropConfig: function (view) {
        new Ext.view.DropZone({
            view: view,
            ddGroup: 'two-tree-dataview',
            scope: this,
            handleNodeDrop: function (data, record, position) {
                var node = data.records[0];
                if (node.isLeaf())
                    MasterApp.home.addMenu(node);
            }
        });
    },

    showContextMenuDataview: function (view, rec, node, index, e) {
        this.recordAccess = rec;
        e.stopEvent();
        this.contextMenu.showAt(e.getXY());
        return false;
    },

    setContextMenu: function () {
        var deleteAction = Ext.create('Ext.Action', {
            iconCls: 'fa fa-trash',
            text: 'Eliminar',
            scope: this,
            handler: function (widget, event) {
                this.deleteMenu();
            }
        });
        this.contextMenu = Ext.create('Ext.menu.Menu', {
            items: [deleteAction]
        });
    },

    selectMenu: function (view, record) {
        MasterApp.menu.select(view, record);
    },

    addMenu: function (node) {
        var view = Ext.ComponentQuery.query('MainView')[0];
        var mask = new Ext.LoadMask(view, {
            msg: 'Guardando cambios...'
        });
        mask.show();
        var save = {
            url: 'app/addshortcut',
            method: 'POST',
            scope: this,
            params: {
                id_menu: node.id,
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    this.insertNode(node.data);
                }
            }
        };
        Ext.Ajax.request(save);
    },

    insertNode: function (data) {
        var dataview = Ext.ComponentQuery.query('dataview-home')[0].down('dataview');
        var store = dataview.getStore();
        var index = store.findExact('nombre', data.text);
        if (index > -1) {
            Ext.Msg.show({
                title: 'Información',
                msg: 'Ya existe un acceso directo con ese nombre.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return
        }
        ;
        var newRecord = new MasterSol.model.layout.DataViewModel({
            id: data.id,
            nombre: data.text,
            icon: 'camion2.jpg',
            sectionId: data.sectionId
        });
        store.insert(store.getCount(), newRecord);
    },

    deleteMenu: function () {
        var record = this.recordAccess;
        Ext.Msg.confirm('Confirmaci&oacute;n', '&iquest;Est&aacute; seguro que desea eliminar la opción seleccionada?', function (conf) {
            if (conf == 'yes') {
                var eliminar = {
                    url: 'app/delshortcut',
                    method: 'POST',
                    scope: this,
                    params: {
                        id: record.data.id,
                        accion: '10',
                    },
                    success: function (response) {
                        var store = Ext.ComponentQuery.query('dataview-home')[0].down('dataview').getStore();
                        store.remove(record);
                    }
                };
                Ext.Ajax.request(eliminar);
            }
        });
    }
})