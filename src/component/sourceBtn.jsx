import React from 'react'
import { Tag } from 'antd'
import { css } from 'emotion'
const SourceBtn = ({ format, text, attrs, color }) => {
    return (
        <Tag
        {...attrs} 
        className={css`
            margin: 5px;
            width: 120px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            font-size: 20px;
            cursor: move;
        `} 
        color={color}
        >{text}</Tag>
    )
} 

export default SourceBtn