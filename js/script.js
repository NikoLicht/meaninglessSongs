let wikiExtract = WIKIPEDIA.getData('https://en.wikipedia.org/wiki/Rhyme', parseWiki) 
var firstSentence = ""

function parseWiki(data){
  console.log("parseWiki") 
  console.log(data.summary.description) 
  console.log(findSentence(data.summary.description)) 
  firstSentence = findSentence(data.summary.description)
  console.log("first sentence :" + firstSentence)
  console.log("last word in sentence: " + findLastWord(firstSentence))
}

function findSentence(text){
  let regularExpression =/\s+[^.!?\(\),]*[\W]/g  
  let matchArray = text.match(regularExpression) 
  let sentence = matchArray[0] 
  return sentence
}

function findLastWord(text){
  let regEx = /(\w+)/g
  let matchArray = text.match(regEx)
  console.log(matchArray)
  return matchArray[matchArray.length - 1]
}

function getArrayWithRhymingWords(text){
  const url = "https://api.datamuse.com/words?rel_rhy=" + text
  $.get(url, function(data, status){
    parseRhymingWords(data)
  })
}

function parseRhymingWords(wordsArray){
  for(let word of wordsArray){
    console.log(word["word"])
  }
}
