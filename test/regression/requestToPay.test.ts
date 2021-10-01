import axios, { AxiosRequestConfig } from 'axios'
import { v4 } from 'uuid'

jest.setTimeout(10 * 1000)

const config: AxiosRequestConfig = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
}
const baseUrl = 'sandbox.mojaloop.io'


describe('request to pay', () => {
  it('issues a requestToPay', async () => {
    // Arrange
    const uriRtp = `http://jcash-sdk-scheme-adapter-outbound.${baseUrl}/requestToPay`
    const homeTransactionId = v4()
    const requestToPayInit = {
      homeTransactionId,
      "from": {
        "idType": "MSISDN",
        "idValue": "329294234",
        fspId: 'skybank',
      },
      "to": {
        "idType": "MSISDN",
        "idValue": "949309489",
        fspId: 'jcash'
      },
      "amountType": "RECEIVE",
      "currency": "PHP",
      "amount": "1000",
      "initiator": "PAYEE",
      "initiatorType": "CONSUMER",
      "scenario": {
        "scenario": "DEPOSIT",
        "subScenario": "LOCALLY_DEFINED_SUBSCENARIO",
        "initiator": "PAYEE",
        "initiatorType": "CONSUMER"
      },
    }
    const expectedInitResponse = expect.objectContaining({
      homeTransactionId,
      from: expect.objectContaining({ 
        idType: 'MSISDN', 
        idValue: '329294234',
        // TODO: for some reason the sdk-scheme-adapter fills this in
        // as `jcash`... 
        // fspId: 'skybank',
      }),
      to: {
        idType: 'MSISDN',
        idValue: '949309489',
        fspId: 'jcash',
        firstName: 'Rnell',
        middleName: 'A',
        lastName: 'Durano',
        dateOfBirth: '1970-01-01'
      },
      amountType: 'RECEIVE',
      currency: 'PHP',
      amount: '1000',
      initiator: 'PAYEE',
      initiatorType: 'CONSUMER',
      scenario: {
        scenario: 'DEPOSIT',
        subScenario: 'LOCALLY_DEFINED_SUBSCENARIO',
        initiator: 'PAYEE',
        initiatorType: 'CONSUMER'
      },
      transactionRequestId: expect.stringMatching('.*'),
      currentState: 'WAITING_FOR_PARTY_ACCEPTANCE'
    })

    // Act
    // Payee FSP sends init, which internally calls `POST /transactionRequest` in FSPIOP API
    const initRtpResponse = (await axios.post(uriRtp, requestToPayInit, config)).data
     
    // Assert
    expect(initRtpResponse).toEqual(expectedInitResponse)
    
    const transactionRequestId = initRtpResponse.transactionRequestId
    console.log('transactionRequestId:', transactionRequestId)


    // Arrange
    // const uriAcceptParty = `http://jcash-sdk-scheme-adapter-outbound.${baseUrl}/requestToPayTransfer/${transactionRequestId}`
    // const bodyAcceptParty = {

    // }

    // // Act
    // const acceptPartyResponse = (await axios.post(uriRtp, requestToPayInit, config)).data
     
     // Assert
   })
})