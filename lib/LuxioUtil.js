import { LuxioUtil } from "@luxio-lighting/lib";

export default class extends LuxioUtil {

  static rgbw2hex({ r, g, b, w }) {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

}