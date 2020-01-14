
import uniqueId from 'lodash/uniqueId'
import update from 'immutability-helper'
export const addImgBlock = (setState, index, url, state, editor) => {
    //将添加图片替换为图片元素
    setState(update(state, {
        [index]: {
            $set: {
                editor,
                id: uniqueId(),
                isShowToolBar: false,
                content: [{
                    type: 'img',
                    children: [{ text: '' }],
                    url
                }]
            }
        }
    }))
}
