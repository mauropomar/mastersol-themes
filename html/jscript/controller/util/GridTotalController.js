Ext.define('MasterSol.controller.util.GridTotalController', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.data = [];
        this.grid = [];
        this.hidden = true;
    },

    getComponents: function (section, columns, tools, height, data, name) {
        this.grid = Ext.create('Ext.grid.Panel', {
            store: this.getStore(columns, data),
            name: name,
            height: height,
            columnLines: true,
            hideHeaders: true,
            scrollable: false,
            resizable: false,
            region: 'south',
            border: false,
            columns: this.getColumns(columns),
            idsection: section.id,
            selModel: {
                type: 'cellmodel'
            },
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            viewConfig: {
                loadMask: false,
                loadingText: 'Cargando...'
            }
        })
        //   this.grid.hidden = this.hidden;
        return this.grid
    },

    getStore: function (columns, data) {
        var data = (data) ? data : new Array();
        columns = (columns) ? columns : new Array();
        var fields = []
        for (var i = 0; i < columns.length; i++) {
            fields.push(columns[i].dataIndex)
        }
        var name = 'store_' + Math.floor;
        var data = this.getData(fields, data);
        var store = Ext.create('Ext.data.Store', {
            alias: 'store.store_dinamic',
            fields: fields,
            data: data
        });
        return store;
    },

    getData: function (fields) {
        var datos = [];
        var obj = {};
        for (var j = 0; j < fields.length; j++) {
            obj[fields[j]] = 0.00;
        }
        datos.push(obj);
        return datos;
    },

    getColumns: function (cols) {
        cols = (cols) ? cols : new Array();
        var columns = [];
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].funcion) {
                this.hidden = false;
            }
            if (!cols[i].hidden) {
                columns.push({
                    dataIndex: MasterApp.util.getDataIndex(cols[i]),
                    width: cols[i].width,
                    operator: cols[i].funcion,
                    renderer: function (value, metaData, record, row, col) {
                        var col = this.ownerGrid.getView().getHeaderCt().getGridColumns()[col];
                        if (col.funcion) {
                            var operator = col.funcion;
                            var icon = '';
                            if (operator == "Contar")
                                icon = 'contar.png';
                            if (operator == "Sumar")
                                icon = 'suma.png';
                            if (operator == "Promedio")
                                icon = 'promedio.png';
                            if (operator == "Mínimo")
                                icon = 'minimo.png';
                            if (operator == "Maximo" || operator == "M\u00e1ximo")
                                icon = 'maximo.png';
                            return MasterApp.util.getTableIcons(icon, value);
                        }
                        value = null;
                        return value;
                    }
                })
            }
        }
        return columns;
    },

    reconfigure: function (grid, columns) {
        var data,
            newColumns = this.getColumns(columns),
            store = grid.getStore();
        var newStore = this.getStore(columns, []);
        grid.reconfigure(newStore, newColumns);
    }

})