import { Context } from '../Context';
import { BaseModel } from '../BaseModel';
import { Property } from './Property';
import { IDictionary } from '../Types';

export class Class extends BaseModel {
    public static ClassOid = "a1eeff79-7db0-4975-8806-d905311f1415";

    name: string = "";
    properties: Array<Property> = [];

    public get Name(): string {
        return this.name;
    }

    public set Name(value: string) {
        this.name = value;
    }

    public get Properties(): Array<Property> {
        return this.properties;
    }

    public set Context(context: Context) {
        this.context = context;
    }

    public set Properties(value: Array<Property>) {
        this.properties = value;
    }

    constructor (context: Context) {
        super(context);
        this.classOid = Class.ClassOid;
    }

    public static Parse(context: Context, data: Array<any>): Class {
        let obj = new Class(context);
        obj.Parse(data);
        return obj;
    }

    public Parse(data: IDictionary) {
        super.Parse(data);
        this.name = data["Name"];
        this.properties = [];

        let properties: Array<Property> = data["Properties"];
        if (properties && properties.length) {
            properties.forEach(element => {
                let prop = new Property(this.context);
                prop.Parse(element);
                this.properties.push(prop);
            });
        }
    }        
}