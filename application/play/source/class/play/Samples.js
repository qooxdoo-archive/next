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

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */


/**
 * @ignoreDeprecated(alert)
 */
qx.Class.define("play.Samples",
{
  extend : qx.data.Array,

  construct : function() {
    this.super("construct");

    for (var name in window.Samples) {
      name = name.replace("sample ", "");
      this.push({title: name});
    }
  },

  members : {

    getCode : function(name) {
      var fn = window.Samples["sample " + name];
      var code = fn.toString();
      code = code.split("\n");
      code.shift(); // remove first line
      code.pop(); // remove last line
      var startingWhitespace = code[0].match(/^\s{0,20}/)[0].length;
      for (var i = 0; i < code.length; i++) {
        code[i] = code[i].substring(startingWhitespace, code[i].length);
      }
      return code.join("\n");
    }
  }
});
