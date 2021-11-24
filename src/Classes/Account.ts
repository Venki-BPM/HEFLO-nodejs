import { Context } from '../Context';
import { BaseModel } from '../BaseModel';
import { Person } from './Person';
import { Metadata } from '../Metadata';
import { IDictionary } from '../Types';

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

    protected GetKey(): string | number {
        return this.oid;
    }

    public Set(fieldName: string, value: any) {
        this.LogChange(Account.ClassOid, fieldName, this.oid, value);
    }

    public get Oid(): number {
        return this.oid;
    }

    public get Name(): string {
        return this.name;
    }

    public set Name(value: string) {
        this.name = value;
        this.context.addChange(Account.ClassOid, "Name", this.oid, value);
    }

    public get Email(): string {
        return this.email;
    }

    public set Email(value: string) {
        this.email = value;
        this.context.addChange(Account.ClassOid, "Email", this.oid, value);
    }

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

    public static async NewAsync(context: Context): Promise<Account> {
        await Metadata.CheckAsync(context, Account.ClassOid);
        return new Account(context);
    }
}