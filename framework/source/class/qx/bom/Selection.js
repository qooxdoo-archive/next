define(['qx/Class', 'qx/bom/client/Engine', 'qx/bom/Range', 'qx/core/Environment', 'qx/dom/Node'], function(Dep0,Dep1,Dep2,Dep3,Dep4) {
var qx = {
  "Class": Dep0,
  "bom": {
    "client": {
      "Engine": Dep1
    },
    "Range": Dep2,
    "Selection": null
  },
  "core": {
    "Environment": Dep3
  },
  "dom": {
    "Node": Dep4
  }
};

"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)

************************************************************************ */



/**
 * Low-level selection API to select elements like input and textarea elements
 * as well as text nodes or elements which their child nodes.
 *
 * @ignore(qx.bom.Element, qx.bom.Element.blur)
 */
var clazz = qx.Class.define("qx.bom.Selection",
{


  statics :
  {
    /**
     * Returns the native selection object.
     *
     * @param documentNode {document} Document node to retrieve the connected selection from
     * @return {Selection} native selection object
     */
    getSelectionObject : function(documentNode) {
      return qx.dom.Node.getWindow(documentNode).getSelection();
    },


    /**
     * Returns the current selected text.
     *
     * @param node {Node} node to retrieve the selection for
     * @return {String|null} selected text as string
     */
    get : function(node) {
      if (this.__isInputOrTextarea(node)) {
        return node.value.substring(node.selectionStart, node.selectionEnd);
      } else {
        return this.getSelectionObject(qx.dom.Node.getDocument(node)).toString();
      }
    },


    /**
     * Returns the length of the selection
     *
     * @signature function(node)
     * @param node {Node} Form node or document/window to check.
     * @return {Integer|null} length of the selection or null
     */
    getLength : function(node) {
      // suitable for gecko and webkit
      if (this.__isInputOrTextarea(node)) {
        return node.selectionEnd - node.selectionStart;
      } else {
        return this.get(node).length;
      }
    },


    /**
     * Returns the start of the selection
     *
     * @signature function(node)
     * @param node {Node} node to check for
     * @return {Integer} start of current selection or "-1" if the current
     *                   selection is not within the given node
     */
    getStart : function(node) {
      if (qx.core.Environment.get("engine.name") === "gecko" ||
          qx.core.Environment.get("engine.name") === "webkit")
      {
        if (this.__isInputOrTextarea(node)) {
          return node.selectionStart;
        }
        else
        {
          var documentElement = qx.dom.Node.getDocument(node);
          var documentSelection = this.getSelectionObject(documentElement);

          // gecko and webkit do differ how the user selected the text
          // "left-to-right" or "right-to-left"
          if (documentSelection.anchorOffset < documentSelection.focusOffset) {
            return documentSelection.anchorOffset;
          } else {
            return documentSelection.focusOffset;
          }
        }
      }

      if (this.__isInputOrTextarea(node)) {
        return node.selectionStart;
      } else {
        return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).anchorOffset;
      }
    },


    /**
     * Returns the end of the selection
     *
     * @signature function(node)
     * @param node {Node} node to check
     * @return {Integer} end of current selection
     */
    getEnd : function(node) {
      if (qx.core.Environment.get("engine.name") === "gecko" ||
          qx.core.Environment.get("engine.name") === "webkit")
      {
        if (this.__isInputOrTextarea(node)) {
          return node.selectionEnd;
        }
        else
        {
          var documentElement = qx.dom.Node.getDocument(node);
          var documentSelection = this.getSelectionObject(documentElement);

          // gecko and webkit do differ how the user selected the text
          // "left-to-right" or "right-to-left"
          if (documentSelection.focusOffset > documentSelection.anchorOffset) {
            return documentSelection.focusOffset;
          } else {
            return documentSelection.anchorOffset;
          }
        }
      }

      if (this.__isInputOrTextarea(node)) {
        return node.selectionEnd;
      } else {
        return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).focusOffset;
      }
    },


    /**
     * Utility method to check for an input or textarea element
     *
     * @param node {Node} node to check
     * @return {Boolean} Whether the given nodt is an input or textarea element
     */
    __isInputOrTextarea : function(node) {
      return qx.dom.Node.isElement(node) &&
            (node.nodeName.toLowerCase() == "input" ||
             node.nodeName.toLowerCase() == "textarea");
    },


    /**
     * Sets a selection at the given node with the given start and end.
     * For text nodes, input and textarea elements the start and end parameters
     * set the boundaries at the text.
     * For element nodes the start and end parameters are used to select the
     * childNodes of the given element.
     *
     * @signature function(node, start, end)
     * @param node {Node} node to set the selection at
     * @param start {Integer} start of the selection
     * @param end {Integer} end of the selection
     * @return {Boolean} whether a selection is drawn
     */
    set : function(node, start, end) {
      // special handling for input and textarea elements
      var nodeName = node.nodeName.toLowerCase();
      if (qx.dom.Node.isElement(node) && (nodeName == "input" || nodeName == "textarea"))
      {
        // if "end" is not given set it to the end
        if (end === undefined) {
          end = node.value.length;
        }

        // check boundaries
        if (start >= 0 && start <= node.value.length && end >= 0 && end <= node.value.length)
        {
          node.focus();
          node.select();
          node.setSelectionRange(start, end);
          return true;
        }
      }
      else
      {
        var validBoundaries = false;
        var sel = qx.dom.Node.getWindow(node).getSelection();

        var rng = qx.bom.Range.get(node);

        // element or text node?
        // for elements nodes the offsets are applied to childNodes
        // for text nodes the offsets are applied to the text content
        if (qx.dom.Node.isText(node))
        {
          if (end === undefined) {
            end = node.length;
          }

          if (start >= 0 && start < node.length && end >= 0 && end <= node.length) {
            validBoundaries = true;
          }
        }
        else if (qx.dom.Node.isElement(node))
        {
          if (end === undefined) {
            end = node.childNodes.length - 1;
          }

          if (start >= 0 && node.childNodes[start] && end >= 0 && node.childNodes[end]) {
            validBoundaries = true;
          }
        }
        else if (qx.dom.Node.isDocument(node))
        {
          // work on with the body element
          node = node.body;

          if (end === undefined) {
            end = node.childNodes.length - 1;
          }

          if (start >= 0 && node.childNodes[start] && end >= 0 && node.childNodes[end]) {
            validBoundaries = true;
          }
        }

        if (validBoundaries)
        {
          // collapse the selection if needed
          if (!sel.isCollapsed) {
            sel.collapseToStart();
          }

          // set start and end of the range
          rng.setStart(node, start);

          // for element nodes set the end after the childNode
          if (qx.dom.Node.isText(node)) {
            rng.setEnd(node, end);
          } else {
            rng.setEndAfter(node.childNodes[end]);
          }

          // remove all existing ranges and add the new one
          if (sel.rangeCount > 0) {
            sel.removeAllRanges();
          }

          sel.addRange(rng);

          return true;
        }
      }

      return false;
    },


    /**
     * Selects all content/childNodes of the given node
     *
     * @param node {Node} text, element or document node
     * @return {Boolean} whether a selection is drawn
     */
    setAll : function(node) {
      return qx.bom.Selection.set(node, 0);
    },


    /**
     * Clears the selection on the given node.
     *
     * @param node {Node} node to clear the selection for
     */
    clear : function(node) {
      var sel = qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node));
      var nodeName = node.nodeName.toLowerCase();

      // if the node is an input or textarea element use the specialized methods
      if (qx.dom.Node.isElement(node) && (nodeName == "input" || nodeName == "textarea"))
      {
        node.setSelectionRange(0, 0);
        if (qx.bom.Element && qx.bom.Element.blur) {
          qx.bom.Element.blur(node);
        }
      }
      // if the given node is the body/document node -> collapse the selection
      else if (qx.dom.Node.isDocument(node) || nodeName == "body")
      {
        sel.collapse(node.body ? node.body : node, 0);
      }
      // if an element/text node is given the current selection has to
      // encompass the node. Only then the selection is cleared.
      else
      {
        var rng = qx.bom.Range.get(node);
        if (!rng.collapsed)
        {
          var compareNode;
          var commonAncestor = rng.commonAncestorContainer;

          // compare the parentNode of the textNode with the given node
          // (if this node is an element) to decide whether the selection
          // is cleared or not.
          if (qx.dom.Node.isElement(node) && qx.dom.Node.isText(commonAncestor)) {
            compareNode = commonAncestor.parentNode;
          } else {
            compareNode = commonAncestor;
          }

          if (compareNode == node) {
            sel.collapse(node, 0);
          }
        }
      }
    }
  }
});

 qx.bom.Selection = clazz;
return clazz;
});
