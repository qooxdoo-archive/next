define(['qx/Class', 'qxWeb', 'qx/module/Event'], function(Dep0,Dep1,Dep2) {
var qx = {
  "Class": Dep0,
  "module": {
    "Event": Dep2,
    "event": {
      "Pinch": null
    }
  }
};
var qxWeb = Dep1;

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
 * Normalization for the pinch gesture.
 *
 * @require(qx.module.Event)
 *
 * @group (Event_Normalization)
 */
var clazz = qx.Class.define("qx.module.event.Pinch", {
  statics :
  {
    /**
     * List of event types to be normalized
     */
    TYPES : ["pinch"],


    BIND_METHODS : [ "getScale" ],


    /**
     * Returns the calculated scale of this event.
     *
     * @return {Float} the scale value of this event.
     */
    getScale : function() {
      return this._original.scale;
    },


    /**
     * Manipulates the native event object, adding methods if they're not
     * already present
     *
     * @param event {Event} Native event object
     * @return {Event} Normalized event object
     * @internal
     */
    normalize : function(event)
    {
      if (!event) {
        return event;
      }
      // apply mouse event normalizations
      var bindMethods = qx.module.event.Pinch.BIND_METHODS;
      for (var i=0, l=bindMethods.length; i<l; i++) {
        if (typeof event[bindMethods[i]] != "function") {
          event[bindMethods[i]] = qx.module.event.Pinch[bindMethods[i]].bind(event);
        }
      }

      return event;
    }
  },

  classDefined : function(statics) {
    qxWeb.$registerEventNormalization(qx.module.event.Pinch.TYPES, statics.normalize);
  }
});

 qx.module.event.Pinch = clazz;
return clazz;
});
