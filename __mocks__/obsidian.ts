
export const getAllTags = jest.fn().mockReturnValue(['#default-mock-tag']);
export const normalizePath = jest.fn((string:string)=>{return string})
export const Modal = jest.fn().mockImplementation(() => {
    return {
        open: jest.fn(),
        close: jest.fn(),
        onOpen: jest.fn(),
        onClose: jest.fn()
    }
})