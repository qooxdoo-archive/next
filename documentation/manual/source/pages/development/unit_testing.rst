
Unit Testing
**************

For the next unit tests we would avoid maintainance of an own test runner and framework. Therefore it was essential to refer to an external test framework. The test framework `mocha <http://mochajs.org/>`_ is versatile and provides expandability and asynchronous testing in all current desktop and mobile browsers. To get a sufficient number of assertions we decided to make use of `chai <http://chaijs.com//>`_ library.

How to run the tests
======================

You can find the next test structure on ``framework/source/test``

To run the tests for the first time, install the required node modules in the test directory. Create a ``index.html`` file by command ``grunt html``

Now the tests can be executed on your desired browser.

Find the number of passed and failed tests as well as the duration and the progress of running tests in the right corner. Click on a test suite or test case to run a test separately.







