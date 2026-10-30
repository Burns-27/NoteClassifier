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
import {  devlog, logger } from './logger';
import { updateRes } from './types/responses.types';


export default class NoteClassifier extends Plugin {
	settings!: NoteClassifierSettings;
	async onload() {
		await this.loadSettings();
		devlog.loc('Plugin Load')
		this.settings = settingUtil.get()
		appUtils.ini(this.app)
		this.addSettingTab(new NoteClassifierSettingTab(this.app, this));
		
		this.addCommand({
			id: `update-active-file`,
			name: 'Update active file',
			callback: async () => {
				const file = this.app.workspace.getActiveFile()
				if (file) {
				  await this.updateFile(file)
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
				for (const file of allFilesArray) {
					const res =await  this.updateFile(file)
					
				
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
				}
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
	
	async updateFile(this:void,file:TFile, ):Promise<updateRes> {
		const clsFile = ClsFile.create(file)
		devlog.loc('updateFile','post cls file create',{clsFile})
		if (clsFile.success) {
			const res =  await clsFile.note.update()
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
		const settings = settingUtil.get()
		const rules = Object.fromEntries(settings.rules)
		const classes = Object.fromEntries(settings.classes)
		devlog.loc('Save Settings', 'called', { settings })
		console.debug("Save settings called")
		await this.saveData({...settings,rules, classes});
	}
	async loadSettings() {
		const data = await this.loadData() as Partial<NoteClassifierSettings>;
		console.debug("Load settings Called")
		
		settingUtil.updateAll(data)
		devlog.loc('loadSettings','Called',{data})
	}
}
