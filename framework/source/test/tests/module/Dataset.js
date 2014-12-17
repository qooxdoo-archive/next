describe('Dataset', function() {


  it("SetDataAttribute", function() {

    sandbox.setData("type", "domelement");
    sandbox.setData("option", "test");

    var datatype = sandbox.getAttribute("data-type");
    var dataoption = sandbox.getAttribute("data-option");

    assert.equal(datatype, "domelement");
    assert.equal(dataoption, "test");

    //must be ignored:
    q(document).setData("foo", "bar");
    assert.isNull(q(document).getAttribute("data-foo"));
    q(window).setData("foo", "bar");
    assert.isNull(q(window).getAttribute("data-foo"));
  });


  it("SetDataAttributeHyphenated", function() {

    sandbox.setData("hyphenated-data-attribute", "hyphenated");

    var hyphenatedExpected = sandbox.getAttribute("data-hyphenated-data-attribute");
    var hyphenatedFound = sandbox.getData("hyphenatedDataAttribute");

    assert.equal(hyphenatedExpected, hyphenatedFound);
  });


  it("GetDataAttribute", function() {
    sandbox.setData("type", "domelement");
    sandbox.setData("option", "test");

    var expected = sandbox.getAttribute("data-type");
    var found = sandbox.getData("type");

    assert.equal(expected, found);

    var expected2 = sandbox.getAttribute("data-option");
    var found2 = q("#sandbox").getData("option");

    assert.equal(expected2, found2);
  });


  it("GetAllData", function() {

    sandbox.setData("type", "domelement");
    sandbox.setData("option", "test");
    sandbox.setData("hyphenated-data-attribute", "hyphenated");

    var expected = q("#sandbox").getAllData();

    var datatype = "domelement";
    var dataoption = "test";
    var dataHyphenated = "hyphenated";


    assert.equal(expected.type, datatype);
    assert.equal(expected.option, dataoption);
    assert.equal(expected.hyphenatedDataAttribute, dataHyphenated);
  });


  it("RemoveData", function() {
    sandbox.setData("hyphenated-data-attribute", "hyphenated");
    q("#sandbox").removeData("hyphenatedDataAttribute");
    var found = q("#sandbox").getData("hyphenatedDataAttribute");
    assert.isNull(sandbox.getAttribute("data-hyphenated-data-attribute"));

    //must be ignored:
    q(window).removeData("fooBar");
    q(document).removeData("fooBar");
  });


  it("testRemoveDataOnCollection", function() {
    var firstElement = qxWeb.create("<div></div>").appendTo(sandbox);
    var secondElement = firstElement.clone().appendTo(sandbox);

    var collection = sandbox.getChildren();

    collection.setData("option", "test");
    collection.removeData("option");

    assert.isNull(firstElement.getAttribute('data-option'));
    assert.isNull(secondElement.getAttribute('data-option'));
  }),


  it("HasData", function() {
    var div = q.create("<div>").appendTo(sandbox);
    assert.isFalse(div.hasData());
    div.setData("type", "test");
    assert.isTrue(div.hasData());
    div.removeData("type");
    assert.isFalse(div.hasData());
  });
});