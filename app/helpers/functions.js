module.exports = {

    /**
     * Return random property from provided list of users except sender .
     *
     * @param {obj} users Online users list
     * @param {string} me Sender socket ID
     * @return {string} random socket ID
     */
    randomProperty (users,me) {
        let keys = Object.keys(users);
        let meIndex = keys.indexOf(me);
        keys.splice(meIndex, 1);
        return keys[Math.floor(Math.random() * keys.length)];
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

};
