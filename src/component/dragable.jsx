import { Draggable } from 'react-beautiful-dnd'
import React, { memo } from 'react'
import ToolBar from './toolBar'
import DragableItem from './dragableItem'


const Dragable = ({ item, index, type, snapshot, pageIndex }) => {
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
                            <DragableItem
                                snapshot={snapshot}
                                snapshotDraggable={snapshotDraggable}
                                item={item}
                                providedDraggable={providedDraggable}
                                index={index}
                                pageIndex={pageIndex}
                                type={type}
                            />
                        )
                    }
                }
            </Draggable>
        </div>
    )
}

export default memo(Dragable)