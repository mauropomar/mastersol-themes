
Ext.define('MasterSol.model.magnament.ConfigReportModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'nombre',  type: 'string'},
        {name: 'field',  type: 'string'},
        {name: 'padre',       type: 'string'},
        {name: 'tipo',  type: 'string'},
        {name: 'idvalor',  type: 'string'},
        {name: 'valor',  type: 'string'},
        {name: 'orden',  type: 'int'},
        {name: 'real_name_in',  type: 'string'},
        {name: 'id_datatype',  type: 'string'},
        {name: 'idregistro',  type: 'string'},
    ],
});