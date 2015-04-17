define(['qx/Class', 'qx/ui/Widget', 'qxWeb'], function(Dep0,Dep1,Dep2) {
var qx = {
  "Class": Dep0,
  "ui": {
    "Widget": Dep1,
    "Label": null
  }
};
var qxWeb = Dep2;

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
 * The label widget displays a text or HTML content.
 *
 * @ignore(qx.type.BaseString.*)
 *
 * @group(Widget)
 */
var clazz = qx.Class.define("qx.ui.Label",
{
  extend : qx.ui.Widget,


  /**
   * @param value {String?null} Text or HTML content to display
   * @attach {qxWeb, toLabel}
   * @return {qx.ui.Label} The new label widget.
   */
  construct : function(value, element)
  {
    this.super("construct", element);

    var html = this.getHtml();
    this.setHtml('');

    if (html) {
      this.value = html;
    }

    if (value) {
      this.value = value;
    }
    this.textWrap = true;
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "label"
    },


    /**
     * Text or HTML content to display
     */
    value :
    {
      nullable : true,
      init : null,
      check : "_checkValue",
      apply : "_applyValue",
      event : true
    },


    // overridden
    anonymous :
    {
      init : true
    },


    /**
     * Controls whether text wrap is activated or not.
     */
    textWrap :
    {
      check : "Boolean",
      init : true,
      apply : "_applyTextWrap"
    }
  },


  members :
  {

    /**
     * Property validation
     * @param value {String|qx.type.BaseString} value
     * @return {Boolean} <code>true</code> if the value is valid
     */
    _checkValue: function(value) {
      return qx.Class.getClass(value) === "String" ||
        (qx.type.BaseString && value instanceof qx.type.BaseString);
    },

    // property apply
    _applyValue : function(value)
    {
      this.setHtml(value);
    },


    // property apply
    _applyTextWrap : function(value)
    {
      if (value) {
        this.removeClass("no-wrap");
      } else {
        this.addClass("no-wrap");
      }
    },


    dispose : function() {
      this.super("dispose");
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

 qx.ui.Label = clazz;
return clazz;
});
