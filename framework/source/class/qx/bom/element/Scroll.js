"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */


/**
 * Contains methods to control and query the element's scroll properties
 */
qx.Class.define("qx.bom.element.Scroll",
{


  statics :
  {
    /** @type {Integer} The typical native scrollbar size in the environment */
    __scrollbarSize : null,

    /**
     * Get the typical native scrollbar size in the environment
     *
     * @return {Number} The native scrollbar size
     */
    getScrollbarWidth : function()
    {
      if (this.__scrollbarSize !== null) {
        return this.__scrollbarSize;
      }

      var Style = qx.bom.element.Style;

      var getStyleSize = function(el, propertyName) {
        return parseInt(Style.get(el, propertyName), 10) || 0;
      };

      var getBorderRight = function(el)
      {
        return (
          Style.get(el, "borderRightStyle") == "none"
          ? 0
          : getStyleSize(el, "borderRightWidth")
        );
      };

      var getBorderLeft = function(el)
      {
        return (
          Style.get(el, "borderLeftStyle") == "none"
          ? 0
          : getStyleSize(el, "borderLeftWidth")
        );
      };

      var getInsetRight = qx.core.Environment.select("engine.name",
      {
        "mshtml" : function(el)
        {
          if (
            Style.get(el, "overflowY") == "hidden" ||
            el.clientWidth == 0
          ) {
            return getBorderRight(el);
          }

          return Math.max(0, el.offsetWidth - el.clientLeft - el.clientWidth);
        },

          "default" : function(el)
        {
          // Alternative method if clientWidth is unavailable
          // clientWidth == 0 could mean both: unavailable or really 0
          if (el.clientWidth == 0)
          {
            var ov = Style.get(el, "overflow");
            var sbv = (
              ov == "scroll" ||
              ov == "-moz-scrollbars-vertical" ? 16 : 0
            );
            return Math.max(0, getBorderRight(el) + sbv);
          }

          return Math.max(
            0,
            (el.offsetWidth - el.clientWidth - getBorderLeft(el))
          );
        }
      });

      var getScrollBarSizeRight = function(el) {
        return getInsetRight(el) - getBorderRight(el);
      };

      var t = document.createElement("div");
      var s = t.style;

      s.height = s.width = "100px";
      s.overflow = "scroll";

      document.body.appendChild(t);
      var c = getScrollBarSizeRight(t);
      this.__scrollbarSize = c;
      document.body.removeChild(t);

      return this.__scrollbarSize;
    }
  }
});
