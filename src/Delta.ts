
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

export interface Delta {
    RefreshArguments: boolean;
    Changes: Array<DeltaItem>;
    Comments: Array<WorkItemComment>;
}
