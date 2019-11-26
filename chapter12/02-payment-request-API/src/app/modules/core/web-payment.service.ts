import { Injectable } from '@angular/core';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class WebPaymentService {
  // test card https://github.com/csob/paymentgateway/wiki/Credit-Cards-for-Testing
  public isWebPaymentSupported: boolean;

  private requestPayment = null;
  private canMakePaymentPromise: Promise<boolean> = null;
  private supportedPaymentMethods = [
    {
      // support credit card payment
      supportedMethods: 'basic-card',
      data: {
        supportedNetworks: ['visa', 'mastercard', 'amex'],
        supportedTypes: ['credit', 'debit']
      }
    },
    /* support google pay*/
    {
      supportedMethods: 'https://google.com/pay',
      data: {
        environment: 'TEST',
        apiVersion: 1,
        allowedPaymentMethods: ['CARD', 'TOKENIZED_CARD'],
        paymentMethodTokenizationParameters: {
          tokenizationType: 'PAYMENT_GATEWAY',
          // Check with your payment gateway on the parameters to pass.
          parameters: {}
        },
        cardRequirements: {
          allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
          billingAddressRequired: true,
          billingAddressFormat: 'MIN'
        },
        phoneNumberRequired: true,
        emailRequired: true,
        shippingAddressRequired: true
      }
    },
    /* support for Apple Pay*/
    {
      supportedMethods: 'https://apple.com/apple-pay',
      data: {
        version: 3,
        merchantIdentifier: 'merchant.com.example',
        merchantCapabilities: [
          'supports3DS',
          'supportsCredit',
          'supportsDebit'
        ],
        supportedNetworks: ['amex', 'discover', 'masterCard', 'visa'],
        countryCode: 'US'
      }
    },
    /* support for Samsung Pay */
    {
      supportedMethods: ['https://spay.samsung.com'],
      data: {
        version: '1',
        productId: '2bc3e6da781e4e458b18bc', // Service id from partner portal
        allowedCardNetworks: ['mastercard', 'visa'],
        orderNumber: '1233123',
        merchantName: 'Shop Samsung (demo)', // Merchant name in partner portal
        merchantGatewayParameter: { userId: 'acct_17irF7F6yPzJ7wOR' }
      },
      isRecurring: false,
      billingAddressRequired: false,
      paymentProtocol: 'PROTOCOL_3DS'
    }
    /* support for Stripe, Braintree, paypal or ...
     { }
    */
  ];
  private paymentDetails: any = {
    total: {
      label: 'Total Donation',
      amount: { currency: 'USD', value: 4.99 }
    },
    displayItems: [
      {
        label: 'What I recieve',
        amount: { currency: 'USD', value: 4.49 }
      },
      {
        label: 'Tax',
        amount: { currency: 'USD', value: 0.5 }
      }
    ]
  };
  private requestPaymentOptions = {
    requestPayerName: true,
    requestPayerPhone: false,
    requestPayerEmail: true,
    requestShipping: false,
    shippingType: 'shipping'
  };

  constructor() {
    if (window.PaymentRequest) {
      // Use Payment Request API
      this.isWebPaymentSupported = true;
    } else {
      this.isWebPaymentSupported = false;
    }
  }

  constructPaymentRequest() {
    if (this.isWebPaymentSupported) {
      this.requestPayment = new PaymentRequest(
        this.supportedPaymentMethods,
        this.paymentDetails,
        this.requestPaymentOptions
      );

      // ensure that user have a supported payment method if not you can do other things
      if (this.requestPayment.canMakePayment) {
        this.canMakePaymentPromise = this.requestPayment.canMakePayment();
      } else {
        this.canMakePaymentPromise = Promise.resolve(true);
      }
    } else {
      // do something else for instance redirect user to normal checkout
    }

    /*
    this.requestPayment.onshippingoptionchange = event => {
      // Compute new payment details based on the selected shipping option.
      // for instance change shipping price or something else
      event.updateWith(
        fetch('/assets/payment-details.json').then(r => r.json())
      );
    };

    this.requestPayment.onshippingaddresschange = async event => {
      const paymentRequest = event.target;
      const shippingAddress = paymentRequest.shippingAddress;
      console.log(shippingAddress);
      // Compute new payment details based on the selected shipping option.
      // for instance change shipping price or something else
      event.updateWith(
        fetch('/assets/payment-details.json').then(r => r.json())
      );
    };
    */
    return this;
  }

  async show(): Promise<any> {
    // you can make sure client has a supported method already if not do somethig else
    // for instance, fallback to normal checkout, or let them to add one active card
    const canMakePayment = await this.canMakePaymentPromise;

    if (canMakePayment) {
      try {
        const response = await this.requestPayment.show();
        // here where you can process response payment with your backend
        // there must be a backend implementation too.
        const status = await this.processResponseWithBackend(response);

        // after backend responsed successfully, you can do any other logic here
        // complete transaction and close the payment UI
        response.complete(status.success);
        return status.response;
      } catch (e) {
        //  API Error or user closed the UI
        console.log('API Error or user closed the UI');
        return false;
      }
    } else {
      // Fallback to traditional checkout for example
      // this.router.navigateByUrl('/donate/traditional');
    }
  }

  async abort(): Promise<boolean> {
    // to abort in progress payment
    return this.requestPayment.abort();
  }

  // mock backend response
  async processResponseWithBackend(response): Promise<any> {
    // check with backend and respond accordingly
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: 'success', response });
      }, 1500);
    });
  }
}
