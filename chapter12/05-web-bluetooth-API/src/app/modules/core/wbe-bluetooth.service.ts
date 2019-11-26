import { Injectable } from '@angular/core';
import { SnackBarService } from './snack-bar.service';

declare const navigator: any;

@Injectable()
export class WebBluetoothService {
  public isWebBluetoothSupported: boolean;

  // sometimes device names are not really human readbale for example 0x180F
  // refer to this
  // https://www.bluetooth.com/specifications/gatt/viewer
  // ?attributeXmlFile=org.bluetooth.service.battery_service.xml&u=org.bluetooth.service.battery_service.xml
  private GATT_SERVICE_NAME = 'battery_service';
  private GATT_SERVICE_CHARACTERISTIC = 'battery_level';

  constructor() {
    if (navigator.bluetooth) {
      this.isWebBluetoothSupported = true;
    }
  }

  // this is just an example, you need to install this app first
  // https://play.google.com/store/apps/details?id=io.github.webbluetoothcg.bletestperipheral&hl=en
  // then you can connect to these devices as an example I used battery_service
  async getBatteryLevel(): Promise<any> {
    try {
      // step1: when you scan, you need to define a mandatory object where it has filter propery
      const device = await navigator.bluetooth.requestDevice({
        // acceptAllDevices: true
        filters: [{ services: [this.GATT_SERVICE_NAME] }]
      });
      // step 2: connect to device
      const connectedDevice = await this.connectDevice(device);
      // step 3 : Getting Battery Service
      const service = await this.getPrimaryService(connectedDevice, this.GATT_SERVICE_NAME);
      // step 4: Read Battery level characterestic
      // remmeber, characterestics are not alaways human readble, you may pass something like 0xffe9
      const characteristic = await this.getCharacteristic(service, this.GATT_SERVICE_CHARACTERISTIC);
      // step 5: ready battery level
      const value = await characteristic.readValue();
      // step 6: return value
      return `Battery Level is ${value.getUint8(0)}%`;
    } catch (e) {
      console.error(e);
      return `something is wrong: ${e}`;
    }
  }

  private connectDevice(device): Promise<any> {
    return device.gatt.connect();
  }

  private getPrimaryService(connectedDevice, serviceName): Promise<any> {
    return connectedDevice.getPrimaryService(serviceName);
  }

  private getCharacteristic(service, characterestic): Promise<any> {
    return service.getCharacteristic(characterestic);
  }
}
