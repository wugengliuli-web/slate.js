import { createEditorFactory } from '../lib/createEditor'
import uniqueId from 'lodash/uniqueId'

export const jsonTomyJson = items => {
    let state = []
    items = items.map(item => {
        let obj = {}
        obj.showToolbar = false
        obj.content = [item]
        obj.editor = createEditorFactory()
        obj.id = uniqueId()
        return obj
    })
    state.push(items)
    console.log(state)
    return state
}