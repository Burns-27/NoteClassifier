import {
	getAllTags,
	normalizePath,
	type FrontMatterCache,
	type TFile,
} from 'obsidian';
import { midFile, ReportFlags, TClsFile } from '../types/files.types';
import { TCls } from '../types/classifications.types';
import { settingUtil } from '../settings/settingsUtil';
import { appUtils } from '../tools/AppUtils';
import { NoteClsRes, updateRes } from '../types/responses.types';
import {  devlog } from '../tools/logger';



export class ClsFile implements TClsFile {
	readonly TFile: TFile;
	public name: string;
	readonly startPath: string;
	readonly frontmatter?: FrontMatterCache;
	public tags?: Array<string>;
	private cls: TCls;
	private needsMoved: boolean;
	private newFrontmatter: Record<string, unknown>;
	destination: string;
	private folderArray: string[];
	public classification: string;
	reportFlags: ReportFlags[] = [];
	constructor({ TFile, metadataCache, tags }: midFile, classification: TCls) {
		this.TFile = TFile;
		this.name = TFile.basename;
		this.startPath = TFile.path;
		this.cls = classification;
		this.classification = classification.name;
		if (metadataCache.frontmatter) {
			this.frontmatter = metadataCache.frontmatter;
		}
		this.newFrontmatter = {};

		if (tags) {
			this.tags = tags;
		}
		const { destination, folderArray } = this.getDestination();
		this.destination = destination;
		this.folderArray = folderArray;
		if (this.startPath != this.destination) {
			this.needsMoved = true;
		} else {
			this.needsMoved = false;
		}
		this.validateProperties();
	}
	static create(file: TFile): NoteClsRes {
		let log = devlog.start('Main', 'Create ClsFile');
		log.info.file = file;
		const cache = appUtils.getFileCache(file);
		log.extra.cache = cache;
		if (!cache) {
			log.msg = 'No Cache on file';
			devlog.log(log);
			return { success: false, message: 'No Cache' };
		}
		const tags = getAllTags(cache);
		const matchRes = settingUtil.matchCls({
			TFile: file,
			metadataCache: cache,
			tags: tags,
		});
		log.info.matchRes = matchRes;
		if (!matchRes.success) {
			log.msg = 'No matching Cls';
			devlog.log(log);
			return matchRes;
		}
		const cls = new ClsFile(
			{ TFile: file, metadataCache: cache, tags: tags },
			matchRes.cls,
		);
		log.msg = 'Cls made';
		log.extra.classifiedFile = cls;
		devlog.log(log);
		return {
			success: true,
			note: cls,
		};
	}
	getDestination(): { destination: string; folderArray: string[] } {
		let log = devlog.start('Move', 'File Get Destination');
		const clsDest = this.cls.getPath();
		log.extra['Class Destination'] = clsDest;
		let destArray: string[] = [];
		let fallbackFlag:boolean = false
		if (!clsDest.success) {
			log.msg = 'Error Retrieving Class Destination';
			devlog.err(log, clsDest);
			return { destination: this.startPath, folderArray: [] };
		}
		log.extra.props = {}
		for (const section of  clsDest.path) {
			const res = this.pathSection(section)
			log.extra[section] = res
			if (res.fallbackFlag) {
				fallbackFlag = true
			}
			destArray.push(res.value)
		}
		if (fallbackFlag && settingUtil.base.flagFallbackDefault) {
			this.reportFlags.push('Missing Properties for path')
		}
		const folderArray = [...destArray];
		destArray.push(this.TFile.name);
		const destination = normalizePath(destArray.join('/'));
		log.info.destination = destination
		log.extra.destArray = destArray
		log.extra.folderArray = folderArray
		devlog.loc(log);
		return { destination, folderArray };
	}
	validateProperties() {
		let log = devlog.start('Props', 'Validate Props')
		const propsRes = this.cls.getProps();
		if (!propsRes.success) {
			log.msg = 'no Props from cls'
			log.info.propRes = propsRes
			devlog.log(log)
			return;
		}
		const props = propsRes.props;
		log.extra.props = props
		let missingflag: boolean = false;
		let missingProps:string[] = []
		let wrongflag:boolean = false
		if (this.frontmatter !== undefined) {
			for (const [key, prop] of props) {
				const res = prop.check(this)
				log.extra[key] = res
				if (!res.check) {
					switch (res.type) {
						case 'opt':
							wrongflag = true
							break
						case 'has':
							missingflag = true
							missingProps.push(res.prop)
							break
					}
				}
			}
		} 
		if (missingflag) {
			this.reportFlags.push('Missing Required Properties');
			if (settingUtil.base.addMissingProps) {
				for (const prop of missingProps) {
					this.newFrontmatter[prop] = ''
				}
			}
		}
		if (wrongflag) {
			this.reportFlags.push('One or More Properties has Incorrect Value')
		}
		log.info.missingflag = missingflag
		log.info.missingProps = missingProps
		log.info.wrongflag = wrongflag
		devlog.log(log)
	}

	async update(): Promise<updateRes> {
		let log = devlog.start('Main', 'Update')
		log.extra = {
			newFM: this.newFrontmatter, 
			ogFm: this.frontmatter,
			flags:this.reportFlags, 
		}
		let moved = false;
		let flagged = false;
		if (this.reportFlags && this.reportFlags.length !== 0) {
			flagged = true
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
		log.info.moved = moved
		log.info.flagged = flagged
		devlog.log(log);
		return { success: true, moved: moved, flagged: flagged };
	}
	getPropValue(prop: string): string | false {
		if (this.frontmatter && this.frontmatter[prop] && typeof this.frontmatter[prop] == 'string') {
				return this.frontmatter[prop]
			}
				else return false
	}
	private pathSection(section: string): {
		value: string;
		section: string;
		isProp: boolean;
		prop: string;
		hasfallback: boolean;
		fallback: string,
		fallbackFlag:boolean
	} {
		// Check for Prop
		let res = {
			section,
			value: section,
			isProp: false,
			prop: '',
			hasfallback: false,
			fallback: '',
			fallbackFlag:false
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
				res.hasfallback = false
				res.prop = propSplit[0]
			}
			if (propSplit.length == 2 && propSplit[0] && propSplit[1]) {
				res.hasfallback = true
				res.prop = propSplit[0]
				res.fallback = propSplit[1]
			}
		}
		const value = this.getPropValue(res.prop)
		if (value) {
			res.value = value
			return res
		}
		if (res.hasfallback) {
			res.value = res.fallback
			return res
		} else {
			res.fallbackFlag = true
			if (settingUtil.base.pathFallbackDefault == "Prop") {
				res.value = res.prop
			}
			if (settingUtil.base.pathFallbackDefault == "Skip") {
				res.value = ""
			}
			return res
		}
	}
}
