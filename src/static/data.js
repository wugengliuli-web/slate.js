/**
 * !children不能为空 默认为一个span
 * !span为 { text: '', style: {} } 放于children中
 * ! 每一个p标签代表一个块状
 */
{
    text: '',
    style: {},
    bold: true, //加粗
    italic: true //斜体
    underline: true //下划线
    strikethrough: true //删除线
}
[{
    "type": "block-quote",  /*blockquote标签*/
    "style": {},
    "children": []
}, {
    "type": "bulleted-list", /**ul标签 */
    "style": {},
    "children": []
}, {
    type: "heading-one",  //h1标签
    style: {},
    children: []
}, {
    type: "heading-two",  //h2标签
    style: {},
    children: []
}, {
    type: "ListLtem",  //li标签
    style: {},
    children: []
}, {
    type: "NumberedList",  //ol标签
    style: {},
    children: []
}, {
    type: "check-list-item",  //选择标签
    style: {},
    children: []
}, {
    /**
     * 注意图片
     */
    type: 'Img', //图片标签
    style: {
        initWidth: number  //必须有 用来进行图片的拖动放大和缩小
    },
    children: [] 
}, {
    type: 'table',
    style: {},
    children: []
}, {
    type: 'TableRow',
    style: {},
    rowspan: number, //可有可不有
    colspan: number,  //可有可不有
    children: []
}, {
    type: 'TableCell',
    style: {},
    children: []
}]