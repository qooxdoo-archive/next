"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project"s top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */


qx.Class.define("qx.module.Application", {
  extend : qx.event.Emitter,

  statics :
  {
    app : function() {
      var app = new qx.module.Application(this[0]);
      return app;
    }
  },


  construct : function(root) {
    this.__modelKeys = [];

    this._setUpBinding(root);
  },


  members : {
    __modelKeys : null,


    _setUpBinding : function(root) {
      qxWeb("*[data-bind]", root).forEach(function(el) {
        this._getBindings(el.getAttribute("data-bind")).forEach(function(keyValue) {
          var key = keyValue[0];
          var value = keyValue[1];

          // special handling for style
          if (key.indexOf("style.") === 0) {
            this._bindStyle(key, value, el);
          // special handling for widget properties
          } else if (key.indexOf("data-qx-config") === 0) {
            this._bindWidget(key, value, el);
          } else if (qx.Class.getClass(el["set" + qx.Class.firstUp(key)]) == "Function") {
            this._bindCollection(key, value, el);
          } else {
            this._bindAttribute(key, value, el);
          }
        }.bind(this));
      }.bind(this));
    },


    _getBindings: function(input) {
      var bindings = input.split(";");

      // filter out all strings without ->
      bindings = bindings.filter(function(item) {
        return item.indexOf("->") != -1;
      });

      return bindings.map(function(item) {
        var keyValue = item.split("->");
        keyValue[0] = keyValue[0].trim();
        keyValue[1] = keyValue[1].trim();
        return keyValue;
      });
    },


    _getBindingKeys: function(name, value, el) {
      var split = value.split("{{");
      var found = [];
      for (var i = 0; i < split.length; i++) {
        if (split[i].indexOf("}}") != -1) {
          found.push(split[i].split("}}")[0]);
          var key = found[found.length - 1].split(".")[0];
          var init = null;
          if (el) {
            // special handling for widget properties
            if (name.indexOf("data-qx-config") === 0) {
              init = el[name.replace("data-qx-config-", "")];
            // special handling for html
            } else if (el["get" + qx.Class.firstUp(name)] && name !== "style") {
              init = el["get" + qx.Class.firstUp(name)]();
            } else if (name !== "style") {
              init = el.getAttribute(name);
            }
          }
          this.addModel(key, init);
        }
      }
      return found;
    },


    _bindAttribute: function(name, value, el) {
      this._getBindingKeys(name, value, el).forEach(function(key) {
        qx.data.SingleValueBinding.bind(this, key, el, "attributes", {
          converter : this.__mapConverter.bind(this, name, value)
        });

        // check for two way bindable properties
        if (name === "checked") {
          el.on("change", function(key, el) {
            qx.data.SingleValueBinding.__setTargetValue(this, key, el.getAttribute("checked")); // TODO no private
          }.bind(this, key, el));
        }
      }.bind(this));
    },


    _bindStyle: function(key, value, el) {
      var style = key.split(".")[1];

      this._getBindingKeys("style", value, el).forEach(function(key) {
        qx.data.SingleValueBinding.bind(this, key, el, "styles", {
          converter : this.__mapConverter.bind(this, style, value)
        });
      }.bind(this));
    },


    _bindWidget: function(name, value, el) {
      var prop = name.replace("data-qx-config-", "");
      el.removeAttribute(name);

      this._getBindingKeys(name, value, el).forEach(function(key) {
        qx.data.SingleValueBinding.bind(this, key, el, prop);

        // two way binding
        el.on("change" + qx.Class.firstUp(prop), function(key, data) {
          qx.data.SingleValueBinding.__setTargetValue(this, key, data.value); // TODO no privates
        }.bind(this, key));
      }.bind(this));
    },


    _bindCollection: function(name, value, el) {
      this._getBindingKeys(name, value, el).forEach(function(key) {
        qx.data.SingleValueBinding.bind(this, key, el, name, {converter: function(value, name) {
          return this.__textConverter(value, name);
        }.bind(this, value, name)});

        // check for two way bindable properties
        if (name === "value") {
          el.on("input", function(key, el) {
             qx.data.SingleValueBinding.__setTargetValue(this, key, el.getValue()); // TODO no private
          }.bind(this, key, el));

          el.on("change", function(key, el) {
            qx.data.SingleValueBinding.__setTargetValue(this, key, el.getValue()); // TODO no private
          }.bind(this, key, el));

          el.setValue(qx.data.SingleValueBinding.resolvePropertyChain(this, key));
        }
      }.bind(this));
    },


    __mapConverter: function(name, origContent, data) {
      var map = {};
      if (data != null) {
        map[name] = this.__textConverter(origContent, name);
      }
      return map;
    },


    __textConverter : function(origContent, name) { // TODO rename
      var values = this._getBindingKeys(name, origContent);
      for (var i = 0; i < values.length; i++) {
        var value = qx.data.SingleValueBinding.resolvePropertyChain(this, values[i]);

        if (origContent == "{{" + values[i] + "}}") {
          origContent = value;
        } else {
          origContent = origContent.replace("{{" + values[i] + "}}", value);
        }
      }
      return origContent;
    },


    addModel : function(key, init) {
      if (this.__modelKeys.indexOf(key) != -1) {
        if (init != undefined) {
          qx.data.SingleValueBinding.__setTargetValue(this, key, init); // TODO no privates
        }
        return;
      }
      var config = {};
      config[key] = {
        event: true,
        init: init === undefined ? null : init,
        nullable: true
      };

      qx.Class.addProperties(this, config);
      this.__modelKeys.push(key);
    },


    addTransformModel: function(source, target, converter) {
      var initValue = qx.data.SingleValueBinding.resolvePropertyChain(this, source);
      var initConverted = converter(initValue);
      this.addModel(target, initConverted);

      qx.data.SingleValueBinding.bind(this, source, this, target, {converter: converter});
    }
  },


  classDefined : function(statics) {
    qxWeb.$attach({
      "app" : statics.app
    });
  }
});
