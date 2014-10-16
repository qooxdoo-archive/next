/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
describe("bom.Template", function ()
{

  var __tmpl = null;

  afterEach (function ()  {
    if (__tmpl) {
      qx.dom.Element.removeChild(__tmpl, document.body);
    }
  });

    /**
     * render()
     */
 
 it("Replace", function() {
      var template = "{{name}} xyz";
      var view = {name: "abc"};
      var result = qx.bom.Template.render(template, view);
      var expected = "abc xyz";

      assert.equal(expected, result);
  });
 
  it("Function", function() {
      var template = "{{name}} xyz";
      var view = {name: function() {return "abc"}};
      var result = qx.bom.Template.render(template, view);
      var expected = "abc xyz";

      assert.equal(expected, result);
  });
 
  it("List", function() {
      var template = "{{#l}}{{.}}{{/l}}";
      var view = {l : ["a", "b", "c"]};
      var result = qx.bom.Template.render(template, view);
      var expected = "abc";

      assert.equal(expected, result);
  });


  function conditional () {
    var template = "{{#b}}yo{{/b}}";
    var view = {b: true};
    var result = qx.bom.Template.render(template, view);
    var expected = "yo";

    assert.equal(expected, result);

    template = "{{#b}}yo{{/b}}";
    view = {b: false};
    result = qx.bom.Template.render(template, view);
    expected = "";

    assert.equal(expected, result);
  }
 
  it("Object", function() {
      var template = "{{#o}}{{b}}{{a}}{{/o}}";
      var view = {o: {a: 1, b: 2}};
      var result = qx.bom.Template.render(template, view);
      var expected = "21";

      assert.equal(expected, result);
  });
 
  it("Wrapper", function() {
      var template = "{{#b}}yo{{/b}}";
      var view = {
        b: function() {
          return function(text, render) {
            return "!" + render(text) + "!";
          };
        }
      };
      var result = qx.bom.Template.render(template, view);
      var expected = "!yo!";

      assert.equal(expected, result);
  });
 
  it("InvertedSelection", function() {
      var template = "{{^a}}yo{{/a}}";
      var view = {a: []};
      var result = qx.bom.Template.render(template, view);
      var expected = "yo";

      assert.equal(expected, result);
  });
 
  it("Escaping", function() {
      var template = "{{a}}";
      var view = {a: "<a>"};
      var result = qx.bom.Template.render(template, view);
      var expected = "&lt;a&gt;";

      assert.equal(expected, result);

      var template = "{{{a}}}";
      var view = {a: "<a>"};
      var result = qx.bom.Template.render(template, view);
      var expected = "<a>";

      assert.equal(expected, result);
  });


    /**
     * renderToNode()
     */
 
  it("RenderToNode", function() {
      var el = qx.bom.Template.renderToNode("<div>{{a}}</div>", {a: 123});

      assert.equal("DIV", el.tagName);
      assert.equal("123", el.innerHTML);
  });
 
  it("RenderToNodePlainText", function() {
      var tmpl = "{{a}}.{{b}}";
      var el = qx.bom.Template.renderToNode(tmpl, {a: 123, b: 234});

      assert.equal("123.234", el.data);
  });
 
  it("RenderToNodeMixed", function() {
      var tmpl = "<div>{{a}}<span>{{b}}</span></div>";
      var el = qx.bom.Template.renderToNode(tmpl, {a: 123, b: 234});

      assert.equal("123<span>234</span>", el.innerHTML.toLowerCase());
  });

    /**
     * _createNodeFromTemplate()
     */
 
  it("CreateNodeFromTemplateTextNode", function() {
      var tmpl = "{{a}}.{{b}}";
      var el = qx.bom.Template._createNodeFromTemplate(tmpl);

      // Node.TEXT_NODE === 3 (IE <= 8 doesn't know 'Node')
      assert.equal(3, el.nodeType);
  });
 
  it("CreateNodeFromTemplateElementNode", function() {
      var tmpl = "<div>{{a}}</div>";
      var el = qx.bom.Template._createNodeFromTemplate(tmpl);

      // Node.ELEMENT_NODE === 1 (IE <= 8 doesn't know 'Node')
      assert.equal(1, el.nodeType);
  });

    /**
     * get()
     */
 
 it("Get", function() {
      // add template
      __tmpl = qx.dom.Element.create("div");
      qx.bom.element.Attribute.set(__tmpl, "id", "qx-test-template");
      qx.bom.element.Style.set(__tmpl, "display", "none");
      __tmpl.innerHTML = "<div>{{a}}</div>";
      qx.dom.Element.insertEnd(__tmpl, document.body);

      // test the get method
      var el = qx.bom.Template.get("qx-test-template", {a: 123});

      assert.equal("DIV", el.tagName);
      assert.equal("123", el.innerHTML);
  });
 
  it("PlainText", function() {
      // add template
      __tmpl = qx.dom.Element.create("div");
      qx.bom.element.Attribute.set(__tmpl, "id", "qx-test-template");
      qx.bom.element.Style.set(__tmpl, "display", "none");
      __tmpl.innerHTML = "{{a}}.{{b}}";
      qx.dom.Element.insertEnd(__tmpl, document.body);

      // test the get method
      var el = qx.bom.Template.get("qx-test-template", {a: 123, b: 234});
      assert.equal("123.234", el.data);
  });
 
  it("GetMixed", function() {
      // add template
      __tmpl = qx.dom.Element.create("div");
      qx.bom.element.Attribute.set(__tmpl, "id", "qx-test-template");
      qx.bom.element.Style.set(__tmpl, "display", "none");
      __tmpl.innerHTML = "<div>{{a}}<span>{{b}}</span></div>";
      qx.dom.Element.insertEnd(__tmpl, document.body);

      // test the get method
      var el = qx.bom.Template.get("qx-test-template", {a: 123, b: 234});

      // IE uses uppercase tag names
      assert.equal("123<span>234</span>", el.innerHTML.toLowerCase());
    
  });
});
