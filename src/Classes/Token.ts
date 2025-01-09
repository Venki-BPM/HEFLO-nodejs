import { Context } from '../Context';
import { BaseModel } from '../BaseModel';
import { WorkItem } from './WorkItem';
import { Account } from './Account';
import { FlowElement } from './FlowElement';
import { IDictionary, TokenStatus } from '../Types';
import { Person } from './Person';
import { Group } from './Group';
import { Metadata } from './../Metadata';
import { PostAsync } from './../Helpers/Rest';

/**
* A Token is a concurrent component of a WorkItem. Typically, it is linked to the current task and associated with the user responsible for that task.
*/
export class Token extends BaseModel {
    public static ClassOid = "78e3a4c9-8885-415d-bba1-1970e4d1cf97";
    protected oid: number = 0;
    protected number: string = "";
    protected subject: string = "";
    protected startDate?: Date;
    protected endDate?: Date;
    protected responsibleOid?: number;
    protected currentFlowElementOid?: number;
    protected workItemOid?: number;
    protected workItem?: WorkItem;
    protected currentTokenExecution?: string;
    protected sourceType?: string;
    protected status?: TokenStatus;

    /**
     * Create a new instance of the type Token. This constructor is used by the library's code and should not be used by API users.
     * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
     */
    constructor (context: Context) {
        super(context);
        this.classOid = Token.ClassOid;
    }

    /**
    * Get the identifier of the object
    */
    protected GetKey(): string | number {
        return this.oid;
    }

    /**
    * Assign a reference to the process instance.
    */
    public set WorkItem(value: WorkItem | undefined) {
        this.workItem = value;
    }

    /**
    * Obtain a reference to the process instance.
    */
    public get WorkItem(): WorkItem | undefined {
        return this.workItem;
    }

    /**
    * Get the value of a custom field.
    * @param {string} fieldName - Name or alias of the field. (click the script icon in the edition dialog)
    * @returns - Current value of the custom field.
    */
    public Get(fieldName: string) {
        if (this.workItem)
            return this.workItem.Get(fieldName);
    }

    /**
    * Set the value of a custom field.
    * @param {string} fieldName - Name or alias of the field. (click the script icon in the edition dialog)
    * @param {any} value - Current value of the custom field.
    */
    public Set(fieldName: string, value: any) {
        if (this.workItem)
            this.workItem.Set(fieldName, value);
    }

    /**
    * Get the identifier of the token
    */
    public get Oid(): number {
        return this.oid;
    }

    /**
    * Get the Number of the token
    */
    public get Number(): string {
        return this.number;
    }

    /**
    * Get the subject of the token
    */
    public get Subject(): string {
        return this.subject;
    }

    /**
    * Set the identifier of the token
    * @param {string} value - The new content for the field Subject.
    */
    public set Subject(value: string) {
        this.subject = value;
        this.context.addChange(Token.ClassOid, "Subject", this.oid, value);
    }

    /**
    * Get the start date and time of the token
    */
    public get StartDate(): Date | undefined {
        return this.startDate;
    }

    /**
    * Get the end date and time of the token
    */
    public get EndDate(): Date | undefined {
        return this.endDate;
    }

    /**
    * Get the current task execution data of the token
    */
    public get CurrentTokenExecution(): string | undefined {
        return this.currentTokenExecution;
    }
    
    /**
    * Get the status of the work item.
    */
    public get Status(): TokenStatus | undefined {
        return this.status;
    }

    /**
    * Get type of Token
    */
    public get SourceType(): string | undefined {
        return this.sourceType;
    }

    /**
    * Load the object's content from JSON data.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {Array<any>} data - An array of key-value pairs (JSON data).
    * @returns Object instance initialized.
    */
    public static Parse(context: Context, data: Array<any>): Token {
        let obj = new Token(context);
        obj.Parse(data);        
        return obj;
    }

    /**
    * Populate the object's fields with data from the record.
    * @param {IDictionary} data - A dictionary holding the record's data.
    */
    public Parse(data: IDictionary) {
        super.Parse(data);
        if (data) {
            this.oid = data["Oid"];
            this.number = data["Number"];
            this.subject = data["Subject"];
            this.startDate = data["StartDate"];
            this.endDate = data["EndDate"];
            this.responsibleOid = data["ResponsibleOid"];
            this.currentFlowElementOid = data["CurrentElementOid"];
            this.workItemOid = data["WorkItemOid"];
            this.sourceType = data["SourceType"];
            if (data["Status"] === TokenStatus[TokenStatus.Draft])
                this.status = TokenStatus.Draft;
            else if (data["Status"] === TokenStatus[TokenStatus.Finished])
                this.status = TokenStatus.Finished;
            else if (data["Status"] === TokenStatus[TokenStatus.InCompensation])
                this.status = TokenStatus.InCompensation;
            else if (data["Status"] === TokenStatus[TokenStatus.InRollback])
                this.status = TokenStatus.InRollback;
            else if (data["Status"] === TokenStatus[TokenStatus.Interrupted])
                this.status = TokenStatus.Interrupted;
            else if (data["Status"] === TokenStatus[TokenStatus.Running])
                this.status = TokenStatus.Running;
            else if (data["Status"] === TokenStatus[TokenStatus.WaitingStart])
                this.status = TokenStatus.WaitingStart;
            else if (data["Status"] === TokenStatus[TokenStatus.WaitingSync])
                this.status = TokenStatus.WaitingSync;
        }
    }

    /**
    * Get the instance of the current user in charge of the token.
    */
    public async GetResponsibleAsync(context: Context): Promise<Account | undefined> {
        if (this.responsibleOid)
            return Account.FindAsync(context, this.responsibleOid);
        else
            return undefined;
    }

    /**
    * Get the instance of the flow element of the current task.
    */
    public async GetCurrentFlowElementAsync(context: Context): Promise<FlowElement | undefined> {
        if (this.currentFlowElementOid)
            return FlowElement.FindAsync(context, this.currentFlowElementOid);
        else
            return undefined;
    }

    /**
    * Calculate the participant.
    * @param {string} resourceName - Name of the participant.
    * @returns Promise to get the array of groups of people related with the participant definition.
    */
    public async CalcResourceAsync(resourceName: string): Promise<Array<Account>> {
        await Metadata.CheckAsync(this.context, Person.ClassOid);
        await Metadata.CheckAsync(this.context, Group.ClassOid);
        return <Array<Account>>(await this.context.FindAllAsync(`${this.GetStorageEndPoint(this.oid)}/DataServiceControllers.GetResourceCalculation?resourceName=${encodeURI(resourceName)}&$selectCustom=true`,
            Account.ClassOid, (data: Array<any>) => { 
                if (data["@odata.type"] === "#Venki.Organization.Person")
                    return Person.Parse(this.context, data);
                if (data["@odata.type"] === "#Venki.Organization.Group")
                    return Group.Parse(this.context, data);
                else 
                    return Account.Parse(this.context, data); 
        } ));
    }

    /**
    * Add a comment in the Conversation tab.
    * @param {string} message - Content of the comment.
    */
    public AddComment(message: string) {
        if (this.workItem)
            this.context.addComment(message, this.workItem, this);
    }
   
    /**
    * Find a token by an identifier
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {number} id - Identifier of the instance.
    * @returns Promise to get the object instance of a token.
    */
    public static async FindAsync(context: Context, id: number): Promise<Token> {
        return <Token>(await context.FindAsync(`${context.StorageRelational}odata/Token(${id})?$expand=WorkItem,Activities($orderby=StartDate%20desc)&$selectCustom=true`,
            Token.ClassOid, (data: Array<any>) => { 
                let token = Token.Parse(context, data); 
                token.WorkItem = new WorkItem(context); 
                token.WorkItem.Parse((<any>data)["WorkItem"]);
                if ((<any>data)["Activities"] && (<any>data)["Activities"].length)
                    token.currentTokenExecution = (<any>data)["Activities"][0]["Oid"];
                return token 
        } ));
    }

    /**
    * Get a list of all tokens of the same WorkItem.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {number} workItemOid - Identifier of the WorkItem.
    * @returns Promise to get a list of tokens.
    */
    public static async GetTokensAsync(context: Context, workItemOid: number): Promise<Array<Token>> {
        return <Array<Token>>(await context.FindAllAsync(`${context.StorageRelational}odata/Token?$expand=WorkItem,Activities($orderby=StartDate%20desc)&$filter=(WorkItemOid+eq+${workItemOid})&$selectCustom=true`,
            Token.ClassOid, (data: Array<any>) => {
                let token = Token.Parse(context, data);
                token.WorkItem = new WorkItem(context);
                token.WorkItem.Parse((<any>data)["WorkItem"]);
                if ((<any>data)["Activities"] && (<any>data)["Activities"].length)
                    token.currentTokenExecution = (<any>data)["Activities"][0]["Oid"];
                return token
            }));
    }

    protected GetStorageEndPoint(id?: number): string {
        if (id)
            return `${this.context.StorageRelational}odata/Token(${id}L)`;
        else 
            return `${this.context.StorageRelational}odata/Token`;
    }

    /**
    * Log an Error message. Users can view the message content by accessing the edit dialog in the task list interface. Click the three-dot icon at the top right (or left in RTL) and select 'Logs'.
    * @param {string} message - Content of the message.
    */
    public async LogErrorAsync(message: string, detailLink?: string) {
        let payload = {
            tokenOid: this.Oid,
            message: message,
            detailLink: detailLink
        }

        await PostAsync(this.context, `${this.context.StorageRelational}odata/Token/DataServiceControllers.LogError`, payload, this.context.CreateRequest("POST"));
    }

    /**
    * Log an Information message. Users can view the message content by accessing the edit dialog in the task list interface. Click the three-dot icon at the top right (or left in RTL) and select 'Logs'.
    * @param {string} message - Content of the message.
    */
    public async LogInformationAsync(message: string) {
        let payload = {
            tokenOid: this.oid,
            message: message,
            type: 0
        }

        await PostAsync(this.context, `${this.context.StorageRelational}odata/Token/DataServiceControllers.LogExecution`, payload, this.context.CreateRequest("POST"));
    }

    /**
    * Log an Warning message. Users can view the message content by accessing the edit dialog in the task list interface. Click the three-dot icon at the top right (or left in RTL) and select 'Logs'.
    * @param {string} message - Content of the message.
    */
    public async LogWarningAsync(message: string) {
        let payload = {
            tokenOid: this.oid,
            message: message,
            type: 2
        }

        await PostAsync(this.context, `${this.context.StorageRelational}odata/Token/DataServiceControllers.LogExecution`, payload, this.context.CreateRequest("POST"));
    }

    /**
    * Save all pending changes of the token.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @returns Identifier of the saved record.
    */
    public async SaveAsync(context: Context): Promise<number | string | undefined> {                
        let objectsToSave: Array<string> = [];

        if (this.sourceType !== "AdHocSubprocess")
            objectsToSave.push(`WorkItem(${this.workItemOid}L)`);
        objectsToSave.push(`Token(${this.oid}L)`);
        if (this.currentTokenExecution)
            objectsToSave.push(`TokenExecution(${this.currentTokenExecution})`);

        await context.PatchAsync(this.context.StorageRelational, this.classOid, this.GetKey(), objectsToSave);

        return this.oid;
    }


}