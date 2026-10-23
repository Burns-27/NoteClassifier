
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
		name: 'Test 3',
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

export const MockClsArray: MockCls[] = [mediaCls, project, projectNotes];
export const TestCls = {
	media: mediaCls,
	project: project,
	notes: projectNotes,
};
