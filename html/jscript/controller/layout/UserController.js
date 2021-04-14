Ext.define('MasterSol.controller.layout.UserController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },
    save: function () {
        var form = Ext.ComponentQuery.query('form-user')[0];
        var mask = new Ext.LoadMask(form, {
            msg: 'Guardando cambios...'
        });
        mask.show();
        if (!form.getForm().isValid()) {
            mask.hide();
            return;
        }
        ;
        var language = Ext.ComponentQuery.query('#combolanguage')[0].getValue();
        var rol = Ext.ComponentQuery.query('#comborol')[0].getValue();
        var save = {
            url: 'app/insoptionuser',
            method: 'POST',
            scope: this,
            params: {
                idlanguajes: language,
                idrol: rol,
                accion: '12'
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    Ext.toast('Los datos del usuario fueron guardados con éxito.');
                } else {
                    MasterApp.util.showMessageInfo(json.message);
                }
            }
        };
        Ext.Ajax.request(save);
    },

    loadFields: function () {
        var combo_language = Ext.ComponentQuery.query('#combolanguage')[0];
        var combo_rol = Ext.ComponentQuery.query('#comborol')[0];
        combo_language.getStore().load();
        combo_rol.getStore().load();
    }
});