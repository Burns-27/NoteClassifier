import { App, PluginSettingTab,  SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import NoteClassifier from '../main';
import { FlatClass, NodeClass } from '../classification/Classification';




export class NoteClassifierSettingTab extends PluginSettingTab {
	plugin: NoteClassifier;
	flatRules: FlatClass[];
	rootNodes: NodeClass[];
	constructor(app: App, plugin: NoteClassifier) {
		super(app, plugin);
		this.plugin = plugin;
		this.flatRules = plugin.settings.rules
		this.rootNodes = plugin.rootNodes
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
					action: ()=>this.openNewClsModal()
				},
				items: this.rootNodes.map((rule, index) => this.getRulePage(rule, index))
			}
		]
	}
	openNewClsModal(parentID?: string) {
		const newClassification: FlatClass = {
			id: this.plugin.nextID().toString(),
			name: "New Classificaiton",
			destination: "",
			...parentID ? { parentID: parentID } : {},
			requriedProperties: [],
			rules:[]
		}
		new ClassificationModal(this.app, this.plugin, newClassification, (cls) => {
			this.flatRules.push(cls)
			void this.plugin.saveSettings()
			this.update()
		}).open()
	}
	openClassificationModal(cls:FlatClass) {
		new ClassificationModal(this.app, this.plugin, cls, (newCls) => {
			cls = newCls
			void this.plugin.saveSettings()
			this.update()
		}).open()
	}
	getRulePage(rule: NodeClass, index: number): SettingGroupItem {
		const flatRule = this.flatRules.find((r) => r.id == rule.classification.id)
		if (!flatRule) return {
			type: "page",
			name: "Error",
			items: [
				{
					name: "Classification Not found",
					desc:"This Classification was not found, please reload app, or plugin"
				}
			]
		}
		const ruleID = rule.classification.id
		const ClassificationRules = rule.classification.getRuleDesc()
		//const children = rule.children
		return {
			type: "page",
			//id:ruleID,
			name: `Classification: ${flatRule.name}`,
			items: [
				{
					name: "Name",
					desc: flatRule.name
				},
				{
					name: "Destination Folder",
					desc: flatRule.destination
				},
				{
					name: "Required Properties",
					desc: flatRule.requriedProperties.join(",/n")
				},
				{
					name: "Rules",
					desc: ClassificationRules
				},
				{
					name: "Edit Classification",
					action: ()=>this.openClassificationModal(flatRule)
				},
				{
					heading: "Child Classifications",
					type: "list",
					addItem: { name: "Add Child Classificaiton", action: () => this.openNewClsModal(ruleID) },
					items: rule.children.map((child, index)=>this.getRulePage(child,index ))
					
					
				}
			]
		}
	}
}