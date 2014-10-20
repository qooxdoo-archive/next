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
qx.Class.define("qx.ui.mobile.form.NumberField",
{
  extend : qx.ui.mobile.form.Input,
  include : [qx.ui.mobile.form.MText],


  /**
   * @param value {var?null} The value of the widget.
   */
  construct : function(value)
  {
    this.super(qx.ui.mobile.form.Input, "constructor");
    this.type = "number";
    if (value) {
      this.value = value;
    }
    this.initMText();
  },


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
      apply : "_applyMinimum"
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
      apply : "_applyMaximum"
    },


    /**
     * The amount to increment on each event.
     */
    step :
    {
      check : "Number",
      init : undefined,
      nullable: true,
      apply : "_applyStep"
    }
  },


  members :
  {

    /**
     * Called when changed the property step.
     * Delegates value change on DOM element.
     */
    _applyStep : function(value,old) {
      this.setAttribute("step",value);
      this.valid = this._validateStep();
    },


    /**
     * Check for the <code>step</code> property
     *
     * @return {Boolean} <code>true</code> if the value passed the check
     */
    _validateStep: function() {
      return !this[0].validity.stepMismatch;
    },


    /**
     * Called when changed the property maximum.
     * Delegates value change on DOM element.
     */
    _applyMaximum : function(value,old) {
      this.setAttribute("max",value);
      this.valid = this._validateMaximum();
    },


    /**
     * Check for the <code>maximum</code> property
     *
     * @return {Boolean} <code>true</code> if the value passed the check
     */
    _validateMaximum: function() {
      return !this[0].validity.rangeOverflow;
    },


    /**
     * Called when changed the property minimum.
     * Delegates value change on DOM element.
     */
    _applyMinimum : function(value,old) {
      this.setAttribute("min",value);
      this.valid = this._validateMinimum();
    },


    /**
     * Check for the <code>minimum</code> property
     *
     * @return {Boolean} <code>true</code> if the value passed the check
     */
    _validateMinimum: function() {
      return !this[0].validity.rangeUnderflow;
    }
  }
});
