Ext.define('MasterSol.controller.util.UtilController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    afteredit: function (value, metaData, record) {
        if (record.data.fk == '1') {
            return value;
        }
        if (record.data.tipo == 'bytea') {
            if (value == '' || value == null) {
                return '';
            } else {
                return '<i class="fa fa-image"></i>';
            }
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
        if ((record.data.tipo == 'datetime') && value.indexOf('/') == -1) {
            var retval = Ext.util.Format.date(value, 'd/m/Y H:i:s');
            if (value)
                metaData.tdAttr = 'data-qtip="' + retval + '"';
            return retval;
        }
        return value;
    },

    getDataIndex: function (col) {
        return (col.fk == 1 && col['n_fk']) ? col['n_fk'] : col.dataIndex;
    },

    getMenuByName: function (name) {
        var windows = Ext.ComponentQuery.query('window[name=window-menu]');
        for (var j = 0; j < windows.length; j++) {
            if (windows[j].getTitle() == name) {
                return windows[j];
            }
        }
    },

    getTitleSectionSelected: function () {
        var section = MasterApp.globals.getGridSection().up('panel');
        if (section.title == '') {
            var window = section.up('window');
            return window.title;
        }
        return section.title;
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
        var panel = Ext.ComponentQuery.query('#panel-center')[0];
        var height = panel.getHeight();
        var width = panel.getWidth();
        var windows = Ext.ComponentQuery.query('window[isminimize=false]');
        for (var i = 0; i < windows.length; i++) {
            windows[i].setWidth(width);
            windows[i].setHeight(height);
        }
        if (MasterApp.globals.isColumns()) {
            MasterApp.header.applyColumns();
        }
        ;
        if (MasterApp.globals.isRows()) {
            MasterApp.header.applyRows();
        }
        ;
    },

    setWindowSize: function (window) {
        var height = Ext.ComponentQuery.query('#panel-center')[0].getHeight();
        var width = Ext.ComponentQuery.query('#panel-center')[0].getWidth();
        var posX = Ext.ComponentQuery.query('#panel-center')[0].getX();
        var posY = Ext.ComponentQuery.query('#panel-center')[0].getY();
        window.setX(posX);
        window.setY(posY);
        posX = width + posX;
        window.setHeight(height);
        window.setWidth(width);
        window.expand('', false);
        window.isminimize = false;
        var btn = MasterApp.tools.getBtnTools(window, 'btn_restore');
        btn.hide();
        var arrayBtn = ['btn_minimize', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print', 'btn_export_capsule', 'btn_import_capsula', 'btn_report', 'btn_save_bd', 'btn_restore_bd', 'btn_import_section'];
        MasterApp.tools.setVisibleBtn(window, arrayBtn, false);
        MasterApp.section.adjustOtherWindowsMinimize();
        var panel = Ext.ComponentQuery.query('#panel-center')[0];
        MasterApp.util.resizeWindow(window, panel);
        MasterApp.tools.showButtonsNotDefault(window, true);
    },

    getTotalsBySection: function () {
        var idsection = this.getIdSectionActive();
        var gridsection = MasterApp.globals.getGridSection();
        var window = gridsection.up('window');
        var arrayTotals = MasterApp.globals.getArrayTotal();
        var totals = [];
        for (var j = 0; j < arrayTotals.length; j++) {
            if (arrayTotals[j]['id'] == window.idmenu) {
                var registers = arrayTotals[j]['registers'];
                for (var i = 0; i < registers.length; i++) {
                    if (registers[i]['id'] == idsection) {
                        var array = registers[i]['totals'];
                        for (var h = 0; h < array.length; h++) {
                            if (array[h]['nombrefuncion'] != null && array[h]['nombrefuncion'] != '') {
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
            if (arrayFilter[j]['id'] == window.idmenu) {
                var register = arrayFilter[j]['registers'];
                for (var i = 0; i < register.length; i++) {
                    if (register[i]['id'] == idsection) {
                        var array = register[i]['filters'];
                        for (var h = 0; h < array.length; h++) {
                            if (array[h]['idoperador'] != null) {
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

    getTabsOfWindow: function (window, onlyShow = true) {
        var idwindow = window.id;
        var queryId = (onlyShow) ? '#' + idwindow + ' tabpanel[hidden=false]' : '#' + idwindow + ' tabpanel';
        var tabs = Ext.ComponentQuery.query(queryId);
        return tabs;
    },

    getContainerSections: function () {
        var gridSection = MasterApp.globals.getGridSection();
        var window = gridSection.up('window');
        var containers = Ext.ComponentQuery.query('tab[title!=null]');
        var array = [];
        for (var i = 0; i < containers.length; i++) {
            var tab = containers[i];
            if (tab.card.idsection && tab.up('window').idmenu === window.idmenu) {
                array.push(tab);
            }
        }
        return array;
    },

    getSectionById: function (window, idsection) {
        var idwindow = window.id;
        var queryId = '#' + idwindow + ' gridpanel';
        var childs = Ext.ComponentQuery.query(queryId);
        var section = null;
        for (var j = 0; j < childs.length; j++) {
            if (childs[j]['idsection'] == idsection) {
                section = childs[j];
                break;
            }
        }
        return section;
    },

    //devuelve el idpadre de la seccion ya sea un principal o no
    getGridTotal: function () {
        var parent;
        var gridsection = MasterApp.globals.getGridSection();
        parent = gridsection.up('panel');
        var gridtotal = parent.items.items[1];
        return gridtotal;
    },

    getVal: function (rec, value, save = false) {
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
                return Ext.Date.format(date, 'd/m/Y H:i:s');
            } else {
                var idx = value.indexOf('T');
                if (idx > -1) {
                    var date = new Date(value);
                    date.setHours(0);
                    date.setMinutes(0);
                    return Ext.Date.format(date, 'd/m/Y H:i:s');
                }
            }
            return value;
        }
        if (type == 'datetime' && value != null) {
            value = new Date(Date.parse(value));
            return (save) ? value : Ext.Date.format(value, 'd/m/Y H:i:s');
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

    getNColumnSection() {
        var section = MasterApp.globals.getGridSection();
        var n_column = (section.colSelected && section.colSelected !== null) ? section.columns[section.colSelected]['n_column'] : null;
        return n_column;
    },

    getValProperty: function (field, property) {
        var grid = MasterApp.globals.getGridSection();
        var columns = grid.columns;
        var index = -1;
        for (var i = 0; i < columns.length; i++) {
            var n_field = 'n_' + field;
            if (columns[i].dataIndex == field || columns[i].dataIndex == n_field) {
                index = i;
                break;
            }
        }
        var val = (property && index > -1) ? grid.columns[index][property] : null;
        val = (val) ? val : null;
        return val;
    },

    setAplyMaxLine: function () {
        var gridsection = MasterApp.globals.getGridSection();
        var maxLine = gridsection.max_line;
        if (maxLine == 0)
            return;
        var countRow = gridsection.getStore().getCount();
        var disabled = (maxLine >= countRow) ? true : false;
        var window = gridsection.up('window');
        var btn = MasterApp.tools.getBtnTools(window, 'btn_add');
        btn.setDisabled(disabled);
    },

    isWindowExpand: function (win) {
        var widthParent = Ext.ComponentQuery.query('#panel-center')[0].getWidth();
        var heightParent = Ext.ComponentQuery.query('#panel-center')[0].getHeight();
        var widthWindow = win.getWidth();
        var heightWindow = win.getHeight();
        if (widthParent == widthWindow && heightParent == heightWindow)
            return true;
        else
            return false;
    },

    setStyleWindow: function (panel, headerClik = false) {
        var window = (panel.name !== 'window-menu') ? panel.up('window') : panel;
        var idSelWindow = window.id;
        window.setStyle({
            borderColor: '#e87b48'
        });
        window.isSelect = true;
        window.focus();
        if (headerClik) {
            MasterApp.util.setActiveSectionPrincipal(window);
        }
        var windows = Ext.ComponentQuery.query('window');
        for (var i = 0; i < windows.length; i++) {
            if (windows[i].id != idSelWindow) {
                windows[i].isSelect = false;
                windows[i].setStyle({
                    borderColor: 'transparent'
                });
            }
        }
    },

    setStyleWindowActive: function (window) {
        var windowSelect;
        if (!window) {
            windowSelect = Ext.ComponentQuery.query('window-menu[isSelect=true]');
            if (windowSelect.length > 0)
                windowSelect = Ext.ComponentQuery.query('window-menu[isSelect=true]')[0];
            else
                windowSelect = Ext.ComponentQuery.query('window-menu[isSelect=false]')[0];
        } else
            windowSelect = window;
        var val = false;
        if (!windowSelect.isminimize) {
            this.setStyleWindow(windowSelect);
            return;
        }
        var windowMaximize = Ext.ComponentQuery.query('window-menu[isminimize=' + val + ']');
        if (windowMaximize.length > 0) {
            this.setStyleWindow(windowMaximize[0]);
        }
    },

    setStyleSection: function (newCard) {
        var tab,
            hasColor = false,
            borderColor = '',
            containers = this.getContainerSections();
        if (containers.length === 0)
            return;
        if (newCard) {  // si hice click en un tab
            document.getElementById(newCard.tab.id).style.borderTop = '2px solid #49db32';
            for (var i = 0; i < containers.length; i++) {
                tab = containers[i];
                if (tab.card.idsection !== newCard.idsection) {
                    if (document.getElementById(tab.id)) {
                        this.setBorderColor(newCard, tab);
                    }
                }
            }
        } else {
            for (var j = 0; j < containers.length; j++) {
                tab = containers[j]; // si selecciono una fila en el sección principal
                if (document.getElementById(tab.id)) {
                    borderColor = document.getElementById(tab.id).style.borderTop;
                    if (borderColor.indexOf('2px solid') > -1) {
                        hasColor = true;
                    }
                }
            }
            if (!hasColor) { // sino hay nadie seleccionado ponle color al primer tab
                tab = containers[0];
                if (tab.id)
                    document.getElementById(tab.id).style.borderTop = '2px solid #49db32';
            }
        }
    },

    setBorderColor: function (newCard, tab) {
        var gridSection = MasterApp.globals.getGridSection();
        if (newCard.idparent == tab.card.idsection) {// si el tab seleccionado es hijo de la seccion que viene
            document.getElementById(tab.id).style.borderTop = '2px solid #49db32';
            return;
        }
        if (newCard.idsection == tab.card.idparent) {// si el tab seleccionado es padre de la seccion que viene
            var hasSel = gridSection.getSelectionModel().hasSelection();  // si hay alguna fila seleccionada del tab seleccionado
            if (hasSel) {
                document.getElementById(tab.id).style.borderTop = '2px solid #49db32';
                return;
            }
        }
        document.getElementById(tab.id).style.borderTop = 'transparent';
    },

    getNameOperatorByRecord: function (record) {
        var operators = record.data.operadores;
        var value = record.data.operador;
        var nombre = '';
        for (var i = 0; i < operators.length; i++) {
            if (value == operators[i]['simbolo']) {
                nombre = operators[i]['nombre'];
                break;
            }
        }
        return nombre;
    },

    cleanVariableSection: function (window) {
        var gridSection = MasterApp.globals.getGridSection();
        if (gridSection) {
            var windowSection = gridSection.up('window');
            if (windowSection.idmenu = window.idmenu) {
                MasterApp.globals.setRecordSection(null);
                MasterApp.globals.setGridSection(null);
            }
        }
    },

    isJson: function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },

    getName: function (path) {
        var index = path.lastIndexOf('\\');
        if (index == -1)
            index = path.lastIndexOf('/');
        if (index > -1) {
            var name = path.substring(index + 1, path.lengh);
            return name;
        }
        return path;
    },

    isFileImage: function (file) {
        return file && file['type'].split('/')[0] === 'image';
    },

    isValidFileZip: function (name) {
        var index = name.lastIndexOf('.zip');
        var valid = (index === -1) ? false : true;
        return valid;
    },

    isValidFileCsv: function (name) {
        var index = name.lastIndexOf('.csv');
        var valid = (index === -1) ? false : true;
        return valid;
    },
    isValidFileExcel: function (name) {
        var index = name.lastIndexOf('.xlsx');
        var valid = (index === -1) ? false : true;
        return valid;
    },

    changeImageDesktop: function (image) {
        var dataview = Ext.ComponentQuery.query('dataview-home')[0].down('dataview');
        MasterApp.globals.setImageDesktop(image);
        dataview.setStyle({
            backgroundImage: 'url("' + MasterApp.globals.getImageDesktop() + '")',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '100%',
            height: '100%'
        });
    },

    hasChildSection: function (tabpanel) {
        var level = tabpanel.level;
        var next = level + 1;
        if (!Ext.ComponentQuery.query('tabpanel[level=' + next + ']')[0]) {
            return false;
        } else {
            var nextPanel = Ext.ComponentQuery.query('tabpanel[level=' + next + ']')[0];
            return !nextPanel.isHidden();
        }
    },

    refreshActiveSection: function () {
        var gridSection = MasterApp.globals.getGridSection();
        gridSection.page = 1;
        var store = gridSection.getStore();
        store.reload();
    },

    isSectionChildOfWindow: function (window) {
        var gridSection = MasterApp.globals.getGridSection();
        var idmenuWindow = window.idmenu;
        return (gridSection.idmenu === idmenuWindow);
    },

    setActiveSectionPrincipal: function (window) {
        var p = window.down('panel');
        grid = p.down('gridpanel');
        MasterApp.globals.setGridSection(grid);
        var tabMagnament = Ext.ComponentQuery.query('tabmagnament')[0];
        if (tabMagnament.expand) {
            tabMagnament.setActiveTab(0);
            MasterApp.register.editRegister(0);
        }
    },

    getObjectKey: function (data) {
        var keys = [];
        if (data.length > 0) {
            keys = Object.keys(data[0]);
        }
        return keys;
    },

    getIdentifier: function (tabPanel) {
        var window = tabPanel.up('window');
        window.originalTitle = window.title;
        var panel = tabPanel.getActiveTab();
        var parentSection = Ext.ComponentQuery.query('gridpanel[idsection=' + panel.idparent + ']')[0];
        var get = {
            url: 'app/getidentifier',
            method: 'GET',
            scope: this,
            params: {
                idsection: parentSection.idsection,
                idregister: panel.idrecordparent
            },
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                if (json.success) {
                    var title = window.title + ' ' + json.datos;
                    window.setTitle(title);
                } else {
                    Ext.toast(json.datos);
                }
            }
        };
        Ext.Ajax.request(get);
    },

    selectSection: function (id, clickTab) {
        var comp = Ext.ComponentQuery.query('#' + id)[0];
        var tabpanel = (clickTab) ? comp.up('tabpanel') : comp;
        var sectionActive = tabpanel.getActiveTab();
        if (sectionActive) {
            var gridsection = sectionActive.down('gridpanel');
            MasterApp.globals.setGridSection(gridsection);
            var hasSelection = gridsection.getSelectionModel().hasSelection();
            if (hasSelection) {
                var rec = gridsection.getSelectionModel().getSelection()[0];
                MasterApp.globals.setRecordSection(rec);
            } else {
                MasterApp.globals.setRecordSection(null);
            }
            MasterApp.magnament.getData(gridsection);
            var container = gridsection.up('panel');
            MasterApp.util.setStyleSection(container);
        }
    }
})
;
