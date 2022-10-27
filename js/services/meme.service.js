const MEME_KEYWORDS = ['Funny', 'Animal', 'Men', 'Women', 'Comic', 'Smile']

let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

let gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }];
let gMeme = {
  selectedImgId: 5,
  selectedLineIdx: 0,
  isDrag: false,
  lines: [
    {
      txt: 'I sometimes eat Falafel',
      fontSize: 20,
      fontFamily: 'Impact',
      textAlign: 'left',
      stroke: 'black',
      color: 'red',
      pos: { x: 0, y: 0 },
      txtWidth: 300
    }
  ]
}

function setIsDrag(drag) {
  gMeme.isDrag = drag
}

function getIsDrag() {
  return gMeme.isDrag
}

function getImgs() {
  return gImgs
}

function getImgById(id) {
  return gImgs.find(img => img.id === id)
}

function getMeme() {
  return gMeme
}

function setSelectedImgId(id) {
  gMeme.selectedImgId = id
}

function setSelectedLineIdx(idx) {
  gMeme.selectedLineIdx = idx
}

function selectNextLine() {
  gMeme.selectedLineIdx += 1
  if (gMeme.selectedLineIdx === gMeme.lines.length)
    gMeme.selectedLineIdx = 0
}

function getSelectedLine() {
  const { selectedLineIdx, lines } = gMeme
  return lines[selectedLineIdx]
}

function setLineTxt(txt, txtWidth) {
  const idx = gMeme.selectedLineIdx
  gMeme.lines[idx].txt = txt
  gMeme.lines[idx].txtWidth = txtWidth
}

function setLineAlignment(line, x, align) {
  line.pos.x = x
  line.textAlign = align
}

function getRandomMemeWords() {
  const words = []
  const rndWordCount = getRandomIntInclusive(0, 5)
  for (let i = 0; i < rndWordCount; i++) {
    const rndIdx = getRandomIntInclusive(0, MEME_KEYWORDS.length - 1)
    words.push(MEME_KEYWORDS[rndIdx])
  }

  return words
}

function getLineIdxByCoords(x, y) {
  return gMeme.lines.findIndex(({ txtWidth, fontSize: txtHeight, pos }) =>
    isRectClicked(x, y, pos.x, pos.y, txtWidth, txtHeight))
}

function isTextLinePos(x, y) {
  return gMeme.lines.some(({ txtWidth, fontSize: txtHeight, pos }) =>
    isRectClicked(x, y, pos.x, pos.y, txtWidth, txtHeight))
}

function addTextLine(txt, txtWidth, fontSize, fontFamily,
    textAlign, stroke, color, pos) {

  const newIdx = gMeme.lines.push({
    txt, txtWidth, fontSize,
    fontFamily, textAlign, stroke,
    color, pos,
  })
  setSelectedLineIdx(newIdx - 1)
}

function moveTextLine(dx, dy) {
  const idx = gMeme.selectedLineIdx
  gMeme.lines[idx].pos.x += dx
  gMeme.lines[idx].pos.y += dy
}

function removeTextLine() {
  const idx = gMeme.selectedLineIdx
  setSelectedLineIdx(-1)
  return gMeme.lines.splice(idx, 1)[0]
}

function createMemeImg(url, keywords) {
  return {
    id: makeId(),
    url,
    keywords
  }
}

function doUploadImg(imgDataUrl, onSuccess) {
  const formData = new FormData()
  formData.append('img', imgDataUrl)

  const XHR = new XMLHttpRequest()
  XHR.onreadystatechange = () => {
    if (XHR.readyState !== XMLHttpRequest.DONE) return
    if (XHR.status !== 200) return console.error('Error uploading image')
    const { responseText: url } = XHR
    onSuccess(url)
  }
  XHR.onerror = (req, ev) => {
    console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
  }
  XHR.open('POST', 'https://ca-upload.com/here/upload.php')
  XHR.send(formData)
}
