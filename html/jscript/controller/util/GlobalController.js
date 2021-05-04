/**
 * @author cplus JSCode-Generator 1.0.0
 */
/**
 * @author mauro
 */
Ext.define('MasterSol.controller.util.GlobalController', {
        extend: 'Ext.app.Controller',
        init: function () {
            this.recProd = null;
            this.gridProd = null;
            this.recSection = null;
            this.gridSection = null;
            this.gridSectionPrincipal = null;
            this.arrayTotal = [];
            this.arrayFilter = [];
            this.optionSelect = null;
            //   this.arrayFunctionTotal = [];
            this.selEnColumns = false;
            this.selEnRows = false;
            this.selEnCascade = false;
            this.idRol = null;
            this.actionKeyCrtlF = false;
            this.isLoading = false;
        },
        getOptionSelected: function () {
            return this.optionSelect;
        },
        getArrayTotal: function () {
            return this.arrayTotal;
        },
        getArrayFilter: function () {
            return this.arrayFilter;
        },
        getRecordProduct: function () {
            return this.recProd;
        },
        getSectionPrincipal: function () {
            return this.gridSectionPrincipal;
        },
        setRecordProduct: function (rec) {
            this.recProd = rec;
        },
        setSectionPrincipal: function (grid) {
            this.gridSectionPrincipal = grid;
        },
        getRecordSection: function () {
            return this.recSection;
        },
        getGridSection: function () {
            if (!this.gridSection) {
                return this.gridSectionPrincipal;
            }
            return this.gridSection;
        },
        getSectionPrincipalByWindow: function (window) {
            return window.down('gridpanel');
        },
        getPanelPrincipalByWindow: function (window) {
            var p = this.getSectionPrincipalByWindow(window);
            return p.up('panel');
        },
        setRecordSection: function (rec) {
            this.recSection = rec;
        },
        setGridSection: function (grid, colSel = null) {
            if (grid != null) {
                this.gridSection = grid;
                this.gridSection['colSelected'] = colSel;
            }
        },
        resetGridSection: function () {
            this.gridSection = null;
            this.gridSectionPrincipal = null;
            this.recSection = null;
        },
        isColumns: function () {
            return this.selEnColumns;
        },
        isRows: function () {
            return this.selEnRows;
        },
        setEnRows: function (val) {
            if (val) {
                this.selEnRows = true;
                this.selEnColumns = false;
                this.selEnCascade = false;
            } else {
                this.selEnRows = false;
            }
        },
        setEnColumns: function (val) {
            if (val) {
                this.selEnColumns = true;
                this.selEnCascade = false;
                this.selEnRows = false;
            } else {
                this.selEnColumns = false;
            }
        },
        setEnCascade: function (val) {
            if (val) {
                this.selEnCascade = true;
                this.selEnRows = false;
                this.selEnColumns = false;
            } else {
                this.selEnColumns = false;
            }
        },
        setOptionSelect: function (item) {
            this.optionSelect = item;
        },
        getIdRol: function () {
            return this.idRol;
        },
        setIdRol: function (idrol) {
            this.idRol = idrol;
        },
        setLoading: function (val) {
            this.isLoading = val;
        }
    }
)
