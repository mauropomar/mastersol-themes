Ext.define('MasterSol.view.layout.ComboWindow', {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'MasterSol.store.layout.WindowStore'
    ],
    xtype: 'combowindow',
    fieldLabel: 'Ventana',
    name: 'combowindow',
    tpl: new Ext.XTemplate('<tpl for=".">', '<div class="x-boundlist-item">', '<button  class="x-btn-delete-ventana"><i style="top:50%;left:50%" class="fa fa-times fa-1x"></i></button>', '{name}', '</div>', '</tpl>'),
    store: {
        type: 'store_window'
    },
    listConfig: {
        width: 300,
        listeners: {
            itemclick: function (combo, record, item, index, e) {
                if (e.target.tagName == 'BUTTON' || e.target.tagName == 'I') {
                    e.preventDefault();
                    Ext.ComponentQuery.query('#combowindow')[0].reset();
                    combo.store.removeAt(index);
                    var windows = MasterApp.util.getMenuByName(record.data.name);
                    windows.close();
                    combo.reset();
                }
            }
        }
    },
    matchFieldWidth: false,
    valueField: 'id',
    displayField: 'name',
    typeAhead: true,
    hideLabel: true,
    queryMode: 'local',
    emptyText: 'Seleccione una ventana...',
    listeners:{
        select:function(combo, record){
            MasterApp.footer.selectWindow(combo, record);
        }
    }
})