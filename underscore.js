(function () {

  // Baseline setup
  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
    typeof global == 'object' && global.global === global && global ||
    this || {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function () {};

  // Create a safe reference to the Underscore object for use below.
  var _ = function (obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };
  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.// iteratee(obj[keys[i]], keys[i], obj);
  var optimizeCb = function (func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount) {
      case 1:
        return function (value) {
          return func.call(context, value); // obj.call(this, arg); 객체를 흡수한다.
        };
        // The 2-parameter case has been omitted only because no current consumers
        // made use of it. 
      case null:
      case 3:
        return function (value, index, collection) {
          return func.call(context, value, index, collection);
        };
      case 4:
        return function (accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
    }
    return function () {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each //
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function (value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles. 
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function (value, context) {
    return cb(value, context, Infinity);
  };

  // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
  // This accumulates the arguments passed into an array, after a given index.
  var restArgs = function (func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function () {
      var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0:
          return func.call(this, rest);
        case 1:
          return func.call(this, arguments[0], rest);
        case 2:
          return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function (prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function (key) {
    return function (obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var deepGet = function (obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function (collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  //
  _.each = _.forEach = function (list, iterate, context) {
    if (Array.isArray(list)) {
      for (var i = 0; i < list.length; i++) {
        iterate(list[i], i, list);
      }
    } else {
      for (key in list) {
        iterate(list[key], context);
      }
    }
  };

  //map
  //_.map(list, iteratee, [context]) Alias: collect
  _.map = _.collect = function (list, func) {
    var newArr = [];
    if (Array.isArray(list)) {
      for (var i = 0; i < list.length; i++) {
        newArr.push(func(list[i]));
      }
    } else {
      for (key in list) {
        var num = list[key];
        newArr.push(func(num, key));
      }
    }

    return newArr;
  };

  // _.reduce(list, iteratee, [memo], [context]) Aliases: inject, foldl
  _.reduce = _.inject = _.foldl = function reduce(list, func, context) {
    var memo = 0;
    for (var i = 0; i < list.length; i++) {
      memo = func(memo, list[i]);
    }
    if (typeof context !== "undefined") {
      return context + memo;
    }
    return memo;
  };

  // _.reduceRight(list, iteratee, [memo], [context]) Alias: foldr
  _.reduceRight = _.foldr = function reduceRight(list, func) {
    var memo = [];
    for (var i = 1; i <= list.length; i++) {
      var length = list.length;
      memo = func(memo, list[length - i]);
    }
    return memo;
  };

  //_.find(list, predicate, [context]) Alias: detect
  _.find = function find(list, predicate) {
    var result = 0;
    for (var i = 0; i < list.length; i++) {
      if (predicate(list[i]) === true) {
        return list[i];
        break;
      } else if (predicate(list[i]) === false) {
        return undefined;
      }
    }
  }; 

  //_.reject
  _.reject = function reject(list, predicate) {
    var newArr = [];
    for (var i = 0; i < list.length; i++) {
      if (!predicate(list[i])) {
        newArr.push(list[i]);
      }
    }
    return newArr;
  };
  _.reduce = function reduce(array, current) {

  }

  //_.filter
  _.filter = _.select = function filter(list, predicate) {
    var truth = [];
    for (var i = 0; i < list.length; i++) {
      if (predicate(list[i]) === true) {
        truth.push(list[i]);
      } else if (predicate(list[i]) === false) {
        return undefined;
      }
    }
    return truth;
  };


  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.


  // Array Functions
  // ---------------
  _.first = _.head = _.take = function (array, n) {
    // undifiend는 변수를 선언하고 값을 할당하지 않음, 즉 자료형이 결정되지 않은 상태
    // null 변수를 선언하고 빈 값을 할당한 경우
    switch (n) {
      case undefined:
        {
          return array[0];
          break;
        }
      case (0 || -1):
        {
          return [];
          break;
        }
      case n:
        {
          return array.slice(0, n);
          break;
        }
      case (n > array.length):
        {
          return array;
          break;
        }
      default:
        {
          return array[0];
        }
    }
  };

  // initial
  _.initial = function initial(array, n) {
    // n 이 있을 때
    var result = [];
    if (n !== undefined) {
      for (var i = 0; i < array.length - n; i++) {
        result.push(array[i]);
      }
    } else {
      array.pop();
      return array;
    }
    return result;
  };

  //_.last(array, [n])
  _.last =
    function last(arr, n) {
      var guard = [];
      if (n !== undefined) {
        for (var i = 0; i < arr.length; i++) {
          if (i < n) {
            guard.unshift(arr[arr.length - 1 - i]);
          }
        }
      } else {
        return arr.pop();
      }
      return guard;
    };


  //_.rest(array, [index]) Aliases: tail, drop
  _.rest = _.tail = _.drop =
    function (array, index) {
      var result = [];
      // index가 있으면
      if (index !== undefined) {
        for (var i = index; i < array.length; i++) {
          result.push(array[i]);
        }
      } else {
        array.shift();
        return array;
      }
      return result;
    };

  //
  _.compact =
    function (array) {
      var falseList = [false, null, NaN, undefined, "", 0];
      var result = [];
      for (var i = 0; i < array.length; i++) {
        if (falseList.indexOf(array[i]) === -1 && isNaN(array[i]) === false) {
          result.push(array[i])
        }
      }
      return result;
    };

  //_.flatten(array, [shallow])

  _.flatten =
    function (array, shallow) {
      if (array === null || array === void 0) {
        return [];
      } else {
        var firstDiv = [];
        for (var i = 0; i < array.length; i++) {
          firstDiv = firstDiv.concat(array[i]);
        } // [array[0]]

        var overRap; // 모든 요소가 배열이면 안됨 
        for (var i = 0; i < firstDiv.length; i++) {
          if (Array.isArray(firstDiv[i]) && shallow === undefined) {
            overRap = firstDiv[i][0]; // []
            firstDiv.splice(i, 1);
          } else if (Array.isArray(firstDiv[i]) && shallow !== undefined) {
            overRap = firstDiv[i]; // [[]]
            firstDiv.splice(i, 1);
            return firstDiv.concat(overRap);
          }
        }
        return firstDiv.concat(overRap);
      }

    }

  // _.without(array, *values)
  _.without =
    function (array, n1, n2) {
      var other = [];
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === "number") {
          other.push(arguments[i]);
        }
      }
      for (var i = 0; i < other.length; i++) {
        for (var j = 0; j < array.length; j++) {
          if (other[i] === array[j]) {
            var index = array.indexOf(array[j]);
            array.splice(index, 1);
          }
        }
      }
      return array;
    };

  //union_.union(*arrays)
  _.union =
    function (arrays) {
      for (var i = 1; i < arguments.length; i++) {
        for (var j = 0; j < arguments[i].length; j++) {
          if (arguments[0].indexOf(arguments[i][j]) === -1) {
            arguments[0].push(arguments[i][j]);
          }
        }
      }
      return arguments[0];
    };

  //intersection_.intersection(*arrays)
  _.intersection = function (arrays) {

  };


  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.


  // Internal implementation of a recursive `flatten` function.
  //   var flatten = function (input, shallow, strict, output) {
  //     output = output || [];
  //     var idx = output.length;
  //     for (var i = 0, length = getLength(input); i < length; i++) {
  //       var value = input[i];
  //       if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
  //         // Flatten current level of array or arguments object.
  //         if (shallow) {
  //           var j = 0,
  //             len = value.length;
  //           while (j < len) output[idx++] = value[j++];
  //         } else {
  //           flatten(value, shallow, strict, output);
  //           idx = output.length;
  //         }
  //       } else if (!strict) {
  //         output[idx++] = value;
  //       }
  //     }
  //     return output;
  //   };



  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function (dir) {
    return function (array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function (dir, predicateFind, sortedIndex) {
    return function (array, item, idx) {
      var i = 0,
        length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };


  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.

  // Object Functions
  // ----------------



  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function (a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function (a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor,
        bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
          _.isFunction(bCtor) && bCtor instanceof bCtor) &&
        ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a),
        key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };
}());