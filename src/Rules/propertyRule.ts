import { midFile } from '../types/files.types';
import { RuleMatchRes } from '../types/responses.types';
import { FlatExactPropertyRule } from '../types/rules.types';

import { Rule } from './Rules';

export class ExactPropertyRule extends Rule {
	readonly propertyName: string;
	readonly propertyValue: string;
	flat: FlatExactPropertyRule;
	readonly desc: string;
	constructor(data: FlatExactPropertyRule, clsName: string) {
		super(data, clsName);
		this.flat = data;
		this.propertyName = data.propertyName;
		this.propertyValue = data.propertyValue;
		this.desc = `File Has '${this.propertyName}' Property with '${this.propertyValue}' as its value`;
	}
	match(file: midFile): RuleMatchRes {
		const frontmatter = file.metadataCache.frontmatter;
		if (!frontmatter) {
			return {
				success: false,
				message: 'No Frontmatter on file',
			};
		}
		if (!frontmatter[this.propertyName]) {
			return {
				success: false,
				message: 'Property doesnt Exist on file',
			};
		}
		if (frontmatter[this.propertyName] !== this.propertyValue) {
			return {
				success: false,
				message: 'Property Value doesnt Match',
			};
		}
		return {
			success: true,
		};
	}
	getDesc() {
		return `File ${this.propertyName} has value ${this.propertyValue}`;
	}
}
