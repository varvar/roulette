const fs = require('fs');
const request = require('request');
const progress = require('request-progress');
const formatters = require("./helpers/formatters");
const chunkTokenizer = require("./helpers/text.tokenizer");
const textProcessor = require("./helpers/text.processor");

/**
 * Process new text file tokenization
 *
 * @return {object} Processing status information.
 */
exports.process = (req, res) => {
    let hrstart = process.hrtime();

    // Validate request
    if (!req.body || !req.body.file) {
        return res.status(400).send({
            message: "File value can not be empty!"
        });
    }

    let fileName = formatters.getFilename(req.body.file);
    let chunks = [];
    let buffer = '';
    // gather some stats info
    let lastState = {};
    let chunksCounter = 0;

    // Get provided text file and pipe it to fs
    progress(request(req.body.file), {})
        .on('progress', (state) => {
            lastState = state;
        })
        .on('error', (err) => {
            return res.status(500).send({message: err});
        })
        .on('data', (chunk) => {
            chunksCounter++;
            // protect cutted end of chunk by checking if the last char is whitespace
            buffer = buffer + chunk.toString();
            let matches = buffer.match(/(\s+$)/g);
            if (matches && matches.length > 0) {
                // perform tokenization process
                chunkTokenizer(buffer).then(
                    result => {
                        chunks.push(result);
                        // clean the buffer
                        buffer = '';
                    }).catch(error => console.error(error));
            }
        })
        .on('end', () => {
            let mergedChunks = [].concat.apply([], chunks);
            textProcessor(mergedChunks, fileName).then(
                res.send({
                    processStatus: 'Done',
                    fileName,
                    chunksProcessed: chunksCounter,
                    state: {
                        totalProcessingTime: `${process.hrtime(hrstart)[0]} sec`,
                        fileSize: `${formatters.humanFileSize(lastState.size.total)}`,
                        downloadSpeed: `${formatters.humanFileSize(lastState.speed)}/sec`
                    }
                })
            ).catch(
                error => {
                    return res.status(500).send({message: error});
                }
            );
        })
        .pipe(fs.createWriteStream(__dirname + '/../../files/' + fileName));

};

/**
 * Retrieve all words repetitions from json file.
 *
 * @param {string} filename Filename to get words list information
 * @param {string} sort Sorting parameter (word,repetitions)
 * @param {string} order Order parameter (asc,desc)
 * @return {object} json data.
 */
exports.find = (req, res) => {
    let fileName = req.params.filename;
    let sort = req.params.sort || '';
    let order = req.params.order || '';

    fs.readFile(__dirname + '/../../files/' + fileName + '.json', (err, data) => {
        if (err) {
            return res.status(500).send({message: err});
        }

        let json = {};
        try {
            json = JSON.parse(data);
        } catch (e) {
            return res.status(500).send({message: e});
        }
        let sorted = json.sort(formatters.compareValues(sort,order));
        res.json(sorted);
    });
};

/**
 * Retrieve words list from json file in stream.
 *
 * @param {string} filename Filename to get words list information
 * @return {object} json data.
 */
exports.get = (req, res) => {
    let fileName = req.params.filename;

    res.setHeader('Content-Type', 'application/json');
    
    let readStream = fs.createReadStream(__dirname + '/../../files/' + fileName + '.json');
    readStream.on('data', (data) => {
        res.write(data);
    });
    readStream.on('end', () => {
        res.status(200).send();
    });
};
