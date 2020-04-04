import React, { memo } from 'react'
import { css } from 'emotion'
import { Icon } from 'antd';
const DraggableIcon = ({ providedDraggable }) => {
    return (
        <span
            className={css`
                margin-right: 10px;
                opacity: 0;
                user-select:none;
            `}
            {...providedDraggable.dragHandleProps}
        >
            <Icon type="drag" />
        </span>
    )
}


export default memo(DraggableIcon, (prve, next) => {
    return true
})