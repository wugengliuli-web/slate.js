import React, { useCallback, useRef } from 'react'
import { Slate, Editable } from 'slate-react'
import { css } from 'emotion'
import { Element } from '../lib/element'
import { renderLeaf } from '../lib/leaf'
const Editor = ({value, setValue, readOnly, editor}) => {
    let el = useRef(null)
    const renderElement = useCallback(props => <Element {...props} />, [])
    const onDOMBeforeInput = e => {
        
    }
    return (
        <div
            ref={el}
            className={css`
                width: 716px;
                box-sizing: border-box;
                transition: all 0.3s;
                margin: 5px 0;
                padding: 5px;
                border: 1px solid #fff;
                &:hover {
                    border: ${readOnly ? 'border: 1px solid #fff;' : '1px solid #bee1c7'};
                }
            `}
            
        >
            <Slate
                editor={editor}
                value={value}
                onChange={value => {
                    let dom = el.current.firstChild
                    if(document.activeElement === dom) {
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