Ext.define('MasterSol.store.magnament.UsersStore', {
    extend: 'Ext.data.Store',
    alias: 'store.store-users',
    fields:['id', 'nombre'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/manager/getusers.php',
        reader: {
            type: 'json',
            rootProperty: ''
        }
    }
})