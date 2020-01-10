import React, { useState } from 'react'
import { Button } from 'antd'
import { css } from 'emotion'
import uniqueId from 'lodash/uniqueId';
import { ReactSortable } from "react-sortablejs";


const ToolMoveBar = props => {

    const [slateItem, setSlateItem] = useState([{
        type: "",
        type: "",
        text: 'h1',
        attrs: {},
        format: 'heading-one'
    }, {
        text: 'h2',
        attrs: {},
        format: 'heading-two'
    }])

    console.log("render")

    return (
        <div
            className={css`
                display: flex;
                & button {
                    margin: 5px;
                }
            `}
        >
            <ReactSortable
                group = {{
                    name: 'editor',
                    pull: 'clone',
                    put: false
                }}
                sort={false}
                list={slateItem} 
                setList={setSlateItem}>
                {
                    slateItem.map((item, index) => (
                        <Button key={index}>{item.text}</Button>
                    ))
                }
            </ReactSortable>
        </div>
    )
}

export default ToolMoveBar