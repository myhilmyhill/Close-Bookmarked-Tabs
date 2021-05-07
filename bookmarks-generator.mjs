/**
 * @exports
 * @typedef {{id: string, title: string, url: string, path: string[]}} Bookmark
 * @typedef {Omit<Bookmark, 'url'>} BookmarkFolder
 */

/**
 * for Firefox
 * @param {string?} folderId
 * @returns {AsyncIterableIterator<Bookmark>} */
export async function *getBookmarks(folderId) {
    const targetBookmarks = folderId
        ? await browser.bookmarks.getSubTree(folderId)
        : await browser.bookmarks.getTree();
    const path = folderId
        ? await getBookmarkRoots(folderId)
        : [];

    // Remove own folder and nonamed root
    path.pop();
    path.shift();
    for (const bookmark of targetBookmarks) {
        yield* digBookmarkItem(bookmark, path);
    }
}

/**
 * for Firefox
 * @param {string} folderId
 * @returns {AsyncIterableIterator<Bookmark>} */
export async function *getBookmarkFolders(folderId) {
    const targetBookmarks = folderId
        ? await browser.bookmarks.getSubTree(folderId)
        : await browser.bookmarks.getTree();
    const path = folderId
        ? await getBookmarkRoots(folderId)
        : [];

    // Remove own folder and nonamed root
    path.pop();
    path.shift();
    for (const bookmark of targetBookmarks) {
        yield* digBookmarkFolder(bookmark, path);
    }
}

/**
 * For Firefox
 * @example
 *   Root
 *   + Folder
 *   +-+ Folder2
 * 
 * Input folder id => Return
 * Folder => ["Root", "Folder"]
 * Folder2 => ["Root", "Folder", "Folder2"]
 * @param {string} folderId
 * @param {string[]} path
 * @returns {Promise<string[]>} Path from root.
 */
async function getBookmarkRoots(folderId, path = []) {
    const bookmark = (await browser.bookmarks.get(folderId))[0];
    path.unshift(bookmark.title);
    return ('parentId' in bookmark)
        ? getBookmarkRoots(bookmark.parentId, path)
        : path;
}

/**
 * Recursively
 * @private
 * @param {bookmarks.BookmarkTreeNode} bookmarkItem
 * @param {string[]} path
 * @returns {IterableIterator<Bookmark>} */
function *digBookmarkItem(bookmarkItem, path) {
    if (bookmarkItem.url) {
        yield {
            id: bookmarkItem.id,
            title: bookmarkItem.title,
            url: bookmarkItem.url,
            path: Array.from(path),
        };
    } else {
        path.push(bookmarkItem.title);
    }
    if (bookmarkItem.children) {
        for (const child of bookmarkItem.children) {
            yield* digBookmarkItem(child, path);
        }
        path.pop();
    }
}

/**
 * Recursively
 * @private
 * @param {bookmarks.BookmarkTreeNode} bookmarkItem
 * @param {string[]} path
 * @returns {IterableIterator<BookmarkFolder>} */
function *digBookmarkFolder(bookmarkItem, path) {
    if (!bookmarkItem.url) {
        yield {
            id: bookmarkItem.id,
            title: bookmarkItem.title,
            path: Array.from(path),
        };
        path.push(bookmarkItem.title);
    }
    if (bookmarkItem.children) {
        for (const child of bookmarkItem.children) {
            yield* digBookmarkFolder(child, path);
        }
        path.pop();
    }
}
