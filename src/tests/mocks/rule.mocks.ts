import { FlatRule } from '../../types/rules.types';

export const rulesData: Record<string, FlatRule> = {
	'2': {
		id: '2',
		type: 'property',
		matchType: 'exact',
		propertyName: 'category',
		propertyValue: 'media',
	},
	'4': { id: '4', type: 'tag', matchType: 'exact', tag: 'project' },
	'6': { id: '6', type: 'tag', matchType: 'include', tag: 'notes' },
	'8': { id: '8', type: 'tag', matchType: 'include', tag: 'notes' },
	'10': {
		id: '10',
		type: 'property',
		matchType: 'exact',
		propertyName: 'mediaType',
		propertyValue: 'article',
	},
	'11': {
		id: '11',
		type: 'tag',
		matchType: 'include',
		tag: 'guide',
	},
};
export const rulesMap: Map<string, FlatRule> = new Map<string, FlatRule>(
	Object.entries(rulesData),
);
