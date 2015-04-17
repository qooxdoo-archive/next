define(['qx/Class', 'qx/bom/Event', 'qx/core/Environment'], function(Dep0,Dep1,Dep2) {
var qx = {
  "Class": Dep0,
  "bom": {
    "Event": Dep1,
    "client": {
      "Event": null
    }
  },
  "core": {
    "Environment": Dep2
  }
};

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
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * Internal class which contains the checks used by {@link qx.core.Environment}.
 * All checks in here are marked as internal which means you should never use
 * them directly.
 *
 * This class should contain all checks about events.
 *
 * @internal
 */
var clazz = qx.Class.define("qx.bom.client.Event",
{
  statics :
  {
    /**
     * Checks if touch events are supported.
     *
     * @internal
     * @return {Boolean} <code>true</code> if touch events are supported.
     */
    getTouch : function() {
      return ("ontouchstart" in window);
    },


    /**
     * Checks if MSPointer events are available.
     *
     * @internal
     * @return {Boolean} <code>true</code> if pointer events are supported.
     */
    getMsPointer : function()
    {
      if ("pointerEnabled" in window.navigator) {
        return window.navigator.pointerEnabled;
      } else if ("msPointerEnabled" in window.navigator) {
        return window.navigator.msPointerEnabled;
      }

      return false;
    },


    /**
     * Checks if the proprietary <code>help</code> event is available.
     *
     * @internal
     * @return {Boolean} <code>true</code> if the "help" event is supported.
     */
    getHelp : function()
    {
      return ("onhelp" in document);
    },


    /**
     * Checks if the CustomEvent constructor is available and supports
     * custom event types.
     *
     * @return {Boolean} <code>true</code> if Custom Events are available
     */
    /* eslint no-new:0 */
    getCustomEvent : function() {
      if (!window.CustomEvent) {
        return false;
      }
      try {
        new window.CustomEvent("foo");
        return true;
      } catch(ex) {
        return false;
      }
    },

    /**
     * Checks if the MouseEvent constructor is available and supports
     * custom event types.
     *
     * @return {Boolean} <code>true</code> if Mouse Events are available
     */
    /* eslint no-new:0 */
    getMouseEvent : function() {
      if (!window.MouseEvent) {
        return false;
      }
      try {
        new window.MouseEvent("foo");
        return true;
      } catch(ex) {
        return false;
      }
    },

    /**
     * Checks if the MouseWheel event is available and on which target.
     *
     * @param win {Window ? null} An optional window instance to check.
     * @return {Map} A map containing two values: type and target.
     */
    getMouseWheel : function(win) {
      if (!win) {
        win = window;
      }

      // Fix for bug #3234
      var targets = [win, win.document, win.document.body];
      var target = win;
      var type = "DOMMouseScroll"; // for FF < 17

      for (var i = 0; i < targets.length; i++) {
        // check for the spec event (DOM-L3)
        if (qx.bom.Event.supportsEvent(targets[i], "wheel")) {
          type = "wheel";
          target = targets[i];
          break;
        }
        // check for the non spec event
        if (qx.bom.Event.supportsEvent(targets[i], "mousewheel")) {
          type = "mousewheel";
          target = targets[i];
          break;
        }
      }

      return {type: type, target: target};
    }
  },

  classDefined : function(statics) {
    qx.core.Environment.add("event.touch", statics.getTouch);
    qx.core.Environment.add("event.mouseevent", statics.getMouseEvent);
    qx.core.Environment.add("event.customevent", statics.getCustomEvent);
    qx.core.Environment.add("event.mspointer", statics.getMsPointer);
    qx.core.Environment.add("event.help", statics.getHelp);
    qx.core.Environment.add("event.mousewheel", statics.getMouseWheel);
  }
});

 qx.bom.client.Event = clazz;
return clazz;
});
