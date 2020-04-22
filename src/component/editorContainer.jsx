import React, { useRef, memo, useState, useCallback } from 'react'
import { css } from 'emotion'
import { BackTop } from 'antd';
import { Droppable } from 'react-beautiful-dnd'
import { useMappedState } from 'redux-react-hook';
import Page from './page'
const EditorContainer = props => {
    let el = useRef(null)
    let state = useMappedState(state => state.state || [])
    const [scrollTop, setScrollTop] = useState(0)
    const onScroll = useCallback(e => {
        el.current && setScrollTop(el.current.scrollTop)
    }, [])
    return (
        <div
            onScroll={onScroll}
            ref={el}
            className={css`
                width: 100%;
                height: 100%;
                background: #efedec;
                overflow: auto;
                &::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                    background: transparent;
                }
                
                &::-webkit-scrollbar-thumb {
                    background: transparent;
                    border-radius: 4px;
                }
                
                &:hover::-webkit-scrollbar-thumb {
                    background: hsla(0, 0%, 53%, 0.4);
                }
                
                &:hover::-webkit-scrollbar-track {
                    background: hsla(0, 0%, 53%, 0.1);
                }
            `}
        >
            {
                el.current ?
                    <BackTop style={{
                        right: '360px'
                    }} target={() => el.current} visibilityHeight={200} />
                    :
                    null
            }
            {
                state.map((item, pageIndex) => {
                    return <Droppable
                                droppableId={"editor" + pageIndex}
                                key={pageIndex}
                            >
                                {
                                    (provided, snapshot) => {
                                        return (
                                            <Page 
                                                page={item}
                                                provided={provided}
                                                snapshot={snapshot}
                                                pageIndex={pageIndex}
                                                scrollTop={scrollTop}
                                                offsetHeight={el.current.offsetHeight}
                                            />
                                        )
                                    }
                                }
                            </Droppable>
                })
            }


        </div>
    )
}
export default memo(EditorContainer)