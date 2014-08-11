"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */

/**
 * Basic implementation for an event emitter. This supplies a basic and
 * minimalistic event mechanism.
 */
qx.Bootstrap.define("qx.event.Emitter",
{
  extend : Object,
  statics : {
    /** global id for all events */
    __storageId : 0
  },

  members :
  {
    __listener : null,
    __any : null,


    /**
     * Attach a listener to the event emitter. The given <code>name</code>
     * will define the type of event. Handing in a <code>'*'</code> will
     * listen to all events emitted by the event emitter.
     *
     * @param name {String} The name of the event to listen to.
     * @param listener {Function} The function execute on {@link #emit}.
     * @param ctx {var?Window} The context of the listener.
     * @return {Integer} An unique <code>id</code> for the attached listener.
     */
    on : function(name, listener, ctx) {
      this.$$lastListenerId = qx.event.Emitter.__storageId++;
      this.__getStorage(name)[this.$$lastListenerId] = {
        name: name,
        listener: listener,
        ctx: ctx,
        id: this.$$lastListenerId
      };
      return this.$$lastListenerId;
    },


    /**
     * Attach a listener to the event emitter which will be executed only once.
     * The given <code>name</code> will define the type of event. Handing in a
     * <code>'*'</code> will listen to all events emitted by the event emitter.
     *
     * @param name {String} The name of the event to listen to.
     * @param listener {Function} The function execute on {@link #emit}.
     * @param ctx {var?Window} The context of the listener.
     * @return {Integer} An unique <code>id</code> for the attached listener.
     */
    once : function(name, listener, ctx) {
      this.$$lastListenerId = qx.event.Emitter.__storageId++;
      this.__getStorage(name)[this.$$lastListenerId] = {
        name: name,
        listener: listener,
        ctx: ctx,
        once: true,
        id: this.$$lastListenerId
      };
      return this.$$lastListenerId;
    },


    /**
     * Remove a listener from the event emitter. The given <code>name</code>
     * will define the type of event.
     *
     * @param name {String} The name of the event to listen to.
     * @param listener {Function} The function execute on {@link #emit}.
     * @param ctx {var?Window} The context of the listener.
     * @return {Integer|null} The listener's id if it was removed or
     * <code>null</code> if it wasn't found
     */
    off : function(name, listener, ctx) {
      var storage = this.__getStorage(name);
      var foundId;
      for (var i = storage.length - 1; i >= 0; i--) {
        storage.forEach(function(entry) {
          if (entry.listener == listener && entry.ctx == ctx) {
            storage.splice(i, 1);
            var foundID = entry.id;
            return;
          }
        });
      }
      return foundId === undefined ? null : foundId;
    },


    /**
     * Removes the listener identified by the given <code>id</code>. The id
     * will be return on attaching the listener and can be stored for removing.
     *
     * @param id {Integer} The id of the listener.
     * @return {Map|null} The listener's id if it was removed or
     * <code>null</code> if it wasn't found
     */
    offById : function(id) {
      var entry = this.getEntryById(id);
      if (entry) {
        this.off(entry.name, entry.listener, entry.ctx);
        return entry.id;
      }
      return null;
    },


    /**
     * Returns the id of the last added listener.
     * @return {Number} The last added id.
     */
    getListenerId : function() {
      return this.$$lastListenerId;
    },


    /**
     * Emits an event with the given name. The data will be passed
     * to the listener.
     * @param name {String} The name of the event to emit.
     * @param data {var?undefined} The data which should be passed to the listener.
     */
    emit : function(name, data) {
      var storage = this.__getStorage(name);
      storage.forEach(function(entry) {
        entry.listener.call(entry.ctx, data);
        if (entry.once) {
          storage.splice(storage.indexOf(entry), 1);
        }
      });

      // call on any
      storage = this.__getStorage("*");
      storage.forEach(function(entry) {
        entry.listener.call(entry.ctx, data);
      });
    },



    /**
     * Returns the internal attached listener.
     * @internal
     * @return {Map} A map which has the event name as key. The values are
     *   arrays containing a map with 'listener' and 'ctx'.
     */
    getListeners : function() {
      return this.__listener;
    },


    /**
     * Returns the data entry for a given event id. If the entry could
     * not be found, undefined will be returned.
     * @internal
     * @param id {Number} The listeners id
     * @return {Map|undefined} The data entry if found
     */
    getEntryById : function(id) {
      for (var name in this.__listener) {
        var store = this.__listener[name];
        var found;
        store.forEach(function(entry) {
          if (entry.id === id) {
            found = entry;
            return; // break forEach
          }
        });
        if (found) {
          return found;
        }
      }
    },


    /**
     * Internal helper which will return the storage for the given name.
     * @param name {String} The name of the event.
     * @return {Array} An array which is the storage for the listener and
     *   the given event name.
     */
    __getStorage : function(name) {
      if (this.__listener == null) {
        this.__listener = {};
      }
      if (this.__listener[name] == null) {
        this.__listener[name] = [];
      }
      return this.__listener[name];
    }
  }
});
