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
  // ABSTRACT
  extend : qx.ui.mobile.Widget,

  include : [
    qx.ui.mobile.form.MForm,
    qx.ui.mobile.container.MScrollHandling
  ],
  implement : [
    qx.ui.form.IForm
  ],


  construct : function(element)
  {
    this.base(qx.ui.mobile.Widget, "constructor", element);
    this.required = undefined;
    this.addClass("gap");

    this.on("focus", this._onSelected, this);
    this.initMForm();
  },

  events: {
    changeModel: null,
    invalid: null
  },


  properties :
  {
    /**
     * Model property for storing additional information for the input
     * widget. It can act as value property for example.
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
    },

    type: {
      check: "String",
      apply: "_applyType"
    }
  },


  members :
  {

    // overridden
    _getTagName : function() {
      return "input";
    },


    _applyType: function(value) {
      this.setAttribute("type", value);
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
