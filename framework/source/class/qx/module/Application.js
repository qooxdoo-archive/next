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
      var children = root.children;
      for (var i = 0; i < children.length; i++) {
        var child = children[i];

        // attribute content
        var ownHtml = child.outerHTML.replace(child.innerHTML, "");
        if (ownHtml.match(/.*\{\{.*\}\}.*/g)) {
          for (var j = 0; j < child.attributes.length; j++) {
            var attr = child.attributes[j];

            if (attr.value.match(/.*\{\{.*\}\}.*/g)) {
              // special handling for style
              if (attr.name === "style") {
                this._bindStyle(attr.value, child);
              // special handling for widget properties
              } else if (attr.name.indexOf("data-qx-config") === 0) {
                this._bindWidget(attr.name, attr.value, child);
              } else {
                this._bindAttribute(attr.name, attr.value, child);
              }
            }
          }
        }

        // recusion or text content
        if (child.children.length > 0) {
          this._setUpBinding(child);
        } else {
          // text content
          if (child.textContent.match(/.*\{\{.*\}\}.*/g)) {
            this._getBindings(child.textContent).forEach(function(content, key) {
              qx.data.SingleValueBinding.bind(this, key, qxWeb(child), "html", {
                converter : this.__textConverter.bind(this, content)
              });
            }.bind(this, child.textContent));
          }
        }
      }
    },


    _getBindings: function(value) { // TODO better name
      var split = value.split("{{");
      var found = [];
      for (var i = 0; i < split.length; i++) {
        if (split[i].indexOf("}}") != -1) {
          found.push(split[i].split("}}")[0]);

          var data = this._resolveInitValue(found[found.length - 1].split(".")[0]);

          this.addModel(data.key, data.init); // initialize binding property
        }
      }
      return found;
    },


    _resolveInitValue: function(key) {
      var split = key.split("=");

      var init = split[1] && split[1].trim()
      return {key: split[0].trim(), init: init}
    },


    _bindAttribute: function(name, value, child) {
      this._getBindings(value).forEach(function(key) {
        qx.data.SingleValueBinding.bind(this, key, qxWeb(child), "attributes", {
          converter : this.__mapConverter.bind(this, name, value)
        });

        // check for two way bindable properties
        if (name === "value") {
          qxWeb(child).on("input", function(key, el) {
            qx.data.SingleValueBinding.__setTargetValue(this, key, el.getValue());
          }.bind(this, key, qxWeb(child)));
          qxWeb(child).setValue(qx.data.SingleValueBinding.resolvePropertyChain(this, key));
        }
      }.bind(this));
    },


    _bindStyle: function(value, child) {
      var styles = value.split(";");
      for (var i = 0; i < styles.length; i++) {
        if (styles[i].indexOf(":") == -1) {
          continue;
        }
        var style = styles[i].split(":");
        style[0] = style[0].trim();
        style[1] = style[1].trim();
        this._getBindings(style[1]).forEach(function(key) {
          qx.data.SingleValueBinding.bind(this, key, qxWeb(child), "styles", {
            converter : this.__mapConverter.bind(this, style[0], style[1])
          });
        }.bind(this));
      }
    },


    _bindWidget: function(name, value, child) {
      var prop = name.replace("data-qx-config-", "");
      child.removeAttribute(name);

      this._getBindings(value).forEach(function(key) {
        key = this._resolveInitValue(key).key;
        qx.data.SingleValueBinding.bind(this, key, qxWeb(child), prop);

        // two way binding
        qxWeb(child).on("change" + qx.Class.firstUp(prop), function(key, data) {
          qx.data.SingleValueBinding.__setTargetValue(this, key, data.value); // TODO no privates
        }.bind(this, key));
      }.bind(this));
    },


    __mapConverter: function(name, origContent, data) {
      var map = {};
      if (data != null) {
        map[name] = this.__textConverter(origContent);
      }
      return map;
    },


    __textConverter : function(origContent) { // TODO rename
      var values = this._getBindings(origContent);
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
