import updata from 'immutability-helper'
import {
    changeEditorValue,
    addPage,
    addEditor,
    exchangeEditor,
    setImg,
    copyEl,
    delEl,
    setVal,
    addPreCol,
    addNextCol,
    addPreRow,
    addNextRow
} from './actionType'
import uniqueId from 'lodash/uniqueId'

const initState = {
    state: [] //数据
}


const reducer = (state = initState, action) => {
    // let a = state.state.map(item => {
    //     return item.map(item => {
    //         return item.content
    //     })
    // })
    // console.log('json->',JSON.stringify(a))
    console.log(state)
    let { type } = action
    switch (type) {
        case changeEditorValue:
            const { pageIndex, index, value, isFocus } = action
            return updata(state, {
                state: {
                    [pageIndex]: {
                        [index]: {
                            showToolbar: {
                                $set: isFocus
                            },
                            content: {
                                $set: value
                            }
                        }
                    }
                }
            })
        case addPage:
            return updata(state, {
                state: {
                    $push: [
                        []
                    ]
                }
            })
        case addEditor:
            const { pageIndex: pageIndexAddEditor, index: indexAddEditor, value: valueAddEditor } = action
            return updata(state, {
                state: {
                    [pageIndexAddEditor]: {
                        $splice: [
                            [indexAddEditor, 0, valueAddEditor]
                        ]
                    }
                }
            })
        case exchangeEditor:
            const { sourceInfo, destinationInfo } = action
            const { page2, index2 } = sourceInfo
            const { page1, index1 } = destinationInfo
            let [source] = state.state[page2].splice(index2, 1)
            return updata(state, {
                state: {
                    [page1]: {
                        $splice: [
                            [index1, 0, source]
                        ]
                    }
                }
            })
        case setImg:
            const {
                pageIndex: imgPageIndex,
                index: imgIndex,
                url: imgUrl,
                editor: imgEditor,
                width: imgWidth
            } = action
            return updata(state, {
                state: {
                    [imgPageIndex]: {
                        [imgIndex]: {
                            $set: {
                                editor: imgEditor,
                                id: uniqueId(),
                                showToolbar: false,
                                content: [{
                                    type: 'img',
                                    children: [{ text: '' }],
                                    url: imgUrl,
                                    style: {
                                        'textAlign': 'center',
                                        width: imgWidth,
                                        initWidth: imgWidth
                                    }
                                }]
                            }
                        }
                    }
                }
            })
        case copyEl:
            const {
                editor: copyEditor,
                pageIndex: copyPageIndex,
                index: copyIndex
            } = action
            let newEditor = Object.assign({}, state.state[copyPageIndex][copyIndex])
            newEditor.id = uniqueId()
            newEditor.editor = copyEditor
            newEditor.content = JSON.parse(JSON.stringify(state.state[copyPageIndex][copyIndex].content))
            newEditor.showToolbar = false
            return updata(state, {
                state: {
                    [copyPageIndex]: {
                        $splice: [
                            [copyIndex, 0, newEditor]
                        ]
                    }
                }
            })
        case delEl:
            const {
                pageIndex: delPageIndex,
                index: delIndex
            } = action
            return updata(state, {
                state: {
                    [delPageIndex]: {
                        $splice: [
                            [delIndex, 1]
                        ]
                    }
                }
            })
        case setVal:
            const { val } = action
            return {
                state: val
            }
        case addPreCol:
            const {
                editor: focusEditor,
                paseIndex: focusPageIndex,
                index: focusIndex
            } = action
            let { selection } = focusEditor
            if (!selection) return
            let { focus } = selection
            if (!focus) return
                // let[,raw,colum]=focusEditor.selection.focus.path
                // 得到选中列
            let [, , column] = focusPageIndex.selection.focus.path
            let newCol = state.state[focusPageIndex][focusIndex].content[0].column + 1
            let children = Array.from(state.state[focusPageIndex][focusIndex].content[0].children).map((item, index) => {
                item = JSON.parse(JSON.stringify(item))
                    // item.children.splice(column, 0)
                for (let i = 0; item.children.length < newCol; i++) {
                    let text
                    if (i < column + 1 || i > column + 1) {
                        if (i < column) {
                            text = state.state[focusPageIndex][focusIndex].content[0].children[index].text;
                        } else {
                            text = state.state[focusPageIndex][focusIndex].content[0].children[index + 1].text;
                        }
                        item.children.push({
                            type: 'table-cell',
                            children: [{
                                type: 'table-content',
                                children: [{ text: text }]
                            }]
                        })
                    } else {
                        item.children.push({
                            type: 'table-cell',
                            children: [{
                                type: 'table-content',
                                children: [{ text: '' }]
                            }]
                        })
                    }

                }
                return item
            })
            return updata(state, {
                state: {
                    [focusPageIndex]: {
                        [focusIndex]: {
                            content: {
                                [0]: {
                                    column: {
                                        $set: newCol
                                    },
                                    children: {
                                        $set: children
                                    }
                                }
                            }
                        }
                    }
                }
            })
        case addNextCol:
            const {
                editor: focusEditor,
                paseIndex: focusPageIndex,
                index: focusIndex
            } = action
            let { selection } = focusEditor
            if (!selection) return
            let { focus } = selection
            if (!focus) return
                // let[,raw,colum]=focusEditor.selection.focus.path
                // 得到选中列
            let [, , column] = focusPageIndex.selection.focus.path
            let newCol = state.state[focusPageIndex][focusIndex].content[0].column + 1
            let children = Array.from(state.state[focusPageIndex][focusIndex].content[0].children).map((item, index) => {
                item = JSON.parse(JSON.stringify(item))
                    // item.children.splice(column, 0)
                for (let i = 0; item.children.length < newCol; i++) {
                    let text
                    if (i < column || i > column) {
                        if (i < column) {
                            text = state.state[focusPageIndex][focusIndex].content[0].children[index].text;
                        } else {
                            text = state.state[focusPageIndex][focusIndex].content[0].children[index + 1].text;
                        }
                        item.children.push({
                            type: 'table-cell',
                            children: [{
                                type: 'table-content',
                                children: [{ text: text }]
                            }]
                        })
                    } else {
                        item.children.push({
                            type: 'table-cell',
                            children: [{
                                type: 'table-content',
                                children: [{ text: '' }]
                            }]
                        })
                    }

                }
                return item
            })
            return updata(state, {
                state: {
                    [focusPageIndex]: {
                        [focusIndex]: {
                            content: {
                                [0]: {
                                    column: {
                                        $set: newCol
                                    },
                                    children: {
                                        $set: children
                                    }
                                }
                            }
                        }
                    }
                }
            })
        default:
            return state
    }
}

export default reducer