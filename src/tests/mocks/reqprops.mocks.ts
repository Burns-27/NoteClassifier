import { FlatReqProp } from "../../types/rules.types";

export const reqPropData: Record<string, FlatReqProp> = {
  "20": { type: 'exists', propertyName: 'project', id: '20' },
  '21': { id: '20', type: 'exists', propertyName: 'subject' },
  '22':{id:'22', type:'opt', propertyName:'status', propVauleOptions:['new', 'current','done']}
}
export const reqPropMap: Map<string,FlatReqProp> = new Map<string,FlatReqProp>(Object.entries(reqPropData))