import React from 'react'
import {
	BlockQuote,
	BulletedList,
	HeadingOne,
	HeadingTwo,
	HeadingThree,
	ListLtem,
	NumberedList,
	Img,
	DefaultEl,
	DividerEl,
	CheckListItemElement,
	UploadImg,
	TableContainer,
	TableRow,
	TableCell,
	TableContent,
	FlexText
} from './el'


export const Element = props => {
	let { element } = props
	switch (element.type) {
		case 'flexText':
			return <FlexText {...props} />
		case 'divider':
			return <DividerEl {...props} />
		case 'block-quote':
			return <BlockQuote {...props} />
		case 'bulleted-list':
			return <BulletedList {...props} />
		case 'heading-one':
			return <HeadingOne {...props} />
		case 'heading-two':
			return <HeadingTwo {...props} />
		case 'heading-three':
			return <HeadingThree {...props} />
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
		case 'table':
			return <TableContainer {...props} />
		case 'table-row':
			return <TableRow {...props} />
		case 'table-cell':
			return <TableCell {...props} />
		case 'table-content':
			return <TableContent {...props} />
		default:
			return <DefaultEl {...props} />
	}
}