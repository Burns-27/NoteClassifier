import {
	getAllTags,
	normalizePath,
	type TFile,
	type FrontMatterCache,
} from 'obsidian';
import { settingUtil } from '../settings/settingsUtil';
import { appUtils } from '../tools/AppUtils';
import { getPropertyStringValue } from '../tools/propertyUtils';
import { setUtil } from '../settings/settings';
import { checkIgnoredFolder } from '../tools/PathUtils';
import type { midFile, NoteClsRes, ReportFlags, TCls, TClsFile, updateRes } from '../types';

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
		if (settingUtil.get().addClassificationProp) {
			this.newFrontmatter[settingUtil.get().classificationProp] =
				cls.name;
		}
		this.validateProperties();
	}
	static create(file: TFile): NoteClsRes {
		if (checkIgnoredFolder(file.path)) {
			return {
				success: false,
				message:'ignored file'
			}
		}
		const cache = appUtils.getFileCache(file);
		if (!cache) {
			return { success: false, message: 'No Cache' };
		}
		const tags = getAllTags(cache);
		const checkIgnoredProperty = getPropertyStringValue(
			settingUtil.get().ignoreFilesProperty,
			cache.frontmatter,
		);
		if (checkIgnoredProperty) {
			return {
				success: false,
				message: 'ignored file',
			};
		}
		const midFile: midFile = {
			TFile: file,
			metadataCache: cache,
			tags: tags,
		};
		let cls: TCls | undefined;
		for (const node of setUtil.nodeTree) {
			const res = node.search(midFile);
			if (res.success) {
				cls = res.cls;
			}
		}
		if (!cls) {
			return { success: false, message: 'No matching Cls' };
		}
		const note = new ClsFile(midFile, cls);
		return {
			success: true,
			note: note,
		};
	}
	getDestination(): { destination: string; folderArray: string[] } {
		let destArray: string[] = [];
		let fallbackFlag: boolean = false;
		const clsDest = this.cls.getPath();
		if (!clsDest.success) {
			return { destination: this.TFile.path, folderArray: [] };
		}
		for (const section of clsDest.path) {
			const res = this.pathSection(section);
			if (res.fallbackFlag) {
				fallbackFlag = true;
			}
			destArray.push(res.value);
		}
		if (fallbackFlag && settingUtil.base.flagFallbackDefault) {
			this.reportFlags.push('Missing Properties for path');
		}
		const folderArray = [...destArray];
		destArray.push(this.TFile.name);
		const destination = normalizePath(destArray.join('/'));
		return { destination, folderArray };
	}

	validateProperties() {
		const propsRes = this.cls.getProps();
		if (!propsRes.success) {
			return;
		}
		const props = propsRes.props;
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
			if (settingUtil.base.addMissingProps) {
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
		return { success: true, moved: moved, flagged: flagged };
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
			if (settingUtil.base.pathFallbackDefault == 'Prop') {
				res.value = res.prop;
			}
			if (settingUtil.base.pathFallbackDefault == 'Skip') {
				res.value = '';
			}
			return res;
		}
	}
}
