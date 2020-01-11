import React from 'react'
import { useDrag } from 'react-dnd'
import { Button } from 'antd'

const SourceBtn = ({ format, text, attrs }) => {
    const [{ isDragging }, drag] = useDrag({
        item: {
            type: format
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    })

    return (
        <span ref={drag}>
            <Button {...attrs}>{text}</Button>
        </span>
    )
} 

export default SourceBtn