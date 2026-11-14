import { FrontMatterCache } from 'obsidian';
import { FlatReqProp, PropCheckRes, TReqProp } from '../types';

export abstract class ReqProp implements TReqProp {
	public id: string;
	abstract flat: FlatReqProp;
	public propName: string;
	public clsName: string;
	abstract get desc(): string;
	constructor(data: FlatReqProp, clsName: string) {
		this.clsName = clsName;
		this.id = data.id;
		this.propName = data.propertyName;
	}
	abstract check(fm:FrontMatterCache): PropCheckRes;
}
