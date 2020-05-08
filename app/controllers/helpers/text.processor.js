const fs = require('fs');
const {promisify} = require('util');
const writeFileAsync = promisify(fs.writeFile);

/**
 * Counts words repetitions in array of words.
 *
 * @param {array} array Array with words
 * @return {array} words repetitions list.
 */
const processWordsArray = async (array) => {

    let counts = {};
    array.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
    });

    let wordsAr = [];
    let beautify = async (obj) => {
        wordsAr[wordsAr.length] = obj;
    };
    for ( let key in counts) {
        if (counts.hasOwnProperty(key)) {
            await beautify({
                "word": key,
                "repetitions": counts[key]
            });
        }
    }
    return wordsAr;
};

/**
 * Creates JSON file with words repetitions.
 *
 * @param {array} array Array with words repetitions
 * @return {boolean}
 */
const generateDataFile = async (array, fileName) => {
    let json = JSON.stringify(array);
    await writeFileAsync(__dirname + '/../../../files/' + fileName + '.json', json);
    return true;
};

module.exports = async (mergedChunks, fileName) => {

    try {
        let wordsProcessed = await processWordsArray(mergedChunks);
        await generateDataFile(wordsProcessed, fileName);
        return true;
    } catch (e) {
        throw Error(e);
    }
};
