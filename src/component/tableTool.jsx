import React from 'react'
import { css } from 'emotion'
import { Icon } from 'antd'
import update from 'immutability-helper'
import { Transforms, Editor } from 'slate'
import { ReactEditor } from 'slate-react'
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
        title: '左边插入',
        icon: 'left-square',
        click: e => {
            //如果报错 就不执行
            let { selection } = editor
            if(!selection) return
            let { focus = null } = selection
            if(!focus) return
            let [, row, column] = editor.selection.focus.path
            let children = Array.from(state[index].content[0].children).map(item => {
                item = JSON.parse(JSON.stringify(item))
                item.children.splice(column, 0, {
                    type: 'table-cell',
                    children: [{ 
                        type: 'table-content',
                        children: [{ text: '' }]
                    }],
                    style: {
                        
                    }
                })
                return item
            })          

            setState(update(state, {
                [index]: {
                    content: {
                        [0]: {
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
                    style: {
                        
                    }
                })
                return item
            })          

            setState(update(state, {
                [index]: {
                    content: {
                        [0]: {
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
            let len = state[index].content[0].children[0].children.reduce((prve, next) => {   
                return next.colspan ? prve +  Number.parseInt(next.colspan) : prve + 1 
            }, 0)
            let [, row, column] = editor.selection.focus.path
            let children = Array.from(state[index].content[0].children)
            let child = []
            for(let i=0;i<len;i++) {
                child.push({
                    type: 'table-cell',
                    children: [{ 
                        type: 'table-content',
                        children: [{ text: '' }]
                    }],
                    style: {
                        
                    }
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
            let len = state[index].content[0].children[0].children.reduce((prve, next) => {   
                return next.colspan ? prve +  Number.parseInt(next.colspan) : prve + 1 
            }, 0)
            let [, row, column] = editor.selection.focus.path
            let children = Array.from(state[index].content[0].children)
            let child = []
            for(let i=0;i<len;i++) {
                child.push({
                    type: 'table-cell',
                    children: [{ 
                        type: 'table-content',
                        children: [{ text: '' }]
                    }],
                    style: {
                        
                    }
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
            if(state[index].content[0].children.length === 1) {
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
            /**
             * 删除的时候去判断是不是只剩下一列，如果只剩下一列 就删除全部
             * 删除时先获取所有行的最大列长度，之后判断如果存在行列数不够就补上去
             */
            if(state[index].content[0].children[0].children.length === 1) {
                setTimeout(() => {
                    setState(update(state, {
                        $splice: [[index, 1]]
                    }))
                }, 100)
            } else {
                let maxLen = state[index].content[0].children.reduce((prve, next) => {
                    let len = next.children.reduce((prv, nex) => {
                        return nex.colspan ? prv + Number.parseInt(nex.colspan) : prv + 1
                    }, 0)
                    return prve > len ? prve : len
                }, 0)
                //减去删除的列
                maxLen--
                
                let children = Array.from(state[index].content[0].children).map(item => {
                    item = JSON.parse(JSON.stringify(item))
                    item.children.splice(column, 1)
                    //如果缺少列就补上
                    while(item.children.reduce((prve, next) => {
                        return next.colspan ? prve + Number.parseInt(next.colspan) : prve + 1
                    }, 0) < maxLen) {
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
    }, {
        title: '向下合并',
        icon: 'vertical-align-bottom',
        click: e => {
            /**
             * 向下合并
             * 步骤:
             *  1. 取出后面一个和当前的合并列数
             *  2. 相加放在当前元素
             *  3. 删除下一个的元素
             */
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