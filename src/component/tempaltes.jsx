import React, { useState, useEffect} from 'react'
import { Modal, Slider, Button, Input, InputNumber} from 'antd';
import { css } from 'emotion';
import { useMappedState } from 'redux-react-hook';
// 截屏
import html2canvas from 'html2canvas'
import { setTempaltesAction} from '../store/action'
import { useDispatch } from 'redux-react-hook';
const TempaltesItem = props => {
    return <div className={css`margin:5px 10px;`} num={props.num}>
        <img src={props.data.img} style={{ width: '100%', height: '130px',border:'1px solid #eee' }} />
        <p className={css`text-align:center;`}>{props.data.title}</p>
    </div>
}
const Tempaltes = props => {
    const dispatch = useDispatch()
    let state = useMappedState(state => state.state || [])
    // Modal的控制
    let [tempaltesModalVisible, setTempaltesModalVisible] = useState(false)
    // tempaltesFlag为0表示进行保存模板操作，为1表示进行选择模板操作
    let [tempaltesFlag, settempaltesFlag] = useState(0)
    // 设置模板的信息
    let [tempaltesIndex, settempaltesIndex] = useState({title:'我的组件',img:{}})
    // 模板列表
    let [tempaltesDate, setTempaltesDate] = useState([])
    useEffect(()=>{
        if(state.length<1)return;
        let dom = document.getElementById('pageRoot').childNodes[0].childNodes[0];
        html2canvas(dom, { // 转换为图片
            useCORS: true, // 解决资源跨域问题
            scale: (0.1, 0.1),
        }).then(canvas => {
            let imgUrl = canvas.toDataURL('image/png');
            settempaltesIndex((e) => ({...e, img:imgUrl}))
        })
    }, [tempaltesModalVisible])
    function addTempaltes(){
        setTempaltesDate((e) => {
            e.push({
                ...tempaltesIndex,
                dom: state
            }); return e;
        })
        setTempaltesModalVisible(false)
    }
    return (
        <div className={css`
        display:flex;
        justify-content:space-around;
    `}>
            <Button type="primary"
                onClick={() => { setTempaltesModalVisible(true); settempaltesFlag(0) }}
                className={css`
            margin-top:  20px;
        `}>
                添加模板
        </Button>
            <Button type="primary"
                onClick={() => { setTempaltesModalVisible(true); settempaltesFlag(1) }}
                className={css`
            margin-top:  20px;
        `}>
                选择模板
        </Button>
            <Modal
                title={tempaltesFlag ? "选择模板" : "添加模板"}
                visible={tempaltesModalVisible}
                width={tempaltesFlag ? '80%' : '40%'}
                onCancel={()=>{setTempaltesModalVisible(false)}}
                footer={null}
            >
                {tempaltesFlag ? <div className={css`
                display:flex;
                flex-wrap:wrap;
            `} onClick={(e) => {
                const action = setTempaltesAction(
                    tempaltesDate[e.target.parentNode.getAttribute('num')].dom)
                dispatch(action)
                setTempaltesModalVisible(false)
            }}>
                    {tempaltesDate.map((value, index) => 
                    <TempaltesItem data={value} key={index} num={index} />)}
                </div> : <div className={css`
                    display:flex;
                    flex-direction:column;
                    >*{margin-top:15px;}`}>
                            <p>输入组件名称：</p>
                            <Input defaultValue="我的组件" value={tempaltesIndex.title}
                            onChange={(e) => {
                                let title=e.target.value;
                                settempaltesIndex(
                                    (text) => ({ ...text, title: title}))}
                            }/>
                            <p >组件封面预览：</p>
                            <div><img src={tempaltesIndex.img} className={css`border:1px solid #eee;`}/></div>
                            <Button type="primary" onClick={addTempaltes}>添加到模板库</Button>
                    </div>}
            </Modal>
        </div>)
}
export default Tempaltes;