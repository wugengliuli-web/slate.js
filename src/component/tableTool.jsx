import React from 'react'
import { css } from 'emotion'
import { Icon } from 'antd'
import update from 'immutability-helper'
import { Transforms, Editor } from 'slate'
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
            let { focus = null } = editor.selection
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
                        width: '50%'
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
            let { focus = null } = editor.selection
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
                        width: '50%'
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
            let { focus = null } = editor.selection
            if(!focus) return
            let len = editor.children[0].children[0].children.length  
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
                        width: '50%'
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
            let { focus = null } = editor.selection
            if(!focus) return
            let len = editor.children[0].children[0].children.length      
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
                        width: '50%'
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
        title: '左边合并',
        icon: 'double-left',
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
                    tool.map((item, index) => (
                        <span className={css`
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
                    ))
                }
            </div>
        </div>
    )
}

export default TableTool