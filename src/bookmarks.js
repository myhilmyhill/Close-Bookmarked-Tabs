// @ts-check
/** @typedef {import('./firefox').Browser} Browser */
/** @typedef {import('./firefox').bookmarks.BookmarkTreeNode} bookmarks.BookmarkTreeNode */
/** @typedef {import('./types').Bookmark} Bookmark */
/** @typedef {import('./types').BookmarkFolder} BookmarkFolder */

/**
 * for Firefox
 * @param {Browser} browser
 * @param {string | undefined} folderId
 * @returns {Promise<Bookmark[]>}
 */
export async function getBookmarks(browser, folderId) {
    /** @type {bookmarks.BookmarkTreeNode[]} */
    const targetBookmarks = folderId
        ? await browser.bookmarks.getSubTree(folderId)
        : await browser.bookmarks.getTree();
    const path = folderId
        ? await getBookmarkRoots(browser, folderId)
        : [];

    // Remove own folder and noname root
    path.pop();
    path.shift();
    /** @type {Bookmark[]} */
    const myBookmarks = [];
    for (const bookmark of targetBookmarks) {
        digBookmarkItem(bookmark, path, myBookmarks);
    }

    return myBookmarks;
}

/**
 * for Firefox
 * @param {Browser} browser
 * @param {string} folderId
 * @returns {Promise<BookmarkFolder[]>} */
export async function getBookmarkFolders(browser, folderId) {
    const targetBookmarks = folderId
        ? await browser.bookmarks.getSubTree(folderId)
        : await browser.bookmarks.getTree();
    const path = folderId
        ? await getBookmarkRoots(browser, folderId)
        : [];

    // Remove own folder and nonamed root
    path.pop();
    path.shift();
    /** @type {Bookmark[]} */
    const myBookmarks = [];
    for (const bookmark of targetBookmarks) {
        digBookmarkFolder(bookmark, path, myBookmarks);
    }

    return myBookmarks;
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
 * @param {Browser} browser
 * @param {string} folderId
 * @param {string[]} path
 * @returns {Promise<string[]>} Path from root.
 */
async function getBookmarkRoots(browser, folderId, path = []) {
    const bookmark = (await browser.bookmarks.get(folderId))[0];
    path.unshift(bookmark.title);
    return (bookmark['parentId'] != null)
        ? getBookmarkRoots(browser, bookmark.parentId, path)
        : path;
}

/**
 * Recursively
 * @private
 * @param {bookmarks.BookmarkTreeNode} bookmarkItem
 * @param {string[]} path
 * @param {Bookmark[]} to
 * @returns {void} */
function digBookmarkItem(bookmarkItem, path, to) {
    if (bookmarkItem.url) {
        to.push({
            id: bookmarkItem.id,
            title: bookmarkItem.title,
            url: bookmarkItem.url,
            path: Array.from(path),
        });
    } else {
        path.push(bookmarkItem.title);
    }
    if (bookmarkItem.children) {
        for (const child of bookmarkItem.children) {
            digBookmarkItem(child, path, to);
        }
        path.pop();
    }
}

/**
 * Recursively
 * @private
 * @param {bookmarks.BookmarkTreeNode} bookmarkItem
 * @param {string[]} path
 * @param {BookmarkFolder[]} to
 * @returns {void} */
function digBookmarkFolder(bookmarkItem, path, to) {
    if (!bookmarkItem.url) {
        to.push({
            id: bookmarkItem.id,
            title: bookmarkItem.title,
            path: Array.from(path),
        });
        path.push(bookmarkItem.title);
    }
    if (bookmarkItem.children) {
        for (const child of bookmarkItem.children) {
            digBookmarkFolder(child, path, to);
        }
        path.pop();
    }
}
