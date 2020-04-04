/**
 * 针对块的样式
 * textIndent: 20px  //缩进 
 * textAlign: center/right/left  //文字的居中 靠右 靠左 
 * lineHeight: 20px //文字行高 
 */

/**
 * 针对文字的样式
 * bold: true  //加粗 
 * italic: true  //斜体
 * underline: true //下划线
 * strikethrough: true //删除线
 * color: #000   //文字颜色
 * fontSize: 20px  //文字大小
 * background: #000  //文字背景色
 * fontFamily:   //文字字体
 */

/**
  {
      type: "heading-one"
      children: [
          {text: "13"},
          {text: "1", underline: true},
          {text: "3123", color: "#f0d264", underline: true},
          {text: "1", underline: true},
          {text: "231"},
          {text: "3131232", background: "#f0d264"}
      ]
      style: {lineHeight: "3.0", textAlign: "center"}
  }
  说明：文字相关的样式放在text对象中，块的样式放在父级的style中

  {
      type: "table-cell",
      children: [{
          type: "table-content",
          children: [
              {text: "1"},
              {text: "3123", italic: true},
              {text: "1231", color: "#f0d264", italic: true},
              {text: "2", color: "#f0d264"},
              {text: "313"}
          ]
      }],
      style: {textAlign: "center"}
  }

  //表格文字样式放在text中，块级样式放在tr中
 */

/**
 {
     type: "bulleted-list"
     children: [{
         type: "list-item"
         children: [
             {text: "111"},
             {text: "111", color: "#f0d264"},
             {text: "1"}
         ]
         style: {textAlign: "center"}
     }, {
         type: "list-item"
         children: [
             {text: "111"},
             {text: "111", color: "#f0d264"},
             {text: "1"}
         ]
         style: {textAlign: "center"}
     }]
 }
 圆点序列结构 一个item就是一排
 */


/**
     {
        type: "numbered-list"
        children: [{
            type: "list-item"
            children: [
                {text: "111"},
                {text: "111", color: "#f0d264"},
                {text: "1"}
            ]
            style: {textAlign: "center"}
        }, {
            type: "list-item"
            children: [
                {text: "111"},
                {text: "111", color: "#f0d264"},
                {text: "1"}
            ]
            style: {textAlign: "center"}
        }]
    }
    //数字列表结构  一个item就是一排
*/

/**
//表格中嵌套列表的情况
{
    "type": "table",
    "row": 2,
    "column": 2,
    "children": [{
        "type": "table-row",
        "children": [{
            "type": "table-cell",
            "children": [{
                "type": "bulleted-list",
                "children": [{
                    "type": "list-item",
                    "children": [{
                        "text": "11111"
                    }, {
                        "text": "111",
                        "color": "#6698cb"
                    }, {
                        "text": "1111"
                    }, {
                        "text": "231",
                        "background": "#82c8a0"
                    }, {
                        "text": "31"
                    }],
                    "checked": false,
                    "style": "{}"
                }]
            }],
            "style": {}
        }, {
            "type": "table-cell",
            "children": [{
                "type": "table-content",
                "children": [{
                    "text": ""
                }]
            }],
            "style": {}
        }]
    }, {
        "type": "table-row",
        "children": [{
            "type": "table-cell",
            "children": [{
                "type": "table-content",
                "children": [{
                    "text": ""
                }]
            }]
        }, {
            "type": "table-cell",
            "children": [{
                "type": "table-content",
                "children": [{
                    "text": ""
                }]
            }]
        }]
    }]
}

 */

/**
 * 分割线格式
 * {
 *     "type":"divider",
 *     "children":[{"text":""}]
 * }
 */

/**
 * 块状引用
 * {
 *    "type":"block-quote",
 *    "children":[{"text":"1111111111111"
 * }
 */