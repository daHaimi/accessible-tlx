# Accessible TLX WebComponent

<p align="center">
  <img src="https://github.com/daHaimi/accessible-tlx/actions/workflows/build-wc.yml/badge.svg" alt="Build WebComponent" />
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2FdaHaimi%2Faccessible-tlx?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FdaHaimi%2Faccessible-tlx.svg?type=shield"/></a>
  <a href="https://www.npmjs.com/package/accessible-tlx"><img src="https://img.shields.io/npm/v/accessible-tlx.svg" alt="NPM Version"></a>
</p>

A more accessible version of the [NASA TLX](https://en.wikipedia.org/wiki/NASA-TLX) through usage with emotional bonding ([Publication](https://doi.org/10.1145/3473856.3473990)).
This widget uses smileys as an approach to link emotions to the TLX categories.

You only need to import the javascript file and use the custom HTML element to use it.

This WebComponent implements the [ElementInternals](https://yari-demos.prod.mdn.mozit.cloud/en-US/docs/Web/API/ElementInternals) interface
to allow for using the element in classic HTML forms. There is, of course, also a plain javascript API exposed.

# Getting started
## Using a CDN
You can use the accessible TLX on your website without installing anything using [jsDelivr](https://www.jsdelivr.com):

1. Include and use it in your HTML
```html
...
<head>
    <script type="module" src="https://cdn.jsdelivr.net/npm/accessible-tlx/dist/accessible-tlx.webcomponent.mjs"></script>
</head>
...
<body>
...
    <accessible-tlx name="form-element-name"></accessible-tlx>
...
</body>
```
 
## Using `npm`
1. Install via npm: `npm i accessible-tlx`
2. Import and use in your html:
```html
...
<head>
    <script type="module" src="./node_modules/accessible-tlx/dist/accessible-tlx.webcomponent.mjs"></script>
</head>
...
<body>
...
    <accessible-tlx name="form-element-name"></accessible-tlx>
...
</body>
```

## Receiving data
### Classic HTML
You can use the element inside any HTML `<form>`-element, like an `<input>`.
The provided values will be submitted as JSON-encoded string in the form
```json
{
  "MentalDemand": <number>,
  "PhysicalDemand": <number>,
  "TemporalDemand": <number>,
  "Performance": <number>,
  "Effort": <number>,
  "Frustration": <number>
}
```
with numbers from `1 - 7` depending on the selection.

### Access via Javascript
If you want to access the values via javascript rather than submitting a html form,
the `value` property will return a javascript object rather than a JSON string.
```javascript
function getTlxValues() {
  const data = document.querySelector('accessible-tlx[name="form-element-name"]').value;
  // data is provided as Javascript object
  console.log(data);
}
``` 

## Attributes
There is a set of attributes you can use to personalize your TLX

| Attribute     | Mandatory | Type   | Default | Description |
| ------------- | --------- | ------ | ------- | ----------- |
| `name`        | __yes__   | string | -       | Name of the form element. Must conform [`name` attribute specifications for `input` elements](https://www.w3.org/TR/html52/sec-forms.html#naming-form-controls-the-name-attribute). |
| `locale`      | no        | string | en_US   | Locale to be used for translation. Currently available: `en_US`, `de_DE`, `de_LS` (German simple language) |
| `value`       | no        | string | {}      | Set initial value of the element. Must be a JSON-object |
| `multi-field` | no        | bool   | false   | Activates [Multi-Field setting](#multi-field) |

## Multi-Field
The default behavior converts all questions into a single form field, which contains all values as JSON-string.
If you want to get the single values as separate form fields, you can simply use the `multi-field` attribute:
```html
 <accessible-tlx name="my-tlx" multi-field></accessible-tlx>
```
This will submit every modality as a single form value in the format:
```javascript
my-tlx[MentalDemand] = <number>
my-tlx[PhysicalDemand] = <number>
my-tlx[TemporalDemand] = <number>
my-tlx[Performance] = <number>
my-tlx[Effort] = <number>
my-tlx[Frustration] = <number>
```

However, accessing the value through JavaScript will still deliver a JS object in the default format.

## Styling
The accessible TLX is designed to be accessible as far as possible, even from color schemes.
However, for some applications, it may be necessary to change sizes or colors.
This can be done by setting the elements' CSS variables. This is even possible per element:
```html
<style>
    /* setting global style */
    accessible-tlx {
        /* Size of an individual smiley face. All sizes will be calculated based on this. */
        --tlx-face-size: 2em; /* default: 4em */
        
        /* Border color of the smiley face. */
        --tlx-border-normal: maroon; /* default: #000000 */
        
        /* Border color of the selected smiley face. */
        --tlx-border-highlight: green; /* default: #0000ff */
        
        /* Background color of the full element if not valid */
        --tlx-error-highlight: red; /* default: none */
    }
    .giant-faces {
        --tlx-face-size: 100px;
    }
</style>

<!-- Using global styles -->
<accessible-tlx></accessible-tlx>

<!-- Using "giant-faces" class style -->
<accessible-tlx class="giant-faces"></accessible-tlx>

```

# License
This has been released under [MIT license](LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FdaHaimi%2Faccessible-tlx.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FdaHaimi%2Faccessible-tlx?ref=badge_large)
