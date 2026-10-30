
import { FlatCls } from '../../types/classifications.types';
import { FlatRule } from '../../types/rules.types';
import { MockCls, MockClsArg } from './cls.mock.factory';
const mediaRules = new Map<string, FlatRule>()
mediaRules.set('2',{
				id: '2',
				type: 'property',
				matchType: 'exact',
				propertyName: 'category',
				propertyValue: 'media',
			})
const mediaMoc: MockClsArg = {
	flatCls: {
		id: '1',
		name: 'Media',
		destination: 'Media',
		requriedProperties: [],
		rules:mediaRules
	},
	level: 'Root',
	expectedPath: ['Media'],
	expectedProps: [],
};
const mediaCls = new MockCls(mediaMoc);
const projectRules = new Map<string, FlatRule>()
projectRules.set('4',{ id: '4', type: 'tag', matchType: 'exact', tag: 'project' })
const test2Flat: MockClsArg = {
	flatCls: {
		id: '3',
		name: 'Test 2',
		destination: '[project]',
		requriedProperties: ['project'],
		rules: projectRules,
	},
	level: 'Root',
	expectedPath: ['[project]'],
	expectedProps: ['project'],
};
const project: MockCls = new MockCls(test2Flat);
const projectNotesRule = new Map<string, FlatRule>()
projectNotesRule.set('6',{ id: '6', type: 'tag', matchType: 'include', tag: 'notes' })
const test3Flat: MockClsArg = {
	flatCls: {
		id: '5',
		name: 'project Notes',
		parentID: '3',
		destination: '*/notes',
		requriedProperties: [],
		rules: projectNotesRule,
	},
	level: 'Child',
	expectedPath: ['[project]', 'notes'],
	expectedProps: ['project'],
	parent:project
	
};
const projectNotes: MockCls = new MockCls(test3Flat)
const noteRules = new Map<string, FlatRule>()
noteRules.set('6',{ id: '6', type: 'tag', matchType: 'include', tag: 'notes' })
const flatNotes: MockClsArg = {
	flatCls: {
		id: '7',
		name: 'General Notes',
		destination: "[subject]/Notes",
		requriedProperties: ['subject'],
		rules:noteRules,
	},
	level: 'Root',
	expectedPath: ['[subject]', 'notes'],
	expectedProps: ['subject'],
}
const generalNotes:MockCls = new MockCls(flatNotes)
const articleGuideRules = new Map<string, FlatRule>()
articleGuideRules.set('10', {
	id: '10',
	type: 'property',
	matchType: 'exact',
	propertyName: 'mediaType',
	propertyValue: 'article',
});
articleGuideRules.set('11', {
	id: '11',
	type: 'tag',
	matchType: 'include',
	tag: 'guide'
});
		
const articleGuideMoc: MockClsArg = {
	flatCls: {
		id: '9',
		parentID:'1',
		name: "Guide - Article",
		destination: '*/Article/Guides',
		requriedProperties: ['subject', 'URL'],
		rules: articleGuideRules
	},
	level: 'Child',
	expectedPath: ['Media', 'Article', 'Guides'],
	expectedProps: ['subject', 'URL'],
	parent:mediaCls
}
const articleGuide = new MockCls(articleGuideMoc)
export const MockClsArray: FlatCls[] = [mediaCls.flatCls, project.flatCls, projectNotes.flatCls,generalNotes.flatCls,articleGuide.flatCls];
export const TestCls = {
	media: mediaCls,
	project: project,
	projectNotes: projectNotes,
	generalNotes: generalNotes,
	articleGuide:articleGuide,
};
