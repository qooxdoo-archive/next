define(['qx/Class', 'qx/core/MSingleton', 'qx/event/MEmitter', 'qx/core/Assert', 'qx/core/Environment', 'qxWeb'], function(Dep0,Dep1,Dep2,Dep3,Dep4,Dep5) {
var qx = {
  "Class": Dep0,
  "core": {
    "MSingleton": Dep1,
    "Assert": Dep3,
    "Environment": Dep4
  },
  "event": {
    "MEmitter": Dep2
  },
  "application": {
    "Scaling": null
  }
};
var qxWeb = Dep5;

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

var clazz = qx.Class.define("qx.application.Scaling", {
  extend : Object,

  include : [qx.event.MEmitter, qx.core.MSingleton],

  statics : {
    /**
     * Returns the singleton instance of this class
     * @return {qx.application.Scaling} The Scaling singleton
     */
    getInstance: qx.core.MSingleton.getInstance
  },


  construct : function() {
    this.initMSingleton();
  },


  members : {

    /**
     * Returns the application's font scale factor.
     *
     * @return {Number|null} the font scale factor. If a valid font scale could
     * be determined, it is rounded to a three decimal number. For displaying
     * the scale factor, you might want to round to two decimals
     * (<code>.toFixed(2)</code>). If it could not be determined,
     * <code>null</code> is returned.
     */
    get: function()
    {
      var fontScale = null;
      var appScale = 1;

      // determine font-size style in percent if available
      var fontSize = document.documentElement.style.fontSize;
      if (fontSize.indexOf("%") !== -1) {
        appScale = (parseInt(fontSize, 10) / 100);
      }

      // start from font-size computed style in pixels if available;
      fontSize = qxWeb(document.documentElement).getStyle("fontSize");
      if (fontSize.indexOf("px") !== -1)
      {
        fontSize = parseFloat(fontSize);

        if (fontSize>15 && fontSize<17) {
          // iron out minor deviations from the base 16px size
          fontSize = 16;
        }

        if (appScale !== 1) {
          // if font-size style is set in percent
          fontSize = Math.round(fontSize/appScale);
        }

        // relative to the 16px base font
        fontScale = (fontSize/16);

        // apply percentage-based font-size
        fontScale *= appScale;

        // round to a tree-decimal float
        fontScale = parseFloat(fontScale.toFixed(3));
      }

      return fontScale;
    },


    /**
    * Sets the application's font scale factor, i.e. relative to a default 100%
    * font size.
    *
    * @param value {Number} the font scale factor.
    */
    set: function(value) {
      if (qx.core.Environment.get("qx.debug")) {
        qx.core.Assert.assertNumber(value, "The scale factor is asserted to be of type Number");
      }

      var docElement = document.documentElement;
      docElement.style.fontSize = value * 100 + "%";

      // Force relayout - important for new Android devices and Firefox.
      setTimeout(function() {
        docElement.style.display = "none";
        docElement.offsetWidth;
        docElement.style.display = "";
      }, 0);

      this.emit("changeAppScale");
    }
  }
});

 qx.application.Scaling = clazz;
return clazz;
});
