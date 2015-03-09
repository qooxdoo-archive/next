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
          if (key === "style") {
            this._bindStyle(value, el);
          // special handling for widget properties
          } else if (key.indexOf("data-qx-config") === 0) {
            this._bindWidget(key, value, el);
          } else {
            this._bindAttribute(key, value, el);
          }
        }.bind(this));
      }.bind(this));
    },


    _getBindings: function(input) {
      var bindings = input.split(";");

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
        qx.data.SingleValueBinding.bind(this, key, qxWeb(el), "attributes", {
          converter : this.__mapConverter.bind(this, name, value)
        });

        // check for two way bindable properties
        if (name === "value") {
          qxWeb(el).on("input", function(key, el) {
            qx.data.SingleValueBinding.__setTargetValue(this, key, el.getValue()); // TODO no private
          }.bind(this, key, qxWeb(el)));
          qxWeb(el).setValue(qx.data.SingleValueBinding.resolvePropertyChain(this, key));
        }
      }.bind(this));
    },


    _bindStyle: function(value, el) {
      var styles = value.split(";");
      for (var i = 0; i < styles.length; i++) {
        if (styles[i].indexOf(":") == -1) {
          continue;
        }
        var style = styles[i].split(":");
        style[0] = style[0].trim();
        style[1] = style[1].trim();
        this._getBindingKeys("style", style[1], el).forEach(function(key) {
          qx.data.SingleValueBinding.bind(this, key, qxWeb(el), "styles", {
            converter : this.__mapConverter.bind(this, style[0], style[1])
          });
        }.bind(this));
      }
    },


    _bindWidget: function(name, value, el) {
      var prop = name.replace("data-qx-config-", "");
      el.removeAttribute(name);

      this._getBindingKeys(name, value, el).forEach(function(key) {
        qx.data.SingleValueBinding.bind(this, key, qxWeb(el), prop);

        // two way binding
        qxWeb(el).on("change" + qx.Class.firstUp(prop), function(key, data) {
          qx.data.SingleValueBinding.__setTargetValue(this, key, data.value); // TODO no privates
        }.bind(this, key));
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
        origContent = origContent.replace("{{" + values[i] + "}}", value);
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
    }
  },


  classDefined : function(statics) {
    qxWeb.$attach({
      "app" : statics.app
    });
  }
});
