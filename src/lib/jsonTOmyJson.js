import { createEditorFactory } from '../lib/createEditor'
import uniqueId from 'lodash/uniqueId'

export const jsonTomyJson = items => {
    let state = []
    items = items.map(item => {
        let { type } = item
        if(type === 'img') {
            item.children = [{ text: '' }]
            let img = new Image()
            img.src = item.url
            img.onload = function() {
                item.style = {
                    initWidth: img.width
                }
            }
        }
        item.style = {}
        let obj = {}
        obj.showToolbar = false
        obj.content = [item]
        obj.editor = createEditorFactory()
        obj.id = uniqueId()
        return obj
    })
    state.push(items)
    return state
}