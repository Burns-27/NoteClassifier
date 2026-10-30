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
import { devlog, } from '../logger';

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
    const {destination, folderArray} = this.getDestination()
    this.destination = destination
    this.folderArray = folderArray
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
	getDestination(): { destination: string, folderArray: string[] }{
		let Record: Record<string, unknown> = {}
		let props:string[] = []
		const clsDest = this.cls.getPath();
		Record.clsDest = clsDest
		let destArray: string[] = [];
		if (!clsDest.success) {
			devlog.err('Path - Note getDest','Getting Cls Destination Array', Record);
			return {destination:this.startPath, folderArray:[]};
		}
		clsDest.path.forEach((section) => {
			if (section.startsWith('[') && section.endsWith(']')) {
				const prop = section.slice(1, -1);
				props.push(prop)
				if (!this.frontmatter) {
					destArray.push(prop);
					this.reportFlags.push('Missing Properties for path');
					devlog.fallback(
						'File has no frontmatter for property replacement',
						{ prop: prop, file: this.name },
					);
					return;
				}
				if (
					!this.frontmatter[prop] &&
					typeof this.frontmatter[prop] != 'string'
				) {
					destArray.push(prop);
					this.reportFlags.push('Missing Properties for path');
					devlog.fallback(
						'File does not have required prop for property replacement',
						{ file: this.name, frontmatter: this.frontmatter },
					);
					return;
				} else {
					destArray.push(this.frontmatter[prop] as string);
					return;
				}
			} else {
				destArray.push(section);
				return;
			}
    });
		const folderArray = [...destArray]
		Record.folderArray = folderArray
		destArray.push(this.TFile.name);
		Record.destArray = destArray
		const destination = normalizePath(destArray.join('/'));
		Record.destination = destination
		devlog.loc('Path - Note Get Dest', 'Before Return', Record);
		return {destination, folderArray};
	}
	validateProperties() {
		const propsRes = this.cls.getProps();
		if (!propsRes.success) {
			devlog.test('No required props');
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

  async update(): Promise<updateRes>{
    let moved = false
    let flagged = false
    if (this.needsMoved) {
       await appUtils.moveFile(this.TFile, this.destination, this.folderArray)
      moved = true
    }
    if (this.reportFlags.length !== 0) {
      flagged = true
      this.newFrontmatter[settingUtil.get().NoticeProperty] = this.reportFlags
    }
     appUtils.processFrontmater(this.TFile, this.newFrontmatter);
    return {success:true, moved:moved, flagged: flagged}
	}
}
