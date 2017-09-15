# babel-plugin-define-undefined-type
[![Build Status](https://travis-ci.org/akameco/babel-plugin-define-undefined-type.svg?branch=master)](https://travis-ci.org/akameco/babel-plugin-define-undefined-type)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Define string literal type when you write undefined type.


## Install

```
$ npm install --save-dev babel-plugin-define-undefined-type
```


## Usage

```json
{
  "plugins": ["define-undefined-type"]
}
```

## Examples

### General

#### In:

```js
type X = A;
```

#### Out:

```js
type A = "A";
type X = A;
```

---

### Union

#### In:

```js
type Action = { type: ADD | INCREMENT };
```

#### Out:

```js
type ADD = "ADD";
type INCREMENT = "INCREMENT";
type Action = { type: ADD | INCREMENT };
```

---

#### In:

```js
type Action = { type: ADD } | { type: INCREMENT }
```

#### Out:

```js
type ADD = "ADD";
type INCREMENT = "INCREMENT";
type Action = { type: ADD } | { type: INCREMENT };
```

## Options

#### usePrefix

type: `boolean` <br>
Default: `false`

Prefix of the file path.

#### Example

.babelrc

```json
{
  "plugins": ["define-undefined-type", {"usePrefix": true}]
}
```

#### In:

```js
type Action = { type: ADD } | { type: INCREMENT }
```

#### Out:

```js
type ADD = "app/counter/ADD";
type INCREMENT = "app/counter/INCREMENT";
type Action = { type: ADD } | { type: INCREMENT };
```

#### removePrefix

type: `string` <br>
Default: `''`

#### Example

.babelrc

```json
{
  "plugins": [
    "define-undefined-type",
    {
      "usePrefix": true,
      "removePrefix": "app"
    }
  ]
}
```


#### In:

```js
type Action = { type: ADD } | { type: INCREMENT }
```

#### Out:

```js
type ADD = "counter/ADD";
type INCREMENT = "counter/INCREMENT";
type Action = { type: ADD } | { type: INCREMENT };
```

## License

MIT © [akameco](http://akameco.github.io)
