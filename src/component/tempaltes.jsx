import React, { useState, useEffect} from 'react'
import { Modal, Slider, Button, Input, InputNumber} from 'antd';
import { css } from 'emotion';
import { useMappedState } from 'redux-react-hook';
// 截屏，获取模板概览
import html2canvas from 'html2canvas'
import { setTempaltesAction} from '../store/action'
import { useDispatch } from 'redux-react-hook';
// 给组件绑定拖拽事件
import { createEditorFactory } from '../lib/createEditor'
let editor = createEditorFactory()
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
    let [tempaltesDate, setTempaltesDate] = useState([
        {
            "title": "我的简历", "img": "data:image/png;base64,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", "dom":
            [[{ "editor": { "children": [{ "type": "heading-one", "style": {}, "children": [{ "text": "XX" }] }], "operations": [], "selection": null, "marks": null }, "id": "1", "showToolbar": false, "content": [{ "type": "heading-one", "style": {}, "children": [{ "text": "XX" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": {}, "children": [{ "text": "本人热爱编程" }] }], "operations": [], "selection": null, "marks": null }, "id": "10", "showToolbar": false, "content": [{ "type": "paragraph", "style": {}, "children": [{ "text": "本人热爱编程" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "基本信息" }] }], "operations": [], "selection": null, "marks": null }, "id": "9", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "基本信息" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": {}, "children": [{ "text": "xx岁 丨 计算机科学与技术专业 丨 186xxxxxxxx" }] }], "operations": [], "selection": null, "marks": null }, "id": "2", "showToolbar": false, "content": [{ "type": "paragraph", "style": {}, "children": [{ "text": "xx岁 丨 计算机科学与技术专业 丨 186xxxxxxxx" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "技术能力" }] }], "operations": [], "selection": null, "marks": null }, "id": "3", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "技术能力" }] }] }, { "editor": { "children": [{ "type": "numbered-list", "children": [{ "type": "list-item", "style": "{}", "children": [{ "text": "精通HTML,CSS,JAVASCRIPT." }], "checked": false }, { "type": "list-item", "style": "{}", "children": [{ "text": "精通linux和shell" }], "checked": false }] }], "operations": [], "selection": null, "marks": null }, "id": "4", "showToolbar": false, "content": [{ "type": "numbered-list", "children": [{ "type": "list-item", "style": "{}", "children": [{ "text": "精通HTML,CSS,JAVASCRIPT." }], "checked": false }, { "type": "list-item", "style": "{}", "children": [{ "text": "精通linux和shell" }], "checked": false }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "实习经历" }] }], "operations": [], "selection": null, "marks": null }, "id": "5", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "实习经历" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": {}, "children": [{ "text": "2018-2019 西南科技大学 c++开发" }] }, { "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "此项目用了c++技术，得了国奖。" }] }], "operations": [], "selection": null, "marks": null }, "id": "6", "showToolbar": false, "content": [{ "type": "paragraph", "style": {}, "children": [{ "text": "2018-2019 西南科技大学 c++开发" }] }, { "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "此项目用了c++技术，得了国奖。" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "教育背景" }] }], "operations": [], "selection": null, "marks": null }, "id": "7", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "教育背景" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": {}, "children": [{ "text": "2016-2020 西南科技大学 计算机科学与技术" }] }, { "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "学习主修了数据结构，编译原理。" }] }], "operations": [], "selection": null, "marks": null }, "id": "8", "showToolbar": false, "content": [{ "type": "paragraph", "style": {}, "children": [{ "text": "2016-2020 西南科技大学 计算机科学与技术" }] }, { "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "学习主修了数据结构，编译原理。" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "自我评价" }] }], "operations": [], "selection": null, "marks": null }, "id": "11", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "自我评价" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": {}, "children": [{ "text": "热爱编程，热爱生活，勤劳能干。" }] }], "operations": [], "selection": null, "marks": null }, "id": "12", "showToolbar": false, "content": [{ "type": "paragraph", "style": {}, "children": [{ "text": "热爱编程，热爱生活，勤劳能干。" }] }] }]]
        }
    ])
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
                let tempaltesValue = tempaltesDate[e.target.parentNode.getAttribute('num')].dom 
                for (let i of tempaltesValue)
                    for (let j of i)
                        j.editor=editor
                const action = setTempaltesAction(tempaltesValue)
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