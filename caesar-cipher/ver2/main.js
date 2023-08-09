// Original source code from https://www.nayuki.io/page/automatic-caesar-cipher-breaker-javascript

// Unigram model frequencies for letters A, B, ..., Z
const FREQS = {
  VIETNAMESE: [
    0.1305, 0.015, 0.0671, 0.0397, 0.0464, 0.0012, 0.0529, 0.0795, 0.0693,
    0.0014, 0.0132, 0.019, 0.0297, 0.1101, 0.0898, 0.0106, 0.0034, 0.0232,
    0.0156, 0.066, 0.0635, 0.0212, 0.001, 0.0033, 0.0149, 0.0004,
  ],
  ENGLISH: [
    0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015, 0.06094,
    0.06966, 0.00153, 0.00772, 0.04025, 0.02406, 0.06749, 0.07507, 0.01929,
    0.00095, 0.05987, 0.06327, 0.09056, 0.02758, 0.00978, 0.0236, 0.0015,
    0.01974, 0.00074,
  ],
};

const COMMON = {
  VIETNAMESE:
    "ch,gh,kh,ng,ngh,nh,ph,th,tr,gi,qu,oa,oe,uy,ue,ic,ich,im,in,inh,ip,it,uc,un,ung,ut,um,up,ech,em,en,enh,ep,et,om,on,op,ot,ac,am,an,ang,ap,at,oc,ong,ec,eng,ach,anh,eo,ao,ai,oi,eu,ia,iu,ui,uu,ua,ay,au,oac,oam,oan,oat,oang,uan,uat,uang,ieu,iec,iem,ien,iep,iet,ieng,yeu,yem,yen,uoi,uoc,uom,uon,uop,uot,uong",
};

/*---- Core functions ----*/

// Returns the entropies when the given string is decrypted with all 26 possible shifts,
// where the result is an array of pairs (int shift, float enptroy) - e.g. [[0, 2.01], [1, 4.95], ..., [25, 3.73]].
function getAllEntropies(str, freqs) {
  let result = [];
  for (let i = 0; i < 26; i++)
    result.push([i, getEntropy(decrypt(str, i), freqs)]);
  return result;
}

// https://tonydeep.github.io/tensorflow/2017/07/07/Cross-Entropy-Loss.html
// hay hon ne: https://forum.machinelearningcoban.com/t/hieu-ve-entropy/4443
// Returns the cross-entropy of the given string with respect to the language unigram frequencies, which is a positive floating-point number.
function getEntropy(str, freqs) {
  let sum = 0;
  let ignored = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (65 <= c && c <= 90) sum += Math.log(freqs[c - 65]);
    // Uppercase
    else if (97 <= c && c <= 122) sum += Math.log(freqs[c - 97]);
    // Lowercase
    else ignored++;
  }
  return -sum / Math.log(2) / (str.length - ignored);
}

// Decrypts the given string with the given key using the Caesar shift cipher.
// The key is an integer representing the number of letters to step back by - e.g. decrypt("EB", 2) = "CZ".
function decrypt(str, key) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (65 <= c && c <= 90)
      result += String.fromCharCode(mod(c - 65 - key, 26) + 65);
    // Uppercase
    else if (97 <= c && c <= 122)
      result += String.fromCharCode(mod(c - 97 - key, 26) + 97);
    // Lowercase
    else result += str.charAt(i); // Copy
  }
  return result;
}

/*---- Utilities ----*/

function clearChildren(node) {
  while (node.firstChild !== null) node.removeChild(node.firstChild);
}

function appendElem(container, tagName, text) {
  let result = document.createElement(tagName);
  if (text !== undefined) result.textContent = text;
  return container.appendChild(result);
}

function mod(x, y) {
  return ((x % y) + y) % y;
}

let app = new (function () {
  let cipherElem = document.getElementById("cipher");
  let originalElem = document.getElementById("original");
  let langElem = document.getElementById("language");
  let shiftElem = document.getElementById("shift");
  let guessesElem = document.getElementById("guesses");

  /*---- User interaction functions ----*/

  this.doClear = function () {
    outputState = null;
    shiftElem.textContent = "";
    clearChildren(guessesElem);
  };

  let outputState = null;

  this.doBreak = function () {
    outputState = {};
    outputState.inputText = cipherElem.value;
    outputState.language = langElem.value;

    outputState.entropies = getAllEntropies(
      outputState.inputText,
      FREQS[outputState.language]
    );
    outputState.entropies.sort(function (x, y) {
      // Compare by lowest entropy, break ties by lowest shift
      if (x[1] != y[1]) return x[1] - y[1];
      else return x[0] - y[0];
    });

    // Decrypt using lowest entropy shift
    outputState.shift = outputState.entropies[0][0];
    this.doShift(0);
  };

  this.doShift = function doShift(delta) {
    if (outputState === null) return;

    outputState.shift = mod(outputState.shift + delta, 26);
    originalElem.value = decrypt(outputState.inputText, outputState.shift);
    shiftElem.textContent = outputState.shift.toString();

    // Build table of best guesses
    clearChildren(guessesElem);
    let maxEntropy = outputState.entropies[outputState.entropies.length - 1][1];
    outputState.entropies.forEach(function (item, index) {
      let tr = appendElem(guessesElem, "tr");
      if (item[0] == outputState.shift) tr.classList.add("active");
      tr.onclick = function () {
        doShift(item[0] - outputState.shift);
      };

      appendElem(tr, "td", item[0].toString());
      appendElem(tr, "td", item[1].toFixed(3));

      let td = appendElem(tr, "td");
      let div = appendElem(td, "div");
      div.classList.add("bar");
      div.style.width = ((item[1] / maxEntropy) * 30).toFixed(6) * 2 + "px";
    });
  };
})();

app.doBreak();
