import React from 'react'
import { Tag } from 'antd'
import { css } from 'emotion'
const SourceBtn = ({ format, text, attrs, color }) => {
    return (
        <Tag className={css`
            margin: 5px;
        `} 
        color={color}
        {...attrs}>{text}</Tag>
    )
} 

export default SourceBtn