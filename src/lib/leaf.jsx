import React from 'react'
import { css } from 'emotion'
export const renderLeaf = ({ attributes, children, leaf }) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>
	}

	if (leaf.italic) {
		children = <em>{children}</em>
	}

	if (leaf.underline) {
		children = <u>{children}</u>
	}

	if (leaf.strikethrough) {
		children = <del>{children}</del>
	}

	if (leaf.color) {
		children = <span className={css`
					color: ${leaf.color}
				`}>{children}</span>
	}
	if (leaf.background) {
		children = <span className={css`
					background-color: ${leaf.background}
				`}>{children}</span>
	}

	return <span {...attributes}>{children}</span>
}