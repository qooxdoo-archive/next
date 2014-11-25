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

/**
 *
 * @asset(framework/source/resource/qx/icon/Tango/48/places/folder.png)
 */

describe("mobile.List", function() {
  /**
   * Returns the img element on the given list, of the element item identified by elementIndex.
   */

  function getImageWidget(list, elementIndex) {
    return list.getChildren().eq(elementIndex).getChildren(".list-item-image");
  }


  /**
   * Returns the title text on the given list, of the element item identified by elementIndex.
   */

  function getTitleElement(list, elementIndex) {
    return list.getChildren()[elementIndex].childNodes[1].childNodes[0];
  }


  /**
   * Returns the subtitle text on the given list, of the element item identified by elementIndex.
   */

  function getSubtitleElement(list, elementIndex) {
    return list.getChildren()[elementIndex].childNodes[1].childNodes[1];
  }


  function __createModel() {
    var data = [];
    data.push({
      title: "1",
      subtitle: "s1",
      image: "framework/source/resource/qx/icon/Tango/48/places/folder.png"
    });
    data.push({
      title: "2",
      subtitle: "s2",
      image: "framework/source/resource/qx/icon/Tango/48/places/folder.png"
    });
    data.push({
      title: "3",
      subtitle: "s3",
      image: "framework/source/resource/qx/icon/Tango/48/places/folder.png"
    });
    data.push({
      title: "4",
      subtitle: "s4",
      image: "framework/source/resource/qx/icon/Tango/48/places/folder.png"
    });
    data.push({
      title: "5",
      subtitle: "s5",
      image: "framework/source/resource/qx/icon/Tango/48/places/folder.png"
    });
    return new qx.data.Array(data);
  }


  function __createList() {
    var list = new qx.ui.List();
    getRoot().append(list);
    list.model = __createModel();
    return list;
  }


  function __configureItemFunction(item, data, row) {
    item.setImage(data.image);
    item.setTitle(data.title);
    item.setSubtitle(data.subtitle);
  }


  function __assertItemsAndModelLength(list, dataLength) {
    var childrenLength = list.getChildren().length;
    assert.equal(dataLength, childrenLength);
  }


  function __cleanUp(list) {
    list.dispose();
    var modelData = list.model;
    if (modelData) {
      modelData.dispose();
      modelData = null;
    }
  }


  beforeEach(function() {
    setUpRoot();
  });


  afterEach(function() {
    tearDownRoot();
  });


  it("Create", function() {
    var list = __createList();
    __assertItemsAndModelLength(list, 5);
    __cleanUp(list);
  });


  it("SetModelNull", function() {
    var list = __createList();
    __assertItemsAndModelLength(list, 5);
    list.model.dispose();
    list.model = null;
    __assertItemsAndModelLength(list, 0);
    __cleanUp(list);
  });


  it("ModelChangeRemove", function() {
    var list = __createList();
    __assertItemsAndModelLength(list, 5);
    list.model.removeAt(0);
    __assertItemsAndModelLength(list, 4);
    __cleanUp(list);
  });


  it("ModelChangeEdit", function() {
    var list = __createList();
    __assertItemsAndModelLength(list, 5);

    list.model.setItem(0, {
      title: "affe",
      subtitle: "1",
      image: "framework/source/resource/qx/icon/Tango/48/places/folder.png"
    });
    __assertItemsAndModelLength(list, 5);

    var titleText = getTitleElement(list, 0).innerHTML;
    assert.equal("affe", titleText);

    __cleanUp(list);
  });


  /** Test Case for [BUG #7267] for different length of edited string value. */

  it("ModelChangeStringLength", function() {
    var list = __createList();

    __assertItemsAndModelLength(list, 5);

    var newImageSrc = "framework/source/resource/qx/icon/Tango/48/places/folder.png";
    var newTitleText = "Giraffe";
    var newSubtitleText = "subtitle1";

    list.model.setItem(0, {
      title: newTitleText,
      subtitle: newSubtitleText,
      image: newImageSrc
    });
    __assertItemsAndModelLength(list, 5);

    var titleText = getTitleElement(list, 0).innerHTML;
    var subtitleText = getSubtitleElement(list, 0).innerHTML;
    var imageSrc = getImageWidget(list, 0).source;

    // VERIFY
    assert.equal(newTitleText, titleText);
    assert.equal(newSubtitleText, subtitleText);
    assert.notEqual("-1", imageSrc.indexOf(newImageSrc));

    __cleanUp(list);
  });


  it("ModelChangeAdd", function() {
    var list = __createList();
    __assertItemsAndModelLength(list, 5);
    list.model.push({
      title: "6",
      subtitle: "6",
      image: "framework/source/resource/qx/icon/Tango/48/places/folder.png"
    });
    __assertItemsAndModelLength(list, 6);
    __cleanUp(list);
  });


  it("ExtractRowsToRender", function() {
    var list = new qx.ui.List();

    assert.deepEqual([0], list._extractRowsToRender("0"));
    assert.deepEqual([0], list._extractRowsToRender("[0].propertyName"));
    assert.deepEqual([0, 1, 2], list._extractRowsToRender("[0-2].propertyName"));
    assert.deepEqual([12, 13, 14], list._extractRowsToRender("[12-14].propertyName"));

    list.dispose();
  });


  it("Factory", function() {
    var list = qxWeb.create("<ul></ul>").toList().appendTo(getRoot());
    assert.instanceOf(list, qx.ui.List);
    assert.equal(list, list[0].$$widget);
    assert.equal("qx.ui.List", list.getData("qxWidget"));
  });


  it("SelectedRow", function() {
    var list = __createList();
    var el = list.find("*[data-row='3']")[0]; // item 3
    var spy = sinon.spy();
    list.on("selected", spy);
    list.emit("tap", {_original : {target: el}});
    sinon.assert.calledOnce(spy);
    assert.equal(spy.args[0][0][0], el);

    __cleanUp(list);
  });


  it("SelectedGroup", function() {
    var list = __createList();
    list.delegate = {group: function(data, row) {
      return {title: "Affe" + row, selectable: true};
    }};

    var el = list.find("*[data-group='3']")[0]; // item 3
    var spy = sinon.spy();
    list.on("selected", spy);
    list.emit("tap", {_original : {target: el}});
    sinon.assert.calledOnce(spy);
    assert.equal(spy.args[0][0][0], el);

    __cleanUp(list);
  });
});
