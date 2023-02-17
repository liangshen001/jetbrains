import fs from "fs";
import os from "os";
import {Element, xml2js} from "xml-js";
import path from "path";
import {RecentProjectsManager} from "./types/RecentProjectsManager";
import {promisify} from "util";

export type JetbrainsApp = 'WebStorm' | 'IntelliJIdea' | 'DataGrip' | 'PyCharm';

export class Jetbrains {

    optionsPath(app: JetbrainsApp) {
        const preferencesBasePath = `${os.homedir()}/Library/Application Support/JetBrains/`;
        const folders = fs.readdirSync(preferencesBasePath);
        const appDir = folders.filter(name => name.startsWith(app)).reduce((p, v) => (p && p > v) ? p : v, '')
        if (!appDir) {
            throw new Error('Not Found Application');
        }
        return path.join(preferencesBasePath, appDir, 'options');
    }

    private getOptionsFileObjSync(app: JetbrainsApp, fileName: string) {
        const recentPreferences = fs.readFileSync(path.join(this.optionsPath(app), fileName), {encoding: 'utf8'});
        return this.resolveFileContent(recentPreferences);
    }
    private async getOptionsFileObj(app: JetbrainsApp, fileName: string) {
        let readFile = promisify(fs.readFile);
        const recentPreferences = await readFile(path.join(this.optionsPath(app), fileName), {encoding: 'utf8'});
        return this.resolveFileContent(recentPreferences);
    }

    private resolveFileContent(file: string) {
        const recentPreferencesObj = xml2js(file) as Element;
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

    getRecentProjectsManagerSync(app: JetbrainsApp): RecentProjectsManager {
        return this.getOptionsFileObjSync(app, 'recentProjects.xml')
    }
    async getRecentProjectsManager(app: JetbrainsApp): Promise<RecentProjectsManager> {
        return this.getOptionsFileObj(app, 'recentProjects.xml')
    }
}

let jetbrains = new Jetbrains();
export default jetbrains;
export {RecentProjectsManager};