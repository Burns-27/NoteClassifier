import { App, PluginSettingTab,  SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import NoteClassifier from '../main';
import { NodeClass } from '../classification/Classification';
import { settingUtil } from './settingsUtil';
import {  FlatCls, TCls } from '../types/classifications.types';
import { ClsModal } from './ClsModal';
import { logger } from '../logger';
import { FlatRule } from '../types/rules.types';
import { RuleModal } from './rulesModal';
import { NoteClassifierSettings, settingKeys } from '../types/settings.types';

function getPath( path: string): unknown {
	const pathArray = path.split('.')
	const rules: Map<string, FlatCls> = settingUtil.get().rules
	let id: string = ''
	let cls: FlatCls | undefined 
	if (pathArray.length == 1) {
		return settingUtil.get()[path as settingKeys]
	}
	if (pathArray.length == 3 && pathArray[0] == "rules") {
		if (pathArray[1]) {
			cls = rules.get(id)
		}
		if (!cls) return undefined
		if (pathArray[2]) {
			switch (pathArray[2]) {
				case "name":
					return cls.name
				case "description":
					return cls.description
				case "destination":
					return cls.destination
				default:
					return undefined
			}
		}
	}
	return undefined
}
function setPath( path: string, value: unknown) {
	const pathArray = path.split('.')
	const rules: Map<string, FlatCls> = settingUtil.get().rules
	let id: string = ''
	let cls: FlatCls | undefined 
	if (pathArray.length == 1) {
		settingUtil.updateMain({ [path]: value })
		return
	}
	if (pathArray.length == 3 && pathArray[0] == "rules" && typeof value == "string") {
		if (pathArray[1]) {
			cls = rules.get(id)
		}
		if (!cls) return
		if (pathArray[2]) {
			switch (pathArray[2]) {
				case "name":
					cls.name = value
					break
				case "description":
					cls.description = value
					break
				case "destination":
					cls.destination = value
					break
				default:
					return
			}
			settingUtil.updateCls(cls)
		}
	}
}
export class NoteClassifierSettingTab extends PluginSettingTab {
	plugin: NoteClassifier;
	constructor(app: App, plugin: NoteClassifier) {
		super(app, plugin);
		this.plugin = plugin;
	}
	getControlValue(key: string): unknown {
		return getPath( key)
	}
	async setControlValue(key: string, value: unknown): Promise<void> {
		setPath(key, value)
		await this.plugin.saveSettings()
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
				name: "Ignore File/Folders",
				items: [
					{
						name: "Ingore property",
						desc: "if this property is checked on a file, it will be ignored by NoteClassifier",
						control:{key:"ignoreFilesProperty", type:"text"}
					}
				] //TODO (Settings) Figure out how you want to do "Ignore Folders"
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
				items: rootNodes.map((rule, index) => this.getClsPage(rule, index))
			}]
			},
			
		]
	}
	
	getClsPage(node: NodeClass, index: number): SettingGroupItem {
		const cls = node.classification
		const flatcls = cls.flat
		const keystart = `rules.${flatcls.id}`
		return {
			type: "page",
			//id:`${flatRule.id}.${index}`,
			name: `${flatcls.name}`,
			desc:`${flatcls.description??""}`,
			items: [
				{
					name: "Name",
					control:{key:`${keystart}.name`, type:"text"}
			},
				{
					name: "Description",
					control:{key:`${keystart}.description`, type:"textarea"}
				},
				{
					name: "Destination",
					desc: "Folder where files of this class should be moved to. See Doc's for syntax",
					control:{key:`${keystart}.destination`, type:"text"}
				},
				{
					heading: "Properties",
					type: "list",
					emptyState: "No Required Properties",
					addItem: {
						name: "add property",
						action:()=> this.newPropertyModal()
					},
					items: flatcls.requriedProperties.map((prop) => ({name:prop, action:()=>this.openPropertyModal(prop)}))
				},
				{
					heading: "Rules",
					type: "list",
					emptyState: "No Rules - No files will match",
					addItem: {
						name: "add rule",
						action:()=> this.newRulesModal(cls)
					},
					items:cls.rulesSettingArray(this.openRulesModal)
				}, 
				{
					heading: "Child Classifications",
					type: "group",
					extraButtons:[(button)=>{button.setIcon('plus').setTooltip('Add child classification').onClick(()=>this.newClsModal(cls.id))}] ,
					items: node.children.map((child, index)=>this.getClsPage(child,index ))
				}
			]
		}
	}
	newClsModal = (parentID?: string) => {
		const cls = settingUtil.newCls(parentID)
		new ClsModal(this.plugin, cls.cls, (flatCls) => {
			const res = settingUtil.updateCls(flatCls)
			void this.plugin.saveSettings()
			this.update()
		})
	}
	openPropertyModal = (prop: string) => {
		logger.debug("Propert Rule Modal")
	}
	newPropertyModal = () => {
		logger.debug("New Property rule Modal")
	}
	newRulesModal = (cls: TCls) => {
		const id = settingUtil.nextID()
		let rule: FlatRule = {
			type: 'tag',
			matchType: 'exact',
			tag: 'new',
			id:id
		}
		cls.flat.rules.set(id, rule)
		const updatedClsRes = settingUtil.updateCls(cls.flat)
		this.openRulesModal(updatedClsRes.cls, rule)
	}
	openRulesModal = (cls: TCls, rule: FlatRule) => {
		new RuleModal(this.plugin, rule, (newRule: FlatRule) => {
			cls.flat.rules.set(newRule.id, newRule)
			const res = settingUtil.updateCls(cls.flat)
			void this.plugin.saveSettings()
			this.update()
		})
	}
}