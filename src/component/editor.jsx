import React, { useRef, useMemo, useCallback } from 'react'
import { Slate, withReact, Editable } from 'slate-react'
import { createEditor } from 'slate'
import ToolBar from './toolBar'
import { css } from 'emotion'
import { Element } from '../lib/element'
import { renderLeaf } from '../lib/leaf'
import { withWrapper } from '../lib/with'
import { useDrop } from 'react-dnd'
import btnData from '../lib/btnData'
const Editor = ({value, setValue, addDivider, index}) => {
    // let [value, setValue] = useState([{
    //     type: 'heading-one',
    //     children: [{ text: '123' }]
    // }])
    let el = useRef(null)
    let [{ isOver }, drop] = useDrop({
        accept: [...btnData.map(item => item.format)],
        drop(props, monitor) {
            console.log(props, monitor)
            // let newState = update(state, {
            //     $splice: [[0,]]
            // })
        },
        hover(props, monitor) {
            let { current } = el
            if(!current) return
            let reg = new RegExp(/[0-9]?$/, 'i')
            let dividerIndex = ~~reg.exec(monitor.targetId)[0]
            console.log(reg.exec(monitor.targetId))
            if(!dividerIndex) return
            /**
             * 进入编辑区域后计算高度
             */
            const hoverBoundingRect = current.getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            
            const clientOffset = monitor.getClientOffset()
            //鼠标距离编辑区域的顶部距离
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            //如果当前鼠标的位置减去中间位置大于0，代表鼠标在中间位置的下方，dividerIndex + 1
            if(hoverClientY - hoverMiddleY > 0) {
                dividerIndex++
            } else {
                dividerIndex--
            }
            console.log(dividerIndex)
            addDivider(dividerIndex)
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            draggingType: monitor.getItemType()
        })
    })

    drop(el)
    const editor = useMemo(() => withReact(withWrapper(createEditor())), [])
    const renderElement = useCallback(props => <Element {...props} />, [])
    return (
        <div
            className={css`
                width: 800px;
                margin: 0 auto;
            `}
            ref={el}
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