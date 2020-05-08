const expect = require('chai').expect;
const R = require('ramda');
const fs = require('fs');
const chunkTokenizer = require("../app/controllers/helpers/text.tokenizer");
const textProcessor = require("../app/controllers/helpers/text.processor");

describe('Unit tests', () => {

    let tokenizedArray;

    it('should tokenize entire string', (done) => {
        let string = `Project Gutenberg-tm depends upon and cannot survive without wide
      spread public support and donations to carry out its mission of
      increasing the number of public domain and licensed works that can be
      freely distributed in machine readable form accessible by the widest
      array of equipment including outdated equipment.  Many small donations
      ($1 to $5,000) are particularly important to maintaining tax exempt
      status with the IRS !@#$`;

        chunkTokenizer(string).then(
            result => {
                expect(result).to.be.a('Array').with.lengthOf.above(1);
                expect(R.includes('5,000', result)).to.be.false;
                expect(R.includes('$5,000', result)).to.be.false;
                expect(R.includes('!@#$', result)).to.be.false;
                expect(R.includes('tm', result)).to.be.true;

                //check duplicated values are present
                let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);
                let duplicates = findDuplicates(result);
                expect(R.includes('donations', duplicates)).to.be.true;

                tokenizedArray = result;
                done();
            }).catch(error => console.error(error));

    });

    it('should generate data file with words count', (done) => {

        textProcessor(tokenizedArray, 'testTextProcessor.txt').then(
            setTimeout(() => {
                fs.readFile(__dirname + '/../files/testTextProcessor.txt.json', (err, data) => {
                    if (err) {
                        return done(err);
                    }

                    let json = JSON.parse(data);
                    expect(json).to.be.a('Array').with.lengthOf.above(1);

                    //examine "the" word existing and count
                    let specificWord = R.find(R.propEq('word', 'the'))(json);
                    expect(specificWord).to.be.a('object').that.has.all.keys('word', 'repetitions');
                    expect(specificWord.repetitions).to.be.equal(3);
                    done();
                })
            }, 4000)
        ).catch(error => console.error(error));

    }).timeout(5000);

});