Ext.define('MasterSol.controller.util.GridSectionController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    getComponents: function (section, columns, tools, height, data, name, windowParent, atributos) {
        var _this = this;
        return Ext.create('Ext.grid.Panel', {
            btnTools: tools,
            selType: (atributos.section_checked) ? 'checkboxmodel' : null,
            idsection: section.id,
            idmenu: windowParent.idmenu,
            resizable: false,
            border: false,
            page: 1,
            name: name,
            section_checked: atributos.section_checked,
            store: this.getStore(columns, data),
            height: height,
            max_line: section.max_lines,
            read_only: section.read_only,
            orderable: section.orderable,
            region: 'center',
            isMoveColumn: false,
            autoScroll: true,
            columns: this.getColumns(columns),
            enableDragDrop: true,
            viewConfig: {
                loadMask: false,
                loadingText: 'Cargando...',
                plugins: {
                    ddGroup: 'grid-to-form',
                    ptype: 'gridviewdragdrop',
                    enableDrop: false
                }
            },
            listeners: {
                'afterrender': function (comp) {
                    var gridView = this.getView();
                    var gridStore = this.store;
                    comp.getTargetEl().on('mouseup', function (e, t) {
                        if (t.scrollTop > 0) {
                            var height = comp.getTargetEl().getHeight();
                            if (height + t.scrollTop >= t.scrollHeight) {
                                MasterApp.section.paginate(comp);
                            }
                        }
                    });
                    if (comp.orderable)
                        _this.eventMoveRow(comp, gridView, gridStore);
                },
                columnmove: function (view, column, fromIndex, toIndex, eOpts) {
                    var dataIndexFrom = column.dataIndex;
                    var dataIndexTo = view.grid.columns[toIndex].dataIndex;
                    MasterApp.section.updateColumn(dataIndexFrom, dataIndexTo);
                    var grid = view.grid;
                    var container = grid.up('panel');
                    var gridTotal = container.items.items[1];
                    if (gridTotal.getHeight() > 0) {
                        var gridSection = MasterApp.globals.getGridSection();
                        MasterApp.totals.hideGridTotals(gridSection);
                    }
                    var cols = grid.getView().getHeaderCt().getGridColumns();
                    MasterApp.gridtotal.reconfigure(gridTotal, cols);
                }
            }
        });
    },

    getStore: function (columns, data) {
        var data = (data) ? data : new Array();
        columns = (columns) ? columns : new Array();
        var fields = [];

        for (var i = 0; i < columns.length; i++) {
            fields.push(columns[i].dataIndex);
        }
        var name = 'store_' + Math.floor;
        var store = Ext.create('Ext.data.Store', {
            alias: 'store.store_dinamic',
            fields: fields,
            data: data
        })
        return store;
    },

    getColumns: function (cols) {
        cols = (cols) ? cols : new Array();
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
                        link_parent: cols[i].link_parent,
                        draggable: !cols[i].no_move,
                        fk: cols[i].fk,
                        filter: {
                            type: 'boolean',
                            yesText: 'Verdadero',
                            noText: 'Falso'
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
                        link_parent: cols[i].link_parent,
                        fk: cols[i].fk,
                        draggable: !cols[i].no_move,
                        filter: {
                            type: 'number',
                            emptyText: 'Instroduzca un ' + cols[i].text + '.'
                        }
                    })
                }
                if (cols[i].type === 'string' || cols[i].type === 'bytea') {
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
                        link_parent: cols[i].link_parent,
                        fk: cols[i].fk,
                        orderable: cols[i].orderable,
                        draggable: !cols[i].no_move,
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
                        link_parent: cols[i].link_parent,
                        fk: cols[i].fk,
                        orderable: cols[i].orderable,
                        draggable: !cols[i].no_move,
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
                        link_parent: cols[i].link_parent,
                        fk: cols[i].fk,
                        orderable: cols[i].orderable,
                        draggable: !cols[i].no_move,
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
                                    return Ext.Date.format(date, 'd/m/Y H:i:s');
                                }
                            }
                            return value;
                        }
                    })
                }
            }
        }
        return columns;
    },

    eventMoveRow: function (comp, gridView, gridStore) {
        var body = comp.body;
        this.formPanelDropTarget = new Ext.dd.DropTarget(body, {
            ddGroup: 'grid-to-form',
            notifyEnter: function (ddSource, e, data) {
                body.stopAnimation();
                body.highlight();
            },
            notifyDrop: function (ddSource, e, data) {
                var draggedRec = ddSource.dragData.records[0];
                var droppedOnIdx = (e.recordIndex) ? e.recordIndex : gridStore.getCount() - 1;
                var droppedOnRec = gridStore
                    .getAt(droppedOnIdx);
                var items = [];
                gridStore.each((record) => {
                    var id = record.get('id');
                    items.push(id);
                });
                var draggedRecId = draggedRec.get('id');
                var idxToRemove = items.indexOf(draggedRecId);
                var removedItem = items.splice(idxToRemove, 1)[0];
                var droppedOnRecId = droppedOnRec.get('id');
                var droppedOnRecIdx = items
                    .indexOf(droppedOnRecId);
                items.splice(droppedOnRecIdx + 1, 0, removedItem);
                gridStore.each((record) => {
                    var recordId = record.get('id');
                    var newOrder = items.indexOf(recordId);
                    record.set('sortOrder', newOrder);
                });
                gridStore.sort('sortOrder', 'ASC');
                gridStore.commitChanges();
                MasterApp.section.updateRowOrder(draggedRec, droppedOnRec);
                return true;
            }
        });
    }
})