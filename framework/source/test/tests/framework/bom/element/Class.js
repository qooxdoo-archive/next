/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

describe("bom.element.Class", function ()
{

    beforeEach (function () 
    {
      var div = document.createElement("div");
      div.id = "el";

      _el = div;
      document.body.appendChild(div);
    });


    afterEach (function () 
    {
      document.body.removeChild(_el);
      _el = null;
    });


    
 
 it("get should return the className for svg element", function() {
      if(document.createElementNS){
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id','svgEl');
        svg.setAttribute('class','svgclassname');
        document.body.appendChild(svg);
        var Class = qx.bom.element.Class;
        assert.equal("svgclassname", Class.get(svg));
        document.body.removeChild(svg);
      }
    });

 it("get on new element should return empty string", function() {
      var Class = qx.bom.element.Class;
      assert.equal("", Class.get(_el));
  });

  it("get should return the className", function() {
      var Class = qx.bom.element.Class;
      _el.className = "juhu kinners";
      assert.equal("juhu kinners", Class.get(_el));
  });

  it("add() on new element should set the class name", function() {
      var Class = qx.bom.element.Class;
      assert.equal("juhu", Class.add(_el, "juhu"));
      assert.equal("juhu", Class.get(_el));
  });

  it("add() on element with class should not set it again", function() {
      var Class = qx.bom.element.Class;
      Class.add(_el, "juhu");
      Class.add(_el, "juhu");
      assert.equal("juhu", Class.get(_el));
  });

  it("addClasses() on new element should set multiple classes", function() {
      var Class = qx.bom.element.Class;
      assert.equal("juhu kinners", Class.addClasses(_el, ["juhu", "kinners"]));
      assert.equal("juhu kinners", Class.get(_el));
  });

  it("addClasses() should ignore class names, which are already set", function() {
      var Class = qx.bom.element.Class;
      Class.addClasses(_el, ["juhu", "kinners"]);
      Class.addClasses(_el, ["juhu"]);
      Class.addClasses(_el, ["kinners"]);
      assert.equal("juhu kinners", Class.get(_el));
  });

  it("has()", function() {
      var Class = qx.bom.element.Class;

      assert.isFalse(Class.has(_el, "juhu"));

      Class.addClasses(_el, ["juhu", "kinners"]);
      assert.isTrue(Class.has(_el, "juhu"));
      assert.isTrue(Class.has(_el, "kinners"));
      assert.isFalse(Class.has(_el, "foo"));
  });

  it("remove() non existing class should be ignored", function() {
      var Class = qx.bom.element.Class;
      assert.equal("", Class.get(_el));
      assert.equal("juhu", Class.remove(_el, "juhu"));
      assert.equal("", Class.get(_el));
  });

  it("remove() existing classes", function() {
      var Class = qx.bom.element.Class;
      Class.addClasses(_el, ["juhu", "kinners"]);
      assert.equal("juhu", Class.remove(_el, "juhu"));
      assert.match(Class.get(_el), /\s*kinners\s*/);
      assert.equal("kinners", Class.remove(_el, "kinners"));
      assert.equal("", Class.get(_el));
  });

  it("removeClasses() to remove several classes at once", function() {
      var Class = qx.bom.element.Class;
      Class.addClasses(_el, ["a", "juhu", "b", "kinners", "c"]);
      assert.equal("a b c", Class.removeClasses(_el, ["kinners", "juhu"]));
      assert.equal("a b c", Class.get(_el));
  });

  it("replace()", function() {
      var Class = qx.bom.element.Class;
      Class.addClasses(_el, ["juhu", "kinners"]);
      assert.equal("foo", Class.replace(_el, "juhu", "foo"));
      assert.isFalse(Class.has(_el, "juhu"));
      assert.isTrue(Class.has(_el, "foo"));
      assert.isTrue(Class.has(_el, "kinners"));

      assert.equal("bar", Class.replace(_el, "kinners", "bar"));
      assert.isFalse(Class.has(_el, "juhu"));
      assert.isFalse(Class.has(_el, "kinners"));
      assert.isTrue(Class.has(_el, "foo"));
      assert.isTrue(Class.has(_el, "bar"));

      assert.equal("", Class.replace(_el, "i-dont-exist", "baz"));
      assert.isFalse(Class.has(_el, "juhu"));
      assert.isFalse(Class.has(_el, "kinners"));
      assert.isTrue(Class.has(_el, "foo"));
      assert.isTrue(Class.has(_el, "bar"));
      assert.isFalse(Class.has(_el, "baz"));
  });

  it("toggle() non existing class should add it", function() {
      var Class = qx.bom.element.Class;
      assert.equal("juhu", Class.toggle(_el, "juhu"));
      assert.equal("juhu", Class.get(_el));
  });

  it("toggle() existing class name should remove it", function() {
      var Class = qx.bom.element.Class;
      Class.addClasses(_el, ["juhu", "kinners"]);
      assert.equal("juhu", Class.toggle(_el, "juhu"));
      assert.match(Class.get(_el), /\s*kinners\s*/);
    
  });
});
