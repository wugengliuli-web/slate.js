import React, { Component } from 'react'
import { DropTarget } from 'react-dnd';
import { css } from 'emotion'

const type = 'editor'
const spec = {}
const collect = (connect, monitor) => ({})

@DropTarget(type, spec, collect)
class EditorContainer extends Component {
    render() {
        return (
            <div
            className={css`
                width: 100%;
                min-height: 600px;
            `}  
            ref={dom => this.el = dom}>

            </div>
        )
    }
}

export default EditorContainer