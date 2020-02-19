import React, { useState, useMemo, useCallback } from 'react'
import EditorContainer from './component/editorContainer'
import ToolMoveBar from './component/toolMoveBar'
import { css } from 'emotion'
import { DragDropContext } from 'react-beautiful-dnd';
import updata from 'immutability-helper'
import './scss/index.scss'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import { withWrapper } from './lib/with'
import uniqueId from 'lodash/uniqueId'
import { ReactEditor } from 'slate-react'
import UploadFile from './component/uploadFile'
import { Pagination } from 'antd';
const App = props => {
	// let editor = useMemo(() => withReact(withWrapper(createEditor())))
	let pages = []
	let pageIndex = 0
	let [pageLen, setPageLen] = useState(0)
	let [state, setState] = useState([])
	let onDragEnd = useCallback(
		info => {
			const { source, destination } = info
			if (!destination) {
				return;
			}
			//如果是在编辑区域的拖动
			if (destination.droppableId === 'editor' && source.droppableId === 'editor') {
				let newIndex = destination.index
				let oldIndex = source.index
				/**
				 * 先提取出原本位置的元素
				 * 后插入新的位置
				 */
				//提取原本位置的元素
				let newState = Array.from(state)
				let [oldEl] = newState.splice(oldIndex, 1)
				newState.splice(newIndex, 0, oldEl)
				setState(newState)
			} else {
				let editor = withReact(withWrapper(createEditor()))
				//如果是拖动块状产生编辑器的
				let { draggableId } = info
				let { index } = destination
				if (draggableId === 'table') {
					//初始默认两行两列的表格
					setState(updata(state, {
						$splice: [[index, 0, {
							editor,
							id: uniqueId(),
							showToolbar: false,
							content: [{
								type: draggableId,
								row: 2,
								column: 2,
								children: [
									{
										type: 'table-row',
										children: [
											{
												type: 'table-cell',
												children: [{
													type: 'table-content',
													children: [{ text: '' }]
												}],
												style: {

												}
											},
											{
												type: 'table-cell',
												children: [{
													type: 'table-content',
													children: [{ text: '' }]
												}],
												style: {

												}
											}
										]
									},
									{
										type: 'table-row',
										children: [
											{
												type: 'table-cell',
												children: [{
													type: 'table-content',
													children: [{ text: '' }]
												}]
											},
											{
												type: 'table-cell',
												children: [{
													type: 'table-content',
													children: [{ text: '' }]
												}]
											}
										]
									}
								]
							}]
						}]]
					}))
				} else {
					setState(updata(state, {
						$splice: [[index, 0, {
							editor,
							id: uniqueId(),
							showToolbar: false,
							content: [{
								type: draggableId,
								children: [{ text: '' }]
							}]
						}]]
					}))
				}
			}
		},
		[state],
	)
	let upload = useCallback(
		arr => {
			arr = arr.map(items => {
				return items.map(item => {
					let editor = withReact(withWrapper(createEditor()))
					return {
						editor,
						id: uniqueId(),
						showToolbar: false,
						content: [item]
					}
				})
			})
			pages = arr
			pageIndex = 0
			setState(pages[pageIndex])
			setPageLen(pages.length)
		},
		[]
	)
	let copyEl = useCallback((oldEditor, index) => {
		let editor = withReact(withWrapper(createEditor()))
		let newEditor = Object.assign({}, state[index])
		newEditor.id = uniqueId()
		newEditor.editor = editor
		newEditor.content = JSON.parse(JSON.stringify(state[index].content))
		newEditor.showToolbar = false
		setState(updata(state, {
			$splice: [[index, 0, newEditor]]
		}))
		ReactEditor.focus(oldEditor)
	}, [state])
	let onChangePage = useCallback(e => {
		pageIndex = e - 1
		setState(pages[pageIndex])
	}, [])
	return (
		<div className={css`
            width: 100%;
            height: 100%;
        `}>
			<div className={css`
                width: 100%;
                height: 60px;
                line-height: 60px;
                text-align: center;
            `}>账户信息</div>
			<DragDropContext
				onDragEnd={onDragEnd}
			>
				<div className={css`
                    height: calc(100% - 60px);
                    width: 100%;
                    position: relative;
                `}>
					<div className={css`
                        margin-right: 300px;
                        height: 100%;
                    `}>
						<EditorContainer
							state={state}
							setState={setState}
							copyEl={copyEl}
						/>
					</div>
					<div className={css`
                        width: 300px;
                        height: 100%;
                        position: absolute;
                        right: 0;
                        top: 0px;
                    `}>
						<ToolMoveBar />
						<UploadFile setState={upload} />
						<Pagination className={css`
							margin-top: 20px;
							display: flex;
							justify-content: center;
						`} defaultCurrent={1} onChange={onChangePage} total={pageLen * 10} />
					</div>
				</div>
			</DragDropContext>
		</div>
	)
}

export default App