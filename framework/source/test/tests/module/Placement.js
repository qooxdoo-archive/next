describe("module.Placement", function() {

  beforeEach(function() {
    q("#sandbox").setStyles({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "#AEAEAE"
    });

    q.create('<div id="foo"></div>').setStyles({
      position: "absolute",
      top: "200px",
      left: "0px",
      width: "200px",
      height: "100px",
      backgroundColor: "red"
    }).appendTo(sandbox[0]);

    q.create('<div id="bar"></div>').setStyles({
      position: "relative",
      width: "100px",
      height: "25px",
      backgroundColor: "green"
    }).appendTo(sandbox[0]);
  });


  afterEach(function() {
    q("#sandbox #bar").setStyle("position", "relative");
  });


  it("PlaceToSimple", function() {
    q("#sandbox #bar").placeTo("#sandbox #foo", "right-top");
    var expectedLocation = {
      left: 200,
      top: 200
    };
    assert.equal(expectedLocation.left, q("#bar").getOffset().left);
    assert.equal(expectedLocation.top, q("#bar").getOffset().top);

    q("#sandbox #foo").setStyles({
      position: "relative",
      left: "10px",
      paddingLeft: "10px"
    });

    q("#sandbox #bar").placeTo("#sandbox #foo", "right-top");

    expectedLocation = {
      left: 220,
      top: 200
    };
    assert.equal(expectedLocation.left, q("#bar").getOffset().left);
    assert.equal(expectedLocation.top, q("#bar").getOffset().top);
  });


  it("PlaceToDirect", function() {
    q("#sandbox #bar").placeTo("#sandbox #foo", "right-bottom", {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    }, "direct", "direct");

    var expectedLocation = {
      left: 210,
      top: 265
    };
    assert.equal(expectedLocation.left, q("#bar").getOffset().left);
    assert.equal(expectedLocation.top, q("#bar").getOffset().top);
  });


  it("PlaceToKeepAlign", function() {
    q("#sandbox #bar").placeTo("#sandbox #foo", "left-top", {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    }, "keep-align", "keep-align");
    var expectedLocation = {
      left: 210,
      top: 210
    };
    assert.equal(expectedLocation.left, q("#bar").getOffset().left);
    assert.equal(expectedLocation.top, q("#bar").getOffset().top);
  });


  it("PlaceToUsingHiddenElement", function() {
    q("#sandbox #bar").hide();
    var displayValue = q("#sandbox #bar").getStyle("display");
    var visibilityValue = q("#sandbox #bar").getStyle("visibility");

    q("#sandbox #bar").placeTo("#sandbox #foo", "right-top");
    var expectedLocation = {
      left: 200,
      top: 200
    };
    assert.equal(expectedLocation.left, parseInt(q("#bar").getStyle("left"), 10));
    assert.equal(expectedLocation.top, parseInt(q("#bar").getStyle("top"), 10));
    assert.equal(displayValue, q("#sandbox #bar").getStyle("display"));
    assert.equal(visibilityValue, q("#sandbox #bar").getStyle("visibility"));
  });


  it("PlaceToUsingHiddenElementByCssClass", function() {
    q("#sandbox #bar").addClass("hidden");

    q("#sandbox #bar").placeTo("#sandbox #foo", "right-top");
    var expectedLocation = {
      left: 200,
      top: 200
    };
    assert.equal(expectedLocation.left, parseInt(q("#bar").getStyle("left"), 10));
    assert.equal(expectedLocation.top, parseInt(q("#bar").getStyle("top"), 10));
    assert.equal("", q("#bar")[0].style.display);
  });


  it("PlaceToPreservingStyleValues", function() {
    q("#sandbox #bar").setStyle("visibility", "collapse");
    q("#sandbox #bar").hide();
    var displayValue = q("#sandbox #bar").getStyle("display");
    var visibilityValue = q("#sandbox #bar").getStyle("visibility");

    q("#sandbox #bar").placeTo("#sandbox #foo", "right-top");
    var expectedLocation = {
      left: 200,
      top: 200
    };
    assert.equal(expectedLocation.left, parseInt(q("#bar").getStyle("left"), 10));
    assert.equal(expectedLocation.top, parseInt(q("#bar").getStyle("top"), 10));
    assert.equal(displayValue, q("#sandbox #bar").getStyle("display"));
    assert.equal(visibilityValue, q("#sandbox #bar").getStyle("visibility"));
  });
});
