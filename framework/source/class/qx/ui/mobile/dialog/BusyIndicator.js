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
 * The widget displays a busy indicator.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var busyIndicator = new qx.ui.mobile.dialog.BusyIndicator("Please wait");
 *   this.getRoot().append(busyIndicator);
 * </pre>
 *
 * This example creates a widget to display the busy indicator.
 *
 * @require(qx.module.Animation)
 */
qx.Class.define("qx.ui.mobile.dialog.BusyIndicator",
{
  extend : qx.ui.mobile.basic.Atom,


  /**
   * @param label {String?} Label to use
   */
  construct : function(label)
  {
    // the image passed as second argument is a blank 1px transparent png
    this.super(qx.ui.mobile.basic.Atom, "constructor", label, qx.ui.mobile.basic.Image.PLACEHOLDER_IMAGE);

    this.on("appear", this._onAppear, this);
    this.on("disappear", this._onDisappear, this);
  },


  properties :
  {

    /**
     * The spinner css class to use.
     */
    spinnerClass :
    {
      apply : "_applySpinnerClass",
      nullable : false,
      check : "String",
      init : "spinner"
    }
  },


  statics : {
    SPINNER_ANIMATION : null
  },


  members :
  {
    __animationHandle : null,


    /**
     * Listener for appear event.
     */
    _onAppear : function() {
      this.__animationHandle = this.getIconWidget().animate(qx.ui.mobile.dialog.BusyIndicator.SPINNER_ANIMATION);
    },


    /**
     * Handler for disappear event.
     */
    _onDisappear : function() {
      this.__animationHandle.stop();
    },


    // overridden
    _createIconWidget : function(iconUrl)
    {
      var iconWidget = this.super(qx.ui.mobile.basic.Atom, "_createIconWidget", iconUrl);
      iconWidget.addClass(this.spinnerClass);
      return iconWidget;
    },


    // property apply
    _applySpinnerClass : function(value, old)
    {
      if (old) {
        this.getIconWidget().removeClass(old);
      }
      if(value) {
        this.getIconWidget().addClass(value);
      }
    },


    dispose : function() {
      this.super(qx.ui.mobile.basic.Atom, "dispose");
      this.off("appear", this._onAppear, this);
      this.off("disappear", this._onDisappear, this);

      if(this.__animationHandle) {
        this.__animationHandle.stop();
      }

      this.__animationHandle = null;
    }
  },


  classDefined : function() {
    qx.ui.mobile.dialog.BusyIndicator.SPINNER_ANIMATION = {
      duration: 750,
      timing: "linear",
      origin: "center center",
      repeat: "infinite",
      keyFrames : {
        0: {
          rotate : "0deg"
        },
        100: {
          rotate : "359deg"
        }
      }
    };
  }
});
