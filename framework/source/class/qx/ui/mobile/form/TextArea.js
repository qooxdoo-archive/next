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
 * The TextArea is a multi-line text input field.
 */
qx.Bootstrap.define("qx.ui.mobile.form.TextArea",
{
  extend : qx.ui.mobile.core.Widget,
  include : [
    qx.ui.mobile.form.MValue,
    qx.ui.mobile.form.MText,
    qx.ui.form.MForm,
    qx.ui.form.MModelProperty,
    qx.ui.mobile.form.MState
  ],
  implement : [
    qx.ui.form.IForm,
    qx.ui.form.IModel
  ],


  /**
   * @param value {var?null} The value of the widget.
   */
  construct : function(value)
  {
    this.base(qx.ui.mobile.core.Widget, "constructor");

    if (value) {
      this.value = value;
    }

    if (qx.core.Environment.get("qx.mobile.nativescroll") == false) {
      this.on("appear", this._fixChildElementsHeight, this);
      this.on("input", this._fixChildElementsHeight, this);
      this.on("changeValue", this._fixChildElementsHeight, this);
    }
    this.initMValue(value);
    this.initMForm();
    this.initMText();
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "text-area"
    }

  },


  members :
  {
    // overridden
    _getTagName : function()
    {
      return "textarea";
    },


    /**
     * Synchronizes the elements.scrollHeight and its height.
     * Needed for making textArea scrollable.
     * @param evt {qx.event.type.Data} a custom event.
     */
    _fixChildElementsHeight : function(evt) {
      this.setStyle("height", "auto")
        .setStyle("height", this[0].scrollHeight + "px");

      var scroll = this.__getScrollContainer();
      if(scroll) {
        scroll.refresh();
      }
    },


    /**
    * Returns the parent scroll container of this widget.
    * @return {qx.ui.mobile.container.Scroll} the parent scroll container or <code>null</code>
    */
    __getScrollContainer : function() {
      var scroll = this;
      while (!(scroll instanceof qx.ui.mobile.container.Scroll)) {
        if (scroll._getParentWidget) {
          var layoutParent = scroll._getParentWidget();
          if (!layoutParent || layoutParent instanceof qx.ui.mobile.core.Root) {
            return null;
          }
          scroll = layoutParent;
        } else {
          return null;
        }
      }
      return scroll;
    },


    dispose : function()
    {
      this.base(qx.ui.mobile.core.Widget, "dispose");
      if (qx.core.Environment.get("qx.mobile.nativescroll") == false) {
        this.off("appear", this._fixChildElementsHeight, this);
        this.off("input", this._fixChildElementsHeight, this);
        this.off("changeValue", this._fixChildElementsHeight, this);
      }
      this.disposeMForm();
    }
  }
});
