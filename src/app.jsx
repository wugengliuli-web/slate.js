import React, { useState, useMemo, useCallback } from 'react'
import EditorContainer from './component/editorContainer'
import ToolMoveBar from './component/toolMoveBar'
import { css } from 'emotion'
import { DragDropContext } from 'react-beautiful-dnd';
import './scss/index.scss'
import uniqueId from 'lodash/uniqueId'
import UploadFile from './component/uploadFile'
import { addEditorAction, exchangeEditorAction } from './store/action'
import { useDispatch } from 'redux-react-hook';
import { createEditorFactory } from './lib/createEditor'
const App = props => {
	const dispatch = useDispatch()
	const onDragEnd = useCallback(info => {
		const { source, destination } = info
		if (!destination) {
			return;
		}
		let reg = new RegExp(/[0-9]+$/)
		//如果是编辑区域的拖动 插入位置
		if (destination.droppableId.includes('editor') && source.droppableId.includes('editor')) {
			//页
			let page1 = ~~destination.droppableId.match(reg)[0]
			let page2 = ~~source.droppableId.match(reg)[0]
			let { index: index1 } = destination
			let { index: index2 } = source
			const action = exchangeEditorAction({
				page2,
				index2
			}, {
				page1,
				index1
			})
			dispatch(action)
		} else {
			//如果是添加一个元素
			/**
			 * 产生一个编辑器
			 * 先拿到是加在第几页的
			 */
			let editor = createEditorFactory()
			let page = ~~destination.droppableId.match(reg)[0]  //第几页
			let { draggableId } = info  //产生编辑的类型
			let { index } = destination //第几页的第几个块状
			let value;
			//如果是表格 就默认出现两行两列的表格
			if(draggableId === 'table') {
				value = {
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
				}
			} else {
				value =  {
					editor,
					id: uniqueId(),
					showToolbar: false,
					content: [{
						type: draggableId,
						children: [{ text: '' }]
					}]
				}
			}
			const action = addEditorAction(page, index, value)
			dispatch(action)
		}
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
						<EditorContainer/>
					</div>
					<div className={css`
						width: 300px;
						height: 100%;
						position: absolute;
						right: 0;
						top: 0px;
					`}>
						<ToolMoveBar />
						<UploadFile  />
					</div>
				</div>
			</DragDropContext>
		</div>
	)
}

export default App