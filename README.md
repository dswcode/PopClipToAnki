# PopClipToAnki

PopClip 扩展，用于将选中的文字快速发送到 Anki（通过 [AnkiConnect](https://foosoft.net/projects/anki-connect/) 接口）。扩展侧重于快捷性，灵感来自 Edge 浏览器插件 **WebClipper for Anki - XXHK** 的常用功能。

## 功能特点

- 一键将选中文本添加到指定牌组和笔记类型。
- 可自定义前后字段名称，兼容多种笔记模板。
- 支持模板生成后字段内容，可在模板中插入 `{selection}`（当前选中文本）和 `{source}`（来源网址或应用标题）。
- 自动附加自定义标签，便于在 Anki 中管理。
- 使用系统自带的 `curl` 与本地运行的 AnkiConnect 通信，无需额外授权或外部服务。

## 安装

1. 确认电脑上已安装 [PopClip](https://pilotmoon.com/popclip/) 和 Anki，并在 Anki 中安装并启用 [AnkiConnect](https://ankiweb.net/shared/info/2055492159)。
2. 下载本仓库，双击 `PopClipToAnki.popclipext` 目录（macOS 会将其识别为 PopClip 扩展包），按照提示安装。
3. 在 PopClip 扩展的设置页中配置目标牌组、笔记类型以及字段名称。

## 使用

1. 在任何应用中选择需要保存到 Anki 的文字，PopClip 会自动出现。
2. 点击 “PopClip to Anki” 按钮，扩展会调用 AnkiConnect 将笔记写入 Anki。
3. 若配置了模板，扩展会自动填充后字段内容，并附加设定的标签。

## 配置选项

- **Deck Name**：目标牌组名称，默认 `Default`。
- **Note Type**：笔记类型（模型）名称，默认 `Basic`。
- **Front Field**：用于保存选中文本的字段名称，默认 `Front`。
- **Back Field**：用于保存模板内容的字段名称，默认 `Back`。
- **Back Template**：可多行书写的模板，支持变量 `{selection}`、`{source}`。设置为空可跳过写入后字段。
- **Tags**：用空格分隔的标签列表，默认 `popclip`。
- **Allow Duplicates**：是否允许在牌组内创建重复笔记，默认关闭。

## 工作原理

扩展内部使用 JavaScript 调用 `curl` 发送 HTTP POST 请求到 `http://localhost:8765`，构造与 AnkiConnect 兼容的 `addNote` 请求体。当 AnkiConnect 返回错误时，PopClip 会直接提示错误信息，方便排查问题。

## 注意事项

- 需要确保 Anki 正在运行且已启用 AnkiConnect。
- 如果笔记类型或字段名称与设置不一致，AnkiConnect 将返回错误，扩展会提示用户。
- 模板中的 `{source}` 依赖 PopClip 能够获取当前应用或浏览器的上下文信息；若无法获取，则该占位符会被留空。

## 开发说明

扩展脚本位于 `PopClipToAnki.popclipext/send-to-anki.js`，如需进一步定制，可按照 PopClip 官方文档修改脚本逻辑或界面资源。
