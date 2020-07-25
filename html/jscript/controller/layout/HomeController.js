Ext.define('MasterSol.controller.layout.HomeController', {
    extend: 'Ext.app.Controller',
    alias: 'controller.home',
    init: function () {

    },
  //  recordAccess: null,
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
                var nodeTree = data.records[0];
                if (nodeTree.isLeaf())
                    this.addAcess(nodeTree);
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
                this.deleteAccess();
            }
        });
        this.contextMenu = Ext.create('Ext.menu.Menu', {
            items: [deleteAction]
        });
    },

    selectMenu: function (view, record) {
        MasterApp.menu.select(view, record);
    },

    addAcess: function (node) {
        var view = Ext.ComponentQuery.query('MainView')[0];
        var mask = new Ext.LoadMask(view, {
            msg: 'Guardando cambios...'
        });
        mask.show();
        var guardar = {
            url: '../mastersol/app/data/secciones.json',
            method: 'GET',
            scope: this,
            params: {
                idopcion: node.id,
                accion:'9',
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                this.insertNode(node);
            }
        };
        Ext.Ajax.request(guardar);
    },

    insertNode: function (node) {
        var dataview = Ext.ComponentQuery.query('dataview-home')[0].down('dataview');
        var store = dataview.getStore();
        var index = store.findExact('nombre', node.data.text);
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
            id: node.id,
            nombre: node.data.text,
            icon: 'camion2.jpg',
            sectionId: node.data.sectionId
        });
        store.insert(store.getCount(), newRecord);
    },

    deleteAccess: function () {
        var record = this.recordAccess;
        Ext.Msg.confirm('Confirmaci&oacute;n', '&iquest;Est&aacute; seguro que desea eliminar la opción seleccionada?', function (conf) {
            if (conf == 'yes') {
                var eliminar = {
                    url: 'php/manager/managerShortcut.php',
                    method: 'POST',
                    scope: this,
                    params: {
                        id: record.data.id,
                        accion:'10',
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