addSample("Function.bind", {
  javascript: function () {
    qx.lang.Function.bind(myFunction, [self, [varargs]]);

    function myFunction() {
      this.setStyle('color', 'red');
      // note that 'this' here refers to myFunction, not an element
      // we'll need to bind this function to the element we want to alter
    }

    var myBoundFunction = qx.lang.Function.bind(myFunction, myElement);
    myBoundFunction(); // this will make the element myElement red.
  }
});

addSample("Function.create", {
  javascript: function () {
    var createdFunction = qx.lang.Function.create(myFunction, [options]);
  }
});

addSample("Function.listener", {
  javascript: function () {
    qx.lang.Function.listener(myFunction, [self, [varargs]]);
  }
});

addSample("Function.attempt", {
  javascript: function () {
    var myObject = {
      'cow': 'moo!'
    };

    var myFunction = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (!this[arguments[i]]) throw('doh!');
      }
    };

    var result = qx.lang.Function.attempt(myFunction, myObject, 'pig', 'cow'); // false
  }
});

addSample("Function.curry", {
  javascript: function () {
    qx.lang.Function.curry(myFunction, [varargs]);

    function myFunction(elem) {
      elem.setStyle('color', 'red');
    }

    var myBoundFunction = qx.lang.Function.curry(myFunction, myElement);
    myBoundFunction(); // this will make the element myElement red.
  }
});

addSample("Function.delay", {
  javascript: function () {
    var timeoutID = qx.lang.Function.delay(myFunction, [delay, [self, [varargs]]]);

    var myFunction = function () {
      alert('moo! Element id is: ' + this.id);
    };
    //wait 50 milliseconds, then call myFunction and bind myElement to it
    qx.lang.Function.delay(myFunction, 50, myElement); // alerts: 'moo! Element id is: ... '

    // An anonymous function, example
    qx.lang.Function.delay(function () {
      alert('one second later...');
    }, 1000); //wait a second and alert
  }
});


addSample("Function.periodical", {
  javascript: function () {
    var Site = {counter: 0};
    var addCount = function () {
      this.counter++;
    };
    qx.lang.Function.periodical(addCount, 1000, Site); // will add the number of seconds at the Site
  }
});

