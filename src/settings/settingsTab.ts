import { App, PluginSettingTab,  SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import NoteClassifier from '../main';
import { NodeClass } from '../classification/Classification';
import { settingUtil } from './settingsUtil';
import { FlatCls, TCls } from '../types/classifications.types';
import { ClsModal } from './ClsModal';

export class NoteClassifierSettingTab extends PluginSettingTab {
	plugin: NoteClassifier;
	constructor(app: App, plugin: NoteClassifier) {
		super(app, plugin);
		this.plugin = plugin;
	}
	async setControlValue(key: string, value: unknown):  Promise<void> {
		settingUtil.updateMain({ [key]: value })
		await this.plugin.saveSettings()
	}
	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				name: "Debug Mode",
				desc:"Enable Debug logs in the developer tools",
				control:{type:"toggle", key:"debug"}
			},
			{
				name: "Prompt on save",
				desc: "Prompt to run a Update All command when saving changes to a classification",
				control:{type:"toggle",key:"promptOnSave"}
		},
			{
				heading: "Reports",
				type: "group",
				items: [
					{
						name: "Create Reports",
						desc:"Create a .md file when running a command to get the matching report. See doc's for details. ",
						control: { type: "toggle", key: "createReports" },
					},
					{
						name: "Auto Open Reports",
						desc:"Automatically open reports in a new tab after a command is run",
						control: { type: "toggle", key: "autoOpenReports" },
						visible:()=>this.plugin.settings.createReports
					},
					{
						name: "Report Location",
						desc: `Where the reports will be saved. See docs for info`,
						visible:()=>this.plugin.settings.createReports,
						control: {
							type: "dropdown",
							key: "reportLocation",
							options: {folder:"Specific Folder", root:"Vault Root", dynamic:"Command Location"}
						}
					}
				]
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
				heading: 'Classes',
				type: "list",
				addItem: {
					name: "Add Classification",
					action: ()=>this.newClsModal()
				},
				items: settingUtil.rootNodes.map((rule, index) => this.getRulePage(rule, index))
			}
		]
	}
	
	getRulePage(rule: NodeClass, index: number): SettingGroupItem {
		const flatRuleRes = settingUtil.getFlatCls(rule.classification.id)
		if (!flatRuleRes.success) return {
			type: "page",
			name: "Error",
			items: [
				{
					name: "Classification Not found",
					desc:"This Classification was not found, please reload app, or plugin"
				}
			]
		}
		if (!(flatRuleRes.type === "flat CLs Get")) {
			return {
				type: "page",
				name: "Error",
				items: [
				{
					name: "Classification Not found",
					desc:"This Classification was not found, please reload app, or plugin"
				}
			]
			}
		}
		const flatRule = flatRuleRes.cls
		const cls = rule.classification
		//const children = rule.children
		return {
			type: "page",
			//id:ruleID,
			name: `Classification: ${flatRule.name}`,
			items: [
				{
					name: "Description",
					render: ((setting) => {
						setting.setName("Description")
						cls.getDesc(setting.descEl)
						setting.addExtraButton((button) => {
							button.setIcon("pencil")
							button.onClick(()=>this.openClsModal(cls, flatRule))
						})
					})
				},
				{
					heading: "Child Classifications",
					type: "list",
					addItem: { name: "Add Child Classificaiton", action: () => this.newClsModal(flatRule.id) },
					items: rule.children.map((child, index)=>this.getRulePage(child,index ))
				}
			]
		}
	}
	openClsModal(cls: TCls, flatCls: FlatCls) {
		new ClsModal(this.plugin, flatCls, cls, (newCls: FlatCls) => {
			settingUtil.updateCls(newCls)
			void this.plugin.saveSettings()
			this.update()
		}).open()
	}
	newClsModal(parentID?:string) {
		const { flatCls, cls } = settingUtil.newCls(parentID)
		this.openClsModal(cls, flatCls)
	}
	
}