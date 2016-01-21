import fs from 'fs'
import { parseString } from 'xml2js'

// All queries in XML
const xmlQueries =
  fs.readFileSync('./assets/queries.txt', 'utf8')
    .split('\n\n')

// Array of stop words (strings)
const stopWords =
  fs.readFileSync('./assets/stopwords.txt', 'utf8')
    .split('\n')

// Array of { time: num ms, tweet: 'string' }
const tweets =
  fs.readFileSync('./assets/tweets.txt', 'utf8')
    .split('\n')
    .map(tweet => tweet.split('\t'))
    .map(([ time, tweet ]) => ({ time, tweet }))

// Do everything in here:
async function main () {
  // Parse all the XML strings
  const queryPromises =
    xmlQueries.map(query =>
      (new Promise((resolve, reject) => {
        parseString(query, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      }))
    )
  const queries =
    (await Promise.all(queryPromises)) // parsing...
      .filter(x => x) // gets rid of null entries
      .map(x => x.top) // remove the <top> tag
      .map(({ num, title, querytime, querytweettime }) => (
        // Get rid of spacing for all the properties
        { num: num[0].trim().substring(8) // MB048
        , title: title[0].trim()
        , time: querytime[0].trim()
        , tweetTime: querytweettime[0].trim()
        }
      )
    )
  console.log(JSON.stringify(queries, null, 2))
  // Now we have:
  // array of stop words: stopWords
  // array of tweets: tweets (tweets[0].time, tweets[0].tweet)
  // array of queries: queries (queries[0].num, title, time, tweetTime)
}

main()
