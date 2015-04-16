/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2015 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tobias Oberrauch (toberrauch)

************************************************************************ */
describe("data.MBinding", function () {

  this.textFieldOne;
  this.textFieldTwo;
  
  this.TextField;

  beforeEach(function() {
    // create the widgets
    this.TextField = qx.Class.define(null, {
      extend: Object,
      include: [qx.event.MEmitter, qx.data.MBinding],
      properties: {
        foo: {
          check: "String",
          event: true,
          init: "asd"
        }
      }
    });
    
    this.textFieldOne = new this.TextField();
    this.textFieldTwo = new this.TextField();
  });
  
  afterEach(function () {
    delete this.TextField;
    delete this.textFieldOne;
    delete this.textFieldTwo;
  });

  it("Bind, get and remove binding", function () {
    var binding = this.textFieldOne.bind("foo", this.textFieldTwo, "foo");
    this.textFieldOne.foo = "affe";
    assert.equal("affe", this.textFieldTwo.foo, "String binding does not work!");
    for (var i = 0; i < binding.sources.length; i++) {
      assert.instanceOf(binding.sources[i], this.TextField);
    }
    assert.equal(1, this.textFieldOne.getBindings().length);
    this.textFieldOne.removeBinding(binding);
    assert.equal(0, this.textFieldOne.getBindings().length);
  });
  
  it("Remove related bindings", function () {
    var binding = this.textFieldOne.bind("foo", this.textFieldTwo, "foo");
    assert.equal(1, this.textFieldOne.getBindings().length);
    this.textFieldOne.removeRelatedBindings(this.textFieldTwo);
    assert.equal(0, this.textFieldOne.getBindings().length);
    
  });
  
  it("Remove all bindings", function () {
    var textFieldThree = new this.TextField();
    
    var binding = this.textFieldOne.bind("foo", this.textFieldTwo, "foo");
    var binding = this.textFieldOne.bind("foo", textFieldThree, "foo");
    assert.equal(2, this.textFieldOne.getBindings().length);
    this.textFieldOne.removeAllBindings();
    assert.equal(0, this.textFieldOne.getBindings().length);
    
  });
});