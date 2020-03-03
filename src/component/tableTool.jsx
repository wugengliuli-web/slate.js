import React, { memo } from 'react'
import { css } from 'emotion'
import { Icon } from 'antd'
import update from 'immutability-helper'
import {
    copyElAction,
    delAction
} from '../store/action'
import { setBlockStyle } from './toolBar'
import { useDispatch } from 'redux-react-hook';
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import { withWrapper } from '../lib/with'

/**
 * 表格的工具栏
 */
const TableTool = ({pageIndex, index, editor}) => {
    const dispatch = useDispatch()
    const tool = [{
        title: '复制',
        icon: 'file-add',
        click: e => {
            let newEditor = withReact(withWrapper(createEditor()))
            const action = copyElAction(pageIndex, index, newEditor)
            dispatch(action)
        }
    }, {
        title: '删除',
        icon: 'delete',
        click: e => {
            const action = delAction(pageIndex, index)
            setTimeout(function() {
                dispatch(action)
            }, 100)
        }
    }, {
        title: '左对齐',
        icon: 'align-left',
        click: e => {
            setBlockStyle(editor, {
                textAlign: 'left'
            })
        }
    }, {
        title: '居中对齐',
        icon: 'align-center',
        click: e => {
            setBlockStyle(editor, {
                textAlign: 'center'
            })
        }
    }, {
        title: '右对齐',
        icon: 'align-right',
        click: e => {
            setBlockStyle(editor, {
                textAlign: 'right'
            })
        }
    }, {
        title: '左边插入',
        icon: 'left-square',
        click: e => {
            
        }
    }, {
        title: '右边插入',
        icon: 'right-square',
        click: e => {
            
        }
    }, {
        title: '上边插入',
        icon: 'up-square',
        click: e => {
            
        }
    }, {
        title: '下边插入',
        icon: 'down-square',
        click: e => {
            
        }
    }, {
        title: '删除选中行',
        icon: 'column-width',
        click: e => {
            
        }
    }, {
        title: '删除选中列',
        icon: 'column-height',
        click: e => {
            
        }
    }, {
        title: '向左合并',
        icon: 'double-left',
        click: e => {
            
        }
    }, {
        title: '向右合并',
        icon: 'double-right',
        click: e => {
             
        }
    }]
    return (
        <div className={css`
            position: absolute;
            margin: 0 auto;
            color: rgb(229, 229, 229);
        `}>
            <div className="tool">
                {
                    tool.map((item, index) => {
                        return <span className={css`
                            margin: 1px 2px;
                            cursor: pointer;
                            font-size: 16px;
                            display: inline-block;
                            padding: 2px 4px;
                            background: #414247;
                            transition: background-color .2s, color .2s;
                            &:hover {
                                background: #58595d;
                            }
                        `} onClick={item.click} key={index} title={item.title}>
                            <Icon type={item.icon} />
                        </span>
                    })
                }
            </div>
        </div>
    )
}

export default memo(TableTool, (prve, next) => {
    if(prve.editor !== next.editor || prve.index !== next.index) return false
    else return true
})


// {
//     title: '向下合并',
//     icon: 'vertical-align-bottom',
//     click: e => {
//         /**
//          * 向下合并
//          * 步骤:
//          *  1. 判断当前选择的和下面一个是否已经进行行合并，如果进行了行合并 就不进行操作
//          */
//         let { selection } = editor
//         if(!selection) return
//         let { focus = null } = selection
//         if(!focus) return
//         let [, row, column] = editor.selection.focus.path
//         // let selColumn = 
//         state[index].content[0].children[row].children.forEach(item => {
//             let { rowspan = 1, colspan = 1} = item
//             column = column - (~~colspan - 1) - (~~rowspan - 1)
//         })
//         let len = state[index].content[0].children.length
//         //如果是最后一行 不进行操作
//         if(row === len - 1) return
//         //如果选中单元格已经进行了行合并就不允许进行列合并
//         var { colspan = 1 } = state[index].content[0].children[row].children[column]
//         if(~~colspan > 1) {
//             return
//         }
//         var { colspan = 1 } = state[index].content[0].children[row + 1].children[column]
//         //如果下一行已经进行了行合并就不允许进行列合并
//         if(~~colspan > 1) {
//             return
//         }
//         let { rowspan = 1 } = state[index].content[0].children[row].children[column]
//         let downRowspan = ~~state[index].content[0].children[row + 1].children[column].rowspan || 1
//         rowspan = ~~rowspan + downRowspan
//         //修改rowspan
//         let newState = update(state, {
//             [index]: {
//                 content: {
//                     [0]: {
//                         children: {
//                             [row]: {
//                                 children: {
//                                     [column]: {
//                                         rowspan: {
//                                             $set: rowspan
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         })
        
//         //删除下一行的当前列，如果下一行只剩下一列，就删除全部
//         if(state[index].content[0].children[row + 1].children.length === 1) {
//             newState = update(newState, {
//                 [index]: {
//                     content: {
//                         [0]: {
//                             children: {
//                                 $splice: [[row + 1, 1]]
//                             }
//                         }
//                     }
//                 }
//             })
//         } else {
//             newState = update(newState, {
//                 [index]: {
//                     content: {
//                         [0]: {
//                             children: {
//                                 [row + 1]: {
//                                     children: {
//                                         $splice: [[column, 1]]
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             })
//         }
//         setState(newState)
//     }
// }