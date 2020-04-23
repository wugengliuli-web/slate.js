import React, { memo, useCallback, useRef, useEffect } from 'react'
import { Upload, Icon, message, Button } from 'antd';
import { css } from 'emotion'
import axios from 'axios'
import { jsonTomyJson } from '../lib/jsonTOmyJson'
import { addPageAction, setValAction, jumpPageAction } from '../store/action'
import { useDispatch, useMappedState } from 'redux-react-hook';
import download from 'downloadjs'
const { Dragger } = Upload;
const UploadFile = props => {
    let dispatch = useDispatch()
    let addPage = useCallback(() => {
        const action = addPageAction()
        dispatch(action)
    }, [])
    let state = useMappedState(state => state.state)
    const componentProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        // accept: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        beforeUpload(file) {
            if(!file) return
            let { type } = file
            console.log(type)
            if(/(document|docx)$/i.test(type)) {
                return Promise.resolve(file)
            } else {
                message.error('文件类型错误')
                return Promise.reject('error')
            }
        },
        async customRequest(info) {
            let { file } = info
            let fd = new FormData()
            fd.append('docFile', file)
            let res = await axios({
                url: 'http://112.44.251.136:8090/doc/conversionDocx',
                method: 'POST',
                data: fd,
                headers: {
                    'Content-Type': 'mutipart/form-data'
                }
            })
            let { data: { code, data } } = res

            let json = jsonTomyJson(data)
            const action = setValAction(json)
            dispatch(action)
        },
        onChange(info) {
            const { status } = info.file;
            if (status === 'uploading') {
                message.loading('开始上传')
            }
            if (status === 'done') {
                message.success(`${info.file.name}上传成功`);
            } else if (status === 'error') {
                message.error(`${info.file.name}上传失败`);
            }
        },
    };


    const upLoadPDF = useCallback(async e => {
        const json = state.reduce((prve, next) => {
            next = next.filter(item => item.type !== 'addImage').map(item => item.content)
            return prve.concat(...next)
        }, [])
        message.info('上传中', 0)
        const res = await axios({
            url: 'http://112.44.251.136:8090/doc/saveDocx',
            method: 'POST',
            data: json,
            responseType: 'blob'
        })
        const { data, headers } = res
        if(headers['content-type'] !== 'application/octet-stream; =') {
            message.error('转换失败')
        } else {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
            const req = download(blob, 'aa.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            if(req) {
                message.success('转换成功')
            } else {
                message.error('转换失败')
            }
        }
        message.destroy()
    }, [state])

    return (
        <div className={css`
            padding: 0 10%;
            margin-top: 30px;
        `}>
            <Dragger {...componentProps}>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击文件上传</p>
                <p className="ant-upload-hint">
                    支持docx文件
                </p>
            </Dragger>
            <Button
                onClick={addPage}
                className={css`
                margin-top:  20px;
            `}>添加一页</Button>
            <Button
                onClick={upLoadPDF}
                className={css`
                margin-left: 30px;
                margin-top:  20px;
            `}>下载</Button>
            {/* <Pagination className={css`
                margin-top:  20px;
            `} current={pageNumber} defaultPageSize={1}  simple total={pageLength} onChange={(e)=>{junpPage(e)}} /> */}

        </div>
    )
}

export default memo(UploadFile)