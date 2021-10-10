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
                    var grid = view.grid;
                    var cols = grid.getView().getHeaderCt().getGridColumns();
                    var fieldsColumn = _this.getArrayColumnMove(cols);
                    MasterApp.section.updateColumn(fieldsColumn);
                    var container = grid.up('panel');
                    var gridTotal = container.items.items[1];
                    if (gridTotal.getHeight() > 0) {
                        var gridSection = MasterApp.globals.getGridSection();
                        MasterApp.totals.hideGridTotals(gridSection);
                    }
                    var newColumns = grid.getView().getHeaderCt().getGridColumns();
                    MasterApp.gridtotal.reconfigure(gridTotal, newColumns);
                },
            }
        });
    },

    getNameIndexTo: function (columns, name, fromIndex, toIndex) {
        var nameTo = '';
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].text === name) {
                if (i === 0) {
                    nameTo = columns[i + 1].text;
                } else {
                    if (fromIndex < toIndex) {
                        nameTo = columns[i - 1].text;
                    } else {
                        nameTo = columns[i + 1].text;

                    }
                }
                break;
            }
        }
        return nameTo;
    },

    getArrayColumnMove: function (columns) {
        var array = [];
        for (var i = 0; i < columns.length; i++) {
            array.push(columns[i].text);
        }
        return array;
    },

    getStore: function (columns, data) {
        var dat = (data) ? data : [];
        columns = (columns) ? columns : [];
        var fields = [];

        for (var i = 0; i < columns.length; i++) {
            fields.push(columns[i].dataIndex);
        }
        var name = 'store_' + Math.floor;
        var store = Ext.create('Ext.data.Store', {
            alias: 'store.store_dinamic',
            fields: fields,
            data: dat
        });
        return store;
    },

    getColumns: function (cols) {
        cols = (cols) ? cols : [];
        var columns = [],
            filter = {},
            renderer = null,
            xtype = 'gridcolumn';
        for (var i = 0; i < cols.length; i++) {
            if (!cols[i].hidden) {
                xtype = 'gridcolumn';
                filter = {};
                renderer = null;
                if (cols[i].type === 'boolean') {
                    xtype = 'checkcolumn';
                    filter = {
                        type: 'boolean',
                        yesText: 'Verdadero',
                        noText: 'Falso'
                    };
                } else {
                    if (cols[i].type === 'number' || cols[i].type === 'string') {
                        filter = {
                            type: 'number',
                            emptyText: 'Instroduzca un ' + cols[i].text + '.'
                        };
                    } else {
                        if (cols[i].type === 'array') {
                            filter = {
                                type: 'list'
                            };
                        } else {
                            if (cols[i].type === 'date' || cols[i].type === 'datetime') {
                                filter = {
                                    type: 'date',
                                    beforeText: 'Antes',
                                    afterText: 'Déspues',
                                    onText: '='
                                };
                                renderer = function (value, record) {
                                    if (value != null) {
                                        var idx = value.indexOf('T');
                                        if (idx > -1) {
                                            var date = new Date(value);
                                            return Ext.Date.format(date, 'd/m/Y H:i:s');
                                        }
                                    }
                                    return value;
                                };
                            } else {
                                if (cols[i].type === 'bytea') {
                                    filter = {
                                        type: 'string',
                                        emptyText: 'Instroduzca un ' + cols[i].text + '.'
                                    };
                                    renderer = function (value) {
                                        return (value !== '' && value !== null) ? '<i class="fa fa-image"></i>' : value;
                                    };
                                }
                            }
                        }
                    }
                }
            }
            var obj = {
                xtype: xtype,
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
                filter: filter,
                renderer: renderer
            };
            columns.push(obj);
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
});