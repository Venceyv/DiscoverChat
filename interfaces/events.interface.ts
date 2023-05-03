export interface Event{
    eventName: string,
    targetId: string
    action: string,
    ajaxRelativePath: string,//path
    requestMethod:"get"|"post"|'put'|'delete'
}