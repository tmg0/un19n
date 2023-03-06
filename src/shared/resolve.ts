import { join, resolve } from 'pathe'
import { parseTag } from './common'

export const resolveUn19nOutputPath = (conf: Un19nConfig) => {
  const path = join(conf.root, conf.output, conf.filename)
  return resolve(path)
}

export const resolveUn19nMatch = (conf: Un19nConfig, match: RegExpMatchArray) => {
  const [_, tag] = match
  const { start, end, length } = resolveMatchPosition(match)

  const { language, message } = parseTag(conf, tag)

  return { language, message, tag, start, end, length }
}

export const resolveMatchPosition = (match: RegExpMatchArray) => {
  const length = match[1].length
  const start = (match.index || 0) + match[0].indexOf(match[1])
  const end = start + length
  return { start, end, length }
}
