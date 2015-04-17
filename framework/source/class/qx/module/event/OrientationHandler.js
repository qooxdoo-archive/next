define(['qx/Class', 'qx/dom/Node', 'qx/event/Emitter', 'qx/event/handler/OrientationCore', 'qxWeb', 'qx/module/Event'], function(Dep0,Dep1,Dep2,Dep3,Dep4,Dep5) {
var qx = {
  "Class": Dep0,
  "dom": {
    "Node": Dep1
  },
  "event": {
    "Emitter": Dep2,
    "handler": {
      "OrientationCore": Dep3
    }
  },
  "module": {
    "Event": Dep5,
    "event": {
      "OrientationHandler": null
    }
  }
};
var qxWeb = Dep4;

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
     * Daniel Wagner (danielwagner)

************************************************************************ */

/**
 * Orientation handler which is responsible for registering and unregistering a
 * {@link qx.event.handler.OrientationCore} handler for each given element.
 *
 * @require(qx.module.Event)
 *
 * @group (Event_Normalization)
 */
var clazz = qx.Class.define("qx.module.event.OrientationHandler", {

  statics :
  {
    /**
     * List of events that require an orientation handler
     */
    TYPES : ["orientationchange"],

    /**
     * Creates an orientation handler for the given window when an
     * orientationchange event listener is attached to it
     *
     * @param element {Window} DOM Window
     */
    register : function(element)
    {
      if (!qx.dom.Node.isWindow(element)) {
        throw new Error("The 'orientationchange' event is only available on window objects!");
      }

      if (!element.$$orientationHandler) {
        if (!element.$$emitter) {
          element.$$emitter = new qx.event.Emitter();
        }

        element.$$orientationHandler = new qx.event.handler.OrientationCore(element, element.$$emitter);
      }
    },


    /**
     * Removes the orientation event handler from the element if there are no more
     * orientationchange event listeners attached to it
     * @param element {Element} DOM element
     */
    unregister : function(element)
    {
      if (element.$$orientationHandler) {
        if (!element.$$emitter) {
          element.$$orientationHandler = null;
        }
        else {
          var hasListener = false;
          var listeners = element.$$emitter.getListeners();
          qx.module.event.OrientationHandler.TYPES.forEach(function(type) {
            if (type in listeners && listeners[type].length > 0) {
              hasListener = true;
            }
          });
          if (!hasListener) {
            element.$$orientationHandler = null;
          }
        }
      }
    }
  },

  classDefined : function(statics)
  {
    qxWeb.$registerEventHook(statics.TYPES, statics.register, statics.unregister);
  }
});

 qx.module.event.OrientationHandler = clazz;
return clazz;
});
