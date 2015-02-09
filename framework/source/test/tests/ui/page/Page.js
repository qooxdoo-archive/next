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

************************************************************************ */


describe("ui.page.Page", function() {

  it("Lifecycle", function() {
    var initializedEvent = false;
    var startEvent = false;

    var page = new qx.ui.page.Page();
    sandbox.append(page);

    page.on("initialize", function() {
      assert.isFalse(startEvent);
      initializedEvent = true;
    }, this);

    page.on("start", function() {
      assert.isTrue(initializedEvent);
      startEvent = true;
    }, this);

    page.show();

    assert.isTrue(initializedEvent);
    assert.isTrue(startEvent);
    page.dispose();
  });

  it("Back", function() {
    var page = new qx.ui.page.Page();
    sandbox.append(page);

    var eventFired = false;

    page.on("back", function() {
      eventFired = true;
    }, this);
    page.back();

    assert.isTrue(eventFired);

    page.dispose();
  });

  it("Menu", function() {
    var page = new qx.ui.page.Page();
    sandbox.append(page);

    var eventFired = false;

    page.on("menu", function() {
      eventFired = true;
    }, this);
    page.menu();

    assert.isTrue(eventFired);

    page.dispose();
  });


  it("Factory", function() {
    var page = qxWeb.create("<div>").toPage().appendTo(sandbox);
    assert.instanceOf(page, qx.ui.page.Page);
    assert.equal(page, page[0].$$widget);
    assert.equal("qx.ui.page.Page", page.getData("qxWidget"));
  });
});
