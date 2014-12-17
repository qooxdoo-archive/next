Here, the deliverables for the qooxdoo component 'qx.Server' are being built.
Generator jobs:

build:
Creates the deliverable librarie(s) in script/. Prereq. for other jobs.

test:
The test job creates a basic testrunner script which depends on the qx-oo
library (expected in the script/ folder).
You therefore have to run 'generate.py build' ahead of running the test scripts.
Then:
  cd test
  node node.js

npm-package-publish:
Publishes the qooxdoo npm module to npmjs.org. Depends on 'npm-package-copy'
having run, and a valid npm user account.
