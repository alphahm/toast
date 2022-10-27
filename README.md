# toast

A simple (perhaps simplistic) toast notification script.

## Usage

Transpiled Javascript and css are located in the `dist` folder. Both are needed.

And to use:

```js
let toast = Toast.Instance;
toast.notify(0, "This is an info message!");
```

For now, there are just two types of notification, 0 for info and 1 for warning. This is the first parameter to the `notify()` method, the second parameter being the message.

Long messages will be cropped.

## Example

`toast.js` is added to html using type `module` therefore the example needs to be run in a server to avoid CORS error.

Example:

```
python3 -m http.server
```

## Development/Improve it

Typescript script as well as the companion css are in the `src` folder.

## Acknowledgments

* https://www.codingnepalweb.com for the side effect.