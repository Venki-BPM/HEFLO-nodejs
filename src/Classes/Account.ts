import { Context } from '../Context';
import { BaseModel } from '../BaseModel';
import { Person } from './Person';
import { Metadata } from '../Metadata';
import { IDictionary } from '../Types';

/**
* An account is an abstraction to other types such as Person and Group
*/
export class Account extends BaseModel {
    public static ClassOid = "78f6400a-40c3-4d46-b2fb-45e087ffc21e";
    public static ClassName = "Venki.Services.Account";

    protected oid: number = 0;
    protected name: string = "";
    protected email: string = "";

    constructor(context: Context) {
        super(context);
        this.classOid = Account.ClassOid;
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
        this.LogChange(Account.ClassOid, fieldName, this.oid, value);
    }

    /**
    * Get the identifier of the account (person or group)
    */
    public get Oid(): number {
        return this.oid;
    }

    /**
    * Get the name of the account (person or group)
    */
    public get Name(): string {
        return this.name;
    }

    /**
    * Set the identifier of the account (person or group)
    */
    public set Name(value: string) {
        this.name = value;
        this.context.addChange(Account.ClassOid, "Name", this.oid, value);
    }

    /**
    * Get the email of the account (person or group)
    */
    public get Email(): string {
        return this.email;
    }

    /**
    * Set the email of the account (person or group)
    */
    public set Email(value: string) {
        this.email = value;
        this.context.addChange(Account.ClassOid, "Email", this.oid, value);
    }

    /**
    * Find a account (person or group) by an identifier
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {number} id - Identifier of the instance.
    * @returns Object instance of a person or group.
    */
    public static async FindAsync(context: Context, id: number): Promise<Person> {
        return <Person>(await context.FindAsync(`${context.StorageRelational}odata/Account(${id})?$select=Oid,Name,Email&$selectCustom=true`,
            Account.ClassOid, (data: Array<any>) => { return Account.Parse(context, data); }));
    }

    public static Parse(context: Context, data: Array<any>): Account {
        let obj = new Account(context);
        obj.Parse(data);
        return obj;
    }

    public Parse(data: IDictionary) {
        super.Parse(data);
        if (data) {
            this.oid = data["Oid"];
            this.name = data["Name"];
            this.email = data["Email"];
        }
    }

    /**
    * Create a new instance of an Account and initialize all metadata to it.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @returns Object instance of a person or group.
    */
    public static async NewAsync(context: Context): Promise<Account> {
        await Metadata.CheckAsync(context, Account.ClassOid);
        return new Account(context);
    }
}