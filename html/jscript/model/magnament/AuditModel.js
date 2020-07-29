Ext.define('MasterSol.model.magnament.AuditModel', {
    extend: 'Ext.data.Model',
    fields: [{
        type: 'string',
        name: 'id'
    }, {
        type: 'string',
        name: 'propiedad'
    }, {
        type: 'string',
        name: 'accion'
    }, {
        type: 'string',
        name: 'usuario'
    }, {
        type: 'date',
        name: 'fecha',
        convert: function (v) {
            return Ext.Date.format(new Date(v), 'd/m/Y H:i:s');
        }
    }, {
        type: 'string',
        name: 'valor_anterior'
    }, {
        type: 'string',
        name: 'valor_nuevo'
    }]
});