import fs from 'node:fs/promises';
import puppeteer from 'puppeteer';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn.js';

export default async function downLoadBingWallpaper() {
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
  const requestUrlList = [];
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  function logRequestUrl(interceptedRequest) {
    if (requestUrlList.length > 2) {
      interceptedRequest.abort();
    } else {
      requestUrlList.push(interceptedRequest.url());
      interceptedRequest.continue()
    }
  }

  const IMAGE_URL_PATTERN = '1920x1080';
  async function recordResponse(response) {
    if (response.url().includes(IMAGE_URL_PATTERN)) {
      const buffer = await response.buffer();
      const imgBase64 = buffer.toString("base64");
      const IMAGE_NAME = `images/${dayjs().format('YYYY-MM-DD')}.jpeg`;
      await fs.writeFile(IMAGE_NAME, imgBase64, "base64");
      console.log('文件已保存:', IMAGE_NAME);
    }
  }

  page.on('request', logRequestUrl);
  page.on('response', recordResponse);
  const BING_HOME = 'https://www.bing.com/';
  await page.goto(BING_HOME);
  await browser.close();
};
