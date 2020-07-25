/**
 * @author mauro
 */
Ext.define('MasterSol.controller.menu.MenuController', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.menu = {id: null, idsection: null, nanme: ''};
        this.json = [];
        this.windowParent =  null; //variable utilizada para asociar cada seccion o tab a la ventana
        this.panelMenu = null;
    },

    select:function(view, record){
        this.menu.id = record.data.id;
        this.menu.idsection = record.data.sectionId;
        this.menu.name = record.data.nombre;
        this.getData(record);
    },
    //obtiene los datos del menu seleccionado
    getData:function(record){
        var panel = Ext.ComponentQuery.query('viewport')[0];
        var mask = new Ext.LoadMask(panel, {
            msg: 'Cargando...'
        });
        mask.show();
      /*  var window = this.obtenerVentanaExistente(record);
        if (window != null) {
            mask.hide();
            return;
        }*/
        var getdata = {
            url: 'php/manager/getsections.php',
            method: 'POST',
            scope: this,
            params: {
                sectionId: record.data.sectionId,
                alerta_user: false
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                this.json = json;
                this.showMenu(json);
            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(getdata);
    },

    showMenu:function(json){
        Ext.ComponentQuery.query('#panel-center')[0].removeAll();
        Ext.ComponentQuery.query('#panel-center')[0].add(Ext.create('MasterSol.view.menu.Menu'));
        var panelmenu = Ext.ComponentQuery.query('#panel-menu')[0];
        var window = Ext.create('MasterSol.view.menu.WindowMenu');
        var height = panelmenu.getHeight();
        var width = panelmenu.getWidth();
        window.setWidth(width);
        window.setHeight(height);
        window.setTitle(this.menu.name);
        window.idsection = this.menu.idsection;
        window.idmenu = this.menu.id;
        window.showAt(0, 38);
        MasterApp.tools.setButtons(window, json[0].buttons);
        this.windowParent = window;
        this.panelMenu = window.down('panel').down('container');
        this.generateLevels(json);
     //   this.configurarSecciones(json);
        //   this.obtenerButtons(window);
        Ext.ComponentQuery.query('#btnEnMosaic')[0].setDisabled(false);
        Ext.ComponentQuery.query('#btnEnCascade')[0].setDisabled(false);
    },
    //configurar la cantidad de niveles que va a tener el menu
    generateLevels: function (json) {
        var levels = json[0].niveles;
        var panel_contenedor = this.panelMenu;
        var height = panel_contenedor.getHeight();
        panel_contenedor.removeAll();
        if (levels < 2) {
            this.generateSectionPrincipal(json, height);
        } else {
            height = height / levels;
            for (var j = 0; j < levels; j++) {
                if (j == 0) {
                    this.generateSectionPrincipal(json, height);
                } else {
                    this.generateSections(j, height);
                }
            }
        }
    },
    //generar seccion principal y agregar a la opcion del combo de ventanas que esta en el footer
    generateSectionPrincipal:function(json,height){
        var panel = MasterApp.containersections.getPanel('', json[0], [], height, 'grid-menu', this.windowParent);
        var gridSectionPrincipal = panel.items.items[0];
        MasterApp.globals.setSectionPrincipal(gridSectionPrincipal);
        this.panelMenu.add(panel);
        MasterApp.footer.addWindow(this.menu);
    },

    generateSections:function(){

    }
})