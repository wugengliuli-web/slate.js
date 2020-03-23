import { createEditorFactory } from './createEditor'
import uniqueId from 'lodash/uniqueId'
export const createDataFactory = ({format}) => {
    let editor = createEditorFactory()
    let value = {
        editor,
        id: uniqueId(),
        showToolbar: false
    }
    if(format === 'table') {
        value['content'] = [{
            type: format,
            row: 2,
            column: 2,
            children: [
                {
                    type: 'table-row',
                    children: [
                        {
                            type: 'table-cell',
                            children: [{
                                type: 'table-content',
                                children: [{ text: '' }]
                            }],
                            style: {

                            }
                        },
                        {
                            type: 'table-cell',
                            children: [{
                                type: 'table-content',
                                children: [{ text: '' }]
                            }],
                            style: {

                            }
                        }
                    ]
                },
                {
                    type: 'table-row',
                    children: [
                        {
                            type: 'table-cell',
                            children: [{
                                type: 'table-content',
                                children: [{ text: '' }]
                            }]
                        },
                        {
                            type: 'table-cell',
                            children: [{
                                type: 'table-content',
                                children: [{ text: '' }]
                            }]
                        }
                    ]
                }
            ]
        }]
    } else {
        value['content'] = [{
            type: format,
            children: [{ text: '' }]
        }]
    }
    return value
}