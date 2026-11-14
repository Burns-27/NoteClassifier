
import { setUtil } from "../settings/settings";
import { logs } from "./logClass";


export function checkIgnoredFolder(path: string):boolean {
  let log = new logs('Classify', 'Check Ignored',false)
  log.add('file path', path)
  let folderPaths = []
  let slashIndex = path.indexOf('/')
  while (slashIndex !== -1) {
    const folderPath = path.slice(0, slashIndex);
    folderPaths.push(folderPath)
    if (setUtil.ignoredFoldersSet.has(folderPath)) {
      log.add('Ignored folder', folderPath)
      log.log('Ignored ')
      return true
    }
    slashIndex = path.indexOf('/', slashIndex + 1)
  }
  log.add('FolderPaths', folderPaths)
  log.log('Not Ignored')
  return false
}