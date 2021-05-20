# About

This project is part of the source of [The Apache ECharts Official Website](https://echarts.apache.org/). See [echarts-website](https://github.com/apache/echarts-website) for more details of the building process.

## dev

### Build website for local preview

```sh
npm run dev
```

### Build jade

```sh
npm run jade
```

### Build sass

```sh
npm run sass
```

### Build jade, sass, and js

```sh
# Examples:
npm run dev -- --filter=jade,sass
npm run dev -- --filter=jade,sass,js
```

### Watch

```sh
# Watch for jade, sass and js changes:
npm run watch
npm run watch:sass
npm run watch:jade
```

## release

```sh
npm run release
```

### Add SPA page

Add SPA page created by [echarts-www-spa-boilerplate](https://github.com/pissang/echarts-www-spa-boilerplate)

```sh
npm run create:page
```

Then add this page entry in the menu.