describe('Dataset', function() {

  beforeEach(function() {
    globalSetup.call(this);
    this.__element = q.create("<div id='testEl'></div>");
    this.__element.appendTo(sandbox[0]);
  });


  afterEach(function() {
    globalTeardown();
  });


  it("SetDataAttribute", function() {

    this.__element.setData("type", "domelement");
    this.__element.setData("option", "test");

    var datatype = this.__element.getAttribute("data-type");
    var dataoption = this.__element.getAttribute("data-option");

    assert.equal(datatype, "domelement");
    assert.equal(dataoption, "test");

    //must be ignored:
    q(document).setData("foo", "bar");
    assert.isNull(q(document).getAttribute("data-foo"));
    q(window).setData("foo", "bar");
    assert.isNull(q(window).getAttribute("data-foo"));
  });


  it("SetDataAttributeHyphenated", function() {

    this.__element.setData("hyphenated-data-attribute", "hyphenated");

    var hyphenatedExpected = this.__element.getAttribute("data-hyphenated-data-attribute");
    var hyphenatedFound = this.__element.getData("hyphenatedDataAttribute");

    assert.equal(hyphenatedExpected, hyphenatedFound);
  });


  it("GetDataAttribute", function() {

    this.__element.setData("type", "domelement");
    this.__element.setData("option", "test");

    var expected = this.__element.getAttribute("data-type");
    var found = this.__element.getData("type");

    assert.equal(expected, found);

    var expected2 = this.__element.getAttribute("data-option");
    var found2 = q("#testEl").getData("option");

    assert.equal(expected2, found2);
  });


  it("GetAllData", function() {

    this.__element.setData("type", "domelement");
    this.__element.setData("option", "test");
    this.__element.setData("hyphenated-data-attribute", "hyphenated");

    var expected = q("#testEl").getAllData();

    var datatype = "domelement";
    var dataoption = "test";
    var dataHyphenated = "hyphenated";


    assert.equal(expected.type, datatype);
    assert.equal(expected.option, dataoption);
    assert.equal(expected.hyphenatedDataAttribute, dataHyphenated);
  });


  it("RemoveData", function() {
    this.__element.setData("hyphenated-data-attribute", "hyphenated");
    q("#testEl").removeData("hyphenatedDataAttribute");
    var found = q("#testEl").getData("hyphenatedDataAttribute");
    assert.isNull(this.__element.getAttribute("data-hyphenated-data-attribute"));

    //must be ignored:
    q(window).removeData("fooBar");
    q(document).removeData("fooBar");
  });


  it("HasData", function() {
   assert.isFalse(this.__element.hasData());
   this.__element.setData("type", "test");
   assert.isTrue(this.__element.hasData());
   this.__element.removeData("type");
   assert.isFalse(this.__element.hasData());
  });
});