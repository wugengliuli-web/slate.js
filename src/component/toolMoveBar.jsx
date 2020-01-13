import React, { useState } from 'react'
import { css } from 'emotion'
import SourceBtn from './sourceBtn'
import btnData from '../lib/btnData'
import { Draggable, Droppable } from 'react-beautiful-dnd'
const ToolMoveBar = props => {
    const [slateItem] = useState(btnData)

    return (
        <div
            className={css`
                display: flex;
                margin-left: 40px;
            `}
        >
            <Droppable isDropDisabled={true} direction="horizontal" droppableId="btn">
                {
                    (provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                        >
                            {
                                slateItem.map((item, index) => (
                                    <Draggable
                                        key={item.format}
                                        draggableId={item.format}
                                        index={index}
                                    >
                                        {
                                            (providedDraggable, snapshotDraggable) => {
                                                return (
                                                    <>
                                                        <span
                                                            {...providedDraggable.dragHandleProps}
                                                            {...providedDraggable.draggableProps}
                                                            ref={providedDraggable.innerRef}
                                                        >
                                                            <SourceBtn
                                                                key={item.format}
                                                                attrs={item.attrs}
                                                                text={item.text}
                                                                format={item.format}
                                                                color="#108ee9"
                                                            />
                                                        </span>
                                                        {snapshotDraggable.isDragging && (
                                                            <span>
                                                                <SourceBtn
                                                                    color="#2db7f5"
                                                                    key={item.format}
                                                                    attrs={item.attrs}
                                                                    text={item.text}
                                                                    format={item.format}
                                                                />
                                                            </span>
                                                        )}
                                                    </>
                                                )
                                            }
                                        }
                                    </Draggable>
                                ))
                            }
                            {provided.placeholder}
                        </div>
                    )
                }
            </Droppable>
        </div>
    )
}

export default ToolMoveBar