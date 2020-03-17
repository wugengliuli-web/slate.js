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