export const helpers = {
  formatNumber(number) {
    let arr = Array.from(String(number));
    let formattedNumber = '';
    const length = arr.length;
    arr.forEach((char, index) => {
      if ((length - index) % 3 === 0) {
        formattedNumber += ' ';
      }
      formattedNumber += char;
    })
    return formattedNumber;
  }
}

export default helpers;