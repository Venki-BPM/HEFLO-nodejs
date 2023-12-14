import { Context } from './Context';
import { Metadata } from './Metadata';
import { Guid, IDictionary } from './Types';

export class BaseModel {

    protected context: Context;
    protected classOid: string = "";

    protected fields: IDictionary;
    protected fieldsWithAlias: IDictionary;
    protected lists: IDictionary;

    protected isNew: boolean = false;

    constructor(context: Context) {
        this.context = context;
        this.fields = {};
        this.fieldsWithAlias = {};
        this.lists = {};
    }

    protected GetKey(): string | number {
        return 0;
    }

    public Get(fieldName: string) {
        if (fieldName && fieldName.toLowerCase() === "oid") return this.GetKey();
        let actualName = Metadata.GetPropertyName(this.context, this.classOid, fieldName);
        if (!actualName)
            throw `Field ${fieldName} not found`;
        if (actualName)
            return this.fields[actualName];

        return null;
    }

    protected LogChange(className: string, fieldName: string, key: number | string, value: any) {
        if (this.fields.hasOwnProperty(fieldName))
            this.fields[fieldName] = value;

        let actualName = Metadata.GetPropertyName(this.context, this.classOid, fieldName);
        if (!actualName)
            throw `Field ${fieldName} not found`;
        if (actualName)
            this.fields[actualName] = value;
        if (actualName !== fieldName)
            this.fieldsWithAlias[fieldName] = value;

        this.context.addChange(className, actualName, key, value);
    }

    public Parse(data: IDictionary) {
        this.isNew = false;
        if (data) {
            let fieldsData: IDictionary = data;
            Object.keys(fieldsData).forEach(key => {
                if (key === "Oid")
                    this.fields[key] = fieldsData[key];
                else if (key.length > 2 && key.substr(0, 3) === "cp_") {
                    let normalizeKey = key;
                    if (normalizeKey.length > 3 && normalizeKey.indexOf("Oid") != -1 && (normalizeKey.indexOf("Oid") === (normalizeKey.length - 3)))
                        normalizeKey = normalizeKey.substr(0, normalizeKey.indexOf("Oid"));
                    this.fields[normalizeKey] = fieldsData[key];
                    let metaProperty = Metadata.GetPropertyMetadata(this.context, this.classOid, normalizeKey);
                    if (metaProperty && metaProperty["CustomAlias"])
                        this.fieldsWithAlias[metaProperty["CustomAlias"]] = fieldsData[key];
                }
            });
        }
    }

    private static ProcessInstanceClassOid = "d5a12beb-a524-4b3c-a543-8194e37d9d88";

    public async GetListAsync(fieldName: string): Promise<Array<CustomType> | undefined> {
        await Metadata.CheckAsync(this.context, this.classOid);
        let actualName = Metadata.GetPropertyName(this.context, this.classOid, fieldName);
        if (!actualName)
            throw `Field ${fieldName} not found`;
        let list: Array<CustomType> = this.lists[actualName];
        if (list) return list;

        let entityId = Metadata.GetListEntity(this.context, this.classOid, actualName);
        await Metadata.CheckAsync(this.context, entityId);

        if (entityId) {
            let listJSON: string = this.fields[`${actualName}List`];
            if (listJSON) {
                let tempList: Array<IDictionary> = JSON.parse(listJSON);
                if (tempList) {
                    list = [];
                    tempList.forEach(element => {
                        list.push(CustomType.Parse(this.context, <string>entityId, element))
                    });
                    this.lists[actualName] = list;
                    return list;
                }
            }

            let classOid = this.classOid || BaseModel.ProcessInstanceClassOid;
            classOid = classOid.startsWith("ce_") ? classOid.substring(3) : classOid;

            let url = `${this.context.StorageNoSQL}odata/CustomProperty/DataServiceControllers.GetListData?classOid=${classOid}&instanceOid=${this.GetKey()}&entityOid=${entityId}`;

            list = <Array<CustomType>>(await this.context.FindAllAsync(url, entityId, (data: Array<any>) => {
                return CustomType.Parse(this.context, <string>entityId, data)
            }));
            this.lists[actualName] = list;
            return list;
        } else 
            return undefined;
    }

    private CopyRecord(entityId: string, record: any) {
        let copyRecord: IDictionary = {};
        Object.keys(record).forEach(key => {
            let columnName = Metadata.GetPropertyName(this.context, entityId, key);
            copyRecord[columnName || key] = record[key];
        });
        return copyRecord;
    }

    public async AddRecordAsync(fieldName: string, record: any): Promise<CustomType> {
        await Metadata.CheckAsync(this.context, this.classOid);
        let actualName = Metadata.GetPropertyName(this.context, this.classOid, fieldName);
        if (!actualName)
            throw `Field ${fieldName} not found`;

        let entityId = Metadata.GetListEntity(this.context, this.classOid, actualName);
        if (entityId) {
            await Metadata.CheckAsync(this.context, entityId);

            record = this.CopyRecord(entityId, record)
            record.Oid = Guid.newGuid();
            this.context.addRecordChange(this.classOid, actualName, this.GetKey(), record);

            if (!this.lists[actualName])
                this.lists[actualName] = await this.GetListAsync(actualName);

            let list: Array<CustomType> = this.lists[actualName];
            let newItem: CustomType = CustomType.FromJSON(this.context, entityId, record);
            list.push(newItem);
            return newItem;
        }
    }

    public async UpdateRecordAsync(fieldName: string, instanceId: string, record: any): Promise<void> {
        await Metadata.CheckAsync(this.context, this.classOid);
        let actualName = Metadata.GetPropertyName(this.context, this.classOid, fieldName);
        if (!actualName)
            throw `Field ${fieldName} not found`;

        let entityId = Metadata.GetListEntity(this.context, this.classOid, actualName);
        if (entityId) {
            await Metadata.CheckAsync(this.context, entityId);
            record = this.CopyRecord(entityId, record)
            let delta = { fields: record, InstanceOid: instanceId };
            this.context.addRecordChange(this.classOid, actualName, this.GetKey(), delta);

            if (!this.lists[actualName])
                this.lists[actualName] = await this.GetListAsync(actualName);

            let list: Array<CustomType> = this.lists[actualName];
            let currentItem = list.filter(item => item.Oid === instanceId);
            if (currentItem && currentItem.length) {
                let item = currentItem[0];
                item.Parse(record);
                list = list.filter(item => item.Oid === instanceId);
                list.push(item);
            }
        }
    }

    public async DeleteRecordsAsync(fieldName: string, instances: Array<string>) {
        for(let instanceOid of instances)
            await this.DeleteRecordAsync(fieldName, instanceOid);
    }

    public async DeleteRecordAsync(fieldName: string, instanceId: string) {
        await Metadata.CheckAsync(this.context, this.classOid);
        let actualName = Metadata.GetPropertyName(this.context, this.classOid, fieldName);
        if (!actualName)
            throw `Field ${fieldName} not found`;

        let record: any = { InstanceOid: instanceId, Deleted: true };
        this.context.addRecordChange(this.classOid, actualName, this.GetKey(), record);

        if (!this.lists[actualName])
            this.lists[actualName] = await this.GetListAsync(actualName);

        this.lists[actualName] = this.lists[actualName].filter(item => item.Oid !== instanceId);
    }

    public async SaveRecordListAsync(context: Context, fieldName: string) {
        await Metadata.CheckAsync(this.context, this.classOid);
        let actualName = Metadata.GetPropertyName(this.context, this.classOid, fieldName);
        if (!actualName)
            throw `Field ${fieldName} not found`;
        let entityId = Metadata.GetListEntity(this.context, this.classOid, actualName);
        if (this.lists[actualName]) {
            let oids: Array<string> = [];
            let list: Array<CustomType> = this.lists[actualName];
            let i = 0;
            for(i=0; i<list.length; i++) {
                let element = list[i];
                await element.SaveAsync(context, entityId, element.Oid || element.fields["Oid"]);
                this.context.removeRecordChange(this.classOid, actualName, this.GetKey());
                oids.push(element.Oid || element.fields["Oid"]);
            }

            this.LogChange(this.classOid, fieldName, this.GetKey().toString(), oids.join(','));
            await this.SaveAsync(context);
        }
    }

    public async SaveAsync(context: Context): Promise<number | string | undefined> {
        return undefined;
    }
}

export class CustomType extends BaseModel {

    private oid: string;

    protected GetKey(): string | number {
        return this.oid;
    }

    private constructor (context: Context, classOid: string) {
        super(context);
        this.classOid = classOid;
        this.oid = Guid.newGuid();
    }

    public Set(fieldName: string, value: any) {
        this.LogChange(this.classOid, fieldName, this.oid, value);
    }

    public get Oid(): string {
        return this.oid;
    }

    public static async FindAsync(context: Context, classOid: string, recordId: string, useCache: boolean = false): Promise<any> {
        if (recordId) {
            let cacheKey = `${recordId}-${classOid}`;
            if (useCache && context.Cache.get(cacheKey)) {
                await Metadata.CheckAsync(context, classOid);
                return <CustomType>context.Cache.get(cacheKey);
            }

            let result = <CustomType>(await context.FindAsync(`${context.StorageNoSQL}odata/CustomProperty('${recordId}')/DataServiceControllers.GetEntityData?classOid=${classOid}`,
                classOid, (data: Array<any>) => { return CustomType.Parse(context, classOid, data); }));
            if (useCache)
                context.Cache.set(cacheKey, result, context.CacheTTL);
            return result;
        }

        return null;
    }

    public static async LoadAsync(context: Context, classOid: string, useCache: boolean = true): Promise<Array<CustomType>> {
        let cacheKey = `${classOid}`;
        if (useCache && context.Cache.get(cacheKey)) {
            await Metadata.CheckAsync(context, classOid);
            return <Array<CustomType>>context.Cache.get(cacheKey);
        }

        let result = <Array<CustomType>>(await context.FindAllAsync(`${context.StorageNoSQL}odata/CustomProperty/DataServiceControllers.GetEntityDataList?classOid=${classOid}&$top=1000`,
            classOid, (data: Array<any>) => { return CustomType.Parse(context, classOid, data); }));

        await Metadata.CheckAsync(context, classOid);            

        if (useCache)
            context.Cache.set(cacheKey, result, context.CacheTTL);
        return result;
    }

    public static Parse(context: Context, classOid: string, data: IDictionary): CustomType {
        let obj = new CustomType(context, classOid);
        obj.Parse(data);
        return obj;
    }

    public Parse(data: IDictionary) {
        super.Parse(data);
        this.oid = data["Oid"];
    }

    public async SaveAsync(context: Context, classRef?: string, instanceRef?: string): Promise<number | string> {

        let classOid = classRef || this.classOid;
        classOid = classOid.startsWith("ce_") ? classOid.substring(3) : classOid;
        let payload = {
            ClassOid: classOid,
            InstanceOid: instanceRef || this.Oid,
            Properties: JSON.stringify(this.fields),
            NotifyChanges: true
        }

        await context.PostAsync(`${context.StorageNoSQL}odata/CustomProperty/DataServiceControllers.AddEntityData`, payload, {});
        return this.Oid;
    }        

    public static async NewAsync(context: Context, classOid: string): Promise<CustomType> {
        await Metadata.CheckAsync(context, classOid);
        return new CustomType(context, classOid);
    }

    public static FromJSON(context: Context, classOid: string, json: any): CustomType {
        let newItem = new CustomType(context, classOid);
        newItem.Parse(json);
        return newItem;
    }

}