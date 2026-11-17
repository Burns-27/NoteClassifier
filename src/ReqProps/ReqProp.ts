
import { Logs } from '../tools';
import { FlatReqProp, TClsFile, TReqProp } from '../types';

export abstract class ReqProp implements TReqProp {
	public id: string;
	abstract flat: FlatReqProp;
	public propName: string;
	public clsName: string;

	constructor(data: FlatReqProp, clsName: string) {
		this.clsName = clsName;
		this.id = data.id;
		this.propName = data.propertyName;
	}
	abstract get desc(): string;
	abstract check(file: TClsFile, log:Logs):void; 

}
