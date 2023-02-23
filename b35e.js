//import nice from './nice.txt';

const set63 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
				       'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
				       '0', '1', '2', '3', '4', '5', '6', '7', '8', '9','%'];
				       
const set16 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
				     
// "tes".split("").map((str) => {
//     return set63.indexOf(str).toString(2);
// });
				     
const s63ToBin6 = (strs) => {
  const arrOfStrs = strs.split("");
  //console.log("arrOfStrs:", arrOfStrs);
  
  const arrOf63 = arrOfStrs.map((str) => {
    return set63.indexOf(str);
  });
  //console.log("arrOf63:", arrOf63);
  
  const arrOfBin = arrOf63.map((i) => {
    return i.toString(2);
  });
  //console.log("arrOfBin:", arrOfBin);
  
  const arrOfBin6 = arrOfBin.map((bin) => {
    return ("0000000" + bin).substr(-6);
  });
  //console.log("arrOfBin6:", arrOfBin6);
  
  let bin6 = "";
  arrOfBin6.forEach((bin) => {
    bin6 += bin;
  });
  //console.log("bin6:", bin6);
  
  return bin6;
}

const s16ToBin4 = (strs) => {
  const arrOfStrs = strs.split("");
  //console.log("arrOfStrs:", arrOfStrs);
  
  const arrOf16 = arrOfStrs.map((str) => {
    return set16.indexOf(str);
  });
  //console.log("arrOf16:", arrOf16);
  
  const arrOfBin = arrOf16.map((i) => {
    return i.toString(2);
  });
  //console.log("arrOfBin:", arrOfBin);
  
  const arrOfBin4 = arrOfBin.map((bin) => {
    return ("00000" + bin).substr(-4);
  });
  //console.log("arrOfBin4:", arrOfBin4);
  
  let bin4 = "";
  arrOfBin4.forEach((bin) => {
    bin4 += bin;
  });
  //console.log("bin4:", bin4);
  
  return bin4;
}

const binToB85 = (bin) => {
  let arrOfBin32 = [], temp = "";
	for (let i=0; i < bin.length; i++) {
		if(i%32<31){
			temp += bin[i];
		} else {
			temp += bin[i];
			arrOfBin32.push(temp);
			temp = "";
		}
	}
	if(temp.length > 0) arrOfBin32.push(temp);
	//console.log("arrOfBin32:", arrOfBin32);
	
	const arrOfDec32 = arrOfBin32.map((val) => {
		if(val.length < 32) {
			let tp = val;
			while(tp.length < 32) {
				tp += "0";
			}
			return parseInt(tp, 2);
		} else {
		  return parseInt(val, 2);
		}
	});
	//console.log("arrOfDec32:", arrOfDec32)
	
	const arrOfB85 = arrOfDec32.map((val) => {
	  let tp = [], carry;
		tp.push(parseInt(val/(85**4)));
		carry = val%(85**4);
		tp.push(parseInt(carry/(85**3)));
		carry = carry%(85**3);
		tp.push(parseInt(carry/(85**2)));
		carry = carry%(85**2);
		tp.push(parseInt(carry/85));
		tp.push(carry%85);
		
		return tp;
	});
	//console.log("arrOfB85:", arrOfB85);
	
	const charSet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
				   'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
				   '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
				   '!', '#', '$', '%', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', '?', '@', '[', ']', '^', '_', '{', '}', '~'];
	
	const arrOfEnB85 = arrOfB85.map((arr) => {
	  return arr.map((val) => {
	    return charSet[val];
	  });
	});
	
	const encodedB85 = arrOfEnB85.toString().replaceAll(",","");
	
	return encodedB85;
}

const toSet63 = (str) => {
  let temp = str.replaceAll("%", "%"+"%".charCodeAt(0));
  //console.log("temp:", `${temp}`);
  const xChar = ['`','~','!','@','#','$','^','&','*','(',')','-','_','=','+','[','{',']','}','|',';',':',`'`,'"',',','<','.','>','/','?',' '];
  xChar.forEach((val) => {
    temp = temp.replaceAll(val, "%"+val.charCodeAt(0).toString());
    //console.log("val:", `${val}`, "%"+val.charCodeAt(0).toString());
    //console.log("tempC:", `${temp}`);
  });
  
  return temp;
}

const getSalt = (set63) => {
  return binToB85(s63ToBin6(set63));
}

const getFile = (str) => {
  return toSet63(str)+" "+getSalt(toSet63(str));
}

const getHash = (file) => {
  return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(file));
}

const getPass = (str, len) => {
  return binToB85(s16ToBin4(getHash(getFile(str)).substr(0, len*8)));
}
