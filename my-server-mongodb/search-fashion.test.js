const { test } = require('node:test');
const assert = require('node:assert/strict');
const { jaccardSimilarity, searchFashions } = require('./search-fashion');

test('Jaccard uses unique normalized words and intersection / union', () => {
    assert.equal(jaccardSimilarity('ĐẦM đỏ đỏ!', 'đầm đỏ'), 1);
    assert.equal(jaccardSimilarity('a b c', 'a b c d'), 0.75);
    assert.equal(jaccardSimilarity('a b', 'a b c d'), 0.5);
    assert.equal(jaccardSimilarity('a', 'b'), 0);
    assert.equal(jaccardSimilarity('', ''), 0);
    assert.equal(jaccardSimilarity('áo dài', '<p>Áo <b>dài</b></p>'), 1);
    assert.equal(jaccardSimilarity('đầm', null), 0);
});

test('search ranks the selected field before applying result limit', () => {
    const fashions = [
        { _id: '1', fashion_subject: 'a b c d e', fashion_detail: 'a b' },
        { _id: '2', fashion_subject: 'a b', fashion_detail: 'c' },
        { _id: '3', fashion_subject: 'a b c', fashion_detail: 'd' },
    ];
    const result = searchFashions(fashions, 'a b', 'fashion_subject', 2);
    assert.deepEqual(result.map(item => item._id), ['2', '3']);
    assert.equal(result[0].jaccardSimilarity, 1);
    assert.equal(searchFashions(fashions, 'a b', 'fashion_detail', 1)[0]._id, '1');
    assert.equal(fashions[0].jaccardSimilarity, undefined);
});
