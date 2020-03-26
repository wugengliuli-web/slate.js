import updata from 'immutability-helper'
import {
    changeEditorValue,
    addPage,
    addEditor,
    exchangeEditor,
    setImg,
    copyEl,
    delRow,
    delCol,
    mergeLeft,
    mergeRight,
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
function getnewClo(table){
    let col = 0;
    for(let i=0;i<table.children.length;i++){
        if (table.children[i].children.length > col) col = table.children[i].children.length;
    }
    return col;
}

const reducer = (state = initState, action) => {
    // let a = state.state.map(item => {
    //     return item.map(item => {
    //             console.log(item.content)
    //         return item.content
    //     })
    // })
    // console.log('json->',JSON.stringify(a))
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
        case delRow:
            const {
                row: delRowPosition,
                pageIndex: delRowPageIndex,
                index: delRowIndex
            } = action
            let newRow = state.state[delRowPageIndex][delRowIndex].content[0].row - 1;
            if (newRow === 0) {
                return updata(state, {
                    state: {
                        [delRowPageIndex]: {
                            $splice: [
                                [delRowIndex, 1]
                            ]
                        }
                    }
                })
            } else {
                return updata(state, {
                    state: {
                        [delRowPageIndex]: {
                            [delRowIndex]: {
                                content: {
                                    [0]: {
                                        row: {
                                            $set: newRow,
                                        },
                                        children: {
                                            $splice: [
                                                [delRowPosition, 1]
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            }
        case delCol:
            const {
                column: delColPosition,
                pageIndex: delColPageIndex,
                index: delColIndex
            } = action
            let newCol = state.state[delColPageIndex][delColIndex].content[0].column - 1
            if (newCol === 0) {
                return updata(state, {
                    state: {
                        [delColPageIndex]: {
                            $splice: [
                                [delColIndex, 1]
                            ]
                        }
                    }
                })
            } else {
                let children = Array.from(state.state[delColPageIndex][delColIndex].content[0].children).map(item => {
                    item = JSON.parse(JSON.stringify(item))
                    item.children.splice(delColPosition, 1)
                        //如果缺少列就补上
                    while (item.children.reduce((prve, next) => {
                            return next.colspan ? prve + Number.parseInt(next.colspan) : prve + 1
                        }, 0) < newCol) {
                        item.children.push({
                            type: 'table-cell',
                            children: [{
                                type: 'table-content',
                                children: [{ text: '' }]
                            }]
                        })
                    }
                    return item
                })
                return updata(state, {
                    state: {
                        [delColPageIndex]: {
                            [delColIndex]: {
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
            }
        case mergeLeft:
            const {
                position: mergeLeftPosition,
                pageIndex: mergeLeftPageIndex,
                index: mergeLeftIndex
            } = action
            let [, rowMergeLeft, columnMergeLeft] = mergeLeftPosition
            //如果是第一列就不进行操作
            if (columnMergeLeft === 0) return state;
            let leftCol = state.state[mergeLeftPageIndex][mergeLeftIndex].content[0].children[rowMergeLeft].children[columnMergeLeft - 1].colspan || 1
            let nowCol = state.state[mergeLeftPageIndex][mergeLeftIndex].content[0].children[rowMergeLeft].children[columnMergeLeft].colspan || 1
            let colspan = Number.parseInt(nowCol) + Number.parseInt(leftCol)
            let newState = updata(state, {
                state: {
                    [mergeLeftPageIndex]: {
                        [mergeLeftIndex]: {
                            content: {
                                [0]: {
                                    children: {
                                        [rowMergeLeft]: {
                                            children: {
                                                [columnMergeLeft]: {
                                                    colspan: {
                                                        $set: colspan
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }

            })
            newState = updata(newState, {
                state: {
                    [mergeLeftPageIndex]: {
                        [mergeLeftIndex]: {
                            content: {
                                [0]: {
                                    children: {
                                        [rowMergeLeft]: {
                                            children: {
                                                $splice: [
                                                    [columnMergeLeft - 1, 1]
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            })
            let cloumnLength=getnewClo(newState.state[mergeLeftPageIndex][mergeLeftIndex].content[0])
            newState = updata(newState, {
                state: {
                    [mergeLeftPageIndex]: {
                        [mergeLeftIndex]: {
                            content: {
                                [0]: {
                                    column:{
                                        $set: cloumnLength
                                    }
                                }
                            }
                        }
                    }
                }
            })
            return newState
        case mergeRight:
            const {
                position: mergeRightPosition,
                pageIndex: mergeRightPageIndex,
                index: mergeRightIndex
            } = action
            let [, rowMergeRight, columnMergeRight] = mergeRightPosition
            let len = state.state[mergeRightPageIndex][mergeRightIndex].content[0].children[rowMergeRight].children.length - 1
                //如果是最后一列就不进行操作
            if (columnMergeRight === len) return state;
            let rightCol = state.state[mergeRightPageIndex][mergeRightIndex].content[0].children[rowMergeRight].children[columnMergeRight + 1].colspan || 1
            let nowColMergeRight = state.state[mergeRightPageIndex][mergeRightIndex].content[0].children[rowMergeRight].children[columnMergeRight].colspan || 1
            let colspanMergeRight = Number.parseInt(nowColMergeRight) + Number.parseInt(rightCol)
            let newStateMergeRight = updata(state, {
                state: {
                    [mergeRightPageIndex]: {
                        [mergeRightIndex]: {
                            content: {
                                [0]: {
                                    children: {
                                        [rowMergeRight]: {
                                            children: {
                                                [columnMergeRight]: {
                                                    colspan: {
                                                        $set: colspanMergeRight
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            })
            newStateMergeRight = updata(newStateMergeRight, {
                state: {
                    [mergeRightPageIndex]: {
                        [mergeRightIndex]: {
                            content: {
                                [0]: {
                                    children: {
                                        [rowMergeRight]: {
                                            children: {
                                                $splice: [
                                                    [columnMergeRight + 1, 1]
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            let cloumnLengthRight = getnewClo(newStateMergeRight.state[mergeRightPageIndex][mergeRightIndex].content[0])
            newStateMergeRight = updata(newStateMergeRight, {
                state: {
                    [mergeRightPageIndex]: {
                        [mergeRightIndex]: {
                            content: {
                                [0]: {
                                    column: {
                                        $set: cloumnLengthRight
                                    }
                                }
                            }
                        }
                    }
                }
            })
            return newStateMergeRight
        case setVal:
            const { val } = action
            return {
                state: val
            }
        case addPreCol:
            const {
                column: focusPreCol,
                pageIndex: focusPreColPageIndex,
                index: focusPreColIndex
            } = action
            let preCol = state.state[focusPreColPageIndex][focusPreColIndex].content[0].column + 1
            let afterAddPreCol = Array.from(state.state[focusPreColPageIndex][focusPreColIndex].content[0].children).map(item => {
                item = JSON.parse(JSON.stringify(item))
                item.children.splice(focusPreCol, 0, {
                    type: 'table-cell',
                    children: [{ 
                        type: 'table-content',
                        children: [{ text: '' }]
                    }]
                })
                return item
            })
            return updata(state, {
                state: {
                    [focusPreColPageIndex]: {
                        [focusPreColIndex]: {
                            content: {
                                [0]: {
                                    column: {
                                        $set: preCol
                                    },
                                    children: {
                                        $set: afterAddPreCol
                                    }
                                }
                            }
                        }
                    }
                }
            })
        case addNextCol:
            const {
                column: focusNextCol,
                pageIndex: focusNextColPageIndex,
                index: focusNextColIndex
            } = action
            let nextCol = state.state[focusNextColPageIndex][focusNextColIndex].content[0].column + 1
            let afterAddNextCol = Array.from(state.state[focusNextColPageIndex][focusNextColIndex].content[0].children).map(item => {
                item = JSON.parse(JSON.stringify(item))
                item.children.splice(focusNextCol + 1, 0, {
                    type: 'table-cell',
                    children: [{ 
                        type: 'table-content',
                        children: [{ text: '' }]
                    }],
                })
                return item
            })
            return updata(state, {
                state: {
                    [focusNextColPageIndex]: {
                        [focusNextColIndex]: {
                            content: {
                                [0]: {
                                    column: {
                                        $set: nextCol
                                    },
                                    children: {
                                        $set: afterAddNextCol
                                    }
                                }
                            }
                        }
                    }
                }
            })
        case addPreRow:
            const {
                row: focusPreRow,
                pageIndex: focusPreRawPageIndex,
                index: focusPreRawIndex
            } = action
            let addNewPreRow = state.state[focusPreRawPageIndex][focusPreRawIndex].content[0].row + 1;
            let oldColumn = state.state[focusPreRawPageIndex][focusPreRawIndex].content[0].column
            let afterAddPreRow = Array.from(state.state[focusPreRawPageIndex][focusPreRawIndex].content[0].children)
            let insertPreRow = []
            for (let i = 0; i < oldColumn; i++) {
                insertPreRow.push({
                    type: 'table-cell',
                    children: [{
                        type: 'table-content',
                        children: [{ text: '' }]
                    }]
                })
            }
            afterAddPreRow.splice(focusPreRow, 0, {
                type: 'table-row',
                children: insertPreRow
            })
            return updata(state, {
                state: {
                    [focusPreRawPageIndex]: {
                        [focusPreRawIndex]: {
                            content: {
                                [0]: {
                                    row: {
                                        $set: addNewPreRow,
                                    },
                                    children: {
                                        $set: afterAddPreRow
                                    }
                                }
                            }
                        }
                    }
                }
            })
        case addNextRow:
            const {
                row: focusNextRow,
                pageIndex: focusNextRawPageIndex,
                index: focusNextRawIndex
            } = action
            let addNewNextRow = state.state[focusNextRawPageIndex][focusNextRawIndex].content[0].row + 1;
            let afterAddNextRaw = Array.from(state.state[focusNextRawPageIndex][focusNextRawIndex].content[0].children)
            let insertNextRow = {
                type: 'table-row',
                children: []
            }
            for (let i = 0; i < afterAddNextRaw[0].children.length; i++) {
                insertNextRow.children.push({
                    type: 'table-cell',
                    children: [{
                        type: 'table-content',
                        children: [{ text: '' }]
                    }]
                })
            }
            afterAddNextRaw.splice(focusNextRow + 1, 0, insertNextRow)
            return updata(state, {
                state: {
                    [focusNextRawPageIndex]: {
                        [focusNextRawIndex]: {
                            content: {
                                [0]: {
                                    row: {
                                        $set: addNewNextRow,
                                    },
                                    children: {
                                        $set: afterAddNextRaw
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