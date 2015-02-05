
Unit Testing
**************

qooxdoo uses the versatile and extensible `Mocha <http://mochajs.org/>`_ testing framework combined with the `Chai <http://chaijs.com//>`_ assertion library for its unit tests.

How to run the tests
======================

The test files are located in ``framework/source/test``.

Before running the tests for the first time, install the required node modules by running ``npm install``.

The task ``grunt build`` is used to generate an optimized, minified version of the framework classes that the tests will run against. Alternatively, ``grunt source`` will generate an unoptimized version for test development and debugging.

Finally, run the ``grunt html`` task to generate both the ``index.html`` file that loads the tests and the optimized framework dependencies and the ``index-source.html`` file for the development version.

The tests can now be executed by loading one of the index files in any browser. Note that some tests, particularly in the ``io`` namespace, might not run correctly when served from the file system.
