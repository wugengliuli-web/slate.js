import React, { memo } from 'react'
import { css } from 'emotion'
import { Icon } from 'antd'
import update from 'immutability-helper'
import {
    copyElAction,
    delRowAction,
    delColAction,
    mergeLeftAction,
    mergeRightAction,
    delAction,
    addPreColAction,
    addNextColAction,
    addPreRawAction,
    addNextRawAction
} from '../store/action'
import { setBlockStyle } from './toolBar'
import { useDispatch } from 'redux-react-hook';
import { Editor } from 'slate'
import { createEditorFactory } from '../lib/createEditor'

/**
 * 表格的工具栏
 */
const TableTool = ({pageIndex, index, editor}) => {
    const dispatch = useDispatch()
    const tool = [{
        title: '复制',
        icon: 'file-add',
        click: e => {
            let newEditor = createEditorFactory()
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
            let { selection: selectionCol } = editor
            if (!selectionCol) return
            let { focus: focusCol = null } = selectionCol
            if (!focusCol) return
            let [, , column] = focusCol.path
            const action = addPreColAction(pageIndex, index, column)
            dispatch(action)
        }
    }, {
        title: '右边插入',
        icon: 'right-square',
        click: e => {
            let { selection: selectionCol } = editor
            if (!selectionCol) return
            let { focus: focusCol = null } = selectionCol
            if (!focusCol) return
            let [, , column] = focusCol.path
            const action = addNextColAction(pageIndex, index, column)
            dispatch(action)
        }
    }, {
        title: '上边插入',
        icon: 'up-square',
        click: e => {
            let { selection: selectionCol } = editor
            if (!selectionCol) return
            let { focus: focusCol = null } = selectionCol
            if (!focusCol) return
            let [, row] = focusCol.path
            const action = addPreRawAction(pageIndex, index, row)
            dispatch(action)
        }
    }, {
        title: '下边插入',
        icon: 'down-square',
        click: e => {
            let { selection: selectionCol } = editor
            if (!selectionCol) return
            let { focus: focusCol = null } = selectionCol
            if (!focusCol) return
            let [, row] = focusCol.path
            const action = addNextRawAction(pageIndex, index, row)
            dispatch(action)
        }
    }, {
        title: '删除选中行',
        icon: 'column-width',
        click: e => {
            let { selection } = editor
            if (!selection) return
            let { focus = null } = selection
            if (!focus) return
            let [, row] = focus.path
            const action = delRowAction(pageIndex, index, row)
            setTimeout(function () {
                dispatch(action)
            }, 100)
        }
    }, {
        title: '删除选中列',
        icon: 'column-height',
        click: e => {
            let { selection: selectionCol } = editor
            if (!selectionCol) return
            let { focus: focusCol = null } = selectionCol
            if (!focusCol) return
            let [, , column] = focusCol.path
            const action = delColAction(pageIndex, index, column)
            setTimeout(function () {
                dispatch(action)
            }, 100)
        }
    }, {
        title: '向左合并',
        icon: 'double-left',
        click: e => {
            let { selection: selectionMergeLeft } = editor
            if (!selectionMergeLeft) return
            let { focus: focusMergeLeft = null } = selectionMergeLeft
            if (!focusMergeLeft) return
            const action = mergeLeftAction(pageIndex, index, focusMergeLeft.path)
            dispatch(action)
        }
    }, {
        title: '向右合并',
        icon: 'double-right',
        click: e => {
            let { selection: selectionMergeRight } = editor
            if (!selectionMergeRight) return
            let { focus: focusMergeRight = null } = selectionMergeRight
            if (!focusMergeRight) return
            const action = mergeRightAction(pageIndex, index, focusMergeRight.path)
            dispatch(action)
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