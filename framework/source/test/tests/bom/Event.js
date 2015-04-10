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
      "mouseout"
    ];

    var el;
    for (var i = 0, j = eventsToCheck.length; i < j; i++) {
      el = qx.dom.Element.create("div", {
        name: "vanillebaer"
      }, window);
      assert.isTrue(qx.bom.Event.supportsEvent(el, eventsToCheck[i]), "Failed to check support for '" + eventsToCheck[i] + "'");
    }

    var el2 = qx.dom.Element.create("div", {
      name: "schokobaer"
    }, window);
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
        el = qx.dom.Element.create("div", {
          name: "vanillebaer"
        }, window);
        assert.isTrue(qx.bom.Event.supportsEvent(el, pointerEventsToCheck[i]), "Failed to check support for '" + pointerEventsToCheck[i] + "'");
      }
    }
  });


  it("SafariMobile", function() {
    var el = qx.dom.Element.create("audio");

    var supportedEvents = [
      'loadeddata', 'progress', 'timeupdate', 'seeked', 'canplay', 'play',
      'playing', 'pause', 'loadedmetadata', 'ended', 'volumechange'
    ];

    for (var i = 0, l = supportedEvents.length; i < l; i++) {
      assert.isTrue(qx.bom.Event.supportsEvent(el, supportedEvents[i]), "Failed to check support for '" + supportedEvents[i] + "'");
    }
  });


  it("GetEventName", function() {
    var eventsToCheck = ["click",
      "mousedown",
      "mousemove",
      "mouseup",
      "mouseout"
    ];

    for (i = 0, j = eventsToCheck.length; i < j; i++) {
      el = qx.dom.Element.create("div", {
        name: "vanillebaer"
      }, window);
      assert.equal(qx.bom.Event.getEventName(el, eventsToCheck[i]), eventsToCheck[i]);
    }
  });


  it("getRelatedTarget", function() {
    var fakeEvent = {
      relatedTarget: "fakeHtmlElem"
    };
    assert.equal("fakeHtmlElem", qx.bom.Event.getRelatedTarget(fakeEvent));
  });

});
