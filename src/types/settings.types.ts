import { NodeClass } from '../classification/Classification';
import { FlatCls } from './classifications.types';
import { midFile } from './files.types';
import { FlatReqProp } from './reqProps.types';
import { ClsRes, UpdateClsRes, flatRuleRes, flatPropRes } from './responses.types';
import { FlatRule } from './rules.types';



export type NCPSettings = {
	rules: Map<string, FlatRule>;
  classes: Map<string, FlatCls>;
  reqProps: Map<string, FlatReqProp>;
} & BaseNCPSettings

export type BaseNCPSettings = {
  nextID: number,
  debug: boolean, 
  dev:boolean, 
  SummaryNotice: boolean;
  ErrorNotice: boolean;
  NoticeProperty: string;
  flagUnclassified:true;
  flagFallbackDefault: boolean;
  pathFallbackDefault: 'Prop' | 'Skip';
  ignoredFolders: string[];
  ignoreFilesProperty: string;
	addMissingProps: boolean;
	classificationProp: string;
	addClassificationProp: boolean;
}
export type NCPData = {
  rules:Record<string, FlatRule>,
  classes: Record<string, FlatCls>,
  reqProps: Record<string, FlatReqProp>,
} & BaseNCPSettings

export type settingKeys =
	| 'nextID'
	| 'ErrorNotice'
	| 'SummaryNotice'
	| 'NoticeProperty'
	| 'debug' |'dev'
	| 'ignoredFolders'
	| 'ignoreFilesProperty'|'addMissingProps'|'classificationProp'|'addClassificationProp'|'flagUnclassified';

export const DEFAULT_BASE_SETTINGS:BaseNCPSettings = {
	nextID: 1,
  debug: false,
  dev:false, 
	SummaryNotice: true,
	ErrorNotice: true,
	NoticeProperty: 'NC_Notice',
	flagUnclassified:true,
	flagFallbackDefault: false,
	pathFallbackDefault: 'Skip',
	ignoredFolders: [],
	ignoreFilesProperty: 'NCP_Ignore',
	addMissingProps: false,
	addClassificationProp: true,
	classificationProp:'NC_Class',
};

export interface SettingUtil {
	get: () => NCPSettings;
	base: BaseNCPSettings;
	getCls: (id: string) => ClsRes;
	updateMain: (newSettings: Partial<BaseNCPSettings>) => void;
	updateAll: (newSettings: Partial<NCPData>) => void;
	updateCls: (flat: FlatCls) => UpdateClsRes;
	newCls: (parentID?: string) => UpdateClsRes;
	nextID: () => string;
	rootNodes: () => NodeClass[];
	matchCls: (file: midFile) => ClsRes;
	getFlatRule: (id: string) => flatRuleRes;
	getFlatReqProp: (id: string) => flatPropRes;
}
