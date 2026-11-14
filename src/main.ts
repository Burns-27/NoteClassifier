import {
	Plugin,
	TFile,
} from 'obsidian';
import {
	NoteClassifierSettingTab,
} from './settings/settingsTab';
import { NCPData } from './types/settings.types';
import { appUtils } from './tools/AppUtils';
import { ClsFile } from './classification/ClassifiedFile';
import { logger } from './tools/logger';
import { updateRes } from './types/responses.types';
import { setUtil } from './settings/settings';
import { logs } from './tools/logClass';


export default class NoteClassifier extends Plugin {
	async onload() {
		await this.loadSettings();
		this.settings = setUtil.data
		logger.debug('Plugin Loaded', setUtil.base)
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
				let ignored = 0
				let failed = 0
				for (const file of allFilesArray) {
					const res =await  this.updateFile(file)
							
					if (res.success) {
						if (res.moved) {
							movedTotal++
						}
						if (res.flagged) {
							flaggedTotal++
						}
						if(res.ignored){
							ignored++
						}
					} else {
						failed++
					}
				}
				logger.sum(movedTotal, flaggedTotal, ignored, failed)
			}
		})
		this.addCommand({
			id: "dev-mode",
			name:'Turn on/off dev mode logs', 
			callback: () => {
				const currentDev = setUtil.base.dev
				setUtil.base.dev = !currentDev
				this.saveSettings()
			}
		})	
	}
	
	onunload() {}
	
	async updateFile(this: void, file: TFile,): Promise<updateRes> {
		let log = new logs('Main','Update File', true)
		
		const clsFile = ClsFile.create(file)
		log.add("TFile", file)
		log.add('ClsFile Results',clsFile)
		if (clsFile.success) {
			const res = await clsFile.note.update()
			log.add('Update res', res)
			log.log('File Updated')
			return res
		} else {
			switch(clsFile.message){
				case 'unable':
					if(setUtil.base.flagUnclassified){
						await appUtils.processFrontmater(file, {},['Unable to Classify'])
					}
					log.log(`Unable to Classify ${file.basename}`)
					return {success:true, ignored:false, moved:false, flagged:setUtil.base.flagUnclassified}
				case 'ignored':
					log.log(`${file.basename} is Ignored`)
					return {success:true, ignored:true, moved:false, flagged:false}
				case 'error':
					log.log(`Error in Classifying ${file.basename}`)
					return {success:false}
			}
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
