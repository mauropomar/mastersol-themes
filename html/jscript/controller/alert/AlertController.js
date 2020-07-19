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


    callAsyncFunction: function () {
        let intervalid;
        async function callFunction() {
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
        callFunction();
    },

    getAlert: function () {
        var obt = {
            url: 'php/manager/managerFunctionsEvent.php',
            method: 'GET',
            scope: this,
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                this.callAsyncFunction();
            }
        };
        Ext.Ajax.request(obt);
    }
})