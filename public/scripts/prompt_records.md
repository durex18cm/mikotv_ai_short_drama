**任务：实现高保真可交互的产品原型**

当前项目目录下有一个 markdown 格式的产品文档 ，名字是`AI_short_drama_platform_MVP_PRD_prompt_revised.md`，请你基于这个产品需求文档实现高保真可交互的原型。

关于 UI 设计风格要求，请根据你的最佳审美，实现专业、炫酷、有一定的动画交互效果，动画效果不能太过绚丽，总之就是实现的可交互、高保真原型要专业、审美高级，一看就是大厂出品，可体验完整的 AI 短剧创作流程。

写代码前你要把你不明白、不确定的细节、所有疑问都跟我沟通全部搞明白之后，再开始写代码。



**问题恢复：我依此回答你的问题**

- 项目形式：

  ```
  技术栈可以使用React + TypeScript + Tailwind CSS + shadcn/ui，但是限于这些技术栈，如果你有更好的技术栈选型方案，你也可以使用。
  我本地有 Node.js 环境，但是这个高保真交互原型实现以后会将代码上传到 github 上，然后部署到 vercel.com，你必须要考虑支持这个流程。
  不要求必须是单个 HTML
  ```

- 整体色调：深色还是浅色？

  ```
  深色系即可
  ```

- 是否需要首页/登录页？

  ```
  不需要登录页
  ```

- 角色/关键帧/视频的占位图怎么处理？

  ```
  使用选项 B
  ```

  

- 视频播放器区域

  ```
  使用选项 B
  ```

- 动画风格确认

  ```
  你了解的是正确的
  ```



已全部回答完毕，如果你还有不确定或者认为有模糊空间的，可以继续追问我，直到你搞清楚了所有问题。



**任务：修复启动问题**

我执行 `npm run dev` 后报错如下：
```
npm run dev

> miko-tv@0.1.0 dev
> vite

/Users/xiejianchao/Dev/github/prd/ai_short_drama/node_modules/rollup/dist/native.js:115
                throw new Error(
                      ^

Error: Cannot find module @rollup/rollup-darwin-arm64. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
    at requireWithFriendlyError (/Users/xiejianchao/Dev/github/prd/ai_short_drama/node_modules/rollup/dist/native.js:115:9)
    at Object.<anonymous> (/Users/xiejianchao/Dev/github/prd/ai_short_drama/node_modules/rollup/dist/native.js:124:76)
    at Module._compile (node:internal/modules/cjs/loader:1812:14)
    at Object..js (node:internal/modules/cjs/loader:1943:10)
    at Module.load (node:internal/modules/cjs/loader:1533:32)
    at Module._load (node:internal/modules/cjs/loader:1335:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at loadCJSModuleWithModuleLoad (node:internal/modules/esm/translators:328:3)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:233:7)
    at ModuleJob.run (node:internal/modules/esm/module_job:430:25) {
  [cause]: Error: Cannot find module '@rollup/rollup-darwin-arm64'
  Require stack:
  - /Users/xiejianchao/Dev/github/prd/ai_short_drama/node_modules/rollup/dist/native.js
      at Module._resolveFilename (node:internal/modules/cjs/loader:1456:15)
      at defaultResolveImpl (node:internal/modules/cjs/loader:1066:19)
      at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1071:22)
      at Module._load (node:internal/modules/cjs/loader:1242:25)
      at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
      at Module.require (node:internal/modules/cjs/loader:1556:12)
      at require (node:internal/modules/helpers:152:16)
      at requireWithFriendlyError (/Users/xiejianchao/Dev/github/prd/ai_short_drama/node_modules/rollup/dist/native.js:97:10)
      at Object.<anonymous> (/Users/xiejianchao/Dev/github/prd/ai_short_drama/node_modules/rollup/dist/native.js:124:76)
      at Module._compile (node:internal/modules/cjs/loader:1812:14) {
    code: 'MODULE_NOT_FOUND',
    requireStack: [
      '/Users/xiejianchao/Dev/github/prd/ai_short_drama/node_modules/rollup/dist/native.js'
    ]
  }
}

Node.js v24.14.0
```

请根据错误信息修复问题。



**任务：优化原型视觉效果使其更易读**

当前页面主要是黑色背景、紫色高亮，但是二级字体显示的好像是浅紫色，很不容易看清楚，看着特别费劲，请你优化一下当前的视觉设计，使页面更容易阅读、字体更清晰、字体也稍微大一些。

header 区域的文字有点太小了，尤其是右上角的 `已连接`、`自动保存`字体太小了。同时去掉 `已连接`的提示，不需要这个提示。



任务：优化视觉效果

- 将当前原型图里的紫色 primary 色替换成 `0xFFE91E63` 这个特定的红色（如果这个色值你不方便使用，请你自己转换）因为 app 里的 primary 颜色就是这个颜色，这样生态统一。
- 网页图标使用当前项目根目目录 public 目录里的 `ic_launcher.png` 图标，你自行处理圆角、分辨率大小、和名字问题，之前的图标可以删掉。
- 字体还是有点小、字体和背景的对比度还是不够清楚，请继续优化调整
- `配音与字幕`页面的`角色配音` tab 下的页面有问题，没有显示完整，`生成全部配音` 按钮都看不见，需要滑动才能展示，但是页面底部还有很大的空间，请修改为自适应布局。
- 我给你提供了关键帧的高清图，图片路径在当前项目根目录的 `public/images/keyframes/`目录里。全部使用任务角色的拼音命名，比如霍去病这个角色的关键帧图片名是`huoqubing.png`，其他以此类推。
  - 请将我提供的图片作用于整个创作流程中所有需要使用到的合适的角色的头像上，要对应清楚，不能将汉武帝的头像作用于霍去病这个角色上，可以使用CSS 虚拟裁剪出人物脸部区域。
  - 请将我提供的关键帧图片作用于整个创作流程中所有需要显示视频缩略图和关键帧的地方，你根据需要选择使用哪张图片。
- 上传剧本页面显示的剧本请读取`public/scripts/《霍去病之封狼居胥》.md` 这个文件，将其内容填充到`剧本文本`输入框里。



**任务：优化如下细节**

- 左上角的图标你没有显示成 `public/images/favorite.png` 这个图片，请修复这个问题，显示我指定路径的图片。
- 请看截图，`配音与字幕`页面的`角色配音` tab 下的页面还是有问题，`生成全部配音` 按钮虽然看见了，但是不同角色的卡片 GridView 没有显示完整，页面下方有大片空白区域你为什么不用呢？很奇怪，这是我第二次跟你说了，这次务必要修改，修改为自适应布局，充分利用这个页面的底部空间。



**任务：优化网页里左上角显示的图标**

网页左上角的图片你裁切的圆角太大了，在当前显示的圆角度数基础上降低一半我看看效果，然后你告诉我在代码什么位置该，我手动调整一下看看效果。



**任务：优化体验**

现在实现的页面中下拉框里的文字都没有显示完整，你可以看一下我给你提供的截图，不只是这一个页面，其他页面的下拉框也请一并修复，确保下拉框中的文字可以显示完整。

如截图所示，配音与字幕页面，点开`生成全部配音时`，应该在每个卡片右上角显示一个进度条，目前没有进度条，需要等待一会会突然显示`已生成`，体验不够好。

`成片预览`页面的视频也要显示一个合适的图片作为缩略图，这样看着会舒服一些。

`剪辑合成`页面每一集不要用列表形式展示，太宽了，要充分利用屏幕宽度，换成网格形式展示，自适应宽度变化，兼容移动端和 PC 端。

进入 `确认角色`页面和`视觉风格`页面会闪烁一下，请修复这个问题。



**任务：继续优化体验**

- `确认角色`、`视觉风格、` 、`生成视频`、`剪辑合成`、还是会有闪烁问题，请一次性彻底修复。
- `生成视频`页面也不要用列表形式展示，太宽了，要充分利用屏幕宽度，换成网格形式展示，自适应宽度变化，兼容移动端和 PC 端。

- 成片预览时默认显示播放器的控制条，这样让人知道这是一个视频，如果不显示会误以为是一张图片。
- 导出视频页面点击`导出 MP4` 按钮后，进度条和状态更新太靠下看不到了，请你优化一个这页面的布局，确保状态更新和其他主要元素的布局方式，确保能看到进度条和状态更新。



**任务：和 codex 确认闪烁原因**

刚才让你修复问题其他问题都修复了，但是`确认角色`、`视觉风格、` 、`生成视频`、`剪辑合成`这几个页面闪烁的问题是一个都没有改好，同样的问题，我问了一下 codex，他认为闪烁的原因如下：
```
先结论：这个闪烁不是数据反复加载，也不是图片随机刷新，核心是页面切换淡入淡出 + 列表卡片延迟入场动画叠加，在开发模式下又被 React StrictMode 的重复挂载放大了。

我看到的关键点：


src/components/layout/AppShell.tsx (line 65) 用 AnimatePresence + key={state.currentStep}，每次进入步骤都会卸载旧页面、挂载新页面，并让整页从 opacity: 0 淡入。

src/pages/Characters.tsx (line 235)、src/pages/VisualStyle.tsx (line 30)、src/pages/VideoGeneration.tsx (line 91)、src/pages/AutoEdit.tsx (line 88) 这些页面的卡片又各自 initial={{ opacity: 0 }}，并且带 delay: 0.15 + i * 0.05。

确认角色 更明显，因为外层列表项在动，CharacterCard 自己内部又有一次 motion.div 入场动画，等于卡片被重复隐藏/显示。

src/main.tsx (line 7) 开了 StrictMode，开发环境下挂载会被额外检查一次，所以这种“初始隐藏再显示”的动画会更像闪烁。


我的修复方案：

在 AppShell 里去掉按步骤 key 触发的整页 AnimatePresence 淡入淡出，改成稳定的页面容器，避免新旧页面叠在一起和滚动容器重复绘制。
在高密度卡片/列表页面移除“进入页面时”的卡片级 initial/animate/delay，让卡片首次渲染就是最终状态。
保留有意义的交互动效：按钮 hover、播放进度、生成进度、弹窗/lightbox、loading spinner 这些不动。
顺手覆盖同类页面：确认角色、视觉风格、生成关键帧、生成视频、配音与字幕、剪辑合成，避免修完一个页面另一个页面还闪。
修完后我会做类型检查，并尽量跑本地页面逐步切换验证。当前 npm run build 在本机 Rollup 可选依赖签名处失败，和闪烁本身无关；后续我会用可行方式验证代码没有类型问题。
```

你觉得他的分析和修复方案怎么样？



**任务：继续优化动画**

你添加的动画效果整体我感觉很不错，但是还是有几个小问题，`剧本解析`、`视觉风格`、`剪辑合成`这几个页面显示的动画结束时会有类似突然抖一下、放大、位移和卡片上闪一下的问题，感觉很不好。


但是 `确认角色`、`生成关键帧`、`生成视频`、`配音与字幕`这几个页面的动画显示的就很完美，不会有视觉上动画结束时有抖一下、放大、位移和闪一下的问题，变现很好。

请你将`剧本解析`、`视觉风格`、`剪辑合成`这几个有问题页面的动画效果修改成和`确认角色`、`生成关键帧`、`生成视频`、`配音与字幕`这几个页面一样的效果，完全一样即可。



任务：将当前项目推送到 github

远程仓库地址：https://github.com/durex18cm/ai_short_drama

要确保发布到 vercel.com 相关的配置是完整的、可用的，推送到 github 之后我会关联到 vercel，发送给投资人和客户。

本地可能配置了多个 github 账号，你要使用 `durex18cm` 这个 github 账号。