# itwork-js README
这个工具能够极大的帮助我们调试js和typescript的效率！

#### 工作原理
目前我们编写js代码都是在一些框架内（react、express等），要调试这些代码，我们往往需要：
**启动后台服务=>切换到浏览器、postman等工具=>传入相应的参数发送请求=>切回后台代码查看报错问题。**

整个过程主要就是要来回切工具，个人比较讨厌这种切换，而且这种调试过程比较没有技术含量，有没有更好更快捷的，能在我们编写代码的时候，就告诉我们代码执行情况的工具呢?

答案是有的：itwork-js!

itwork-js的工作原理很简单，比如我们写了一个函数：
```javascript
// a = 3
// b = 4
function test(a, b) {
  return a + b;
}
```

你只需要选中函数名：`test`，然后按下快捷键：`cmd+e`，这个插件就会解析你的这段代码，分析函数头上的注释：
```javascript
// a = 3
// b = 4
```
并解析成test方法所需要的参数并调用`test`方法：
```javascript
test(3, 4)
```

最后，itwork-js会输出结果到控制台中。
![](https://upload-images.jianshu.io/upload_images/4328038-0097e02b7ca12f42.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 其他

目前可以调试的文件有：
* 普通的js/ts文件
* sails框架的controller、service等文件