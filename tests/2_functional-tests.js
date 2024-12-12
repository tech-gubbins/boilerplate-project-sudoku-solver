const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
	const validPuzzle =
		'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
	const invalidPuzzle =
		'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
	const impossiblePuzzle =
		'1.5..2.84..63.12.7.2..5.....7..1....8.2.3674.3.7.2..9.47...8..1..16....926914.378';

	suite('Solve a puzzle...    POST request to /api/solve', () => {
		test('With valid puzzle string', (done) => {
			chai
				.request(server)
				.post('/api/solve')
				.send({ puzzle: validPuzzle })
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.property(res.body, 'solution');
					assert.equal(res.body.solution.length, 81);
					done();
				});
		});

		test('With missing puzzle string', (done) => {
			chai
				.request(server)
				.post('/api/solve')
				.send({})
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.property(res.body, 'error');
					assert.equal(res.body.error, 'Required field missing');
					done();
				});
		});

		test('With invalid characters', (done) => {
			chai
				.request(server)
				.post('/api/solve')
				.send({ puzzle: invalidPuzzle })
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.property(res.body, 'error');
					assert.equal(res.body.error, 'Invalid characters in puzzle');
					done();
				});
		});

		test('With incorrect length', (done) => {
			chai
				.request(server)
				.post('/api/solve')
				.send({ puzzle: invalidPuzzle })
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.property(res.body, 'error');
					assert.equal(res.body.error, 'Invalid characters in puzzle');
					done();
				});
		});

		test('With incorrect length', (done) => {
			chai
				.request(server)
				.post('/api/solve')
				.send({ puzzle: validPuzzle.slice(0, 80) })
				.end((err, res) => {
					assert.equal(res.status, 200);
					assert.property(res.body, 'error');
					assert.equal(
						res.body.error,
						'Expected puzzle to be 81 characters long'
					);
					done();
				});
		});

        test('That cannot be solved', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({ puzzle: impossiblePuzzle })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                })
        })
	});

    suite('Check a puzzle placement...    POST request to /api/check', () => {
        test('With all fields', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'A2',
                    value: 3
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.isTrue(res.body.valid);
                    done();
                })
        })

        test('With single placement conflict', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'A1',
                    value: 5
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);
                    assert.property(res.body, 'conflict');
                    assert.isArray(res.body.conflict);
                    assert.include(res.body.conflict,'row');
                    done();
                })
        })

        test('With multiple placement conflicts', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'A1',
                    value: 2
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);
                    assert.property(res.body, 'conflict');
                    assert.isArray(res.body.conflict);
                    assert.include(res.body.conflict, 'row');
                    assert.include(res.body.conflict, 'region');
                    done();
                })
        })

        test('With all placement conflicts', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'B1',
                    value: 1
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);
                    assert.property(res.body, 'conflict');
                    assert.isArray(res.body.conflict);
                    assert.include(res.body.conflict, 'row');
                    assert.include(res.body.conflict, 'column');
                    assert.include(res.body.conflict, 'region');
                    done();
                })
        })

        test('With missing required fields', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({ puzzle: validPuzzle })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                })
        })

        test('With invalid characters', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: invalidPuzzle,
                    coordinate: 'A2',
                    value: 3
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                })
        })

        test('With incorrect length', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle.slice(0, 80),
                    coordinate: 'A2',
                    value: 3
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                })
        })

        test('With invalid placement coordinate', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'J2',
                    value: 3
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                })
        })

        test('With invalid placement value', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: validPuzzle,
                    coordinate: 'A2',
                    value: 10
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                })
        })
    })
});
