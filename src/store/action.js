import { 
    changeEditorValue,
    addPage,
    addEditor,
    exchangeEditor
 } from './actionType'
export const changeEditorValueAction = (pageIndex, index, value) => {
    return {
        type: changeEditorValue,
        pageIndex,  //第几页
        index,  //第几页的第几块
        value
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