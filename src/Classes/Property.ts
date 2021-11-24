import { BaseModel } from '../BaseModel';
import { IDictionary } from '../Types';

export class Property extends BaseModel {
    name: string = "";
    listEntityName: string = ""; 
    customAlias: string = "";

    public get Name(): string {
        return this.name;
    }

    public set Name(value: string) {
        this.name = value;
    }

    public get CustomAlias(): string {
        return this.customAlias;
    }

    public set CustomAlias(value: string) {
        this.customAlias = value;
    }

    public get ListEntityName(): string {
        return this.listEntityName;
    }

    public set ListEntityName(value: string) {
        this.listEntityName = value;
    }

    public Parse(data: IDictionary) {
        super.Parse(data);
        if (data) {
            this.name = data["Name"];
            this.listEntityName = data["ListEntityName"];
            this.customAlias = data["CustomAlias"];
        }
    }
}