"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */

/**
 * HTML templating module. This is a wrapper for mustache.js which is a
 * "framework-agnostic way to render logic-free views".
 *
 * For further details, please visit the mustache.js documentation here:
 *   https://github.com/janl/mustache.js/blob/master/README.md
 */
qx.Class.define("qx.module.Template", {
  statics :
  {
    create : function(path, selector) {
      return new qx.ui.Template(path, selector);
    },


    /**
     * Original and only template method of mustache.js. For further
     * documentation, please visit <a href="https://github.com/janl/mustache.js">mustache.js</a>.
     *
     * @attachStatic{qxWeb, template.render}
     * @param template {String} The String containing the template.
     * @param view {Object} The object holding the data to render.
     * @param partials {Object} Object holding parts of a template.
     * @return {String} The parsed template.
     */
    render : function(template, view, partials) {
      return qx.bom.Template.render(template, view, partials);
    },

    /**
     * Combines {@link #render} and {@link #get}. Input is equal to {@link #render}
     * and output is equal to {@link #get}. The advantage over {@link #get}
     * is that you don't need a HTML template but can use a template
     * string and still get a collection. Keep in mind that templates
     * can only have one root element.
     *
     * @attachStatic{qxWeb, template.renderToNode}
     * @param template {String} The String containing the template.
     * @param view {Object} The object holding the data to render.
     * @param partials {Object} Object holding parts of a template.
     * @return {qxWeb} Collection containing a single DOM element with the parsed
     * template data.
     */
    renderToNode : function(template, view, partials) {
      var el = qx.bom.Template.renderToNode(template, view, partials);
      el = qx.module.Template.__wrap(el);
      return qxWeb.$init(el, qxWeb);
    },

    /**
     * Helper method which provides direct access to templates stored as HTML in
     * the DOM. The DOM node with the given ID will be treated as a template,
     * parsed and a new DOM element will be returned containing the parsed data.
     * Keep in mind that templates can only have one root element.
     * Additionally, you should not put the template into a regular, hidden
     * DOM element because the template may not be valid HTML due to the containing
     * mustache tags. We suggest to put it into a script tag with the type
     * <code>text/template</code>.
     *
     * @attachStatic{qxWeb, template.getFromDom}
     * @param id {String} The id of the HTML template in the DOM.
     * @param view {Object} The object holding the data to render.
     * @param partials {Object} Object holding parts of a template.
     * @return {qxWeb} Collection containing a single DOM element with the parsed
     * template data.
     */
    getFromDom : function(id, view, partials) {
      var el = qx.bom.Template.get(id, view, partials);
      el = qx.module.Template.__wrap(el);
      return qxWeb.$init(el, qxWeb);
    },


    /**
     * If the given node is a DOM text node, wrap it in a span element and return
     * the wrapper. If its a
     * @param el {Node} a DOM node
     * @return {Element} Original element or wrapper
     */
    __wrap : function(el) {
      if (qxWeb.isTextNode(el)) {
        var wrapper = document.createElement("span");
        wrapper.appendChild(el);
        el = wrapper;
      } else if (qxWeb.isDocumentFragment(el)) {
        return el.childNodes;
      }
      return [el];
    }
  },


  classDefined : function(statics) {
    qxWeb.$attachStatic({
      "template" : {
        render: statics.render,
        renderToNode: statics.renderToNode,

        create : statics.create,
        init : qx.ui.Template.init,
        get: qx.ui.Template.get,
        getFromDom: statics.getFromDom,
        add : qx.ui.Template.add
      }
    });
  }
});
