Ext.define('MasterSol.view.magnament.Register', {
    extend: 'Ext.grid.Panel',
    xtype: 'register-view',
    requires: [
        //  'Ext.grid.feature.Grouping',
        'MasterSol.store.magnament.RegisterStore',
        'Ext.selection.CellModel'
    ],
    iconCls: 'fa fa-registered',
    frame: true,
    idrecordSection: null,
    selModel: {
        type: 'cellmodel'
    },
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
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
    }],
    viewConfig: {},
    tbar: [{
        iconCls: 'fa fa-check',
        id: 'btn_insert_register',
        // cls:'x-btn-toolbar',
        tooltip: 'Aplicar Cambios',
        handler: function () {
            MasterApp.register.saveChanges();
        }
    }, {
        iconCls: 'fa fa-save',
        id: 'btn_save_register',
        hidden: true,
        tooltip: 'Guardar Cambios',
        handler: function () {
            MasterApp.register.saveChanges();
        }
    },{
        iconCls: 'fa fa-close',
        tooltip: 'Cancelar',
        handler: function () {
            MasterApp.register.onChangesReject();
        }
    }, '->', {
        xtype: 'tbtext',
        text: 'Registro',
        id:'tbtext_magnament_register',
        style: {
            fontSize: '10px',
            fontWeight: 'bold'
        }
    }],
    listeners: {
        beforeedit: function (editor, e, eOpts) {
           MasterApp.register.beforeedit(editor, e, eOpts)
        },
        edit:function (editor, e) {
            MasterApp.register.edit(editor, e)
        },
    }
});