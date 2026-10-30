
import { FlatCls } from '../../types/classifications.types';
import { FlatRule } from '../../types/rules.types';
import { MockCls, MockClsArg } from './cls.mock.factory';
export const Rules = new Map<string, FlatRule>()
export const classes = new Map<string, FlatCls>()
Rules.set('2',{
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
		rules:['2']
	},
	level: 'Root',
	expectedPath: ['Media'],
	expectedProps: [],
};
const mediaCls = new MockCls(mediaMoc);
classes.set('1',mediaCls.flatCls)
Rules.set('4',{ id: '4', type: 'tag', matchType: 'exact', tag: 'project' })
const test2Flat: MockClsArg = {
	flatCls: {
		id: '3',
		name: 'Test 2',
		destination: '[project]',
		requriedProperties: ['project'],
		rules: ['4']
	},
	level: 'Root',
	expectedPath: ['[project]'],
	expectedProps: ['project'],
};
const project: MockCls = new MockCls(test2Flat);
classes.set('3',project.flatCls)
Rules.set('6',{ id: '6', type: 'tag', matchType: 'include', tag: 'notes' })
const test3Flat: MockClsArg = {
	flatCls: {
		id: '5',
		name: 'project Notes',
		parentID: '3',
		destination: '*/notes',
		requriedProperties: [],
		rules: ['6']
	},
	level: 'Child',
	expectedPath: ['[project]', 'notes'],
	expectedProps: ['project'],
	parent:project
	
};
const projectNotes: MockCls = new MockCls(test3Flat)
classes.set('5',projectNotes.flatCls)
Rules.set('8',{ id: '8', type: 'tag', matchType: 'include', tag: 'notes' })
const flatNotes: MockClsArg = {
	flatCls: {
		id: '7',
		name: 'General Notes',
		destination: "[subject]/Notes",
		requriedProperties: ['subject'],
		rules:['8'],
	},
	level: 'Root',
	expectedPath: ['[subject]', 'notes'],
	expectedProps: ['subject'],
}
const generalNotes: MockCls = new MockCls(flatNotes)
classes.set('7', generalNotes.flatCls)
Rules.set('10', {
	id: '10',
	type: 'property',
	matchType: 'exact',
	propertyName: 'mediaType',
	propertyValue: 'article',
});
Rules.set('11', {
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
		rules: ['11','10']
	},
	level: 'Child',
	expectedPath: ['Media', 'Article', 'Guides'],
	expectedProps: ['subject', 'URL'],
	parent:mediaCls
}
const articleGuide = new MockCls(articleGuideMoc)
classes.set('9',articleGuide.flatCls)
export const MockClsArray: FlatCls[] = [mediaCls.flatCls, project.flatCls, projectNotes.flatCls,generalNotes.flatCls,articleGuide.flatCls];
export const TestCls = {
	media: mediaCls,
	project: project,
	projectNotes: projectNotes,
	generalNotes: generalNotes,
	articleGuide:articleGuide,
};
