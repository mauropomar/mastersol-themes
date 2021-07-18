Ext.define('Capsules.siembra.controller.infiniteScroll.InfiniteController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    showWindow: function () {
        Ext.create('Capsules.siembra.view.infiniteScroll.WindowScroll');
    },

    renderTopic:function(value, p, record) {
        return Ext.String.format(
            '<a href="http://sencha.com/forum/showthread.php?t={2}" target="_blank">{0}</a>',
            value,
            record.data.forumtitle,
            record.getId(),
            record.data.forumid
        );
    }
});