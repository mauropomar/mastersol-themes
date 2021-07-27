Ext.define('Capsules.siembra.controller.infiniteScroll.InfiniteController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showWindow: function () {
        Ext.create('Capsules.siembra.view.infiniteScroll.WindowScroll');
    },

    renderTopic: function (value, p, record) {
        return Ext.String.format(
            '<a href="http://sencha.com/forum/showthread.php?t={2}" target="_blank">{0}</a>',
            value,
            record.data.forumtitle,
            record.getId(),
            record.data.forumid
        );
    },

    loadOthers: function () {
        var grid = Ext.ComponentQuery.query('#grid_scroll_infinite')[0];
        var Mask = new Ext.LoadMask(grid, {
            msg: 'Cargando...'
        });
        Mask.show();
        var store = Ext.ComponentQuery.query('#grid_scroll_infinite')[0].getStore();
        var total = store.getCount();
        var start = 0;
        var limit = 30;
        grid.page++;
        var url = 'http://localhost:3001/dev/localization/countries/get?page=' +
            grid.page;
        var load = {
            url: url,
            method: 'GET',
            scope: this,
            params: {},
            success: function (response) {
                Mask.hide();
                var json = Ext.JSON.decode(response.responseText);
                var data = json.data;
                var j = total;
                for(var i = 0; i < data.length; i++){
                    store.insert(j + 1, data[i]);
                    j++;
                }

            }
        };
        Ext.Ajax.request(load);
    },


    setOverride: function () {
        Ext.override(Ext.data.Store, {

            // Handle prefetch when all the data is there and add purging
            prefetchPage: function (page, options, forceLoad) {

                var me = this,
                    pageSize = me.pageSize || 25,
                    start = (page - 1) * me.pageSize,
                    end = start + pageSize;

                // A good time to remove records greater than cache
                me.purgeRecords();

                // No more data to prefetch
                if (me.getCount() === me.getTotalCount() && !forceLoad) {
                    return;
                }

                // Currently not requesting this page and range isn't already satisified
                if (Ext.Array.indexOf(me.pagesRequested, page) === -1 && !me.rangeSatisfied(start, end)) {
                    me.pagesRequested.push(page);

                    // Copy options into a new object so as not to mutate passed in objects
                    options = Ext.apply({
                        page: page,
                        start: start,
                        limit: pageSize,
                        callback: me.onWaitForGuarantee,
                        scope: me
                    }, options);
                    me.prefetch(options);
                }
            },

            // Fixes too big guaranteedEnd and forces load even if all data is there
            doSort: function () {
                var me = this;
                if (me.buffered) {
                    me.prefetchData.clear();
                    me.prefetchPage(1, {
                        callback: function (records, operation, success) {
                            if (success) {
                                guaranteeRange = records.length < 100 ? records.length : 100;
                                me.guaranteedStart = 0;
                                me.guaranteedEnd = 99; // should be more dynamic
                                me.loadRecords(Ext.Array.slice(records, 0, guaranteeRange));
                                me.unmask();
                            }
                        }
                    }, true);
                    me.mask();
                }
            }
        });
    }
});