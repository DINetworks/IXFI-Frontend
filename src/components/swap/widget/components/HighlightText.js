import { BodyText } from '@0xsquid/ui'
import React from 'react'

/**
 * Highlights a specific text within a larger text.
 * @param {string} text - The text to highlight.
 * @param {string} textToHighlight - The text to highlight within the larger text.
 * @returns {React.ReactNode} - The highlighted text.
 */
export function HighlightTextComponent({ text = '', textToHighlight = '' }) {
  const parts = getTextParts(text, textToHighlight)
  return (
    <BodyText
      size='small'
      className='tw-max-w-full tw-truncate tw-h-[17px] !tw-leading-[17px] tw-block'
    >
      {parts?.map((part, index) =>
        part.toLowerCase() === textToHighlight?.toLowerCase() ? (
          <span
            className='tw-text-royal-500'
            key={index}
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </BodyText>
  )
}

/**
 * Splits a string into an array of substrings based on a given text to highlight.
 * @param text
 * @param textToHighlight
 * @returns
 */
const getTextParts = (text, textToHighlight) => {
  // catch errors in case that textToHighlight contains invalid characters like open parenthesis ")", etc...
  try {
    return text.split(new RegExp(`(${textToHighlight})`, 'gi'))
  } catch (error) {
    return [text]
  }
}
