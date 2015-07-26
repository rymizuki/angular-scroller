(function () {
  'use strict';
  var __propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function __ToObject(val) {
    if (val === null) {
      throw new TypeError('Object.assign cannot be called with null or undefined');
    }

    return Object(val);
  }

  function __ownEnumerableKeys(obj) {
    var keys = Object.getOwnPropertyNames(obj);

    if (Object.getOwnPropertySymbols) {
      keys = keys.concat(Object.getOwnPropertySymbols(obj));
    }

    return keys.filter(function (key) {
      return __propIsEnumerable.call(obj, key);
    });
  }

   function assign (target, source) {
    var from;
    var keys;
    var to = __ToObject(target);

    for (var s = 1; s < arguments.length; s++) {
      from = arguments[s];
      keys = __ownEnumerableKeys(Object(from));

      for (var i = 0; i < keys.length; i++) {
        to[keys[i]] = from[keys[i]];
      }
    }

    return to;
  }

  var __generatedIds = {};
  function generateId (idPrefix) {
    if (!idPrefix) idPrefix = '';
    if (!__generatedIds[idPrefix]) __generatedIds[idPrefix] = 0;
    return idPrefix + __generatedIds[idPrefix]++;
  }

  // @ngInject
  function scrollerFactory () {
    function create (element, options) {
      if (!options) options = {};
      return new IScroll(element[0], options);
    }
    return { create: create };
  }

  // @ngInject
  function removeNgClick ($provide) {
    // @ngInject
    function decorateNgClickDirective($delegate) {
      $delegate.shift();
      console.log($delegate);
      return $delegate;
    }
    decorateNgClickDirective.$inject = ["$delegate"];

    $provide.decorator('ngClickDirective', decorateNgClickDirective);
  }
  removeNgClick.$inject = ["$provide"];

  // @ngInject
  function ngScrollDirective (Scroller, ngScrollerConfig) {
    return {
      restrict: 'A',
      link: function link($scope, $element, $attr) {
        var scrollerId = generateId('scroller-'),
            innerElement = angular.element('<div class="ng-scroller"></div>')
        ;
        var options = assign({}, ngScrollerConfig, {
          bounce:     $attr.ngScrollerBounce    === 'false' ? false : true,
          scrollbars: $attr.ngScrollerScrollbar === 'true'  ? true  : false,
        });
        innerElement
          .append($element.contents())
          .css({
            'position': 'relative',
            'width':    '100%',
            'height':   'auto',
            'min-height': '100%'
          })
        ;
        $element
          .append(innerElement)
          .css({'overflow': 'hidden'})
          .attr('ng-scroller-id', scrollerId)
        ;
        var content = $element[0].children[0];

        function isChange () {
          return content.clientHeight;
        }
        function onChange () {
          console.log('onChange');
          if (!$scope.scrollers) $scope.scrollers = {};
          if (!$scope.scrollers[scrollerId]) {
            var scroller = Scroller.create($element, options);
            $scope.scrollers[scrollerId] = scroller;
          }
          $scope.scrollers[scrollerId].refresh();
        }
        $scope.$watch(isChange, onChange);
        setTimeout(onChange, 0);
      }
    };
  }
  ngScrollDirective.$inject = ["Scroller", "ngScrollerConfig"];

  // @ngInject
  function ngClickDirective ($parse, $rootScope) {
    var suppress = false;

    function compile (element, $attr) {
      var fn = $parse($attr.ngClick, null, true);
      return function (scope, $element) {
        function onClick (ev) {
          if (suppress) return;
          function callback () {
            suppress = true;
            setTimeout(function () { suppress = false; }, 500);
            fn(scope, {$event: ev});
          }
          $scope[$rootScope.$$phase ? '$evalAsync' : '$apply'](callback);
        }
        $element.on('click', onClick);
      };
    }

    return {
      restrict: 'A',
      compile: compile
    };
  }
  ngClickDirective.$inject = ["$parse", "$rootScope"];

  angular.module('angularScroller', [])
    .value('ngScrollerConfig', {
      click:  true,
      tap:    false
    })
    .factory('Scroller', scrollerFactory)
    .directive('ngScroller', ngScrollDirective)
    .directive('ngClick', ngClickDirective)
  ;
}());
