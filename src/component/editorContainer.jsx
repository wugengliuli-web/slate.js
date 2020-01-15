import React, { useRef } from 'react'
import { css } from 'emotion'
import Editor from './editor'
import update from 'immutability-helper'
import { Icon, BackTop } from 'antd';
import { Draggable, Droppable } from 'react-beautiful-dnd'
import ToolBar from './toolBar'
import { UploadImg } from '../lib/el'
import { ReactEditor } from 'slate-react'
const EditorContainer = ({ state, setState }) => {
    let el = useRef(null)
    return (
        <div
            ref={el}
            className={css`
                width: 100%;
                height: 100%;
                background: #efedec;
                overflow: auto;
            `}
        >
            {
                el.current ?
                <BackTop style={{
                    right: '360px'
                }} target={() => el.current} visibilityHeight={200} />
                :
                null
            }
            <Droppable droppableId="editor">
                {
                    (provided, snapshot) => {
                        return (
                            <div
                                ref={provided.innerRef}
                                className={css`
                                    padding: 50px 0;
                                    min-height: 100%;
                                    width: 816px;
                                    margin: 59px auto;
                                    background: #fff;
                                    box-shadow: 0 5px 5px rgba(0,0,0,.15);
                                `}
                            >
                                {
                                    state.map((item, index) => {
                                        let { content } = item
                                        let type = content[0].type
                                        return (
                                            <div key={item.id}>
                                                {
                                                    item.showToolbar ?
                                                    <ToolBar editor={item.editor} />
                                                    :
                                                    null
                                                }
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
                                                                    {
                                                                        type === 'addImage' ?
                                                                            <div
                                                                                className={css`
                                                                                width: 716px;
                                                                                box-sizing: border-box;
                                                                                transition: all 0.15s;
                                                                                margin: 5px 0;
                                                                                padding: 5px;
                                                                                box-shadow: ${ReactEditor.isFocused(item.editor) ? '0 0 0 1px #bee1c7' : 'none'};
                                                                            `}
                                                                            >
                                                                                <UploadImg editor={item.editor} state={state} index={index} setState={setState} />
                                                                            </div>
                                                                            :
                                                                            <Editor
                                                                                editor={item.editor}
                                                                                readOnly={snapshot.isDraggingOver}
                                                                                value={item.content}
                                                                                //修改编辑器的内容函数 
                                                                                setValue={(data, showToolbar) => {
                                                                                    setState(update(state, {
                                                                                        [index]: {
                                                                                            content: {
                                                                                                $set: data
                                                                                            },
                                                                                            showToolbar: {
                                                                                                $set: showToolbar
                                                                                            }
                                                                                        }
                                                                                    }))
                                                                                }}
                                                                            />
                                                                    }
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