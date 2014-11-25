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
     * Gabriel Munteanu (gabios)

************************************************************************ */

/**
 * Very basic dialog manager. Displays a native alert or confirm dialog if
 * the application is running in a PhoneGap environment. For debugging in a browser
 * it displays the browser <code>alert</code> or <code>confirm</code> dialog. In the near
 * future this should be replaced by dialog widgets.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *    var buttons = [];
 *    buttons.push("OK");
 *    buttons.push("Cancel");
 *    var title = "Delete item";
 *    var text = "Do you want to delete the item?"
 *    qx.ui.dialog.Manager.getInstance().confirm(title, text, function(index) {
 *      if (index==1) {
 *        // delete the item
 *      }
 *    }, this, buttons);
 * </pre>
 *
 * This example displays a confirm dialog and defines a button click handler.
 */
qx.Class.define("qx.ui.dialog.Manager",
{
  extend : Object,
  include : [qx.core.MSingleton],




  statics:
  {
    INPUT_DIALOG: 1,
    MESSAGE_DIALOG: 2,
    WARNING_DIALOG: 3,
    ERROR_DIALOG: 4,
    WAITING_DIALOG: 5,

    __instance: null,

    /**
     * Returns the singleton instance of this class
     * @return {qx.ui.dialog.Manager} The dialog manager singleton
     */
    getInstance: qx.core.MSingleton.getInstance
  },

  construct: function() {
    this.initMSingleton();
  },


  members :
  {
    /**
     * Displays an alert box. When the application is running in a PhoneGap
     * environment, a native alert box is shown. When debugging in a browser, a
     * browser alert is shown.
     *
     * @param title {String} The title of the alert box
     * @param text {String} The text to display in the alert box
     * @param handler {Function} The handler to call when the <code>OK</code> button
     *     was pressed
     * @param scope {Object} The scope of the handler
     * @param button {String} The button title
     * @return {qx.ui.dialog.Popup|Object} a reference to an alert dialog
     *          instance. An <code>Object</code>, if environment is
     *          <code>phonegap</code>, or a {@link qx.ui.dialog.Popup}
     *          if not.
     * @lint ignoreDeprecated(alert)
     */
    alert : function(title, text, handler, scope, button)
    {
      // TOOD : MOVE THIS TO PHONEGAP CLASS
      if (qx.core.Environment.get("phonegap") && qx.core.Environment.get("phonegap.notification")) {
        var callback = function() {
          if (handler) {
            handler.call(scope);
          }
        }
        var button = this.__processDialogButtons(button);
        return navigator.notification.alert(text, callback, title, button);
      }
      else
      {
        return this.__showNonNativeDialog(title, text, handler, scope, [button], qx.ui.dialog.Manager.MESSAGE_DIALOG);
      }
    },


    /**
     * Displays a confirm box. When the application is running in a PhoneGap
     * environment, a native confirm box is shown. When debugging in a browser, a
     * browser confirm is shown.
     *
     * @param title {String} The title of the confirm box
     * @param text {String} The text to display in the confirm box
     * @param handler {Function} The handler to call when the <code>OK</code> button
     *     was pressed. The first parameter of the function is the <code>index</code>
     *     of the pressed button, starting from 0.
     * @param scope {Object} The scope of the handler
     * @param buttons {String[]} Each text entry of the array represents a button and
     *     its title
     * @return {qx.ui.dialog.Popup} The dialog widget
     * @lint ignoreDeprecated(confirm)
     */
    confirm : function(title, text, handler, scope, buttons)
    {
      if (qx.core.Environment.get("phonegap") && qx.core.Environment.get("phonegap.notification"))
      {
        var callback = function(index)
        {
          handler.call(scope, index-1);
        }
        var buttons = this.__processDialogButtons(buttons);
        return navigator.notification.confirm(text, callback, title, buttons);
      }
      else
      {
        return this.__showNonNativeDialog(title, text, handler, scope, buttons, qx.ui.dialog.Manager.MESSAGE_DIALOG);
      }
    },

    /**
     * Displays an input dialog.
     *
     * @param title {String} The title of the input dialog.
     * @param text {String} The text to display in the input dialog.
     * @param handler {Function} The handler to call when the <code>OK</code> button
     *     was pressed. The first parameter of the function is the <code>index</code>
     *     of the pressed button, starting from 1.
     * @param scope {Object} The scope of the handler
     * @param buttons {String[]} Each text entry of the array represents a button and
     *     its title
     * @return {qx.ui.dialog.Popup} The dialog widget
     * @lint ignoreDeprecated(confirm)
     */
    input : function(title, text, handler, scope, buttons)
    {
      return this.__showNonNativeDialog(title, text, handler, scope, buttons, qx.ui.dialog.Manager.INPUT_DIALOG);
    },

    /**
     * Displays an error dialog. When the application is running in an PhoneGap
     * environment, a native error dialog is shown. For debugging in a browser, a
     * browser confirm is shown.
     *
     * @param title {String} The title of the error dialog.
     * @param text {String} The text to display in the error dialog.
     * @param handler {Function} The handler to call when the <code>OK</code> button
     *     was pressed. The first parameter of the function is the <code>index</code>
     *     of the pressed button, starting from 1.
     * @param scope {Object} The scope of the handler
     * @param button {String} The text entry represents a button and its title
     * @return {qx.ui.dialog.Popup} The dialog widget
     * @lint ignoreDeprecated(confirm)
     */
    error : function(title, text, handler, scope, button)
    {
      if (qx.core.Environment.get("phonegap") && qx.core.Environment.get("phonegap.notification")) {
        var callback = function() {
          if (handler) {
            handler.call(scope);
          }
        }
        var button = this.__processDialogButtons(button);
        return navigator.notification.alert(text, callback, title, button);
      }
      else
      {
        return this.__showNonNativeDialog(title, text, handler, scope, button, qx.ui.dialog.Manager.ERROR_DIALOG);
      }
    },


    /**
     * Displays a warning dialog. When the application is running in an PhoneGap
     * environment, a native warning dialog is shown. For debugging in a browser, a
     * browser confirm is shown.
     *
     * @param title {String} The title of the warning dialog.
     * @param text {String} The text to display in the warning dialog.
     * @param handler {Function} The handler to call when the <code>OK</code> button
     *     was pressed. The first parameter of the function is the <code>index</code>
     *     of the pressed button, starting from 1.
     * @param scope {Object} The scope of the handler
     * @param button {String} The text entry represents a button and its title
     * @return {qx.ui.dialog.Popup} The dialog widget
     * @lint ignoreDeprecated(confirm)
     */
    warning : function(title, text, handler, scope, button)
    {
      if (qx.core.Environment.get("phonegap") && qx.core.Environment.get("phonegap.notification")) {
        var callback = function() {
          if (handler) {
            handler.call(scope);
          }
        }
        var button = this.__processDialogButtons(button);
        return navigator.notification.alert(text, callback, title, button);
      }
      else
      {
        return this.__showNonNativeDialog(title, text, handler, scope, button, qx.ui.dialog.Manager.WARNING_DIALOG);
      }
    },


    /**
     * Displays a waiting dialog.
     *
     * @param title {String} The title of the waiting dialog.
     * @param text {String} The text to display in the waiting dialog.
     * @param handler {Function} The handler to call when the <code>OK</code> button
     *     was pressed. The first parameter of the function is the <code>index</code>
     *     of the pressed button, starting from 1.
     * @param scope {Object} The scope of the handler
     * @param buttons {String[]} Each text entry of the array represents a button and
     *     its title
     * @return {qx.ui.dialog.Popup} The dialog widget
     * @lint ignoreDeprecated(confirm)
     */
    wait : function(title, text, handler, scope, buttons)
    {
      return this.__showNonNativeDialog(title, text, handler, scope, buttons, qx.ui.dialog.Manager.WAITING_DIALOG);
    },


    /**
     * Processes the dialog buttons. Converts them to PhoneGap compatible strings.
     *
     * @param buttons {String[]} Each text entry of the array represents a button and
     *     its title
     * @return {String} The concatenated, PhoneGap compatible, button string
     */
    __processDialogButtons: function(buttons)
    {
      if(buttons) {
        if(buttons instanceof Array) {
          buttons = buttons.join(",");
        } else {
          buttons = ""+buttons;
        }
      }
      return buttons;
    },


    /**
     * Shows a dialog widget.
     *
     * @param title {String} The title of the dialog.
     * @param text {String} The text to display in the dialog.
     * @param handler {Function} The handler to call when the <code>OK</code> button
     *     was pressed. The first parameter of the function is the <code>index</code>
     *     of the pressed button, starting from 1.
     * @param scope {Object} The scope of the handler
     * @param buttons {String[]} Each text entry of the array represents a button and
     *     its title
     * @return {qx.ui.dialog.Popup} The dialog widget
     * @param dialogType {Integer} One of the static dialog types.
     */
    __showNonNativeDialog: function(title, text, handler, scope, buttons, dialogType)
    {
      var layout = new qx.ui.layout.VBox();
      layout.alignY = "middle";
      var widget = new qx.ui.Widget();
      widget.layout = layout;
      var dialog = new qx.ui.dialog.Popup(widget);

      dialog.modal = true;
      dialog.title = title;

      if(dialogType == qx.ui.dialog.Manager.WAITING_DIALOG)
      {
        var wLayout = new qx.ui.layout.HBox();
        wLayout.alignX = "center";
        var waitingWidget = new qx.ui.Widget();
        waitingWidget.layout = wLayout;
        widget.append(waitingWidget);
        waitingWidget.append(new qx.ui.dialog.BusyIndicator(text));
      }
      else
      {
        var lLayout = new qx.ui.layout.HBox();
        lLayout.alignX = "center";
        var labelWidget = new qx.ui.Widget();
        labelWidget.layout = lLayout;
        labelWidget.append(new qx.ui.Label(text));
        labelWidget.addClass("gap");
        widget.append(labelWidget);
        if(dialogType == qx.ui.dialog.Manager.INPUT_DIALOG)
        {
          var iLayout = new qx.ui.layout.HBox();
          iLayout.alignX = "center";
          var inputWidget = new qx.ui.Widget();
          inputWidget.layout = iLayout;
          inputWidget.addClass("gap");
          var inputText = new qx.ui.form.TextField();
          inputWidget.append(inputText);
          widget.append(inputWidget);
        }

        var bLayout = new qx.ui.layout.HBox();
        bLayout.alignX = "center";
        var buttonContainer = new qx.ui.Widget();
        buttonContainer.layout = bLayout;
        buttonContainer.addClass("gap");
        for(var i=0, l=buttons.length; i<l; i++)
        {
          var button = new qx.ui.Button(buttons[i]);
          /* see the comment in android.css for width: 0 for toolbar-button class*/
          button.addClass('dialog-button');
          button.layoutPrefs = {flex:1};
          buttonContainer.append(button);
          var callback = (function(index){
            return function()
            {
              dialog.hide();
              if(handler) {
                handler.call(scope, index, inputText ? inputText.value : null);
              }
              dialog.dispose();
            };
          })(i);
          button.on("tap", callback);
        }
        widget.append(buttonContainer);
      }
      dialog.modal = true;
      dialog.show();
      if(inputText) {
        inputText[0].focus();
      }
      return dialog;
    }
  }
});
