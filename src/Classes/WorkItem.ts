import axios from 'axios';
import { Context } from '../Context';
import { CustomType, BaseModel } from '../BaseModel';
import { Metadata } from '../Metadata';
import { Process } from './Process';
import { Person } from './Person';
import { Token } from './Token';
import { Guid, IDictionary, Status } from '../Types';

export class WorkItem extends BaseModel {
    public static ClassOid = "7a767398-3c6e-4d81-8c04-369600dcb4a7";
    public static ClassName = "Venki.Process.WorkItem";

    protected oid: number = 0;
    protected number: string = "";
    protected startDate?: Date;
    protected endDate?: Date; 
    protected processOid: number = 0;
    protected requesterOid?: number;
    protected code?: string;
    protected status?: Status;

    constructor (context: Context) {
        super(context);
        this.classOid = WorkItem.ClassOid;
    }

    protected GetKey(): string | number {
        return this.oid;
    }

    public Set(fieldName: string, value: any) {
        this.LogChange(WorkItem.ClassOid, fieldName, this.oid, value);
    }

    public get Oid(): number {
        return this.oid;
    }

    public get Number(): string {
        return this.number;
    }

    public get StartDate(): Date | undefined {
        return this.startDate;
    }

    public get EndDate(): Date | undefined {
        return this.endDate;
    }

    public get ProcessOid(): number {
        return this.processOid;
    }

    public get RequesterOid(): number | undefined {
        return this.requesterOid;
    }

    public set RequesterOid(value: number | undefined) {
        this.requesterOid = value;
        this.context.addChange(WorkItem.ClassOid, "RequestorOid", this.oid, value);
    }

    public get Code(): string | undefined {
        return this.code;
    }

    public set Code(value: string | undefined) {
        this.code = value;
        this.context.addChange(WorkItem.ClassOid, "Code", this.oid, value);
    }

    public get Status(): Status | undefined {
        return this.status;
    }

    public async GetProcessAsync(context: Context): Promise<Process> {
        return Process.FindAsync(context, this.processOid);
    }

    public async GetRequesterAsync(context: Context): Promise<Person | undefined> {
        if (this.requesterOid)
            return Person.FindAsync(context, this.requesterOid);
        else
            return undefined;
    }

    public static Parse(context: Context, data: Array<any>): WorkItem {
        let obj = new WorkItem(context);
        obj.Parse(data);
        return obj;
    }

    public Parse(data: IDictionary) {
        super.Parse(data);
        if (data) {
            this.oid = data["Oid"];
            this.number = data["Number"];
            this.startDate = data["StartDate"];
            this.endDate = data["EndDate"];
            this.processOid = data["ProcessOid"];
            this.requesterOid = data["RequestorOid"];
            this.code = data["Code"];
            if (data["Status"] === Status[Status.Opened])
                this.status = Status.Opened;
            else if (data["Status"] === Status[Status.Canceled])
                this.status = Status.Canceled;
            else if (data["Status"] === Status[Status.Draft])
                this.status = Status.Draft;
            else if (data["Status"] === Status[Status.Finished])
                this.status = Status.Finished;
            else if (data["Status"] === Status[Status.InCompensation])
                this.status = Status.InCompensation;
            else if (data["Status"] === Status[Status.Suspended])
                this.status = Status.Suspended;
        }
    }

    public static async FindAsync(context: Context, id: number): Promise<WorkItem> {
        return <WorkItem>(await context.FindAsync(`${context.StorageRelational}odata/WorkItem(${id})?$selectCustom=true`,
            WorkItem.ClassOid, (data: Array<any>) => { return WorkItem.Parse(context, data); } ));
    }

    public static async FindByCodeAsync(context: Context, processCode: string, instanceCode: string): Promise<Array<WorkItem>> {
        console.warn("WARNING: function FindByCodeAsync is deprecated. Consider change this call to the new function FindByFieldAsync.");
        return <Array<WorkItem>>(await context.FindAllAsync(`${context.StorageRelational}odata/WorkItem/DataServiceControllers.FindByCode?processCode=%27${processCode}%27&instanceCode=%27${instanceCode}%27&$selectCustom=true`,
            WorkItem.ClassOid, (data: Array<any>) => { return WorkItem.Parse(context, data); } ));
    }

    public static async FindByFieldAsync(context: Context, processCode: string, field: string, searchValue: string): Promise<Array<WorkItem>> {
        let filter = `$filter=(((Process/UniqueCode+eq+%27${processCode}%27)))&$filterCustom=(((contains(${field},%27${searchValue}%27))))`;
        return <Array<WorkItem>>(await context.FindAllAsync(`${context.StorageRelational}odata/WorkItem?${filter}&$selectCustom=true`,
            WorkItem.ClassOid, (data: Array<any>) => { return WorkItem.Parse(context, data); } ));
    }

    protected GetStorageEndPoint(id?: number): string {
        if (id)
            return `${this.context.StorageRelational}odata/WorkItem(${id}L)`;
        else 
            return `${this.context.StorageRelational}odata/WorkItem`;
    } 

    public async SaveAsync(context: Context): Promise<number | string | undefined> {

        let tokens = await Token.GetTokensAsync(context, this.oid);
        
        for(let i=0; i<tokens.length; i++) {
            let token = tokens[i];
            await context.PatchAsync(this.context.StorageRelational, this.classOid, this.GetKey(), [`WorkItem(${this.oid}L)`, `Token(${token.Oid}L)`, `TokenExecution(${token.CurrentTokenExecution})`]);
        };
        
        return this.oid;
    }

    public static TokenExecutionClassOid: string  = "d5a12beb-a524-4b3c-a543-8194e37d9d88";

    public async SaveRecordListAsync(context: Context, fieldName: string) {
        await super.SaveRecordListAsync(context, fieldName);

        let actualName = Metadata.GetPropertyName(this.context, this.classOid, fieldName);
        if (actualName && this.lists[actualName]) {
            let oids: Array<string> = (<Array<CustomType>>this.lists[actualName]).map(item => item.Oid);
            let tokens = await Token.GetTokensAsync(context, this.oid);
            for(let i=0; i<tokens.length; i++) {
                let token = tokens[i];
                if (oids.length) {

                    let list: Array<CustomType> = this.lists[<string>actualName];
                    let i = 0;
                    for(i=0; i<list.length; i++) {
                        //await list[i].SaveAsync(context, Token.ClassOid, token.Oid.toString());
                    }

                    let props: any = {};
                    props[<string>actualName] = oids.join(',');
                    let payload = {
                        ClassOid: Token.ClassOid,
                        InstanceOid: token.Oid.toString(),
                        Properties: JSON.stringify(props)
                    }
                    await axios.post(`${context.StorageNoSQL}odata/CustomProperty/DataServiceControllers.AddOrReplaceCustomProperty`, payload, context.CreateRequest("POST"));

                    if (token.CurrentTokenExecution) {

                        let i = 0;
                        for(i=0; i<list.length; i++) {
                            //await list[i].SaveAsync(context, WorkItem.TokenExecutionClassOid, token.CurrentTokenExecution);
                        }

                        payload = {
                            ClassOid: WorkItem.TokenExecutionClassOid,
                            InstanceOid: token.CurrentTokenExecution.toString(),
                            Properties: JSON.stringify(props)
                        }
                        await axios.post(`${context.StorageNoSQL}odata/CustomProperty/DataServiceControllers.AddOrReplaceCustomProperty`, payload, context.CreateRequest("POST"));
                    }
                };
            };
        }
    }

    public async LogErrorAsync(message: string, detailLink?: string) {
        let payload = {
            workItemOid: this.oid,
            message: message,
            detailLink: detailLink
        }

        await axios.post(`${this.context.StorageRelational}odata/WorkItem/DataServiceControllers.LogError`, payload, this.context.CreateRequest("POST"));
    }

    public async LogInformationAsync(message: string) {
        let payload = {
            workItemOid: this.oid,
            message: message,
            type: 0
        }

        await axios.post(`${this.context.StorageRelational}odata/WorkItem/DataServiceControllers.LogExecution`, payload, this.context.CreateRequest("POST"));
    }

    public async LogWarningAsync(message: string) {
        let payload = {
            workItemOid: this.oid,
            message: message,
            type: 2
        }

        await axios.post(`${this.context.StorageRelational}odata/WorkItem/DataServiceControllers.LogExecution`, payload, this.context.CreateRequest("POST"));
    }

    public AddComment(message: string) {
        this.context.addComment(message, this, undefined);
    }

}