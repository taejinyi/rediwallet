import numeral from 'numeral'

export const convertToMoney = (number) => {
  return numeral(number).format('0,000')
}
