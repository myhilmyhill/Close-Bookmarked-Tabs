export interface Bookmark {
    id: string,
    title: string,
    url?: string,
    path: string[],
}
export type BookmarkFolder = Omit<Bookmark, 'url'>
