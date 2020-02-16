import React, { memo } from 'react'
import { css } from 'emotion'
import { Icon } from 'antd'
import update from 'immutability-helper'
import { setBlockStyle } from './toolBar'
const Tool = ({editor, copyEl, index, state, setState}) => {
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

export default memo(Tool, (prve, next) => {
    if(prve.editor !== next.editor || prve.index !== next.index) return false
    else return true
})