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
                    // this.accionTeclado();
                    // document.getElementById("user_login").focus();
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
            '<div class="container-login100" style="background-image: url(html/login/images/fondo.jpg);">' +
        '<div class="wrap-login100 p-t-190 p-b-30"><form class="login100-form validate-form">' +
        '<div class="login100-form-avatar"><img src="html/login/images/avatar-02.png" alt="AVATAR"></div>' +
        '<span class="login100-form-title p-t-20 p-b-45">Bienvenido</span>' +
        '<div class="wrap-input100 validate-input m-b-10" data-validate = "Username is required">' +
        '<input class="input100" type="text" name="username" placeholder="Username">' +
        '<span class="focus-input100"></span><span class="symbol-input100"><i class="fa fa-user"></i>' +
        '</span></div><div class="wrap-input100 validate-input m-b-10" data-validate = "Password is required">'+
        '<input class="input100" type="password" name="pass" placeholder="Password"><span class="focus-input100"></span>'+
        '<span class="symbol-input100"><i class="fa fa-lock"></i></span></div>'+
        '<div class="container-login100-form-btn p-t-10"><button class="login100-form-btn">Login</button></div>'+
        '</a></div></form></div></div></div>'
        return html;
    },

    /* onFormSubmit: function (usuario, password, div_mensaje) {
         var ventana = Ext.ComponentQuery.query('#ventana_login')[0];
         var Mask = new Ext.LoadMask(ventana, {
             msg: 'Comprobando usuario y contrase&ntilde;a...'
         });
         Mask.show();
         var auntenticarse = {
             url: 'php/authentication.php',
             method: 'POST',
             scope: this,
             params: {
                 'user': usuario,
                 'password': sha256(password)
             },
             success: function (response) {
                 Mask.hide();
                 var json = Ext.JSON.decode(response.responseText);
                 if (json.success === true) {
                     Ext.ComponentQuery.query('#ventana_login')[0].hide();
                     Ext.create('MasterSol.view.layout.Home');
                     var idrol = 1;
                     MasterApp.globales.setIdRol(idrol);
                     this.configurarOpcionesPorRol(idrol);
                     this.cargarOpciones();
                     MasterApp.alertas.obtenerAlertasSistema();
                 } else {
                     Ext.MessageBox.alert(
                         'Error!',
                         'Usuario o contraseña incorrecta.'
                     );
                 }
             }
         };
         Ext.Ajax.request(auntenticarse);
     },

     validar: function () {
         var user_imput = Ext.get('user_login').dom.value;
         var pass_imput = Ext.get('pass_login').dom.value;
         var div_mensaje = Ext.get('mensaje_login');
         var mensaje_validado = this.funcionValidar(user_imput, pass_imput);
         if (mensaje_validado != "") {
             div_mensaje.dom.innerHTML = mensaje_validado;
             return;
         } else {
             this.onFormSubmit(user_imput, pass_imput, div_mensaje);
         }
     },

     funcionValidar: function (user, pass) {
         var mensaje = "";
         var icono = "exclamation.png";
         if (user == "" && pass == "") {
             mensaje = "Introduzca el usuario y su contrase&ntilde;a";
         }
         if (user == "" && pass != "") {
             mensaje = "Introduzca el usuario";
         }
         if (user != "" && pass == "") {
             mensaje = "Introduzca la contrase&ntilde;a";
         }
         if(mensaje != "") {
             mensaje = '<div class="hboxinline">' +
                 '<div class="cellOne"><img src="app/images/icons/' + icono + '"/></div>' +
                 '<div class="cellTwo">' + mensaje + '</div>' +
                 '</div>';
         }
         return mensaje;
     },

     cargarOpciones: function () {
         Ext.ComponentQuery.query('#comborol')[0].getStore().load();
         Ext.ComponentQuery.query('#comboidioma')[0].getStore().load();
         this.obtenerAccesos();
         this.obtenerOpciones();
     },
     //mostrar u ocultar opciones por rol
     configurarOpcionesPorRol: function (idrol) {
         if (idrol != 1) {
             var panelConfig = Ext.ComponentQuery.query('tree-config')[0];
             Ext.ComponentQuery.query('menu-panel')[0].remove(panelConfig);
         }
     },

     obtenerAccesos: function () {
         var obtener = {
             url: 'php/manager/getmenuconfiguration.php',
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
         Ext.Ajax.request(obtener);
     },

     obtenerOpciones: function () {
         var obtener = {
             url: 'php/manager/getmenusoption.php',
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
                     var store = Ext.ComponentQuery.query('tree-opciones')[0].store;
                     store.setRootNode(root);
                 }
             }
         };
         Ext.Ajax.request(obtener);
     },

     accionTeclado: function () {
         Ext.create('Ext.util.KeyNav', Ext.ComponentQuery.query('#ventana_login')[0].getEl(), {
             "enter": function (e) {
                 this.validar();
             },
             scope: this
         });
     }*/
});