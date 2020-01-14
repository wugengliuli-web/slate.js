
import uniqueId from 'lodash/uniqueId'
import update from 'immutability-helper'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
export const addImgBlock = (setState, index, url, state, editor) => {
    //将添加图片替换为图片元素
    setState(update(state, {
        [index]: {
            $set: {
                editor,
                id: uniqueId(),
                content: [{
                    type: 'img',
                    showToolbar: false,
                    children: [{ text: '' }],
                    url,
                    style: {
                        'textAlign': 'center'
                    }
                }]
            }
        }
    }))
}

export const startReImgSize = (e, editor, direction) => {
    Transforms.setNodes(
        editor,
        { directionInfo: {
            direction,
            left: e.pageX,
            top: e.pageY
        } },
        { match: n => n.type === 'img' }
    )
    ReactEditor.focus(editor)
}

export const endReImgSize = editor => {
    Transforms.setNodes(
        editor,
        { directionInfo: null },
        { match: n => n.type === 'img' }
    )
    ReactEditor.focus(editor)
}


export const reImgSize = (e, editor, style, directionInfo) => {
    if(!directionInfo) return
    let { direction, left, top } = directionInfo
    let { width } = style
    if(direction === 'top-left') {
        /**
         * 左上角 向上或者向左移位为放大
         * 
         */
        let newLeft = e.pageX
        let newTop = e.pageY
        // let sum = newLeft - 
    }
}
