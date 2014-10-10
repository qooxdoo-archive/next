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
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var label = new qx.ui.mobile.basic.Label("Hello World");
 *
 *   this.getRoot().append(label);
 * </pre>
 *
 * This example create a widget to display the label.
 *
 * @ignore(qx.type.BaseString.*)
 *
 */
qx.Class.define("qx.ui.mobile.basic.Label",
{
  extend : qx.ui.mobile.Widget,


  /**
   * @param value {String?null} Text or HTML content to display
   */
  construct : function(value, element)
  {
    this.base(qx.ui.mobile.Widget, "constructor", element);
    if (value) {
      this.value = value;
    }
    this.textWrap = true;

    if (qx.core.Environment.get("qx.dynlocale")) {
      qx.locale.Manager.getInstance().on("changeLocale", this._onChangeLocale, this);
    }
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
    _applyValue : function(value, old)
    {
      this.setHtml(value);
    },


    // property apply
    _applyTextWrap : function(value, old)
    {
      if (value) {
        this.removeClass("no-wrap");
      } else {
        this.addClass("no-wrap");
      }
    },

    /**
     * Locale change event handler
     *
     * @signature function(e)
     * @param e {Event} the change event
     */
    _onChangeLocale : qx.core.Environment.select("qx.dynlocale",
    {
      "true" : function(e)
      {
        var content = this.value;
        if (content && content.translate) {
          this.value = content.translate();
        }
      },

      "false" : null
    }),


    dispose : function() {
      this.base(qx.ui.mobile.Widget, "dispose");
      if (qx.core.Environment.get("qx.dynlocale")) {
        qx.locale.Manager.getInstance().off("changeLocale", this._onChangeLocale, this);
      }
    }
  }
});
