import React, { Component } from 'react'
import EditorContainer from './component/editorContainer'
import ToolMoveBar from './component/toolMoveBar'
import { css } from 'emotion'
import 'antd/dist/antd.css'
// import Editor from './component/editor'
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
class App extends Component {
    render() {
        return (
            <div className={css`
                display: flex;
                margin: 50px 50px;
            `}>
                <DndProvider backend={Backend}>
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
				</DndProvider>
            </div>
        )
    }
}

export default App