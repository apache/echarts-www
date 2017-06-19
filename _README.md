## 目录名保留字【!!!】

除了已有的目录名外，这些目录名禁止使用：

* `doc`：

    <http://echarts.baidu.com/echarts2/doc.html> 映射到 <http://echarts.baidu.com/echarts2/doc/doc.html>

* `x`：

    <http://echarts.baidu.com/x/doc/index.html> 映射到 <http://echarts.baidu.com/echarts2/x/doc/index.html>

* `data`：

    <http://echarts.baidu.com/gallery/data/asset/data> 映射到 <http://echarts.baidu.com/data/asset/data>

* `spreadsheet`：

    <http://echarts.baidu.com/doc/spreadsheet.html> 映射到 <http://echarts.baidu.com/echarts2/doc/spreadsheet.html>

## 运行

一般情况下，在命令行开着 `gulp watch`，然后在本地服务器访问，不另开服务器。修改 SCSS 和 Jade 文件会自动重新生成对应 CSS 和 HTML。

## 文件说明

### HTML

HTML 文件由 `_jade` 目录下的 Jade 文件生成。

- `_jade` 根目录下的文件对应单独的 HTML 文件。
- `_jade/components` 目录下对应在其他 Jade 文件中会被 `include` 的文件，用法参见 `_jade/examples.jade` 的 `include components/nav`。
- `_jade/layouts` 目录下对应在其他 Jade 文件中会被 `extends` 的文件，用法参见 `_jade/examples.jade` 的 `extends layouts/basic`。

### CSS

CSS 文件由 `_scss` 目录下的 SCSS 文件生成。

- `main.scss`：入口文件，新建 SCSS 文件在这里引用。
- `_settings.*.scss`：只定义变量，通常是会在多个文件中使用的变量。
- `_components.*.scss`：对应 `_jade/components` 目录下元素的样式。
- `_pages.*.scss`：对应 `_jade` 根目录下的文件每个页面特有的样式。

### JavaScript

第三方 JavaScript 放在 `vendors` 目录下，其余放在 `js` 目录下。暂时不做压缩，发布前再处理。
