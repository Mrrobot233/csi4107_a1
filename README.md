# CSI4107 Assignment 1

The data is found in `assets/`

## Team members

Ted Morin - 6860630

Sophie Le Page - 5992312

## Work distribution

Program was done through peer programming. Ted was the primary programmer. Sophie worked on trec_eval, commenting code, and documentation

## Functionality

## Explanation

Explain the algorithms, data structures, and optimizations that you used in each of the three steps. How big was the vocabulary? Include a sample of 100 tokens from your vocabulary. Include the first 10 answers to queries 1 and 25. Discuss your final results.

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

## ESLint

In your editor, preferably [Atom](http://atom.io) or [Sublime Text 3](http://sublimetext.com), make sure to install a package for "eslint" in order to have your JavaScript validated by the rules defined in the `.eslintrc`

## trec_eval
TRECEVAL is a program to evaluate TREC results using the standard, NIST evaluation procedures.

Download trec_eval script from [trec_eval](http://trec.nist.gov/trec_eval/)

Using a unix based system, typing "make" in the source directory.
If you wish the trec_eval binary to be placed in a standard location, alter
the first line of Makefile appropriately.

Compare your results with the expected results, from the relevance feedback file, available here [qrels](http://www.site.uottawa.ca/~diana/csi4107/A1_2016/Trec_microblog11-qrels.txt)

In the source directory, the format for the command line is:    .\trec_eval trec_rel_file trec_top_file

Where trec_eval is the executable name for the code, trec_rel_file is the qrels, trec_top_file is the results file.  (Remember, you may have to specify the path for the trec_rel_file (qrels) and the trec_top_file (results) in the command line when running trec_eval.)

trec_eval compare results from the console are currently saved under trec_eval-results.txt
