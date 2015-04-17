define(['qx/Class', 'qx/core/MSingleton', 'qx/ui/Button', 'qx/ui/Label', 'qx/ui/Widget', 'qx/ui/dialog/BusyIndicator', 'qx/ui/dialog/Popup', 'qx/ui/form/TextField', 'qx/ui/layout/HBox', 'qx/ui/layout/VBox'], function(Dep0,Dep1,Dep2,Dep3,Dep4,Dep5,Dep6,Dep7,Dep8,Dep9) {
var qx = {
  "Class": Dep0,
  "core": {
    "MSingleton": Dep1
  },
  "ui": {
    "Button": Dep2,
    "Label": Dep3,
    "Widget": Dep4,
    "dialog": {
      "BusyIndicator": Dep5,
      "Popup": Dep6,
      "Manager": null
    },
    "form": {
      "TextField": Dep7
    },
    "layout": {
      "HBox": Dep8,
      "VBox": Dep9
    }
  }
};

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
 * Very basic dialog manager. For debugging in a browser
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
var clazz = qx.Class.define("qx.ui.dialog.Manager",
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
     * Displays an alert box.
     *
     * @param title {String} The title of the alert box
     * @param text {String} The text to display in the alert box
     * @param handler {Function} The handler to call when the <code>OK</code> button
     *     was pressed
     * @param scope {Object} The scope of the handler
     * @param button {String} The button title
     * @return {qx.ui.dialog.Popup|Object} a reference to an alert dialog
     *          instance
     * @lint ignoreDeprecated(alert)
     */
    alert : function(title, text, handler, scope, button)
    {
      return this.__showNonNativeDialog(title, text, handler, scope, [button], qx.ui.dialog.Manager.MESSAGE_DIALOG);
    },


    /**
     * Displays a confirm box.
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
      return this.__showNonNativeDialog(title, text, handler, scope, buttons, qx.ui.dialog.Manager.MESSAGE_DIALOG);
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
     * Displays an error dialog.
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
      return this.__showNonNativeDialog(title, text, handler, scope, button, qx.ui.dialog.Manager.ERROR_DIALOG);
    },


    /**
     * Displays a warning dialog.
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
      return this.__showNonNativeDialog(title, text, handler, scope, button, qx.ui.dialog.Manager.WARNING_DIALOG);
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

 qx.ui.dialog.Manager = clazz;
return clazz;
});
