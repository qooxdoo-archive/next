/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)
     * Adrian Olaru (adrianolaru)
     * Andreas Ecker (ecker)

************************************************************************ */


/**
 * EXPERIMENTAL - NOT READY FOR PRODUCTION
 *
 * GeoLocation provides access to geographical location information
 * associated with the hosting device.
 *
 * For more information see:
 * http://www.w3.org/TR/geolocation-API/
 *
 */
qx.Bootstrap.define("qx.bom.GeoLocation",
{
  extend : qx.event.Emitter,

  statics : {
    __instance: null,

    /**
     * Returns the singleton instance of this class
     * @return {qx.bom.GeoLocation} The GeoLocation singleton
     */
    getInstance : function() {
      var clazz = qx.bom.GeoLocation;
      if (!clazz.__instance) {
        clazz.__instance = new clazz();
      }
      return clazz.__instance;
    }
  },


  construct: function() {
    if (qx.bom.GeoLocation.__instance) {
      throw new Error("'" + this.classname + "' is a singleton class and can not be instantiated directly. Please use '" + this.classnme + ".getInstance()' instead.");
    }

    this._geolocation = navigator.geolocation;
  },


  events:
  {
    /** Fired when the position is updated */
    "position": "qx.event.type.GeoPosition",

    /** Fired when an error occurs */
    "error": "qx.event.type.Data"
  },


  members:
  {
    _watchId: null,
    _geolocation: null,

    /**
     * Retrieves the current position and calls the "position" event.
     *
     * @param enableHighAccuracy {Function} provide the best possible results
     * @param timeout {Function} maximum time in ms that is allowed to pass from
     * the call to getCurrentPosition() or watchPosition() until the corresponding
     * callback is invoked.
     * @param maximumAge {Function} cache the position for a specified time.
     */
    getCurrentPosition: function(enableHighAccuracy, timeout, maximumAge)
    {
      var errorHandler = qx.lang.Function.bind(this._errorHandler, this);
      var successHandler = qx.lang.Function.bind(this._successHandler, this);
      this._geolocation.getCurrentPosition(successHandler, errorHandler, {
        enableHighAccuracy: enableHighAccuracy,
        timeout: timeout,
        maximumAge: maximumAge
      });
    },


    /**
     * Starts to watch the position. Calls the "position" event, when the position changed.
     *
     * @param enableHighAccuracy {Function} provide the best possible results
     * @param timeout {Function} maximum time in ms that is allowed to pass from
     * the call to getCurrentPosition() or watchPosition() until the corresponding
     * callback is invoked.
     * @param maximumAge {Function} cache the position for a specified time.
     */
    startWatchPosition: function(enableHighAccuracy, timeout, maximumAge)
    {
      this.stopWatchPosition();

      var errorHandler = qx.lang.Function.bind(this._errorHandler, this);
      var successHandler = qx.lang.Function.bind(this._successHandler, this);

      this._watchId = this._geolocation.watchPosition(successHandler, errorHandler, {
        enableHighAccuracy: enableHighAccuracy,
        timeout: timeout,
        maximumAge: maximumAge
      });
    },


    /**
     * Stops watching the position.
     */
    stopWatchPosition: function() {
      if (this._watchId != null) {
        this._geolocation.clearWatch(this._watchId);
        this._watchId = null;
      }
    },


    /**
     * Success handler.
     *
     * @param position {Function} position event
     */
    _successHandler: function(position) {
      this.emit("position", position);
    },


    /**
     * The Error handler.
     *
     * @param error {Function} error event
     */
    _errorHandler: function(error) {
      this.emit("error", error);
    },

    dispose: function() {
      this.stopWatchPosition();
    }
  }
});
