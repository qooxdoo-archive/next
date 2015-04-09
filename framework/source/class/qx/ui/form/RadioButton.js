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
     * Gabriel Munteanu (gabios)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * The Radio button for mobile.
 *
 * *Example*
 *
 * <pre class='javascript'>
 *    var form = new qx.ui.mobile.form.Form();
 *
 *    var radio1 = new qx.ui.mobile.form.RadioButton();
 *    var radio2 = new qx.ui.mobile.form.RadioButton();
 *    var radio3 = new qx.ui.mobile.form.RadioButton();
 *
 *    var group = new qx.ui.mobile.form.RadioGroup(radio1, radio2, radio3);

 *    form.add(radio1, "Germany");
 *    form.add(radio2, "UK");
 *    form.add(radio3, "USA");
 *
 *    this.getRoot.append(new qx.ui.mobile.form.renderer.Single(form));
 * </pre>
 *
 *
 */
qx.Class.define("qx.ui.form.RadioButton",
{
  extend : qx.ui.form.Input,


  /**
   * @param value {Boolean?null} The value of the checkbox.
   */
  construct : function(value)
  {
    this.super("construct");

    this.value = !!value;
    this.on("tap", this._onTap, this);
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "radio"
    },


    /** The assigned qx.ui.form.RadioGroup which handles the switching between registered buttons */
    group :
    {
      check  : "qx.ui.form.RadioGroup",
      nullable : true,
      apply : "_applyGroup"
    },

    name : {
      nullable: true
    }
  },


  members :
  {
    _state : null,

    // overridden
    _getTagName : function()
    {
      return "span";
    },


    // overridden
    _getType : function()
    {
      return null;
    },


    /**
     * Reacts on tap on radio button.
     */
    _onTap : function() {
      this.emit("changeValue", {value: true, old: this.value, target: this});

      // Toggle State.
      this.value = true;
    },


    _uncheckOther : function() {
      var form = this.getAncestors("form");
      if (form.length > 0) {
        form.find("." + this.defaultCssClass).forEach(function(el) {
          if (el != this && el.name == this.name) {
            el.value = false;
          }
        }.bind(this));
      } else {
        qxWeb("." + this.defaultCssClass).forEach(function(el) {
          form = el.getAncestors("form");
          if (form.length > 0) {
            return;
          }
          if (el != this && el.name == this.name) {
            el.value = false;
          }
        }.bind(this));
      }
    },


    /**
     * The assigned {@link qx.ui.form.RadioGroup} which handles the switching between registered buttons
     * @param value {qx.ui.form.RadioGroup} the new radio group to which this radio button belongs.
     * @param old {qx.ui.form.RadioGroup} the old radio group of this radio button.
     */
    _applyGroup : function(value, old)
    {
      if (old) {
        old.remove(this);
      }

      if (value) {
        value.add(this);
      }
    },


    /**
     * Sets the value [true/false] of this radio button.
     * It is called by the setValue method of the qx.ui.form.MForm
     * mixin
     * @param value {Boolean} the new value of the radio button
     */
    _setValue : function(value) {
      this._uncheckOther();

      if(value == true) {
        this.addClass("checked");
      } else {
        this.removeClass("checked");
      }

      this._state = value;
    },


    /**
     * Gets the value [true/false] of this radio button.
     * It is called by the getValue method of the qx.ui.form.MForm
     * mixin
     * @return {Boolean} the value of the radio button
     */
    _getValue : function() {
      return this._state;
    },


    dispose : function() {
      this.super("dispose");
      this.off("tap", this._onTap, this);
    }
  }
});
