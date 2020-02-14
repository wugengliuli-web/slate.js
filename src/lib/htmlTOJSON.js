import { jsx } from 'slate-hyperscript'

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
    
    const children = Array.from(el.childNodes).map(deserialize)
    
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
                { type: 'Img', url: el.getAttribute('url'), style },
                children
            )
        case 'A':
            return jsx(
                'element',
                { type: 'link', url: el.getAttribute('href'), style },
                children
            )
        default:
            return jsx('element', { type: 'paragraph', style }, children)
    }
}

export default function (html) {
    const document = new DOMParser().parseFromString(html, 'text/html')
    return deserialize(document.body)
}