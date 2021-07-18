/**
 * This class is the layout view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Capsules.siembra.view.infiniteScroll.WindowScroll', {
    extend: 'Ext.window.Window',
    xtype: 'window-infinite-scroll',
    closable: true,
    closeAction: 'destroy',
    height: 300,
    width: 600,
    title: 'Infinite Scroll',
    layout: 'fit',
    autoShow: true,
    requires: [
        'Capsules.siembra.store.infiniteScroll.InfiniteStore'
    ],
    items: [{
        xtype: 'gridpanel',
        id: 'grid_scroll_infinite',
        loadMask: true,
        selModel: {
            pruneRemoved: false
        },
        viewConfig: {
            trackOver: false
        },
        store: {
            type: 'store_infinite_scroll'
        },
        columns:[{
            xtype: 'rownumberer',
            width: 50,
            sortable: false,
            locked: true,
            lockable: false
        },{
            tdCls: 'x-grid-cell-topic',
            text: "Topic",
            dataIndex: 'title',
            flex: 1,
            renderer: function(value, p, record){
               return MasterApp.getController('Capsules.siembra.controller.infiniteScroll.InfiniteController').renderTopic(value, p, record);
            },
            sortable: false
        },{
            text: "Author",
            dataIndex: 'username',
            width: 100,
            hidden: true,
            sortable: true
        },{
            text: "Replies",
            dataIndex: 'replycount',
            align: 'center',
            width: 70,
            sortable: false
        },{
            id: 'last',
            text: "Last Post",
            dataIndex: 'lastpost',
            width: 130,
            renderer: Ext.util.Format.dateRenderer('n/j/Y g:i A'),
            sortable: true
        }],
        features: [{
            ftype: 'grouping',
            groupHeaderTpl: '{name}'
        }]

    }]
});