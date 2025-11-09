import { UAParser } from "ua-parser-js";

type DeviceInfoProps = {
  userAgent: string;
};

const getDeviceInfo = ({ userAgent }: DeviceInfoProps) => {
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  const parts: string[] = [];

  if (browser.name) {
    parts.push(browser.name);
  }
  if (os.name) {
    parts.push(os.name);
  }
  if (device.model) {
    parts.push(device.model);
  }

  return parts.join(" • ") || "Unknown device";
};

export { getDeviceInfo };
