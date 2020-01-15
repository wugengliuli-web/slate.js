import React, { useState, useMemo } from 'react'
import EditorContainer from './component/editorContainer'
import ToolMoveBar from './component/toolMoveBar'
import { css } from 'emotion'
import 'antd/dist/antd.css'
import { DragDropContext } from 'react-beautiful-dnd';
import updata from 'immutability-helper'
import './scss/index.scss'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import { withWrapper } from './lib/with'
import uniqueId from 'lodash/uniqueId'
import { ReactEditor } from 'slate-react'
const App = props =>  {
    let editor = useMemo(() => withReact(withWrapper(createEditor())))
    let [state, setState] = useState([])
    let onDragEnd = info => {
        const { source, destination } = info
        if (!destination) {
            return;
        }
        //如果是在编辑区域的拖动
        if(destination.droppableId === 'editor' && source.droppableId === 'editor') {
            let newIndex = destination.index
            let oldIndex = source.index
            /**
             * 先提取出原本位置的元素
             * 后插入新的位置
             */
            //提取原本位置的元素
            let newState = Array.from(state)
            let [oldEl] = newState.splice(oldIndex, 1)
            newState.splice(newIndex, 0, oldEl)
            setState(newState)
        } else {
            //如果是拖动块状产生编辑器的
            let { draggableId } = info
            let { index } = destination
            setState(updata(state, {
                $splice: [[index, 0, {
                    editor,
                    id: uniqueId(),
                    showToolbar: false,
                    content: [{
                        type: draggableId,
                        children: [{ text: '' }]
                    }]
                }]]
            }))
        }
    }
    let copyEl = (oldEditor, index) => {
        let newEditor = Object.assign({}, state[index])
        newEditor.id = uniqueId()
        newEditor.editor = editor
        newEditor.content = JSON.parse(JSON.stringify(state[index].content))
        newEditor.showToolbar = false
        setState(updata(state, {
            $splice: [[index, 0, newEditor]]
        }))
        ReactEditor.focus(oldEditor)
    }
    return (
        <div className={css`
            width: 100%;
            height: 100%;
        `}>
            <div className={css`
                width: 100%;
                height: 60px;
                line-height: 60px;
                text-align: center;
            `}>账户信息</div>
            <DragDropContext
                onDragEnd={onDragEnd}
            >
                <div className={css`
                    height: calc(100% - 60px);
                    width: 100%;
                    position: relative;
                `}>
                    <div className={css`
                        margin-right: 300px;
                        height: 100%;
                    `}>
                        <EditorContainer
                            state={state}
                            setState={setState}
                            copyEl={copyEl}
                        />
                    </div>
                    <div className={css`
                        width: 300px;
                        height: 100%;
                        position: absolute;
                        right: 0;
                        top: 0px;
                    `}>
                        <ToolMoveBar />
                    </div>
                </div>
            </DragDropContext>
        </div>
    )
}

export default App