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
 * TODOC
 */
qx.Class.define("qx.ui.mobile.form.Form",
{
  extend : qx.ui.mobile.Widget,


  construct : function(element)
  {
    this.super(qx.ui.mobile.Widget, "constructor", element);
    this.defaultCssClass = "form";
    this._resetter = this._createResetter();
    this.on("addedChild", this._onAddedChild, this);
    this.on("removedChild", this._onRemovedChild, this);
  },


  members :
  {
    _resetter : null,


    _getTagName : function() {
      return "form";
    },


    /**
     * Validates all items in the form
     * @return {Boolean} <code>false</code> if one or more items are
     * invalid
     */
    validate: function() {
      var valid = true;
      var children = this.find("*[data-qx-widget]");
      for (var i=0, l=children.length; i<l; i++) {
        var child = qxWeb(children[i]);
        if (typeof child.validate == "function" &&
            child.validate() === false) {
          valid = false;
        }
      }

      return valid;
    },


    /**
     * Resets the form. This means reseting all form items and the validation.
     */
    reset : function() {
      this._resetter.reset();
    },


    /**
     * Redefines the values used for resetting. It calls
     * {@link qx.ui.form.Resetter#redefine} to get that.
     */
    redefineResetter : function() {
      this._resetter.redefine();
    },


    /**
     * Redefines the value used for resetting of the given item. It calls
     * {@link qx.ui.form.Resetter#redefineItem} to get that.
     *
     * @param item {qx.ui.core.Widget} The item to redefine.
     */
    redefineResetterItem : function(item) {
      this._resetter.redefineItem(item);
    },


    /**
     * Creates and returns the used resetter.
     *
     * @return {qx.ui.mobile.form.Resetter} the resetter class.
     */
    _createResetter : function() {
      return new qx.ui.mobile.form.Resetter();
    },


    /**
     * Recursively searches a widget added to the form and its children
     * for form items and adds them to the resetter and the list of items
     *
     * @param widget {qx.ui.mobile.Widget} added widget
     */
    _onAddedChild: function(widget) {
      var children = [widget];
      var descendants = widget.find("*[data-qx-widget]");
      descendants.forEach(function(kid) {
        children.push(qxWeb(kid));
      });

      for (var i = 0, l = children.length; i < l; i++) {
        var child = qxWeb(children[i]);

        child.on("addedChild", this._onAddedChild, this);
        child.on("removedChild", this._onRemovedChild, this);

        if (this._resetter.getInitValue(child) !== undefined) {
          this._resetter.add(child);
        }
      }
    },


    /**
     * Recursively searches a widget removed from the form and its children
     * for form items and removes them from the resetter and the list of items
     *
     * @param widget {qx.ui.mobile.Widget} added widget
     */
    _onRemovedChild: function(widget) {
      var children = [widget];
      var descendants = widget.find("*[data-qx-widget]");
      descendants.forEach(function(kid) {
        children.push(qxWeb(kid));
      });

      for (var i = 0, l = children.length; i < l; i++) {
        var child = qxWeb(children[i]);

        child.off("addedChild", this._onAddedChild, this);
        child.off("removedChild", this._onRemovedChild, this);

        if (this._resetter.getInitValue(child) !== undefined) {
          this._resetter.remove(child);
        }
      }
    },


    dispose: function() {
      this.super(qx.ui.mobile.Widget, "dispose");
      this.off("addedChild", this._onAddedChild, this);
      this.off("removedChild", this._onRemovedChild, this);
    }

  }
});
