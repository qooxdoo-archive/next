/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)
     * Tobias Oberrauch (toberrauch) <tobias.oberrauch@1und1.de>

************************************************************************ */

describe("bom.Event", function() {

  it("SupportsEvent", function() {
    var eventsToCheck = ["click",
                         "mousedown",
                         "mousemove",
                         "mouseup",
                         "mouseout"];

    var el;
    for (var i = 0, j = eventsToCheck.length; i < j; i++) {
      el = document.createElement("div");
      el.setAttribute("name", "vanillebaer");
      assert.isTrue(qx.bom.Event.supportsEvent(el, eventsToCheck[i]), "Failed to check support for '" + eventsToCheck[i] + "'");
    }

    var el2 = document.createElement("div");
    el2.setAttribute("name", "schokobaer");
    assert.isFalse(qx.bom.Event.supportsEvent(el2, "click2"));

    if (qx.core.Environment.get("event.mspointer")) {
      var pointerEventsToCheck = ["MSPointerDown",
        "MSPointerUp",
        "MSPointerOut",
        "MSPointerOver",
        "MSPointerCancel",
        "MSPointerMove"
      ];

      for (i = 0, j = pointerEventsToCheck.length; i < j; i++) {
        el = document.createElement("div");
        el.setAttribute("name", "vanillebaer");
        assert.isTrue(qx.bom.Event.supportsEvent(el, pointerEventsToCheck[i]), "Failed to check support for '" + pointerEventsToCheck[i] + "'");
      }
    }
  });


  it("SafariMobile", function() {
    var el = document.createElement("audio");

    var supportedEvents = [
      'loadeddata', 'progress', 'timeupdate', 'seeked', 'canplay', 'play',
      'playing', 'pause', 'loadedmetadata', 'ended', 'volumechange'
    ];

    for (var i = 0, l = supportedEvents.length; i < l; i++) {
      assert.isTrue(qx.bom.Event.supportsEvent(el, supportedEvents[i]), "Failed to check support for '" + supportedEvents[i] + "'");
    }
  });
});
