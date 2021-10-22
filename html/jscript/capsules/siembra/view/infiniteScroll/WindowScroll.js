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
    height: 200,
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
        page: 0,
        viewConfig: {
            trackOver: false,
            singleSelect: true,
        },
        features: [{
            ftype: 'filters',
            updateBuffer: 1000 // trigger load after a 1 second timer
        }],
        verticalScrollerType: 'paginggridscroller',
        invalidateScrollerOnRefresh: false,
        store: {
            type: 'store_infinite_scroll'
        },
        listeners: {
            afterrender: function (comp) {
                comp.getTargetEl().on('mouseup', function (e, t) {
                    var height = comp.getTargetEl().getHeight();
                    if (height + t.scrollTop >= t.scrollHeight) {
                        MasterApp.getController('Capsules.siembra.controller.infiniteScroll.InfiniteController').loadOthers();
                    }
                });
            }
        },
        columns: [{
            xtype: 'rownumberer',
            width: 50,
            sortable: false,
            locked: true,
            lockable: false
        }, {
            text: "Nombre",
            dataIndex: 'name',
            flex: 1,
            sortable: false
        }, {
            text: "Region",
            dataIndex: 'region',
            width: 100,
            hidden: true,
            sortable: true
        }, {
            text: "Capital",
            dataIndex: 'capital',
            align: 'center',
            width: 70,
            sortable: false
        }, {
            text: "Sub region",
            dataIndex: 'subregion',
            width: 130,
            sortable: true
        }],
        features: [{
            ftype: 'grouping',
            groupHeaderTpl: '{name}'
        }]

    }]
});