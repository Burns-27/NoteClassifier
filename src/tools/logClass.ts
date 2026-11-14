import { setUtil } from '../settings/settings';

type pathStrings = 'Classify' | 'Move' | 'Settings' | 'Props' | 'Main'|'Update';

export class logs {
	private path: pathStrings;
	private loc: string;
	public msg: string = '';
	private dev: Record<string, unknown> = {};
	private current:boolean
	constructor(path: pathStrings, loc: string, current:boolean) {
		this.path = path;
		this.loc = loc;
		this.current = current
	}
	private get msgString(): string {
		return `*NCP* [${this.path}](${this.loc}) ${this.msg}`;
	}

	public add(name: string, thing: unknown) {
		this.dev[name] = thing;
	}

	public devRecord(record: Record<string, unknown>) {
		this.dev = { ...this.dev, ...record };
	}
	public log(msg?: string) {
		if (msg) {
			this.msg = msg;
		}
		switch (setUtil.logLevel) {
			case 'dev':
				if(this.current){
					console.debug(this.msgString,this.dev);
				}
				return;
			case 'debug':
				console.debug(this.msgString);
				return;
			case 'none':
				if (this.path == 'Main') {
					console.debug(this.msgString);
				}
				return;
		}
	}
}
