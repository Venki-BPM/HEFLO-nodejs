import { BaseModel } from '../BaseModel';
import { IDictionary } from '../Types';

/**
* A Property represents the metadata of a field, whether native or custom.
*/
export class Property extends BaseModel {
    name: string = "";
    listEntityName: string = ""; 
    customAlias: string = "";

    /**
    * Get the name of the property.
    */
    public get Name(): string {
        return this.name;
    }

    /**
    * Get the name of the custom alias of the property.
    */
    public get CustomAlias(): string {
        return this.customAlias;
    }

    /**
    * Get the name of the list entity of a record list.
    */
    public get ListEntityName(): string {
        return this.listEntityName;
    }

    /**
    * Populate the object's fields with data from the record.
    * @param {IDictionary} data - A dictionary holding the record's data.
    */
    public Parse(data: IDictionary) {
        super.Parse(data);
        if (data) {
            this.name = data["Name"];
            this.listEntityName = data["ListEntityName"];
            this.customAlias = data["CustomAlias"];
        }
    }
}