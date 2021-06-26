Ext.define('Capsules.siembra.controller.panel.JsonController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    sendJson: function () {
        var winSections = this.getWindows();
        var accessDirect = this.getDesktop();
        var menuCombo = this.getMenuCombo();
        var winCombo = this.getWindowCombo();
        var options = this.getTreeOptions();
        var configs = this.getTreeConfig();
        var theme = MasterApp.theme.getNameTheme();
        var userData = this.getUserData();
        var json = {
            sections: winSections,
            accessDirect: accessDirect,
            menuCombo: menuCombo,
            winCombo: winCombo,
            theme: theme,
            userData: userData,
            options: options,
            configs: configs
        };
        alert(Ext.encode(json));
    },

    getUserData: function () {
        var obj = {
            idrol: MasterApp.globals.getIdRol(),
            language: MasterApp.globals.getIdLanguage()
        };
        return obj;
    },

    getDesktop: function () {
        var dataview = Ext.ComponentQuery.query('dataview[name=principal]')[0];
        var store = dataview.getStore();
        var array = [];
        store.each(function (rec) {
            array.push({
                id: rec.data.id,
                name: rec.data.nombre,
                idsection: rec.data.sectionId,
                icon: rec.data.icon
            });
        });
        return array;
    },

    getMenuCombo: function () {
        var combo = Ext.ComponentQuery.query('#combomenu')[0];
        var store = combo.getStore();
        var array = [];
        store.each(function (rec) {
            array.push({
                id: rec.data.id,
                name: rec.data.nombre,
                idsection: rec.data.sectionId
            });
        });
        return array;
    },

    getWindowCombo: function () {
        var combo = Ext.ComponentQuery.query('#combowindow')[0];
        var store = combo.getStore();
        var array = [];
        store.each(function (rec) {
            array.push({
                id: rec.data.id,
                name: rec.data.name
            });
        });
        return array;
    },

    getWindows: function () {
        var menus = Ext.ComponentQuery.query('window-menu');
        var array = [];
        for (var m = 0; m < menus.length; m++) {
            var panels = menus[m].items.items[0].items.items[0].items.items;
            var comp, columns, data, obj, recSel,
                register, totals, filters,
                attachments, notes, audits;
            array.push({
                title: menus[m].title,
                idsection: menus[m].idsection,
                idmenu: menus[m].idmenu,
                collapsed: menus[m].collapsed,
                panels: []
            });
            for (var i = 0; i < panels.length; i++) {
                var type = panels[i].name;
                if (type === 'panel_section') {

                    comp = panels[i].items.items[0];
                    columns = this.getColumns(comp);
                    data = this.getData(comp);
                    recSel = this.getRecordSelected(comp);
                    recSel = [];
                    register = this.getRegister();
                    //  register = [];
                    totals = this.getTotals();
                    filters = this.getFilters();
                    attachments = this.getAttachments();
                    notes = this.getNotes();
                    audits = this.getAudit(recSel);
                    array[m].panels.push({
                        title: panels[i].title,
                        idsection: panels[i].idsection,
                        idparent: panels[i].idparent,
                        selected: recSel,
                        data: data,
                        register: register,
                        totals: totals,
                        filters: filters,
                        attachment: attachments,
                        notes: notes,
                        audits: audits,
                        columns: columns
                    });
                }
                if (type === 'tab-section') {
                    var components = panels[i].items.items;
                    for (var j = 0; j < components.length; j++) {
                        comp = components[j].items.items[0];
                        columns = this.getColumns(comp);
                        data = this.getData(comp);
                        recSel = this.getRecordSelected(comp);
                        register = this.getRegister();
                        totals = this.getTotals();
                        filters = this.getFilters();
                        attachments = this.getAttachments();
                        notes = this.getNotes();
                        audits = this.getAudit(recSel);
                        array[m].panels.push({
                            title: components[j].title,
                            idsection: components[j].idsection,
                            idparent: components[j].idparent,
                            selected: recSel,
                            data: data,
                            register: register,
                            totals: totals,
                            filters: filters,
                            attachment: attachments,
                            notes: notes,
                            audits: audits,
                            columns: columns
                        });
                    }
                }
            }
        }
        return array;
    },

    getColumns: function (panel) {
        var array = [];
        var gridSection = panel;
        var columns = gridSection.columns;
        for (var i = 0; i < columns.length; i++) {
            var filter = this.getFilterByColumn(columns[i]);
            array.push({
                xtype: columns[i].xtype,
                type: columns[i].type,
                dataIndex: columns[i].dataIndex,
                width: columns[i].width,
                text: columns[i].text,
                align: columns[i].align,
                funcion: columns[i].functions,
                sortable: columns[i].sortable,
                lockout: columns[i].lockable,
                locked: columns[i].locked,
                idregister: columns[i].idregister,
                auditable: columns[i].audit,
                required: columns[i].required,
                id_datatype: columns[i].id_datatype,
                real_name_in: columns[i].real_name_in,
                n_column: columns[i].n_column,
                real_name_out: columns[i].real_name_out,
                fk: columns[i].fk,
                filter: filter
            });
        }
        return array;
    },

    getFilterByColumn: function (column) {
        var array = [];
        var filter = column.filter;
        if (filter.type === 'boolean') {
            array.push({
                type: 'boolean'
            });
        }
        ;
        if (filter.type === 'date') {
            array.push({
                type: 'date'
            });
        }
        ;
        if (filter.type === 'datetime') {
            array.push({
                type: 'datetime'
            });
        }
        ;
        if (filter.type === 'string') {
            array.push({
                type: 'string'
            });
        }
        ;
        if (filter.type === 'string') {
            array.push({
                type: 'string'
            });
        }
        ;
        return array;
    },

    getData: function (panel) {
        var array = [];
        var gridSection = panel.items.items[0];
        var store = gridSection.getStore();
        var fields = store.model.fields;
        var items = store.data.items;
        for (var i = 0; i < items.length; i++) {
            var record = items[i];
            var obj = {};
            for (var j = 0; j < fields.length; j++) {
                var name = fields[j].name;
                obj[name] = record.data[name];
            }
            ;
            array.push(obj);
        }
        return array;
    },

    getRegister: function () {
        var array = [];
        var store = Ext.ComponentQuery.query('#register-view')[0].getStore();
        store.each(function (rec) {
            array.push({
                id: rec.data.id,
                id_datatype: rec.data.id_datatype,
                idregistro: rec.data.idregistro,
                idvalor: rec.data.idvalor,
                name: rec.data.name,
                nombre: rec.data.nombre,
                real_name_in: rec.data.real_name_in,
                required: rec.data.required,
                tipo: rec.data.tipo,
                valor: rec.data.valor,
                auditable: rec.data.auditable,
                field: rec.data.field,
                fk: rec.data.fk,
                orden: rec.data.orden
            });
        });
        return array;
    },

    getTotals: function () {
        var array = [];
        var store = Ext.ComponentQuery.query('#total-view')[0].getStore();
        store.each(function (rec) {
            array.push({
                idregistro: rec.data.idregistro,
                nombrecampo: rec.data.nombrecampo,
                nombretipodato: rec.data.nombretipodato,
                tipo: rec.data.tipo,
                tipodato: rec.data.tipodato,
                funciones: rec.data.funciones
            });
        });
        return array;
    },

    getFilters: function () {
        var array = [];
        var store = Ext.ComponentQuery.query('#filter-view')[0].getStore();
        store.each(function (rec) {
            array.push({
                idregistro: rec.data.idregistro,
                idtipodato: rec.data.idtipodato,
                nombrecampo: rec.data.nombrecampo,
                nombretipodato: rec.data.nombretipodato,
                tipo: rec.data.tipo,
                fk: rec.data.fk,
                real_name_in: rec.data.real_name_in,
                operadores: rec.data.operadores
            });
        });
        return array;
    },

    getAttachments: function () {
        var array = [];
        var attached = Ext.ComponentQuery.query('#attached-view')[0];
        var items = attached.items.items;
        for (var i = 1; i < items.length; i++) {
            array.push({
                id: items[i].idComp,
                name: items[i].nameFile,
                url: items[i].dirFile
            });
        }
        return array;
    },

    getNotes: function () {
        var array = [];
        var notes = Ext.ComponentQuery.query('#note-view')[0];
        var items = notes.items.items;
        for (var i = 0; i < items.length; i++) {
            var textarea = items[i].down('textarea');
            array.push({
                id: items[i].idNota,
                value: textarea.getValue()
            });
        }
        return array;
    },

    getAudit: function (recSel) {
        var array = [];
        var store = Ext.ComponentQuery.query('#audit-view')[0].getStore();
        store.each(function (rec) {
            array.push({
                id: rec.data.id,
                idregistro: recSel[0].data.id,
                accion: rec.data.accion,
                fecha: rec.data.fecha,
                propiedad: rec.data.propiedad,
                usuario: rec.data.usuario,
                valor_anterior: rec.data.valor_anterior,
                valor_nuevo: rec.data.valor_nuevo
            });
        });
        return array;
    },

    getRecordSelected: function (grid) {
        var hasSelection = grid.getSelectionModel().hasSelection();
        if (hasSelection) {
            var selection = grid.getSelectionModel().getSelection();
            var data = selection[0].data;
            return data;
        }
        return [];
    },

    getTreeOptions: function () {
        var array = [];
        var tree = Ext.ComponentQuery.query('tree-options')[0];
        var rootNodes = tree.getRootNode();
        rootNodes.cascadeBy(function (node) {
            if (node.data.id !== 'root') {
                array.push({
                    id: node.data.id,
                    text: node.data.text,
                    parentId: (node.data.parentId === 'root') ? '0' : node.data.parentId,
                    sectionId: node.data.sectionId,
                })
            }
        });
        return array;
    },

    getTreeConfig: function () {
        var array = [];
        var tree = Ext.ComponentQuery.query('tree-config')[0];
        var rootNodes = tree.getRootNode();
        rootNodes.cascadeBy(function (node) {
            if (node.data.id !== 'root' && node.data.id !== 'opciones') {
                array.push({
                    id: node.data.id,
                    text: node.data.text,
                    parentId: (node.data.parentId === 'opciones') ? '0' : node.data.parentId,
                    sectionId: node.data.sectionId,
                })
            }
        });
        return array;
    },

    render: function (comp) {
        Ext.ComponentQuery.query('tabmagnament')[0].add(comp);
    },

    click: function () {
        MasterApp.util.showMessageInfo('Succesful!!!');
    }
});