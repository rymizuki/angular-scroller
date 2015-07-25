# angular-scroller

[AngularJS](https://angularjs.org/) Directive for shorthand of [IScroll 5](http://cubiq.org/iscroll-5).

## Usage

Include `angular-scroller` width `angular` and `iScroll` in your application.

```html
<script src="/js/angular.min.js"></script>
<script src="/js/iscroll5.min.js"></script>
<script src="/js/angular-scroller.min.js"></script>
```

Add the module `angularScroller` as a dependency to your app module.

```javascript
angular.module('app', ['ui.router', 'angularScroller']);
```

Add the directive in your html.

```html
<div ng-scroller>
  many long content...
</div>
```

## Directive Attributes

### ngScrollerBounce

### ngScrollerScrollbar

## More customize scroller

Set the object to `value` provider with the name `ngScrollerConfig`.
`ngScrollerConfig` pass the options to IScroll.

```javascript
angular.module('app', [ 'angularScroller' ])
  .value('ngScrollerConfig', {
    click: true
  });
```

## License

MIT
