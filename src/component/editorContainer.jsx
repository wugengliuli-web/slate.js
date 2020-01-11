import React, { useState, useCallback } from 'react'
import { css } from 'emotion'
import Editor from './editor'
import update from 'immutability-helper'
import { Divider, Icon } from 'antd';
import { Draggable, Droppable } from 'react-beautiful-dnd'
const EditorContainer = ({state, setState}) => {
    return (
        <Droppable droppableId="editor">
                {
                    (provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            className={css`
                                min-height: 600px;
                                display: block;
                                padding: 50px;
                            `}
                        > 
                            {
                                state.map((item, index) => (
                                    typeof item === 'string' ?
                                    <Divider key={index}>here?</Divider>
                                    :
                                    <Draggable
                                        key={index}
                                        draggableId={index + ''}
                                        index={index}
                                    >
                                        {
                                            (providedDraggable, a) => {
                                                return (
                                                    <div
                                                        className={css`
                                                            display: flex;
                                                            &:hover span {
                                                                opacity: 1;
                                                            }
                                                        `}
                                                        ref={providedDraggable.innerRef}
                                                        {...providedDraggable.draggableProps}
                                                    >
                                                        <span
                                                            className={css`
                                                                margin-right: 10px;
                                                                opacity: 0;
                                                            `}
                                                            {...providedDraggable.dragHandleProps}
                                                        ><Icon type="drag" /></span>
                                                        <Editor
                                                            key={index}
                                                            value={item}
                                                            //修改编辑器的内容函数 
                                                            setValue={data => {
                                                                setState(update(state, {
                                                                    [index]: value => update(value, {
                                                                        $set: data
                                                                    })
                                                                }))
                                                            }} 
                                                        />
                                                    </div>
                                                )
                                            }
                                        }
                                    </Draggable>
                                ))
                            }  
                        </div>
                    )
                }
        </Droppable>
    )
}
export default EditorContainer