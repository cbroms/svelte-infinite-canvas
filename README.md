# Svelte Infinite Canvas

A pannable and zoomable canvas that holds movable elements.

## Install it

```
npm install --save-dev svelte-infinite-canvas
```

This component currently uses [`leader-line`](https://github.com/anseki/leader-line) to draw links between elements on the canvas. Since `leader-line` is a legacy package, you'll need to add `@rollup/plugin-legacy` to your rollup configuration. Install it:

```
npm install --save-dev @rollup/plugin-legacy
```

Than, in your `rollup.config.js` add:

```js
import legacy from "@rollup/plugin-legacy";

// config stuff here

export default {
    plugins: [
        legacy({
            "node_modules/leader-line/leader-line.min.js": "LeaderLine",
        }),
    ],
};
```
