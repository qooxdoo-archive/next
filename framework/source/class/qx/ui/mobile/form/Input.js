"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * Abstract class for all input fields.
 * @require(qx.module.AnimationFrame)
 */
qx.Class.define("qx.ui.mobile.form.Input",
{
  extend : qx.ui.mobile.Widget,
  include : [
    qx.ui.form.MForm,
    qx.ui.form.MModelProperty,
    qx.ui.mobile.container.MScrollHandling,
    qx.ui.mobile.form.MState
  ],
  implement : [
    qx.ui.form.IForm,
    qx.ui.form.IModel
  ],


  construct : function(element)
  {
    this.base(qx.ui.mobile.Widget, "constructor", element);
    this.setAttribute("type", this._getType());
    this.addClass("gap");

    this.on("focus", this._onSelected, this);
  },


  members :
  {
    // overridden
    _getTagName : function()
    {
      return "input";
    },


    /**
     * Returns the type of the input field. Override this method in the
     * specialized input class.
     */
    _getType : function()
    {
      if (qx.core.Environment.get("qx.debug")) {
        throw new Error("Abstract method call");
      }
    },


    /**
     * Handles the <code>click</code> and <code>focus</code> event on this input widget.
     * @param evt {qx.event.type.Event} <code>click</code> or <code>focus</code> event
     */
    _onSelected : function(evt) {
      var widget = qx.ui.mobile.Widget.getWidgetById(evt.target.getAttribute("id"));
      if (!widget ||
        (!(widget instanceof qx.ui.mobile.form.TextField) && !(widget instanceof qx.ui.mobile.form.NumberField))) {
        return;
      }

      var scrollContainer = this._getParentScrollContainer();
      if(scrollContainer === null) {
        return;
      }

      setTimeout(function() {
        scrollContainer.scrollToWidget(this._getParentWidget(), 0);

        // Refresh caret position after scrolling.
        this.setStyle("position","relative");
        qxWeb.requestAnimationFrame(function() {
          this.setStyle("position",null);
        }, this);
      }.bind(this), 300);
    },


    dispose : function() {
      this.base(qx.ui.mobile.Widget, "dispose");
      this.off("focus", this._onSelected, this);
      this.disposeMForm();
    }
  }
});
