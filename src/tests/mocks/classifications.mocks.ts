
import { FlatCls } from '../../types/classifications.types';
import { MockCls, MockClsArg } from './cls.mock.factory';

const mediaMoc: MockClsArg = {
	flatCls: {
		id: '1',
		name: 'Media',
		destination: 'Media',
		requriedProperties: [],
		rules: [
			{
				id: '2',
				type: 'property',
				matchType: 'exact',
				propertyName: 'category',
				propertyValue: 'media',
			},
		],
	},
	level: 'Root',
	expectedPath: ['Media'],
	expectedProps: [],
};
const mediaCls = new MockCls(mediaMoc);

const test2Flat: MockClsArg = {
	flatCls: {
		id: '3',
		name: 'Test 2',
		destination: '[project]',
		requriedProperties: ['project'],
		rules: [{ id: '4', type: 'tag', matchType: 'exact', tag: 'project' }],
	},
	level: 'Root',
	expectedPath: ['[project]'],
	expectedProps: ['project'],
};
const project: MockCls = new MockCls(test2Flat);

const test3Flat: MockClsArg = {
	flatCls: {
		id: '5',
		name: 'project Notes',
		parentID: '3',
		destination: '*/notes',
		requriedProperties: [],
		rules: [{ id: '6', type: 'tag', matchType: 'include', tag: 'notes' }],
	},
	level: 'Child',
	expectedPath: ['[project]', 'notes'],
	expectedProps: ['project'],
	parent:project
	
};
const projectNotes: MockCls = new MockCls(test3Flat)
const flatNotes: MockClsArg = {
	flatCls: {
		id: '7',
		name: 'General Notes',
		destination: "[subject]/Notes",
		requriedProperties: ['subject'],
		rules: [{ id: '6', type: 'tag', matchType: 'include', tag: 'notes' }],
	},
	level: 'Root',
	expectedPath: ['[subject]', 'notes'],
	expectedProps: ['subject'],
}
const generalNotes:MockCls = new MockCls(flatNotes)

const articleGuideMoc: MockClsArg = {
	flatCls: {
		id: '9',
		parentID:'1',
		name: "Guide - Article",
		destination: '*/Article/Guides',
		requriedProperties: ['subject', 'URL'],
		rules: [{
			id: '10',
			type: 'property',
			matchType:'exact',
			propertyName: 'mediaType',
			propertyValue: 'article',
		},
			{
				id: '11',
				type: 'tag',
				matchType: 'include',
				tag:'guide'
		}]
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
