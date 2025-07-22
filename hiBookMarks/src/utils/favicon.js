/**
 * 获取网站图标URL
 * @param {string} url - 网站URL
 * @returns {string} - 图标URL
 */
export function getFaviconUrl(url) {
    if (!url) return '';

    try {
        // 提取域名
        const urlObj = new URL(url);
        const domain = urlObj.hostname;

        // 使用Google的favicon服务
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (error) {
        console.warn('Invalid URL for favicon:', url);
        return '';
    }
}

/**
 * 获取默认图标
 * @returns {string} - 默认图标URL
 */
export function getDefaultFavicon() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04IDRDNi4zNDMgNCA1IDUuMzQzIDUgN0M1IDguNjU3IDYuMzQzIDEwIDggMTBDOS42NTcgMTAgMTEgOC42NTcgMTEgN0MxMSA1LjM0MyA5LjY1NyA0IDggNFoiIGZpbGw9IiNEMEQwRDAiLz4KPHBhdGggZD0iTTggMTJDNi4zNDMgMTIgNSAxMy4zNDMgNSAxNUg3QzcgMTQuNDQ4IDcuNDQ4IDE0IDggMTRDOC41NTIgMTQgOSAxNC40NDggOSAxNUgxMUMxMSAxMy4zNDMgOS42NTcgMTIgOCAxMloiIGZpbGw9IiNEMEQwRDAiLz4KPC9zdmc+';
} 