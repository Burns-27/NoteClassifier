import {
	type TFile,
	type FrontMatterCache,
} from 'obsidian';
import { settings } from '../settings/settings';
import type { ClsRes, flagsProp, midFile, NoteClsRes, TCls, TClsFile } from '../types';
import { ignore } from '../Ignore/ignoreUtil';
import { appUtils, flag, Logs } from '../tools';

export class ClsFile implements TClsFile {
	readonly TFile: TFile;
	public name: string;
	private frontmatter: FrontMatterCache;
	private newFM: Record<string, unknown> ={}
	private cls: TCls;
	readonly clsName: string
	readonly flags: flagsProp = {
			pathFallback: false,
			propsInvalid: false,
		  propsMissing: false,
	}
	constructor({ TFile, metadataCache, tags }: midFile, cls: TCls) {
		this.TFile = TFile;
		this.name = TFile.basename;
		this.cls = cls;
		this.clsName = cls.name
		this.frontmatter = metadataCache.frontmatter ?? {};
	}
	static create(file: TFile): NoteClsRes {
		let log = new Logs('Classify', 'ClsFile Create', true)
		//Check Ignored folder, prevent cache pull if not needed. 
		if (ignore.checkFolder(file, log)) {
			log.log(`${file.basename} In Ignored Folder`)
			return {
				success: false,
				message:'ignored'
			}
		}
		//get Cache if needed. 
		const cache = appUtils.getFileCache(file);
		//Errors if Invalid. 
		if (!cache) {
			log.log(`${file.basename} has no cache`)
			return { success: false, message: 'error' };
		}
		
		if (ignore.checkProperty(cache.frontmatter??{}, log)) {
			log.log(`${file.basename} has ignore property`)
			return {
				success: false,
				message:'ignored',
			};
		}
		//Creates Midfile. 
		const midFile: midFile = {
			TFile: file,
			metadataCache: cache,
			tags: appUtils.getAllTags(cache)
		};
		log.add('MidFile', midFile)

		let cls: TCls | false = false;
		let resArray: Array<ClsRes> =[]
		for (const node of settings.nodeTree) {
			const res = node.search(midFile, log);
			resArray.push(res)
			if (res.success) {
				cls = res.cls;
			}
		}
		if (!cls) {
			log.log(`Unable to match ${file.basename} to a classification`)
			flag.unclassified(file, log)
			return { success: false, message: 'unable' };
		}
		const note = new ClsFile(midFile, cls);
		flag.addClsProp(note, log)
		log.log(`${file.basename} Classified as ${cls.name}`)
		return {
			success: true,
			note: note,
		};
	}
	get destination(): string  {
		let log = new Logs('Move', 'File get destination', false)
		let destArray: string[] = [];
		const clsDest = this.cls.path;
	
		for (const section of clsDest) {
			const res = this.pathSection(section, log);
			destArray.push(res);
		}
		const destination = destArray.join('/')
		return destination;
		
	}
	public move(): boolean{
		let log = new Logs('Move', 'File Move', true)
		if (this.TFile.path !== `${this.destination}.${this.TFile.name}`) {
			void appUtils.moveFile(this, log)
			log.log(`Moved ${this.TFile.basename} to ${this.destination}`)
			return true
		}
		log.log(`No Move Needed for ${this.TFile.basename}`)
		return false
	}
	public checkProps(): boolean{
		const log = new Logs('Check', 'File checkProps', false)
		const props = this.cls.allReqProps;
		for (const [, prop] of props) {
			prop.check(this, log);
		}
		if (this.flags.propsInvalid || this.flags.propsMissing) {
			log.log(`Props Invalid or Missing for ${this.TFile.basename}`)
			return false
		} else {
			log.log(`Props Valid for ${this.TFile.basename}`)
			return true
		}
	}
	public updateFM() {
		
	}
	public addFM(property: string, value: unknown) {
		this.newFM[property] = value
	}
	private pathSection(section: string, log:Logs):string{
		// Check for Prop
		let end: string = '';
		//checks if it is a property
		if (!(section.startsWith('[') && section.endsWith(']'))) {
			return section;
		}
		// Since its a property, checks for fallback. 
		let prop = section.slice(1, -1);
		let hasfallback:boolean = false
		let fallback:string = (settings.base.pathFallbackDefault == 'Skip') ? "": prop
		if (prop.includes('|') && !prop.endsWith('|')) {
			const propSplit = prop.split('|');
			if (propSplit.length == 2 && propSplit[0] && propSplit[1]) {
				prop = propSplit[0];
				fallback = propSplit[1];
				hasfallback = true
			}
		}
		const value = this.getPropertyString(prop);
		if (value) {
			end = value;
		} else {
			end = fallback
			if (!hasfallback) {
				this.flags.pathFallback = true
			}
		}
		let sectionInfo = {
			prop, fallback, value, end
		}
		log.add(`path check:${section}`, sectionInfo)
		return end
	}
	getPropertyString(property: string): string | false {
		const value: unknown = this.frontmatter[property];
		if (typeof value === 'string') {
			return value;
		} else {
			return false;
		}
	}
	checkPropExists(property: string): boolean {
		const value: unknown = this.frontmatter[property];
		if(value !== undefined||value !== null) {
			return true;
		} else {
			return false;
		}
	}
}
