import React from 'react'
import {
	BlockQuote,
	BulletedList,
	HeadingOne,
	HeadingTwo,
	ListLtem,
	NumberedList,
	Img,
	DefaultEl,
	CheckListItemElement,
	UploadImg
} from './el'


export const Element = props => {
	let { element } = props
	switch (element.type) {
		case 'block-quote':
			return <BlockQuote {...props} />
		case 'bulleted-list':
			return <BulletedList {...props} />
		case 'heading-one':
			return <HeadingOne {...props} />
		case 'heading-two':
			return <HeadingTwo {...props} />
		case 'list-item':
			return <ListLtem {...props} />
		case 'numbered-list':
			return <NumberedList {...props} />
		case 'check-list-item':
			return <CheckListItemElement {...props} />
		case 'addImage':
			return <UploadImg {...props} />
		case 'img':
			return <Img {...props} />
		default:
			return <DefaultEl {...props} />
	}
}