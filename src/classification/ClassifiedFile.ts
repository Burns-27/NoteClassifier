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
import { FailRes, NoteClsRes, updateRes } from '../types/responses.types';
import { devlog } from '../logger';

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
		const cache = appUtils.getFileCache(file);
		if (!cache) {
			const res: FailRes = {
				success: false,
				message: 'No Metadata found',
			};
			devlog.test('Create Cls File fail', res);
			return res;
		}
		const tags = getAllTags(cache);
		const matchRes = settingUtil.matchCls({
			TFile: file,
			metadataCache: cache,
			tags: tags,
		});
		devlog.loc('*Create File', 'post match res', { matchRes, tags, cache });
		if (!matchRes.success) return matchRes;
		const cls = new ClsFile(
			{ TFile: file, metadataCache: cache, tags: tags },
			matchRes.cls,
		);
		return {
			success: true,
			note: cls,
		};
	}
	getDestination(): { destination: string; folderArray: string[] } {
		let Record: Record<string, unknown> = {};
		let props: string[] = [];
		const clsDest = this.cls.getPath();
		Record.clsDest = clsDest;
		let destArray: string[] = [];
		if (!clsDest.success) {
			devlog.err(
				'Path - Note getDest',
				'Getting Cls Destination Array',
				Record,
			);
			return { destination: this.startPath, folderArray: [] };
		}
		clsDest.path.forEach((section) => {
			if (!(section.startsWith('[') && section.endsWith(']'))) {
				destArray.push(section);
				return;
			}
			let value: string = '';
			const fallback = '|';
			const prop = section.slice(1, -1);
			let fallbackflag = false;
			props.push(prop);
			// Checks for Fm, that it has the prop, and that the props value is a string
			// if not, triggers the flag for fall back
			if (
				!this.frontmatter ||
				!this.frontmatter[prop] ||
				typeof this.frontmatter[prop] != 'string'
			) {
				fallbackflag = true;
			} else {
				value = this.frontmatter[prop];
			}
			//checks if it needs the fallback value
			if (fallbackflag) {
				//checks if there is a fall back value
				if (prop.includes(fallback) && !prop.endsWith(fallback)) {
					//Retrieves the fall back value and pushes that.
					const splitProp = prop.slice(
						prop.indexOf(fallback) + fallback.length,
					);
					value = splitProp;
				} else {
					//if there isnt a fall back, checks the settings for what to default to
					if (settingUtil.get().pathFallbackDefault == 'Prop') {
						value = prop;
					}
					//dont need to check for skip. value is default '', which after normalizePath resolves the same.
					if (settingUtil.get().flagFallbackDefault) {
						this.reportFlags.push('Missing Properties for path');
					}
				}
			}
			destArray.push(value)
			return;
		});
		const folderArray = [...destArray];
		Record.folderArray = folderArray;
		destArray.push(this.TFile.name);
		Record.destArray = destArray;
		const destination = normalizePath(destArray.join('/'));
		Record.destination = destination;
		devlog.loc('Path - Note Get Dest', 'Before Return', Record);
		return { destination, folderArray };
	}
	validateProperties() {
		const propsRes = this.cls.getProps();
		if (!propsRes.success || propsRes.props.length == 0) {
			devlog.loc('Properties - validate','No required props');
			return;
		}
		const props = propsRes.props;
		let flag: boolean = false;
		if (this.frontmatter !== undefined) {
			props.forEach((p) => {
				if (
					this.frontmatter &&
					(!this.frontmatter[p] || this.frontmatter[p] == undefined)
				) {
					this.newFrontmatter[p] = '';
					flag = true;
				}
			});
		} else {
			props.forEach((p) => {
				this.newFrontmatter[p] = '0';
			});
			flag = true;
		}
		if (flag) {
			this.reportFlags.push('Missing Required Properties');
		}
	}

	async update(): Promise<updateRes> {
		let moved = false;
		let flagged = false;
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

		devlog.loc('Update', 'After Process', {
			moved,
			flagged,
			oldFrontmatter: this.frontmatter,
			newFM: this.newFrontmatter,
			ReportFlags: this.reportFlags,
		});
		return { success: true, moved: moved, flagged: flagged };
	}
}
