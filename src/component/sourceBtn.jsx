import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Button } from 'antd'

const SourceBtn = ({ format, text, attrs }) => {
    return (
        <Draggable droppableId={'123'}>
            {
                provided => (
                    <span
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        {...provided.dragHandleProps}
                    >
                        <Button {...attrs}>{text}</Button>
                    </span>
                )
            }
        </Draggable>
    )
} 

export default SourceBtn