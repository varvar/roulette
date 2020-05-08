const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
let expect = chai.expect;
let should = chai.should();

chai.use(chaiHttp);

describe('Integration / endToEnd tests', () => {

    let fileName = '6429.txt';

    it('test basic endpoint', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                console.log()
                res.should.have.status(200);
                expect(res.body.message).to.be.equal('API is up and running.');
                res.body.should.be.an('object');

                done();
            })

    });

    it('should process tokenization', (done) => {
        chai.request(server)
            .post('/process')
            .send({file: `http://www.gutenberg.org/files/6429/${fileName}`})
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.processStatus).to.be.equal('Done');
                expect(res.body.fileName).to.be.equal(fileName);
                expect(res.body.chunksProcessed).to.be.above(1);
                expect(res.body.state).to.be.an('object').that.has.all.keys('totalProcessingTime', 'downloadSpeed', 'fileSize');
                res.body.should.be.an('object');

                done();
            })
    }).timeout(20000);

    it('should return tokenized json', (done) => {

        setTimeout(() => {
            chai.request(server)
                .get(`/words/${fileName}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('Array').with.lengthOf.above(1);

                    done();
                })
        }, 4000)
    }).timeout(5000);

});