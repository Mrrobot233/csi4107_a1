import fs from 'fs'

// Queries
const queries =
  JSON.parse(fs.readFileSync('./assets/queries.json', 'utf8'))

// Inverted index
const index =
  JSON.parse(fs.readFileSync('./assets/index.json', 'utf8'))

// Tweet array
const tweets =
  JSON.parse(fs.readFileSync('./assets/tweets.json', 'utf8'))

// Words by Tweet ID
const wordsInTweets =
  JSON.parse(fs.readFileSync('./assets/words_per_tweet.json', 'utf8'))

const countWord = (index, word) => Object.keys(index[word])
    .reduce((count, key) => count + index[word][key], 0)

const mostCommonVocabulary = () =>
  Object.keys(index).sort((wordA, wordB) => {
    const a = index[wordA]
    const b = index[wordB]
    const aCount =
      Object.keys(a).reduce((count, key) => count + a[key], 0)
    const bCount =
        Object.keys(b).reduce((count, key) => count + b[key], 0)
    return bCount - aCount
  })

const idf = (documentCount, relevantDocuments) =>
  Math.log2(documentCount / relevantDocuments)

const wordToIdf = word =>
  idf(tweets.length, Object.keys(index[word]).length)

const documentsByTerm = term => {
  const termIdf = wordToIdf(term)
  return Object.keys(index[term])
    .map(id => (
      { idf: index[term][id] * termIdf
      , document: id
      }
    ))
}

const length = values => Math.sqrt(
    values.reduce((squaredSums, x) => squaredSums + Math.pow(x, 2), 0)
)

const search = ({ tokens: unfilteredTokens, num }) => {
  const tokens =
    unfilteredTokens.filter(token => index[token])
  const queryCounts =
    tokens.reduce((counts, token) => {
      counts[token] =
        counts[token] ? counts[token] + 1 :
          1
      return counts
    }, {})
  const maximumCount =
    Object.keys(queryCounts).reduce((maximum, current) =>
      maximum > queryCounts[current] ? maximum : queryCounts[current], 0)
  const uniqueTokens =
    Object.keys(
      tokens.reduce((list, token) => {
        list[token] = true
        return list
      }, {})
    ).sort()
  const queryIdfs =
    uniqueTokens.reduce((idfs, token) => {
      idfs[token] = wordToIdf(token)
      return idfs
    }, {})
  const weightedQueryIdfs =
    uniqueTokens
      .reduce((weighted, token) => {
        weighted[token] = queryIdfs[token] * queryCounts[token] / maximumCount
        return weighted
      }, {})
  const lengthOfQuery = length(Object.keys(weightedQueryIdfs)
    .map(key => weightedQueryIdfs[key]))

  const documentIdfs =
    uniqueTokens.reduce((idfs, token) => {
      documentsByTerm(token).forEach(({ idf, document }) => {
        if (idfs[document]) {
          idfs[document].push({ idf, token })
        } else {
          idfs[document] = [{ idf, token }]
        }
      })
      return idfs
    }, {})

  const documentLengths =
    Object.keys(documentIdfs)
      .reduce((lengths, id) => {
        lengths[id] = length(documentIdfs[id].map(x => x.idf))
        return lengths
      }, {})

  const documentCosSimilarities =
    Object.keys(documentIdfs)
      .reduce((cosSimilarities, id) => {
        cosSimilarities[id] =
          (documentIdfs[id]
            .reduce((sum, { idf: documentIdf, token: documentToken }) =>
              sum + documentIdf * weightedQueryIdfs[documentToken], 0)) /
          (documentLengths[id] * lengthOfQuery) *
          // Account for document length, 1% value
          (.01 * (documentIdfs[id].length / wordsInTweets[id]) + .99)
        return cosSimilarities
      }, {})
  const sortedResults =
    Object.keys(documentIdfs)
      .map(tweetId => (
        { tweetId
        , score: documentCosSimilarities[tweetId]
        , queryId: num
        }
      ))
      .sort((a, b) => b.score - a.score)
      .map((result, i) => Object.assign(result, { rank: i + 1 }))
  return sortedResults
}

const writeTRECFile = results => {
  const TREC =
    results.reduce((toWrite, { tweetId, score, queryId, rank }) =>
      `${toWrite}${queryId} Q0 ${tweetId} ${rank} ${score} SofixaTed\n`, '')
  fs.writeFile('./results.TREC', TREC, err => {
    if (err) throw err
    console.info('Wrote ./results.TREC!')
  })
}

const totalResults =
  queries
    .reduce((list, query) =>
      list.concat(search(query).slice(0, 1000)), [])

writeTRECFile(totalResults)
