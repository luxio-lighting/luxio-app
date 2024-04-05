import { LuxioUtil } from "@luxio-lighting/lib";

export default class extends LuxioUtil {

  static rgb2hex({ r, g, b }) {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  static rgbw2hex({ r, g, b, w }) {

    // If the white channel is set, then we scale all r,g,b accordingly and subtract r and b by the white channel
    if (w > 0) {
      // TODO
    }

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

}