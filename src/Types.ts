export class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export interface IDictionary {
    [index: string]: any;
}

export interface IMetadataStore {
    [name: string]: Array<IDictionary>;
}

export enum TokenStatus {
    Running = 0,
    Finished = 1,
    InRollback = 2,
    Interrupted = 3,
    WaitingStart = 4,
    InCompensation = 5,
    WaitingSync = 6,
    Draft = 7
}

export enum Status {
    Opened = 0,
    Canceled = 1,
    Finished = 2,
    Suspended = 3,
    InCompensation = 4,
    Draft = 5
}