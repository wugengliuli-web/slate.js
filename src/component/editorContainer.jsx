import React, { useRef, memo } from 'react'
import { css } from 'emotion'
import { BackTop } from 'antd';
import { Droppable } from 'react-beautiful-dnd'
import { useMappedState } from 'redux-react-hook';
import Dragable from './dragable'

const EditorContainer = props => {
    let el = useRef(null)
    let state = useMappedState(state => state.state || [])
    return (
        <div
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
                state.map((page, pageIndex) => {
                    return (
                        <Droppable key={pageIndex} 
                            droppableId={"editor" + pageIndex} 
                        >
                            {
                                (provided, snapshot) => {
                                    return (
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
                                    )
                                }
                            }
                        </Droppable>
                    )
                })
            }
        </div>
    )
}
export default memo(EditorContainer)