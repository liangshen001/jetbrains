
// const arr: string[] = ["cat", "dog", "bat"];

import jetbrains from "../src";
import os from "os";
import fs from "fs";
import {Element, xml2js} from "xml-js";
import {Jetbrains} from "../src";

describe("Test", () => {
    test("getRecentProjectsManager", async () => {
        const j = new Jetbrains('WebStorm');
        const recentProjectsManager = await j.getRecentProjectsManager()
        console.log(recentProjectsManager);
    });
    test("getRecentProjectsManagerSync", () => {
        const j = new Jetbrains('WebStorm');
        const recentProjectsManager = j.getRecentProjectsManagerSync()
        console.log(recentProjectsManager);
    });

    test("测试", () => {
        const preferencesBasePath = `${os.homedir()}/Library/Application Support/JetBrains/`;
        const folders = fs.readdirSync(preferencesBasePath);
        const appDir = folders.filter(name => name.startsWith('WebStorm')).reduce((p, v) => (p && p > v) ? p : v, '')
        const recentPreferencesFile = `${preferencesBasePath}${appDir}/options/recentProjects.xml`;
        const recentPreferences = fs.readFileSync(recentPreferencesFile, {encoding: 'utf8'});
        const recentPreferencesObj = xml2js(recentPreferences) as Element
        console.log(recentPreferencesObj);
    })
});