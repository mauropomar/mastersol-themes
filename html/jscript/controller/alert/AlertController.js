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
        var counted = 0
        async function callFunction() {
            intervalid = setInterval(() => {
                new Promise(function (resolve, reject) {
                    resolve('something')
                }).then(res => {
                    var obtener = {
                        url: 'php/manager/managerFunctionsEvent.php',
                        method: 'GET',
                        scope: this,
                        success: function (response) {
                            counted++;
                            Ext.ComponentQuery.query('#btn-alert')[0].setTooltip('Esta alerta es la numero:'+counted);
                         //   var json = Ext.JSON.decode(response.responseText);
                        }
                    };
                    Ext.Ajax.request(obtener);
                })
            }, 60000) //60000
        }

        callFunction()
    },

    laodInitAlert: function () {
        var obt = {
            url: 'php/manager/managerFunctionsEvent.php',
            method: 'GET',
            scope: this,
            success: function (response) {
             //   var json = Ext.JSON.decode(response.responseText);
                this.loadIntervalAlert();
                Ext.ComponentQuery.query('#btn-alert')[0].setBadgeText('.');
            }
        };
        Ext.Ajax.request(obt);
    }
})