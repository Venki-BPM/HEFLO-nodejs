import { Context } from '../Context';
import { Metadata } from '../Metadata';
import { Account } from './Account';
import { IDictionary } from '../Types';

export class Group extends Account {
    public static ClassOid = "a5f4d23c-811f-45df-9a1b-2d2d62d5df99";
    public static ClassName = "Venki.Organization.Group";

    protected requireTakeResponsability: boolean | undefined;

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
    
    public static async FindGroupAsync(context: Context, id: number): Promise<Group> {
        return <Group>(await context.FindAsync(`${context.StorageRelational}odata/Group(${id})?$select=Oid,Name,Email,RequireTakeResponsability&$selectCustom=true`, 
            Group.ClassOid, (data: Array<any>) => { return Group.Parse(context, data); } ));
    }

    public static async WhereAsync(context: Context, filter: string, useCache: boolean = true): Promise<Array<Group>> {
        return <Array<Group>> await context.WhereAsync(Group.ClassOid, 
            `${context.StorageRelational}odata/Group?$select=Oid,Name,Email,RequireTakeResponsability&$filter=(${filter})&$selectCustom=true`, filter, 
            (data: Array<any>) => { return Group.Parse(context, data); }, useCache);
    }

    public static Parse(context: Context,data: Array<any>): Group {
        let obj = new Group(context);
        obj.Parse(data);
        return obj;
    }

    public Parse(data: IDictionary) {
        super.Parse(data);
        if (data) {
            this.requireTakeResponsability = data["RequireTakeResponsability"];
        }
    }

    /**
    * Save all pending changes of the group.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
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
    * Create a new instance of an Group and initialize all metadata to it.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @returns Object instance of a group
    */
    public static async NewAsync(context: Context): Promise<Group> {
        await Metadata.CheckAsync(context, Group.ClassOid);
        let group = new Group(context);
        group.isNew = true;
        return group;
    }
}
