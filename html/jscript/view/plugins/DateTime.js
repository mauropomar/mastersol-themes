Ext.define('MasterSol.view.plugins.DateTime', {
    extend: 'Ext.form.FieldContainer',
    mixins: {
        field: 'Ext.form.field.Field'
    },
    alias: 'widget.datetimefield',
    layout: 'hbox',
    width: 200,
    height: 22,
    combineErrors: true,
    msgTarget: 'side',
    className:'',
    dateCfg: {},
    timeCfg: {},

    initComponent: function () {
        var me = this;
        me.buildField();
        me.callParent();
        this.dateField = this.down('datefield');
        this.timeField = this.down('timefield');
        me.initField();
    },

    //@private
    buildField: function () {
        this.items = [
            Ext.apply({
                xtype: 'datefield',
                format: 'd-m-Y',
                hasfocus:true,
                width: 100,
                focusOnToFront: false,
                listeners: {
                    scope: this,
                    specialKey: function () {
                        this.timeField.focus('', 10);
                    }
                }
            }, this.dateCfg),
            Ext.apply({
                xtype: 'timefield',
                format: 'H:i',
                width: 80,
                listeners: {
                    scope: this,
                    specialKey: function (field, e) {
                        MasterApp.getController(this.className).specialKey(field, e);
                    }
                }
            }, this.timeCfg)
        ]
    },

    getValue: function () {
        var value, date = this.dateField.getSubmitValue(), time = this.timeField.getSubmitValue();
        if (date) {
            if (time) {
                var format = this.getFormat();
                value = Ext.Date.parse(date + ' ' + time, format)
            } else {
                value = this.dateField.getValue();
            }
        }
        return value;
    },


    getSubmitData: function () {
        var value = this.getValue();
        var format = this.getFormat();
        return value ? Ext.Date.format(value, format) : null;
    },

    getFormat: function () {
        return (this.dateField.submitFormat || this.dateField.format) + " " + (this.timeField.submitFormat || this.timeField.format)
    },

    setMaxValue: function (value) {
        if (value === null || value === '')
            return;
        this.dateField.setMaxValue(value);
    },

    setMinValue: function (value) {
        if (value === null || value === '')
            return;
        this.dateField.setMinValue(value);
    },

    setValue: function (value) {
        value = this.formatValue(value);
        this.dateField.setValue(value);
        this.timeField.setValue(value);
    },

    formatValue: function (value) {
        var dateValue = new Date(value);
        if (Ext.isDate(dateValue) && dateValue != 'Invalid Date')
            return dateValue;
        if (!value || value == null || value == 'Invalid Date')
            return new Date();
        var day = value.substring(0, 2);
        var month = value.substring(3, 5);
        var year = value.substring(6, 10);
        var hour = value.substring(11, 13);
        var minute = value.substring(14, 16);
        var seconds = value.substring(17, 21);
        var newValue = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + seconds;
        return new Date(newValue);
    }
})