
import uniqueId from 'lodash/uniqueId'
import update from 'immutability-helper'
import { Transforms } from 'slate'
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


export const reImgSize = (e, editor, style, direction) => {
    if(direction === 'top-left') {
        //如果是左上角
        Transforms.setNodes(
            editor,
            { style: {...style, scale: 2} },
            { match: n => n.type === 'img' }
        )
    }
}
