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
qx.Class.define("qx.bom.client.Event",
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
        if (qx.bom.client.Event.supportsEvent(targets[i], "wheel")) {
          type = "wheel";
          target = targets[i];
          break;
        }
        // check for the non spec event
        if (qx.bom.client.Event.supportsEvent(targets[i], "mousewheel")) {
          type = "mousewheel";
          target = targets[i];
          break;
        }
      }

      return {type: type, target: target};
    },

    /**
     * Whether the given target supports the given event type.
     *
     * Useful for testing for support of new features like
     * touch events, gesture events, orientation change, on/offline, etc.
     *
     * *NOTE:* This check is *case-insensitive*.
     * <code>supportsEvent(window, "cLicK")</code> will return <code>true</code>
     * but <code>window.addEventListener("cLicK", callback)</code> will fail
     * silently!
     *
     * @param target {var} Any valid target e.g. window, dom node, etc.
     * @param type {String} Type of the event e.g. click, mousedown
     * @return {Boolean} Whether the given event is supported
     */
    supportsEvent : function(target, type)
    {
      var browserName = qx.core.Environment.get("browser.name");
      var engineName = qx.core.Environment.get("engine.name");

      // transitionEnd support can not be detected generically for Internet Explorer 10+ [BUG #7875]
      if (type.toLowerCase().indexOf("transitionend") != -1
          && engineName === "mshtml"
          && qx.core.Environment.get("browser.documentmode") > 9)
      {
        return true;
      }

      /**
       * add exception for safari mobile ()
       * @see http://bugzilla.qooxdoo.org/show_bug.cgi?id=8244
       */
      var safariBrowserNames = ["mobile safari", "safari"];
      if (
        engineName === "webkit" &&
        safariBrowserNames.indexOf(browserName) > -1
      ) {
        var supportedEvents = [
          'loadeddata', 'progress', 'timeupdate', 'seeked', 'canplay', 'play',
          'playing', 'pause', 'loadedmetadata', 'ended', 'volumechange'
        ];
        if (supportedEvents.indexOf(type.toLowerCase()) > -1) {
          return true;
        }
      }

      // The 'transitionend' event can only be detected on window objects,
      // not DOM elements [BUG #7249]
      if (target != window && type.toLowerCase().indexOf("transitionend") != -1) {
        var transitionSupport = qx.core.Environment.get("css.transition");
        return (transitionSupport && transitionSupport["end-event"] == type);
      }
      // Using the lowercase representation is important for the
      // detection of events like 'MSPointer*'. They have to detected
      // using the lower case name of the event.
      var eventName = "on" + type.toLowerCase();

      var supportsEvent = (eventName in target);

      if (!supportsEvent)
      {
        supportsEvent = typeof target[eventName] == "function";

        if (!supportsEvent && target.setAttribute)
        {
          target.setAttribute(eventName, "return;");
          supportsEvent = typeof target[eventName] == "function";

          target.removeAttribute(eventName);
        }
      }

      return supportsEvent;
    },


    /**
     * Returns the (possibly vendor-prefixed) name of the given event type.
     * *NOTE:* Incorrect capitalization of type names will *not* be corrected. See
     * {@link #supportsEvent} for details.
     *
     * @param target {var} Any valid target e.g. window, dom node, etc.
     * @param type {String} Type of the event e.g. click, mousedown
     * @return {String|null} Event name or <code>null</code> if the event is not
     * supported.
     */
    getEventName : function(target, type)
    {
      var pref = [""].concat(qx.bom.Style.VENDOR_PREFIXES);
      for (var i=0, l=pref.length; i<l; i++) {
        var prefix = pref[i].toLowerCase();
        if (qx.bom.client.Event.supportsEvent(target, prefix + type)) {
          return prefix ? prefix + qx.lang.String.firstUp(type) : type;
        }
      }

      return null;
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
