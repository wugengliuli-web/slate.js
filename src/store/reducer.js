import updata from 'immutability-helper'
import {
    changeEditorValue,
    addPage,
    addEditor,
    exchangeEditor
} from './actionType'
const initState = {
    state: []  //数据
}


const reducer = (state = initState, action) => {
    let { type } = action
    switch(type) {
        case changeEditorValue:
            const { pageIndex, index, value } = action
            return updata(state, {
                state: {
                    [pageIndex]: {
                        [index]: {
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
        default:
            return state
    }
}

export default reducer