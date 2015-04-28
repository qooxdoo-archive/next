"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

/**
 * EXPERIMENTAL
 *
 * Class responsible for loading and rendering templates into the DOM.
 *
 * @require(qx.module.Io)
 */
qx.Class.define("qx.ui.Template",
{
  extend : Object,
  include : [qx.event.MEmitter],

  statics : {
    /**
     * internal registry for all loaded templates.
     */
    __registry : {},

    // TODO register fail / 404 template


    /**
     * Initializes all templates within the given root.
     * @param root {Element} The root element for the initialization.
     */
    init : function(root) {
      var nodes = root.querySelectorAll("*[data-qx-template]");
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var id = node.getAttribute("data-qx-template");
        var template = new qx.ui.Template(id, node);
        node.template = template;
      }
    },


    /**
     * Returns a template based on the given id.
     *
     * @param id {String} The template id.
     * @return {String} The template.
     */
    get : function(id) {
      var node = document.querySelectorAll('*[data-qx-template="' + id + '"]');
      if (node.length === 0) {
        return null;
      }
      return node[0].template;
    },


    /**
     * Add a template to the registry.
     * @param path {String} The template path.
     * @param template {String} The template string.
     */
    add : function(path, template) {
      qx.ui.Template.__registry[path] = template;
    }
  },


  /**
   * @param path {String} The URI to the template file.
   * @param selector {String} The selector for the templates targe element.
   */
  construct : function(path, selector) {
    if (!qx.ui.Template.__registry[path]) {
      this._load(path);
    }
    this._path = path;
    this.__selector = selector;
    this.render();
  },


  properties : {
    /**
     * The data model for the template.
     */
    model : {
      event: true,
      nullable: true,
      apply: "_applyModel"
    }
  },


  members: {
    __selector: null,

    _applyModel: function(value, old) {
      if (value && value.on) {
        value.on("changeBubble", this.render, this);
      }
      if (old && value.off) {
        old.off("changeBubble", this.render, this);
      }
      this.render();
    },


    /**
     * Renders the template based on the set model property.
     */
    render : function() {
      var template = qx.ui.Template.__registry[this._path];
      if (!template) {
        return;
      }
      var plainHtml = template.indexOf("{{") == -1;
      if (!this.model && !plainHtml) {
        return;
      }

      var root = qxWeb(this.__selector);
      var data = qx.util.Serializer.toNativeObject(this.model);
      root.empty().append(qx.bom.Template.renderToNode(template, data));
      if (qxWeb.initWidgets) {
        qxWeb.initWidgets();
      }
      qx.ui.Template.init(root[0]);
      this.emit("ready");
    },


    /**
     * Helper to load the temapltes files.
     * @param path {String} The URI of the template file.
     */
    _load : function(path) {
      qxWeb.io.xhr(path).on('loadend', function(xhr) {
        if (xhr.responseText && xhr.status != 404) {
          qx.ui.Template.__registry[path] = xhr.responseText;
          this.render();
        } else {
          qx.ui.Template.__registry[path] = "Failed to load...";
          this.render();
        }
      }.bind(this)).send();
    }
  }
});
