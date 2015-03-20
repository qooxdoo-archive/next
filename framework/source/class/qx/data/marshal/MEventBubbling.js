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
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * Mixin used for the bubbling events. If you want to use this in your own model
 * classes, be sure that every property will call the
 * {@link #_applyEventPropagation} function on every change.
 */
qx.Mixin.define("qx.data.marshal.MEventBubbling",
{

  statics : {
    __eventBubblingHash : 0
  },


  events :
  {
    /**
     * The change event which will be fired on every change in the model no
     * matter what property changes. This event bubbles so the root model will
     * fire a change event on every change of its children properties too.
     *
     * Note that properties are required to call
     * {@link #_applyEventPropagation} on apply for changes to be tracked as
     * desired. It is already taken care of that properties created with the
     * {@link qx.data.marshal.Json} marshaler call this method.
     *
     * The data will contain a map with the following three keys
     *   <li>value: The new value of the property</li>
     *   <li>old: The old value of the property.</li>
     *   <li>name: The name of the property changed including its parent
     *     properties separated by dots.</li>
     *   <li>item: The item which has the changed property.</li>
     * Due to that, the <code>getOldData</code> method will always return null
     * because the old data is contained in the map.
     */
    "changeBubble": "qx.event.type.Data"
  },


  members :
  {
    /**
     * Apply function for every property created with the
     * {@link qx.data.marshal.Json} marshaler. It fires and
     * {@link #changeBubble} event on every change. It also adds the chaining
     * listener if possible which is necessary for the bubbling of the events.
     *
     * @param value {var} The new value of the property.
     * @param old {var} The old value of the property.
     * @param name {String} The name of the changed property.
     */
    _applyEventPropagation : function(value, old, name)
    {
      this.emit("changeBubble", {
        value: value, name: name + "", old: old, item: this, target: this
      });

      this._registerEventChaining(value, old, name);
    },


    /**
     * Registers for the given parameters the changeBubble listener, if
     * possible. It also removes the old listener, if an old item with
     * a changeBubble event is given.
     *
     * @param value {var} The new value of the property.
     * @param old {var} The old value of the property.
     * @param name {String} The name of the changed property.
     */
    _registerEventChaining : function(value, old, name)
    {
      // assign a new hash if not already available
      if (this.$$eventBubblingHash === undefined) {
        this.$$eventBubblingHash = qx.data.marshal.MEventBubbling.__eventBubblingHash++;
      }
      var listeners;
      // if an old value is given, remove the old listener if possible
      if (old != null && old["$$idBubble-" + this.$$eventBubblingHash] != null) {
        listeners = old["$$idBubble-" + this.$$eventBubblingHash];
        for (var i = 0; i < listeners.length; i++) {
          old.offById(listeners[i]);
        }
        delete old["$$idBubble-" + this.$$eventBubblingHash];
      }

      // if the child supports chaining
      if (value && qx.Mixin.getClassByMixin(value.constructor, qx.data.marshal.MEventBubbling)) {
        // create the listener
        var listener = this.__changePropertyListener.bind(this, name);
        // add the listener
        value.on("changeBubble", listener, this);
        var id = value.getListenerId();
        listeners = value["$$idBubble-" + this.$$eventBubblingHash];
        if (listeners == null) {
          listeners = [];
          value["$$idBubble-" + this.$$eventBubblingHash] = listeners;
        }
        listeners.push(id);
      }
    },


    /**
     * Listener responsible for formatting the name and firing the change event
     * for the changed property.
     *
     * @param name {String} The name of the former properties.
     * @param e {qx.event.type.Data} The date event fired by the property
     *   change.
     */
    __changePropertyListener : function(name, data)
    {
      var value = data.value;
      var old = data.old;
      var newName;

      // if the target is an array
      if (qx.Interface.classImplements(data.target.constructor, qx.data.IListData)) {
        var index;
        var rest;

        if (data.name.indexOf) {
          var dotIndex = data.name.indexOf(".") != -1 ? data.name.indexOf(".") : data.name.length;
          var bracketIndex = data.name.indexOf("[") != -1 ? data.name.indexOf("[") : data.name.length;
          // braktes in the first spot is ok [BUG #5985]
          if (bracketIndex == 0) {
            newName = name + data.name;
          } else if (dotIndex < bracketIndex) {
            index = data.name.substring(0, dotIndex);
            rest = data.name.substring(dotIndex + 1, data.name.length);
            if (rest[0] != "[") {
              rest = "." + rest;
            }
            newName = name + "[" + index + "]" + rest;
          } else if (bracketIndex < dotIndex) {
            index = data.name.substring(0, bracketIndex);
            rest = data.name.substring(bracketIndex, data.name.length);
            newName = name + "[" + index + "]" + rest;
          } else {
            newName = name + "[" + data.name + "]";
          }
        } else {
          newName = name + "[" + data.name + "]";
        }

      // if the target is not an array
      } else {
        // special case for array as first element of the chain [BUG #5985]
        if (parseInt(name) == name && name !== "") {
          name = "[" + name + "]";
        }
        newName = name + "." + data.name;
      }

      this.emit(
        "changeBubble",
        {
          value: value,
          name: newName,
          old: old,
          item: data.item || data.target,
          target: this
        }
      );
    }
  }
});
