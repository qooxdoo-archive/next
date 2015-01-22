"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
/**
 * <h2>Form Controller</h2>
 *
 * *General idea*
 *
 * The form controller is responsible for connecting a form with a model. If no
 * model is given, a model can be created. This created model will fit exactly
 * to the given form and can be used for serialization. All the connections
 * between the form items and the model are handled by an internal
 * {@link qx.data.controller.Object}.
 *
 * *Features*
 *
 * * Connect a form to a model (bidirectional)
 * * Create a model for a given form
 *
 * *Usage*
 *
 * The controller only works if both a controller and a model are set.
 * Creating a model will automatically set the created model.
 *
 * *Cross reference*
 *
 * * If you want to bind single values, use {@link qx.data.controller.Object}
 * * If you want to bind a list like widget, use {@link qx.data.controller.List}
 * * If you want to bind a tree widget, use {@link qx.data.controller.Tree}
 */
qx.Class.define("qx.data.controller.Form",
{
  extend : Object,
  include : [qx.event.MEmitter],

  /**
   * @param model {Object | null} The model to bind the target to. The
   *   given object will be set as {@link #model} property.
   * @param target {qx.ui.form.Form | null} The form which contains the form
   *   items. The given form will be set as {@link #target} property.
   * @param selfUpdate {Boolean?false} If set to true, you need to call the
   *   {@link #updateModel} method to get the data in the form to the model.
   *   Otherwise, the data will be synced automatically on every change of
   *   the form.
   */
  construct : function(model, target, selfUpdate) {
    this._selfUpdate = !!selfUpdate;
    this.__bindingOptions = {};

    if (model != null) {
      this.model = model;
    }

    if (target != null) {
      this.target = target;
    }
  },


  properties :
  {
    /** Data object containing the data which should be shown in the target. */
    model :
    {
      apply: "_applyModel",
      event: true,
      nullable: true,
      init: null
    },


    /** The target widget which should show the data. */
    target :
    {
      // check: "qx.ui.form.Form", TODO
      apply: "_applyTarget",
      event: true,
      nullable: true,
      init: null
    }
  },


  members :
  {
    __objectController : null,
    __bindingOptions : null,


    /**
     * The form controller uses for setting up the bindings the fundamental
     * binding layer, the {@link qx.data.SingleValueBinding}. To achieve a
     * binding in both directions, two bindings are neede. With this method,
     * you have the opportunity to set the options used for the bindings.
     *
     * @param name {String} The name of the form item for which the options
     *   should be used.
     * @param model2target {Map} Options map used for the binding from model
     *   to target. The possible options can be found in the
     *   {@link qx.data.SingleValueBinding} class.
     * @param target2model {Map} Options map used for the binding from target
     *   to model. The possible options can be found in the
     *   {@link qx.data.SingleValueBinding} class.
     */
    addBindingOptions : function(name, model2target, target2model)
    {
      this.__bindingOptions[name] = [model2target, target2model];

      // return if not both, model and target are given
      if (this.model == null || this.target == null) {
        return;
      }

      // renew the affected binding
      var item;
      var items = this.target.find("*[data-qx-widget]");
      for (var i=0; i<items.length; i++) {
        var found = qxWeb(items[i]);
        var itemName = this._getItemName(found);
        if (itemName === name) {
          item = found;
          break;
        }
      }

      var targetProperty = "value";

      // remove the binding
      this.__objectController.removeTarget(item, targetProperty, name);
      // set up the new binding with the options
      this.__objectController.addTarget(
        item, targetProperty, name, !this._selfUpdate, model2target, target2model
      );
    },


    /**
     * Creates and sets a model using the {@link qx.data.marshal.Json} object.
     * Remember that this method can only work if the form is set. The created
     * model will fit exactly that form. Changing the form or adding an item to
     * the form will need a new model creation.
     *
     * @param includeBubbleEvents {Boolean} Whether the model should support
     *   the bubbling of change events or not.
     * @return {Object} The created model.
     */
    createModel : function(includeBubbleEvents) {
      var target = this.target;

      // throw an error if no target is set
      if (target == null) {
        throw new Error("No target is set.");
      }

      var data = {};
      var items = target.find("*[data-qx-widget]");
      for (var j=0; j<items.length; j++) {
        var item = qxWeb(items[j]);
        var name = this._getItemName(item);
        var names = name.split(".");
        var currentData = data;
        for (var i = 0; i < names.length; i++) {
          // if its the last item
          if (i + 1 == names.length) {
            // check if the target is a selection
            var clazz = item.constructor;
            var itemValue = null;
              itemValue = item.value;

            // call the converter if available [BUG #4382]
            if (this.__bindingOptions[name] && this.__bindingOptions[name][1]) {
              itemValue = this.__bindingOptions[name][1].converter(itemValue);
            }
            currentData[names[i]] = itemValue;
          } else {
            // if its not the last element, check if the object exists
            if (!currentData[names[i]]) {
              currentData[names[i]] = {};
            }
            currentData = currentData[names[i]];
          }
        }
      }

      var model = qx.data.marshal.Json.createModel(data, includeBubbleEvents);
      this.model = model;

      return model;
    },


    /**
     * Responsible for synching the data from entered in the form to the model.
     * Please keep in mind that this method only works if you create the form
     * with <code>selfUpdate</code> set to true. Otherwise, this method will
     * do nothing because updates will be synched automatically on every
     * change.
     */
    updateModel: function(){
      // only do stuff if self update is enabled and a model or target is set
      if (!this._selfUpdate || !this.model || !this.target) {
        return;
      }

      var items = this.target.find("*[data-qx-widget]");
      for (var i=0; i<items.length; i++) {
        var item = qxWeb(items[i]);
        var name = this._getItemName(item);
        var sourceProperty = "value";

        var options = this.__bindingOptions[name];
        options = options && this.__bindingOptions[name][1];

        qx.data.SingleValueBinding.updateTarget(
          item, sourceProperty, this.model, name, options
        );
      }
    },


    /**
     * Returns a form item's name to be used for data binding
     *
     * @param item {qx.ui.Widget} The form item
     * @return {String} The item's name
     */
    _getItemName: function(item) {
      if (item.modelName) {
        return item.modelName;
      }

      var name = item.getAttribute("name") || item.getAttribute("id");
      name = name.replace(
        /\s+|&|-|\+|\*|\/|\||!|\.|,|:|\?|;|~|%|\{|\}|\(|\)|\[|\]|<|>|=|\^|@|\\/g, ""
      );
      return name;
    },


    // apply method
    _applyTarget : function(value, old) {
      // if an old target is given, remove the binding
      if (old != null) {
        this.__tearDownBinding(old);
      }

      // do nothing if no target is set
      if (this.model == null) {
        return;
      }

      // target and model are available
      if (value != null) {
        this.__setUpBinding();
      }
    },


    // apply method
    _applyModel : function(value, old) {

      // set the model to null to reset all items before removing them
      if (this.__objectController != null && value == null) {
        this.__objectController.model = null;
      }

      // first, get rid off all bindings (avoids wrong data population)
      if (this.__objectController != null) {
        var items = this.target.find("*[data-qx-widget]");
        for (var i=0; i<items.length; i++) {
          var item = qxWeb(items[i]);
          var name = this._getItemName(item);
          var targetProperty = "value";
          this.__objectController.removeTarget(item, targetProperty, name);
        }
      }

      // set the model of the object controller if available
      if (this.__objectController != null) {
        this.__objectController.model = value;
      }

      // do nothing is no target is set
      if (this.target == null) {
        return;
      }

      // model and target are available
      if (value != null) {
        this.__setUpBinding();
      }
    },


    /**
     * Internal helper for setting up the bindings using
     * {@link qx.data.controller.Object#addTarget}. All bindings are set
     * up bidirectional.
     */
    __setUpBinding : function() {
      // create the object controller
      if (this.__objectController == null) {
        this.__objectController = new qx.data.controller.Object(this.model);
      }

      // get the form items
      var items = this.target.find("*[data-qx-widget]");

      // connect all items
      for (var i=0; i<items.length; i++) {
        var item = qxWeb(items[i]);
        var name = this._getItemName(item);
        var targetProperty = "value";
        var options = this.__bindingOptions[name];

        // try to bind all given items in the form
        try {
          if (options == null) {
            this.__objectController.addTarget(item, targetProperty, name, !this._selfUpdate);
          } else {
            this.__objectController.addTarget(
              item, targetProperty, name, !this._selfUpdate, options[0], options[1]
            );
          }
        // ignore not working items
        } catch (ex) {
          if (qx.core.Environment.get("qx.debug")) {
            qx.log.Logger.warn("Could not bind property " + name + " of " + this.model);
          }
        }
      }
      // make sure the initial values of the model are taken for resetting [BUG #5874]
      this.target.redefineResetter();
    },


    /**
     * Internal helper for removing all set up bindings using
     * {@link qx.data.controller.Object#removeTarget}.
     *
     * @param oldTarget {qx.ui.form.Form} The form which has been removed.
     */
    __tearDownBinding : function(oldTarget) {
      // do nothing if the object controller has not been created
      if (this.__objectController == null) {
        return;
      }

      // get the items
      var items = oldTarget.find("*[data-qx-widget]");
      for (var j=0; j<items.length; j++) {
        var item = qxWeb(items[j]);
        var name = this._getItemName(item);

        // disconnect all items
        var targetProperty = "value";
        this.__objectController.removeTarget(item, targetProperty, name);
      }
    },


    dispose : function() {
      // dispose the object controller because the bindings need to be removed
      if (this.__objectController) {
        this.__objectController.dispose();
      }
    }
  }
});
