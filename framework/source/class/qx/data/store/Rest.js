define(['qx/Class', 'qx/event/MEmitter', 'qx/data/marshal/Json', 'qx/lang/Function', 'qx/lang/Type'], function(Dep0,Dep1,Dep2,Dep3,Dep4) {
var qx = {
  "Class": Dep0,
  "event": {
    "MEmitter": Dep1
  },
  "data": {
    "marshal": {
      "Json": Dep2
    },
    "store": {
      "Rest": null
    }
  },
  "lang": {
    "Function": Dep3,
    "Type": Dep4
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
     * Tristan Koch (tristankoch)

************************************************************************ */

/**
 * Handles response associated to a resource's action. The model property is
 * populated with the marshaled response. Note the action is invoked on the
 * resource, not the store.
 */
var clazz = qx.Class.define("qx.data.store.Rest",
{
  extend: Object,
  include : [qx.event.MEmitter],

  /**
   * @param resource {qx.io.rest.Resource} The resource.
   * @param actionName {String} The name of the resource's action to retrieve
   *  the response from.
   * @param delegate {Object?null} The delegate containing one of the methods
   *  specified in {@link qx.data.store.IStoreDelegate}.
   */
  construct: function(resource, actionName, delegate)
  {
    this.resource = resource;
    this.actionName = actionName;

    this._delegate = delegate;
    this._marshaler = new qx.data.marshal.Json(delegate);

    if (delegate && qx.lang.Type.isFunction(delegate.configureRequest)) {
      this.__configureRequest();
    }

    this.__onActionSuccessBound = qx.lang.Function.bind(this.__onActionSuccess, this);
    this.__addListeners();
  },

  properties:
  {
    /**
     * The resource.
     */
    resource: {
      check: "qx.io.rest.Resource"
    },

    /**
     * The name of the resource's action to retrieve the response from.
     */
    actionName: {
      check: "String"
    },

    /**
     * Populated with the marshaled response.
     */
    model: {
      nullable: true,
      event: true
    }
  },

  members:
  {
    _marshaler: null,
    _delegate: null,

    __onActionSuccessBound: null,

    /**
     * Configure the resource's request by processing the delegate.
     */
    __configureRequest: function() {
      // Overrides existing callback, if any
      this.resource.configureRequest(this._delegate.configureRequest);
    },

    /**
     * Listen to events fired by the resource.
     */
    __addListeners: function() {
      if (this.resource && this.actionName) {
        this.resource.on(this.actionName + "Success", this.__onActionSuccessBound);
      }
    },

    /**
     * Handle actionSuccess event.
     *
     * Updates model with marshaled response.
     *
     * @param e {qx.event.type.Rest} Rest event.
     */
    __onActionSuccess: function(e) {
      var data = e.response,
          marshaler = this._marshaler,
          model,
          delegate = this._delegate;

      // Skip if data is empty
      if (data) {
        // Manipulate received data
        if (delegate && delegate.manipulateData) {
          data = delegate.manipulateData(data);
        }

        // Create class suiting data and assign instance
        // initialized with data to model property
        marshaler.toClass(data, true);
        model = marshaler.toModel(data);
        if (model) {
          this.model = model;
        }
      }
    },


    dispose : function() {
      if (this.resource && this.actionName) {
        this.resource.off(this.actionName + "Success", this.__onActionSuccessBound);
      }
    }
  }
});

 qx.data.store.Rest = clazz;
return clazz;
});
