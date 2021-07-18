/**
 * This class is the layout view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Capsules.siembra.view.panel.PanelJson', {
    extend: 'Ext.panel.Panel',
    xtype: 'paneljson',
    iconCls: 'fa fa-check',
    idmenumag: null,
    idsectionmag: null,
    header: false,
    layout: 'fit',
    control: "Capsules.siembra.controller.panel.JsonController",
    tbar: [{
        xtype: 'button',
        iconCls: 'fa fa-check',
        text: 'Enviar Json',
        id: 'btn_send_json',
        handler:function(){
            MasterApp.getController("Capsules.siembra.controller.panel.JsonController").sendJson();
        }
    },{
        xtype: 'button',
        iconCls: 'fa fa-check',
        text: 'Infinite Scroll',
        handler:function(){
            MasterApp.getController('Capsules.siembra.controller.infiniteScroll.InfiniteController').showWindow();
        }
    }],
    requires: [
        'MasterSol.view.magnament.Register',
        'MasterSol.store.magnament.RegisterStore',
    ],
    items: [{
        xtype: 'gridpanel',
        id: 'register-json',
        store: {
            type: 'store-register'
        },
        columns: [{
            text: 'Nombre',
            dataIndex:'name',
            flex: 1,
            renderer: function (value, metaData, record) {
                return MasterApp.register.renderName(value, metaData, record);
            }
        }, {
            text:'Valor',
            dataIndex:'valor',
            flex: 3,
            editor: {
                xtype: 'textfield',
            },
            renderer: function (value, metaData, record) {
                return MasterApp.util.afteredit(value, metaData, record);
            }
        }],
        features: [{
            ftype: 'grouping',
            groupHeaderTpl: '{name}'
        }]

    }]
});