
import { setUtil } from "../settings/settings";


export function checkIgnoredFolder(path: string):boolean {
  let slashIndex = path.indexOf('/')
  while (slashIndex !== -1) {
    const folderPath = path.slice(0, slashIndex);
    if (setUtil.ignoredFoldersSet.has(folderPath)) {
      return true
    }
    slashIndex = path.indexOf('/', slashIndex + 1)
  }
  return false
}