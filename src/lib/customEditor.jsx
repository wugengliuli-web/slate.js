
import uniqueId from 'lodash/uniqueId'
import update from 'immutability-helper'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import throttle from './throttle'
export const addImgBlock = (setState, index, url, state, editor, width) => {
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
                        'textAlign': 'center',
                        width
                    }
                }]
            }
        }
    }))
}

export const startReImgSize = (e, editor, direction) => {
    Transforms.setNodes(
        editor,
        {
            directionInfo: {
                direction,
                left: e.pageX,
                top: e.pageY
            }
        },
        { match: n => n.type === 'img' }
    )
    ReactEditor.focus(editor)
}

export const endReImgSize = (editor) => {
    Transforms.setNodes(
        editor,
        { directionInfo: null },
        { match: n => n.type === 'img' }
    )
    ReactEditor.focus(editor)
}


export const reImgSize = throttle(function() {
    let [e, editor, style, directionInfo] = Array.from(arguments[0])
    if (!directionInfo) return
    let { direction, left, top } = directionInfo
    let { width } = style
    if (direction === 'top-left') {
        /**
         * 左上角 向左上 右上 左下为变大 右下变小
         * 
         */
        let newLeft = e.pageX
        let newTop = e.pageY
        let sum = (newLeft - left) + (newTop - top)
        Transforms.setNodes(
            editor,
            { style: { ...style, width: sum } },
            { match: n => n.type === 'img' }
        )
    }
}, 100)