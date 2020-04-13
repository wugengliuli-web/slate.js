import React, { useRef, memo, useState,useEffect } from 'react'
import { css } from 'emotion'
import { BackTop } from 'antd';
import { Droppable } from 'react-beautiful-dnd'
import { useMappedState,useDispatch } from 'redux-react-hook';
import Dragable from './dragable'
import {jumpPageAction } from '../store/action'

const EditorContainer = props => {
    let el = useRef(null)
    let state = useMappedState(state => state.state || [])
    let pageNumber = useMappedState(state => state.pageNumber || 0)
    let dispatch = useDispatch()
    let pageLate=useRef(0)
    useEffect(() => {
        pageLate.current=pageNumber
        if (el) {
            el.current.addEventListener("scroll", e => {
              const {  scrollHeight, scrollTop } = e.target;
              const isBottom = (scrollTop * 2) > scrollHeight;
              if(isBottom && !!state[pageLate.current+2]){
                const action = jumpPageAction(pageLate.current+1)
                dispatch(action)
              }else if(scrollTop<10 && !!state[pageLate.current-1]){
                const action = jumpPageAction(pageLate.current-1)
                dispatch(action)
                el.current.scrollTop=scrollHeight/2
              }

            });
          }
      });
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
                state[pageNumber]&&[Number(pageNumber),Number(pageNumber)+1].map((pageNumberValue)=>{
                    let pageScript=!!state[pageNumberValue]?
                    <Droppable 
                        droppableId={"editor"+pageNumberValue} 
                        key={pageNumberValue} 
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
                                            state[pageNumberValue].map((item, index) => {
                                                let { content } = item
                                                let type = content[0].type
                                                return <Dragable
                                                    key={item.id}
                                                    item={item}
                                                    index={index}
                                                    type={type}
                                                    snapshot={snapshot}
                                                    pageIndex={pageNumberValue}
                                                />
                                            })
                                        }
                                        
                                        {provided.placeholder}
                                    </div>
                                )
                            }
                        }
                    </Droppable>
                    :
                    null
                    return pageScript
                })
            }
                        
                    
        </div>
    )
}
export default memo(EditorContainer)