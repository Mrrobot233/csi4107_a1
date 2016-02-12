# CSI4107, Winter 2016 - Assignment 1

## Team members

Theodore Morin - 6860630

Sophie Le Page - 5992312

## Work distribution

To implement the IR system, we did peer programming outside of class and in class. Ted was the primary programmer and chose the programming language to code in. Sophie worked out what algorithms, data structures, and optimizations to use, and commented the code. Both team members worked evaluating the IR system using the `trec_eval` script and on writing up documentation.

## Functionality

The following is our implementation of an Information Retrieval (IR) system based for a collection of Twitter messages, in which we're submitting the top 1000 results of our system on a set of 49 test queries.

Our IR system is written in ES6+ JavaScript.

Our system takes in the following files as inputs: `queries.txt`, `tweets.txt`, and `stopwords.txt` (all of which were provided to us), and outputs an index of vocabulary (`index.json`), and a retrieval and ranking results file (`results.TREC`).

Note all data is found in `assets/`

## Get up and running

```
git clone https://github.com/morinted/csi4107_a1.git
cd csi4107_a1
npm install
npm run index
npm run rank
```

**Index** reads through the given assignment attachments, then creates the inverse index, and writes a few files for consumption.

**Rank** takes the reverse index, tweets, and queries, then performs all the searches, and writes the output to the TREC file.

### ESLint

In your editor, preferably [Atom](http://atom.io) or [Sublime Text 3](http://sublimetext.com), make sure to install a package for "eslint" in order to have your JavaScript validated by the rules defined in the `.eslintrc`

### trec_eval

TRECEVAL is a program to evaluate TREC results using the standard, NIST evaluation procedures.

Download trec_eval script from [trec_eval](http://trec.nist.gov/trec_eval/)

Using a unix based system, running `make` in the source directory.
If you wish the `trec_eval` binary to be placed in a standard location, alter
the first line of Makefile appropriately.

Compare your results with the expected results, from the relevance feedback file, available here [qrels](http://www.site.uottawa.ca/~diana/csi4107/A1_2016/Trec_microblog11-qrels.txt)

In the source directory, the format for the command line is:
`.\trec_eval trec_rel_file trec_top_file`

Where `trec_eval` is the executable, `trec_rel_file` is the `qrels`, `trec_top_file` is the results file.  Remember, you may have to specify the path for the `trec_rel_file` (qrels) and the `trec_top_file` (results) in the command line when running trec_eval.

`trec_eval` compare results from the console are currently saved under
`trec_eval-results.txt`

## Discussion

We based our implementation of the IR system using steps in the assignment guidelines. The following is an explanation of the algorithms, data structures, and optimizations that we used in each of the three steps, as well as the first 10 answers to queries 1 and 25 and a discussion of our results.

### Step 1 - Preprocessing

To process the documents (Twitter messsages), we wrote a function called `filterSentence()` that takes a document and outputs an array of tokens. The filter function first uses the `trim()` method to remove whitespaces, replaces anything that is not a letter with blank (''), uses the `toLowerCase()` method to replace all uppercase letters to lowercase, uses the `split()` method to split the document on spaces `(' ')` to create tokens, and finally compares and removes tokens to the list of stop words provided.

This `filterSentence()` function is also used on all queries.

### Step 2 - Indexing

Next we built our vocabulary using a hash table. The hash table uses unique tokens (from the filtered documents) as an index, and then each token points to an array holding the document id (`tweettime`) that the token is in as well as the frequency of the token in the document. The following logic was used to build our indexed vocabulary:

Example structure of our index:

```
cat: {'29026473444646912': 1}, {'29645836442927104': 3},
dog: {'3322264097810841': 4}, {'31791717313159168': 1}, {'29570360991023105': 2},
etc..
```

Where `cat` is a token, `29026473444646912` is the document id (`tweettime`) that the token appears in, and 1 is the word count of the token in the document.

Our vocabulary holds 92234 tokens.

### Step 3 - Retrieval and ranking

Using our index, we found the set of documents that contain at least one of the query words and computed the similarity scores between the query and each document using cosine similarity measure. We also accounted for document length, in relation to number of relevant words, with 1% value. We ranked the documents in decreasing order of similarity scores and only kept the top 1000 results.

### First 10 answers to queries 1 and 25

#### Query 1

    1 Q0 30260724248870912 1 0.9962500000000002 SofixaTed
    1 Q0 30198105513140224 2 0.9434586983328701 SofixaTed
    1 Q0 30167063326629888 3 0.8810010171480104 SofixaTed
    1 Q0 30016851715031040 4 0.8804376272089868 SofixaTed
    1 Q0 30275282464153600 5 0.8802404407303286 SofixaTed
    1 Q0 30016488928706560 6 0.8799446610123413 SofixaTed
    1 Q0 30236884051435520 7 0.8436187008999181 SofixaTed
    1 Q0 32158658863304705 8 0.842207967286373 SofixaTed
    1 Q0 30303184207478784 9 0.842207967286373 SofixaTed
    1 Q0 ﻿34952194402811904 10 0.842207967286373 SofixaTed

##### Query 25

    25 Q0 31286354960715777 1 0.9929999999999999 SofixaTed
    25 Q0 31550836899323904 2 0.9924999999999998 SofixaTed
    25 Q0 31738694356434944 3 0.9923076923076922 SofixaTed
    25 Q0 32609015158542336 4 0.9919999999999999 SofixaTed
    25 Q0 31320463862931456 5 0.8952702391822849 SofixaTed
    25 Q0 32528974961713152 6 0.893904665297016 SofixaTed
    25 Q0 30093525102108674 7 0.8935535177265183 SofixaTed
    25 Q0 32685391781830656 8 0.8934676816537299 SofixaTed
    25 Q0 32541161675558912 9 0.8447905631011456 SofixaTed
    25 Q0 29974357501550592 10 0.7917468960398085 SofixaTed

### Discussion of our final results

The following is the evaluation of our system using `trec_eval` script by comparing our results (`results.TREC`) with the expected results from the provided relevance feedback file (`qrels.txt`).

```
runid                     all    SofixaTed
num_q                     all    49
num_ret                   all    38260
num_rel                   all    2640
num_rel_ret               all    2161
map                       all    0.2755
gm_map                    all    0.2008
Rprec                     all    0.3072
bpref                     all    0.2839
recip_rank                all    0.6363
iprec_at_recall_0.00      all    0.7016
iprec_at_recall_0.10      all    0.5212
iprec_at_recall_0.20      all    0.4395
iprec_at_recall_0.30      all    0.3871
iprec_at_recall_0.40      all    0.3523
iprec_at_recall_0.50      all    0.3070
iprec_at_recall_0.60      all    0.2262
iprec_at_recall_0.70      all    0.1879
iprec_at_recall_0.80      all    0.1337
iprec_at_recall_0.90      all    0.0777
iprec_at_recall_1.00      all    0.0261
P_5                       all    0.4082
P_10                      all    0.3592
P_15                      all    0.3429
P_20                      all    0.3235
P_30                      all    0.3014
P_100                     all    0.1884
P_200                     all    0.1376
P_500                     all    0.0776
P_1000                    all    0.0441
```

Here, we mostly want to look at "map" and "P_5" as the canaries for the value of our results. Particularly, map represents an overall performance of our searching. It's only 27.5%, but considering our limited data (42,000 tweets, short documents), we'd think this is pretty good. Without our additional weighting on the document length, we were able to get the map value slightly higher (28%), but the "P_5" went down, and we feel it's more valuable to get the most relevant results correct than the map for less relevant documents.