import { jsx } from 'slate-hyperscript'

let reg = new RegExp('pt$', 'i')

/**
 * 连接字符变为驼峰
 * @param {string} str 
 */
function test(str) {
    var a = str.split("-");
    for (var i = 1; i < a.length; i++) {
        a[i] = a[i][0].toUpperCase() + a[i].slice(1)
    }
    return a.join('');
}

const styleStrToObj = style => {
    style = style.split(';')
    style = style.map(item => item.split(':'))
    let obj = {}
    style.forEach(item => {
        if(item[0]) {
            if(item[0].includes('-')) {
                item[0] = test(item[0])
            }
            //pt单位转为px
            if(reg.test(item[1])) item[1] = item[1].substring(0, item[1].length - 2) + 'px'     
            obj[item[0]] = item[1]
        }
    })
    return obj
}

const deserialize = el => {
    
    if (el.nodeType === 3) {
        return el.textContent
    } else if (el.nodeType !== 1) {
        return null
    }
    
    let style = el.getAttribute('style') || {}

    if(typeof style === 'string') style = styleStrToObj(style)
    let children = Array.from(el.childNodes).map(deserialize)
    if(el.nodeName === 'IMG') {
        children = [{ text: '' }]
    }
    if(children.length === 0) return null
    
    switch (el.nodeName) {
        case 'DIV':
            return jsx(
                'element',
                { type: 'page', style },
                children
            )
        case 'TABLE':
            return jsx(
                'element',
                { type: 'table', style },
                children
            )
        case 'TBODY':
            return jsx(
                'element',
                { type: 'tbody', style },
                children
            )
        case 'TR':
            return jsx(
                'element',
                { type: 'table-row', style, rowspan: el.getAttribute('rowspan'), colspan: el.getAttribute('rowspan') },
                children
            )
        case 'TD':
            return jsx(
                'element',
                { type: 'table-cell', style },
                children
            )
        case 'BODY':
            return jsx('fragment', { style }, children)
        case 'BR':
            return '\n'
        case 'BLOCKQUOTE':
            return jsx('element', { type: 'quote', style }, children)
        case 'P':
            return jsx('element', { type: 'paragraph', style }, children)
        case 'IMG':
            return jsx(
                'element',
                { type: 'img', url: el.getAttribute('src'), style },
                children
            )
        // case 'A':
        //     return jsx(
        //         'element',
        //         { type: 'link', url: el.getAttribute('href'), style },
        //         children
        //     )
        default:
            return el.textContent
    }
}

//判断是否含有空children
const isEnter = node => {
    while(node.children && node.children.length > 0) {
        node = node.children[0]
    }
    if(node.children && node.children.length === 0) return false
    else return true
}

//对于空的children添加占位符  针对表格
const add = node => {
    if(node.children) {
        if(node.children.length === 0) {
            node.children.push(jsx('element', { type: 'paragraph', style: {} }, [{ text: '' }]))
        } else {
            node.children.forEach(item => item.children && add(item))
        }
    }

}

export default function (html) {
    const document = new DOMParser().parseFromString(html, 'text/html')
    
    let res = deserialize(document.body).reduce((prve, next) => prve.concat(next.children), [])
    let ans = []
    res.forEach(item => {
        if(isEnter(item)) {
            //对表格进行一些额外的处理
            if(item.type === 'table') {
                //去掉tbody层
                item.children = item.children[0].children
                //如果出现空了的td 就添加空字符串
                add(item)
            }
            if(item.children[0].type === 'img') {
                item = item.children[0]
                item.style.width =  item.style.width.substring(0, item.style.width.length - 2)
                item.style.initWidth = ~~item.style.width
            }
            ans.push(item)
        }
    })
    return ans
}