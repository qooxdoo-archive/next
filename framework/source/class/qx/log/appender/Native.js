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
 * Processes the incoming log entry and displays it by means of the native
 * logging capabilities of the client.
 *
 * Supported browsers:
 * * Firefox <4 using FireBug (if available).
 * * Firefox >=4 using the Web Console.
 * * WebKit browsers using the Web Inspector/Developer Tools.
 * * Internet Explorer 8+ using the F12 Developer Tools.
 * * Opera >=10.60 using either the Error Console or Dragonfly
 *
 * Currently unsupported browsers:
 * * Opera <10.60
 *
 * @require(qx.log.appender.Util)
 * @require(qx.bom.client.Html)
 */
qx.Class.define("qx.log.appender.Native",
{
  statics :
  {
    /**
     * Silent mode prevents loggin useful for testing purposes.
     */
    SILENT: false,

    /**
     * Processes a single log entry
     *
     * @param entry {Map} The entry to process
     */
    process : function(entry) {
      var level = entry.level;
      if (console && console[level] && !qx.log.appender.Native.SILENT) {
        var args = qx.log.appender.Util.toText(entry);
        console[level](args);
      }
    }
  },


  classDefined : function(statics) {
    qx.log.Logger.register(statics);
  }
});
