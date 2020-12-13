/**
 * @class Ext.ux.button.BadgeButton
 * @extends Ext.button.Button
 *
 * @author Tomasz Jagusz
 * based on: http://blogs.walkingtree.in/2012/07/16/badge-text-in-extjs-4-1/
 * based on: https://github.com/vondervick/ext/tree/master/badge_button
 */

Ext.define('MasterSol.view.plugins.Badgeable', {
        extend : 'Ext.Mixin',

    requires : [
        //require this for the override
        'Ext.button.Button'
    ],

    mixinConfig : {
        id : 'badge',
        after : {
            onRender : 'renderBadgeText'
        }
    },

    config : {
        badgeText : null
    },

    renderBadgeText : function() {
        var badgeText = this.getBadgeText();

        if (badgeText) {
            this.updateBadgeText(badgeText);
        }
    },

    updateBadgeText : function(badgeText, oldBadgeText) {
        var me = this,
            el = me.el;

        if (me.rendered) {
            el.set({
                'data-badge-text' : badgeText
            });

            el.toggleCls(Ext.baseCSSPrefix + 'badge', !!badgeText);

            me.fireEvent('badgetextchange', me, badgeText, oldBadgeText);
        }
    }
}, function(BadgeMixin) {
    Ext.override(Ext.button.Button, {
        mixins: [BadgeMixin]
    });
});