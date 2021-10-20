Ext.define('MasterSol.store.section_user.SectionUserStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store_user_section',
    model:'MasterSol.model.section_user.SectionUserModel',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'app/capsules',
        reader: {
            type: 'json',
            rootProperty: 'datos'
        }
    }
});
