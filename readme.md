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

### In:

```js
type X = A;
```

### Out:

```js
type A = "A";
type X = A;
```

### In:

```js
type Action = { type: ADD | INCREMENT };
```

### Out:

```js
type ADD = "ADD";
type INCREMENT = "INCREMENT";
type Action = { type: ADD | INCREMENT };
```

### In:

```js
type Action = { type: ADD } | { type: INCREMENT }
```

### Out:

```js
type ADD = "ADD";
type INCREMENT = "INCREMENT";
type Action = { type: ADD } | { type: INCREMENT };
```

## License

MIT © [akameco](http://akameco.github.io)
