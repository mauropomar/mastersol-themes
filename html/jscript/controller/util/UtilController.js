Ext.define('MasterSol.controller.util.UtilController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    afteredit: function (value, metaData, record) {
        if (record.data.fk == '1') {
            return value;
        }
        if (record.data.tipo == 'boolean') {
            if (value == true || value == 't' || value == 'true') {
                return '<div style="text-align: center"><img  src="html/assets/icon/others/activo.png"/></div>';
            } else {
                return '';
            }
        }
        if ((record.data.tipo == 'date') && value.indexOf('/') == -1) {
            return Ext.util.Format.date(value, 'd/m/Y');
        }
        return value;
    },

    getDataIndex: function (col) {
        return (col.fk == 1) ? col['n_fk'] : col.dataIndex;
    },

    getMenuByName: function (name) {
        var windows = Ext.ComponentQuery.query('window[name=window-menu]');
        for (var j = 0; j < windows.length; j++) {
            if (windows[j].getTitle() == name) {
                return windows[j];
            }
        }
    },

    resizeWindow: function (window, panel) {
        var height = panel.getHeight();
        var width = panel.getWidth();
        window.setWidth(width);
        window.setHeight(height);
        window.show();
        var x = panel.getX();
        var y = panel.getY();
        window.setPosition(x, y);
    },

    resizeAllWindow: function () {
      //  var collapsed = Ext.ComponentQuery.query('tabmagnament')[0].collapsed;
        var panel = Ext.ComponentQuery.query('#panel-menu')[0];
        var height = panel.getHeight();
        var width = panel.getWidth();
        var windows = Ext.ComponentQuery.query('window[isminimize=false]');
        for (var i = 0; i < windows.length; i++) {
            windows[i].setWidth(width);
            windows[i].setHeight(height);
        }
        if (MasterApp.globals.isCascade()) {
            MasterApp.header.applyCascade();
        }
        ;
        if (MasterApp.globals.isMosaic()) {
            MasterApp.header.applyMosaic();
        }
        ;
    },

    setWindowSize: function (window) {
        var height = Ext.ComponentQuery.query('#panel-menu')[0].getHeight();
        var width = Ext.ComponentQuery.query('#panel-menu')[0].getWidth();
        var posX = Ext.ComponentQuery.query('#panel-menu')[0].getX();
        var posY = Ext.ComponentQuery.query('#panel-menu')[0].getY();
        window.setX(posX);
        window.setY(posY);
        posX = width + posX;
        window.setHeight(height);
        window.setWidth(width);
        window.expand('', false);
        window.isminimize = false;
        var arrayBtn = MasterApp.tools.getArrayBtn();
        MasterApp.tools.setVisibleBtn(window, arrayBtn, false);
        var btnMaximize = MasterApp.tools.getBtnTools(window, 'btn_restore');
        btnMaximize.hide();
    },

    getTotalsBySection: function () {
        var idsection = this.getIdSectionActive();
        var gridsection = MasterApp.globals.getGridSection();
        var window = gridsection.up('window');
        var arrayTotals = MasterApp.globals.getArrayTotal();
        var totals = [];
        for (var j = 0; j < arrayTotals.length; j++) {
            if (arrayTotals[j]['id'] == window.idMenu) {
                var registers = arrayTotals[j]['registers'];
                for (var i = 0; i < registers.length; i++) {
                    if (registers[i]['id'] == idsection) {
                        var array = registers[i]['totals'];
                        for (var h = 0; h < array.length; h++) {
                            if (array[h]['nombrefuncion'] != null) {
                                totals.push(array[h]);
                            }
                        }
                        break;
                    }
                }
            }
        }
        return Ext.encode(totals);
    },

    getFilterBySection: function () {
        var idsection = this.getIdSectionActive();
        var gridSection = MasterApp.globals.getGridSection();
        var window = gridSection.up('window');
        var arrayFilter = MasterApp.globals.getArrayFilter();
        var filters = [];
        for (var j = 0; j < arrayFilter.length; j++) {
            if (arrayFilter[j]['idmenu'] == window.idmenu) {
                var register = arrayFilter[j]['registers'];
                for (var i = 0; i < register.length; i++) {
                    if (register[i]['id'] == idsection) {
                        var array = register[i]['filters'];
                        for (var h = 0; h < array.length; h++) {
                            if (array[h]['idoperator'] != null) {
                                filters.push(array[h]);
                            }
                        }
                        break;
                    }
                }
            }
        }
        return Ext.encode(filters);
    },

    getIdSectionActive: function () {
        var id;
        var gridSection = MasterApp.globals.getGridSection();
        if (gridSection.name == 'grid-section') {
            var panel = gridSection.up('panel');
            id = panel.idsection;
        } else {
            id = gridSection.up('window').idsection;
        }
        return id;
    },

    getIdMenuActive: function () {
        var grid = MasterApp.globals.getGridSection();
        var idmenu = grid.up('window').idmenu;
        return idmenu;
    },

    //devuelve el idpadre de la seccion ya sea un principal o no
    getIdParentSectionActive: function () {
        var idparent;
        var gridsection = MasterApp.globals.getGridSection();
        if (gridsection.name == 'grid-section') {
            var panel = gridsection.up('panel');
            idparent = panel.idparent;
        } else {
            idparent = 0;
        }
        return idparent;
    },

    getVal: function (rec, value) {
        if (!value) return value;
        var type = rec.data.tipo;
        if (rec.data.fk == 1 && value != null) {
            value = (Ext.isArray(value)) ? value.join(',') : value;
            return value;
        }
        ;
        if (type == 'date' && value != null) {
            if (Ext.isDate(new Date(value))) {
                var date = new Date(value);
                date.setHours(0);
                date.setMinutes(0);
                return Ext.Date.format(date, 'd/m/Y h:i:s');
            } else {
                var idx = value.indexOf('T');
                if (idx > -1) {
                    var date = new Date(value);
                    date.setHours(0);
                    date.setMinutes(0);
                    return Ext.Date.format(date, 'd/m/Y h:i:s');
                }
            }
            return value;
        }
        if (type == 'boolean') {
            return (value == 'false' || value == false) ? false : true;
        }
        return value;
    },

    showMessageInfo: function (message) {
        Ext.Msg.show({
            title: 'Informaci&oacute;n',
            msg: message,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO
        });
    },

    getTableIcons: function (icono, value) {
        var table = '<table width="100%" border="0">' +
            '<tr><td class="left-cell"><img src="html/assets/icon/operators/' + icono + '"/></td>' +
            '<td class="center-cell">&nbsp;</td>' +
            '<td class="right-cell">' + value + '</td></tr></table>'
        return table;
    },

    getValProperty: function (field, property) {
        var grid = MasterApp.globals.getGridSection();
        var columns = grid.columns;
        var index = -1;
        for (var i = 0; i < columns.length; i++) {
            var n_field = 'n_' + field;
            if (columns[i].dataIndex == field || columns[i].dataIndex == n_field) {
                index = i;
                break
            }
        }
        var val = (property) ? grid.columns[index][property] : null;
        val = (val) ? val : null;
        return val;
    },


});