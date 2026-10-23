function tokenize(value) {
    return new Set(String(value ?? '').replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;|&#160;/gi, ' ').normalize('NFC').toLocaleLowerCase('vi')
        .match(/[\p{L}\p{N}]+/gu) ?? []);
}

function jaccardSimilarity(query, value) {
    const left = tokenize(query);
    const right = tokenize(value);
    const union = new Set([...left, ...right]);
    if (!union.size) return 0;
    return [...left].filter(word => right.has(word)).length / union.size;
}

function searchFashions(fashions, query, field, limit) {
    return fashions.map(fashion => ({
        ...fashion, jaccardSimilarity: jaccardSimilarity(query, fashion[field]),
    })).sort((a, b) => b.jaccardSimilarity - a.jaccardSimilarity
        || String(a._id).localeCompare(String(b._id))).slice(0, limit);
}

module.exports = { jaccardSimilarity, searchFashions };
