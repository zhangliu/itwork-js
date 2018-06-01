# itwork-js README
这个工具能够极大的帮助我们调试js和typescript的效率！

#### 工作原理
目前我们在写js/ts代码的时候，没有很方便的工具能够实时的告诉我们代码的运行结果，除非我们通过单测或者postman等一些工具，启动程序并输入相应的参数，才能看到运行结果。

这个工具简化了这一过程，当你编写了一个函数后：
```javascript
// params=[1, 2, 3]
const test = (params) => {
  // to do something
  return params.join(',')
}
```

你只需要选中函数名：`test`，然后按下快捷键：`cmd+e`，这个插件就会解析你的这段代码，分析函数头上的注释：
```javascript
// params=[1, 2, 3]
```

并解析成`test`方法所需要的参数，最后调用`test`方法，输出运行结果到控制台中。

### 其他

目前可以调试的文件有：
* 普通的js/ts文件
* sails框架的controller、service等文件