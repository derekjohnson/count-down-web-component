# Countdown web component

A progressively enhanced `<count-down>` custom element that counts down to a specified date.

[Demo](https://derekjohnson.github.io/countdown-web-component).

## Installation

Add the following to an HTML document:

`<script type="module" src="path/to/countdown.js"></script>`

## Usage

First create a `<count-down>` element with default content for users of browsers that don't support web components:

```
<count-down>
  <h2 slot="heading">Doors open in</h2>
  <time>2019-06-01</time>
</count-down>
```

If the text content of the `<time>` element isn't a [valid string](https://html.spec.whatwg.org/multipage/text-level-semantics.html#datetime-value), a `datetime` attribute must be added containing a valid string as its value.

Then add attributes to control the end date of the countdown and its layout breakpoints.

```
<count-down ends="2019-06-01" breakpoint1="25em" breakpoint2="50em">
  <h2 slot="heading">Doors open in</h2>
  <time>2019-06-01</time>
</count-down>
```

### Attributes

*`ends`* - A date in yyyy-mm-dd format that the countdown ends on.

*`breakpoint1`* - The days, hours, minutes and seconds are displayed in a single column CSS grid. This attribute sets the `min-width` media query where it goes to two columns.

*`breakpoint2`* - This attribute sets the `min-width` media query where the grid goes to four columns.

### Styling

The `<count-down>` element can be styled using a universal, element, class, id or attribute selector as normal. Inherited properties will also work inside its shadow DOM e.g. `font-family` and `color`.

Two custom properties are available to set the `font-size` of the numbers and their units:

`--countdown-number-font-size`

`--countdown-unit-font-size`

Don't forget styles for the default experience!

## License

MIT License