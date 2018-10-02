import numeral from 'numeral'

export const convertToKRWUnit = (number) => {
  return numeral(number).format('0,000')
}
