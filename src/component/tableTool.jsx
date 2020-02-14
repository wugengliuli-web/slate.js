import React from 'react'
import { css } from 'emotion'
import { Icon } from 'antd'
import update from 'immutability-helper'
// import { Transforms, Editor } from 'slate'
// import { ReactEditor } from 'slate-react'
import { setBlockStyle } from './toolBar'
/**
 * 表格的工具栏
 */
const TableTool = ({editor, copyEl, index, state, setState}) => {

    const tool = [{
        title: '复制',
        icon: 'file-add',
        click: e => {
            copyEl(editor, index)
        }
    }, {
        title: '删除',
        icon: 'delete',
        click: e => {
            //删除滞后
            setTimeout(_ => {
                setState(update(state, {
                    $splice: [[index, 1]]
                }))
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
            //如果报错 就不执行
            let { selection } = editor
            if(!selection) return
            let { focus = null } = selection
            if(!focus) return
            //row 行
            //column 列
            let [, row, column] = editor.selection.focus.path
            let newColumn = state[index].content[0].column + 1
            let children = Array.from(state[index].content[0].children).map(item => {
                item = JSON.parse(JSON.stringify(item))
                item.children.splice(column, 0, {
                    type: 'table-cell',
                    children: [{ 
                        type: 'table-content',
                        children: [{ text: '' }]
                    }]
                })
                return item
            })
            
            setState(update(state, {
                [index]: {
                    content: {
                        [0]: {
                            column: {
                                $set: newColumn,
                            },
                            children: {
                                $set: children
                            }
                        }
                    }
                }
            }))
        }
    }, {
        title: '右边插入',
        icon: 'right-square',
        click: e => {
            //如果报错 就不执行
            let { selection } = editor
            if(!selection) return
            let { focus = null } = selection
            if(!focus) return
            let [, row, column] = editor.selection.focus.path
            let children = Array.from(state[index].content[0].children).map(item => {
                item = JSON.parse(JSON.stringify(item))
                item.children.splice(column + 1, 0, {
                    type: 'table-cell',
                    children: [{ 
                        type: 'table-content',
                        children: [{ text: '' }]
                    }],
                })
                return item
            })          
            let newColumn = state[index].content[0].column + 1
            setState(update(state, {
                [index]: {
                    content: {
                        [0]: {
                            column: {
                                $set: newColumn,
                            },
                            children: {
                                $set: children
                            }
                        }
                    }
                }
            }))
        }
    }, {
        title: '上边插入',
        icon: 'up-square',
        click: e => {
            let { selection } = editor
            if(!selection) return
            let { focus = null } = selection
            if(!focus) return
            let newRow = state[index].content[0].row + 1
            let oldColumn = state[index].content[0].column
            let [, row, column] = editor.selection.focus.path
            let children = Array.from(state[index].content[0].children)
            let child = []
            for(let i=0;i<oldColumn;i++) {
                child.push({
                    type: 'table-cell',
                    children: [{ 
                        type: 'table-content',
                        children: [{ text: '' }]
                    }]
                })
            }
            children.splice(row, 0, {
                type: 'table-row',
                children: child
            })
            
            setState(update(state, {
                [index]: {
                    content: {
                        [0]: {
                            row: {
                                $set: newRow,
                            },
                            children: {
                                $set: children
                            }
                        }
                    }
                }
            }))
        }
    }, {
        title: '下边插入',
        icon: 'down-square',
        click: e => {
            let { selection } = editor
            if(!selection) return
            let { focus = null } = selection
            if(!focus) return
            let newRow = state[index].content[0].row + 1
            let oldColumn = state[index].content[0].column
            let [, row, column] = editor.selection.focus.path
            let children = Array.from(state[index].content[0].children)
            let child = []
            for(let i=0;i<oldColumn;i++) {
                child.push({
                    type: 'table-cell',
                    children: [{ 
                        type: 'table-content',
                        children: [{ text: '' }]
                    }]
                })
            }
            children.splice(row + 1, 0, {
                type: 'table-row',
                children: child
            })
            
            setState(update(state, {
                [index]: {
                    content: {
                        [0]: {
                            row: {
                                $set: newRow,
                            },
                            children: {
                                $set: children
                            }
                        }
                    }
                }
            }))
        }
    }, {
        title: '删除选中行',
        icon: 'column-width',
        click: e => {
            let { selection } = editor
            if(!selection) return
            let { focus = null } = selection
            if(!focus) return
            let [, row, column] = editor.selection.focus.path
            /**
             * 删除的时候去判断是不是只剩下一行，如果只剩下一行 就删除全部
             */
            let newRow = state[index].content[0].row - 1
            if(newRow === 0) {
                setTimeout(() => {
                    setState(update(state, {
                        $splice: [[index, 1]]
                    }))
                }, 100)
            } else {
                setState(update(state, {
                    [index]: {
                        content: {
                            [0]: {
                                row: {
                                    $set: newRow,
                                },
                                children: {
                                    $splice: [[row, 1]]
                                }
                            }
                        }
                    }
                }))
            }
        }
    }, {
        title: '删除选中列',
        icon: 'column-height',
        click: e => {
            let { selection } = editor
            if(!selection) return
            let { focus = null } = selection
            if(!focus) return
            let [, row, column] = editor.selection.focus.path
            let newColumn = state[index].content[0].column - 1
            /**
             * 删除的时候去判断是不是只剩下一列，如果只剩下一列 就删除全部
             * 删除时先获取所有行的最大列长度，之后判断如果存在行列数不够就补上去
             */
            if(newColumn === 0) {
                setTimeout(() => {
                    setState(update(state, {
                        $splice: [[index, 1]]
                    }))
                }, 100)
            } else {
                
                let children = Array.from(state[index].content[0].children).map(item => {
                    item = JSON.parse(JSON.stringify(item))
                    item.children.splice(column, 1)
                    //如果缺少列就补上
                    while(item.children.reduce((prve, next) => {
                        return next.colspan ? prve + Number.parseInt(next.colspan) : prve + 1
                    }, 0) < newColumn) {
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
                setState(update(state, {
                    [index]: {
                        content: {
                            [0]: {
                                column: {
                                    $set: newColumn
                                },
                                children: {
                                    $set: children
                                }
                            }
                        }
                    }
                }))
            }
        }
    }, {
        title: '向左合并',
        icon: 'double-left',
        click: e => {
            /**
             * 向左合并列
             * 步骤:
             *  1. 取出前面一个和当前的合并列数
             *  2. 相加放在当前这个元素上
             *  3. 删除上的元素
             */
            let { selection } = editor
            if(!selection) return
            let { focus = null } = selection
            if(!focus) return
            let [, row, column] = editor.selection.focus.path
            //如果是第一列就不进行操作
            if(column === 0) return
            let leftCol = state[index].content[0].children[row].children[column - 1].colspan || 1
            let nowCol = state[index].content[0].children[row].children[column].colspan || 1
            let colspan = Number.parseInt(nowCol) + Number.parseInt(leftCol)
            let newState = update(state, {
                [index]: {
                    content: {
                        [0]: {
                            children: {
                                [row]: {
                                    children: {
                                        [column]: { 
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
            })
            newState = update(newState, {
                [index]: {
                    content: {
                        [0]: {
                            children: {
                                [row]: {
                                    children: {
                                        $splice: [[column - 1, 1]]
                                    }
                                }
                            }
                        }
                    }
                }
            })
            setState(newState)
        }
    }, {
        title: '向右合并',
        icon: 'double-right',
        click: e => {
             /**
             * 向右合并列
             * 步骤:
             *  1. 取出后面一个和当前的合并列数
             *  2. 相加放在当前元素
             *  3. 删除下一个的元素
             */
            let { selection } = editor
            if(!selection) return
            let { focus = null } = selection
            if(!focus) return
            let [, row, column] = editor.selection.focus.path
            let len = state[index].content[0].children[row].children.length - 1
            //如果是最后一列就不进行操作
            if(column === len) return
            let rightCol = state[index].content[0].children[row].children[column + 1].colspan || 1
            let nowCol = state[index].content[0].children[row].children[column].colspan || 1
            let colspan = Number.parseInt(nowCol) + Number.parseInt(rightCol)
            let newState = update(state, {
                [index]: {
                    content: {
                        [0]: {
                            children: {
                                [row]: {
                                    children: {
                                        [column]: { 
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
            })
            newState = update(newState, {
                [index]: {
                    content: {
                        [0]: {
                            children: {
                                [row]: {
                                    children: {
                                        $splice: [[column + 1, 1]]
                                    }
                                }
                            }
                        }
                    }
                }
            })
            setState(newState)
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

export default TableTool


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