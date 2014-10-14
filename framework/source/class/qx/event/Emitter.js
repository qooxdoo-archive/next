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
 * @require(qx.event.MEmitter#on)
 * @require(qx.event.MEmitter#once)
 * @require(qx.event.MEmitter#off)
 * @require(qx.event.MEmitter#offById)
 * @require(qx.event.MEmitter#getListenerId)
 * @require(qx.event.MEmitter#emit)
 * @require(qx.event.MEmitter#hasListener)
 * @require(qx.event.MEmitter#getListeners)
 * @require(qx.event.MEmitter#getEntryById)
 */
qx.Class.define("qx.event.Emitter", {
  extend : Object,
  include : [qx.event.MEmitter]
});
