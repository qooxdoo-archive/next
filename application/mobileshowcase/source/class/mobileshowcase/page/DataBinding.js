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
     * Christopher Zündorf (czuendorf)

************************************************************************ */

/**
 * Mobile page responsible for showing the "DataBinding" showcase.
 */
qx.Bootstrap.define("mobileshowcase.page.DataBinding",
{
  extend : mobileshowcase.page.Abstract,

  construct : function()
  {
    this.base(mobileshowcase.page.Abstract, "constructor");
    this.title = "Data Binding";
  },


  /*
  *****************************************************************************
    PROPERTIES
  *****************************************************************************
  */
  properties :
  {
    // overridden
    listData :
    {
      init : new qx.data.Array(),
      nullable : true,
      event : "updateListData"
    }
  },


  /*
  *****************************************************************************
    EVENTS
  *****************************************************************************
  */
  events :
  {
    /** Event which occurs when the listData is updated. */
    "updateListData" : "qx.event.type.Data"
  },


  members :
  {
    __decreaseButton : null,
    __increaseButton : null,
    __stopTimeButton : null,
    __form : null,
    __list : null,
    __dataLabel : null,
    __slider : null,
    __intervalId: null,


    // overridden
    _initialize : function()
    {
      this.base(mobileshowcase.page.Abstract, "_initialize");

      this.__form = this.__createSliderDataBindings();
      this.__list = this.__createListDataBindings();
      this.__list.visibility = "hidden";

      this.__increaseButton = new qx.ui.mobile.form.Button("+");
      this.__increaseButton.on("pointerdown", this.__onIncrease, this);
      this.__increaseButton.on("pointerup", this.__onPointerUp, this);

      this.__decreaseButton = new qx.ui.mobile.form.Button("-");
      this.__decreaseButton.on("pointerdown", this.__onDecrease, this);
      this.__decreaseButton.on("pointerup", this.__onPointerUp, this);

      this.__stopTimeButton = new qx.ui.mobile.form.Button("Take Time Snapshot");
      this.__stopTimeButton.on("tap", this.__onStopTimeButtonTap, this);

      // Slider Data Binding
      this.getContent().add(new qx.ui.mobile.form.Title("Slider"));
      this.getContent().add(new qx.ui.mobile.form.renderer.Single(this.__form));
      this.getContent().add(this.__increaseButton);
      this.getContent().add(this.__decreaseButton);

      // List Data Binding
      this.getContent().add(new qx.ui.mobile.form.Title("Dynamic List"));
      this.getContent().add(this.__stopTimeButton);
      this.getContent().add(new qx.ui.mobile.form.Title(" "));
      this.getContent().add(this.__list);

    },


    /**
     * Reacts on tap of Stop time button.
     */
    __onStopTimeButtonTap : function ()
    {
      var now = new Date();
      var date = now.toLocaleTimeString();

      this.listData.insertAt(0,date);

      this.__list.visibility = "visible";
    },


    /**
     * Called on interval event of timer.
     */
    __onPointerUp : function () {
      window.clearInterval(this.__intervalId);
    },


    /**
     * Called on button increase.
     */
    __onIncrease : function() {
      this.__startTimer("+");
    },


    /**
     *  Called on button decrease.
     */
    __onDecrease : function() {
      this.__startTimer("-");
    },


    __startTimer : function(mode) {
      this.__intervalId = window.setInterval(function() {
        mode == "+" ? this.__slider.value++ : this.__slider.value--;
      }.bind(this), 50);
    },


    /**
     * Creates the slider and slider value label and binds vice-versa.
     */
    __createSliderDataBindings : function()
    {
      var form = new qx.ui.mobile.form.Form();
      this.__slider = new qx.ui.mobile.form.Slider();
      this.__slider.displayValue = "value";
      this.__slider.maximum = 500;
      form.add(this.__slider,"Move slider:");

      this.__dataLabel = new qx.ui.mobile.form.TextField();
      this.__dataLabel.value = "0";
      this.__dataLabel.readOnly = true;
      form.add(this.__dataLabel, " Slider value: ");

      qx.data.SingleValueBinding.bind(this.__dataLabel, "value", this.__slider, "value");
      qx.data.SingleValueBinding.bind(this.__slider, "value", this.__dataLabel, "value");

      return form;
    },



    /**
     * Creates a list and returns it.
     */
    __createListDataBindings : function() {
      var self = this;

      var list = new qx.ui.mobile.list.List({
      configureItem : function(item, data, row)
        {
          var stopCount = self.listData.getLength()-row;
          item.setTitle("Stop #"+stopCount);
          item.setSubtitle(data);
        }
      });
      qx.data.SingleValueBinding.bind(this, "listData", list, "model");

      return list;
    },


    dispose : function() {
      this._disposeObjects("__decreaseButton",
        "__increaseButton", "__stopTimeButton", "__dataLabel",
        "__slider", "__form", "__list");
      this.base(mobileshowcase.page.Abstract, "dispose");
    }
  }
});