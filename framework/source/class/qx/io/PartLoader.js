"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * The part loader knows about all generated packages and parts.
 *
 * It contains functionality to load parts and to retrieve part instances.
 */
qx.Bootstrap.define("qx.io.PartLoader",
{
  extend : Object,

  include: [qx.core.MSingleton, qx.event.MEmitter],


  construct : function()
  {
    this.initMSingleton();


    var loader = this._loader = qx.Part.getInstance();

    var self = this;
    loader.onpart = function(part) {
      if (part.getReadyState() == "complete") {
        self.emit("partLoaded", part);
      } else {
        self.emit("partLoadingError", part.getName());
      }
    };
  },


  events :
  {
    /**
     * Fired if a parts was loaded. The data of the event instance point to the
     * loaded part instance.
     */
    "partLoaded" : "Object",

    /**
     * Fired if a part could not be loaded. The event's
     * {@link qx.event.type.Data#getData} method returns the name of the failed
     * part.
     */
    "partLoadingError" : "Object"
  },


  statics :
  {
    getInstance : qx.core.MSingleton.getInstance,
    /**
     * Loads one or more parts asynchronously. The callback is called after all
     * parts and their dependencies are fully loaded. If the parts are already
     * loaded the callback is called immediately.
     *
     * @param partNames {String[]} List of parts names to load as defined in the
     *    config file at compile time.
     * @param callback {Function} Function to execute on completion.
     *   The function has one parameter which is an array of ready states of
     *   the parts specified in the partNames argument.
     * @param self {Object?window} Context to execute the given function in
     */
    require : function(partNames, callback, self) {
      this.getInstance().require(partNames, callback, self);
    }
  },


  members :
  {
    /**
     * Loads one or more parts asynchronously. The callback is called after all
     * parts and their dependencies are fully loaded. If the parts are already
     * loaded the callback is called immediately.
     *
     * @param partNames {String|String[]} List of parts names to load as defined
     *    in the config file at compile time. The method also accepts a single
     *    string as parameter to only load one part.
     * @param callback {Function} Function to execute on completion
     * @param self {Object?window} Context to execute the given function in
     */
    require : function(partNames, callback, self) {
      this._loader.require(partNames, callback, self);
    },


    /**
     * Get the part instance of the part with the given name.
     *
     * @param name {String} Name of the part as defined in the config file at
     *    compile time.
     * @return {qx.io.part.Part} The corresponding part instance
     */
    getPart : function(name) {
      return this.getParts()[name];
    },


    /**
     * Checks if a part with the given name is available.
     * @param name {String} Name of the part as defined in the config file at
     *    compile time.
     * @return {Boolean} <code>true</code>, if the part is available
     */
    hasPart : function(name) {
      return this.getPart(name) !== undefined;
    },


    /**
     * Returns a map of all known parts.
     * @return {Map} Map containing all parts.
     */
    getParts : function() {
      return this._loader.getParts();
    }
  }
});
