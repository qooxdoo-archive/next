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
qx.Class.define("qx.module.Application", {
  extend : qx.event.Emitter,

  statics :
  {
    app : function() {
      var app = new qx.module.Application(this);
      return app;
    },

    not: function(data) {
      return !data;
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
    root[0].$$app = this;
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
        var newBind = value + " -> data-qx-config-model";
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
    },


    _setUpElementBinding: function(el) {
      this._getBindingParts(el.getAttribute("data-bind")).forEach(function(binding) {
        var action = binding.right;
        var content = binding.left;

        // special handling for style
        if (action.indexOf("style.") === 0) {
          this._bindStyle(action, content, el);
        // special handling for class
        } else if (action.indexOf("class.") === 0) {
          this._bindClass(action, content, el);
        // special handling for widget properties
        } else if (action.indexOf("data-qx-config") === 0) {
          this._bindWidget(action, content, el);
        } else if (qx.Class.getClass(el["set" + qx.Class.firstUp(action)]) == "Function") {
          this._bindCollection(action, content, el);
        } else {
          this._bindAttribute(action, content, el);
        }
      }.bind(this));
    },


    _setUpElementEvents: function(el) {
      var event = el.getData("event");
      this._getBindingParts(el.getAttribute("data-event")).forEach(function(event) {
        var eventName = event.left;
        var handler = event.right.replace("()", "");
        el.on(eventName, function(handler, e) {
          this[handler].call(this, e, el);
        }.bind(this, handler));
      }.bind(this));
    },


    _getBindingParts: function(def) {
      if (!def) {
        return [];
      }

      var bindings = def.split(";");

      // filter out all strings without ->
      bindings = bindings.filter(function(item) {
        return item.indexOf("->") != -1;
      });

      return bindings.map(function(item) {
        var binding = item.split("->");
        binding[0] = binding[0].trim();
        binding[1] = binding[1].trim();
        return {
          left: binding[0],
          right: binding[1],
          direction: "->"
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
      var value = qx.data.SingleValueBinding.resolvePropertyChain(this, property);
      var converterList = [];
      while(tagContent.indexOf("(") != -1) {
        var converterName = tagContent.substring(0, tagContent.indexOf("("));
        converterList.push(converterName);
        tagContent = tagContent.replace(converterName + "(", ""); // remove name and opening bracket
        tagContent = tagContent.substring(0, tagContent.length -1); // remove closing bracket
      }

      for (var i = converterList.length -1; i >= 0; i--) {
        var convert = this.constructor[converterList[i]];
        if (!convert) {
          convert = qx.module.Application[converterList[i]];
        }
        value = convert(value, this);
      }
      return value;
    },



    _getProperty : function(tag) {
      return tag.replace(/.*\(|\)/g, "");
    },



    _bindAttribute: function(action, content, el) {
      this._getProperties(action, content, el).forEach(function(property) {
        qx.data.SingleValueBinding.bind(this, property, el, "attributes", {
          converter : this.__mapConverter.bind(this, action, content)
        });

        // check for two way bindable properties
        if (action === "checked") {
          el.on("change", function(property, el) {
            qx.data.SingleValueBinding.__setTargetValue(this, property, el.getAttribute("checked")); // TODO no private
          }.bind(this, property, el));
        }
      }.bind(this));
    },


    _bindStyle: function(action, content, el) {
      var style = action.split(".")[1];

      this._getProperties("style", content, el).forEach(function(property) {
        qx.data.SingleValueBinding.bind(this, property, el, "styles", {
          converter : this.__mapConverter.bind(this, style, content)
        });
      }.bind(this));
    },


    _bindClass: function(action, content, el) {
      var classname = action.split(".")[1];

      this._getProperties("cssClass", content, el).forEach(function(property) {
        qx.data.SingleValueBinding.bind(this, property, el, "classes", {
          converter : function(classname, tagContent) {
            var map = {};
            map[classname] = !!this._getValue(tagContent);
            return map;
          }.bind(this, classname, this._getTagContent(content)[0]) // TODO more than one?
        });
      }.bind(this));
    },


    _bindWidget: function(action, content, el) {
      var widgetPropert = action.replace("data-qx-config-", "");
      el.removeAttribute(action);

      this._getProperties(action, content, el).forEach(function(property) {
        qx.data.SingleValueBinding.bind(this, property, el, widgetPropert, {
          converter: function(content) {
            var tagContent = content.substring(2, content.length - 2);
            return this._getValue(tagContent);
          }.bind(this, content)
        });

        // two way binding
        el.on("change" + qx.Class.firstUp(widgetPropert), function(property, data) {
          qx.data.SingleValueBinding.__setTargetValue(this, property, data.value); // TODO no privates
        }.bind(this, property));
      }.bind(this));
    },


    _bindCollection: function(action, content, el) {
      this._getProperties(action, content, el).forEach(function(property) {
        qx.data.SingleValueBinding.bind(this, property, el, action, {converter: function(content, action) {
          return this.__textConverter(content);
        }.bind(this, content, action)});

        // check for two way bindable properties
        if (action === "value") {
          el.on("input", function(property, el) {
             qx.data.SingleValueBinding.__setTargetValue(this, property, el.getValue()); // TODO no private
          }.bind(this, property, el));

          el.on("change", function(property, el) {
            qx.data.SingleValueBinding.__setTargetValue(this, property, el.getValue()); // TODO no private
          }.bind(this, property, el));

          el.setValue(qx.data.SingleValueBinding.resolvePropertyChain(this, property));
        }
      }.bind(this));
    },


    __mapConverter: function(action, content, data) {
      var map = {};
      if (data != null) {
        map[action] = this.__textConverter(content);
      }
      return map;
    },


    __textConverter : function(content) { // TODO rename
      var tagContents = this._getTagContent(content);

      for (var i = 0; i < tagContents.length; i++) {
        var value = this._getValue(tagContents[i]);

        if (content == "{{" + tagContents[i] + "}}") {
          content = value;
        } else {
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
    }
  },


  classDefined : function(statics) {
    qxWeb.$attach({
      "app" : statics.app
    });
  }
});
