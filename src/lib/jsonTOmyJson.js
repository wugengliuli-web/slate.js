import { createEditorFactory } from '../lib/createEditor'
import uniqueId from 'lodash/uniqueId'

export const jsonTomyJson = items => {
    let state = []
    items = items.map(item => {
        let { type } = item
        if(type === 'img') {
            item.children = [{ text: '' }]
            item.url = 'data:image/png;base64,' + item.url
            item.style = {
                initWidth: 696,
                width: 696
            }
        }
        let obj = {}
        obj.showToolbar = false
        obj.content = [item]
        obj.editor = createEditorFactory()
        obj.id = uniqueId()
        return obj
    })
    let res = []
    items.forEach((item, index) => {
        if((index % 20 === 0 && index !== 0)||(res.length !== 0 && index === items.length - 1)) {
            state.push(res)
            res = []
        } else {
            res.push(item)
        }
    })
    return state
}