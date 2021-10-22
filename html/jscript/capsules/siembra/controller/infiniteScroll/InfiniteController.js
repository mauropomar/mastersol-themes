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
      //  var start = 0;
      //  var limit = 30;
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
    }
});