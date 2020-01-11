import React, { useRef, useMemo, useCallback } from 'react'
import { Slate, withReact, Editable } from 'slate-react'
import { createEditor } from 'slate'
import ToolBar from './toolBar'
import { css } from 'emotion'
import { Element } from '../lib/element'
import { renderLeaf } from '../lib/leaf'
import { withWrapper } from '../lib/with'
import btnData from '../lib/btnData'
const Editor = ({value, setValue}) => {
    // let [value, setValue] = useState([{
    //     type: 'heading-one',
    //     children: [{ text: '123' }]
    // }])
    const editor = useMemo(() => withReact(withWrapper(createEditor())), [])
    const renderElement = useCallback(props => <Element {...props} />, [])
    return (
        <div
            className={css`
                width: 800px;
                margin: 0 auto;
            `}
        >
            <Slate
                editor={editor}
                value={value}
                onChange={value => {
                    setValue(value)
                }}
            >
                {/* <ToolBar
                    editor={editor}
                /> */}
                <Editable
                
                    autoFocus
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                />
            </Slate>
        </div>
    )
}

export default Editor