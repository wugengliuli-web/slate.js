import React, { memo } from 'react'
import { CSSTransition } from 'react-transition-group'
import Tool from '../component/tool'
import DividerTool from '../component/dividerTool'
import FlexTextTool from '../component/flexTextTool'
import TableTool from '../component/tableTool'
const ToolWrapper = ({ item, snapshot, pageIndex, index, type }) => {
    return (
        <CSSTransition
            appear={true}
            in={item.showToolbar && !snapshot.isDraggingOver}
            timeout={{
                appear: 200,
                enter: 200,
                exit: 200
            }}
            classNames="tool"
            unmountOnExit
        >
            {
                type !== 'table' ?
                    (
                        type !== 'divider' ?
                            (type !== 'flexText'?<Tool
                                pageIndex={pageIndex}
                                editor={item.editor}
                                index={index}
                            /> : <FlexTextTool 
                                pageIndex={pageIndex}
                                editor={item.editor}
                                index={index}
                            />)
                            :
                            <DividerTool
                                pageIndex={pageIndex}
                                editor={item.editor}
                                index={index}
                            />
                    )
                    :
                    <TableTool
                        pageIndex={pageIndex}
                        editor={item.editor}
                        index={index}
                    />
            }
        </CSSTransition>
    )
}


export default memo(ToolWrapper)