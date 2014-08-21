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
 * The NumberField is a single-line number input field. It uses HTML5 input field type
 * "number" and the attribute "min" ,"max" and "step". The attributes can be used
 * for form validation {@link qx.ui.form.validation.Manager}.
 */
qx.Bootstrap.define("qx.ui.mobile.form.NumberField",
{
  extend : qx.ui.mobile.form.Input,
  include : [qx.ui.mobile.form.MValue, qx.ui.mobile.form.MText],
  implement : [qx.ui.form.IStringForm],


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param value {var?null} The value of the widget.
   */
  construct : function(value)
  {
    this.base(qx.ui.mobile.form.Input, "constructor");
    if (value) {
      this.value = value;
    }
    this.initMValue(value);
    this.initMText();
  },

  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */
  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "number-field"
    },


    /**
     * The minimum text field value (may be negative). This value must be smaller
     * than {@link #minimum}.
     */
    minimum :
    {
      check : "Number",
      init : undefined,
      nullable: true,
      apply : "_onChangeMinimum"
    },


    /**
     * The maximum text field value (may be negative). This value must be larger
     * than {@link #maximum}.
     */
    maximum :
    {
      check : "Number",
      init : undefined,
      nullable: true,
      apply : "_onChangeMaximum"
    },


    /**
     * The amount to increment on each event.
     */
    step :
    {
      check : "Number",
      init : undefined,
      nullable: true,
      apply : "_onChangeStep"
    }
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // overridden
    _getType : function()
    {
      return "number";
    },


    /**
     * Called when changed the property step.
     * Delegates value change on DOM element.
     */
    _onChangeStep : function(value,old) {
      this._setAttribute("step",value);
    },


    /**
     * Called when changed the property maximum.
     * Delegates value change on DOM element.
     */
    _onChangeMaximum : function(value,old) {
      this._setAttribute("max",value);
    },


    /**
     * Called when changed the property minimum.
     * Delegates value change on DOM element.
     */
    _onChangeMinimum : function(value,old) {
      this._setAttribute("min",value);
    }
  }
});
