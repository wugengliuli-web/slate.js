import React, { useCallback, useState} from 'react'
import EditorContainer from './component/editorContainer'
import ToolMoveBar from './component/toolMoveBar'
import { css } from 'emotion'
import { DragDropContext } from 'react-beautiful-dnd';
import './scss/index.scss'
import UploadFile from './component/uploadFile'
import { addEditorAction, exchangeEditorAction } from './store/action'
import { useDispatch } from 'redux-react-hook';
import { createDataFactory } from './lib/createData'
import { Button} from 'antd'
import { CSSTransition } from 'react-transition-group'
import Tempaltes from './component/tempaltes'
const App = props => {
	const dispatch = useDispatch()
	const [showDrawer, setShowDrawer] = useState(true)
	const onDragEnd = useCallback(info => {
		const { source, destination } = info
		if (!destination) {
			return;
		}
		let reg = new RegExp(/[0-9]+$/)
		//如果是编辑区域的拖动 插入位置
		if (destination.droppableId.includes('editor') && source.droppableId.includes('editor')) {
			//页
			let page1 = Number(destination.droppableId.match(reg)[0])
			let page2 = Number(source.droppableId.match(reg)[0])
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
			let page = Number(destination.droppableId.match(reg)[0])  //第几页
			let { draggableId } = info  //产生编辑的类型
			let { index } = destination //第几页的第几个块状
			let value = createDataFactory({ format: draggableId })
			const action = addEditorAction(page, index, value)
			dispatch(action)
		}
	}, [])

	return (
		<div className={css`
            width: 100%;
            height: 100%;
			overflow: hidden;
        `}>
			<div className={css`
				width: 100%;
				height: 60px;
				line-height: 60px;
				display:flex;
				align-items:center;
			`}>
				<span style={{margin:'0 auto'}}>账户信息</span>
				<Button type="primary" style={{ float: 'right', marginRight: '20px' }} onClick={() => { setShowDrawer((!showDrawer))}}>
					{showDrawer ? '关闭菜单' :'显示菜单'}
        		</Button>
			</div>
			<DragDropContext
				onDragEnd={onDragEnd}
			>
				<div className={css`
					height: calc(100% - 60px);
					width: 100%;
					position: relative;	
				`}>
					<div className={css`
						width:100%;
						height: 100%;
					`}>
						<EditorContainer />
					</div>
					<CSSTransition
						appear={true}
						in={showDrawer}
						timeout={{
							appear: 200,
							enter: 200,
							exit: 200
						}}
						classNames="btnTool"
						unmountOnExit
					>
						<div className={css`
							transition: all 0.3s;
							width: 300px;
							height: 100%;
							position: absolute;
							right: 0;
							top: 0;
							background: #fff;
							overflow: hidden;
						`}>
							<ToolMoveBar />
							<UploadFile />
							<Tempaltes />
						</div>
					</CSSTransition>
				</div>
			</DragDropContext>
		</div>
	)
}

export default App