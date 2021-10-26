Ext.define('MasterSol.store.section_user.SectionUserStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store_user_section',
    model:'MasterSol.model.section_user.SectionUserModel',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: 'app/getviews',
        reader: {
            type: 'json',
            rootProperty: 'datos'
        }
    }
});
