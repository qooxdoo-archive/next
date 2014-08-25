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
 * Fires "appear" and "disappear" events on elements that are added to/
 * removed from the DOM or are displayed/hidden using the CSS display
 * property
 */
qx.Bootstrap.define("qx.module.event.AppearHandler", {

  statics : {

    TYPES : ["appear", "disappear"],

    elements : [],

    intervalId : null,

    /**
     * Stores the element in the list, initially stores the display status
     * and starts polling if it's not started yet.
     *
     * @param element {Element} DOM element
     * @param type {String} event type
     */
    register : function(element, type) {
      var clazz = qx.module.event.AppearHandler;
      if (clazz.elements.indexOf(element) == -1) {
        element["on" + type] = true;
        clazz.elements.push(element);
        element.$$displayed = element.offsetWidth > 0;
        if (clazz.intervalId === null) {
          clazz._startPolling();
        }
      }
    },

    /**
     * Removes the element from the list and stops polling if no longer
     * needed.
     *
     * @param element {Element} DOM element
     * @param type {String} event type
     */
    unregister : function(element, type) {
      var clazz = qx.module.event.AppearHandler;
      var idx = clazz.elements.indexOf(element);
      if (idx !== -1) {
        clazz.elements.splice(idx, 1);
      }
      delete element.$$displayed;

      if (clazz.elements.length === 0) {
        window.clearInterval(clazz.intervalId);
        clazz.intervalId = null;
      }
    },

    /**
     *  Checks if the target element's visibility has changed and fires
     *  appear/disappear events accordingly.
     *
     * @param target {Element} target element
     */
    _check : function(target) {
      var width = target.offsetWidth;
      if ((!target.$$displayed && width > 0) ||
          (target.$$displayed && width === 0)) {
        target.$$displayed = width > 0;
        var type = width > 0 ? "appear" : "disappear";
        var event = new qx.event.type.dom.Custom(type, null, null);
        target.dispatchEvent(event);
      }
    },

    /**
     * Starts the check interval
     */
    _startPolling : function() {
      var clazz = qx.module.event.AppearHandler;
      clazz.intervalId = window.setInterval(function() {
        clazz.elements.forEach(clazz._check);
      }, 100);
    }

  },

  defer : function(statics) {
    qxWeb.$registerEventHook(statics.TYPES, statics.register, statics.unregister);
  }
});