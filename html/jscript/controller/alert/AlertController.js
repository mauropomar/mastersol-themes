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
        async function callAlerts() {
            intervalid = setInterval(() => {
                new Promise(function (resolve, reject) {
                }).then(res => {
                    var obt = {
                        url: 'php/manager/managerFunctionsEvent.php',
                        method: 'GET',
                        scope: this,
                        success: function (response) {
                            var json = Ext.JSON.decode(response.responseText);
                        }
                    };
                    Ext.Ajax.request(obt);
                })
            }, 60000)
        }
        callAlerts();
    },

    laodInitAlert: function () {
        this.loadIntervalAlert();
        var obt = {
            url: 'php/manager/managerFunctionsEvent.php',
            method: 'GET',
            scope: this,
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
            }
        };
        Ext.Ajax.request(obt);
    }
})