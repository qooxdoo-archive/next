define(['qx/Class', 'qx/ui/layout/Abstract'], function(Dep0,Dep1) {
var qx = {
  "Class": Dep0,
  "ui": {
    "layout": {
      "Abstract": Dep1,
      "AbstractBox": null
    }
  }
};

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * Base class for all box layout managers.
 */
var clazz = qx.Class.define("qx.ui.layout.AbstractBox",
{
  extend : qx.ui.layout.Abstract,


  /**
   * @param alignX {String?null} Sets the {@link #alignX} property
   * @param alignY {String?null} Sets the {@link #alignY} property
   * @param reversed {Boolean?null} Sets the {@link #reversed} property
   */
  construct : function(alignX, alignY, reversed)
  {
    this.super("construct");

    if (alignX) {
      this.alignX = alignX;
    }
    if (alignY) {
      this.alignY = alignY;
    }
    if (reversed) {
      this.reversed = reversed;
    }
  },


  properties :
  {
    /**
     * Horizontal alignment of the whole children block.
     */
    alignX :
    {
      check : [ "left", "center", "right" ],
      nullable : true,
      init : null,
      apply : "_applyLayoutChange"
    },


    /**
     * Vertical alignment of each child.
     */
    alignY :
    {
      check : [ "top", "middle", "bottom" ],
      nullable : true,
      init : null,
      apply : "_applyLayoutChange"
    },


    /**
     * Children will be displayed in reverse order.
     */
    reversed :
    {
      check : "Boolean",
      nullable : true,
      init : null,
      apply : "_applyLayoutChange"
    }
  },


  statics :
  {
    /**
     * The property to CSS mapping.
     */
    PROPERTY_CSS_MAPPING :
    {
      "alignX":
      {
        "qx-hbox" :
        {
          "left" : "qx-flex-justify-start",
          "center" : "qx-flex-justify-center",
          "right" : "qx-flex-justify-end"
        },
        "qx-vbox" :
        {
          "left" : "qx-flex-align-start",
          "center" : "qx-flex-align-center",
          "right" : "qx-flex-align-end"
        }
      },
      "alignY" :
      {
        "qx-hbox" :
        {
          "top" : "qx-flex-align-start",
          "middle" : "qx-flex-align-center",
          "bottom" : "qx-flex-align-end"
        },
        "qx-vbox" :
        {
          "top" : "qx-flex-justify-start",
          "middle" : "qx-flex-justify-center",
          "bottom" : "qx-flex-justify-end"
        }
      },
      "reversed" :
      {
        "qx-hbox" :
        {
          "true" : "qx-flex-reverse",
          "false" : null
        },
        "qx-vbox" :
        {
          "true" : "qx-flex-reverse",
          "false" : null
        }
      }
    },


    /**
     * Supported child layout properties. Used to check if the property is allowed.
     * List all supported child layout properties here.
     */
    SUPPORTED_CHILD_LAYOUT_PROPERTIES : {
      "flex" : 1
    }
  },


  members :
  {
    // overridden
    _getSupportedChildLayoutProperties : function() {
      return qx.ui.layout.AbstractBox.SUPPORTED_CHILD_LAYOUT_PROPERTIES;
    },


    // overridden
    _setLayoutProperty : function(widget, property, value)
    {
      if (property == "flex") {
        var old = this._getChildLayoutPropertyValue(widget, property);
        if (old) {
          widget.removeClass("qx-flex" + old);
        }
        widget.addClass("qx-flex" + value);
      }
    },


    // overridden
    connectToWidget : function(widget)
    {
      if (this._widget) {
        this.alignX = undefined;
        this.alignY = undefined;
        this.reversed = undefined;
      }
      this.super("connectToWidget", widget);
    },


    // overridden
    disconnectFromChildWidget : function(widget)
    {
      this.super("disconnectFromChildWidget");
      for (var i = 0; i <= 6; i++) {
        widget.removeClass("qx-flex" +i);
      }
    },


    // overridden
    disconnectFromWidget: function(widget) {
      this.super("disconnectFromWidget", widget);
      if (widget) {
        var classes = this._getPropertyClasses();
        widget.removeClasses(classes);
      }
    },


    /**
     * Returns the CSS classes corresponding to the current values of
     * the layout's properties
     * @return {String[]} List of CSS class names
     */
    _getPropertyClasses: function() {
      var map = qx.ui.layout.AbstractBox.PROPERTY_CSS_MAPPING;
      var layoutCss = this._getCssClasses()[0];
      var propClasses = [];
      Object.keys(this.$$properties).forEach(function(propName) {
        var propVal = this[propName];
        if (propVal !== undefined && propVal !== null) {
          propVal = propVal + "";
          if (map[propName] && map[propName][layoutCss] &&
            map[propName][layoutCss][propVal])
          {
            propClasses.push(map[propName][layoutCss][propVal]);
          }
        }
      }.bind(this));

      return propClasses;
    },



    // property apply
    _applyLayoutChange : function(value, old, property)
    {
      if (this._widget)
      {
        // In this case the layout should only have one main css class.
        var layoutCss = this._getCssClasses()[0];
        var CSS_MAPPING = qx.ui.layout.AbstractBox.PROPERTY_CSS_MAPPING[property][layoutCss];
        if (old)
        {
          var oldCssClass = CSS_MAPPING[old];
          if (oldCssClass) {
            this._widget.removeClass(oldCssClass);
          }
        }
        if (value)
        {
          var cssClass = CSS_MAPPING[value];
          if (cssClass) {
            this._widget.addClass(cssClass);
          }
        }
      } else {
        // remember the state until the widget is connected
        if (value) {
          this._addCachedProperty(property, value);
        }
      }
    }
  }
});

 qx.ui.layout.AbstractBox = clazz;
return clazz;
});
