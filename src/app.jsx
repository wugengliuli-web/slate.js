import React, { Component } from 'react'
import EditorContainer from './component/editorContainer'
import ToolMoveBar from './component/toolMoveBar'
import { css } from 'emotion'
import 'antd/dist/antd.css'
// import Editor from './component/editor'
class App extends Component {
    render() {
        return (
            <div className={css`
                display: flex;
                margin: 50px 50px;
            `}>
                    {/* <Editor /> */}
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
}

export default App