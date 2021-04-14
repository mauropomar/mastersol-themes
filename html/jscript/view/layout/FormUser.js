/**
 * This example shows using multiple sorters on a Store attached to a DataView.
 *
 * We're also using the reorderable toolbar plugin to make it easy to reorder the sorters
 * with drag and drop. To change the sort order, just drag and drop the "Type" or "Name"
 * field.
 */
Ext.define('MasterSol.view.layout.FormUser', {
    extend: 'Ext.form.Panel',
    xtype: 'form-user',
    requires: ['MasterSol.view.layout.ComboRol',
        'MasterSol.view.layout.ComboLanguage'
    ],
    frame: true,
    bodyPadding: 10,
    defaults: {
        labelAlign: 'top',
        anchor: '100%',
        labelWidth: 60
    },
    tbar: [{
        xtype: 'button',
        iconCls: 'fa fa-save',
        handler: function(){
            MasterApp.user.save();
        }
    }],
    items: [{
        xtype: 'comborol',
        id: 'comborol'
    }, {
        xtype: 'combolanguage',
        id: 'combolanguage'
    }, ]
});