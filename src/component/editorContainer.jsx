import React from 'react'
import { css } from 'emotion'
import Editor from './editor'
import update from 'immutability-helper'
import { Icon } from 'antd';
import { Draggable, Droppable } from 'react-beautiful-dnd'
import ToolBar from './toolBar'
const EditorContainer = ({state, setState}) => {
    return (
        <div className={css`
            width: 100%;
            height: 100%;
            background: #efedec;
            overflow: auto;
        `}>
            <Droppable droppableId="editor">
                {
                    (provided, snapshot) => {
                        return (
                            <div
                                ref={provided.innerRef}
                                className={css`
                                    min-height: 100%;
                                    width: 816px;
                                    margin: 59px auto;
                                    background: #fff;
                                    box-shadow: 0 5px 5px rgba(0,0,0,.15);
                                `}
                            > 
                                {
                                    state.map((item, index) => {
                                        return (
                                            <div key={item.id}>
                                                {item.isShowToolBar ? <ToolBar editor={item.editor} /> : null}
                                                <Draggable
                                                    key={index}
                                                    draggableId={index + ''}
                                                    index={index}
                                                >
                                                    {
                                                        (providedDraggable, snapshotDraggable) => {
                                                            return (
                                                                <div
                                                                    className={css`
                                                                        display: flex;
                                                                        justify-content: center;
                                                                        &:hover > span {
                                                                            opacity: ${snapshot.isDraggingOver ? '0' : '1'}
                                                                        }
                                                                        opacity: ${snapshotDraggable.isDragging ? '0.5' : '1'}
                                                                    `}
                                                                    ref={providedDraggable.innerRef}
                                                                    {...providedDraggable.draggableProps}
                                                                >
                                                                    <span
                                                                        className={css`
                                                                            margin-right: 10px;
                                                                            opacity: 0;
                                                                            user-select:none;
                                                                        `}
                                                                        {...providedDraggable.dragHandleProps}
                                                                    ><Icon type="drag" /></span>
                                                                    <Editor
                                                                        editor={item.editor}
                                                                        readOnly={snapshot.isDraggingOver}
                                                                        value={item.content}
                                                                        //修改编辑器的内容函数 
                                                                        setValue={(data,isShowToolBar)  => {
                                                                            setState(update(state, {
                                                                                [index]: {
                                                                                    content: {
                                                                                        $set: data
                                                                                    },
                                                                                    isShowToolBar: {
                                                                                        $set: isShowToolBar
                                                                                    }
                                                                                }
                                                                            }))
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        }
                                                    }
                                                </Draggable>
                                            </div>
                                        )
                                    })
                                }
                                {provided.placeholder}  
                            </div>
                        )
                    }
                }
            </Droppable>
        </div>
    )
}
export default EditorContainer