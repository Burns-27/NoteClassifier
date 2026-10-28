
export const getAllTags = jest.fn().mockReturnValue(['#default-mock-tag']);
export const normalizePath = jest.fn().implements((string:string)=>{return string})