import * as NodeCache from 'node-cache';
import { AxiosRequestConfig, Method } from 'axios';
import { Delta, DeltaItem, GetModifiedDataOptions, WorkItemComment } from './Delta';
import { Metadata } from './Metadata';
import { BaseModel } from './BaseModel';
import { WorkItem } from './Classes/WorkItem';
import { Token } from './Classes/Token';
import { Class } from './Classes/Class';
import { Guid, IDictionary } from './Types';
import { PostAsync, GetAsync } from './Helpers/Rest';

export class Context {
    constructor(request: any) {
        this.changes = [];
        this.comments = [];
        if (request) {
            this.authorizationHeader = request.body["Bearer"];
            this.domain = request.body["Domain"];
            this.cacheTTL = request.body["CacheTTL"] || 600;
            this.isTest = request.body["IsTest"];
            this.storageRelational = request.body["StorageRelational"];
            this.cacheRelational = request.body["CacheRelational"];
            this.storageNoSQL = request.body["StorageNoSQL"];
            this.cacheNoSQL = request.body["CacheNoSQL"];
            this.region = request.body["Region"];
            this.stage = request.body["Stage"];
        } else {
            this.authorizationHeader = "";
            this.domain = "";
            this.cacheTTL = 600;
            this.isTest = false;
            this.storageRelational = "";
            this.cacheRelational = "";
            this.storageNoSQL = "";
            this.cacheNoSQL = "";
            this.region = "";
            this.stage = "prod";
        }
    }

    /**
    * Generates an access token to access all functions of the API.
    * @param {string} environment - The environment identifier. It can be obtained from the Manage Environments page.
    * @param {string} apiKey - API key. It can be obtained from the Web Services panel inside the process editor.
    * @param {string} secretKey - Secret of the API key. It can be obtained from the Web Services panel inside the process editor.
    */
    public static async BuildContextAsync(environment: string, apiKey: string, secretKey: string): Promise<Context> {
        let context = new Context(null);
        context.storageNoSQL = process.env.AUTH_ENDPOINT || "https://auth.heflo.com/";
        context.cacheNoSQL = context.storageNoSQL;
        const result = await Context.GetToken(context, environment, apiKey, secretKey);
        context.storageRelational = result.data.appEndpoint;
        context.cacheRelational = context.storageRelational;
        context.authorizationHeader = result.data.access_token;
        context.isTest = false;
        context.cacheTTL = 600;
        context.domain = environment;
        context.apiKey = apiKey;
        context.secretKey = secretKey;
        context.environment = environment;
        context.region = result.data.appRegion;
        context.stage = result.data.appStage || "prod";
        return context;
    }

    private static async GetToken(context, environment: string, apiKey: string, secretKey: string) {
        const storageNoSQL = process.env.AUTH_ENDPOINT || "https://auth.heflo.com/"
        const endpoint = `${storageNoSQL}token`;
        let config: AxiosRequestConfig = {
          url: endpoint,
          method: "POST",
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}&scope=${environment}`
        }
        return await PostAsync(context, endpoint, `grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}&scope=${environment}`, config);
    }

    /**
    * Renew the access token based on the environment, API key, and secret key provided for the static method {@link BuildContextAsync}
    */
    public async Refresh() {
        if (this.authorizationHeader) {
            const result = await Context.GetToken(this, this.environment, this.apiKey, this.secretKey);
            this.authorizationHeader = result.data.access_token;
            if (process.env.DEBUG) console.log(`Access token renewed for the clientId ${this.apiKey}`);
        }
    }

    private changes: Array<DeltaItem>;
    private comments: Array<WorkItemComment>;
    private authorizationHeader: string;
    private domain: string;
    private cacheTTL: number;
    private isTest: boolean;

    private storageRelational: string;
    private cacheRelational: string;
    private storageNoSQL: string;
    private cacheNoSQL: string;
    private cache: NodeCache = new NodeCache( { useClones: false, deleteOnExpire: true, stdTTL: 600 } );
    private apiKey: string;
    private secretKey: string;
    private environment: string;
    private stage: string = "prod";
    private region: string;

    public get AuthorizationHeader() {
        return this.authorizationHeader;
    }

    public get StorageRelational() {
        return this.storageRelational;
    }

    public get CacheRelational() {
        if (!this.isTest)
            return this.cacheRelational;
        else
            return this.storageRelational;
    }

    public get StorageNoSQL() {
        return this.storageNoSQL;
    }

    public get CacheNoSQL() {
        if (!this.isTest)
            return this.cacheNoSQL;
        else
            return this.storageNoSQL;
    }

    public get Domain() {
        return this.domain;
    }

    public get CacheTTL() {
        return this.cacheTTL;
    }

    public get Cache(): NodeCache {
        return this.cache;
    }

    public get IsTest() {
        return this.isTest;
    }

    public get Region() {
        return this.region;
    }

    public addChange(className: string, propertyName: string, key: string | number, value: Object | undefined) {
        if (key) {
            let currentChange = this.changes.filter(item => item.ClassName === className && item.PropertyName === propertyName && item.Key === key);
            if (currentChange.length) {
                currentChange[0].Value = value;
            } else {
                this.changes.push({
                    Id: Guid.newGuid(),
                    ClassName: className,
                    PropertyName: propertyName,
                    Key: key,
                    Value: value
                });
            }
        }
    }

    public addRecordChange(className: string, propertyName: string, key: string | number, value: Object) {
        if (key) {
            this.changes.push({
                Id: Guid.newGuid(),
                ClassName: className,
                PropertyName: propertyName,
                Key: key,
                RecordValue: JSON.stringify(value)
            });
        }
    }

    public removeRecordChange(className: string, key: string | number) {
        if (key) {
            this.changes = this.changes.filter(i => !(i.ClassName == className && i.Key == key));
        }
    }

    public addComment(message: string, workItem: WorkItem, token?: Token) {
        if (message && workItem) {
            this.comments.push({
                Message: message,
                WorkItemOid: workItem.Oid,
                TokenOid: token ? token.Oid : 0
            });
        }
    }

    public GetModifiedData(options: GetModifiedDataOptions = null): Delta {
        let delta: Delta = {
            RefreshArguments: false,
            Changes: this.changes,
            Comments: this.comments,
            Options: options
        }
        return delta;
    }

    public CreateRequest(method: Method): AxiosRequestConfig {
        let headers: any = {};
        headers["Authorization"] = `Bearer ${this.authorizationHeader}`;
        headers["CurrentDomain"] = this.domain;
        headers["Accept"] = "application/json";
        headers["OData-Version"] = "4.0";
        headers["GetTestObjects"] = this.isTest;

        let settings: AxiosRequestConfig = {
            method: method,
            headers: headers,
            responseType: "json"
        }

        return settings;
    }

    public async FindAsync(endPoint: string, classOid: string, parseCallback: (data: any) => BaseModel): Promise<BaseModel | undefined> {
        let result = await this.FindAllAsync(endPoint, classOid, parseCallback);
        if (result && result.length)
            return result[0];
        else
            return undefined;
    }

    public async FindAllAsync(endPoint: string, classOid: string, parseCallback: (data: any) => BaseModel): Promise<Array<BaseModel>> {
        let baseObj = await GetAsync(this, endPoint, this.CreateRequest("GET"));

        let result: Array<BaseModel> = [];
        let data = new Array();
        if (baseObj && (<any>baseObj.data).value) {
            if ((<any>baseObj.data).value.length) {
                data = (<any>baseObj.data).value;
                data.forEach(item => {
                    result.push(parseCallback(item));
                });
            }
        } else {
            data = baseObj.data;
            result.push(parseCallback(data));
        }

        if (classOid !== Class.ClassOid)
            await Metadata.CheckAsync(this, classOid);

        return result;
    }

    public async WhereAsync( classOid: string, endPoint: string, filter: string, parseCallback: (data: any) => BaseModel, useCache: boolean = true): Promise<Array<BaseModel>> {
        let cacheKey = `${classOid}-${filter}`;
        if (useCache && this.Cache.get(cacheKey)) {
            await Metadata.CheckAsync(this, classOid);
            return <Array<BaseModel>>this.Cache.get(cacheKey);
        }

        const maxRecordsAllowed = 1000;
        let result = await this.FindAllAsync(`${endPoint}&$top=${maxRecordsAllowed}`, classOid, parseCallback );
        if (result && result.length === maxRecordsAllowed)
            throw "Max of 1000 records reached. Please improve your filter condition to limit data retrieval."

        await Metadata.CheckAsync(this, classOid);

        if (useCache)
            this.Cache.set(cacheKey, result, this.CacheTTL);
            
        return result;
    }

    public async PostAsync(endPoint: string, payload: any, fields: IDictionary): Promise<any> {

        if (fields) {
            Object.keys(fields).forEach(key => {
                if (fields[key] && key.length > 2 && key.substr(0, 3) === "cp_") {
                    payload[key] = fields[key];
                }
            });
        }
        let response = await PostAsync(this, endPoint, payload, this.CreateRequest("POST"));
        return response.data;
    }

    public async PatchAllAsync(endPoint: string, entities: Array<string>) {
        await this.PatchAsync(endPoint, undefined, undefined, entities);
    }

    public async PatchAsync(endPoint: string, className: string | undefined, key: string | number | undefined, entities: Array<string>) {
        var boundary = Guid.newGuid();

        let headers: any = {};
        headers["Authorization"] = `Bearer ${this.authorizationHeader}`;
        headers["CurrentDomain"] = this.domain;
        headers["Content-Type"] = `multipart/mixed; boundary=${boundary}`;

        let settings: AxiosRequestConfig = {
            method: "POST",
            headers: headers
        }

        let delta: Array<DeltaItem> = [];
        this.changes.forEach(field => {
            if (key) {
                if (className === undefined || (className === field.ClassName && key.toString() === field.Key)) {
                    delta.push(field);
                }
            }
        });
        
        let data = this.pack(endPoint, delta, entities, boundary);

        let response = await PostAsync(this, `${endPoint}odata/$batch`, data, settings);

        if (response.data.responses && response.data.responses.length) {            
            let errors = (<Array<any>>response.data.responses).filter((resp) => resp.status < 200 || resp.status > 299);
            if (errors && errors.length) {
                let errorMessage: Array<string> = [];
                errors.forEach(function (error) { 
                    if (error.body.error) {
                        errorMessage.push(error.body.error);
                    } else if (error.body.errors) {
                        Object.keys(error.body.errors).forEach(key => {
                            errorMessage.push(error.body.errors[key].join(','));
                        });
                    }
                });
                const msg = `BATCH request failed: ${errorMessage.join(',')}`;
                console.log(msg);
                throw msg;
            }
        }

        delta.forEach(savedItem => {
            this.changes = this.changes.filter(item => item.Id === savedItem.Id);
        })        

        console.log(response.data)
    }

    private pack(endPoint: string, delta: Array<DeltaItem>, entities: Array<string>, boundary: string): string {
        var body: Array<string> = [];
        let content: Array<string> = [];
        
        delta.forEach(field => {
            if (!field.RecordValue) {
                if (field.Value === undefined || field.Value === null)
                    content.push(`"${field.PropertyName}": null`)
                else if (field.Value instanceof Date)
                    content.push(`"${field.PropertyName}": "${field.Value.toISOString()}"`);
                else if (field.Value === '')
                    content.push("\"" + field.PropertyName + "\": ''");
                else if (!isNaN(+field.Value))
                    content.push(`"${field.PropertyName}": ${field.Value}`)
                else
                    content.push(`"${field.PropertyName}": "${field.Value}"`);
            }
        });

        let contentID = 0;
        var changeSet = "changeset_" + Guid.newGuid();
        body.push('--' + boundary);
        body.push('Content-Type:multipart/mixed;boundary=' + changeSet, '');

        entities.forEach(entity => {
            body.push('--' + changeSet);
            body.push('Content-Type: application/http');
            body.push('Content-Transfer-Encoding:binary', '');
            body.push('PATCH ' + endPoint + 'odata/' + entity + ' HTTP/1.1');
            body.push('Content-Type: application/json;odata.metadata=minimal');
            body.push(`Content-ID: ${contentID}`);
            body.push('', `{${content.join(', ')}}`);
            contentID = contentID + 1;
        });
        body.push('', '--' + changeSet + '--');
        body.push('--' + boundary + '--', '');

        return body.join('\r\n');
    }

    private static queryCache = new NodeCache( { useClones: false, checkperiod: 30 } );

    public async QueryAsync(sql: string, page: number, itemsPerPage: number, parameters: Array<QueryParam>, avoidCache: boolean = false): Promise<Array<any>> {

        if (itemsPerPage > 100)
            throw "The number of items per page must be equal or less than 100";

        if (page <= 0)
            throw "The page index must be greater or equal to 1";

        if (!sql)
            throw "The SQL command can not be undefined";

        if (!parameters) parameters = [];
        let hashCode = (s) => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
        
        let cacheKey = `${hashCode(this.Domain)}-${page}-${itemsPerPage}-${hashCode(`${sql}`)}-${hashCode(parameters.map(i => ( `${i.name}=${i.value || "__$null$__"}`).toString()).join('-'))}`;
        let resultSet = Context.queryCache.get(cacheKey) as Array<any>;
        if (resultSet && !avoidCache) {
            if (process.env.DEBUG) console.log(`Cache hit for ${sql}`);
            return resultSet;
        }

        let payload = {
            Sql: sql,
            Page: +page,
            ItemsPerPage: +itemsPerPage,
            Parameters: JSON.stringify(parameters)
        }

        let response = await PostAsync(this, `https://${this.region}-${this.stage}-queryexec.heflo.com/api/Sql/Execute`, payload, this.CreateRequest("POST"));
        let result: QueryResult = response.data;

        if (result.Error)
            throw result.Error;
        else {
            if (!avoidCache) {
                Context.queryCache.set(cacheKey, result.ResultSet, 60);
            }
            return result.ResultSet;
        }
    }

    public static async QueryAsync(environment: string, apiKey: string, secretKey: string, sql: string, page: number, itemsPerPage: number, 
            parameters: Array<QueryParam>, avoidCache: boolean = false): Promise<Array<any>> {

        if (itemsPerPage > 100)
            throw "The number of items per page must be equal or less than 100";

        if (page <= 0)
            throw "The page index must be greater or equal to 1";

        if (!environment)
            throw "The environment can not be undefined";

        if (!apiKey)
            throw "The API key can not be undefined";

        if (!secretKey)
            throw "The Secret key can not be undefined";

        if (!sql)
            throw "The SQL command can not be undefined";

        if (!parameters) parameters = [];
        let hashCode = (s) => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
        
        let cacheKey = `${environment ? hashCode(environment) : ""}-${page}-${itemsPerPage}-${hashCode(`${sql}`)}-${hashCode(parameters.map(i => ( `${i.name}=${i.value || "__$null$__"}`).toString()).join('-'))}`;
        let resultSet = Context.queryCache.get(cacheKey) as Array<any>;
        if (resultSet && !avoidCache) {
            if (process.env.DEBUG) console.log(`Cache hit for ${sql}`);
            return resultSet;
        }

        let context = await Context.BuildContextAsync(environment, apiKey, secretKey);

        let payload = {
            Sql: sql,
            Page: +page,
            ItemsPerPage: +itemsPerPage,
            Parameters: JSON.stringify(parameters)
        }

        let response = await PostAsync(context, `https://${context.region}-${context.stage}-queryexec.heflo.com/api/Sql/Execute`, payload, context.CreateRequest("POST"));
        let result: QueryResult = response.data;

        if (result.Error)
            throw result.Error;
        else {
            if (!avoidCache)
                Context.queryCache.set(cacheKey, result.ResultSet, 60);
            return result.ResultSet;
        }
    }

    public async SendMailAsync(recipients: Array<string>, subject: string, body: string, attachments?: Array<string>, tokenOid?: number, sender?: string) {

        let payload = {
            Recipients: JSON.stringify(recipients || []),
            Subject: subject,
            Body: body,
            Attachments: JSON.stringify(attachments || []),
            TokenOid: tokenOid,
            Sender: sender
        }

        await PostAsync(this, `${this.StorageRelational}odata/Connector/DataServiceControllers.SendMail`, payload, this.CreateRequest("POST"));
    }

}

interface QueryResult {
    ResultSet?: Array<any>;
    Error?: any;
}

export interface QueryParam {
    name: string;
    value: string | number;
}