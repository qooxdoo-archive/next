define(['qx/Class', 'qx/event/handler/Track', 'qxWeb', 'qx/module/Event', 'qx/module/event/PointerHandler'], function(Dep0,Dep1,Dep2,Dep3,Dep4) {
var qx = {
  "Class": Dep0,
  "event": {
    "handler": {
      "Track": Dep1
    }
  },
  "module": {
    "Event": Dep3,
    "event": {
      "PointerHandler": Dep4,
      "TrackHandler": null
    }
  }
};
var qxWeb = Dep2;

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

   Authors:
     * Daniel Wagner (danielwagner)

************************************************************************ */

/**
 * Creates a gesture handler that fires high-level events such as "swipe"
 * based on low-level event sequences on the given element
 *
 * @require(qx.module.Event)
 * @require(qx.module.event.PointerHandler)
 *
 * @group (Event_Normalization)
 */
var clazz = qx.Class.define("qx.module.event.TrackHandler", {

  statics : {

    TYPES : ["track", "trackstart", "trackend"],


    /**
     * Creates a gesture handler for the given element when a gesture event listener
     * is attached to it
     *
     * @param element {Element} DOM element
     */
    register : function(element) {
      if (!element.$$trackHandler) {
        element.$$trackHandler = new qx.event.handler.Track(element);
      }
    },


    /**
     * Removes the gesture event handler from the element if there are no more
     * gesture event listeners attached to it
     * @param element {Element} DOM element
     */
    unregister : function(element) {
      // check if there are any registered listeners left
      if (element.$$trackHandler) {
        var listeners = element.$$emitter.getListeners();
        for (var type in listeners) {
          if (qx.module.event.TrackHandler.TYPES.indexOf(type) !== -1) {
            if (Object.keys(listeners[type]).length > 0) {
              return;
            }
          }
        }

        // no more listeners, get rid of the handler
        element.$$trackHandler.dispose();
        element.$$trackHandler = undefined;
      }
    }
  },

  classDefined : function(statics)
  {
    qxWeb.$registerEventHook(statics.TYPES, statics.register, statics.unregister);
  }
});

 qx.module.event.TrackHandler = clazz;
return clazz;
});
