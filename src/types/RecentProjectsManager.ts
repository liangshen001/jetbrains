export interface RecentProjectsManager {
    additionalInfo: Map<string, RecentProjectMetaInfo>;
    lastOpenedProject: string;
}

export interface RecentProjectMetaInfo {
    frameTitle: string;
    projectWorkspaceId: string;
    activationTimestamp: string;
    binFolder: string;
    path: string;
    name: string;
    opened: string
    workspaceId: string;
    buildTimestamp: string;
    projectOpenTimestamp: string;
    frame: {
        x: string;
        y: string;
        width: string;
        height: string;
        extendedState: string;
    }
}