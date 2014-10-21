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
 * The Row widget represents a row in a {@link Form}.
 */
qx.Class.define("qx.ui.mobile.form.Row",
{
  extend : qx.ui.mobile.Widget,

  construct: function(item, label) {
    this.super(qx.ui.mobile.Widget, "constructor");

    this.layout = new qx.ui.mobile.layout.HBox();

    if (label) {
      var labelWidget = new qx.ui.mobile.basic.Label(label, document.createElement("label"))
        .set({
          anonymous: false,
          layoutPrefs: {flex:1}
        })
        .appendTo(this);

      if (qx.core.Environment.get("engine.name") === "mshtml" &&
          qx.core.Environment.get("browser.documentmode") === 10) {
        labelWidget.addClasses(["qx-hbox", "qx-flex-align-center"]);
      }

      if (item) {
        labelWidget.setAttribute("for", item.getAttribute("id"));
      }
    }

    if (item) {
      item.on("changeValid", this._onChangeValid, this);
      this.__item = item;
      this.append(item);
    }
  },

  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "form-row"
    }
  },

  members: {

    __item: null,
    __errorEl: null,


    /**
     * Adds/removes an element containing the item's validation message
     */
    _onChangeValid: function() {
      if (this.__item.valid) {
        this.__errorEl && this.__errorEl.remove();
      } else {
        if (!this.__errorEl && this.__item.validationMessage) {
          this.__errorEl = qxWeb.create('<div class="qx-flex1 form-element-error">' + this.__item.validationMessage + '</div>')
            .insertAfter(this.__item);
        }
      }
    },

    dispose: function() {
      if (this.__item) {
        this.__item.off("changeValid", this._onChangeValid, this);
      }
    }

  }
});
