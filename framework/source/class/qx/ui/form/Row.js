define(['qx/Class', 'qx/bom/client/Browser', 'qx/bom/client/Engine', 'qx/ui/Widget', 'qxWeb', 'qx/Interface', 'qx/core/Environment', 'qx/ui/Label', 'qx/ui/form/IForm', 'qx/ui/layout/HBox'], function(Dep0,Dep1,Dep2,Dep3,Dep4,Dep5,Dep6,Dep7,Dep8,Dep9) {
var qx = {
  "Class": Dep0,
  "bom": {
    "client": {
      "Browser": Dep1,
      "Engine": Dep2
    }
  },
  "ui": {
    "Widget": Dep3,
    "Label": Dep7,
    "form": {
      "IForm": Dep8,
      "Row": null
    },
    "layout": {
      "HBox": Dep9
    }
  },
  "Interface": Dep5,
  "core": {
    "Environment": Dep6
  }
};
var qxWeb = Dep4;

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
 *
 * @group(Widget)
 */
var clazz = qx.Class.define("qx.ui.form.Row",
{
  extend : qx.ui.Widget,

  /**
   * @attach {qxWeb, toRow}
   * @return {qx.ui.form.Row} The new form row widget.
   */
  construct: function(item, label, element) {
    this.super("construct", element);

    this.layout = new qx.ui.layout.HBox();

    // label handling
    var labelWidget;
    if (label) {
      labelWidget = new qx.ui.Label(label, document.createElement("label"))
        .appendTo(this);
    }

    labelWidget = this.find("label").setData("qxWidget", "qx.ui.Label");
    labelWidget.anonymous = false;
    labelWidget.layoutPrefs = {flex:1};

    if (qx.core.Environment.get("engine.name") === "mshtml" &&
        qx.core.Environment.get("browser.documentmode") === 10) {
      labelWidget.addClasses(["qx-hbox", "qx-flex-align-center"]);
    }

    // item handling
    if (item) {
      this.append(item);
    }

    var children = this.find("*");
    for (var i=0, l=children.length; i<l; i++) {
      var el = qxWeb(children[i]);
      if (qx.Interface.classImplements(el.constructor, qx.ui.form.IForm)) {
        this.__item = el;
        break;
      }
    }

    if (this.__item) {
      this.__item.on("changeValid", this._onChangeValid, this);

      if (this.__item && labelWidget) {
        labelWidget.setAttribute("for", this.__item.getAttribute("id"));
      }
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
          this.__errorEl = qxWeb.create('<div class="qx-flex1 form-element-error">' + this.__item.validationMessage + '</div>');
        }
        if (this.__errorEl) {
          this.__errorEl.insertAfter(this.__item);
        }
      }
    },

    dispose: function() {
      if (this.__item) {
        this.__item.off("changeValid", this._onChangeValid, this);
      }
    }

  },


  classDefined : function(statics) {
    qxWeb.$attachWidget(statics);
  }
});

 qx.ui.form.Row = clazz;
return clazz;
});
