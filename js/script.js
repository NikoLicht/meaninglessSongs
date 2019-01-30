//var WordPOS = require('wordpos'),
    //wordpos = new WordPOS()
let firstSentence = ""
let wikiText = ""
var rhymeScheme = []
let verses = []
let chorus = ""
let rhymePattern = ["A", "B", "A", "B"]
let wikiExtract = ""   

function generateSong(verses, versesBetweenChorus){
  let song = ""
  let versCounter = 0;
  for(var i = 0; i > verses; i++){
    song += generateVers()
    versCounter++
    if(versCounter >= versesBetweenChorus){
      if(chorus == ""){
        chorus = generateChorus()
      }
      else{
        song += chorus
      }
      versCounter = 0
    }
  }
  return song
}

function generateVers(){
  let vers = ""
  let indexUsed = -1 
  let usedLetters = []
  for(let letter of rhymePattern){
    if(usedLetters.includes(letter) == false){
      if(firstSentence == "" || firstSentence == undefined){
        console.log(wikiText)
        firstSentence = findSentence(wikiText)
      }
      //TODO: for each time this is done, it is gonna select the same rhyme
      getArrayWithRhymingWords(findLastWord(firstSentence))
      indexUsed ++
      usedLetters.push(letter)
    }
  }
  for(let i = 0; i < rhymePattern.length; i++){
    //TODO: this is just for testing
    let newSentence = generateSentence(selectRandomWord(0))
    vers += newSentence
    vers += "\n"
    console.log(`this is sentence number ${i}: ${newSentence}`) 
  }

  return vers
}

function generateChorus(){
  return "this is not a proper chorus"
}
      
function getWikipediaData(){
  let wikiUrl = "https://en.wikipedia.org/wiki/"
  let wikiWord = [
    "Banana",
    "Rhyme",
    "Word",
    "Language",
    "Song"
  ]
  wikiUrl += wikiWord[Math.floor(Math.random() * wikiWord.length)] 
  console.log(wikiUrl)
  wikiExtract = WIKIPEDIA.getData(wikiUrl, parseWiki) 
}

function parseWiki(data){
  console.log("parsing Data")
  wikiText = data.summary.description
  console.log(generateSong(2, 1));
  return wikiText 
}

function findSentence(text){
  let regularExpression =/\s+[^.!?\(\),]*[\W]/g  
  let matchArray = text.match(regularExpression) 
  //TODO: only using the first match
  let sentence = matchArray[0] 
  return sentence
}

function findLastWord(text){
  let regEx = /(\w+)/g
  let matchArray = text.match(regEx)
  console.log(matchArray)
  return matchArray[matchArray.length - 1]
}

function getArrayWithRhymingWords(word){
  const url = "https://api.datamuse.com/words?rel_rhy=" + word
  $.get(url, function(data, status){
    parseRhymingWords(data)
    console.log("STATUS: CALLING PARSER")
  })
}

function parseRhymingWords(wordsArray){
  let emptyArray = []
  rhymeScheme.push(emptyArray)
  for(let word of wordsArray){
    rhymeScheme[rhymeScheme.length-1].push(word["word"]) 
  } 
  console.log("parseFunction " + rhymeScheme[0][0])
  console.log(rhymeScheme)
}

function selectRandomWord(rhymeCategory){
  console.log("STATUS: SELECTING RANDOM WORD")
  console.log(rhymeScheme)
  console.log(rhymeScheme[rhymeScheme.length - 1])
  let randomIndex = Math.floor(Math.random()*rhymeScheme[rhymeCategory].length)
  console.log("magic index is: " + randomIndex)
  return rhymeScheme[rhymeCategory][randomIndex]
}

function generateSentence(lastWordInNewSentence){
  //TODO: Check how the sentence should be constructed.
  
  let sentence = "next rhyming word is "
  return sentence + lastWordInNewSentence
}

function main(){
  getWikipediaData()
}

main()
