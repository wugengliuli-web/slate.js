import React, { useCallback, useRef, memo } from 'react'
import { Slate, Editable, ReactEditor } from 'slate-react'
import { css } from 'emotion'
import { Element } from '../lib/element'
import { renderLeaf } from '../lib/leaf'
import { useDispatch } from 'redux-react-hook';
import { changeEditorValueAction } from '../store/action'
const Editor = ({pageIndex, index, readOnly, editor, value}) => {
    let el = useRef(null)
    const dispatch = useDispatch()
    const renderElement = useCallback(props => <Element editor={editor} {...props} />, [])
    return (
        <div
            ref={el}
            className={css`
                width: 716px;
                box-sizing: border-box;
                transition: all 0.1s;
                margin: 5px 0;
                padding: 5px;
                box-shadow: ${ReactEditor.isFocused(editor) ? '0 0 0 1px #bee1c7' : 'none'};
            `}
        >
            <Slate
                editor={editor}
                value={value}
                onChange={value => {
                    const action = changeEditorValueAction(pageIndex, index, value, ReactEditor.isFocused(editor))
                    dispatch(action)
                }}
            >
                <Editable
                    readOnly={readOnly}
                    placeholder="在此编辑内容"
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                />
            </Slate>
        </div>
    )
}

export default memo(Editor)