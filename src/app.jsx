import React, { useState, useCallback } from 'react'
import EditorContainer from './component/editorContainer'
import ToolMoveBar from './component/toolMoveBar'
import { css } from 'emotion'
import 'antd/dist/antd.css'
import { DragDropContext } from 'react-beautiful-dnd';
import update from 'immutability-helper'
const App = props =>  {
    let [state, setState] = useState([
        [{
            type: 'heading-one',
            children: [{ text: '这是0' }]
        }],
        [{
            type: 'heading-two',
            children: [{ text: '这是1' }]
        }],
        [{
            type: 'heading-one',
            children: [{ text: '这是2' }]
        }]
    ])

    let onDragEnd = useCallback(info => {
        let newIndex = info.destination.index
        let oldIndex = info.source.index
        let newState = state.concat()
        newState = update(state, {
            [oldIndex]: val => update(val, {
                $set: state[newIndex]
            }),
            [newIndex]: val => update(val, {
                $set: state[oldIndex]
            })
        })
        console.log(oldIndex, newIndex)
        newState.forEach(item => {
            console.log(item[0].children[0])
        })
        setState(newState)
    }, []) 

    return (
        <div className={css`
            display: flex;
            margin: 50px 50px;
        `}>
            <DragDropContext
                onDragEnd={onDragEnd}
            >
                {/* <Editor /> */}
                <div className={css`
                    flex-grow: 0.8;
                `}>
                    <EditorContainer
                        state={state}
                        setState={setState}
                    />
                </div>
                <div className={css`
                    flex-grow: 0.2;
                    margin-left: 30px;
                `}>
                    <ToolMoveBar />
                </div>
            </DragDropContext>
        </div>
    )
}

export default App