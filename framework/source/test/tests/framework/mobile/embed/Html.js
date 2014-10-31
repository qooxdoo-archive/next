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
describe("mobile.embed.Html", function() {

  beforeEach(function() {
    setUpRoot();
  });


  afterEach(function() {
    tearDownRoot();
  });


  it("Html", function() {
    var html = new qx.ui.embed.Html("<strong>affe</strong>");
    getRoot().append(html);

    assert.isString(html.html);
    assert.equal(html.html, "<strong>affe</strong>");
    assert.equal(html.html, html.getHtml());

    qx.core.Assert.assertEventFired(html, "changeHtml", function() {
      html.html = "";
    });

    assert.equal(html.html, "");
    assert.isNull(html.getHtml());

    html.dispose();
  });

});
