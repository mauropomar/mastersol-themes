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
            this.idUser = null;
            this.idLanguage = null;
            this.actionKeyCrtlF = false;
            this.isLoading = false;
            this.password = '';
            this.imageDesktop = '';
        },
        getIdRol: function () {
            return this.idRol;
        },
        getImageDesktop: function () {
            return this.imageDesktop;
        },
        getIdUser: function () {
            return this.idUser;
        },
        getIdLanguage: function () {
            return this.idLanguage;
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
            if (!this.gridSection && this.gridSectionPrincipal) {
                return this.gridSectionPrincipal;
            } else if (!this.gridSection && !this.gridSectionPrincipal) {
                return this.getSectionByWindowSelected();
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
        getSectionByWindowSelected: function () {
            var window = Ext.ComponentQuery.query('window[isSelect=true]');
            var section = (window.length > 0) ? window[0].down('gridpanel') : null;
            if(section == null)
                return this.getSectionByWindowMinimize();
            return section;
        },
        getSectionByWindowMinimize: function () {
            var window = Ext.ComponentQuery.query('window[isminimize=false]');
            var section = (window.length > 0) ? window[0].down('gridpanel') : null;
            return section;
        },
        getPassword: function () {
            return this.password;
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
        setIdRol: function (id) {
            localStorage.setItem('rol', id);
            this.idRol = id;
        },
        setIdUser: function (id) {
            localStorage.setItem('user', id);
            this.idUser = id;
        },
        setIdLanguage: function (id) {
            localStorage.setItem('language', id);
            this.idLanguage = id;
        },
        setLoading: function (val) {
            this.isLoading = val;
        },
        setPassword: function (val) {
            localStorage.setItem('password', val);
            this.password = val;
        },
        setImageDesktop: function (val) {
            localStorage.setItem('desktop', val);
            this.imageDesktop = 'resources/desktop/' + val;
        }
    }
)
