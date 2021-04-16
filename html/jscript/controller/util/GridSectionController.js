Ext.define('MasterSol.controller.util.GridSectionController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    getComponents(section, columns, tools, height, data, name, windowParent, atributos) {
        return Ext.create('Ext.grid.Panel', {
            btnTools: tools,
            selType: (atributos.section_checked) ? 'checkboxmodel' : null,
            idsection: section.id,
            idmenu: windowParent.idmenu,
            name: name,
            section_checked: atributos.section_checked,
            store: this.getStore(columns, data),
            height: height,
            max_line: section.max_lines,
            read_only: section.read_only,
            region: 'center',
            autoScroll: true,
            plugins: [{
                ptype: 'gridfilters'
            }],
            columns: this.getColumns(columns),
            viewConfig: {
                loadMask: false,
                loadingText: 'Cargando...'
            },
            listeners: {
                'columnmove': function (ct, column, from, to, event) {
                    //     MasterApp.util.moveColumn(ct, column, from, to, event)
                }
            }
        })
    },

    getStore(columns, data) {
        var data = (data) ? data : new Array();
        var fields = []
        for (var i = 0; i < columns.length; i++) {
            fields.push(columns[i].dataIndex)
        }
        var name = 'store_' + Math.floor;
        var store = Ext.create('Ext.data.Store', {
            alias: 'store.store_dinamic',
            fields: fields,
            data: data
        })
        return store;
    },

    getColumns(cols) {
        var columns = [];
        for (var i = 0; i < cols.length; i++) {
            if (!cols[i].hidden) {
                if (cols[i].type === 'boolean') {
                    columns.push({
                        xtype: 'checkcolumn',
                        dataIndex: MasterApp.util.getDataIndex(cols[i]),
                        width: cols[i].width,
                        text: cols[i].text,
                        align: cols[i].align,
                        functions: cols[i].funcion,
                        type: cols[i].type,
                        sortable: cols[i].sortable,
                        lockable: cols[i].lockout,
                        locked: cols[i].lockout,
                        idregister: cols[i].idregister,
                        audit: cols[i].auditable,
                        required: cols[i].required,
                        id_datatype: cols[i].id_datatype,
                        real_name_in: cols[i].real_name_in,
                        n_column: cols[i].n_column,
                        real_name_out: cols[i].real_name_out,
                        fk: cols[i].fk,
                        filter: {
                            type: 'boolean',
                            yesText: 'Verdadero',
                            noText: 'Falso'
                        },
                        listeners: {
                            beforecheckchange: function (me, rowIndex, checked, record, e, eOpts) {
                                return false;
                            }
                        }
                    })
                }
                ;
                if (cols[i].type === 'number') {
                    columns.push({
                        dataIndex: MasterApp.util.getDataIndex(cols[i]),
                        width: cols[i].width,
                        text: cols[i].text,
                        align: cols[i].align,
                        functions: cols[i].funcion,
                        type: cols[i].type,
                        sortable: cols[i].sortable,
                        lockable: cols[i].lockout,
                        locked: cols[i].lockout,
                        idregister: cols[i].idregister,
                        audit: cols[i].auditable,
                        align: 'right',
                        required: cols[i].required,
                        id_datatype: cols[i].id_datatype,
                        real_name_in: cols[i].real_name_in,
                        real_name_out: cols[i].real_name_out,
                        n_column: cols[i].n_column,
                        fk: cols[i].fk,
                        filter: {
                            type: 'number',
                            emptyText: 'Instroduzca un ' + cols[i].text + '.'
                        }
                    })
                }
                if (cols[i].type === 'string') {
                    columns.push({
                        dataIndex: MasterApp.util.getDataIndex(cols[i]),
                        width: cols[i].width,
                        text: cols[i].text,
                        // align: cols[i].align,
                        functions: cols[i].funcion,
                        type: cols[i].type,
                        sortable: cols[i].sortable,
                        lockable: cols[i].lockout,
                        locked: cols[i].lockout,
                        idregister: cols[i].idregister,
                        audit: cols[i].auditable,
                        required: cols[i].required,
                        align: 'left',
                        id_datatype: cols[i].id_datatype,
                        real_name_in: cols[i].real_name_in,
                        real_name_out: cols[i].real_name_out,
                        n_column: cols[i].n_column,
                        fk: cols[i].fk,
                        filter: {
                            type: 'string',
                            emptyText: 'Instroduzca un ' + cols[i].text + '.'
                        }
                    })
                }
                if (cols[i].type === 'array') {
                    columns.push({
                        dataIndex: MasterApp.util.getDataIndex(cols[i]),
                        width: cols[i].width,
                        text: cols[i].text,
                        // align: cols[i].align,
                        functions: cols[i].funcion,
                        type: cols[i].type,
                        sortable: cols[i].sortable,
                        lockable: cols[i].lockout,
                        locked: cols[i].lockout,
                        idregister: cols[i].idregister,
                        audit: cols[i].auditable,
                        required: cols[i].required,
                        align: 'left',
                        id_datatype: cols[i].id_datatype,
                        real_name_in: cols[i].real_name_in,
                        real_name_out: cols[i].real_name_out,
                        n_column: cols[i].n_column,
                        fk: cols[i].fk,
                        filter: {
                            type: 'list'
                        }
                    })
                }
                if (cols[i].type === 'date' || cols[i].type === 'datetime') {
                    columns.push({
                        dataIndex: MasterApp.util.getDataIndex(cols[i]),
                        width: cols[i].width,
                        text: cols[i].text,
                        //  align: cols[i].align,
                        functions: cols[i].funcion,
                        type: cols[i].type,
                        sortable: cols[i].sortable,
                        lockable: cols[i].lockout,
                        locked: cols[i].lockout,
                        idregister: cols[i].idregister,
                        audit: cols[i].auditable,
                        required: cols[i].required,
                        align: 'left',
                        id_datatype: cols[i].id_datatype,
                        real_name_in: cols[i].real_name_in,
                        real_name_out: cols[i].real_name_out,
                        n_column: cols[i].n_column,
                        fk: cols[i].fk,
                        filter: {
                            type: 'date',
                            beforeText: 'Antes',
                            afterText: 'Déspues',
                            onText: '='
                        },
                        renderer: function (value, record) {
                            if (value != null) {
                                var idx = value.indexOf('T');
                                if (idx > -1) {
                                    var date = new Date(value);
                                    return Ext.Date.format(date, 'd/m/Y h:i:s');
                                }
                            }
                            return value;
                        }
                    })
                }
            }
        }
        return columns;
    }
})