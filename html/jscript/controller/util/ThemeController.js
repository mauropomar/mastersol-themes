Ext.define('MasterSol.controller.util.ThemeController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    setStyle: function () {
        var theme = this.getNameTheme();
        if (theme != 'classic' && theme != 'aria' && theme != 'gray') {
            this.setHeaderStyle(theme);
            this.setFooterStyle(theme);
        }
    },

    setHeaderStyle: function (theme) {
        var header = Ext.ComponentQuery.query('#header-panel')[0];
        header.el.setStyle('background', '#5FA2DD');
    },

    setFooterStyle: function (theme) {
        var footer = Ext.ComponentQuery.query('#footer-panel')[0];
        footer.el.setStyle('background', '#5FA2DD');
        Ext.ComponentQuery.query('#tbtext_menu')[0].setStyle({
            fontWeight: 'bold',
            color: 'white'
        })
    },

    setStyleWindow: function (window) {
        var header = window.header;
        var theme = this.getNameTheme();
        if (theme == 'crisp' || theme == 'crisp-touch') {
            header.setStyle({
                backgroundColor: '#5FA2DD'
            })
        }
    },

    getNameTheme: function () {
        var theme = '';
        var url = window.location.href;
        var idx = url.indexOf('=');
        if (idx == -1)
            theme = 'classic';
        else
            theme = url.substring(idx + 1, url.length);
        return theme;
    },

    getTextColor: function () {
        var theme = this.getNameTheme();
        if (theme == 'gray' || theme == 'classic') {
            return 'black'
        }
        return 'white';
    },

    marginTop: function (name) {
        var theme = this.getNameTheme();
        if (theme == 'gray' || theme == 'classic') {
            if (name == 'filebutton-attached') {
                return '10px';
            }
        }
        return '0px';
    },

    getHeight: function (name) {
        var theme = this.getNameTheme();
        if (theme == 'gray' || theme == 'classic') {
            if (name == 'form-audit') {
                return 280;
            }
        }
        ;
        return 360;
    },

    isShortTheme: function () {
        var theme = this.getNameTheme();
        return (theme == 'gray' || theme == 'classic');
    },

    setHeaderHeightWindowCollpase: function (window) {
        var panelMenu = Ext.ComponentQuery.query('#panel-center')[0];
        var theme = this.getNameTheme();
        if (theme !== 'gray' && theme !== 'classic') {
            window.getHeader().setHeight(40);
            window.setPosition(0, panelMenu.getHeight());
            return;
        }
        window.getHeader().setHeight(27);
        window.setPosition(0, panelMenu.getHeight() + 15);
    }
});