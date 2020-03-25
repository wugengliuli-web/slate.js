import { Draggable } from 'react-beautiful-dnd'
import React, { memo } from 'react'
import ToolBar from './toolBar'
import { UploadImg } from '../lib/el'
import Editor from './editor'
import { css } from 'emotion'
import { Icon } from 'antd';
import { useDispatch } from 'redux-react-hook';
import ToolWrapper from './toolComponent'
const Dragable = ({ item, index, type, snapshot, pageIndex }) => {
    const dispatch = useDispatch()
    return (
        <div>
            {
                item.showToolbar && !snapshot.isDraggingOver ?
                    <ToolBar editor={item.editor} />
                    :
                    null
            }
            <Draggable
                draggableId={item.id}
                index={index}
            >
                {
                    (providedDraggable, snapshotDraggable) => {
                        return (
                            <div
                                className={css`
                                    display: flex;
                                    justify-content: center;
                                    position: relative;
                                    &:hover > span {
                                        opacity: ${snapshot.isDraggingOver ? '0' : '1'}
                                    }
                                    opacity: ${snapshotDraggable.isDragging ? '0.5' : '1'}
                                `}
                                ref={providedDraggable.innerRef}
                                {...providedDraggable.draggableProps}
                            >
                                <ToolWrapper
                                    item={item}
                                    snapshot={snapshot}
                                    pageIndex={pageIndex}
                                    index={index}
                                    type={type}
                                />
                                <span
                                    className={css`
                                        margin-right: 10px;
                                        opacity: 0;
                                        user-select:none;
                                    `}
                                    {...providedDraggable.dragHandleProps}
                                ><Icon type="drag" /></span>
                                {
                                    type === 'addImage' ?
                                        <div
                                            className={css`
                                                width: 716px;
                                                box-sizing: border-box;
                                                transition: all 0.15s;
                                                margin: 5px 0;
                                                padding: 5px;
                                                box-shadow: ${item.showToolbar && !snapshot.isDraggingOver ? '0 0 0 1px #bee1c7' : 'none'};
                                            `}
                                        >
                                            <UploadImg dispatch={dispatch} editor={item.editor} pageIndex={pageIndex} index={index} />
                                        </div>
                                        :
                                        <Editor
                                            editor={item.editor}
                                            readOnly={snapshot.isDraggingOver}
                                            value={item.content}
                                            index={index}
                                            pageIndex={pageIndex}
                                            isFocused={item.showToolbar && !snapshot.isDraggingOver}
                                        />
                                }
                            </div>
                        )
                    }
                }
            </Draggable>
        </div>
    )
}

export default memo(Dragable)