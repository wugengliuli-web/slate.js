import React from 'react'
import { css } from 'emotion'
import { Icon } from 'antd'
import update from 'immutability-helper'
import { Transforms } from 'slate'
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
        title: '左边插入',
        icon: 'left-square',
        click: e => {
            let len = editor.children[0].children.length
            // Transforms.insertNodes(editor, {
            //     type: ''
            // })
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