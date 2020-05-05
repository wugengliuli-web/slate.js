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
    setVal,
    addPreCol,
    addNextCol,
    addPreRow,
    jumpPage,
    addNextRow,
    setTempaltes,
    delFlexText,
    addFlexText
} from './actionType'
export const changeEditorValueAction = (editor, pageIndex, value, isFocus) => {
    return {
        type: changeEditorValue,
        pageIndex, //第几页
        value,
        isFocus,
        editor
    }
}

export const jumpPageAction = (pageNumber) => {
    return {
        type: jumpPage,
        pageNumber:pageNumber
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
        pageIndex, //第几页
        index, //第几页的第几块
        value
    }
}

export const exchangeEditorAction = (sourceInfo, destinationInfo) => {
    return {
        type: exchangeEditor,
        sourceInfo, //源
        destinationInfo //目标
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

export const copyElAction = (pageIndex, index, editor, oldEditor) => {
    return {
        type: copyEl,
        pageIndex,
        index,
        editor,
        oldEditor
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

export const addPreColAction = (pageIndex, index, column) => {
    return {
        type: addPreCol,
        pageIndex,
        index,
        column
    }
}

export const addNextColAction = (pageIndex, index, column) => {
    return {
        type: addNextCol,
        pageIndex,
        index,
        column
    }
}

export const addPreRawAction = (pageIndex, index, row) => {
    return {
        type: addPreRow,
        pageIndex,
        index,
        row
    }
}

export const addNextRawAction = (pageIndex, index, row) => {
    return {
        type: addNextRow,
        pageIndex,
        index,
        row
    }
}

export const setTempaltesAction = (state) => {
    return {
        type: setTempaltes,
        newState:state
    }
}

export const delFlexTextAction = (pageIndex, index, childIndex) => {
    return {
        type: delFlexText,
        pageIndex,
        index,
        childIndex
    }
}

export const addFlexTextAction = (pageIndex, index, childIndex, editor) => {
    return {
        type: addFlexText,
        pageIndex,
        index,
        childIndex,
        editor
    }
}