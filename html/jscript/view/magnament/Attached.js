

/* File Created: June 14, 2013 */
/* Author : Sebastian */
Ext.define("MasterSol.view.magnament.Attached", {
    extend: 'Ext.form.Panel',
    border: 0,
    xtype: 'attached-view',
    margins: '2 2 2 2',
    frame: false,
    iconCls: 'fa fa-paperclip',
    tbar: [{
        iconCls:'fa fa-save',
        //     handler: 'guardar',
        hidden:true,
        tooltip: 'Save changes'
    },'->',{
        xtype:'tbtext',
        text:'Adjunto',
        style: {
            fontSize:'15px',
            fontWeight:'bold'
        }
    }],
    items: [
        {
            xtype: 'filebutton',
            buttonOnly: true,
            iconCls:'fa fa-plus',
            cls:'x-btn-form',
            name: 'file_adjunto',
            style:{
                marginLeft:'10px',
                marginTop:MasterApp.theme.getStyleFileButton()
            },
            listeners: {
                change:function(view, eOpts, value){
                    MasterApp.attached.change(view, eOpts, value)
                }
            }
        }
    ],
    listeners:{
        afterrender:function(){
            MasterApp.attached = MasterApp.getController('MasterSol.controller.magnament.AttachedController');
        }
    }
});