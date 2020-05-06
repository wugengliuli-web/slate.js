import React, { useState, useEffect} from 'react'
import { Modal, Slider, Button, Input, Divider} from 'antd';
import { css } from 'emotion';
import uniqueId from 'lodash/uniqueId'
import { useMappedState } from 'redux-react-hook';
// 截屏，获取文档概览
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
const { confirm } = Modal;
// 发现有未保存文档时的提醒
function showConfirm(callback) {
    confirm({
        title: '当前有未保存的编辑，是否保存为临时文档？',
        content: '若保存为临时保存，关闭网页后丢失。',
        okText:'保存',
        cancelText:'不保存',
        onOk() {
            callback(true);
        },
        onCancel() {
            callback(false);
        },
    });
}
const Tempaltes = props => {
    const dispatch = useDispatch()
    let state = useMappedState(state => state.state || [])
    // Modal的控制
    let [tempaltesModalVisible, setTempaltesModalVisible] = useState(false)
    // tempaltesFlag为0表示进行保存文档操作，为1表示进行选择文档操作
    let [tempaltesFlag, settempaltesFlag] = useState(0)
    // 设置文档的信息
    let [tempaltesIndex, settempaltesIndex] = useState({title:'我的组件',img:{}})
    // 文档列表
    let [tempaltesDate, setTempaltesDate] = useState([
        { "title": "新建", "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABXCAYAAAB81qkrAAABJ0lEQVR4Xu3UsQ0AIAwEMdh/6CCxQq40fa6wXtyZmeOtBC7Eld8/hrg3hBgYQoRYCAQNfyLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWGKA+ACYRlsLFbaUpgAAAABJRU5ErkJggg==", "dom": [[]] },
        { "title": "网页简介", "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABXCAYAAAB81qkrAAACYUlEQVR4Xu3Wy44BURSF4V3utyAuCfEYEu8/MTc1ITEgBAkRxLWzT8JMR1KrB/RfE1SXlarP6nN2dL/f78YRSyACMZZf+DKI8Q1BFBiCCKJCQJDxck28XC622+1ssVhYMpk038QTiYRVKhXb7/d2u92s3W7bZrOxRqNhURQJbuczI37dWIbDoU0mE3PQVqsVnjCbzdp4PLbr9Wr1et2azaat12vrdrt2OBysXC5/pkSMu36J6G3r9/sBJp/PPxFLpZINBgMrFArW6XQsl8uZn3Nkx6zVajFu5zO/+msTj8ejnc/n0MTHTO5o3sbVahX+hYvFYnh16P96MCcKfnkQQRQICCLeauJsNgvr4nK5DDuyr4/T6dTS6XTYnX3t3G63Vq1Ww3rpY5FvTH6tj0Wj0SiMRj4KzefzcK7X61kmk/mK0egtRN9cHhtLKpV6PrjPir6p+N9Op1OYJx+f/Zy/dzC/zg9/78dj5vTrv+F4C/EbHvQvnwFEgS6IIAoEBBE0EUSBgCCCJoIoEBBE0EQQBQKCCJoIokBAEEETQRQICCJoIogCAUEETQRRICCIoIkgCgQEETQRRIGAIIImgigQEETQRBAFAoIImgiiQEAQQRNBFAgIImgiiAIBQQRNBFEgIIigiSAKBAQRNBFEgYAggiaCKBAQRNBEEAUCggiaCKJAQBBBE0EUCAgiaCKIAgFBBE0EUSAgiKCJIAoEBBE0EUSBgCCCJoIoEBBE0EQQBQKCCJoIokBAEEETQRQICCJoIogCAUEETQRRICCIoIkgCgQEETQRRIGAIIImgigQEET8AJlt3wv0NEvkAAAAAElFTkSuQmCC", "dom": [[{ "editor": { "children": [{ "type": "heading-one", "style": {}, "children": [{ "text": "项目简介：" }] }], "operations": [], "selection": null, "marks": null }, "id": "1", "showToolbar": false, "content": [{ "type": "heading-one", "style": {}, "children": [{ "text": "项目简介：" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "这是个组件化的文档在线编辑网页。" }] }], "operations": [], "selection": null, "marks": null }, "id": "2", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "这是个组件化的文档在线编辑网页。" }] }] }]] },
        { "title": "简历模板", "img": "data:image/png;base64,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", "dom": [[{ "editor": { "children": [{ "type": "heading-one", "style": {}, "children": [{ "text": "姓名" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887526262261", "showToolbar": false, "content": [{ "type": "heading-one", "style": {}, "children": [{ "text": "姓名" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": {}, "children": [{ "text": "简介" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887526262262", "showToolbar": false, "content": [{ "type": "paragraph", "style": {}, "children": [{ "text": "简介" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "基本信息" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887526262263", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "基本信息" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": {}, "children": [{ "text": "2020年毕业 | 186xxxxxxxx | 计算机科学与技术" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887526262264", "showToolbar": false, "content": [{ "type": "paragraph", "style": {}, "children": [{ "text": "2020年毕业 | 186xxxxxxxx | 计算机科学与技术" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "技能掌握" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887526262265", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "技能掌握" }] }] }, { "editor": { "children": [{ "type": "numbered-list", "children": [{ "type": "list-item", "style": "{}", "children": [{ "text": "精通掌握技能1" }], "checked": false }, { "type": "list-item", "style": "{}", "children": [{ "text": "精通掌握技能2" }], "checked": false }] }], "operations": [], "selection": null, "marks": null }, "id": "15887526262266", "showToolbar": false, "content": [{ "type": "numbered-list", "children": [{ "type": "list-item", "style": "{}", "children": [{ "text": "精通掌握技能1" }], "checked": false }, { "type": "list-item", "style": "{}", "children": [{ "text": "精通掌握技能2" }], "checked": false }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "实习经历" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887526262267", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "实习经历" }] }] }, { "editor": { "children": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2018.3-2019.3" }] }, { "type": "paragraph", "children": [{ "text": "西南科技大学实训" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "c++开发" }], "style": { "textAlign": "right" } }] }], "operations": [], "selection": null, "marks": null }, "id": "15887526262268", "showToolbar": false, "content": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2018.3-2019.3" }] }, { "type": "paragraph", "children": [{ "text": "西南科技大学实训" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "c++开发" }], "style": { "textAlign": "right" } }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "实训学到了很多东西" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887526262269", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "实训学到了很多东西" }] }] }, { "editor": { "children": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2019.3-2019.8" }] }, { "type": "paragraph", "children": [{ "text": "美国苹果公司" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "c++开发" }], "style": { "textAlign": "right" } }] }], "operations": [], "selection": null, "marks": null }, "id": "158875262622610", "showToolbar": false, "content": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2019.3-2019.8" }] }, { "type": "paragraph", "children": [{ "text": "美国苹果公司" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "c++开发" }], "style": { "textAlign": "right" } }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "公司还不错" }] }], "operations": [], "selection": null, "marks": null }, "id": "158875262622611", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "公司还不错" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "教育经历" }] }], "operations": [], "selection": null, "marks": null }, "id": "158875262622612", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "教育经历" }] }] }, { "editor": { "children": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2016.9-2020.6" }] }, { "type": "paragraph", "children": [{ "text": "西南科技大学" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "计算机科学与技术" }], "style": { "textAlign": "right" } }] }], "operations": [], "selection": null, "marks": null }, "id": "158875262622613", "showToolbar": false, "content": [{ "type": "flexText", "children": [{ "type": "paragraph", "children": [{ "text": "2016.9-2020.6" }] }, { "type": "paragraph", "children": [{ "text": "西南科技大学" }], "style": { "textAlign": "center" } }, { "type": "paragraph", "children": [{ "text": "计算机科学与技术" }], "style": { "textAlign": "right" } }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "学习了数据结构等课程" }] }], "operations": [], "selection": null, "marks": null }, "id": "158875262622614", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "学习了数据结构等课程" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "个人评价" }] }], "operations": [], "selection": null, "marks": null }, "id": "158875262622615", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "个人评价" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "积极向上，热爱编程" }] }], "operations": [], "selection": null, "marks": null }, "id": "158875262622616", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "积极向上，热爱编程" }] }] }]] },
        { "title": "论文模板", "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABXCAYAAAB81qkrAAAD5klEQVR4Xu2cy05iQRCGCxRFAS/ECxAWbiTGxIWJO5/Aje+rb2DcGhfKQo1AMFEJ3m8w+WvCZDIzenqkzlAOfyfkqEfq0F//p7pOVxeJbrfbFba+CCQIsS9++mZC7J8hIRowJERCtCBgYMOdT7y7u9Nu4biwsCD39/eSTCalVqvp31OplCQSCXl4eJBCoSBTU1MGGPoz4Q7i5eWlnJ6eSj6fl3a7LePj43Jzc/MDYrFYlImJCXl7e1PIpVKpPwIG73YHEQo7OTmRkZERmZubk2q1KtlsVg4PDyWXyym40dFRVSPOQ42Dbu4gvr6+yuPjo4JcXFyU2dlZ/f3l5UVarZYeoVLc4ul0WiYnJwfNkLOzxQi4U6JFp/61DUI0IB4E8eDgQJ6enqTT6cjq6qrOjvBJbN8JBEGEM8dsiIZZs/czIf4FRML6mECQEgnRAGKj0dDHrLOzMw1w8ZSQyWT0aYIt0CciAMYCOCYT+MPeiwDpE800QJ9ogNI9RMSmeKHBnXiMT11DrNfrcn5+LtfX1/L8/CwrKysKtFKpuIpVXUPEqg3WFhEZYP0Qx5mZGVlfX9eg30tzDdELpKjPQYhRhALOE2IApKh/CYJ4dXUleI2NjWnQjWB7enpaV5WROBr2FgRx2CFF9Z8QowgFnCfEAEhR/xIEEYl0+ESs2iBeQ4yGmA3Ztvn5eZdPEVEdtzwfBBEX7G1j5Kr27/iDIVqO3P9mixANRtQ9RGwjQcPCAzKOa2trBt22NeEe4t7enk5mWF2HP97c3HQ3kbmH2NtqhycjrCV6TNm6h2h748VjjRANuBLiMEBEkN9L2WIVyWOjEg1GxT1EKtFglL+CCSrRYJTcQzToY+wm3EOkT4xdAz4uQCUajIN7iAZ9jN2Ee4j0ibFrwMcF3CvRB6aPPwUhGoySO4jIbx8fH8vy8rJWk6LCdH9/X6tNUet8cXGhFQzIe+PIKtM/qAC7Y3d3d2VjY0M3UKEEbmdnR5aWlhTk0dGRJqtQSI4SOWysGnRzp0RsK0ZCqpdP+RkQ1hWR8UOeBaVy2IHhYVeaO4iDVtVnrk+In6H2y3vehYjbCn4HOV98BwN80e3trTpy+CmkMjEBbG9va4naMLd3IWJWxO4DwCyXy4KaZ3y9CvxVs9nUcghMAltbW4QY+oVrcOpQIpw6nDm2dUClUKancohB3BH0iQbUCXEYIHIVx2CUv4IJ97czlfgVZGTwGanEYYBo0MfYTVCJBojdQzToY+wm3EPk7By7BnxcgEo0GAf3EA36GLsJQjRATIiEaEDAwASVSIgGBAxMUImEaEDAwASVSIgGBAxMUIkGEL8BpojYGix6lOAAAAAASUVORK5CYII=", "dom": [[{ "editor": { "children": [{ "type": "heading-one", "style": { "textAlign": "center" }, "children": [{ "text": "论文题目" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887518161391", "showToolbar": false, "content": [{ "type": "heading-one", "style": { "textAlign": "center" }, "children": [{ "text": "论文题目" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "摘要：" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887518161392", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "摘要：" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "关键字：" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887518161393", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "关键字：" }] }] }, { "editor": { "children": [{ "type": "heading-one", "style": { "textAlign": "center" }, "children": [{ "text": "Title" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887518161394", "showToolbar": false, "content": [{ "type": "heading-one", "style": { "textAlign": "center" }, "children": [{ "text": "Title" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "Abstract：" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887518161395", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "Abstract：" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "Key words:" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887518161396", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "paddingLeft": "28px" }, "children": [{ "text": "Key words:" }] }] }, { "editor": { "children": [{ "type": "heading-two", "style": { "paddingLeft": "0px", "textAlign": "center" }, "children": [{ "text": "目录" }] }], "operations": [], "selection": null, "marks": null }, "id": "15887518161397", "showToolbar": false, "content": [{ "type": "heading-two", "style": { "paddingLeft": "0px", "textAlign": "center" }, "children": [{ "text": "目录" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }], "operations": [], "selection": null, "marks": null }, "id": "13", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }] }, { "editor": { "children": [{ "type": "heading-two", "style": { "textAlign": "center" }, "children": [{ "text": "第一章 绪论" }] }], "operations": [], "selection": null, "marks": null }, "id": "9", "showToolbar": false, "content": [{ "type": "heading-two", "style": { "textAlign": "center" }, "children": [{ "text": "第一章 绪论" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "1.1 项目背景" }] }], "operations": [], "selection": null, "marks": null }, "id": "11", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "1.1 项目背景" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }], "operations": [], "selection": null, "marks": null }, "id": "15", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }] }], [{ "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "1.2 解决的问题" }] }], "operations": [], "selection": null, "marks": null }, "id": "14", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "1.2 解决的问题" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }], "operations": [], "selection": null, "marks": null }, "id": "18", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }] }, { "editor": { "children": [{ "type": "heading-two", "style": { "textAlign": "center" }, "children": [{ "text": "第二章 技术总览" }] }], "operations": [], "selection": null, "marks": null }, "id": "16", "showToolbar": false, "content": [{ "type": "heading-two", "style": { "textAlign": "center" }, "children": [{ "text": "第二章 技术总览" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "2.1 用到的技术" }] }], "operations": [], "selection": null, "marks": null }, "id": "17", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "2.1 用到的技术" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }], "operations": [], "selection": null, "marks": null }, "id": "20", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "2.2 技术可行性研究" }] }], "operations": [], "selection": null, "marks": null }, "id": "19", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "2.2 技术可行性研究" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }], "operations": [], "selection": null, "marks": null }, "id": "10", "showToolbar": false, "content": [{ "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }, { "type": "paragraph", "style": { "textAlign": "center" }, "children": [{ "text": "......" }] }] }, { "editor": { "children": [{ "type": "heading-three", "style": {}, "children": [{ "text": "2.3 数据支撑" }] }], "operations": [], "selection": null, "marks": null }, "id": "21", "showToolbar": false, "content": [{ "type": "heading-three", "style": {}, "children": [{ "text": "2.3 数据支撑" }] }] }, { "editor": { "children": [{ "type": "table", "row": 2, "column": 2, "children": [{ "type": "table-row", "children": [{ "type": "table-cell", "children": [{ "type": "table-content", "children": [{ "text": "" }] }], "style": {} }, { "type": "table-cell", "children": [{ "type": "table-content", "children": [{ "text": "" }] }], "style": {} }] }, { "type": "table-row", "children": [{ "type": "table-cell", "children": [{ "type": "table-content", "children": [{ "text": "" }] }] }, { "type": "table-cell", "children": [{ "type": "table-content", "children": [{ "text": "" }] }] }] }], "style": {} }], "operations": [], "selection": null, "marks": null }, "id": "22", "showToolbar": false, "content": [{ "type": "table", "row": 2, "column": 2, "children": [{ "type": "table-row", "children": [{ "type": "table-cell", "children": [{ "type": "table-content", "children": [{ "text": "" }] }], "style": {} }, { "type": "table-cell", "children": [{ "type": "table-content", "children": [{ "text": "" }] }], "style": {} }] }, { "type": "table-row", "children": [{ "type": "table-cell", "children": [{ "type": "table-content", "children": [{ "text": "" }] }] }, { "type": "table-cell", "children": [{ "type": "table-content", "children": [{ "text": "" }] }] }] }], "style": {} }] }, { "editor": { "children": [{ "type": "heading-two", "style": { "textAlign": "center" }, "children": [{ "text": "第三章 参考文献" }] }], "operations": [], "selection": null, "marks": null }, "id": "23", "showToolbar": false, "content": [{ "type": "heading-two", "style": { "textAlign": "center" }, "children": [{ "text": "第三章 参考文献" }] }] }, { "editor": { "children": [{ "type": "paragraph", "style": "{}", "children": [{ "text": "[1] 姓名.论文名称" }], "checked": false }, { "type": "paragraph", "style": "{}", "children": [{ "text": "[2] 姓名.论文名称" }], "checked": false }], "operations": [], "selection": null, "marks": null }, "id": "24", "showToolbar": false, "content": [{ "type": "paragraph", "style": "{}", "children": [{ "text": "[1] 姓名.论文名称" }], "checked": false }, { "type": "paragraph", "style": "{}", "children": [{ "text": "[2] 姓名.论文名称" }], "checked": false }] }]] }
    ])
    // 临时文档列表
    let [timmingTempaltesDate, settimmingTempaltesDate] = useState([])

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
    // 添加文档
    function addTempaltes(){
        setTempaltesDate((e) => {
            e.push({
                ...tempaltesIndex,
                dom: state
            }); return e;
        })
        setTempaltesModalVisible(false)
    }
    // 保存临时文档
    function saveTimmingTempaltes(callback){
        let dom = document.getElementById('pageRoot').childNodes[0].childNodes[0];
        html2canvas(dom, { // 转换为图片
            useCORS: true, // 解决资源跨域问题
            scale: (0.1, 0.1),
        }).then(canvas => {
            let imgUrl= canvas.toDataURL('image/png');
            settimmingTempaltesDate((e) => {
                e.push({
                    title: (new Date().toLocaleTimeString()), 
                    img: imgUrl,
                    dom: state
                }); return e;
            })
            callback()
        })
    }
    // 加载文档
    function setTempaltes(num){
        let tempaltesValue;
        if(num[0]==='t'){
            tempaltesValue = timmingTempaltesDate[num.slice(7)].dom
        }
        else{
            tempaltesValue = tempaltesDate[num].dom
        }
         
        for (let i of tempaltesValue)
            for (let j of i) {
                let obj = createEditorFactory();
                j.id = uniqueId(new Date().getTime())
                j.editor = obj
            }
        const action = setTempaltesAction(tempaltesValue)
        dispatch(action)
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
                保存文档
        </Button>
            <Button type="primary"
                onClick={() => { 
                        setTempaltesModalVisible(true);
                        settempaltesFlag(1) 
                }}
                className={css`
            margin-top:  20px;
        `}>
                选择文档
        </Button>
            <Modal
                title={tempaltesFlag ? "选择文档" : "保存文档"}
                visible={tempaltesModalVisible}
                width={tempaltesFlag ? '80%' : '40%'}
                onCancel={()=>{setTempaltesModalVisible(false)}}
                footer={null}
            >
                {tempaltesFlag ? <div className={css`
                display:flex;
                flex-wrap:wrap;
            `} onClick={(e) => {
                let num = e.target.parentNode.getAttribute('num');
                if (!num) return;
                setTempaltesModalVisible(false)
                if(state.length){
                    // 提示用户有未保存的编辑
                    showConfirm((re)=>{
                        if(re){
                            saveTimmingTempaltes(()=>{
                                setTempaltes(num)
                            })
                        }
                        else{
                            setTempaltes(num)
                        }
                    })
                }else{
                    setTempaltes(num)
                }
                
            }}
            >
                    {timmingTempaltesDate.length ? <Divider orientation="left"><span className={css`font-size:x-small`}>临时文档，退出网页即删除</span></Divider>:null}
                    {timmingTempaltesDate.map((value, index) =>
                        <TempaltesItem data={value} key={'timming' + index} num={'timming' +index} />)}
                    {timmingTempaltesDate.length ? <Divider orientation="left"><span className={css`font-size:x-small`}>系统保存文档</span></Divider> : null}
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
                            <Button type="primary" onClick={addTempaltes}>保存到文档库</Button>
                    </div>}
            </Modal>
        </div>)
}
export default Tempaltes;