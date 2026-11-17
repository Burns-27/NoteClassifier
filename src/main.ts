import {
	Plugin,
	TFile,
	TFolder,
} from 'obsidian';
import {
	NoteClassifierSettingTab,
} from './settings/settingsTab';

import { ClsFile } from './classification/ClassifiedFile';
import { settings } from './settings/settings';
import { ignore } from './Ignore/ignoreUtil';
import { flag } from './tools/flaggingUtil';
import { logger, appUtils, Logs } from './tools';
import { updateRes, NCPData } from './types';


export default class NoteClassifier extends Plugin {
	async onload() {
		await this.loadSettings();
		this.settings = settings.data
		logger.debug('Plugin Loaded', settings.base)
		appUtils.ini(this.app)
		this.addSettingTab(new NoteClassifierSettingTab(this.app, this));
		this.addIgnoreCommandsAndMenuOptions()
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
				const currentDev = settings.base.dev
				settings.base.dev = !currentDev
				void this.saveSettings()
			}
		})	
	}
	
	onunload() {}
	
	async updateFile(file: TFile): Promise<updateRes> {
		let log = new Logs('Main','Update File', true)
		const clsFile = ClsFile.create(file)
		log.add("TFile", file)
		if (!clsFile.success) {
			log.add('ClsFile Results',clsFile)
			switch(clsFile.message){
				case 'unable':
					log.log(`Unable to Classify ${file.basename}`)
					return {success:true, ignored:false, moved:false, flagged:settings.base.flagUnclassified}
				case 'ignored':
					log.log(`${file.basename} is Ignored`)
					return {success:true, ignored:true, moved:false, flagged:false}
				case 'error':
					log.log(`Error in Classifying ${file.basename}`)
					return {success:false}
			}
		} 
		log.add("TCls", clsFile.note)
		const note = clsFile.note
		const moved = note.move()
		const propCheck = note.checkProps()
		const flagged = flag.add(note, log)
		return {success:true, ignored:false, moved, flagged}
	}
	
	addIgnoreCommandsAndMenuOptions() {
		this.addCommand({
			id: 'ignore-file',
			name: 'Ignore active file',
			checkCallback: (checking: boolean) => {
				const log = new Logs('Settings', 'ignore active file', false)
				const file = appUtils.getActiveFile()
				log.add('Active file check', file)
				if (file) {
					if (!checking) {
						ignore.markFile(file,log)
					}
					return true
				}
				return false
			}
		})
		this.registerEvent(this.app.workspace.on('file-menu', (menu, file) => {
			let log = new Logs('Settings', 'ignore file menu', false)
			if (file instanceof TFile) {
				menu.addItem((item) => {
					item.setTitle('Ignore file')
					item.setIcon('document')
						.onClick(() => {
						ignore.markFile(file, log)
					})
				})
			} else if (file instanceof TFolder) {
				menu.addItem((item) => {
					item.setTitle('Ignore folder')
					item.setIcon('folder')
					item.onClick(() => {
						ignore.markFolder(file)
					})
				})
			}
		}))
	}
	
	async saveSettings() {
		await this.saveData(settings.data);
	}
	async loadSettings() {
		const data = await this.loadData() as Partial<NCPData>;
		settings.load(data)
	}
}
