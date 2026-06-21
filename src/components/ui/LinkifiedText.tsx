import { Text, Anchor, TextProps } from '@mantine/core'
import React from 'react'

interface LinkifiedTextProps extends TextProps {
  text?: string
}

export function LinkifiedText({ text, style, ...textProps }: LinkifiedTextProps) {
  if (!text) return null

  // Expresión regular para detectar enlaces HTTP y HTTPS
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return (
    <Text style={{ whiteSpace: 'pre-line', ...style }} {...textProps}>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <Anchor
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </Anchor>
          )
        }
        return part
      })}
    </Text>
  )
}
