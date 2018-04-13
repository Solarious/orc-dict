# Orc-Dict
An online dictionary for the orcish language created by *Matt Vancil*
## Npm Scripts
* npm start - Start the server.
* npm test - Run the tests.
* npm run createUser - Promps for the username, email and password, then create the user.
* npm run removeUser - Promps for the username, then removes the user.
* npm run changePassword - Promps for the username and password, then changes the password for that user.
* npm run listUsers - Lists the username and email of all the users.
* npm run rebuildSearchIndexes - Removes then recreates all the Search Indexes in the database.
* npm run removeAllWords - Removes all the words in the database.
* npm run getDuplicateWords - Prints out all the words that share their orcish with another word.
* npm run testNyan - Like test, but more fun.
### Environment Variables
* PORT - The port used.
* PORT\_TESTING - The port used for testing.
* MONGODB\_URI - The URI of the mongodb server.
* MONGODB\_TESTING\_URI - The URI of the mongodb server for testing.
* SECRET\_KEY - The secret used by express-session to sign the session ID cookies.
* SENDGRID\_USERNAME - The username for sendgrid (used for sending password reset emails).
* SENDGRID\_API\_KEY - The api key for sendgrid.
* SIZE\_PER\_PART (optional) - The maximum number of search indexes that are created at once. A default value of 500 is used if this variable is not defined.
* WORK\_FACTOR (optional) - The word factor used by bcrypt. Has the default value of 12.
## Gulp Tasks
* js - Concats and uglifies the files from public/src into public/dist/app.min.js.
* js-debug - Same as above, but does not uglify or include public/src/app.production.js.
* watch - Watches the client js files and runs js when they change.
* watch-debug - Same as above, but runs js-debug instead.
* lint - Lints the project using jshint.
## File structure
* server.js - The entry point of the project.
* app - Contains all the server side code.
  * models - Contains the mongoose models.
    * [word.js](#appmodelswordjs) - Model for words.
    * user.js - User model.
    * [searchIndex.js](#appmodelssearchindexjs) - Model for Search Indexes. Used to assist searching for words by their orcish or by one of their conjugations/cases, and with affixes.
    * [sentence.js](#appmodelssentencejs) - Model for sentences.
    * [clan.js](#appmodelsclanjs) - Model for clans.
  * routes - Contains the routing code.
    * index.js - Joins all the other routing code together. Also responsible for setting the Cache-Control header, rejecting unauthorized users, sending the index page on all non /api/\* GET requests, and GET /api/routes.
    * wordRoutes.js - Routes for viewing and modifying words.
    * userRoutes.js - Routes for logging in and out, and handing users.
    * searchRoutes.js - Routes for searching.
    * autofillRoutes.js - Route for getting the conjugations/cases for a verb, noun or adjective.
    * bulkAddRoutes.js - Route for adding multiple words at once using a csv or tsv file.
    * statsRoutes.js - Route for getting statistics about words.
    * sentenceRoutes.js - Routes for viewing and modifying sentences.
    * clanRoutes.js - Routes for viewing and modifying clans.
  * authentication.js - Sets up the local strategy for passport.
  * [autofill.js](#appautofilljs) - Used to get the conjugations/cases for a verb, noun or adjective.
  * [bulkAdd.js](#appbulkaddjs) - Used to add multiple words at once using a csv or tsv file.
  * email.js - Used to send the password reset email.
  * errorHelper.js - Contains the function getBetterErrorMessage.
  * [indexes.js](#appindexesjs) - Used to create/remove/replace the Search Indexes.
  * sanitize.js - Middleware to reject requests with unsafe values.
  * [search.js](#appsearchjs) - Used for searching.
  * [stats.js](#appstatsjs) - Used to get statistics about the words.
  * [stopWords.js](#appstopwordsjs) - Used to find stop words and.
* public - Contains all the client side files.
  * index.html
  * stylesheet.css
  * libs - Contains client side packages. Generated and populated by bower.
  * bootstrap - Contains customized bootstrap code.
  * dist - Contains app.min.js, generated and populated by gulp.
  * src - Contains the Angular js files and html pages.
    * account - Code for forgot, login and reset password pages.
    * admin - Code for admin pages.
      * bulkAdd - Page for bulk add functionality.
      * edit - Page for editing a word.
      * extra - Page for extra operations not on the other pages.
      * new - Page for creating an new word.
      * stats - Page for displaying stats.
    * alert - Contains the alert service and directive.
    * clan - Contains all the clan pages for viewing and editing.
    * editable - Contains the editableWord directive, used for showing an editable version of a word.
    * grammar - Contains all the grammar pages.
    * layout - Contains the home page, and the root controller.
    * search - Contains the search page.
    * sentence - Contains the pages for viewing and editing sentences.
    * services - Contains factories for communicating with the server.
    * shared - Contains directives and filters used throughout the project.
      * fileDrop - Directive for allowing file drop.
      * italize - Italizes text enclosed with \*s by replacing the \*s with <em> and </em> tags.
      * modal - Directive for bootstrap modal.
      * pagnation - Responsize pagnation directive. Resizes itself to best fit its environment.
      * syrronize - Directive to display syrronic.
      * toSyrronic - Filter that replaces text with the syrronic unicode(s) equivalent.
      * wordsTable - Directive for loading and viewing words with filters and pagnation. Use attribute is-admin="true" to use version with edit and delete buttons.
    * stats - Contains pages for displaying statistics.
    * syrronic - Contains pages for the syrronic alphabet and converter.
    * word - Contains the word and wordsIndex pages, and directives used to display additional info required by specific parts of speech.
* scripts - Contains node scripts. Can be run using npm scripts.
* test - Contains tests, and testing data.
## Specific file information
### app/models/word.js
* Schema
  * orcish - The dictionary form of the word in orcish.
  * english - The meaning of the word in english.
  * PoS - Part of Speech (verb, noun, etc.).
  * num - An automatically generated number used to differentiate words with the same orcish.
  * orderedOrcish - The word's orcish with certain characters added or removed so that it can be used to order words the same way as in the book.
  * extraInfo (Optional) - Contains detailed english descriptions, historical information, and other useful info that doesn't fit anywhere else .
  * coindedBy (Optional) - The person who coined the word.
  * namedAfter (Optional) - What the word is named after.
  * noun/verb/adjective/pronoun/affix/copula - Object containing additional information required for words with certain parts of speech.
  * textIndexHelper (optional) - Object
    * english - Contains the stop words that can be used to find the word, separated by spaces.
    * language - Always has the value 'none'. Tells mongodb text search that textIndexHelper.english uses language 'none'.
* Static functions
  * insertManyWithRetry(words) - Saves all the words. If a word has a duplicate key error, regenerates its 'num' value and attempts to insert it again. Returns an object with the keys successes and failues. Successes contains an array of words that were successfully saved. Failures contains an array of objects that containng the associated word and error message (as errorMessage).
### app/models/searchIndex.js
Used to assist searching for words by their orcish or by one of their conjugations/cases, and with affixes.  Each word has a search index generated for their orcish (multiple if it has spaces), and one for each case/number/gender/etc. combination. Functions for their creation are in [app/indexes.js](#appindexesjs), and functions for searching with Search Indexes are in [app/search.js](#appsearchjs).
* Schema
  * Keyword - The string that matches this search index.
  * Priority - Used for sorting indexes by priority. Lower equals higher priority. Generally, indexes have priority 1 for orcish, priority 2 for case/number/gender/etc. combinations, priority 3 for agents, gerunds and participles, and priority 4 for affixes.
  * message - Describes how the keyword relates to the word e.g. *masculine nominative singular*.
  * word - Contains the orcish, english, PoS and num of the word this index is for.
  * affix - Either 'none', 'prefix' or 'suffix'.
  * affixLimits - If affix is 'prefix' or 'suffix', lists the parts of speech a word must have to be matches with the affix.
### app/models/sentence.js
* Schema
  * Orcish - The sentence in orcish.
  * English - The sentence in english.
  * Category - The category of the sentence.
  * submittedBy (optional) - The person who submitted the sentence.
* Static functions
  * bulkAdd(data) - Used for adding a large number of sentences in csv format.
    * data - A string containing the words to be added in csv format.
	```
	Valid formats:
	"category","english","orcish"
	"category","english","orcish","submittedBy"
	```
### app/models/clan.js
* Schema
  * name - The name of the clan.
  * orderingName - The clan name, but without a 'The ' at the start. Used for ordering clans.
  * orcishName - The name of the clan in orcish. If the same as the name, indicates that the clan only has an orcishName.
  * foundedBy (optional) - Who founded the clan.
  * shortDesc - A short description of the clan.
  * history - An array of paragraphs describing the history of the clan.
  * customs - An array of paragraphs describing the customs of the clan.
  * relations - An array of paragraphs describing the relations of the clan with others.
### app/autofill.js
* autofill(orcish, PoS) - Generates and returns the noun/verb/adjective part for a word. Will throw error.
* autofillAsync(orcish, PoS) - As above, but returns a Promise.
### app/bulkAdd.js
* bulkAdd(data, encoding, method, order) - Used for adding a large number of words in csv or tsv format.
  * data - A string containing the words to be added in csv or tsv format.
  * encoding - Either 'csv' or 'tsv'. Specifies the format of data.
  * method - Must be 'duplicate', 'unique' or 'remove'.
    * duplicate - All words are added, regardless of if a word with the same Orcish and Part of Speech exists. Can result in unwanted duplication of words .
    * unique - If a word with the same Orcish and Part of Speech already exists, it will not be added.
    * remove - All words with the same Orcish and Part of Speech as a word to be added is first removed. This will result in information such as Extra Info and Coined By being lost for the replaced words.
  * order - Either 'e-o-p' or 'o-p-e'. Specifies the order of the orcish, english and PoS columns.
    * e-o-p - English, Orcish, PoS.
    * o-p-e - Orcish, PoS, English.
  * In addition to the english, orcish and PoS values, the following additional value pairs can be added e.g. *"zsuleard","noun","ruby","n.a.","Julaire","c.b.","Julaire Andelin"*.
    * "d.f.","*value*" - Sets/appends to extraInfo "Derived from: *value*".
    * "c.b.","*value*" - Sets coinedBy to *value*.
    * "n.a.","*value*" - Sets namedAfter to *value*.
    * "n.a.c.b.","*value*" - Sets namedAfter and coinedBy to *value*.
    * "e.i.","*value*" - Sets/prepends *value* to extraInfo.
    * "p.i.","*type number nominative gentitive dative accusative vocative*" - Sets the values in word.pronoun to those given.
    * "c.i.","*values*" - Sets the the values in word.copula to those given. Because the format for *values* is rather verbose, please read the code in the function addCopulaInfo for the actual format.
### app/indexes.js
* rebuild() - Removes then rebuilds all the search indexes.
* forCreace(word) - Builds the search indexes for the given word.
* forUpdate(prevOrcish, prevNum, word) - Removes all the search indexes for the word with orcish 'prevOrcish' and num 'prevNum', then builds the search indexes for word.
* forRemove(word) - Removes all the search indexes for the given word.
* forRemoveByPoS(PoS) - Removes all the search indexes for words with the given PoS (part of speech). If PoS is 'all', instead removes all the search indexes.
* forInsertMany(words) - Builds the search indexes for the given words.
* forReplaceMany(words) - Removes all words with the same orcish and PoS as any of the given words, then adds all the search indexes for the given words.
* Note - rebuild(), forInsertMany() and forReplaceMany() can have a high memory usage. Adjusting the environment variable SIZE\_PER\_PART to fix memory issues.
### app/search.js
* getMatches(text) - For each word/quoted string in text, finds words that have a matching orcish/case. Will also find the affixes used.
* getTextMatches(text) - Searches through through the english, extraInfo, coinedBy and namedAfter fields of the words for text matches. Uses stop word removal and stemming to improve results. If a word has textIndexHelper, searches through textIndexHelper.english without using stop word removal.
### app/stats.js
* get() - Returns the PoS statistics using a promise. Using caching.
* setNeedsUpdate() - Tells stats that the PoS statistics cache is now invalid. This function should be called when words is modified.
* getKeywords(sortByWords, from, to) - Returns the keyword statistics using a promise. Using caching.
* setKeywordsNeedsUpdate() -  Tells stats that the PoS statistics cache is now invalid. This function should be called when the indexes are modified.
### app/stopWords.js
* isStopWord(wordStr) - Return true if wordStr is a stop word, otherwise false.
* getLangNone(english, PoS) - Given a word's english and PoS values, return the textIndexHelper.english value the word should have. A return value of "" indicates that the word does not need textIndexHelper.
