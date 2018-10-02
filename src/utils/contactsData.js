/*
 * Author: x86kernel (x86kernel@gmail.com)
 * Function: parseContactsData
 * input
 * contacts: Array of contacts Object - { name, mobile_number }
 * ouput
 * Array of SectionList Compatible Object - { title: String, data: Array }
*/

import Hangul from 'hangul-js'
import { parse, format } from 'libphonenumber-js'

export const parseContactsData = (contacts) => { 
  let parsedContactsObject = new Object()

  contacts.map(contact => {
    const [disassembleName] = [ ... Hangul.disassemble(contact.name) ]

    if(parsedContactsObject[disassembleName] === undefined) {
      parsedContactsObject[disassembleName] = new Object()

      parsedContactsObject[disassembleName].title = disassembleName
      parsedContactsObject[disassembleName].data = new Object()
    }

    const { phone, country } = parse(contact.mobile_number)
    contact.national_mobile_number = format(phone, country, 'National')

    parsedContactsObject[disassembleName].data[`${contact.mobile_number}`] = contact
  })

  let keys = Object.keys(parsedContactsObject)
  keys.sort()

  const returnData = new Object()

  for(let key of keys) {
    const newContactData = {
      [key]: parsedContactsObject[key]
    }

    Object.assign(returnData, newContactData)
  }

  return returnData
}

export const parseContactsToRequestData = (contacts) => {
  if(!contacts || !contacts.length) return null

  const returnData = contacts.map(contact => {
    const { phoneNumbers } = contact

    if(!phoneNumbers || !phoneNumbers.length) return null

    const countryCode = phoneNumbers[0].countryCode ? (phoneNumbers[0].countryCode).toUpperCase() : 'KR'

    const { country, phone } = parse(
      phoneNumbers[0].number, 
      countryCode,
    )

    if(country == null || country == null) {
      return null
    }

    const mobile_number = format(
      phone,
      country,
      'E.164'
    )

    return {
      mobile_number: mobile_number,
      name: contact.name,
    }
  })

  return returnData.filter(data => data !== null)
}

export const insertContactsIntoContactData = (contactData, contacts) => {
  contacts.forEach(contact => {
    const [ initialCho ] = [ ... Hangul.disassemble(contact.name) ]

    const { phone, country } = parse(contact.mobile_number)
    contact.national_mobile_number = format(phone, country, 'National')

    if(contactData[initialCho] === undefined) {
      contactData[initialCho] = {
        title: initialCho,
        data: { [ `${contact.mobile_number}` ]: contact },
      }
    } else {
      contactData[initialCho].data[`${contact.mobile_number}`] = contact
      //contactData[initialCho].data.sort((a, b) => a.name - b.name )
    }
  })

  let orderedContactData = new Object()
  let keys = Object.keys(contactData)

  keys.sort().forEach(key => {
    orderedContactData[key] = contactData[key]
  })

  return orderedContactData
}

export const checkMobileNumberExistInContacts = (contactData, mobileNumber) => {
  const sectionKeys = Object.keys(contactData)

  if(!sectionKeys.length) 
    return false

  for(let key of sectionKeys) {
    let section = contactData[key].data

    for(let contactMobileNumber of Object.keys(section)) {
      if(contactMobileNumber === mobileNumber) {
        return key
      }
    }
  }

  return false
}
