import updata from 'immutability-helper'
import {
    changeEditorValue,
    addPage,
    addEditor,
    exchangeEditor,
    setImg,
    copyEl,
    delEl,
    setVal
} from './actionType'
import uniqueId from 'lodash/uniqueId'

const initState = {
    state: []  //数据
}


const reducer = (state = initState, action) => {
    // let a = state.state.map(item => {
    //     return item.map(item => {
    //         return item.content
    //     })
    // })
    // console.log('json->',JSON.stringify(a))
    // console.log(state)
    let { type } = action
    switch(type) {
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
                    $push: [[]]
                }
            })
        case addEditor:
            const { pageIndex: pageIndexAddEditor, index: indexAddEditor, value: valueAddEditor } = action
            return updata(state, {
                state: {
                    [pageIndexAddEditor]: {
                        $splice: [[indexAddEditor, 0, valueAddEditor]]
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
                        $splice: [[index1, 0, source]]
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
                        $splice: [[copyIndex, 0, newEditor]]
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
                        $splice: [[delIndex, 1]]
                    }
                }
            })
        case setVal:
            const { val } = action
            return {
                state: val
            }
        default:
            return state
    }
}

export default reducer