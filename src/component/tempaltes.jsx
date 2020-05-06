import React, { useState, useEffect} from 'react'
import { Modal, Slider, Button, Input, InputNumber} from 'antd';
import { css } from 'emotion';
import uniqueId from 'lodash/uniqueId'
import { useMappedState } from 'redux-react-hook';
// 截屏，获取模板概览
import html2canvas from 'html2canvas'
import { setTempaltesAction} from '../store/action'
import { useDispatch } from 'redux-react-hook';
// 给组件绑定拖拽事件
import { createEditorFactory } from '../lib/createEditor'

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
        { "title": "网页简介", "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABXCAYAAAB81qkrAAACYUlEQVR4Xu3Wy44BURSF4V3utyAuCfEYEu8/MTc1ITEgBAkRxLWzT8JMR1KrB/RfE1SXlarP6nN2dL/f78YRSyACMZZf+DKI8Q1BFBiCCKJCQJDxck28XC622+1ssVhYMpk038QTiYRVKhXb7/d2u92s3W7bZrOxRqNhURQJbuczI37dWIbDoU0mE3PQVqsVnjCbzdp4PLbr9Wr1et2azaat12vrdrt2OBysXC5/pkSMu36J6G3r9/sBJp/PPxFLpZINBgMrFArW6XQsl8uZn3Nkx6zVajFu5zO/+msTj8ejnc/n0MTHTO5o3sbVahX+hYvFYnh16P96MCcKfnkQQRQICCLeauJsNgvr4nK5DDuyr4/T6dTS6XTYnX3t3G63Vq1Ww3rpY5FvTH6tj0Wj0SiMRj4KzefzcK7X61kmk/mK0egtRN9cHhtLKpV6PrjPir6p+N9Op1OYJx+f/Zy/dzC/zg9/78dj5vTrv+F4C/EbHvQvnwFEgS6IIAoEBBE0EUSBgCCCJoIoEBBE0EQQBQKCCJoIokBAEEETQRQICCJoIogCAUEETQRRICCIoIkgCgQEETQRRIGAIIImgigQEETQRBAFAoIImgiiQEAQQRNBFAgIImgiiAIBQQRNBFEgIIigiSAKBAQRNBFEgYAggiaCKBAQRNBEEAUCggiaCKJAQBBBE0EUCAgiaCKIAgFBBE0EUSAgiKCJIAoEBBE0EUSBgCCCJoIoEBBE0EQQBQKCCJoIokBAEEETQRQICCJoIogCAUEETQRRICCIoIkgCgQEETQRRIGAIIImgigQEET8AJlt3wv0NEvkAAAAAElFTkSuQmCC", "dom": [[{ "editor": { "children": [{ "type": "heading-one", "style": {}, "children": [{ "text": "项目简介：" }] }], "operations": [], "selection": null, "marks": null }, "id": "1", "showToolbar": false, "content": [{ "type": "heading-one", "style": {}, "children": [{ "text": "项目简介：" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "这是个组件化的文档在线编辑网页。" }] }], "operations": [], "selection": null, "marks": null }, "id": "2", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "这是个组件化的文档在线编辑网页。" }] }] }]] },
        { "title": "简历模板1", "img": "data:image/png;base64,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", "dom": [[{ "editor": { "children": [{ "type": "heading-one", "style": {}, "children": [{ "text": "姓名" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887389529281", "showToolbar": false, "content": [{ "type": "heading-one", "style": {}, "children": [{ "text": "姓名" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": {}, "children": [{ "text": "简介" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887389529282", "showToolbar": false, "content": [{ "type": "paragraph", "style": {}, "children": [{ "text": "简介" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "基本信息" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887389529283", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "基本信息" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": {}, "children": [{ "text": "2020年毕业 | 186xxxxxxxx | 计算机科学与技术" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887389529284", "showToolbar": false, "content": [{ "type": "paragraph", "style": {}, "children": [{ "text": "2020年毕业 | 186xxxxxxxx | 计算机科学与技术" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "技能掌握" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887389529285", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "技能掌握" }] }] }, { "editor": { "children": [{ "type": "numbered-list", "children": [{ "type": "list-item", "style": "{}", "children": [{ "text": "精通掌握技能1" }], "checked": false }, { "type": "list-item", "style": "{}", "children": [{ "text": "精通掌握技能2" }], "checked": false }] }], "operations": [], "selection": null, "marks": null }, "id": "15887389529286", "showToolbar": false, "content": [{ "type": "numbered-list", "children": [{ "type": "list-item", "style": "{}", "children": [{ "text": "精通掌握技能1" }], "checked": false }, { "type": "list-item", "style": "{}", "children": [{ "text": "精通掌握技能2" }], "checked": false }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "实习经历" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887389529287", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "实习经历" }] }] }, { "editor": { "children": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2018.3-2019.3" }] }, { "type": "paragraph", "children": [{ "text": "西南科技大学实训" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "c++开发" }], "style": { "textAlign": "right" } }] }], "operations": [], "selection": null, "marks": null }, "id": "15887389529288", "showToolbar": false, "content": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2018.3-2019.3" }] }, { "type": "paragraph", "children": [{ "text": "西南科技大学实训" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "c++开发" }], "style": { "textAlign": "right" } }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "实训学到了喝多东西" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887389529289", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "实训学到了喝多东西" }] }] }, { "editor": { "children": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2019.3-2019.8" }] }, { "type": "paragraph", "children": [{ "text": "美国苹果公司" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "c++开发" }], "style": { "textAlign": "right" } }] }], "operations": [], "selection": null, "marks": null }, "id": "158873895292810", "showToolbar": false, "content": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2019.3-2019.8" }] }, { "type": "paragraph", "children": [{ "text": "美国苹果公司" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "c++开发" }], "style": { "textAlign": "right" } }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "公司还不错" }] }], "operations": [], "selection": null, "marks": null }, "id": "158873895292811", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "公司还不错" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "教育经历" }] }], "operations": [], "selection": null, "marks": null }, "id": "158873895292812", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "教育经历" }] }] }, { "editor": { "children": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2016.9-2020.6" }] }, { "type": "paragraph", "children": [{ "text": "西南科技大学" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "计算机科学与技术" }], "style": { "textAlign": "right" } }] }], "operations": [], "selection": null, "marks": null }, "id": "158873895292813", "showToolbar": false, "content": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2016.9-2020.6" }] }, { "type": "paragraph", "children": [{ "text": "西南科技大学" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "计算机科学与技术" }], "style": { "textAlign": "right" } }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "学习了数据结构等课程" }] }], "operations": [], "selection": null, "marks": null }, "id": "158873895292814", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "学习了数据结构等课程" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "个人评价" }] }], "operations": [], "selection": null, "marks": null }, "id": "158873895292815", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "个人评价" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "积极向上，热爱编程" }] }], "operations": [], "selection": null, "marks": null }, "id": "158873895292816", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "积极向上，热爱编程" }] }] }]] }
    ])
    useEffect(()=>{
        if (state.length < 1 || tempaltesModalVisible===false)return;
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
        console.log(JSON.stringify({
            ...tempaltesIndex,
            dom: state
        }))
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
                    for (let j of i){
                        let obj = createEditorFactory();
                        obj.children=j.editor.children
                        j.id = uniqueId(new Date().getTime())
                        j.editor = obj
                    }
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