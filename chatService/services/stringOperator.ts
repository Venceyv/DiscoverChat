export const stringOperator = (str:string,data:string,operation:string)=>{
    let updatedStr:string;
    switch (operation) {
        case 'add':
            updatedStr= str + ','+data;
            break;
        default:
            const strArr = str.split(',');
            strArr.splice(strArr.indexOf(data),1);
            updatedStr = strArr.toString();
            break;
    }
    return updatedStr;
}