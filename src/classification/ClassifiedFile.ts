import {
	getAllTags,
	normalizePath,
	type TFile,
	type FrontMatterCache,
} from 'obsidian';
import { appUtils } from '../tools/AppUtils';
import { getPropertyBooleanValue, getPropertyStringValue } from '../tools/propertyUtils';
import { setUtil } from '../settings/settings';
import { checkIgnoredFolder } from '../tools/PathUtils';
import type { ClsRes, midFile, NoteClsRes, ReportFlags, TCls, TClsFile, updateRes } from '../types';
import { logs } from '../tools/logClass';

export class ClsFile implements TClsFile {
	readonly TFile: TFile;
	public name: string;
	private frontmatter: FrontMatterCache;
	private tags: Array<string>;
	private cls: TCls;
	private needsMoved: boolean;
	private newFrontmatter: Record<string, unknown>;
	destination: string;
	private folderArray: string[];
	reportFlags: ReportFlags[] = [];
	constructor({ TFile, metadataCache, tags }: midFile, cls: TCls) {
		this.TFile = TFile;
		this.name = TFile.basename;
		this.cls = cls;
		this.frontmatter = metadataCache.frontmatter ?? {};
		this.newFrontmatter = {};
		this.tags = tags ?? [];
		const { destination, folderArray } = this.getDestination();
		this.destination = destination;
		this.folderArray = folderArray;
		this.needsMoved = TFile.path != this.destination;
		if (setUtil.base.addClassificationProp) {
			this.newFrontmatter[setUtil.base.classificationProp] =
				cls.name;
		}
		this.validateProperties();
	}
	static create(file: TFile): NoteClsRes {
		let log = new logs('Classify', 'ClsFile Create', true)
		const checkFolder = checkIgnoredFolder(file.path)
		log.add('Check Folder Res', checkFolder)
		if (checkFolder) {
			log.log(`${file.basename} In Ignored Folder`)
			return {
				success: false,
				message:'ignored'
			}
		}
		const cache = appUtils.getFileCache(file);
		if (!cache) {
			log.log(`${file.basename} has no cache`)
			return { success: false, message: 'error' };
		}
		const tags = getAllTags(cache);
		const checkIgnoredProperty = getPropertyBooleanValue(
			setUtil.base.ignoreFilesProperty,
			cache.frontmatter,
		);
		if (checkIgnoredProperty) {
			log.log(`${file.basename} has ignore property`)
			return {
				success: false,
				message:'ignored',
			};
		}
		const midFile: midFile = {
			TFile: file,
			metadataCache: cache,
			tags: tags,
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
		const note = new ClsFile(midFile, cls);
		 log.log(`${file.basename} Classified as ${cls.name}`)
		return {
			success: true,
			note: note,
		};
	}
	getDestination(): { destination: string; folderArray: string[] } {
		let destArray: string[] = [];
		let fallbackFlag: boolean = false;
		const clsDest = this.cls.path;
	
		for (const section of clsDest) {
			const res = this.pathSection(section);
			if (res.fallbackFlag) {
				fallbackFlag = true;
			}
			destArray.push(res.value);
		}
		if (fallbackFlag && setUtil.base.flagFallbackDefault) {
			this.reportFlags.push('Missing Properties for path');
		}
		const folderArray = [...destArray];
		destArray.push(this.TFile.name);
		const destination = normalizePath(destArray.join('/'));
		return { destination, folderArray };
	}

	validateProperties() {
		const props = this.cls.allReqProps;
		
		let missingflag: boolean = false;
		let missingProps: string[] = [];
		let wrongflag: boolean = false;
		for (const [, prop] of props) {
			const res = prop.check(this.frontmatter);
			if (!res.check) {
				switch (res.type) {
					case 'opt':
						wrongflag = true;
						break;
					case 'has':
						missingflag = true;
						missingProps.push(res.prop);
						break;
				}
			}
		}
		if (missingflag) {
			this.reportFlags.push('Missing Required Properties');
			if (setUtil.base.addMissingProps) {
				for (const prop of missingProps) {
					this.newFrontmatter[prop] = '';
				}
			}
		}
		if (wrongflag) {
			this.reportFlags.push('One or More Properties has Incorrect Value');
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

	private pathSection(section: string): {
		value: string;
		section: string;
		isProp: boolean;
		prop: string;
		hasfallback: boolean;
		fallback: string;
		fallbackFlag: boolean;
	} {
		// Check for Prop
		let res = {
			section,
			value: section,
			isProp: false,
			prop: '',
			hasfallback: false,
			fallback: '',
			fallbackFlag: false,
		};
		if (!(section.startsWith('[') && section.endsWith(']'))) {
			return res;
		}
		// Check For Fall back
		res.isProp = true;
		const prop = section.slice(1, -1);
		res.prop = prop;
		if (prop.includes('|') && !prop.endsWith('|')) {
			const propSplit = prop.split('|');
			if (propSplit.length == 1 && propSplit[0]) {
				res.hasfallback = false;
				res.prop = propSplit[0];
			}
			if (propSplit.length == 2 && propSplit[0] && propSplit[1]) {
				res.hasfallback = true;
				res.prop = propSplit[0];
				res.fallback = propSplit[1];
			}
		}
		const value = getPropertyStringValue(prop, this.frontmatter);
		if (value) {
			res.value = value;
			return res;
		} else if (res.hasfallback) {
			res.value = res.fallback;
			return res;
		} else {
			res.fallbackFlag = true;
			if (setUtil.base.pathFallbackDefault == 'Prop') {
				res.value = res.prop;
			}
			if (setUtil.base.pathFallbackDefault == 'Skip') {
				res.value = '';
			}
			return res;
		}
	}
}
