"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2008-2010 Sebastian Werner, http://sebastian-werner.net

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)
     * Andreas Ecker (ecker)

************************************************************************ */

/**
 * The selector engine based on <code>querySelectorAll</code> and <code>matches</code>.
 *
 * For further information check out the following documentation:
 * https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/Selectors
 */
qx.Class.define("qx.bom.Selector", {
  statics: {
    /**
     * Queries the document for the given selector. Supports all CSS3 selectors
     * plus some extensions as mentioned in the class description.
     *
     * @param selector {String} Valid selector (CSS3 + extensions)
     * @param context {Element} Context element (result elements must be children of this element)
     * @return {Array} Matching elements
     */
    query: function(selector, context) {
      if (!context) {
        context = document;
      }
      var elList = context.querySelectorAll(selector);
      return Array.prototype.slice.call(elList, 0);
    },


    /**
     * Returns an reduced array which only contains the elements from the given
     * array which matches the given selector
     *
     * @param selector {String} Selector to filter given set
     * @param set {Array} List to filter according to given selector
     * @return {Array} New array containing matching elements
     */
    matches: function(selector, set) {
      var doc = document.documentElement;
      var matches = doc.webkitMatchesSelector ||
        doc.mozMatchesSelector ||
        doc.msMatchesSelector ||
        doc.matches;
      var found = [];
      for (var i = 0; i < set.length; i++) {
        if (set[i].nodeType === 9) { // document
          set[i] = set[i].documentElement;
        }
        if (matches.call(set[i], selector)) {
          found.push(set[i]);
        }
      }
      return found;
    }
  }
});