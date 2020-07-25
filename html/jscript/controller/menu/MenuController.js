/**
 * @author mauro
 */
Ext.define('MasterSol.controller.menu.MenuController', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.menu = {id: null, idsection: null, nombre: ''};
        this.json = [];
    },

    select:function(view, record){
        this.menu.id = record.data.id;
        this.menu.idsection = record.data.sectionId;
        this.menu.nombre = record.data.nombre;
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

    showMenu:function(){

    }
})