import path from 'node:path'
import {fileURLToPath} from 'node:url'
import packageJson from '../package.json' with {type: 'json'}

const {homepage, version} = packageJson

const getRuleDocsUrl = sourceUrl => {
  const url = new URL(homepage)
  const rule = path.basename(fileURLToPath(sourceUrl), '.js')
  url.hash = ''
  url.pathname += `/blob/v${version}/docs/rules/${rule}.md`
  return url.toString()
}

export default getRuleDocsUrl
