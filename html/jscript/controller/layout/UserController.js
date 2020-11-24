Ext.define('MasterSol.controller.layout.UserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.user',
    save:function () {
        var form = Ext.ComponentQuery.query('form-user')[0];
        var mask = new Ext.LoadMask(form, {
            msg: 'Guardando cambios...'
        });
        mask.show();
        if(!form.getForm().isValid()){
            mask.hide();
            return
        };
        var language = Ext.ComponentQuery.query('#combolanguage')[0].getValue();
        var rol = Ext.ComponentQuery.query('#comborol')[0].getValue();
        var save = {
            url: 'app/insoptionuser',
            method: 'POST',
            scope: this,
            params: {
                idlanguajes: language,
                idrol: rol,
                accion:'12'
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    Ext.toast('Los datos del usuario fueron guardados con éxito.');
                }else{
                    MasterApp.util.showMessageInfo(json.message);
                }
            }
        };
        Ext.Ajax.request(save);
    }
});