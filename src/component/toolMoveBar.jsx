import React, { useState } from 'react'
import { css } from 'emotion'
import SourceBtn from './sourceBtn'
import btnData from '../lib/btnData'
const ToolMoveBar = props => {

    const [slateItem, setSlateItem] = useState(btnData)

    return (
        <div
            className={css`
                display: flex;
                & button {
                    margin: 5px;
                }
            `}
        >
            {/* {
                slateItem.map(item => (
                    <SourceBtn 
                        key={item.format}
                        attrs={item.attrs}
                        text={item.text}
                        format={item.format}
                    />
                ))
            } */}
        </div>
    )
}

export default ToolMoveBar