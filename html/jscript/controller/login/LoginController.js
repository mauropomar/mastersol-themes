Ext.define('MasterSol.controller.login.LoginController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showLogin: function () {
        Ext.create('Ext.Component', {
            id: 'view_login',
            floating: true,
            html: this.getHtml(),
            width: '100%',
            height: '100%',
            renderTo: Ext.getBody(),
            listeners: {
                scope: this,
                afterrender: function () {
                    this.actionKey();
                    document.getElementById("user_login").focus();
                    setTimeout(function () {
                        Ext.ComponentQuery.query('#options-toolbar')[0].hide();
                    }, 120);
                }
            }
        });
    },

    getHtml: function () {
        var html =
            '<div class="limiter"> ' +
            '<div class="container-login100" style="background-color: #0c5460;">' +
            '<div class="wrap-login100 p-t-50 p-b-30"><form class="login100-form validate-form">' +
            '<div class="login100-form-avatar"><img src="html/login/images/avatar-02.png" alt="AVATAR"></div>' +
            '<span class="login100-form-title p-t-20 p-b-45">Bienvenido</span>' +
            '<div class="wrap-input100 validate-input m-b-10" data-validate = "Username is required">' +
            '<input class="input100" type="text" name="username" placeholder="Usuario" id="user_login">' +
            '<span class="focus-input100"></span><span class="symbol-input100"><i class="fa fa-user"></i>' +
            '</span></div><div class="wrap-input100 validate-input m-b-10" data-validate = "Password is required">' +
            '<input class="input100" type="password" name="pass" placeholder="Contraseña" id="pass_login"><span class="focus-input100"></span>' +
            '<span class="symbol-input100"><i class="fa fa-lock"></i></span></div>' +
            '<div class="message_login" id="message_login"></div>' +
            '<div class="container-login100-form-btn p-t-10"><button class="login100-form-btn" type="button" onclick=MasterApp.getController("MasterSol.controller.login.LoginController").validateLogin();>Autenticarse</button></div>' +
            '</a></div></form></div></div></div>'
        return html;
    },

    validateLogin: function () {
        var user = Ext.get('user_login').dom.value;
        var pass = Ext.get('pass_login').dom.value;
        var div_message = Ext.get('message_login');
        var message = "";
        //   var icono = "exclamation.png";
        if (user == "" && pass == "") {
            message = "Introduzca el usuario y su contrase&ntilde;a";
        }
        if (user == "" && pass != "") {
            message = "Introduzca el usuario";
        }
        if (user != "" && pass == "") {
            message = "Introduzca la contrase&ntilde;a";
        }
        if (message != "") {
            div_message.dom.innerHTML = message;
            return;
        } else {
            this.auth(user, pass);
        }
    },

    auth: function (username, password) {
        var ventana = Ext.ComponentQuery.query('#view_login')[0];
        var Mask = new Ext.LoadMask(ventana, {
            msg: 'Comprobando usuario y contrase&ntilde;a...'
        });
        Mask.show();
        var auth = {
            url: 'session/login',
            method: 'POST',
            scope: this,
            params: {
                'user': username,
                'password': sha256(password)
            },
            success: function (response) {
                Mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if (json.success === true) {
                    Ext.ComponentQuery.query('#options-toolbar')[0].show();
                    Ext.ComponentQuery.query('#view_login')[0].hide();
                    Ext.create('MasterSol.view.layout.Viewport');
                    MasterApp.globals.setIdRol(json.rol);
                    MasterApp.globals.setIdUser(json.user);
                    MasterApp.globals.setIdLanguage(json.language);
                    MasterApp.globals.setPassword(response.request.params.password);
                //    MasterApp.util.changeImageDesktop(json.image);
                    this.loadOptions();
                    this.loadCapsules();
                } else {
                    var div_message = Ext.get('message_login');
                    var message = "Usuario o contraseña incorrecta";
                    div_message.dom.innerHTML = message;
                }
            }
        };
        Ext.Ajax.request(auth);
    },

    loadOptions: function () {
        this.loadRols();
        this.loadLanguages();
        Ext.ComponentQuery.query('#combolanguage')[0].getStore().load();
        MasterApp.theme.setStyle();
        MasterApp.alert.laodInitAlert();
    },

    loadRols: function () {
        var id = MasterApp.globals.getIdRol();
        var combo = Ext.ComponentQuery.query('#comborol')[0];
        var store = combo.getStore();
        combo.setValue(id);
        store.load({
            scope: this,
            callback: function () {
                this.configureOptionsByRol(id);
            }
        });
    },

    loadLanguages: function () {
        var id = MasterApp.globals.getIdLanguage();
        var combo = Ext.ComponentQuery.query('#combolanguage')[0];
        var store = combo.getStore();
        combo.setValue(id);
        store.load()
    },
    //mostrar u ocultar opciones por rol
    configureOptionsByRol: function (idrol) {
        var combo = Ext.ComponentQuery.query('#comborol')[0];
        var store = combo.getStore();
        var idx = store.findExact('id', idrol);
        if (idx > -1) {
            var name = store.getAt(idx).get('nombre');
            if (name !== 'Administrador') {
                var panelConfig = Ext.ComponentQuery.query('tree-config')[0];
                Ext.ComponentQuery.query('menu-panel')[0].remove(panelConfig);
            }
        }
    },


    actionKey: function () {
        Ext.create('Ext.util.KeyNav', Ext.ComponentQuery.query('#view_login')[0].getEl(), {
            "enter": function (e) {
                this.validateLogin();
            },
            scope: this
        });
    },

    loadCapsules: function () {
        var capsules = {
            url: '../../data/capsules.json',
            method: 'GET',
            scope: this,
            params: {},
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                var data = json.data;
                for (var i = 0; i < data.length; i++) {
                    var comps = data[i].components;
                    for (var j = 0; j < comps.length; j++) {
                        var clasName = comps[j].view;
                        var comp = Ext.create(clasName);
                        var controller = comp.control;
                        MasterApp.getController(controller).render(comp);
                    }
                }
            }
        };
        Ext.Ajax.request(capsules);
    }
});