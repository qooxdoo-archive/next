'use strict';

module.exports = {
  rules: {
    'no-refs-in-members': require('./lib/rules/no-refs-in-members'),
    'no-illegal-private-usage': require('./lib/rules/no-illegal-private-usage'),
  },
  rulesConfig: {
    'no-refs-in-members': 2,
    'no-illegal-private-usage': 2,
  }
};
