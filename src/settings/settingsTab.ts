import { App, PluginSettingTab,  SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import NoteClassifier from '../main';
import { NodeClass } from '../classification/Classification';
import { settingUtil } from './settingsUtil';
import { FlatCls, TCls } from '../types/classifications.types';
import { ClsModal } from './ClsModal';
import { logger } from '../logger';

export class NoteClassifierSettingTab extends PluginSettingTab {
	plugin: NoteClassifier;
	constructor(app: App, plugin: NoteClassifier) {
		super(app, plugin);
		this.plugin = plugin;
	}
	getSettingDefinitions(): SettingDefinitionItem[] {
		const rootNodes = [...settingUtil.rootNodes()]
		console.debug("root nodes", rootNodes)
		return [
			{
				name: "Debug Mode",
				desc:"Enable Debug logs in the developer tools",
				control:{type:"toggle", key:"debug"}
			},
					{
						name: "Create Reports",
						desc:"Create a .bases file with views that filters based on notices. See docs for details.  ",
						action:()=>{logger.debug('Create Report button Clicked')},
					},
			{
				heading: "Notificaitons",
				type: "group",
				items: [
					{
						name: "Summary Notice",
						desc:"Show Notice of how many files moved/audited post command",
						control:{type:"toggle",key:"SummaryNotice"}
					},
					{
						name: "Error Notice",
						desc: "Show notice when there a command is unable to be completed for a file",
						control:{type:'toggle', key:'ErrorNotice'}
					}
				]
			},
			{
				type: "page",
				name: "Main Classifications",
				items:[{
				heading: 'Classes',
				type: "list",
				addItem: {
					name: "Add Classification",
					action: ()=>this.newClsModal()
				},
				items: rootNodes.map((rule, index) => this.getRulePage(rule, index))
			}]
			},
			
		]
	}
	
	getRulePage(rule: NodeClass, index: number): SettingGroupItem {
		const cls = rule.classification
		const flatcls = cls.flat
		return {
			type: "page",
			//id:`${flatRule.id}.${index}`,
			name: `${flatcls.name}`,
			desc:`${flatcls.description??""}`,
			items: [
				{
					name: "Description",
					render: ((setting) => {
						setting.setName("Description")
						cls.getDesc(setting.descEl)
						setting.addExtraButton((button) => {
							button.setIcon("pencil")
							button.onClick(() => {
								this.openClsModal(cls)
							})
						})
					})
				},
				{
					heading: "Child Classifications",
					type: "list",
					addItem: { name: "Add Child Classificaiton", action: () => this.newClsModal(flatcls.id) },
					items: rule.children.map((child, index)=>this.getRulePage(child,index ))
				}
			]
		}
	}
	openClsModal(cls: TCls) {
		new ClsModal(this.plugin, cls,  (newCls: FlatCls) => {
			const updateResults = settingUtil.updateCls(newCls)
			logger.debug("Cls Modal closed, cls updated", updateResults)
			void this.plugin.saveSettings()
			this.update()
		}).open()
	}
	newClsModal(parentID?:string) {
		const res = settingUtil.newCls(parentID)
		this.openClsModal(res.cls)
	}
}