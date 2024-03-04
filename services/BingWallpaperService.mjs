import path from 'node:path';
import fs from 'node:fs/promises';
import puppeteer from 'puppeteer';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn.js';
import CommonService from './CommonService.mjs';

export default class BingWallpaperService {
  // 要匹配的请求地址
  static IMAGE_URL_PATTERN = '1920x1080';
  static BING_HOME = 'https://www.bing.com/';

  static IMAGE_SUFFIX = '.jpeg';

  filePath = '';

  constructor(filePath) {
    this.filePath = filePath;
    this.execute = this.execute.bind(this);
  }

  async execute() {
    const todayDate = dayjs().format('YYYY-MM-DD');
    let fileName = path.resolve(this.filePath, `bing-${todayDate}${BingWallpaperService.IMAGE_SUFFIX}`);
  
    let success = false;
    let errorReason = `没有找到匹配${BingWallpaperService.IMAGE_URL_PATTERN}的url`;
    let matched = false;
  
    const browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: {
        deviceScaleFactor: 1,
        hasTouch: false,
        width: 1920,
        height: 1080,
        isLandscape: false,
        isMobile: false,
      }
    });
    const page = await browser.newPage();
    const userAgent = await browser.userAgent();
    await page.setUserAgent(userAgent.replace(/headless/i, ''));
    await page.setRequestInterception(true);
    const onRequest = (request) => {
      if (matched) {
        request.abort();
      } else {
        request.continue();
      }
      if (request.url().includes(BingWallpaperService.IMAGE_URL_PATTERN)) {
        matched = true;
      }
    }
  
    const onResponse = async (response) => {
      if (response.url().includes(BingWallpaperService.IMAGE_URL_PATTERN)) {
        const buffer = await response.buffer();
        const imgBase64 = buffer.toString("base64");
        const suffix = CommonService.getImageSuffixFromHeaders(response.headers());
        if (suffix) {
          fileName = fileName.replace(BingWallpaperService.IMAGE_SUFFIX, `.${suffix}`);
        }
  
        await fs.writeFile(fileName, imgBase64, "base64");
        success = true;
      }
    }
  
    page.on('request', onRequest);
    page.on('response', onResponse);
    await page.goto(BingWallpaperService.BING_HOME);
    await page.waitForNetworkIdle();
    await browser.close();
    if (success) {
      console.log(`${todayDate}图片下载成功，保存至:`, fileName);
    } else {
      console.log(`${todayDate}图片下载失败，原因:`, errorReason);
    }
  }
}