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
     * Gabriel Munteanu (gabios)

************************************************************************ */

describe("bom.Dataset", function ()
{
  
  beforeEach (function () 
  {
    var div = document.createElement("div");
    div.id = "el";

    _el = div;
    document.body.appendChild(div);
  });


  afterEach (function ()  {
    document.body.removeChild(_el);
  });

 it("SetAttribute", function() {
      var Dataset = qx.bom.element.Dataset;

      Dataset.set(_el, "maxAge", "100");
      assert.equal("100", Dataset.get(_el,"maxAge"));
      assert.equal("100", _el.getAttribute("data-max-age"));

  });
 
  it("SetAttributeWithUndefinedValue", function() {
      var Dataset = qx.bom.element.Dataset;

      Dataset.set(_el, "age", undefined);
      assert.isNull(_el.getAttribute("data-age"));
      assert.isUndefined(Dataset.get(_el, "age", undefined));

      Dataset.set(_el, "age2", null);
      assert.isNull(_el.getAttribute("data-age2"));
      assert.isUndefined(Dataset.get(_el, "age2", null));
  });
 
  it("GetAttribute", function() {
      var Dataset = qx.bom.element.Dataset;

      assert.isUndefined(Dataset.get(_el, "salary"));

      _el.setAttribute("data-salary", "20");
      assert.equal("20", Dataset.get(_el, "salary"));
  });
 
  it("RemoveAttribute", function() {
      var Dataset = qx.bom.element.Dataset;

      Dataset.set(_el, "age", "44");
      Dataset.remove(_el, "age");
      assert.isNull(_el.getAttribute("age"));
      assert.isUndefined(Dataset.get(_el, "age"));
    
  });
});