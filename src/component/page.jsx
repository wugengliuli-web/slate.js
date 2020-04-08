import React, { memo } from 'react'
import Dragable from './dragable'
import { css } from 'emotion'

const Page = ({ page, provided, snapshot, pageIndex }) => {
    return (
        <div>
            <div
                ref={provided.innerRef}
                className={css`
                    padding: 50px 0;
                    min-height: 877px;
                    width: 816px;
                    margin: 59px auto;
                    background: #fff;
                    box-shadow: 0 5px 5px rgba(0,0,0,.15);
                `}
            >
                {
                    page.map((item, index) => {
                        let { content } = item
                        let type = content[0].type
                        return <Dragable
                            key={item.id}
                            item={item}
                            index={index}
                            type={type}
                            snapshot={snapshot}
                            pageIndex={pageIndex}
                        />
                    })
                }
                {provided.placeholder}
            </div>
            
        </div>
    )
}

export default memo(Page, (prve, next) => {
    if(prve.page !== next.page || prve.pageIndex !== next.pageIndex || prve.scrollTop !== next.scrollTop) return false
    else return true
})