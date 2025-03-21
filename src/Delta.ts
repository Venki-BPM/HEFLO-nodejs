export interface DeltaMessageOptions {
    isAlert?: boolean;
    title?: string;
    contentIsHtml?: boolean;
}

export interface DeltaMessageDialogOptions {
    title?: string;
}

export enum DeltaMessageEnum {
    Information,
    Warning,
    Error,
    Success,
}

export interface DeltaMessage {
    Type: DeltaMessageEnum;
    Content: string;
    Options: DeltaMessageOptions;
}

export interface Delta {
    RefreshArguments: boolean;
    Changes: Array<DeltaItem>;
    Comments: Array<WorkItemComment>;
    Messages: Array<DeltaMessage>;
    Options: GetModifiedDataOptions;
}

export interface DeltaItem {
    Id: string;
    ClassName: string;
    PropertyName: string;
    Key: string | number;
    Value?: Object;
    RecordValue?: string;
}

export interface WorkItemComment {
    Message: string;
    WorkItemOid: number;
    TokenOid?: number;
}

export interface GetModifiedDataOptions {
    refresh: boolean;
}
