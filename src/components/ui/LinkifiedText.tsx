/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
