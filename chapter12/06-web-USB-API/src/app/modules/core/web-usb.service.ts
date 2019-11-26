import { Injectable } from '@angular/core';
import { SnackBarService } from './snack-bar.service';

declare const navigator: any;

@Injectable()
export class WebUSBService {
  public isWebUSBSupported: boolean;

  constructor(private snackBar: SnackBarService) {
    if (navigator.usb) {
      this.isWebUSBSupported = true;

      // if user connect or diconnect a device
      navigator.usb.onconnect = event => {
        // event.device will bring the connected device
        console.log(event.device);
      };

      navigator.usb.ondisconnect = event => {
        // event.device will bring the disconnected device
        console.log(event.device);
      };
    }
  }

  async requestDevice() {
    try {
      // for general purposes you can pass in the configuration and define configuration in component level
      // therefore you can simply get access to this service instance and can get call these methods with
      // different configuration.
      const usbDeviceProperties = {
        // make sure you find your productId, SerialNumber or VendorId for your device,
        // before testing this API. you must have a correct number for your device.
        name: 'Transcend Information, Inc.',
        vendorId: 0x8564
      };

      const device = await navigator.usb.requestDevice({ filters: [usbDeviceProperties] });
      console.log(device);

      await device.open();
      // await device.selectConfiguration(1);
      // await device.claimInterface(0);
      // await device.selectAlternateInterface(0, 0);
      // const result = await device.transferIn(5, 32);
      // console.log(result);

      return `
      USB device name: ${device.productName}, Manifacture is ${device.manufacturerName}
      USB Version is: ${device.usbVersionMajor}.${device.usbVersionMinor}.${device.usbVersionSubminor}
      Product Serial Number is ${device.serialNumber}
      `;
    } catch (error) {
      return 'Error: ' + error.message;
    }
  }

  async getDevices() {
    const devices = await navigator.usb.getDevices();
    devices.map(device => {
      console.log(device.productName); // "Mass Storage Device"
      console.log(device.manufacturerName); // "JetFlash"
      this.snackBar.open(
        `this. USB device name: ${device.productName}, Manifacture is ${device.manufacturerName} is connected.`
      );
    });
  }
}
