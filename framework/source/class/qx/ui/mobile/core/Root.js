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
 * Root widget for the mobile application.
 */
qx.Bootstrap.define("qx.ui.mobile.core.Root",
{
  extend : qx.ui.mobile.core.Widget,


  /**
   * @param root {Element?null} Optional. The root DOM element of the widget. Default is the body of the document.
   * @param layout {qx.ui.mobile.layout.Abstract ? qx.ui.mobile.layout.VBox} The layout of the root widget.
   */
  construct : function(root, layout)
  {
    this.__root = root || document.body;
    this.base(qx.ui.mobile.core.Widget, "constructor", this.__root);
    this.setLayout(layout || new qx.ui.mobile.layout.VBox());

    this.addClass("mobile");
    this.addClass(qx.core.Environment.get("os.name"));
    this.addClass("v" + qx.core.Environment.get("os.version").charAt(0));

    qxWeb(window).on("orientationchange", this._onOrientationChange, this);

    // [BUG #7785] Document element's clientHeight is calculated wrong on iPad iOS7
    if (qx.core.Environment.get("os.name") == "ios") {
      this.on("touchmove", this._preventDefault);

      if (window.innerHeight != document.documentElement.clientHeight) {
        this.addClass("ios-viewport-fix");
      }
    }

    var flexboxSyntax = qx.core.Environment.get("css.flexboxSyntax");
    if (flexboxSyntax === "flex" || flexboxSyntax === "flexbox") {
      this.addClass("qx-flex-ready");
    }

    this._onOrientationChange();
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "root"
    },


    /**
     * Whether the native scrollbar should be shown or not.
     */
    showScrollbarY :
    {
      check : "Boolean",
      init : true,
      apply : "_applyShowScrollbarY"
    }
  },


  members :
  {
    __root : null,

    // overridden
    _createContainerElement : function() {
      return this.__root;
    },


    // property apply
    _applyShowScrollbarY : function(value, old) {
      this.setStyle("overflow-y", value ? "auto" : "hidden");
    },


    /**
     * Event handler. Called when the orientation of the device is changed.
     *
     * @param evt {qx.event.type.Orientation} The handled orientation change event
     */
    _onOrientationChange : function(evt) {
      var isPortrait = null;

      if (evt) {
        isPortrait = evt.isPortrait();
      } else {
        isPortrait = !qxWeb.env.isLandscape();
      }

      if (isPortrait) {
        this.addClass("portrait");
        this.removeClass("landscape");
      } else {
        this.addClass("landscape");
        this.removeClass("portrait");
      }
    },


    _preventDefault : function(evt) {
      evt.preventDefault();
    },


    dispose : function() {
      this.base(qx.ui.mobile.core.Widget, "dispose");
      this.off("touchmove", this._preventDefault);
      qxWeb(window).off("orientationchange", this._onOrientationChange, this);
    }
  }
});
