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
  * Fabian Jakobs (fjakobs)

************************************************************************ */

/* ************************************************************************


************************************************************************ */
/**
 * @ignore(qx.test.PART_FILES)
 *
 * @asset(qx/test/*)
 */

describe("io.part.Package", function() {

  var __dummyLoader = null;


  beforeEach(function() {
    qx.test.PART_FILES = [];
    this.__dummyLoader = new qx.test.io.part.MockLoader();
  });


  function createPackage(urls, hash, loaded) {
    return new qx.io.part.Package(urls, hash, loaded);
  }


  it("load a package with one JS file", function() {
    var urls = [
      this.getUrl("qx/test/part/file1.js")
    ]
    var pkg = this.createPackage(urls, "1", false);
    assert.equal("initialized", pkg.getReadyState());

    pkg.load(function() {
      this.resume(function() {
        assert.equal("complete", pkg.getReadyState());
        assert.equal("file1", qx.test.PART_FILES[0]);
      }, this)
    }, this);

    assert.equal("loading", pkg.getReadyState());

    this.wait();
  });


  it("load several files", function() {
    var urls = [
      this.getUrl("qx/test/part/file1.js"),
      this.getUrl("qx/test/part/file2.js"),
      this.getUrl("qx/test/part/file3.js")
    ];

    var pkg = this.createPackage(urls, "1", false);
    pkg.load(function() {
      this.resume(function() {
        this.assertJsonEquals(
          ["file1", "file2", "file3"],
          qx.test.PART_FILES
        );
      }, this)
    }, this);

    this.wait();
  });


  it("delay the first file - test load order", function() {
    if (this.isLocal()) {
      this.needsPHPWarning();
      return;
    }

    var urls = [
      this.getUrl("qx/test/part/delay.php") + "?sleep=0.3",
      this.getUrl("qx/test/part/file2.js"),
      this.getUrl("qx/test/part/file3.js")
    ];

    var pkg = this.createPackage(urls, "1", false);
    pkg.load(function() {
      this.resume(function() {
        this.assertJsonEquals(
          ["file1", "file2", "file3"],
          qx.test.PART_FILES
        );
      }, this)
    }, this);

    this.wait();
  });


  it("if one of the files fails to load, no load event should be fired", function() {
    if (this.isLocal()) {
      this.needsPHPWarning();
      return;
    }

    // test don't work in IE and Safari 3
    if (qx.core.Environment.get("engine.name") == "mshtml") {
      return;
    }

    var urls = [
      this.getUrl("qx/test/part/file1.js"),
      this.getUrl("qx/test/xmlhttp/404.php"),
      this.getUrl("qx/test/part/file3.js")
    ];

    var pkg = this.createPackage(urls, "1", false);
    pkg.load(function() {
      this.resume(function() {
        assert.equal("error", pkg.getReadyState());
      }, this)
    }, this);

    this.wait();
  });


  it("loading a closure package with load() should execute the closure", function() {
    var urls = [
      this.getUrl("qx/test/part/file1-closure.js")
    ];

    var pkg = this.createPackage(urls, "p1", false);

    var loader = new qx.Part(this.__dummyLoader);
    qx.Part.$$instance = loader;

    loader.addToPackage(pkg);


    pkg.load(function() {
      this.resume(function() {
        this.assertJsonEquals(
          ["file1-closure"],
          qx.test.PART_FILES
        );
      }, this)
    }, this);

    this.wait();
  });


  it("loading a closure package with loadClosure() should not execute the closure", function() {
    var urls = [
      this.getUrl("qx/test/part/file1-closure.js")
    ];

    var pkg = this.createPackage(urls, "p1", false);

    var loader = new qx.Part(this.__dummyLoader);
    qx.Part.$$instance = loader;

    loader.addToPackage(pkg);


    pkg.loadClosure(function() {
      this.resume(function() {
        assert.equal("cached", pkg.getReadyState());
        this.assertJsonEquals([], qx.test.PART_FILES);

        pkg.execute();
        this.assertJsonEquals(
          ["file1-closure"],
          qx.test.PART_FILES
        );
      }, this)
    }, this);

    this.wait();
  });


  it("loading a non existing file with loadClosure() should timeout", function() {
    var pkg = this.createPackage(["___foo.js"], "p1", false);

    var loader = new qx.Part(this.__dummyLoader);
    qx.Part.$$instance = loader;

    loader.addToPackage(pkg);

    var oldTimeout = qx.Part.TIMEOUT;
    qx.Part.TIMEOUT = 300;

    pkg.loadClosure(function() {
      this.resume(function() {
        assert.equal("error", pkg.getReadyState());
        this.assertJsonEquals([], qx.test.PART_FILES);
      }, this)
    }, this);

    qx.Part.TIMEOUT = oldTimeout;

    this.wait();
  });
});
