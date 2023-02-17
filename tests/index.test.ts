
import jetbrains from "../src";

describe("Test jetbrains", () => {
    test("getRecentProjectsManager", async () => {
        const recentProjectsManager = await jetbrains.getRecentProjectsManager('WebStorm')
        console.log(recentProjectsManager);
    });
    test("getRecentProjectsManagerSync", () => {
        const recentProjectsManager = jetbrains.getRecentProjectsManagerSync('WebStorm');
        console.log(recentProjectsManager);
    });
});