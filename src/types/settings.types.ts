import { NodeClass } from '../classification/Classification';
import type { FlatCls } from './classifications.types';
import type { midFile } from './files.types';
import type { ClsRes, flatPropRes, flatRuleRes, UpdateClsRes } from './responses.types';
import { FlatReqProp, FlatRule } from './rules.types';

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
  flagFallbackDefault: boolean;
  pathFallbackDefault: 'Prop' | 'Skip';
  ignoredFolders: string[];
  ignoreFilesProperty: string;
	addMissingProps: boolean;
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
	| 'ignoreFilesProperty';

export const DEFAULT_BASE_SETTINGS:BaseNCPSettings = {
	nextID: 1,
  debug: false,
  dev:false, 
	SummaryNotice: true,
	ErrorNotice: true,
	NoticeProperty: 'NC_Notice',
	flagFallbackDefault: false,
	pathFallbackDefault: 'Skip',
	ignoredFolders: [],
	ignoreFilesProperty: 'NCP_Ignore',
	addMissingProps:false,
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
