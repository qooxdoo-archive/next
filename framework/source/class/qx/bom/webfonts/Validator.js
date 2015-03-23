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

************************************************************************ */

/**
 * Checks whether a given font is available on the document and fires events
 * accordingly.
 */
qx.Class.define("qx.bom.webfonts.Validator", {

  extend : Object,
  include : [qx.event.MEmitter],


  /**
   * @param fontFamily {String} The name of the font to be verified
   */
  construct : function(fontFamily) {
    if (fontFamily) {
      this.fontFamily = fontFamily;
    }
    this.__requestedHelpers = this._getRequestedHelpers();
  },


  statics :
  {
    /**
     * Sets of serif and sans-serif fonts to be used for size comparisons.
     * At least one of these fonts should be present on any system
     */
    COMPARISON_FONTS : {
      sans : ["Arial", "Helvetica", "sans-serif"],
      serif : ["Times New Roman", "Georgia", "serif"]
    },


    /**
     * Map of common CSS attributes to be used for all  size comparison elements
     */
    HELPER_CSS : {
      position: "absolute",
      margin: "0",
      padding: "0",
      top: "-1000px",
      left: "-1000px",
      fontSize: "350px",
      width: "auto",
      height: "auto",
      lineHeight: "normal",
      fontVariant: "normal",
      visibility: "hidden"
    },


    /**
     * The string to be used in the size comparison elements.
     */
    COMPARISON_STRING : "WEei",
    __defaultSizes : null,
    __defaultHelpers : null,


    /**
     * Removes the two common helper elements used for all size comparisons from
     * the DOM
     */
    removeDefaultHelperElements : function()
    {
      var defaultHelpers = qx.bom.webfonts.Validator.__defaultHelpers;
      if (defaultHelpers) {
        for (var prop in defaultHelpers) {
          document.body.removeChild(defaultHelpers[prop]);
        }
      }
      delete qx.bom.webfonts.Validator.__defaultHelpers;
    }
  },


  properties :
  {
    /**
     * The font-family this validator should check
     */
    fontFamily :
    {
      nullable : true,
      init : null,
      apply : "_applyFontFamily"
    },


    /**
     * Time in milliseconds from the beginning of the check until it is assumed
     * that a font is not available
     */
    timeout :
    {
      check : "Number",
      init : 5000
    }
  },


  events :
  {
    /**
     * Fired when the status of a web font has been determined. The event data
     * is a map with the keys "family" (the font-family name) and "valid"
     * (Boolean).
     */
    "changeStatus" : "Map"
  },


  members :
  {
    __requestedHelpers : null,
    __checkTimer : null,
    __checkStarted : null,



    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */

    /**
     * Validates the font
     */
    validate : function()
    {
      this.__checkStarted = new Date().getTime();

      if (this.__checkTimer) {
        window.clearInterval(this.__checkTimer);
      }
      else {
        // Give the browser a chance to render the new elements
        window.setTimeout(function() {
          this.__checkTimer = window.setInterval(this.__onTimerInterval.bind(this), 100);
        }.bind(this), 0);
      }
    },



    /*
    ---------------------------------------------------------------------------
      PROTECTED API
    ---------------------------------------------------------------------------
    */

    /**
     * Removes the helper elements from the DOM
     */
    _reset : function()
    {
      if (this.__requestedHelpers) {
        for (var prop in this.__requestedHelpers) {
          var elem = this.__requestedHelpers[prop];
          document.body.removeChild(elem);
        }
        this.__requestedHelpers = null;
      }
    },


    /**
     * Checks if the font is available by comparing the widths of the elements
     * using the generic fonts to the widths of the elements using the font to
     * be validated
     *
     * @return {Boolean} Whether or not the font caused the elements to differ
     * in size
     */
    _isFontValid : function()
    {
      if (!qx.bom.webfonts.Validator.__defaultSizes) {
        this.__init();
      }

      if (!this.__requestedHelpers) {
        this.__requestedHelpers = this._getRequestedHelpers();
      }

      // force rerendering for chrome
      this.__requestedHelpers.sans.style.visibility = "visible";
      this.__requestedHelpers.sans.style.visibility = "hidden";
      this.__requestedHelpers.serif.style.visibility = "visible";
      this.__requestedHelpers.serif.style.visibility = "hidden";

      var requestedSans = qx.bom.element.Dimension.getWidth(this.__requestedHelpers.sans);
      var requestedSerif = qx.bom.element.Dimension.getWidth(this.__requestedHelpers.serif);

      var cls = qx.bom.webfonts.Validator;
      if (requestedSans !== cls.__defaultSizes.sans &&
          requestedSerif !== cls.__defaultSizes.serif)
      {
        return true;
      }
      return false;
    },


    /**
     * Creates the two helper elements styled with the font to be checked
     *
     * @return {Map} A map with the keys <pre>sans</pre> and <pre>serif</pre>
     * and the created span elements as values
     */
    _getRequestedHelpers : function()
    {
      var fontsSans = [this.fontFamily].concat(qx.bom.webfonts.Validator.COMPARISON_FONTS.sans);
      var fontsSerif = [this.fontFamily].concat(qx.bom.webfonts.Validator.COMPARISON_FONTS.serif);
      return {
        sans : this._getHelperElement(fontsSans),
        serif : this._getHelperElement(fontsSerif)
      };
    },


    /**
     * Creates a span element with the comparison text ({@link #COMPARISON_STRING})
     * and styled with the default CSS ({@link #HELPER_CSS}) plus the given
     * font-family value and appends it to the DOM
     *
     * @param fontFamily {String} font-family string
     * @return {Element} the created DOM element
     */
    _getHelperElement : function(fontFamily)
    {
      var styleMap = qx.lang.Object.clone(qx.bom.webfonts.Validator.HELPER_CSS);
      if (fontFamily) {
        if (styleMap.fontFamily) {
          styleMap.fontFamily += "," + fontFamily.join(",");
        }
        else {
          styleMap.fontFamily = fontFamily.join(",");
        }
      }

      var elem = document.createElement("span");
      elem.innerHTML = qx.bom.webfonts.Validator.COMPARISON_STRING;
      qx.bom.element.Style.setStyles(elem, styleMap);
      document.body.appendChild(elem);
      return elem;
    },


    // property apply
    _applyFontFamily : function(value, old)
    {
      if (value !== old) {
        this._reset();
      }
    },



    /*
    ---------------------------------------------------------------------------
      PRIVATE API
    ---------------------------------------------------------------------------
    */

    /**
     * Creates the default helper elements and gets their widths
     */
    __init : function()
    {
      var cls = qx.bom.webfonts.Validator;
      if (!cls.__defaultHelpers) {
        cls.__defaultHelpers = {
          sans : this._getHelperElement(cls.COMPARISON_FONTS.sans),
          serif : this._getHelperElement(cls.COMPARISON_FONTS.serif)
        };
      }

      cls.__defaultSizes = {
        sans : qx.bom.element.Dimension.getWidth(cls.__defaultHelpers.sans),
        serif: qx.bom.element.Dimension.getWidth(cls.__defaultHelpers.serif)
      };
    },


    /**
     * Triggers helper element size comparison and fires a ({@link #changeStatus})
     * event with the result.
     */
    __onTimerInterval : function()
    {
      if (this._isFontValid()) {
        window.clearInterval(this.__checkTimer);
        this._reset();
        this.emit("changeStatus", {
          family : this.fontFamily,
          valid : true
        });
      }
      else
      {
        var now = new Date().getTime();
        if (now - this.__checkStarted >= this.timeout) {
          window.clearInterval(this.__checkTimer);
          this._reset();
          this.emit("changeStatus", {
            family : this.fontFamily,
            valid : false
          });
        }
      }
    },


    dispose : function() {
      this._reset();
      window.clearInterval(this.__checkTimer);
    }

  }
});
