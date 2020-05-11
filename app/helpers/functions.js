module.exports = {

    /**
     * Return random list of socket ID's from provided list of users except sender .
     *
     * @param {obj} users Online users list
     * @param {string} me Sender socket ID
     * @param {number} count Number of random sockets to return
     * @return {array} list of random socket ID's
     */
    randomProperty (users,me,count) {
        let keys = Object.keys(users);
        let meIndex = keys.indexOf(me);
        keys.splice(meIndex, 1);
        let shuffled = keys.sort(() => 0.5 - Math.random());
        let selected=shuffled.slice(0,count);
        return selected;
    }
};
