import React from 'react'
import EditorContainer from './component/editorContainer'
import ToolMoveBar from './component/toolMoveBar'
import { css } from 'emotion'
import 'antd/dist/antd.css'
const App = function() {
    return (
        <div className={css`
            display: flex;
            margin: 50px 50px;
        `}>
            <div className={css`
                flex-grow: 0.8;
            `}>
                <EditorContainer />
            </div>
            <div className={css`
                flex-grow: 0.2;
                margin-left: 30px;
            `}>
                <ToolMoveBar />
            </div>
        </div>
    )
}

export default App