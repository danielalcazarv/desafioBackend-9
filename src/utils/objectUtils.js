export const asPOJO = obj =>JSON.parse(JSON.stringify(obj));

export const renameField = (record, from, to) =>{
    record[to] = record[from]
    delete record[from]
    return record
};