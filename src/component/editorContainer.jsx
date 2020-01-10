import React, { useState } from 'react'
import { css } from 'emotion'
import uniqueId from 'lodash/uniqueId'
import Editor from './editor'
import { ReactSortable } from "react-sortablejs";

const EditorContainer = props => {

    const [state, setstate] = useState([
        {
            content: [{
                type: 'paragraph',
                children: [{ text: 'A line of text in a paragraph.' }],
            }]
        }
        
    ])
    console.log("state", state)
    return (
        <div
            className={css`
                min-height: 600px;
                display: block;
                padding: 50px;
            `}
        >
            <ReactSortable
                group = {{
                    name: 'editor',
                    pull: true,
                    put: true
                }}
                list={state} onAdd={e => {
                    console.log("add", e)
                }} setList={_ => {
                    console.log("setList", _)
                    setstate(_)
                }}>
                {
                    state.map((item, index) => {
                        console.log("index", item)
                        return <Editor key={index} value={item.content} setValue={nv => {
                            console.log("set", nv)
                            let data = Object.assign([], state);
                            data[index].content = nv
                            setstate(data)
                        }}></Editor>
                    })
                }
            </ReactSortable>
        </div>
    )
}

export default EditorContainer