import { 
    changeEditorValue,
    addPage,
    addEditor,
    exchangeEditor,
    setImg,
    copyEl,
    delEl,
    delRow,
    delCol,
    mergeLeft,
    mergeRight,
    setVal
 } from './actionType'
import { DefaultElement } from 'slate-react'
export const changeEditorValueAction = (pageIndex, index, value, isFocus) => {
    return {
        type: changeEditorValue,
        pageIndex,  //第几页
        index,  //第几页的第几块
        value,
        isFocus
    }
}

export const addPageAction = () => {
    return {
        type: addPage
    }
}

export const addEditorAction = (pageIndex, index, value) => {
    return {
        type: addEditor,
        pageIndex,  //第几页
        index,  //第几页的第几块
        value
    }
}

export const exchangeEditorAction = (sourceInfo, destinationInfo) => {
    return {
        type: exchangeEditor,
        sourceInfo, //源
        destinationInfo  //目标
    }
}

export const setImgAction = (pageIndex, index, url, editor, width) => {
    return {
        type: setImg,
        pageIndex,
        index,
        url,
        editor,
        width
    }
}

export const copyElAction = (pageIndex, index, editor) => {
    return {
        type: copyEl,
        pageIndex,
        index,
        editor
    }
}


export const delAction = (pageIndex, index) => {
    return {
        type: delEl,
        pageIndex,
        index
    }
}

export const delRowAction = (pageIndex, index, row) => {
    return {
        type: delRow,
        pageIndex,
        index,
        row
    }
}

export const delColAction = (pageIndex, index, column) => {
    return {
        type: delCol,
        pageIndex,
        index,
        column
    }
}

export const mergeLeftAction = (pageIndex, index, position) => {
    return {
        type: mergeLeft,
        pageIndex,
        index,
        position
    }
}

export const mergeRightAction = (pageIndex, index, position) => {
    return {
        type: mergeRight,
        pageIndex,
        index,
        position
    }
}

export const setValAction = val => {
    return {
        type: setVal,
        val
    }
}