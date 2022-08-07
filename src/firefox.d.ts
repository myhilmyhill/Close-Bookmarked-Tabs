export declare var browser: Browser;
export interface Browser {
    bookmarks: bookmarks.Bookmarks;
    tabs: tabs.Tabs;
}

export module tabs {
    export interface Tabs {
        query(queryObj: object): Promise<tabs.Tab[]>;
        remove(tabIds: number | (number | undefined)[]): Promise<void>;
    }

    export interface Tab {
        active: boolean;
        hidden: boolean;
        highlighted: boolean;
        id?: number;
        url?: string;
        title?: string;
    }
}

export module bookmarks {
    export interface Bookmarks {
        getSubTree(id: string): Promise<BookmarkTreeNode[]>;
        getTree(): Promise<BookmarkTreeNode[]>;
        get(idOrIdList: string | string[]): Promise<BookmarkTreeNode[]>;
    }

    export interface BookmarkTreeNode {
        children?: BookmarkTreeNode[];
        id: string;
        parentId?: string;
        title: string;
        url?: string;
    }
}
