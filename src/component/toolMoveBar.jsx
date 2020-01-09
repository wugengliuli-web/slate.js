import sortable from 'sortablejs'
import React, { Component } from 'react'
import { Button } from 'antd'
import { css } from 'emotion'
class ToolMoveBar extends Component {

    render() {
        this.el && new sortable(this.el, {
            group: 'ToolMoveBar'
        })
        return (
            <div
            className={css`
                display: flex;
                & > button {
                    margin: 5px;
                }
            `}
            ref={dom => this.el = dom}>
                <Button>h1</Button>
                <Button>h2</Button>
            </div>
        )
    }
}

export default ToolMoveBar