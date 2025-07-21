# Accessible TLX WebComponent

# Getting started
## Build
You will need `nodejs` and `yarn`. In the repo folder then run:
```shell
yarn install
yarn build
```
The output will be stored in `dist/accessible-tlx.webcomponent.mjs`

## Use it in your HTML
You can use it like any other form element:
```html
...
<head>
    <script type="module" src="/path/to/your/accessible-tlx.webcomponent.mjs"></script>
</head>
...
<body>
...
<form>
...
    <accessible-tlx name="form-element-name"></accessible-tlx>
...
</form>
...
</body>
```

## Attributes
There is a set of attributes you can use to personalize your TLX

| Attribute     | Mandatory | Type   | Default | Description                                                                                                                                                                         |
|---------------|-----------|--------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`        | __yes__   | string | -       | Name of the form element. Must conform [`name` attribute specifications for `input` elements](https://www.w3.org/TR/html52/sec-forms.html#naming-form-controls-the-name-attribute). |
| `locale`      | no        | string | en_US   | Locale to be used for translation. Currently available: `en_US`, `de_DE`, `de_LS` (German simple language)                                                                          |
| `value`       | no        | string | {}      | Set initial value of the element. Must be a JSON-object                                                                                                                             |
| `multi-field` | no        | bool   | false   | Activates [Multi-Field setting](#multi-field)                                                                                                                                       |
| `alt-type`    | no        | string | null    | Selects if the `presence` questionnaire should be used instead                                                                                                                      |

## Multi-Field
The default behaviour converts all questions into a single form-field, which contains all values as JSON-string.
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

Accessing the value through javascript will however still deliver a JS-object in the default format.

# License
This has been released under [MIT license](LICENSE).
