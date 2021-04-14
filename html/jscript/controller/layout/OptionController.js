Ext.define('MasterSol.controller.layout.OptionController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    select:function(record){
        var controller = MasterApp.menu;
        controller.menu.id = record.data.id;
        controller.menu.idsection = record.data.sectionId;
        controller.menu.name = record.data.text;
        controller.getData(record);
    },

    render:function(){
        var tree = Ext.ComponentQuery.query('tree-options')[0];
        tree.getRootNode().cascadeBy(function (rec) {
            if (rec.getDepth() == 2) {
                rec.collapse();
            }
        });
    },

    expandNode:function(node){
        if (node.childNodes.length > 0) {
            return;
        };
        node.set('icon', 'html/assets/icons/others/blue-loading.gif');
        var getchild = {
            url: 'app/menusoption',
            method: 'GET',
            scope: this,
            params: {
                idparent: node.id
            },
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                for (var i = 0; i < json.length; i++) {
                    var objs = {
                        id: json[i]['id'],
                        text: json[i]['text'],
                        leaf: json[i]['leaf']
                    };
                    node.insertChild(i, objs);
                }
                node.set('icon', '');
            },
        };
        Ext.Ajax.request(getchild);
    },

    getOptions: function () {
        var obt = {
            url: 'app/menusoption',
            method: 'GET',
            scope: this,
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                if (json.length > 0) {
                    var root = {
                        text: 'Opciones',
                        expanded: true,
                        children: json
                    };
                    var store = Ext.ComponentQuery.query('tree-options')[0].store;
                    store.setRootNode(root);
                }
            }
        };
        Ext.Ajax.request(obt);
    }
});