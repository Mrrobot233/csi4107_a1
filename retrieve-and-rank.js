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

//function to calculate inverse document frequency (idf) for a term
const idf = (documentCount, relevantDocuments) =>
  Math.log2(documentCount / relevantDocuments)

//From word, passes number of total documents and document frequency for word
const wordToIdf = word =>
  idf(tweets.length, Object.keys(index[word]).length)

//Array of { term: {tf-idf: tf * idf value of term in document, document: id} }
const documentsByTerm = term => {
  const termIdf = wordToIdf(term)
  return Object.keys(index[term])
    .map(id => (
      { idf: index[term][id] * termIdf
      , document: id
      }
    ))
}

//Function for calculating length of documents and queries
const length = values => Math.sqrt(
    values.reduce((squaredSums, x) => squaredSums + Math.pow(x, 2), 0)
)

//Takes tokens from query, searches index for tokens
//Creates a tf vector for query
//Array of { tokens in query also in documents: tokens, freq of token in query}
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
  //Calculates maximum frequency of term in query
  const maximumCount =
    Object.keys(queryCounts).reduce((maximum, current) =>
      maximum > queryCounts[current] ? maximum : queryCounts[current], 0)
  //Reduces query terms to unique terms
  const uniqueTokens =
    Object.keys(
      tokens.reduce((list, token) => {
        list[token] = true
        return list
      }, {})
    ).sort()
  //Array of query terms and their idf values {query term: idf}
  const queryIdfs =
    uniqueTokens.reduce((idfs, token) => {
      idfs[token] = wordToIdf(token)
      return idfs
    }, {})
  //Function to calculte tf-idf values for query terms divided by max freq
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
