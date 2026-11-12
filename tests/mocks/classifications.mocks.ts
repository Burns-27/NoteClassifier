import { FlatCls } from '../../src/types/classifications.types';
export const clsData = {
	"1":{
		id: '1',
		name: 'Media',
		destination: 'Media',
		requriedProperties: [],
		rules:['2']
	},
"3": {
		id: '3',
		name: 'Test 2',
		destination: '[project]',
		requriedProperties: ['20'],
		rules: ['4']
},
	"5":{
		id: '5',
		name: 'project Notes',
		parentID: '3',
		destination: '*/notes',
		requriedProperties: [],
		rules: ['6']
	},
	"7":{
		id: '7',
		name: 'General Notes',
		destination: "[subject]/Notes",
		requriedProperties: ['21'],
		rules:['8'],
	},
	"9":{
		id: '9',
		parentID:'1',
		name: "Guide - Article",
		destination: '*/Article/Guides',
		requriedProperties: ['21'],
		rules: ['11','10']
	}
}
export const clsMap:Map<string,FlatCls> = new Map<string,FlatCls>(Object.entries(clsData))




