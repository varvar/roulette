module.exports = {

    /**
     * Return human readable file size.
     *
     * @param {string} size File size
     * @return {string} human readable file size
     */
    humanFileSize(size) {
        let i = Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    },

    /**
     * Return file name from url.
     *
     * @param {string} path Url to find file name in
     * @return {string} file name with it's extension
     */
    getFilename(path) {
        path = path.substring(path.lastIndexOf("/") + 1);
        return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
    },

    /**
     * Sort array values.
     *
     * @param {string} key Key to sort by
     * @return {function} prototype function for sorting
     */
    compareValues(key, order = 'asc') {
        return function innerSort(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                return 0;
            }

            const varA = (typeof a[key] === 'string')
                ? a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string')
                ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order === 'desc') ? (comparison * -1) : comparison
            );
        };
    }

};
