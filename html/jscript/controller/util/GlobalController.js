/**
 * @author cplus JSCode-Generator 1.0.0
 */
/**
 * @author mauro
 */
Ext.define('MasterSol.controller.util.GlobalController', {
        extend: 'Ext.app.Controller',
        recProd: null,
        gridProd: null,
        arrayTotal: [],
        arrayFilter: [],
        optionSelect: null,
        arrayFunctionTotal: [],
        selEnCascade: false,
        selEnMosaico: false,
        idRol: null,
        constructor: function () {
            this.recProd = null;
            this.gridProd = null;
            this.recSection = null;
            this.gridSection = null;
            this.gridSectionPrincipal = null;
            this.cliksSection = false;
            this.moveColumns = false;
        },
        getoptionSelected: function () {
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
        setRecordSection: function (rec) {
            this.recSection = rec;
        },
        setGridSection: function (grid) {
            this.gridSection = grid;
        },
        getArrayFuncionesTotalizar: function () {
            return this.arrayFunctionTotal
        },
        setArrayFuncionesTotalizar: function (array) {
            this.arrayFunctionTotal = array
        },
        isCascade: function () {
            return this.selEnCascade;
        },
        isMosaico: function () {
            return this.selEnMosaico;
        },
        setEnMosaico: function (val) {
            if (val) {
                this.selEnMosaico = true;
                this.selEnCascade = false;
            } else {
                this.selEnMosaico = false;
            }
        },
        setEnCascade: function (val) {
            if (val) {
                this.selEnMosaico = false;
                this.selEnCascade = true;
            } else {
                this.selEnCascade = false;
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
        }
    }
)
