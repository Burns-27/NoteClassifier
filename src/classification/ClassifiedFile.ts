import {
	getAllTags,
	normalizePath,
	type TFile,
	type FrontMatterCache,
} from 'obsidian';
import { appUtils } from '../tools/AppUtils';
import { getPropertyStringValue } from '../tools/propertyUtils';
import { setUtil } from '../settings/settings';
import type { ClsRes, flagsProp, midFile, NoteClsRes, TCls, TClsFile, updateRes } from '../types';
import { logs } from '../tools/logClass';
import { ignoreUtil } from '../Ignore/ignoreUtil';

export class ClsFile implements TClsFile {
	readonly TFile: TFile;
	public name: string;
	private frontmatter: FrontMatterCache;
	private cls: TCls;
	readonly flags: flagsProp = {
			pathFallback: false,
			propsInvalid: false,
		  propsMissing: false,
	}
	constructor({ TFile, metadataCache, tags }: midFile, cls: TCls) {
		this.TFile = TFile;
		this.name = TFile.basename;
		this.cls = cls;
		this.frontmatter = metadataCache.frontmatter ?? {};
		this.validateProperties();
	}
	static create(file: TFile): NoteClsRes {
		let log = new logs('Classify', 'ClsFile Create', true)
		//Check Ignored folder, prevent cache pull if not needed. 
		if (ignoreUtil.checkIgnoredFolder(file, log)) {
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
		
		if (ignoreUtil.checkIgnoredProperty(cache.frontmatter??{}, log)) {
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
			tags: getAllTags(cache)
		};
		log.add('MidFile', midFile)

		let cls: TCls | false = false;
		let resArray: Array<ClsRes> =[]
		for (const node of setUtil.nodeTree) {
			const res = node.search(midFile);
			resArray.push(res)
			if (res.success) {
				cls = res.cls;
			}
		}
		if (!cls) {
			log.log(`Unable to match ${file.basename} to a classification`)
			return { success: false, message: 'unable' };
		}
		log.log(`${file.basename} Classified as ${cls.name}`)
		const note = new ClsFile(midFile, cls);
		return {
			success: true,
			note: note,
		};
	}
	get destination(): string  {
		let log = new logs('Move', 'File get destination', false)
		let destArray: string[] = [];
		const clsDest = this.cls.path;
	
		for (const section of clsDest) {
			const res = this.pathSection(section, log);
			destArray.push(res);
		}
		
		const folderArray = [...destArray];
		destArray.push(this.TFile.name);
		const destination = normalizePath(destArray.join('/'));
		return  destination;
	}

	validateProperties() {
		const props = this.cls.allReqProps;
		let missingProps: string[] = [];
		for (const [, prop] of props) {
			const res = prop.check(this.frontmatter);
			if (!res.check) {
				switch (res.type) {
					case 'opt':
						this.flags.propsInvalid = true;
						break;
					case 'has':
						this.flags.propsInvalid = true;
						missingProps.push(res.prop);
						break;
				}
			}
		}
	}

	async update(): Promise<updateRes> {
		let moved = false;
		let flagged = false;
		if (this.reportFlags && this.reportFlags.length !== 0) {
			flagged = true;
		}
		await appUtils.processFrontmater(
			this.TFile,
			this.newFrontmatter,
			this.reportFlags,
		);
		if (this.needsMoved) {
			await appUtils.moveFile(
				this.TFile,
				this.destination,
				this.folderArray,
			);
			moved = true;
		}
		return { success: true, moved: moved, flagged: flagged, ignored:false };
	}

	private pathSection(section: string, log:logs):string{
		// Check for Prop
		let end: string = '';
		//checks if it is a property
		if (!(section.startsWith('[') && section.endsWith(']'))) {
			return section;
		}
		// Since its a property, checks for fallback. 
		let prop = section.slice(1, -1);
		let hasfallback:boolean = false
		let fallback:string = (setUtil.base.pathFallbackDefault == 'Skip') ? "": prop
		if (prop.includes('|') && !prop.endsWith('|')) {
			const propSplit = prop.split('|');
			if (propSplit.length == 2 && propSplit[0] && propSplit[1]) {
				prop = propSplit[0];
				fallback = propSplit[1];
				hasfallback = true
			}
		}
		const value = getPropertyStringValue(prop, this.frontmatter);
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
}
