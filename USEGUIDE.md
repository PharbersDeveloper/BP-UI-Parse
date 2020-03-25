# 组件更新指南

@[TOC]

> 各组件均支持基础组件接受的属性，例如 tagName 之类的。

对应 BP-UI-Parse 版本：2020-02-18（以最后提交的日期）



## bp-button

### 使用实例

```json
{
    "id": "login-btn",
    "type": "BPPushButton",
    "name": "bp-button",
    "className": "login-btn",
    "text": "登录",
    "layout": [
        {
            "k": "display",
            "v": "flex"
        },
        {
            "k": "justify-content",
            "v": "center"
        }
    ],
    "css":[
        {
            "k": "margin",
            "v": "16px 0"
        },
        {
            "k": "padding",
            "v": "0px"
        },
        {
            "k": "height",
            "v": "40px"
        }
    ],
    "attrs": [
        {
            "name": "block",
            "value": true,
            "type": "boolean"
        },
        {
            "name": "text",
            "value": "登录"
        },
        {
            "name": "icon",
            "value": ""
        }
    ]
}
```

### attrs

- block  - boolean
- text - string
- icon - string (edit / ...)
- type - string (primary / ...)
- density - string 



## BPRowLayout 布局器-横向布局器

### 生成JSON

```json
{
    "id": "layout-row",
    "type": "BPRowLayout",
    "cat": "0",
    "name":"bp-row-layout",
    "css": [
        {
            "k": "height",
            "v": "385px"
        },
        {
            "k": "width",
            "v": "auto"
        },
        {
            "k": "padding",
            "v": "24px"
        },
        {
            "k": "border-radius",
            "v": "$radius-medium"
        },
        {
            "k": "background",
            "v": "#eee"
        }, 
        {
            "k": "box-shadow",
            "v": "$depth-z200"
        }
    ],
    "components": [],
    "attrs": [],
    "styleAttrs": [
        {
            "name": "wrap",
            "value": "false",
            "type": "boolean"
        },
        {
            "name": "mainAxis",
            "value": "main-flex-start",
            "type": "string"
        },
        {
            "name": "crossAxis",
            "value": "cross-flex-start",
            "type": "string"
        },
        {
            "name": "alignContent",
            "value": "wrap-flex-start",
            "type": "string"
        }
    ]
}
```

### attrs

同普通 component。

### styleAttrs

其中 `styleAttrs` 用来配置此布局器内部的子组件如何排列的：

- wrap: 对应 flex 布局中的 `flex-wrap` ，值的类型为 `boolean` 类型。
- mainAxis: flex 布局中主轴的排列方式。对应 flex 布局中的 `justify-content` ,值的类型为 `string`，分别对应 flex 布局中，`justify-content` 中的五个值，不同的是，为了区分类名，为每个值添加了前缀 `main` : 
    - `main-flex-start`
    - `main-flex-end`
    - `main-center`
    - `main-space-between`
    - `main-space-around`
- crossAxis: flex 布局中交叉轴的排列方式。对应 flex 布局中的 `align-items` ,值的类型为 `string`,，分别对应 flex 布局中，`align-items`  中的五个值，不同的是，为了区分类名，为每个值添加了前缀 `cross` : 
    - `cross-flex-start`
    - `cross-flex-end`
    - `cross-center`
    - `cross-baseline`
    - `cross-stretch`
- alignContent: flex 布局中多根轴线的对齐方式。对应 flex 布局中的 `align-content` ,值的类型为 `string`,，分别对应 flex 布局中，`align-content`  中的六个值，不同的是，为了区分类名，为每个值添加了前缀 `wrap` : 
    - `wrap-flex-start`
    - `wrap-flex-end`
    - `wrap-center`
    - `wrap-space-between`
    - `wrap-space-around`
    - `wrap-stretch`

## BPColumnLayout 布局器 - 纵向布局器

同横向布局器

## BPBadge

### 生成 JSON

```json
{
    "id": "test",
    "type": "BPBadge",
    "cat": "0",
    "text": "9",
    "name": "bp-badge",
    "attrs": [
        {
            "name": "badgeNumber",
            "value": "8"
        }
    ],
    "styleAttrs": [
        {
            "name": "primary",
            "value": false
        },
        {
            "name": "reverse",
            "value": false
        }
    ],
    "events": [
        "click",
        "mouseEnter",
        "mouseLeave"
    ],
    "css": [
        {
            "k": "width",
            "v": "max-content"
        },
        {
            "k": "min-width",
            "v": "20px"
        },
        {
            "k": "background",
            "v": "#DFE1E6"
        },
        {
            "k": "font-size",
            "v": "12px"
        },
        {
            "k": "color",
            "v": "#253858"
        },
        {
            "k": "text-align",
            "v": "center"
        },
        {
            "k": "line-height",
            "v": "16px"
        },
        {
            "k": "height",
            "v": "16px"
        },
        {
            "k": "border",
            "v": "0"
        },
        {
            "k": "border-radius",
            "v": "8px"
        },
        {
            "k": "padding",
            "v": "0 6px"
        },
        {
            "k": "cursor",
            "v": "pointer"
        }
    ]
}
```

### attrs

- badgeNumber - number

### styleAttrs

- primary - boolean
- reverse - boolean 反转颜色

## BPButtonGroup

### 生成 JSON

```json
{
    "id": "test",
    "type": "BPButtonGroup",
    "cat": "0",
    "name": "bp-button-group",
    "css": [
        {
            "k": "width",
            "v": "max-content"
        },
        {
            "k": "height",
            "v": "auto"
        }
    ],
    "components": [
        {
            "id": "test",
            "type": "BPButtonItem",
            "cat": "0",
            "name": "bp-button-item",
            "css": [],
            "attrs": [
                {
                    "name": "disabled",
                    "value": false
                },
                {
                    "name": "text",
                    "value": "test text"
                }
            ],
            "styleAttrs": [
                {
                    "name": "density",
                    "value": "default"
                },
                {
                    "name": "active",
                    "value": true
                }
            ],
            "events": [
                "click",
                "dblclick"
            ]
        },
        {
            "id": "test",
            "type": "BPButtonItem",
            "cat": "1",
            "name": "bp-button-item",
            "css": [],
            "attrs": [
                {
                    "name": "disabled",
                    "value": false
                },
                {
                    "name": "text",
                    "value": "test text"
                }
            ],
            "styleAttrs": [
                {
                    "name": "density",
                    "value": "default"
                },
                {
                    "name": "active",
                    "value": false
                }
            ],
            "events": [
                "click",
                "dblclick"
            ]
        }
    ]
}
```

### attrs

主要是内部组成的 `BPButtonItem` ，有：

- disabled - boolean
- text - string

### styleAttrs

也是内部组成 `BPButtonItem`，有：

- density - string
- active - boolean

## BPDatePicker

### 生成 JSON

```json
{
    "id": "test",
    "type": "BPDatePicker",
    "icon": "calendar",
    "cat": "0",
    "text": "simon test",
    "name": "bp-date-picker",
    "css": [],
    "attrs": [
        {
            "name": "range",
            "value": true
        },
        {
            "name": "type",
            "value": "date"
        },
        {
            "name": "pid",
            "value": "date-picker"
        },
        {
            "name": "min",
            "value": "1990-1-1"
        },
        {
            "name": "max",
            "value": "2100-12-31"
        }
    ],
    "styleAttrs": [
        {
            "name": "style",
            "value": "default"
        },
        {
            "name": "size",
            "value": "small"
        }
    ],
    "events": [
        "click"
    ]
}
```

### attrs

- range - boolean 
- type - string 
- pid - string (laydate 插入的 dom id值，具有唯一性)
- min - yyyy-mm-dd (最久可选择日期)
- max - yyyy-mm-dd(未来可选择日期)
- endDate - yyyymm （默认选中的年月）

### styleAttrs

- style - string
- size - string

## BPImg

### 使用实例

```json
{
    "id": "login-logo",
    "type": "BPImg",
    "name": "bp-img",
    "className": "login-logo",
    "css": [
        {
            "k": "width",
            "v": "14px"
        },
        {
            "k": "height",
            "v": "14px"
        }
    ],
    "attrs": [
        {
            "name": "src",
            "value": "https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/01/0F/ChMkJlbKwvKILghAAAXdSSmnlysAALGvgEMwnEABd1h654.jpg",
            "type": "string"
        },
        {
            "name": "alt",
            "value": "pharbers logo",
            "type": "string"
        }
    ]
}
```

### attrs

- src - string 
- alt - string

## BPInput

### 使用实例

```json
{
    "id": "login-account",
    "type": "BPInput",
    "name": "bp-input",
    "className": "login-input",
    "css":[],
    "attrs": [
        {
            "name": "placeholder",
            "value": "邮箱",
            "type": "string"
        }
    ]
}
```

### attrs

基础组件接收的属性。  

本组件属性：

- disabled - boolean
- value - string
- placeholder - string
- size - string
- state - string
- type - string（input type）

## BPLabel

### 生成 JSON

```json
{
    "id": "",
    "type": "BPLabel",
    "cat": "0",
    "name": "bp-label",
    "layout": [],
    "css": [],
    "attrs": [
        {
            "name": "text",
            "value": "test label"
        }
    ],
    "styleAttrs": [
        {
            "name": "type",
            "value": "body-primary"
        }
    ]
}
```

### attrs

- text - string
- type - string

## bp-link

### 生成 JSON

```json
{
    "id": "test",
    "type": "BPLink",
    "cat": "0",
    "text": "9",
    "name": "bp-link",
    "css": [
        {
            "k": "width",
            "v": "max-content"
        },
        {
            "k": "font-size",
            "v": "14px"
        },
        {
            "k": "text-align",
            "v": "center"
        },
        {
            "k": "line-height",
            "v": "14px"
        },
        {
            "k": "height",
            "v": "14px"
        },
        {
            "k": "cursor",
            "v": "pointer"
        },
        {
            "k": "outline",
            "v": "none"
        },
        {
            "k": "background",
            "v": "transform"
        },
        {
            "k": "border",
            "v": "none"
        },
        {
            "k": "display",
            "v": "inline-block"
        }
    ],
    "attrs": [
        {
            "name": "name",
            "value": "test link"
        },
        {
            "name": "disabled",
            "value": false
        }
    ],
    "styleAttrs": [
        {
            "name": "type",
            "value": "default"
        }
    ],
    "events": [
        "click"
    ]
}
```

### attrs

- name - string
- disabled - boolean

### styleAttrs

- type - string

## bp-menu

### 生成 JSON

```json
{
    "id": "test",
    "type": "BPMenu",
    "cat": "0",
    "name": "bp-menu",
    "layout": [],
    "css": [
        {
            "k": "width",
            "v": "208px"
        },
        {
            "k": "height",
            "v": "auto"
        },
        {
            "k": "padding",
            "v": "0"
        },
        {
            "k": "margin",
            "v": "0"
        }
    ],
    "components": [
        {
            "id": "test",
            "type": "BPMenuItem",
            "cat": "1",
            "text": "menu item zero",
            "icon": "home-filled",
            "name": "bp-menu-item"
        },
        {
            "id": "test",
            "type": "BPMenuItem",
            "cat": "1",
            "text": "menuItem 1",
            "icon": "marketplace",
            "name": "bp-menu-item"
        },
        {
            "id": "test",
            "type": "BPMenuItem",
            "cat": "1",
            "text": "sub menu 2",
            "icon": "male",
            "name": "bp-menu-item"
        },
        {
            "id": "test",
            "type": "BPSubMenu",
            "cat": "0",
            "text": "menu button 3",
            "icon": "point",
            "name": "bp-sub-menu",
            "layout": [],
            "css": [
                {
                    "k": "width",
                    "v": "100%"
                },
                {
                    "k": "min-height",
                    "v": "40px"
                },
                {
                    "k": "height",
                    "v": "auto"
                },
                {
                    "k": "color",
                    "v": "#505F79"
                },
                {
                    "k": "padding",
                    "v": "0 12px"
                },
                {
                    "k": "display",
                    "v": "flex"
                },
                {
                    "k": "flex-direction",
                    "v": "column"
                },
                {
                    "k": "justify-content",
                    "v": "center"
                },
                {
                    "k": "align-items",
                    "v": "flex-start"
                },
                {
                    "k": "color",
                    "v": "#3172E0",
                    "tp": "hover"
                }
            ],
            "components": [
                {
                    "id": "test",
                    "type": "BPMenuItem",
                    "cat": "1",
                    "text": "menu item first",
                    "name": "bp-menu-item",
                    "layout": [],
                    "css": []
                },
                {
                    "id": "test",
                    "type": "BPMenuItem",
                    "cat": "0",
                    "text": "second menu item",
                    "name": "bp-menu-item",
                    "layout": [],
                    "css": [
                        {
                            "k": "width",
                            "v": "100%"
                        },
                        {
                            "k": "height",
                            "v": "40px"
                        },
                        {
                            "k": "display",
                            "v": "flex"
                        },
                        {
                            "k": "align-items",
                            "v": "center"
                        },
                        {
                            "k": "cursor",
                            "v": "pointer"
                        },
                        {
                            "k": "padding",
                            "v": "0 12px"
                        },
                        {
                            "k": "color",
                            "v": "#505F79"
                        },
                        {
                            "k": "box-sizing",
                            "v": "border-box"
                        },
                        {
                            "k": "color",
                            "v": "#3172E0",
                            "tp": "hover"
                        }
                    ]
                }
            ]
        },
        {
            "id": "test",
            "type": "BPMenuItem",
            "cat": "1",
            "text": "NavigationThird",
            "icon": "target",
            "name": "bp-menu-item"
        },
        {
            "id": "test",
            "type": "BPSubMenu",
            "cat": "1",
            "text": "🍉水果🍉",
            "icon": "point",
            "name": "bp-sub-menu",
            "layout": [],
            "components": [
                {
                    "id": "test",
                    "type": "BPMenuItem",
                    "cat": "1",
                    "text": "🍎苹果🍎",
                    "name": "bp-menu-item",
                    "layout": [],
                    "css": []
                },
                {
                    "id": "test",
                    "type": "BPMenuItem",
                    "cat": "1",
                    "text": "🍊哈橘子🍊",
                    "name": "bp-menu-item",
                    "layout": []
                }
            ]
        }
    ]
}
```

这个组件后期可以修改，修改为接受树形结构数据，进行内部展开展示

```javascript
// 可接受的数据大致为
[
    {
        name: "导航一",
        icon: "message",
        child: [
            {
                name: "option1",
                icon: ""
            },
            {
                name: "option2",
                icon: ""
            }
        ]
    },
    {
        name: "navigation2",
        icon: "setting",
        chind:[]
    }
]
```

### attrs

暂未按照 attrs / styleAttrs 重构此组件

### styleAttra

同上

## bp-status

### 生成 JSON

```json
{
    "id": "test",
    "type": "BPStatus",
    "cat": "0",
    "text": "simon test",
    "name": "bp-status",
    "css": [
        {
            "k": "width",
            "v": "max-content"
        },
        {
            "k": "height",
            "v": "16px"
        },
        {
            "k": "padding",
            "v": "0 4px"
        },
        {
            "k": "font-size",
            "v": "12px"
        },
        {
            "k": "line-height",
            "v": "16px"
        },
        {
            "k": "text-align",
            "v": "center"
        },
        {
            "k": "border-radius",
            "v": "4px"
        }
    ],
    "attrs": [
        {
            "name": "statusContent",
            "value": "status test"
        }
    ],
    "styleAttrs": [
        {
            "name": "type",
            "value": "success"
        },
        {
            "name": "subtle",
            "value": true
        }
    ],
    "events": [
        "click",
        "mouseEnter",
        "mouseLeave"
    ]
}
```

### attrs

- statusContent - string 要展示的文字

### styleAttrs

- type - string  status 的类别
- subtle - boolean 背景及字体浅深色转换

## bp-table

### 生成 JSON

```json
{
    "id": "table-demo",
    "type": "BPTable",
    "cat": "0",
    "name": "bp-table",
    "layout": [],
    "css": [
        {
            "k": "width",
            "v": "100%"
        },
        {
            "k": "height",
            "v": "auto"
        },
        {
            "k": "padding",
            "v": "0"
        },
        {
            "k": "margin",
            "v": "0"
        },
        {
            "k": "position",
            "v": "relative"
        },
        {
            "k": "box-sizing",
            "v": "border-box"
        }
    ],
    "attrs": [
        {
            "name": "tid",
            "value": "bp-table-test"
        },
        {
            "name": "confReqAdd",
            "value": "http://192.168.100.59:5555"
        },
        {
            "name": "tableData",
            "value": null
        }
    ],
    "styleAttrs": [
        {
            "name": "border",
            "value": false
        }
    ]
}
```

### attrs

- tid - string 区分表格的 id ，具有唯一性

- confReqAdd - string 表格配置请求的地址，暂未用到

- tableData - promise 表格的数据. 

     

```javascript
// tableData 格式
{
    rows: [
        {
        	PROD_MOM:"someValue1",
        	EI: "EIvalue1"
        },
        {
        	PROD_MOM:"someValue2",
        	EI: "EIvalue2"
        },
    ],
    columns: [ 
        { name: "产品销售增长率", valuePath: "PROD_MOM", isSortable: true, cellComponent: "format-percentage" },
        { name: "EI", valuePath: "EI", isSortable: true, cellComponent: "format-decimal" }
    ]
}
```



### styleAttrs

- border - boolean 是否有边框

## bp-tag

### 生成 JSON

```json
{
    "id": "test",
    "type": "BPTag",
    "cat": "0",
    "text": "simon test",
    "name": "bp-tag",
    "css": [
        {
            "k": "width",
            "v": "max-content"
        },
        {
            "k": "height",
            "v": "20px"
        },
        {
            "k": "padding",
            "v": "0 4px"
        },
        {
            "k": "border-radius",
            "v": "4px"
        },
        {
            "k": "font-size",
            "v": "14px"
        },
        {
            "k": "text-align",
            "v": "center"
        },
        {
            "k": "line-height",
            "v": "20px"
        }
    ],
    "attrs": [
        {
            "name": "tagContent",
            "value": "tag test"
        }
    ],
    "styleAttrs": [
        {
            "name": "type",
            "value": "blue"
        },
        {
            "name": "subtle",
            "value": true
        },
        {
            "name": "show",
            "value": true
        }
    ],
    "events": [
        "click",
        "mouseEnter",
        "mouseLeave"
    ]
}
```

### attrs

- tagContent - string tag的文本内容

### styleAttrs 

- type - string 标签的样式类型
- subtle - boolean 标签的背景及字体浅深色转换
- show - boolean 是否展示

## bp-text

文本容器

### 使用实例

```json
{
    "id": "bp-text-creater",
    "type": "BPText",
    "cat": "0",
    "text": "how you doing",
    "name":"bp-text",
    "css": [
        {
            "k": "height",
            "v": "auto"
        },
        {
            "k": "width",
            "v": "auto"
        },
        {
            "k": "padding",
            "v": "0"
        },{
            "k": "color",
            "v": "red"
        },{
            "k": "background",
            "v": "transparent"
        }
    ],
    "components": [],
    "attrs": [
        {
            "name": "tagName",
            "value": "span",
            "type": "string"
        }
    ],
    "styleAttrs": []
}
```

### attrs

基础组件接收的属性，例如：

- tagName
- classNames

等

## bp-viewport

### 生成 JSON

```json
{
    "id": "test",
    "type": "BPViewport",
    "cat": "0",
    "name":"bp-viewport",
    "css": [    
        {
            "k": "margin",
            "v": "0 24px"
        },
        {
            "k": "positon",
            "v": "relative"
        }
    ],
    "attrs": [
        {
            "name": "height",
            "value": "120px"
        },
        {
            "name": "width",
            "value": "calc(100% - 48px)"
        },
        {
            "name": "clickChange",
            "value": true,
            "type": "boolean"
        },
        {
            "name": "vid",
            "value": "bp-viewport-test"
        },
        {
            "name": "step",
            "value": 200,
            "type": "number"
        }
    ],
    "styleAttrs": [
        {
            "name": "row",
            "value": true,
            "type": "boolean"
        }
    ],
    "events": ["click"]
}
```

### attrs

- height - string 容器的高度
- width - string 容器的宽度
- clickChange - boolean 左右点击移动的位置是否显示
- vid - string 组件的 id ，具有唯一性
- step - number 进步的大小

### styleAttrs

- row - boolean 疑似横纵向