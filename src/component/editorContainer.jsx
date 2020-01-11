import React, { useState, useCallback } from 'react'
import { css } from 'emotion'
import Editor from './editor'
import update from 'immutability-helper'
import { Divider } from 'antd';
// import uniqueId from 'lodash/uniqueId';
const EditorContainer = props => {
    let [state, setState] = useState([
        [{
            type: 'heading-one',
            children: [{ text: '1234' }]
        }],
        [{
            type: 'heading-one',
            children: [{ text: '1234' }]
        }],
        [{
            type: 'heading-one',
            children: [{ text: '1234' }]
        }]
    ])

    /**
     * 添加分割线
     * @param {插入state的索引}
     */
    const addDivider = useCallback(index => {
        if(state.includes('Divider')) {
            console.log(55)
        } else {
            if(index <= 0) index = 0
            if(index >= state.length) index = state.length - 1
            setState(update(state, {
                $splice: [[index, 0, 'Divider']]
            }))
        }
    }, [])

    return (
        <div
            className={css`
                min-height: 600px;
                display: block;
                padding: 50px;
            `}
        >
            {
                state.map((item, index) => (
                    typeof item === 'string' ?
                    <Divider key={index}>here?</Divider>
                    :
                    <Editor 
                        index={index} 
                        key={index}
                        value={item}
                        //修改编辑器的内容函数 
                        setValue={data => {
                            setState(update(state, {
                                [index]: value => update(value, {
                                    $set: data
                                })
                            }))
                        }} 
                        //添加分割线
                        addDivider={addDivider}
                    />
                ))
            }
        </div>
    )
}

export default EditorContainer