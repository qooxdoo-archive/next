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

/**
 * data-bind="{{xxx(bbb)}}ttt -> aaa; ..."
 *            ^--------------------- binding
 *                               ^-- binding.right (action)
 *            ^--------------        binding.left (content)
 *            ^-----------           tag
 *              ^-------             tagContent
 *              ^--                  converter
 *                  ^--              property
 */
qx.Class.define("qx.module.Controller", {
  extend : qx.event.Emitter,

  statics :
  {
    controller : function() {
      return new qx.module.Controller(this);
    },

    not: function(data) {
      return !data;
    },

    and: function() {
      var ret = true;
      for (var i = 0; i < arguments.length; i++) {
        ret = ret && !!arguments[i];
      }
      return ret;
    },

    or: function() {
      var ret = false;
      for (var i = 0; i < arguments.length; i++) {
        ret = ret || !!arguments[i];
      }
      return ret;
    },

    is: function(value, comp) {
      return value == comp;
    },

    isNot: function(value, comp) {
      return value != comp;
    },

    trim: function(data) {
      if (data && data.trim) {
        data = data.trim();
      }
      return data;
    }
  },


  construct : function(root) {
    this.__modelProperties = [];
    root[0].$$controller = this;
    this._setUp(root);
  },


  members : {
    __modelProperties : null,

    _setUp : function(root) {
      // repeat preparsing
      qxWeb("*[data-repeat]", root).forEach(function(el) {
        var value = el.getData("repeat");
        el.removeData("repeat");
        el.setData("qx-widget", "qx.ui.List");
        var oldBind = el.getData("bind");
        var newBind = value + " <-> data-qx-config-model";
        if (oldBind) {
          newBind += "; " + oldBind;
        }
        el.setData("bind", newBind);
      });

      // initialize all widgets before (those could remove invalid binding templates)
      qxWeb("*[data-qx-widget]", root).forEach(function() {});

      this._setUpElementBinding(root);
      qxWeb("*[data-bind]", root).forEach(function(el) {
        this._setUpElementBinding(el);
      }.bind(this));

      this._setUpElementEvents(root);
      qxWeb("*[data-event]", root).forEach(function(el) {
        this._setUpElementEvents(el);
      }.bind(this));

      // remove the cloak
      root.removeClass("cloak");
      qxWeb(".cloak", root).removeClass("cloak");
    },


    _setUpElementBinding: function(el) {
      this._getBindingParts(el.getAttribute("data-bind")).forEach(function(binding) {
        var action = binding.right;

        // special handling for style
        if (action.indexOf("style.") === 0) {
          this._bindStyle(binding, el);
        // special handling for class
        } else if (action.indexOf("class.") === 0) {
          this._bindClass(binding, el);
        // special handling for widget properties
        } else if (action.indexOf("data-qx-config") === 0) {
          this._bindWidget(binding, el);
        } else if (qx.Class.getClass(el["set" + qx.Class.firstUp(action)]) == "Function") {
          this._bindCollection(binding, el);
        } else {
          this._bindAttribute(binding, el);
        }
      }.bind(this));
    },


    _setUpElementEvents: function(el) {
      this._getBindingParts(el.getAttribute("data-event")).forEach(function(event) {
        var eventName = event.left;
        if (event.right.indexOf("()") == -1) {
          throw new Error("Missing brakets for event call in '" + event.left + " -> " + event.right + "'.");
        }
        el.on(eventName, function(handler, e) {
          var split = handler.split(".");
          var ctx, func;
          if (split.length === 1) {
            ctx = this;
            func = handler;
          } else {
            func = split.pop();
            ctx = qx.data.SingleValueBinding.resolvePropertyChain(this, split.join("."));
          }

          ctx[func].call(ctx, e, el);

        }.bind(this, event.right.replace("()", "")));
      }.bind(this));
    },


    _getBindingParts: function(def) {
      if (!def) {
        return [];
      }

      var bindings = def.split(";");

      // filter out all strings without delimiter
      bindings = bindings.filter(function(item) {
        return item.indexOf("->") != -1; // also includes <->
      });

      return bindings.map(function(item) {
        var delimiter = item.indexOf("<->") != -1 ? "<->" : "->";
        var binding = item.split(delimiter);
        binding[0] = binding[0].trim();
        binding[1] = binding[1].trim();
        return {
          left: binding[0],
          right: binding[1],
          twoWay: delimiter === "<->"
        };
      });
    },


    _getTagContent: function(content) {
      var split = content.split("{{");
      var found = [];
      for (var i = 0; i < split.length; i++) {
        if (split[i].indexOf("}}") != -1) {
          found.push(split[i].split("}}")[0]);
        }
      }
      return found;
    },


    _getProperties: function(action, content, el) {
      var tagContents = this._getTagContent(content);
      var properties = tagContents.map(this._getProperty);
      // parse multiplpe arguments
      for (var i = properties.length - 1; i >= 0; i--) {
        if (properties[i].indexOf(",") != -1) {
          var split = properties[i].split(",");
          split = split.map(function(data) {
            return data.trim();
          });
          // get rid of literals
          split = split.filter(function(prop) {
            return prop[0] != "'" && prop[0] != '"';
          });

          split.unshift(1);
          split.unshift(i);
          properties.splice.apply(properties, split);
        }
      }
      properties.forEach(function(property) {
        var init = null;
        if (el) {
          // special handling for widget properties
          if (action.indexOf("data-qx-config") === 0) {
            init = el[action.replace("data-qx-config-", "")];
          // special handling for html
          } else if (el["get" + qx.Class.firstUp(action)] && action !== "style") {
            init = el["get" + qx.Class.firstUp(action)]();
          } else if (action !== "style" && action !== "cssClass") {
            init = el.getAttribute(action);
          }
        }
        if (property.indexOf(".") != -1) {
          init = null;
          property = property.substring(0, property.indexOf("."));
        }

        if (property.indexOf("[") != -1) {
          init = null;
          property = property.substring(0, property.indexOf("["));
        }
        this.addModel(property, init);
      }.bind(this));

      return properties;
    },


    _getValue: function(tagContent) {
      var property = this._getProperty(tagContent);

      var converterName;
      if (tagContent.indexOf("(") != -1) {
        converterName = tagContent.substring(0, tagContent.indexOf("("));
        var values = [];

        var properties = property.split(",");
        properties = properties.map(function(txt) {
          return txt.trim();
        });
        for (var i = 0; i < properties.length; i++) {
          // check for literal values
          if (properties[i][0] == "'" || properties[i][0] == '"') {
            values[i] = properties[i].substring(1, properties[i].length -1);
          } else {
            values[i] = qx.data.SingleValueBinding.resolvePropertyChain(this, properties[i]);
          }
        }

        var convert = this.constructor[converterName];
        if (!convert) {
          convert = qx.module.Controller[converterName];
        }
        return convert.apply(this, values);
      } else {
        return qx.data.SingleValueBinding.resolvePropertyChain(this, property);
      }
    },



    _getProperty : function(tag) {
      return tag.replace(/.*\(|\)/g, "");
    },



    _bindAttribute: function(binding, el) {
      var action = binding.right;
      var content = binding.left;
      this._getProperties(action, content, el).forEach(function(property) {
        qx.data.SingleValueBinding.bind(this, property, el, "attributes", {
          converter : this.__mapConverter.bind(this, action, content)
        });

        // check for two way bindable properties
        if (binding.twoWay) {
          if (action === "checked") { // TODO better mapping of action to event name
            el.on("change", function(prop, targetEl) {
              qx.data.SingleValueBinding.setTargetValue(
                this, prop, targetEl.getAttribute("checked")
              );
            }.bind(this, property, el));
          }
        }

      }.bind(this));
    },


    _bindStyle: function(binding, el) {
      var action = binding.right;
      var content = binding.left;

      var style = action.split(".")[1];

      this._getProperties("style", content, el).forEach(function(property) {
        qx.data.SingleValueBinding.bind(this, property, el, "styles", {
          converter : this.__mapConverter.bind(this, style, content)
        });
      }.bind(this));
    },


    _bindClass: function(binding, el) {
      var action = binding.right;
      var content = binding.left;

      var classname = action.split(".")[1];

      this._getProperties("cssClass", content, el).forEach(function(property) {
        var tagContents = this._getTagContent(content);
        if (tagContents.length > 1) {
          var direction = binding.twoWay ? " <-> " : " -> ";
          throw new Error("Multiple binding variables are not allowed for class binding in '" +
            binding.left + direction + binding.right + "'.");
        }
        qx.data.SingleValueBinding.bind(this, property, el, "classes", {
          converter : function(name, tagContent) {
            var map = {};
            map[name] = !!this._getValue(tagContent);
            return map;
          }.bind(this, classname, tagContents[0])
        });
      }.bind(this));
    },


    _bindWidget: function(binding, el) {
      var action = binding.right;
      var content = binding.left;

      var widgetPropert = action.replace("data-qx-config-", "");
      el.removeAttribute(action);

      this._getProperties(action, content, el).forEach(function(property) {

        qx.data.SingleValueBinding.bind(this, property, el, widgetPropert, {
          converter: function(txt) {
            var tagContent = txt.substring(2, txt.length - 2);
            return this._getValue(tagContent);
          }.bind(this, content)
        });

        // two way binding
        if (binding.twoWay) {
          el.on("change" + qx.Class.firstUp(widgetPropert), function(prop, data) {
            qx.data.SingleValueBinding.setTargetValue(this, prop, data.value);
          }.bind(this, property));
        }
      }.bind(this));
    },


    _bindCollection: function(binding, el) {
      var action = binding.right;
      var content = binding.left;
      this._getProperties(action, content, el).forEach(function(property) {
        qx.data.SingleValueBinding.bind(this, property, el, action, {
          converter: function(txt) {
            return this.__resolveConverter(txt);
          }.bind(this, content)
        });

        // check for two way bindable properties
        if (action === "value" && binding.twoWay) { // TODO better mapping of action to event name
          el.on("input", function(prop, targetEl) {
            qx.data.SingleValueBinding.setTargetValue(this, prop, targetEl.getValue());
          }.bind(this, property, el));

          el.on("change", function(prop, targetEl) {
            qx.data.SingleValueBinding.setTargetValue(this, prop, targetEl.getValue());
          }.bind(this, property, el));

          el.setValue(qx.data.SingleValueBinding.resolvePropertyChain(this, property));
        }
      }.bind(this));
    },


    __mapConverter: function(action, content, data) {
      var map = {};
      if (data != null) {
        map[action] = this.__resolveConverter(content);
      }
      return map;
    },


    __resolveConverter : function(content) {
      var tagContents = this._getTagContent(content);

      for (var i = 0; i < tagContents.length; i++) {
        var value = this._getValue(tagContents[i]);

        if (content == "{{" + tagContents[i] + "}}") {
          content = value;
        } else {
          // normalize value
          if (value == null) {
            value = "";
          }
          content = content.replace("{{" + tagContents[i] + "}}", value);
        }
      }
      return content;
    },


    addModel : function(property, init) {
      if (this.__modelProperties.indexOf(property) != -1) {
        return;
      }

      var config = {};
      config[property] = {
        event: true,
        init: init === undefined ? null : init,
        nullable: true
      };

      qx.Class.addProperties(this, config);
      this.__modelProperties.push(property);
    },


    filterModel: function(sourceModel, targetModel, filterModels, filter) {
      if (this.__modelProperties.indexOf(targetModel) == -1) {
        this.addModel(targetModel);
      }

      var converter = function() {
        var data;
        if (this[sourceModel]) {
          data = this[sourceModel].filter(filter.bind(this));
        }
        return data;
      }.bind(this);

      q.data.bind(this, sourceModel, this, targetModel, {converter: converter});
      q.data.bind(this, sourceModel + ".length", this, targetModel, {converter: converter});

      if (qx.Class.getClass(filterModels) != "Array") {
        filterModels = [filterModels];
      }

      filterModels.forEach(function(model) {
        q.data.bind(this, model, this, targetModel, {converter: converter});
      }.bind(this));
    }
  },


  classDefined : function(statics) {
    qxWeb.$attach({
      "controller" : statics.controller
    });
  }
});
