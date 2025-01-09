/**
* A GUID (Globally Unique Identifier) is a 128-bit value used to uniquely identify objects or entities across systems and platforms. It is designed to be unique across time and space, making it useful for generating identifiers in distributed systems or databases.
*/
export class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

/**
* A Dictionary represents a field and its corresponding value.
*/
export interface IDictionary {
    [index: string]: any;
}

/**
 * TokenStatus represents the current state of an object of type Token.
 */
export enum TokenStatus {
    /**
     * The token is currently in progress. Authorized users can edit and finish the current task.
     */
    Running = 0,
    /**
     * The token is closed. Authorized users can reopen.
     */
    Finished = 1,
    /**
     * The error procedure has started, and the rollback is currently in progress.
     */
    InRollback = 2,
    /**
     * Deprecated.
     */
    Interrupted = 3,
    /**
     * The token has been created but is waiting to start. This status typically occurs when an instance is created by the process engine, and its start is pending processing.
     */
    WaitingStart = 4,
    /**
     * The compensation procedure has started, and the rollback is currently in progress.
     */
    InCompensation = 5,
    /**
     * The token has reached a synchronization element, such as a parallel or inclusive gateway, and is waiting for other tokens to proceed with the flow.
     */
    WaitingSync = 6,
    /**
     * The token is currently in draft mode. This typically occurs when someone is entering data for a new request in the portal.
     */
    Draft = 7
}

/**
 * Status represents the current state of a business process instance, also referred to as a WorkItem.
 */
export enum Status {
    /**
     * The process instance is currently in progress. Authorized users can edit and finish the current task.
     */
    Opened = 0,
    /**
     * The process instance is canceled.
     */
    Canceled = 1,
    /**
     * The process instance is finished.
     */
    Finished = 2,
    /**
     * The process instance is suspended.
     */
    Suspended = 3,
    /**
     * The compensation procedure has started, and the rollback is currently in progress.
     */
    InCompensation = 4,
    /**
     * The token is currently in draft mode. This typically occurs when someone is entering data for a new request in the portal.
     */
    Draft = 5
}