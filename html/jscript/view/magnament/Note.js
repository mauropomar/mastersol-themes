

/* File Created: June 14, 2013 */
/* Author : Sebastian */
Ext.define("MasterSol.view.magnament.Note", {
    extend: 'Ext.form.Panel',
    border: 0,
    xtype: 'note-view',
    margins: '2 2 2 2',
    autoScroll:true,
    frame: false,
    iconCls: 'fa fa-sticky-note-o',
    tbar: [{
        iconCls:'fa fa-plus',
        tooltip: 'Save changes',
        handler:function(){
            MasterApp.note.addNote();
        }
    },'->',{
        xtype:'tbtext',
        text:'Notas',
        style: {
            fontSize:'15px',
            fontWeight:'bold'
        }
    }],
    listeners:{
        afterrender:function(){
            MasterApp.note = MasterApp.getController('MasterSol.controller.magnament.NoteController')
        }
    }
})