function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}

function removeAccents(str) {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

function round(num, fragtionDigits = 2) {
  let m = 10;
  while (fragtionDigits--) {
    m *= 10;
  }
  return Math.round((num + Number.EPSILON) * m) / m;
}

function getFreqs(str) {
  // Step 1: copy table data to variable

  // Step 2: get key-value
  let a = str.split("\n");
  a = a.map((_) => _.split("	"));
  a = a.map((_) => [_[0], Number(_[1].split(" ")[0]) / 100]);

  // Step 3: remove vietnamese tones
  let freq = {};
  for (let _ of a) {
    let c = removeAccents(_[0]);
    if (freq[c]) {
      freq[c] += _[1];
    } else {
      freq[c] = _[1];
    }
  }

  // Step 4: round values
  for (let key in freq) {
    freq[key] = round(freq[key], 5);
  }

  // Step 5: convert to array
  let freqArr = [];
  for (let key in freq) {
    freqArr.push(freq[key]);
  }

  console.log(freqArr);
  return freqArr;
}

// https://www.sttmedia.com/characterfrequencies
// https://www.sttmedia.com/characterfrequency-vietnamese
let vietnamese = `A	5.29 %
Ă	0.23 %
Ấ	0.63 %
À	2.47 %
Ậ	0.32 %
Á	1.20 %
Ã	0.68 %
Ặ	0.22 %
Ầ	0.42 %
Ẩ	0.04 %
Ả	0.58 %
Ẫ	0.07 %
Â	0.41 %
Ắ	0.28 %
Ằ	0.18 %
Ẳ	0.02 %
Ẵ	0.01 %
B	1.50 %
C	6.71 %
D	0.88 %
Đ	3.09 %
E	1.45 %
Ẽ	0.18 %
Ề	0.39 %
Ẹ	0.11 %
Ể	0.59 %
Ễ	0.06 %
Ế	0.79 %
Ê	0.61 %
Ệ	0.34 %
Ẻ	0.05 %
É	0.07 %
F	0.12 %
G	5.29 %
H	7.95 %
I	5.71 %
Ì	0.54 %
Í	0.26 %
Ị	0.21 %
Ỉ	0.13 %
Ĩ	0.08 %
J	0.14 %
K	1.32 %
L	1.90 %
M	2.97 %
N	11.01 %
O	2.32 %
Ỏ	0.12 %
Ộ	0.99 %
Ờ	0.59 %
Ở	0.29 %
Ợ	0.58 %
Ổ	0.14 %
Ọ	0.42 %
Ô	1.67 %
Ỗ	0.06 %
Ỡ	0.03 %
Ớ	0.63 %
Ố	0.66 %
Ồ	0.16 %
Ơ	0.32 %
P	1.06 %
Q	0.34 %
R	2.32 %
S	1.56 %
T	6.60 %
U	2.42 %
Ự	0.29 %
Ũ	0.10 %
Ư	1.59 %
Ử	0.12 %
Ữ	0.33 %
Ừ	0.19 %
Ụ	0.18 %
Ủ	0.86 %
Ứ	0.27 %
V	2.12 %
W	0.10 %
X	0.33 %
Y	1.39 %
Ý	0.10 %
Z	0.04 %`;

getFreqs(vietnamese);
