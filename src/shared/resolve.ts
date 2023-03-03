import { join } from 'pathe'

export const resolveUn19nOutputPath = (conf: Un19nConfig) => '/' + join(conf.root, conf.output, conf.filename)

export const resolveUn19nMatch = (match: RegExpMatchArray) => {
  const [_, tag] = match
  const { start, end, length } = resolveMatchPosition(match)

  const [language, message] = tag.split(':') as [Language, string]

  return { language, message, tag, start, end, length }
}

export const resolveMatchPosition = (match: RegExpMatchArray) => {
  const length = match[1].length
  const start = (match.index || 0) + match[0].indexOf(match[1])
  const end = start + length
  return { start, end, length }
}
