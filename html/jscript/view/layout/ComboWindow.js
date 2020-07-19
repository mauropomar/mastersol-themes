Ext.define('MasterSol.view.layout.ComboWindow', {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'MasterSol.store.layout.WindowStore'
    ],
    xtype: 'combowindow',
    fieldLabel: 'Ventana',
    name: 'combowindow',
    tpl: new Ext.XTemplate('<tpl for=".">', '<div class="x-boundlist-item">', '<button  class="x-btn-delete-ventana"><i style="top:50%;left:50%" class="fa fa-trash fa-1x"></i></button>', '{nombre}', '</div>', '</tpl>'),
    store: {
        type: 'store_window'
    },
    listConfig: {
        width: 300,
        listeners: {
            itemclick: function (combo, record, item, index, e) {
                if (e.target.tagName == 'BUTTON' || e.target.tagName == 'I') {
                    e.preventDefault();
                    combo.store.removeAt(index);
                    var windows = Ext.ComponentQuery.query('window[name=window_product]');
                    for (var j = 0; j < windows.length; j++) {
                        if (windows[j].getTitle() == record.data.nombre) {
                            windows[j].close();
                            Ext.ComponentQuery.query('#combowindow')[0].reset();
                        }
                    }
                }
            }
        }
    },
    matchFieldWidth: false,
    valueField: 'id',
    displayField: 'nombre',
    typeAhead: true,
    hideLabel: true,
    queryMode: 'local',
    emptyText: 'Select ventana...'
})