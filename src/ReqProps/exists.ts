
import { FrontMatterCache } from "obsidian"
import { getPropertyStringValue } from "../tools/propertyUtils"
import type { FlatReqPropHas, PropCheckRes } from "../types"
import { ReqProp } from "./ReqProp"



export class ReqPropHas extends ReqProp {
    public flat: FlatReqPropHas
    constructor(data: FlatReqPropHas, clsName: string) {
        super(data, clsName)
        this.flat = data
    }
    getDesc(): string {
        return `File has ${this.propName} property, and it is not empty`
    }
    check(fm:FrontMatterCache): PropCheckRes {
        const check = getPropertyStringValue(this.propName, fm)
        if (!check) {
            return {
                check: false,
                type: 'has',
                prop: this.propName
            }
        }
        return { check: true }
    }
}