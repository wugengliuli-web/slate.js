import { Transforms } from 'slate'
import throttle from './throttle'
import { setImgAction } from '../store/action'
export const addImgBlock = (dispatch, pageIndex, index, url, editor, width) => {
    const action = setImgAction(pageIndex, index, url, editor, width)
    dispatch(action)
}

export const startReImgSize = (e, editor, style, direction) => {
    let dom = document.querySelector('#wrapper')
    let directionInfo = {
        direction,
        left: e.pageX,
        top: e.pageY
    }
    dom.onmousemove = function (e) {
        e.preventDefault()
        reImgSize(e, editor, style, directionInfo)
    }
    dom.onmouseup = function (e) {
        endReImgSize(editor)
    }
}

export const endReImgSize = (editor) => {
    let dom = document.querySelector('#wrapper')
    dom.onmousemove = null
    dom.onmouseup = null
    let { style } = editor.children[0]
    let { width } = style
    Transforms.setNodes(
        editor,
        { style: { ...style, initWidth: width, width } },
        { match: n => n.type === 'img' }
    )
}


export const reImgSize = throttle(function () {
    let [e, editor, style, directionInfo] = Array.from(arguments[0])
    if (!directionInfo) return
    let { direction, left, top } = directionInfo
    let { initWidth } = style
    let newLeft, newTop, sum, endWidth
    newLeft = e.pageX
    newTop = e.pageY
    if (direction === 'top-left') {
        /**
         * 如果是点击左上角 向左 上 变大 下 右变小
         * 
         */
        sum = ((-(newLeft - left)) + (-(newTop - top)))  + initWidth
    } else if (direction === 'top-right') {
        /**
         * 如果是点击右上角 上 右 变大 左 下变小
         */
        sum = ((newLeft - left) + (-(newTop - top)))  + initWidth
    } else if (direction === 'bottom-left') {
        /**
         * 如果是点击左下角 下 左 变大 右 上 变小
         */
        sum = ((-(newLeft - left)) + (newTop - top))  + initWidth
    } else {
        /**
         * 如果是点击右下角 右 下 变大 左 上 变小
         */
        sum = ((newLeft - left) + (newTop - top))  + initWidth
    }
    endWidth = sum < 34 ? 34 : sum
    endWidth = endWidth > 696 ? 696 : endWidth
    Transforms.setNodes(
        editor,
        { style: { ...style, width: endWidth } },
        { match: n => n.type === 'img' }
    )
}, 50)