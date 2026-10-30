import { App, PluginSettingTab,  SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import NoteClassifier from '../main';
import { NodeClass } from '../classification/Classification';
import { settingUtil } from './settingsUtil';
import {  FlatCls, TCls } from '../types/classifications.types';
import { ClsModal } from './ClsModal';
import { devlog, logger } from '../logger';
import { FlatRule } from '../types/rules.types';
import { RuleModal } from './rulesModal';
import { NoteClassifierSettings, settingKeys } from '../types/settings.types';

function getPath(path: string): unknown {
	const pathArray = path.split('.')
	const rules: Map<string, FlatCls> = settingUtil.get().classes
	let id: string = ''
	let cls: FlatCls | undefined 
	let value:unknown = ''
	if (pathArray.length == 1) {
		value= settingUtil.get()[path as settingKeys]
		//devlog.loc('getPath', 'Main setting',{path, pathArray, value})
		return value
	}
	if (pathArray.length == 3 && pathArray[0] == "rules") {
		if (pathArray[0] && pathArray[1]) {
			id = pathArray[1]
			cls = rules.get(id)
		}
		//devlog.loc('getPath', 'Cls Setting', {path, pathArray, id, cls})
		if (!cls) return undefined
		if (pathArray[2]) {
			switch (pathArray[2]) {
				case "name":
					value = cls.name
					break
				case "description":
					value = cls.description
					break
				case "destination":
					value = cls.destination
					break
				default:
					value = undefined
					break
			}
		}
	}
	//devlog.loc('getPath', 'Cls Setting',{path, pathArray, id, cls, value})
	return value
}
function setPath(path: string, value: unknown) {
	const pathArray = path.split('.')
	const classes: Map<string, FlatCls> = settingUtil.get().classes
	let id: string = ''
	let cls: FlatCls | undefined 
	if (pathArray.length == 1) {
		settingUtil.updateMain({ [path]: value })
		//devlog.loc('setPath','Main Rules Update', {path, value, settings: settingUtil.get()})
	}
	if (pathArray.length == 3 && pathArray[0] == "rules" && typeof value == "string") {
		if (pathArray[1]) {
			id = pathArray[1]
			cls = classes.get(id)
		}
		
		if (pathArray[2]&&cls) {
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
					break
			}
			settingUtil.updateCls(cls)
		}
		//devlog.loc('setPath', 'clsUpdate', {path, pathArray, value, id, cls, settings:settingUtil.get()})
	}
}
export class NoteClassifierSettingTab extends PluginSettingTab {
	plugin: NoteClassifier;
	constructor(app: App, plugin: NoteClassifier) {
		super(app, plugin);
		this.plugin = plugin;
	}
	getControlValue(key: string): unknown {
		const value = getPath(key)
		//devlog.loc('GetControlValue', "Results", {key, value})
		return value
	}
	async setControlValue(key: string, value: unknown): Promise<void> {
		//devlog.loc('SetControlValue',"Function Called",{key, value})
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
		const rulesArray = cls.rulesSettingArray(this.openRulesModal)
		devlog.loc('getClsPage','before Return',{cls, flatcls})
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
					onDelete: (index) => {
						const ruleId = rulesArray[index]?.id ?? 'err'
						flatcls.rules = flatcls.rules.filter(r => r !== ruleId)
						settingUtil.get().rules.delete(ruleId)
						settingUtil.updateCls(flatcls)
						void this.plugin.saveSettings()
						this.update()
					},
					items:rulesArray.map(r=>r.item),
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
			settingUtil.updateCls(flatCls)
			void this.plugin.saveSettings()
			this.update()
		}).open()
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
		cls.flat.rules.push(id)
		settingUtil.get().rules.set(id, rule)
		const updatedClsRes = settingUtil.updateCls(cls.flat)
		this.openRulesModal(updatedClsRes.cls, rule)
	}
	openRulesModal = (cls: TCls, rule: FlatRule) => {
		new RuleModal(this.plugin, rule, (newRule: FlatRule) => {
			cls.flat.rules.push(rule.id)
			cls.flat.rules = [...new Set(cls.flat.rules)]
			settingUtil.get().rules.set(rule.id,newRule)			
			settingUtil.updateCls(cls.flat)
			void this.plugin.saveSettings()
			this.update()
		}).open()
	}
}