import React, { memo } from 'react'
import { Upload, Icon, message } from 'antd';
import { css } from 'emotion'
import axios from 'axios'
import htmlTOJSON from '../lib/htmlTOJSON'
// import html from '../test/docx'
const { Dragger } = Upload;


const UploadFile = ({ setState }) => {

    const props = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        accept: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        beforeUpload(file) {
            if(!file) return
            let { type } = file
            console.log(file);
            
            if(/(document|doc|docx)$/i.test(type)) {
                return Promise.resolve(file)
            } else {
                message.error('文件类型错误')
                return Promise.reject('error')
            }
        },
        customRequest(info) {
            let { file } = info
            axios.get('./static/Test-02.html').then(res => {
                
                let ans = htmlTOJSON(res.data)
                console.log(ans);
                
                setState(ans)
                
            })
            
            
            
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


    return (
        <div className={css`
            padding: 0 10%;
            margin-top: 30px;
        `}>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击文件上传</p>
                <p className="ant-upload-hint">
                    支持word文件
                </p>
            </Dragger>
        </div>
    )
}

export default memo(UploadFile)