import React, { useState, useEffect, useCallback} from 'react'
import { Modal, message, Button, Input, Divider} from 'antd';
import { css } from 'emotion';
import uniqueId from 'lodash/uniqueId'
import { useMappedState } from 'redux-react-hook';
// 截屏，获取模板概览
import html2canvas from 'html2canvas'
import { setTempaltesAction} from '../store/action'
import { useDispatch } from 'redux-react-hook';
// 给组件绑定拖拽事件
import { createEditorFactory } from '../lib/createEditor'
import axios from 'axios'

const TempaltesItem = props => {
    return <div className={css`margin:5px 10px;${props.choose?'background:#eee;':null}`} num={props.num}>
        <img src={props.data.img} style={{ width: '100%', height: '130px',border:'1px solid #eee' }} />
        <p className={css`text-align:center;`}>{props.data.title}</p>
    </div>
}
const { confirm } = Modal;
// 发现有未保存模板时的提醒
function showConfirm(callback) {
    confirm({
        title: '当前有未保存的编辑，是否保存为临时模板？',
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

// 判断是否修改了模板，用于提示是否保存
function isChange(obj1,obj2){
    if (obj1.length!==obj2.length)return true;
    for (let j = 0; j < obj1.length;j++){
        if (obj1[j].length !== obj2[j].length) return true;
        for (let i = 0; i < obj1[j].length; i++) {
            if (JSON.stringify(obj1[j][i].content) !== JSON.stringify(obj2[j][i].content)) return true;
        }
    }
    return false;
}

const Tempaltes = props => {
    const dispatch = useDispatch()
    let state = useMappedState(state => state.state || [])
    // Modal的控制
    let [tempaltesModalVisible, setTempaltesModalVisible] = useState(false)
    // tempaltesFlag为0表示进行保存模板操作，为1表示进行选择模板操作
    let [tempaltesFlag, settempaltesFlag] = useState(0)
    // 当前正在编辑模板的信息
    let [tempaltesIndex, settempaltesIndex] = useState({id:'0',title:'我的组件',img:{}})
    // 模板列表
    let [tempaltesDate, setTempaltesDate] = useState([
        {
            "title": "新建",
            "dom": "[[]]",
            "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABXCAYAAAB81qkrAAABJ0lEQVR4Xu3UsQ0AIAwEMdh/6CCxQq40fa6wXtyZmeOtBC7Eld8/hrg3hBgYQoRYCAQNfyLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWCLEQCBIWGKA+ACYRlsLFbaUpgAAAABJRU5ErkJggg==" },
        ])
    // 临时模板列表
    let [timmingTempaltesDate, settimmingTempaltesDate] = useState([])
    useEffect(()=>{
        async function fun () {
            let res = await axios({
                url: 'http://47.56.80.94:8090/template/list',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let { data: { msg, data } } = res
            if (msg === 'Success') {
                data.unshift(tempaltesDate[0])
                setTempaltesDate(data)
            } else {
                message.error(`模板获取失败`);
            }
        }
        fun()
    }, [tempaltesModalVisible])

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
    // 删除模板
    const deleteTempalate = useCallback(async e=>{
        if (tempaltesIndex.id[0] !== 't') {
            let res = await axios({
                url: 'http://47.56.80.94:8090/template/' + tempaltesDate[tempaltesIndex.id].id,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let { data:{msg} } = res
            if (msg === 'Success') {
                message.success(`模板删除成功`);
                setTempaltesDate([...tempaltesDate.slice(0, tempaltesIndex.id), ...tempaltesDate.slice(tempaltesIndex.id+1)])
            }
            else{
                message.error(`模板删除失败`);
            }
            
        }else{
            let arr = JSON.parse(JSON.stringify(timmingTempaltesDate));
            arr.splice(tempaltesIndex.id.slice(7),1)
            settimmingTempaltesDate(arr)
            message.success(`临时文档删除成功`);
        }
    })
    // 跟新模板
    const updateTempalate = useCallback(async e => {
        let newTemoaltes = {
            ...tempaltesIndex,
            dom: JSON.stringify(state)
        }
        if (tempaltesIndex.id[0] !== 't') {
            let res = await axios({
                url: 'http://47.56.80.94:8090/template',
                method: 'PUT',
                data:{
                    ...newTemoaltes,
                    id: tempaltesDate[tempaltesIndex.id].id
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let { status } = res
            if (status === 200) {
                message.success(`模板更新成功`);
                setTempaltesDate([...tempaltesDate.slice(0, tempaltesIndex.id), ...tempaltesDate.slice(tempaltesIndex.id + 1)])
            }
            else {
                message.error(`模板更新失败`);
            }
        } else {
            let arr = JSON.parse(JSON.stringify(timmingTempaltesDate)) ;
            arr[tempaltesIndex.id.slice(7)] = newTemoaltes
            settempaltesIndex((text)=>({
                ...newTemoaltes,
                id:text.id
            }))
            settimmingTempaltesDate(arr)
            message.success(`模板更新成功`);
        }
        setTempaltesModalVisible(false)
    })
    // 添加模板
    const addTempaltes =useCallback(async e=>{
        let newTemoaltes = {
            ...tempaltesIndex,
            dom: JSON.stringify(state),
            id:-1 
        }
        setTempaltesDate((e) => {
            e.push(newTemoaltes); return e;
        })
        let res = await axios({
            url: 'http://47.56.80.94:8090/template',
            method: 'POST',
            data: {...newTemoaltes},
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let { status } = res
        if (status===200)message.success(`模板保存成功`);
        setTempaltesModalVisible(false)
    })
    // 保存临时模板
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
                    dom: JSON.stringify(state) 
                }); return e;
            })
            callback()
        })
    }
    // 加载模板
    function setTempaltes(num){
        let tempaltesValue;
        if (num[0] === 't') {
            tempaltesValue = JSON.parse(timmingTempaltesDate[num.slice(7)].dom)
            settempaltesIndex((text)=>({ ...timmingTempaltesDate[num.slice(7)],id:text.id}))
        }
        else {
            tempaltesValue = JSON.parse(tempaltesDate[num].dom)
            settempaltesIndex((text)=>({
                ...tempaltesDate[num],
                id:text.id
            }))
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
                disabled={!state.length}
                onClick={() => { setTempaltesModalVisible(true); settempaltesFlag(0) }}
                className={css`
            margin-top:  20px;
        `}>
                保存模板
        </Button>
            <Button type="primary"
                onClick={() => { 
                        setTempaltesModalVisible(true);
                        settempaltesFlag(1) 
                }}
                className={css`
            margin-top:  20px;
        `}>
                选择模板
        </Button>
            <Modal
                title={tempaltesFlag ? "选择模板" : "保存模板"}
                visible={tempaltesModalVisible}
                width={tempaltesFlag ? '80%' : '40%'}
                footer={<p><Button 
                        onClick={()=>{
                        if (tempaltesFlag) {
                            deleteTempalate()
                        }
                        else {
                            updateTempalate()
                        }
                        }}
                        disabled={tempaltesIndex.id==='0'}
                    >{tempaltesFlag ? '删除模板' : '更新模板'}</Button>
                    <Button type="primary"
                        onClick={()=>{
                            if (tempaltesFlag){
                                let num = tempaltesIndex.id
                                // 判断是否有修改
                                if (tempaltesIndex.dom && isChange(state,JSON.parse(tempaltesIndex.dom)) ) {
                                    // 提示用户有未保存的编辑
                                    showConfirm((re) => {
                                        if (re) {
                                            saveTimmingTempaltes(() => {
                                                setTempaltes(num)
                                            })
                                        }
                                        else {
                                            setTempaltes(num)
                                        }
                                    })
                                } else {
                                    setTempaltes(num)
                                }
                            }else{
                                addTempaltes()
                            }
                            setTempaltesModalVisible(false)
                            
                        }}
                    >{tempaltesFlag ? '选择' : '保存为新模板'}</Button></p>
                }
                onCancel={()=>{
                    setTempaltesModalVisible(false)
                }}
            >
                {tempaltesFlag ? <div className={css`
                display:flex;
                flex-wrap:wrap;
            `} onClick={(e) => {
                let num = e.target.parentNode.getAttribute('num');
                settempaltesIndex((text)=>({ ...text,id:num}))
            }}
            >
                    {timmingTempaltesDate.length ? <Divider orientation="left"><span className={css`font-size:x-small`}>临时模板，退出网页即删除</span></Divider>:null}
                    {timmingTempaltesDate.map((value, index) =>
                        <TempaltesItem data={value} key={'timming' + index} num={'timming' + index} choose={('timming' + index)===tempaltesIndex.id}/>)}
                    {timmingTempaltesDate.length ? <Divider orientation="left"><span className={css`font-size:x-small`}>系统保存模板</span></Divider> : null}
                    {tempaltesDate.map((value, index) => 
                        <TempaltesItem data={value} key={index} num={index} choose={(index+'')===tempaltesIndex.id}/>)}
                </div> : <div className={css`
                    display:flex;
                    flex-direction:column;
                    >*{margin-top:15px;}`}>
                            <p>输入组件名称：</p>
                        <Input  value={tempaltesIndex.title}
                            onChange={(e) => {
                                let title=e.target.value;
                                settempaltesIndex(
                                    (text) => ({ ...text, title: title}))}
                            }/>
                            <p >组件封面预览：</p>
                            <div><img src={tempaltesIndex.img} className={css`border:1px solid #eee;`}/></div>
                    </div>}
            </Modal>
        </div>)
}

export default Tempaltes;