import { Globe, Laptop, Monitor, Smartphone, Tablet } from "lucide-react";
import { UAParser } from "ua-parser-js";

type DeviceIconProps = {
  userAgent: string;
};

const getDeviceIcon = ({ userAgent }: DeviceIconProps) => {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const os = parser.getOS();

  if (device.type === "mobile") {
    return <Smartphone className="size-4" />;
  }
  if (device.type === "tablet") {
    return <Tablet className="size-4" />;
  }
  if (os.name === "Mac OS") {
    return <Laptop className="size-4" />;
  }
  if (os.name === "Windows") {
    return <Monitor className="size-4" />;
  }
  if (os.name === "Linux") {
    return <Monitor className="size-4" />;
  }
  return <Globe className="size-4" />;
};

export { getDeviceIcon };
