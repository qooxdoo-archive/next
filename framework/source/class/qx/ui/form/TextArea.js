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
qx.Class.define("qx.ui.form.TextArea",
{
  extend : qx.ui.Widget,
  include : [
    qx.ui.form.MText,
    qx.ui.form.MForm
  ],
  implement : [
    qx.ui.form.IForm
  ],


  /**
   * @param value {var?null} The value of the widget.
   */
  construct : function(value, element)
  {
    this.super("construct", element);

    if (value) {
      this.value = value;
    }

    this.initMForm();
    this.initMText();
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "text-area"
    },


    /**
     * Model property for storing additional information for the TextArea.
     *
     * Be careful using that property as this is used for the
     * {@link qx.ui.form.MModelSelection} it has some restrictions:
     *
     * * Don't use equal models in one widget using the
     *     {@link qx.ui.form.MModelSelection}.
     *
     * * Avoid setting only some model properties if the widgets are added to
     *     a {@link qx.ui.form.MModelSelection} widget.
     *
     * Both restrictions result of the fact, that the set models are deputies
     * for their widget.
     */
    model :
    {
      nullable : true,
      event : true
    }
  },


  members :
  {
    // overridden
    _getTagName : function()
    {
      return "textarea";
    },

    // overridden
    _setValue: function (value) {
      this.setHtml(value);
    },

    // overridden
    _getValue: function () {
      return this.getHtml();
    },


    /**
     * Synchronizes the elements.scrollHeight and its height.
     * Needed for making textArea scrollable.
     */
    _fixChildElementsHeight : function() {
      this.setStyle("height", "auto")
        .setStyle("height", this[0].scrollHeight + "px");

      var scroll = this.__getScrollContainer();
      if(scroll) {
        scroll.refresh();
      }
    },


    /**
    * Returns the parent scroll container of this widget.
    * @return {qx.ui.container.Scroll} the parent scroll container or <code>null</code>
    */
    __getScrollContainer : function() {
      var scroll = this;
      while (!(scroll instanceof qx.ui.container.Scroll)) {
        if (scroll._getParentWidget) {
          var layoutParent = scroll._getParentWidget();
          if (!layoutParent || layoutParent instanceof qx.ui.core.Root) {
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
      this.super("dispose");
      this.disposeMForm();
    }
  }
});
