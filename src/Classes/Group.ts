import { Context } from '../Context';
import { Metadata } from '../Metadata';
import { Account } from './Account';
import { IDictionary } from '../Types';

/**
* A Group is a collection of individuals, often used in defining participants. It also has unique features in the Workspace interface, including an inbox for process instances.
*/
export class Group extends Account {
    public static ClassOid = "a5f4d23c-811f-45df-9a1b-2d2d62d5df99";
    public static ClassName = "Venki.Organization.Group";

    protected requireTakeResponsability: boolean | undefined;

    /**
     * Create a new instance of the type Group. In case of a new record use the method NewAsync instead of this constructor.
     * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
     */
    constructor (context: Context) {
        super(context);
        this.classOid = Group.ClassOid;
    }

    /**
    * Set the value of a custom field.
    * @param {string} fieldName - Name or alias of the field. (click the script icon in the edition dialog)
    * @param {any} value - Current value of the custom field.
    */
    public Set(fieldName: string, value: any) {
        this.LogChange(Group.ClassOid, fieldName, this.oid, value);
    }

    public get RequireTakeResponsability(): boolean {
        return this.requireTakeResponsability;
    }

    public set RequireTakeResponsability(value: boolean | undefined) {
        this.requireTakeResponsability = value;
        this.context.addChange(Group.ClassOid, "RequireTakeResponsability", this.oid, value);
    }
    
    /**
    * Find a group by an identifier
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {number} id - Identifier of the instance.
    * @returns Promise to get the object instance of a group.
    */
    public static async FindGroupAsync(context: Context, id: number): Promise<Group> {
        return <Group>(await context.FindAsync(`${context.StorageRelational}odata/Group(${id})?$select=Oid,Name,Email,RequireTakeResponsability&$selectCustom=true`, 
            Group.ClassOid, (data: Array<any>) => { return Group.Parse(context, data); } ));
    }

    /**
    * Search for objects using filter criteria. To create the filter, use a condition that follows the OData filter syntax and includes the available fields fields in the environment.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {string} filter - A filter expression following the OData filter syntax.
    * @param {boolean} useCache - It stores the content in a local cache for later reuse. The cache lifespan is approximately 600 seconds.
    * @returns Promise to get the a list of objects retrieved from the backend based on the search criteria. Note: the retrieval is limited to a maximum of 1,000 records.
    */
    public static async WhereAsync(context: Context, filter: string, useCache: boolean = true): Promise<Array<Group>> {
        return <Array<Group>> await context.WhereAsync(Group.ClassOid, 
            `${context.StorageRelational}odata/Group?$select=Oid,Name,Email,RequireTakeResponsability&$filter=(${filter})&$selectCustom=true`, filter, 
            (data: Array<any>) => { return Group.Parse(context, data); }, useCache);
    }

    /**
    * Load the object's content from JSON data.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {Array<any>} data - An array of key-value pairs (JSON data).
    * @returns Object instance initialized.
    */
    public static Parse(context: Context,data: Array<any>): Group {
        let obj = new Group(context);
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
            this.requireTakeResponsability = data["RequireTakeResponsability"];
        }
    }

    /**
    * Save all pending changes of the group.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @returns Identifier of the saved record.
    */
    public async SaveAsync(context: Context): Promise<number> {

        if (this.isNew) {
            let payload = {
                Oid: this.Oid,
                Name: this.Name,
                Email: this.Email,
                RequireTakeResponsability: this.RequireTakeResponsability,
                RecordKind: "Group",
            }

            this.Parse(await context.PostAsync(this.GetStorageEndPoint(), payload, this.fields));
        } else {
            await context.PatchAsync(this.context.StorageRelational, this.classOid, this.GetKey(), [`Group(${this.oid})`]);
        }

        return this.Oid;
    }

    protected GetStorageEndPoint(id?: number): string {
        if (id)
            return `${this.context.StorageRelational}odata/Group(${this.oid})`;
        else
            return `${this.context.StorageRelational}odata/Group`;
    } 

    /**
    * Create a new instance of an Group and initialize all fields.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @returns Promise to get the new object instance of a group.
    */
    public static async NewAsync(context: Context): Promise<Group> {
        await Metadata.CheckAsync(context, Group.ClassOid);
        let group = new Group(context);
        group.isNew = true;
        return group;
    }
}
