import fs from "fs";
import os from "os";
import {Element, xml2js} from "xml-js";
import path from "path";
import {RecentProjectsManager} from "./types/RecentProjectsManager";
import {promisify} from "util";

export type JetbrainsApp = 'WebStorm' | 'IntelliJIdea' | 'DataGrip' | 'PyCharm';

export class Jetbrains {
    optionsPath: string;
    constructor(private app: JetbrainsApp) {
        const preferencesBasePath = `${os.homedir()}/Library/Application Support/JetBrains/`;
        const folders = fs.readdirSync(preferencesBasePath);
        const appDir = folders.filter(name => name.startsWith(this.app)).reduce((p, v) => (p && p > v) ? p : v, '')
        if (!appDir) {
            throw new Error('Not Found Application');
        }
        this.optionsPath = path.join(preferencesBasePath, appDir, 'options');
    }

    private getOptionsFileObjSync(fileName: string) {
        const recentPreferences = fs.readFileSync(path.join(this.optionsPath, fileName), {encoding: 'utf8'});
        const recentPreferencesObj = xml2js(recentPreferences) as Element;
        return this.resolveElement(recentPreferencesObj);
    }
    private async getOptionsFileObj(fileName: string) {
        let readFile = promisify(fs.readFile);
        const recentPreferences = await readFile(path.join(this.optionsPath, fileName), {encoding: 'utf8'});
        const recentPreferencesObj = xml2js(recentPreferences) as Element;
        return this.resolveElement(recentPreferencesObj);
    }

    private replaceStringValue(value?: string | number) {
        if (typeof value === 'string') {
            return value.replace('$USER_HOME$', os.homedir());
        }
    }

    private resolveElement(element: Element): any {
        switch (element.name) {
            case undefined:
            case 'application':
                return this.resolveElement(element.elements![0]);
            case 'map':
                return new Map(element.elements!.map(i => this.resolveElement(i)));
            case 'entry':
                return [this.replaceStringValue(element.attributes!.key)!, this.replaceStringValue(element.attributes!.value) ?? this.resolveElement(element.elements![0])];
            case 'value':
                return this.resolveElement(element.elements![0]);
            case 'option':
                return {
                    [this.replaceStringValue(element.attributes!.name)!]: this.replaceStringValue(element.attributes!.value) ?? this.resolveElement(element.elements![0])
                };
            case 'frame':
                return {
                    frame: element.attributes
                };
            default:
                return {
                    ...element.attributes,
                    ...element.elements?.reduce((p, v) => ({
                        ...p,
                        ...this.resolveElement(v),
                    }), {})
                }
        }
    }

    getRecentProjectsManagerSync(): RecentProjectsManager {
        return this.getOptionsFileObjSync('recentProjects.xml')
    }
    async getRecentProjectsManager(): Promise<RecentProjectsManager> {
        return this.getOptionsFileObj('recentProjects.xml')
    }
}


export default Jetbrains;
export {RecentProjectsManager};