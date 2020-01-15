import React, { useCallback, useRef } from 'react'
import { Slate, Editable, ReactEditor } from 'slate-react'
import { css } from 'emotion'
import { Element } from '../lib/element'
import { renderLeaf } from '../lib/leaf'
const Editor = ({value, setValue, readOnly, editor}) => {
    let el = useRef(null)
    const renderElement = useCallback(props => <Element editor={editor} {...props} />, [])
    const onDOMBeforeInput = e => {
        
    }

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
                    if(ReactEditor.isFocused(editor)) {
                        setValue(value, true)
                    } else {
                        setValue(value, false)
                    }
                }}
            >
                <Editable
                    onDOMBeforeInput={onDOMBeforeInput}
                    readOnly={readOnly}
                    placeholder="在此编辑内容"
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                />
            </Slate>
        </div>
    )
}

export default Editor