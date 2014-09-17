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
 * @ignore(ace.edit)
 */
qx.Class.define("play.CodeStore", {
  statics : {
    init : function()
    {
      var history = qx.bom.History.getInstance();
      history.on("changeState", play.CodeStore.__onHistoryChanged);

      // Handle bookmarks
      var state = history.state;
      var editor = ace.edit("editor");

      if (state && state.charAt(0) == "{") {
        var code = this.__parseURLCode(state);
        editor.setValue(code);
        editor.clearSelection();
        qx.core.Init.getApplication().run();
        return true;
      }
      return false;
    },


    /**
     * Handler for changes of the history.
     * @param e {qx.event.type.Data} Data event containing the history changes.
     */
    __onHistoryChanged : function(data) {
      var state = data.value;
      if (state != "") {
        var code = play.CodeStore.__parseURLCode(state);
        var editor = ace.edit("editor");
        editor.setValue(code);
        editor.clearSelection();
        qx.core.Init.getApplication().run();
      }
    },


    /**
     * Helper method for parsing the given url parameter to a valid code
     * fragment.
     * @param state {String} The given state of the browsers history.
     * @return {String} A valid code snippet.
     */
    __parseURLCode : function(state) {
      try {
        var data = JSON.parse(state);
        return decodeURIComponent(data.code).replace(/%0D/g, "");
      } catch (e) {
        return "// Could not handle URL parameter! \n //" + e;
      }
    },


    /**
     * Adds the given code to the history.
     * @param code {String} the code to add.
     * @lint ignoreDeprecated(confirm)
     */
    add : function(code) {
      var codeJson = '{"code":' + '"' + encodeURIComponent(code) + '"}';
      qx.bom.History.getInstance().addToHistory(codeJson);
    }
  }
});