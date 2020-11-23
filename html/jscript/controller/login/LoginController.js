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
                }
            }
        });
    },

    /*  mostrarSplash() {
          var div = document.getElementById('loading_inicio');
          div.setAttribute("style", "visibility:hidden;");
          var windowsplash = Ext.create('MasterSol.view.login.WindowSplash');
          windowsplash.show();
          var me = this;
          setTimeout(function () {
              windowsplash.hide();
              me.mostrarLogin();
          }, 3000);
      },*/

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
            '<div class="message_login" id="message_login"></div>'+
            '<div class="container-login100-form-btn p-t-10"><button class="login100-form-btn" type="button" onclick=MasterApp.getController("MasterSol.controller.login.LoginController").validateLogin();>Entrar</button></div>' +
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
                    Ext.ComponentQuery.query('#view_login')[0].hide();
                    Ext.create('MasterSol.view.layout.Viewport');
                    var idrol = 1;
                    MasterApp.globals.setIdRol(idrol);
                    this.configureOptionsByRol(idrol);
                    this.setAliasOtherClass();
                    this.loadOptions();
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
        Ext.ComponentQuery.query('#comborol')[0].getStore().load();
        Ext.ComponentQuery.query('#combolanguage')[0].getStore().load();
        MasterApp.theme.setStyle();
        MasterApp.alert.laodInitAlert();
     //   this.getConfigure();
        this.getOptions();

    },
    //mostrar u ocultar opciones por rol
    configureOptionsByRol: function (id_rol) {
        if (id_rol != 1) {
            var panelConfig = Ext.ComponentQuery.query('tree-config')[0];
            Ext.ComponentQuery.query('menu-panel')[0].remove(panelConfig);
        }
    },

    getConfigure: function () {
        var obt = {
            url: 'app/menuconfiguration',
            method: 'GET',
            scope: this,
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                if (json.length > 0) {
                    var root = {
                        text: 'Opciones',
                        id: 'opciones',
                        expanded: true,
                        children: json
                    };
                    var store = Ext.ComponentQuery.query('tree-config')[0].store;
                    store.setRootNode(root);
                }
            }
        };
        Ext.Ajax.request(obt);
    },

    getOptions: function () {
        var obt = {
            url: 'app/menusoption',
            method: 'GET',
            scope: this,
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                if (json.length > 0) {
                    var root = {
                        text: 'Opciones',
                        expanded: true,
                        children: json
                    };
                    var store = Ext.ComponentQuery.query('tree-options')[0].store;
                    store.setRootNode(root);
                }
            }
        };
        Ext.Ajax.request(obt);
    },

    actionKey: function () {
        Ext.create('Ext.util.KeyNav', Ext.ComponentQuery.query('#view_login')[0].getEl(), {
            "enter": function (e) {
                this.validateLogin();
            },
            scope: this
        });
    },

    setAliasOtherClass:function(){

    }
});