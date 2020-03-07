import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import { withWrapper } from '../lib/with'
import uniqueId from 'lodash/uniqueId'
import parse5 from 'parse5'
function setStyle(item) {
    let obj = {}

    let { type, style, size, width } = item

    if(size) {
        obj.fontSize = size + 'px'
    }

    if(style === 'Title') {
        obj.fontWeight = 'bolder'
        obj.textAlign = 'center'
    }

    if(width) {
        obj.initWidth = ~~width
        obj.width = ~~width
    }
    return obj
}


function setType(item) {
    let { type, style } = item
    if(type === 'heading') {
        switch(style) {
            case 'Heading1':
                return 'heading-one'
            case 'Heading2':
                return 'heading-two'
            case 'Heading3':
                return 'heading-three'
            default:
                return 'p'
        }
    } else if(type === 'image') {
        return 'img'
    } else if(type === 'list') {
        let { list: { type: listType } } = item
        switch(listType) {
            case 'ul':
                return 'bulleted-list'
            case 'ol':
                return 'numbered-list'
            default:
                return 'p'
        }
    }
    return 'p'
}


function setChilren(content) {
    let arr = []
    
    const document = parse5.parseFragment(content)
    let { childNodes = [] } = document
    arr = loop(childNodes)
    return arr
}


function loop(childNodes) {
    return childNodes.map(item => {
        let obj = {}
        let { nodeName, childNodes, attrs = [] } = item
        obj.text = item.value || ''
        attrs.forEach(item => {
            let { name, value } = item
            if(name === 'style') {
                value = value.split(';')
                value = value.map(item => {
                    return item.split(':')
                })
                value.forEach(item => {
                    obj[item[0]] = item[1]
                })
            }
        })
        //i斜体 b加粗 del删除线   u下划线
        if(nodeName === 'i') {
            obj.italic = true
        } else if(nodeName === 'b') {
            obj.bold = true
        } else if(nodeName === 'del') {
            obj.strikethrough = true
        } else if(nodeName === 'u') {
            obj.underline = true
        }

        if(childNodes && childNodes.length > 0) {
            obj.text = loop(item.childNodes)[0].text || ''
        }
        return obj
    })
}

function setContent(item) {
    let obj = {}
    obj.style = setStyle(item)
    let { type, dataUri } = item
    obj.type = setType(item)
    if(type === 'image' && dataUri) {
        obj.url = dataUri
    } if(obj.type === 'numbered-list' || obj.type === 'bulleted-list') {
        console.log(item)
        obj.children = item.list.data.map(item => {
            return {
                type: 'list-item',
                children: [{ text: item }]
            }
        })
    } else {
        obj.children = setChilren(item.content)
    }
    
    return obj
}

export const jsonTomyJson = items => {
    let state = []
    items = items.map(item => {
        let obj = {}
        obj.showToolbar = false
        obj.content = [setContent(item)]
        obj.editor = withReact(withWrapper(createEditor()))
        obj.id = uniqueId()
        return obj
    })
    state.push(items)
    console.log(state)
    return state
}