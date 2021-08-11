/**
 * @author mauro
 */
Ext.define('MasterSol.controller.layout.HeaderController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    goHome: function () {
        this.collapseAllWindow();
    },

    hideAllWindowsMenu: function () {
        var windows = Ext.ComponentQuery.query('window-menu');
        for (var j = 0; j < windows.length; j++) {
            windows[j].close();
            windows[j].destroy();
        }
    },

    applyRows: function () {
        var win;
        MasterApp.globals.setEnRows(true);
        var windows = this.getWindows();
        var height = Ext.ComponentQuery.query('#panel-center')[0].getHeight();
        var width = Ext.ComponentQuery.query('#panel-center')[0].getWidth();
        var posX = Ext.ComponentQuery.query('#panel-center')[0].getX();
        var posY = Ext.ComponentQuery.query('#panel-center')[0].getY();
        this.reconfigureWindows(height, width, posX, posY);
        var height = height / windows.length;
        for (var j = 0; j < windows.length; j++) {
            win = windows[j];
            win.setX(posX);
            win.setY(posY);
            posY = height + posY;
            win.setHeight(height);
            win.setWidth(width);
            win.isminimize = false;
            var btnMinimize = MasterApp.tools.getBtnTools(win, 'btn_minimize');
            btnMinimize.show();
            var arrayBtn = ['btn_minimize', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print', 'btn_export_capsule', 'btn_import_capsula', 'btn_report', 'btn_save_bd', 'btn_restore_bd', 'btn_export_capsule', 'btn_import_section'];
            MasterApp.tools.setVisibleBtn(win, arrayBtn, false);
            var btnMaximize = MasterApp.tools.getBtnTools(win, 'btn_restore');
            btnMaximize.hide();
            MasterApp.tools.showButtonsNotDefault(win, true);
        }

    },

    applyColumns: function () {
        var win;
        MasterApp.globals.setEnColumns(true);
        var windows = this.getWindows();
        var height = Ext.ComponentQuery.query('#panel-center')[0].getHeight();
        var width = Ext.ComponentQuery.query('#panel-center')[0].getWidth();
        var posX = Ext.ComponentQuery.query('#panel-center')[0].getX();
        var posY = Ext.ComponentQuery.query('#panel-center')[0].getY();
        this.reconfigureWindows(height, width, posX, posY);
        var width = width / windows.length;
        for (var j = 0; j < windows.length; j++) {
            win = windows[j];
            win.setHeight(height);
            win.setWidth(width);
            win.setX(posX);
            win.setY(posY);
            posX = width + posX;
            win.isminimize = false;
            var arrayBtn = ['btn_minimize', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print', 'btn_export_capsule', 'btn_import_capsula', 'btn_report', 'btn_save_bd', 'btn_restore_bd', 'btn_import_section'];
            MasterApp.tools.setVisibleBtn(win, arrayBtn, false);
            var btnMaximize = MasterApp.tools.getBtnTools(win, 'btn_restore');
            btnMaximize.hide();
            MasterApp.tools.showButtonsNotDefault(win, true);
        }
    },

    applyCascade: function () {
        var win, btn;
        MasterApp.globals.setEnCascade(true);
        var windows = this.getWindows();
        var height = Ext.ComponentQuery.query('#panel-center')[0].getHeight();
        var width = Ext.ComponentQuery.query('#panel-center')[0].getWidth();
        var posX = Ext.ComponentQuery.query('#panel-center')[0].getX();
        var posY = Ext.ComponentQuery.query('#panel-center')[0].getY();
        var lastPosX = posX;
        var lastPosY = posY;
        var lastWidth = width;
        var lastHeight = height;
        this.reconfigureWindows(height, width, posX, posY);
        for (var j = 0; j < windows.length; j++) {
            win = windows[j];
            if (j > 0) {
                var winlast = windows[j - 1];
                lastWidth = winlast.getWidth() - 30;
                lastHeight = winlast.getHeight() - 30;
                lastPosX = winlast.getX() + 30;
                lastPosY = winlast.getY() + 30;
                btn = MasterApp.tools.getBtnTools(win, 'btn_restore');
                btn.show();
            } else {
                btn = MasterApp.tools.getBtnTools(win, 'btn_restore');
                btn.hide();
            }
            win.setWidth(lastWidth);
            win.setHeight(lastHeight);
            win.setX(lastPosX);
            win.setY(lastPosY);
            win.toFront();
            win.isminimize = false;
            var btnMinimize = MasterApp.tools.getBtnTools(win, 'btn_minimize');
            btnMinimize.show();
            var arrayBtn = ['btn_minimize', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print', 'btn_export_capsule', 'btn_import_capsula', 'btn_report', 'btn_save_bd', 'btn_restore_bd', 'btn_import_section'];
            MasterApp.tools.setVisibleBtn(win, arrayBtn, false);
            MasterApp.tools.showButtonsNotDefault(win, true);
        }

    },

    getWindows: function () {
        var allwindows = Ext.ComponentQuery.query('window-menu');
        var windowsNotMinimize = Ext.ComponentQuery.query('window-menu[isminimize=false]');
        if (allwindows.length > 0 && windowsNotMinimize.length == 0) {
            //devuelve todas las ventanas
            return allwindows;
        }
        //devuelveme solo las maximizadas
        return windowsNotMinimize;
    },

    reconfigureWindows: function (height, width, posX, posY) {
        var windows = this.getWindows();
        for (var j = 0; j < windows.length; j++) {
            windows[j].setX(posX);
            windows[j].setY(posY);
            windows[j].setHeight(height);
            windows[j].setWidth(width);
            windows[j].expand('', false);
            var btn = MasterApp.tools.getBtnTools(windows[j], 'btn_restore');
            btn.show();
        }
    },

    logout: function () {
        var viewport = Ext.ComponentQuery.query('viewport')[0];
        var Mask = new Ext.LoadMask(viewport, {
            msg: 'Cerrando sesi&oacute;n...'
        });
        Mask.show();
        var close = {
            url: 'php/logout.php',
            method: 'POST',
            scope: this,
            callback: function (options, success, response) {
                Mask.hide();
                location.href = 'index.html';
            }
        };
        Ext.Ajax.request(close);
    },

    showAlerts: function () {
        var panel = Ext.ComponentQuery.query('viewport')[0];
        var mask = new Ext.LoadMask(panel, {
            msg: 'Cargando...'
        });
        mask.show();
        MasterApp.globals.moveColumns = false;
        var alert = {
            url: 'app/sections',
            method: 'POST',
            scope: this,
            params: {
                sectionId: '34419b9f-f7bd-443a-a3e8-1569cbdd4a2f',
                alerta_user: true
            },
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var controller = MasterApp.menu;
                controller.menu.id = json[0].id;
                controller.menu.idsection = json[0].id;
                controller.menu.name = json[0].nombre;
                controller.json = json;
                controller.showMenu(json, true);
                //      Ext.ComponentQuery.query('#register-view')[0].hide();
            },
            failure: function (response) {
                mask.hide();
            }
        };
        Ext.Ajax.request(alert);
    },

    collapseAllWindow: function () {
        var windows = this.getWindows();
        for (var j = 0; j < windows.length; j++) {
            var panelMenu = Ext.ComponentQuery.query('#panel-center')[0];
            windows[j].collapse();
            windows[j].isminimize = true;
            winWidth = windows[j].getWidth();
            winHeight = windows[j].getHeight();
            windows[j].setWidth(300);
            var btn = MasterApp.tools.getBtnTools(windows[j], 'btn_restore');
            btn.show();
            var arrayBtn = ['btn_minimize', 'btn_maximize', 'btn_trash', 'btn_add', 'btn_refresh', 'btn_download', 'btn_print', 'btn_export_capsule', 'btn_import_capsula', 'btn_report', 'btn_save_bd', 'btn_restore_bd', 'btn_import_section'];
            MasterApp.tools.setVisibleBtn(windows[j], arrayBtn, true);
            windows[j].alignTo(panelMenu, 'bl-bl');
            MasterApp.section.setPositionWindow(windows[j]);
            MasterApp.magnament.isMenuTabMagnament(windows[j]);
            MasterApp.tools.showButtonsNotDefault(windows[j], false);
        }
    },

    refreshDesktop: function () {
        var view = Ext.ComponentQuery.query('dataview-home')[0].down('dataview');
        var store = view.getStore();
        store.reload();
    },

    showWindowImageDesktop: function () {
        Ext.create('MasterSol.view.layout.WindowImageDesktop');
    },

    changeImageDesktop: function () {
        var window = Ext.ComponentQuery.query('window-image-desktop')[0];
        var mask = new Ext.LoadMask(window, {
            msg: 'Guardando imagen....'
        });
        mask.show();
        var fileField = Ext.ComponentQuery.query('#file_image_desktop')[0];
        var file = fileField.fileInputEl.dom.files[0],
            data = new FormData();
        if (file === undefined || !(file instanceof File)) {
            mask.hide();
            Ext.MessageBox.show({
                title: 'Información',
                msg: 'Debe seleccionar una imagen.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            return;
        }
        var nameFile = MasterApp.util.getName(fileField.value);
        if (!MasterApp.util.isFileImage(file)) {
            mask.hide();
            fileField.reset();
            Ext.MessageBox.show({
                title: 'Información',
                msg: 'La extensión de la imagen no es correcta.',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
            return;
        }
        data.append('file', file);
        Ext.Ajax.request({
            url: 'app/imagedesktop',
            rawData: data,
            scope: this,
            method: 'POST',
            params: {
                rol: MasterApp.globals.getIdRol(),
                name: nameFile
            },
            headers: {'Content-Type': null}, //to use content type of FormData
            success: function (response) {
                mask.hide();
                Ext.ComponentQuery.query('#btn_cancel_image_desktop')[0].setDisabled(false);
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    Ext.toast('Los cambios fueron realizados con éxito.');
                    var name = MasterApp.util.getName(json.datos);
                    MasterApp.util.changeImageDesktop(name);
                } else {
                    Ext.MessageBox.show({
                        title: 'Información',
                        msg: json.datos,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                }
            }
        });
    },

    restoreImageDesktopDefault:function(){
        var panel = Ext.ComponentQuery.query('dataview-home')[0];
        var mask = new Ext.LoadMask(panel, {
            msg: 'Restaurando....'
        });
        mask.show();
        Ext.Ajax.request({
            url: 'app/restoreimagedesktop',
            rawData: data,
            scope: this,
            method: 'POST',
            params: {
                rol: MasterApp.globals.getIdRol(),
                user: MasterApp.globals.getIdUser(),
            },
            headers: {'Content-Type': null}, //to use content type of FormData
            success: function (response) {
                mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                if (json.success == true) {
                    Ext.toast('Los cambios fueron realizados con éxito.');
                    MasterApp.util.changeImageDesktop('');
                } else {
                    Ext.MessageBox.show({
                        title: 'Información',
                        msg: json.datos,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                }
            }
        });
    },

    cancelImageDesktop: function () {
        var window = Ext.ComponentQuery.query('window-image-desktop')[0];
        window.close();
    }
})