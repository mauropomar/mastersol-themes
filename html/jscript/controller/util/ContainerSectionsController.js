Ext.define('MasterSol.controller.util.ContainerSectionsController', {
    extend: 'Ext.app.Controller',
    init: function () {

    },

    getPanel: function (title, json, tools, height, name, windowParent) {
        var columns = json.columnas;
        var data = json.datos;
        var tools = json.buttons;
        var atribute = {
            "section_checked": (json.section_checked) ? json.section_checked : false
        };
        var gridsection = MasterApp.gridsections.getComponents('', columns, tools, height - 30, data, name, windowParent, atribute);
        var gridtotal = MasterApp.gridtotal.getComponents('', columns, [], 30, data, 'grid_total');
        if (!gridtotal.isVisible()) {
            gridtotal.setHeight(0);
            var height = gridsection.height + 30;
            gridsection.setHeight(height);
        }
        return Ext.create('Ext.panel.Panel', {
            height: height,
            title: title,
            idparent:json.idpadre,
            idsection:json.id,
            items: [gridsection, gridtotal],
            idrecordparent:null,
            listeners: {
                afterrender: function (panel) {
                    gridsection.view.getEl().on('scroll', function (e, t) {
                        gridtotal.view.getEl().dom.scrollLeft = t.scrollLeft;
                    }, gridsection.view.getEl(), {delay: 50});
                }
            }
        })
    }
});