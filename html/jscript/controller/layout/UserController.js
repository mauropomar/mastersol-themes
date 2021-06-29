Ext.define('MasterSol.controller.layout.UserController', {
    extend: 'Ext.app.Controller',
    passwordLast: '',
    password: '',
    confirmPassword: '',
    loadField: false,
    init: function () {

    },

    changeField: function (field, newValue, oldValue) {

    },

    save: function () {
        var form = Ext.ComponentQuery.query('form-user')[0];
        var mask = new Ext.LoadMask(form, {
            msg: 'Guardando cambios...'
        });
        mask.show();
        if (!form.getForm().isValid() || !this.validFields()) {
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
                lastpass: this.getPassword('password_last'),
                pass: this.getPassword('password'),
                accion: '12'
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    Ext.toast('Los datos del usuario fueron guardados con éxito.');
                    this.reset();
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
    },

    validFields: function () {
        var passwordLast = Ext.ComponentQuery.query('#password_last')[0].getValue();
        var password = Ext.ComponentQuery.query('#password')[0].getValue();
        var confirm_password = Ext.ComponentQuery.query('#confirm_password')[0].getValue();
        if (passwordLast === '' && password === '' && confirm_password === '') {
            Ext.ComponentQuery.query('#password')[0].clearInvalid();
            Ext.ComponentQuery.query('#confirm_password')[0].clearInvalid();
            Ext.ComponentQuery.query('#password_last')[0].clearInvalid();
            return true;
        }
        if (passwordLast != '' && (sha256(passwordLast) !== MasterApp.globals.getPassword())) {
            Ext.ComponentQuery.query('#password_last')[0].markInvalid('La contraseña anterior es incorrecta');
            return false;
        }
        if (passwordLast != '' && password === '') {
            Ext.ComponentQuery.query('#password')[0].markInvalid('Este campo es obligatorio');
            return false;
        }
        if ((password !== '' && passwordLast !== '') && (password === passwordLast)) {
            Ext.ComponentQuery.query('#password')[0].markInvalid('Las contraseña anterior y la actual no deben coincidir.');
            return false;
        }
        if (password !== '' && confirm_password === '') {
            Ext.ComponentQuery.query('#confirm_password')[0].markInvalid('Este campo es obligatorio');
            return false;
        }
        if ((password !== '' && confirm_password !== '') && (password !== confirm_password)) {
            Ext.ComponentQuery.query('#confirm_password')[0].markInvalid('Las contraseñas no coinciden.');
            return false;
        }
        return true;
    },

    reset: function () {
        Ext.ComponentQuery.query('#password_last')[0].reset();
        Ext.ComponentQuery.query('#password')[0].reset();
        Ext.ComponentQuery.query('#confirm_password')[0].reset();
    },

    getPassword: function (field) {
        var value = Ext.ComponentQuery.query('#' + field)[0].getValue();
        value = (value === '' || value === null) ? MasterApp.globals.password : sha256(value);
        return value;
    }
});