/**
 * @author mauro
 */
Ext.define("Capsules.siembra.view.button.button", {
    extend: 'Ext.Button',
    alias: 'widget.buttonDinamic',
    initComponent: function () {
        Ext.apply(this, {
            control:"Capsules.siembra.controller.button.buttonController",
            name: 'button_siembra',
            text: 'Agregar',
            tooltipType: 'title',
            tooltip: 'Mostrar Siembra',
            listeners:{
                afterrender:function(){

                },
                click:function(btn){
                    MasterApp.getController(this.control).click(btn);
                }
            }
        });
        this.callParent();
    }
});