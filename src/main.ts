import {
	Plugin,
	TFile,
} from 'obsidian';
import {
	NoteClassifierSettingTab,
} from './settings/settingsTab';
import { NoteClassifierSettings } from './types/settings.types';
import { settingUtil } from './settings/settingsUtil';
import { appUtils } from './tools/AppUtils';
import { ClsFile } from './classification/ClassifiedFile';
import {  logger } from './logger';
import { updateRes } from './types/responses.types';


export default class NoteClassifier extends Plugin {
	settings!: NoteClassifierSettings;
	async onload() {
		await this.loadSettings();
		this.settings = settingUtil.get()
		appUtils.ini(this.app)
		this.addSettingTab(new NoteClassifierSettingTab(this.app, this));
		
		this.addCommand({
			id: `update-active-file`,
			name: 'Update active file',
			callback: async () => {
				const file = this.app.workspace.getActiveFile()
				if (file) {
				  this.updateFile(file)
				}
			}
		})
		this.addCommand({
			id: 'update-all-files',
			name: 'Update all files',
			callback: async () => {
				const allFilesArray = this.app.vault.getMarkdownFiles()
				let movedTotal = 0
				let flaggedTotal = 0 
				const resArray = allFilesArray.map(this.updateFile)
				resArray.forEach((res) => {
					if (res.success) {
						if (res.moved) {
							movedTotal++
						}
						if (res.flagged) {
							flaggedTotal++
						}
					} else {
						flaggedTotal++
					}
				})
				logger.sum(movedTotal, flaggedTotal)
			}
		})
		
	}
	
	onunload() {}
	nextID(): number{
		const nextID = this.settings.nextID
		this.settings.nextID++
		return nextID
	}
	
	updateFile(this:void,file:TFile, ):updateRes {
		const clsFile = ClsFile.create(file)
		if (clsFile.success) {
			const res =  clsFile.note.update()
			return res
		} else {
			logger.err("Unable to classifiy file.", clsFile)
			let fm: Record<string, unknown> = {}
			fm[settingUtil.get().NoticeProperty] = ['Unable to Classify']
			appUtils.processFrontmater(file, fm)
			return{success:false}
		}
	}

	async saveSettings() {
		await this.saveData(settingUtil.get());
	}
	async loadSettings() {
		const data = await this.loadData() as Partial<NoteClassifierSettings>;
		settingUtil.updateAll(data)
	}
}
