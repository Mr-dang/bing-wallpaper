export default class CommonService {
  static nop() {}

  static getImageSuffixFromHeaders(headers) {
    const contentType = headers['content-type'];
    const [pre, suffix] = contentType.split('/');
    return (pre && suffix) ? suffix : undefined;
  }
}