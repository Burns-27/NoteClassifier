import { Logs } from '../tools';
import { midFile } from '../types/files.types';
import { FlatExactPropertyRule } from '../types/rules.types';

import { Rule } from './Rules';

export class ExactPropertyRule extends Rule {
	readonly propertyName: string;
	readonly propertyValue: string;
	flat: FlatExactPropertyRule;
	constructor(data: FlatExactPropertyRule, clsName: string) {
		super(data, clsName);
		this.flat = data;
		this.propertyName = data.propertyName;
		this.propertyValue = data.propertyValue;
		}
	match(file: midFile, log:Logs):boolean {
		const fm = file.metadataCache.frontmatter??{};
		const prop:unknown = fm[this.propertyName] 
		log.add(`${this.desc}`, prop)
		if (prop == undefined||prop==null) {
			return false
		}
		if (prop !== this.propertyValue) {
			return false
		}
		return true
	}
	get desc():string {
		return `File ${this.propertyName} has value ${this.propertyValue}`;
	}
}
