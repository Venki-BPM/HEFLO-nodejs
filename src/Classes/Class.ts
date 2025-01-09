import { Context } from '../Context';
import { BaseModel } from '../BaseModel';
import { Property } from './Property';
import { IDictionary } from '../Types';

/**
* Metadata for a native or custom type. Native types may include examples such as Person, WorkItem, and Token. Custom types, on the other hand, are those defined by an automation implementor.
*/
export class Class extends BaseModel {
    public static ClassOid = "a1eeff79-7db0-4975-8806-d905311f1415";

    name: string = "";
    properties: Array<Property> = [];

    /**
    * Get the name of the type.
    */
    public get Name(): string {
        return this.name;
    }

    /**
    * Set the name of the type.
    */
    public set Name(value: string) {
        this.name = value;
    }

    /**
    * Get all the properties of the type.
    */
    public get Properties(): Array<Property> {
        return this.properties;
    }

    /**
    * Set the context of the request.
    */
    public set Context(context: Context) {
        this.context = context;
    }

    /**
    * Set the content of the properties.
    */
    public set Properties(value: Array<Property>) {
        this.properties = value;
    }

    /**
    * Create an object of type Class using the context provided as a parameter. This constructor is used by the library's code and should not be used by API users.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @returns Object instance of a Class.
    */
    constructor (context: Context) {
        super(context);
        this.classOid = Class.ClassOid;
    }

    /**
    * Load the object's content from JSON data.
    * @param {Context} context - Context information of the call. In most of the cases you can build the context using the request object.
    * @param {Array<any>} data - An array of key-value pairs (JSON data).
    * @returns Object instance initialized.
    */
    public static Parse(context: Context, data: Array<any>): Class {
        let obj = new Class(context);
        obj.Parse(data);
        return obj;
    }

    /**
    * Populate the object's fields with data from the record.
    * @param {IDictionary} data - A dictionary holding the record's data.
    */
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