import { Context } from './Context';
import { Class } from './Classes/Class';
import { IDictionary } from './Types';

export class Metadata {

    public static Add(context: Context, className: string, dataJSON: string) {
        if (dataJSON) {
            let cacheKey = this.buildClassCacheKey(context, className);
            context.Cache.set(cacheKey, dataJSON, context.CacheTTL);
        }
    }

    private static buildClassCacheKey(context: Context, className: string): string {
        return `Class-${context.Domain}-${className}`;
    }

    public static async CheckAsync(context: Context, className: string): Promise<void> {
        await this.GetClassMetadata(context, className, true);
    }

    public static GetListEntity(context: Context, className: string, propertyName: string): string | undefined {
        let cacheKey = this.buildClassCacheKey(context, className);
        let classJSON = context.Cache.get(cacheKey);
        if (classJSON) {
            let metaClass = JSON.parse(<string>classJSON);
            if (metaClass) {
                let metaProp = (<Array<IDictionary>>metaClass["Properties"]).filter(item => item["Name"] === propertyName || item["CustomAlias"] === propertyName);
                if (metaProp && metaProp.length) {
                    return metaProp[0]["ListEntityName"];
                }
            }
        }

        return undefined;
    }

    public static GetPropertyName(context: Context, className: string, alias: string): string | undefined {
        let cacheKey = this.buildClassCacheKey(context, className);
        let classJSON = context.Cache.get(cacheKey);
        if (classJSON) {
            let metaClass = JSON.parse(<string>classJSON);
            if (metaClass) {
                let metaProp = (<Array<IDictionary>>metaClass["Properties"]).filter(item => item["Name"] === alias || item["CustomAlias"] === alias);
                if (metaProp && metaProp.length)
                    return metaProp[0]["Name"];
                else
                    return undefined;
            }
        }
        return alias;
    }

    public static GetPropertyMetadata(context: Context, className: string, alias: string): IDictionary | undefined {
        let cacheKey = this.buildClassCacheKey(context, className);
        let classJSON = context.Cache.get(cacheKey);
        if (classJSON) {
            let metaClass = JSON.parse(<string>classJSON);
            if (metaClass) {
                let metaProp = (<Array<IDictionary>>metaClass["Properties"]).filter(item => item["Name"] === alias || item["CustomAlias"] === alias);
                if (metaProp && metaProp.length)
                    return metaProp[0];
                else 
                    return undefined;
            }
        }
        return [];
    }

    private static async GetClassMetadata(context: Context, className: string, changeTTL: boolean = false): Promise<Class | undefined> {
        let cacheKey = this.buildClassCacheKey(context, className);
        let metaClass: Class;
        if (context.Cache.get(cacheKey) && !context.IsTest) {
            let metaJSON: string | undefined = context.Cache.get(cacheKey);
            if (metaJSON) {
                metaClass = new Class(context);
                metaClass.Parse(JSON.parse(metaJSON));
                metaClass.Context = context;
            }
            if (metaJSON && metaJSON !== "")
                context.Cache.set(cacheKey, metaJSON, context.CacheTTL);
        } else {
            let metaJSON: string = "";
            metaClass = <Class>(await context.FindAsync(`${context.CacheNoSQL}odata/Class('${className}')/DataServiceControllers.GetClassByOid?$select=Name&$expand=Properties($select=Name,Type,ListEntityName,CustomAlias)`,
                Class.ClassOid, (data: Array<any>) => {
                    metaJSON = JSON.stringify(data);
                    return Class.Parse(context, data);
                }
            ));
            if (metaJSON && metaJSON !== "")
                context.Cache.set(cacheKey, metaJSON, context.CacheTTL);
        }
        return undefined;
    }

}