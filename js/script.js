//var WordPOS = require('wordpos'),
    //wordpos = new WordPOS()
let firstSentence = ""
let wikiText = ""
var rhymeScheme = []
let verses = []
let chorus = ""
let rhymePattern = ["A", "B", "A", "B"]
let wikiExtract = ""   
let compiledSong = ""
let isParsingComplete = false
let currentRhyme = ""
let rhymeLookUp = {}
let songArray = []

function generateSong(verses, versesBetweenChorus){
  let song = ""
  let versCounter = 0;
  for(var i = 0; i > verses; i++){
    compiledSong += generateVers()
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
function addToSong(line){
  compiledSong += line + "\n"
  songArray.push(line)
  console.log("selected sentencen: " + line)
}

function generateVers(){
  let vers = ""
  let indexUsed = -1 
  let usedLetters = []
  let lineCounter = 0
  let verseArray = []
  for(let letter of rhymePattern){
    if(usedLetters.includes(letter) == false){
      let newLine = findSentence(wikiText)
      addToSong(newLine)
      lineCounter ++
      let lastWord = findLastWord(newLine)
      getArrayWithRhymingWords(lastWord)
      indexUsed ++
      usedLetters.push(letter)
      rhymeLookUp[letter] = indexUsed
    }
    else{
      let index = rhymeLookUp[letter] 
      waitUntilScriptHasParsed(index, function(){
        let newSentence = generateSentence(currentRhyme)
        vers += newSentence
        vers += "\n"
        addToSong(newSentence)
      })

    }
  }
  return vers
}

function waitUntilScriptHasParsed(index, callback){
  if(isParsingComplete == false){
    setTimeout(function(){
      waitUntilScriptHasParsed(index, callback)
    }, 1000)
  }else{
    if(rhymeScheme[0] == undefined){
      console.log("The rhymeScheme is not defined")
      waitUntilScriptHasParsed(index)
    }
    else{
      currentRhyme = selectRandomWord(index)
      callback()
      return selectRandomWord(index)
    }
  }
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
  generateSong(4,1)
  return wikiText 
}

function findSentence(text){
  let regularExpression =/\s+[^.!?\(\),]*[\W]/g  
  let matchArray = text.match(regularExpression) 
  //TODO: only using the first match
  let sentence = matchArray[Math.floor(Math.random()*matchArray.length-1)] 
  return sentence
}

function findLastWord(text){
  statusLog(" SEARCHING FOR LAST WORD")
  let regEx = /(\w+)/g
  let matchArray = text.match(regEx)
  console.log("selected word: " + matchArray[matchArray.length - 1])
  return matchArray[matchArray.length - 1]
}

function getArrayWithRhymingWords(word){
  console.log("STATUS RETRIEVING DATA FROM WIKI")
  const url = "https://api.datamuse.com/words?rel_rhy=" + word
  $.get(url, function(data, status){
    parseRhymingWords(data)
    statusLog(" CALLING PARSER")
  })
}

function parseRhymingWords(wordsArray){
  statusLog(" PARSING RHYMING WORDS")
  let wordList = []
  for(let word of wordsArray){
    wordList.push(word["word"]) 
  } 
  rhymeScheme.push(wordList)
  if(rhymeScheme[0] != undefined){
    isParsingComplete = true
  }
  else{
    console.log("ERROR ARRAY NOT CORRECT")
  }
 }

function selectRandomWord(rhymeCategory){
  statusLog(" SELECTING RANDOM WORD")
  let randomIndex = Math.floor(Math.random()*rhymeScheme[rhymeCategory].length)
  //console.log(rhymeScheme)
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

function statusLog(status){
  //console.log("STATUS: " + status.toUpperCase)
}

main()
