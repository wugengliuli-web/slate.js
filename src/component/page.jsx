import React, { memo, useRef, useState, useEffect } from 'react'
import Dragable from './dragable'
import { css } from 'emotion'

const Page = ({ page, provided, snapshot, pageIndex, scrollTop, offsetHeight }) => {
    const dom = useRef(null)
    const [isShow, setIsShow] = useState(false)
    const [height, setHeight] = useState(877)
    useEffect(() => {
        if(dom.current && offsetHeight) {
            /**
             * 判断是否处于可视区域，如果在则渲染列表，否则渲染空的div
             * 判断：
             *      1. 当前page的top + 高度 <  scrollTop
             *      2. 当前page的top > scrollTop
             *      3. 为了避免多余的重复渲染，所以额外加一些高度
             */
            if(isUsingPlaceholder || (dom.current.offsetTop <= scrollTop + offsetHeight + 877 && dom.current.offsetTop + height + 877 >= scrollTop)) {
                setIsShow(true)
                setHeight(dom.current.offsetHeight)
            } else {
                setIsShow(false)
            }
        }
    }, [scrollTop])
    if(!isShow) {
        return <div
            ref={dom}
            className={css`
                padding: 50px 0;
                height: ${height}px;
                width: 816px;
                margin: 59px auto;
                background: #fff;
                box-shadow: 0 5px 5px rgba(0,0,0,.15);
            `}
        >
            <div
                ref={provided.innerRef}
            >
            </div>
        </div>
    }
    return (
        <div
            ref={dom}
        >
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
    if(prve.provided !== next.provided || prve.page !== next.page || prve.pageIndex !== next.pageIndex || prve.scrollTop !== next.scrollTop) return false
    else return true
})