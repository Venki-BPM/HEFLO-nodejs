import { Context } from '../Context';
import { CustomType, BaseModel } from '../BaseModel';
import { Metadata } from '../Metadata';
import { Process } from './Process';
import { Person } from './Person';
import { Token } from './Token';
import { Guid, IDictionary, Status } from '../Types';
import { PostAsync, GetAsync } from './../Helpers/Rest';

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

    /**
    * Get the identifier of the object
    */
    protected GetKey(): string | number {
        return this.oid;
    }

    /**
    * Set the value of a custom field.
    * @param {string} fieldName - Name or alias of the field. (click the script icon in the edition dialog)
    * @param {any} value - Current value of the custom field.
    */
    public Set(fieldName: string, value: any) {
        this.LogChange(WorkItem.ClassOid, fieldName, this.oid, value);
    }

    /**
    * Get the identifier of the work item
    */
    public get Oid(): number {
        return this.oid;
    }

    /**
    * Get the number of the work item
    */
    public get Number(): string {
        return this.number;
    }

    /**
    * Get the start date and time of the work item
    */
    public get StartDate(): Date | undefined {
        return this.startDate;
    }

    /**
    * Get the end date and time of the finished or canceled work item
    */
    public get EndDate(): Date | undefined {
        return this.endDate;
    }

    /**
    * Get the identifier of the process
    */
    public get ProcessOid(): number {
        return this.processOid;
    }

    /**
    * Get the identifier of the requester
    */
    public get RequesterOid(): number | undefined {
        return this.requesterOid;
    }

    /**
    * Set the identifier of the requester
    */
    public set RequesterOid(value: number | undefined) {
        this.requesterOid = value;
        this.context.addChange(WorkItem.ClassOid, "RequestorOid", this.oid, value);
    }

    /**
    * @deprecated Get the code of the requester
    */
    public get Code(): string | undefined {
        return this.code;
    }

    /**
    * @deprecated Set the code of the requester
    */
    public set Code(value: string | undefined) {
        this.code = value;
        this.context.addChange(WorkItem.ClassOid, "Code", this.oid, value);
    }

    /**
    * Get the status of the work item.
    */
    public get Status(): Status | undefined {
        return this.status;
    }

    /**
    * Get the Process of the work item.
    */
    public async GetProcessAsync(context: Context): Promise<Process> {
        return Process.FindAsync(context, this.processOid);
    }

    /**
    * Get the Requester of the work item.
    */
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

    /**
    * Find a work item by an identifier
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {number} id - Identifier of the instance.
    * @returns Object instance of the work item.
    */
    public static async FindAsync(context: Context, id: number): Promise<WorkItem> {
        return <WorkItem>(await context.FindAsync(`${context.StorageRelational}odata/WorkItem(${id})?$selectCustom=true`,
            WorkItem.ClassOid, (data: Array<any>) => { return WorkItem.Parse(context, data); } ));
    }

    /**
    * @deprecated Find a work item by a native code.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {string} processCode - Unique code of the process. (click the script icon above the field Name inside the process editor and tab Properties)
    * @param {string} instanceCode - Code of the instance.
    * @returns Array of work items that meet the criteria.
    */
    public static async FindByCodeAsync(context: Context, processCode: string, instanceCode: string): Promise<Array<WorkItem>> {
        console.warn("WARNING: function FindByCodeAsync is deprecated. Consider change this call to the new function FindByFieldAsync.");
        return <Array<WorkItem>>(await context.FindAllAsync(`${context.StorageRelational}odata/WorkItem/DataServiceControllers.FindByCode?processCode=%27${processCode}%27&instanceCode=%27${instanceCode}%27&$selectCustom=true`,
            WorkItem.ClassOid, (data: Array<any>) => { return WorkItem.Parse(context, data); } ));
    }

    /**
    * Find all work items based on a specific process and a search text on a custom field
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {string} processCode - Unique code of the process. (click the script icon above the field Name inside the process editor and tab Properties)
    * @param {string} field - Name or alias of the field. (click the script icon in the edition dialog)
    * @param {string} searchValue - Text criteria to find the instances.
    * @returns Array of work items that meet the criteria.
    */
    public static async FindByFieldAsync(context: Context, processCode: string, field: string, searchValue: string): Promise<Array<WorkItem>> {
        let actualName = Metadata.GetPropertyName(context, WorkItem.ClassOid, field);
        let filter = `$filter=(((Process/UniqueCode+eq+%27${processCode}%27)))&$filterCustom=(((eq(${actualName},%27${searchValue}%27))))`;
        return <Array<WorkItem>>(await context.FindAllAsync(`${context.StorageRelational}odata/WorkItem?${filter}&$selectCustom=true`,
            WorkItem.ClassOid, (data: Array<any>) => { return WorkItem.Parse(context, data); } ));
    }

    protected GetStorageEndPoint(id?: number): string {
        if (id)
            return `${this.context.StorageRelational}odata/WorkItem(${id}L)`;
        else 
            return `${this.context.StorageRelational}odata/WorkItem`;
    } 

    /**
    * Save all pending changes of the work item.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    */
    public async SaveAsync(context: Context): Promise<number | string | undefined> {

        let tokens = await Token.GetTokensAsync(context, this.oid);
        
        for(let i=0; i<tokens.length; i++) {
            let token = tokens[i];
            if (token.SourceType === "AdHocSubprocess")
                await context.PatchAsync(this.context.StorageRelational, this.classOid, this.GetKey(), [`Token(${token.Oid}L)`, `TokenExecution(${token.CurrentTokenExecution})`]);
            else
                await context.PatchAsync(this.context.StorageRelational, this.classOid, this.GetKey(), [`WorkItem(${this.oid}L)`, `Token(${token.Oid}L)`, `TokenExecution(${token.CurrentTokenExecution})`]);
        };
        
        return this.oid;
    }

    public static TokenExecutionClassOid: string  = "d5a12beb-a524-4b3c-a543-8194e37d9d88";

    /**
    * Save all pending changes of a record list.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {string} fieldName - Name or alias of the record list. (click the script icon in the edition dialog)
    */
    public async SaveRecordListAsync(context: Context, fieldName: string) {
        await super.SaveRecordListAsync(context, fieldName);

        let actualName = Metadata.GetPropertyName(this.context, this.classOid, fieldName);
        if (actualName && this.lists[actualName]) {
            let oids: Array<string> = (<Array<CustomType>>this.lists[actualName]).map(item => item.Oid);
            let tokens = await Token.GetTokensAsync(context, this.oid);
            for(let i=0; i<tokens.length; i++) {
                let token = tokens[i];
                if (oids.length) {
                    let props: any = {};
                    props[<string>actualName] = oids.join(',');
                    let payload = {
                        ClassOid: Token.ClassOid,
                        InstanceOid: token.Oid.toString(),
                        Properties: JSON.stringify(props),
                        NotifyChanges: true
                    }
                    await PostAsync(context, `${context.StorageNoSQL}odata/CustomProperty/DataServiceControllers.AddOrReplaceCustomProperty`, payload, context.CreateRequest("POST"));

                    if (token.CurrentTokenExecution) {

                        payload = {
                            ClassOid: WorkItem.TokenExecutionClassOid,
                            InstanceOid: token.CurrentTokenExecution.toString(),
                            Properties: JSON.stringify(props),
                            NotifyChanges: false
                        }
                        await PostAsync(context, `${context.StorageNoSQL}odata/CustomProperty/DataServiceControllers.AddOrReplaceCustomProperty`, payload, context.CreateRequest("POST"));
                    }
                };
            };
        }
    }

    /**
    * Write a log of type Error you can list inside the process editor. (click the button 'Log and Execution data' at the right side in the Actions tab)
    * @param {string} message - Error message.
    * @param {string} detailLink - Link to show more details on the error.
    */
    public async LogErrorAsync(message: string, detailLink?: string) {
        let payload = {
            workItemOid: this.oid,
            message: message,
            detailLink: detailLink
        }

        await PostAsync(this.context, `${this.context.StorageRelational}odata/WorkItem/DataServiceControllers.LogError`, payload, this.context.CreateRequest("POST"));
    }

    /**
    * Write a log of type Information you can list inside the process editor. (click the button 'Log and Execution data' at the right side in the Actions tab)
    * @param {string} message - Information message.
    */
    public async LogInformationAsync(message: string) {
        let payload = {
            workItemOid: this.oid,
            message: message,
            type: 0
        }

        await PostAsync(this.context, `${this.context.StorageRelational}odata/WorkItem/DataServiceControllers.LogExecution`, payload, this.context.CreateRequest("POST"));
    }

    /**
    * Write a log of type Warning you can list inside the process editor. (click the button 'Log and Execution data' at the right side in the Actions tab)
    * @param {string} message - Warning message.
    */
    public async LogWarningAsync(message: string) {
        let payload = {
            workItemOid: this.oid,
            message: message,
            type: 2
        }

        await PostAsync(this.context, `${this.context.StorageRelational}odata/WorkItem/DataServiceControllers.LogExecution`, payload, this.context.CreateRequest("POST"));
    }

    /**
    * Evaluate a Business Rule on a specific work item.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {number} oid - Identifier of thw work item.
    * @param {string} br - Unique code of Business Rule. (check the network of Developer Tools)
    */
    public static async EvaluateBRAsync(context: Context, oid: number, br: string) {
        var result = await GetAsync(context, `${context.StorageRelational}odata/WorkItem(${oid}L)/DataServiceControllers.EvaluateBR?brOid=${br}`, context.CreateRequest("GET"));
        return result.data.value;
    }

    /**
    * Cancel all taks and tokens and restart the instance from the same start event.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {number} oid - Identifier of thw work item.
    */
    public static async RestartAsync(context: Context, oid: number) {
        await PostAsync(context, `${context.StorageRelational}odata/WorkItem(${oid}L)/DataServiceControllers.Restart`, {}, context.CreateRequest("POST"));
    }

    /**
    * Force the execution of a boundary event on a work item
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {number} oid - Identifier of thw work item.
    * @param {string} code - Unique code of the boundary event. (click the script icon above the field Text inside the process editor and tab Properties)
    */
    public static async ForceBoundaryAsync(context: Context, oid: number, code: string) {
        let payload = {
            code: code
        }
        await PostAsync(context, `${context.StorageRelational}odata/WorkItem(${oid}L)/DataServiceControllers.ForceBoundary`, payload, context.CreateRequest("POST"));
    }

    /**
    * Add a comment in the Conversation tab.
    * @param {string} message - Content of the comment.
    */
    public AddComment(message: string) {
        this.context.addComment(message, this, undefined);
    }

}