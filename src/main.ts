import {
	Plugin,
	TFile,
} from 'obsidian';
import {
	NoteClassifierSettingTab,
} from './settings/settingsTab';
import { NCPData } from './types/settings.types';
import { settingUtil } from './settings/settingsUtil';
import { appUtils } from './tools/AppUtils';
import { ClsFile } from './classification/ClassifiedFile';
import {  devlog, logger } from './tools/logger';
import { updateRes } from './types/responses.types';
import { setUtil } from './settings/settings';


export default class NoteClassifier extends Plugin {
	async onload() {
		await this.loadSettings();
		devlog.loc({path:'Main', loc:'onLoad', msg:"Plugin Loaded", info:{}, extra:{}})
		this.settings = settingUtil.get()
		appUtils.ini(this.app)
		this.addSettingTab(new NoteClassifierSettingTab(this.app, this));
		this.addCommand({
			id: `update-active-file`,
			name: 'Update active file',
			callback: async () => {
				console.debug("Update Active File Command Triggered")
				const file = this.app.workspace.getActiveFile()
				if (file) {
					console.debug(`Updating File: ${file.basename}`)
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
		this.addCommand({
			id: "dev-mode",
			name:'Turn on/off dev mode logs', 
			callback: () => {
				const currentDev = settingUtil.get().dev
				settingUtil.updateMain({dev:!currentDev})
			}
		})	
	}
	
	onunload() {}
	
	async updateFile(this: void, file: TFile,): Promise<updateRes> {
		let log = devlog.start('Main', 'updateFile')
		log.extra.file = file
		log.info.name = file.basename
		const clsFile = ClsFile.create(file)
		log.info.clsFile = clsFile
		if (clsFile.success) {
			const res = await clsFile.note.update()
			log.info.updateRes = res
			devlog.log(log)
			return res
		} else if(clsFile.message == "ignored file"){
			return { success: false}
		}else{
			log.msg = 'Unable to classifiy File'
			let fm: Record<string, unknown> = {}
			fm[settingUtil.get().NoticeProperty] = ['Unable to Classify']
			await appUtils.processFrontmater(file, fm)
			devlog.log(log)
			return {success:false}
		}
	}

	async saveSettings() {
		await this.saveData(setUtil.data);
	}
	async loadSettings() {
		const data = await this.loadData() as Partial<NCPData>;
		setUtil.load(data)
	}
}
