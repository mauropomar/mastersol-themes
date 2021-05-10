/**
 * @author cplus JSCode-Generator 1.0.0
 */
/**
 * @author mauro
 */
Ext.define('MasterSol.controller.alert.AlertController', {
    extend: 'Ext.app.Controller',
    init: function () {// eslint-disable-line

    },


    loadIntervalAlert: function () {
        let intervalid;
        var counted = 0;

        async function callFunction() {
            intervalid = setInterval(() => {
                new Promise(function (resolve, reject) {
                    resolve('something')
                }).then(res => {
                    var obtener = {
                        url: 'app/newalerts',
                        method: 'GET',
                        scope: this,
                        success: function (response) {
                            var json = Ext.JSON.decode(response.responseText);
                            MasterApp.alert.setNotification(json);
                        }
                    };
                    Ext.Ajax.request(obtener);
                })
            }, 60000) //60000
        }

        callFunction();
    },

    laodInitAlert: function () {
        var obt = {
            url: 'app/newalerts',
            method: 'GET',
            scope: this,
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                this.loadIntervalAlert();
                this.setNotification(json);
            }
        };
        Ext.Ajax.request(obt);
    },

    setNotification: function (js) {
        var counted = js.data.datos;
        var text = 'Hay ' + counted + ' alertas nuevas';
        Ext.ComponentQuery.query('#btn-alert')[0].setTooltip(text);
        Ext.ComponentQuery.query('#btn-alert')[0].setBadgeText(counted);

    }
})