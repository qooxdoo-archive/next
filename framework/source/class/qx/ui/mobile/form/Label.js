"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * The label widget displays a text or HTML content in form context.
 *
 * It uses the html tag <label>, for making it possible to set the
 * "for" attribute.
 *
 * The "for" attribute specifies which form element a label is bound to.
 * A tap on the label is forwarded to the bound element.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var checkBox = new qx.ui.mobile.form.CheckBox();
 *   var label = new qx.ui.mobile.form.Label("Label for CheckBox");
 *
 *   label.setLabelFor(checkBox.getAttribute("id"));
 *
 *   this.getRoot().append(label);
 *   this.getRoot().append(checkBox);
 * </pre>
 *
 * This example create a widget to display the label.
 *
 */
qx.Bootstrap.define("qx.ui.mobile.form.Label",
{
  extend : qx.ui.mobile.core.Widget,


  /**
   * @param value {String?null} Text or HTML content to display
   */
  construct : function(value)
  {
    this.base(qx.ui.mobile.core.Widget, "constructor");
    if (value) {
      this.value = value;
    }

    this.addClass("gap");
    var layout = new qx.ui.mobile.layout.HBox();
    layout.alignY = "middle";
    layout.alignX = "left";
    this._setLayout(layout);
    this.textWrap = true;

    if (qx.core.Environment.get("qx.dynlocale")) {
      qx.locale.Manager.getInstance().on("changeLocale", this._onChangeLocale, this);
    }

    this.on("tap", this._onTap, this);
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
      apply : "_applyValue",
      event : "changeValue"
    },


    // overridden
    anonymous :
    {
      init : false
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
    __forWidget : null,


     // overridden
    _getTagName : function()
    {
      return "label";
    },


    // property apply
    _applyValue : function(value, old)
    {
      var html = value;

      // [BUG #7871] Bugfix for IE 10 for enabling word-wrap within a flexbox layout.
      if (qx.core.Environment.get("css.flexboxSyntax") === "flexbox") {
        html = "<p>" + value + "</p>";
      }
      this.setHtml(html);
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
    * Event handler for the <code>changeEnabled</code> event on the target.
    * @param evt {qx.event.type.Data} the changeEnabled event.
    */
    _changeEnabled: function(evt) {
      if (evt) {
        this.enabled = evt.value;
      }
    },


    /**
     * Setter for the "for" attribute of this label.
     * The "for" attribute specifies which form element a label is bound to.
     *
     * @param elementId {String} The id of the element the label is bound to.
     *
     */
    setLabelFor: function(elementId) {
      if (this.__forWidget) {
        this.__forWidget.off("changeEnabled", this._changeEnabled, this);
      }

      this.__forWidget = qx.ui.mobile.core.Widget.getWidgetById(elementId);

      if (this.__forWidget) {
        this.__forWidget.on("changeEnabled", this._changeEnabled, this);
        this.enabled = this.__forWidget.enabled;
      }

      this._setAttribute("for", elementId);
    },


    /**
     * Handler for <code>tap</code> event on the Label. This event will be delegated to target widget.
     * @param evt {qx.event.type.Pointer} The tap event.
     */
    _onTap: function(evt) {
      if (this.__forWidget) {
        this.__forWidget.emit("tap", evt);
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
      this.base(qx.ui.mobile.core.Widget, "dispose");
      this.off("tap", this._onTap, this);

      if (this.__forWidget) {
        this.__forWidget.off("changeEnabled", this._changeEnabled, this);
        this.__forWidget = null;
      }
    }
  }
});
