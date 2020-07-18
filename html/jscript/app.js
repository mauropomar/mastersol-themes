Ext.application({
    name: 'MasterSol',
    appFolder:'html/jscript',
    launch: function () {
        MasterApp = this;
        Ext.create('MasterSol.view.layout.Viewport');
    }
});