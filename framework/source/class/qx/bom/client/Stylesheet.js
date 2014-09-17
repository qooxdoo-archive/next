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
     * Daniel Wagner (d_wagner)

************************************************************************ */
/**
 * Internal class which contains the checks used by {@link qx.core.Environment}.
 * All checks in here are marked as internal which means you should never use
 * them directly.
 *
 * This class contains checks related to Stylesheet objects.
 *
 * @internal
 */
qx.Class.define("qx.bom.client.Stylesheet",
{
  statics:
  {
    /**
     * Returns a stylesheet to be used for feature checks
     *
     * @return {Stylesheet} Stylesheet element
     */
    __getStylesheet : function() {
      if (!qx.bom.client.Stylesheet.__stylesheet) {
        qx.bom.client.Stylesheet.__stylesheet = qx.bom.Stylesheet.createElement();
      }
      return qx.bom.client.Stylesheet.__stylesheet;
    },


    /**
     * Check for IE's non-standard document.createStyleSheet function.
     * In IE9 (standards mode), the typeof check returns "function" so false is
     * returned. This is intended since IE9 supports the DOM-standard
     * createElement("style") which should be used instead.
     *
     * @internal
     * @return {Boolean} <code>true</code> if the browser supports
     * document.createStyleSheet
     */
    getCreateStyleSheet : function() {
      return typeof document.createStyleSheet === "object";
    },


    /**
     * Decides whether to use the legacy IE-only stylesheet.addImport or the
     * DOM-standard stylesheet.insertRule('@import [...]')
     *
     * @internal
     * @return {Boolean} <code>true</code> if stylesheet.addImport is supported
     */
    getAddImport : function() {
      return (typeof qx.bom.client.Stylesheet.__getStylesheet().addImport === "object");
    },


    /**
     * Decides whether to use the legacy IE-only stylesheet.removeImport or the
     * DOM-standard stylesheet.deleteRule('@import [...]')
     *
     * @internal
     * @return {Boolean} <code>true</code> if stylesheet.removeImport is supported
     */
    getRemoveImport : function() {
      return (typeof qx.bom.client.Stylesheet.__getStylesheet().removeImport === "object");
    }
  },



  classDefined : function (statics) {
    qx.core.Environment.add("html.stylesheet.createstylesheet", statics.getCreateStyleSheet);
    qx.core.Environment.add("html.stylesheet.addimport", statics.getAddImport);
    qx.core.Environment.add("html.stylesheet.removeimport", statics.getRemoveImport);
  }
});