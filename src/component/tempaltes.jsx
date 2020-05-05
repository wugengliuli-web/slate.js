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
        { "title": "简历模板1", "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABXCAYAAAB81qkrAAAEW0lEQVR4Xu2bSUskQRBGo933XURBD+J2EDx48CD4zwVvHsSLCi4HcQUV3HFfeng5k+MyVlvaoT1YX0JTbdsVWfXqy4jIyOxcPp/Pm1pRBHKCWBS/cLIgFs9QEB0YCqIgehBwsJHoEwnal5eXVlZWZlVVVXZ0dGQVFRXW2NgYjmpPBBIhnp6e2szMTADW19cXgDY1NdnAwIBVVlaK4TMCiRDv7+9tdnbWcrmcPTw8WHd3t7W0tASobW1tgpgG4uPjY4CHAhnaMSevra21mpoaQUwDUZTSE1CynZ5V4jcF8SshHh8f2/z8vPX29oaIXF5e7tDdzzRRME8ksBCdBbDww9dwdhgciRBvb29tc3MzzFTq6+vt7OzMyB1pw8PD1tXV5dD9zzBRcMaytrZm6+vrYYZycnISQDY0NNjU1JQNDQ39DAIOd1FwxnJzcxPUh09kDs2Lz6qrq5VwK9l2kJ8glgDixcVFGNYLCwuh946OjjC0Dw4OQmmstbU1BKHx8fEQhLLWUqc4sSABTADS4pH35JNZrTOmgkiaA6SlpaVEJW5sbNjo6Ki1t7dnTYjp11ikxGRtpFJi5qT1wRsWxA8Ce+vrgviVEO/u7mx1ddWurq7Cah+zlBhgBgcHQ5qj9ptAohLJDVntY1EKiIeHh2H6Rx5IfVEQnySUCJFoTE5IaoMqOQIWiBQkspoTyid+kf9RYHEAmwiRktfOzk6oH15fX4fAwvBm/ZnpHsMaH8nc+TNtbm4unLuysmKdnZ1/fS9uhD5Y32adh2A2OTlZkl0XuDHW3YkJW1tboQxYV1dn/f39L6e8pdrkyQU9n4MDL87B+Zy/efGeh4VPLmWL600IiZjw/Ho0nB2ejCB+F8Td3d3gD/CR+K/orzjGtAf/he9obm62vb09m5iYKIkfc2DyYROplBjzRPxAfMW6Ij4rbniKO8jwZQAttR/7MI1PnpAK4idtZ+Y0QXR41IkQGcKsOcfUg+G5v78fhqgKEC/JF1y8n56eDuvLy8vLNjY2FgCqAPGvdN9dvCfRjbtkVYB4e+zLJ36lT3SwnRkT7xYgKBJQgIj5IQGHYMPnBBt+UeDd+PnH4uJicCOxAEJiT4GY/tmxxs605+vexVwDEwkKIdzL+fl5uD/6oPDMJi7iAnNnXBv58cjIyP9RgCh001zw62Q+FiM4z7sgwcOK2wZ5T4GB/qJwYjGEvilGv55EyCcWI+E/5wrid0GkAIGPwFfhN5D79vZ2KFj29PQEiVN0wF9FP4IfpZiahR8OpVJizBNjgYGHh98CGhVvGt/h/7GgmqUN86kgOij+R5sQRIfHK4iC6EDAwYSUKIgOBBxMSImC6EDAwYSUKIgOBBxMSImC6EDAwYSUKIgOBBxMSImC6EDAwYSUKIgOBBxMSImC6EDAwYSUKIgOBBxMSImC6EDAwYSUKIgOBBxMSImC6EDAwYSUKIgOBBxMSImC6EDAwYSUKIgOBBxMSIkOEH8B6jAUKazPTxcAAAAASUVORK5CYII=", "dom": [[{ "editor": { "children": [{ "type": "heading-one", "style": {}, "children": [{ "text": "姓名" }] }], "operations": [], "selection": null, "marks": null }, "id": "1", "showToolbar": false, "content": [{ "type": "heading-one", "style": {}, "children": [{ "text": "姓名" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": {}, "children": [{ "text": "简介" }] }], "operations": [], "selection": null, "marks": null }, "id": "2", "showToolbar": false, "content": [{ "type": "paragraph", "style": {}, "children": [{ "text": "简介" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "技能掌握" }] }], "operations": [], "selection": null, "marks": null }, "id": "3", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "技能掌握" }] }] }, { "editor": { "children": [{ "type": "numbered-list", "children": [{ "type": "list-item", "style": "{}", "children": [{ "text": "精通掌握技能1" }], "checked": false }, { "type": "list-item", "style": "{}", "children": [{ "text": "精通掌握技能2" }], "checked": false }] }], "operations": [], "selection": null, "marks": null }, "id": "4", "showToolbar": false, "content": [{ "type": "numbered-list", "children": [{ "type": "list-item", "style": "{}", "children": [{ "text": "精通掌握技能1" }], "checked": false }, { "type": "list-item", "style": "{}", "children": [{ "text": "精通掌握技能2" }], "checked": false }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "实习经历" }] }], "operations": [], "selection": null, "marks": null }, "id": "5", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "实习经历" }] }] }, { "editor": { "children": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2018.3-2019.3" }] }, { "type": "paragraph", "children": [{ "text": "西南科技大学实训" }] }, { "type": "paragraph", "children": [{ "text": "c++开发" }], "style": { "textAlign": "right" } }] }], "operations": [], "selection": null, "marks": null }, "id": "8", "showToolbar": false, "content": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2018.3-2019.3" }] }, { "type": "paragraph", "children": [{ "text": "西南科技大学实训" }] }, { "type": "paragraph", "children": [{ "text": "c++开发" }], "style": { "textAlign": "right" } }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "实训学到了喝多东西" }] }], "operations": [], "selection": null, "marks": null }, "id": "9", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "实训学到了喝多东西" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "教育经历" }] }], "operations": [], "selection": null, "marks": null }, "id": "11", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "教育经历" }] }] }, { "editor": { "children": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2016.9-2020.6" }] }, { "type": "paragraph", "children": [{ "text": "西南科技大学" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "计算机科学与技术" }], "style": { "textAlign": "right" } }] }], "operations": [], "selection": null, "marks": null }, "id": "10", "showToolbar": false, "content": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2016.9-2020.6" }] }, { "type": "paragraph", "children": [{ "text": "西南科技大学" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "计算机科学与技术" }], "style": { "textAlign": "right" } }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "学习了数据结构等课程" }] }], "operations": [], "selection": null, "marks": null }, "id": "12", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "学习了数据结构等课程" }] }] }]] }
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