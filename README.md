# CSI4107, Winter 2016 - Assignment 1

The following is our implementation of an Information Retrieval (IR) system based for a collection of Twitter messages, in which where we're submitting the top 1000 results of our system on a set of 49 test queries.

All data is found in `assets/`

## Team members

Ted Morin - 6860630

Sophie Le Page - 5992312

## Work distribution

To implement the IR system, we did peer programming outside of class and in class. Ted was the primary programmer and chose the programming language to code in. Sophie worked out what algorithms, data structures, and optimizations to use, and commented the code. Both team members worked on writing up documentation.

## Functionality

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

Using a unix based system, typing "make" in the source directory.
If you wish the trec_eval binary to be placed in a standard location, alter
the first line of Makefile appropriately.

Compare your results with the expected results, from the relevance feedback file, available here [qrels](http://www.site.uottawa.ca/~diana/csi4107/A1_2016/Trec_microblog11-qrels.txt)

In the source directory, the format for the command line is:    .\trec_eval trec_rel_file trec_top_file

Where trec_eval is the executable name for the code, trec_rel_file is the qrels, trec_top_file is the results file.  (Remember, you may have to specify the path for the trec_rel_file (qrels) and the trec_top_file (results) in the command line when running trec_eval.)

trec_eval compare results from the console are currently saved under trec_eval-results.txt

## Discussion

We based our implementation of the IR system using steps in the assignment guidelines. The following is an explanation of the algorithms, data structures, and optimizations that we used in each of the three steps, the first 10 answers to queries 1 and 25, as well as a discussion of our results.

### Step 1 - Preprocessing

To process the documents (Twitter messsages), we wrote a function called filterSentence() that takes a document and outputs an array of tokens. The filter function first uses the trim() method to remove whitespaces, then replaces anything the document that is not a letter with blank (''), then uses the toLowerCase() method to replace all upper case letters to lowercase, then uses the split method() to split the document on spaces (' ') to create tokens, and finally compares and removes tokens to the list of stop words provided.

We also used this filterSentence() function on all queries.

### Step 2 - Indexing

Next we built our vocabulary using a hash table called tokens. The hash table uses unique tokens (from the filtered documents) as an index , and then each token points to a structured array holding the document id (tweettime) that the token is used in as well as the word count of the token. The following logic was used to build our indexed vocabulary:

If a token is not in the vocabulary, add the token to the vocabulary. The new token will be used as a new index pointing to a structure holding the document id (tweettime) and the word count of token, in which the word count is initialized to 1.

If a token is in the vocabulary, and the document id is already being pointed to, increase word count by 1.

If a token is in the vocabulary, and the document id is not being pointed to, add the document id and initialize word count to 1.

### Step 3 - Retrieval and ranking

For ranking we used cosine similarity measure.

### First 10 answers to queries 1 and 25

### Discussion of our final results
