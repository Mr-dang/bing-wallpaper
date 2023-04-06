import path from 'node:path';
import { URL, fileURLToPath } from 'node:url';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util'
import fetch from 'node-fetch';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn.js';

const BING_HOME_PAGE = 'https://www.bing.com';
const IMAGE_FOLDER_PATH = '../images';
const IMAGE_NAME = `${dayjs().format('YYYY-MM-DD')}-4k.jpeg`;
const DIR_NAME = path.dirname(fileURLToPath(import.meta.url))

const REGREX = /<link rel="preload" href="(.*)" as="image" id="preloadBg" \/>/;

export default async function downLoadBingWallpaper() {
    
  const response = await fetch(BING_HOME_PAGE + '/', {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15',
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  })
  if (!response.ok) {
    throw new Error(`获取必应首页html失败: ${response.statusText}`);
  }
  const text = await response.text()

  const matchResult = text.match(REGREX);
  if (!matchResult) {
    throw new Error(`正则匹配失败，没找到图片地址`);
  }
  const matchedContent = matchResult[1];
  const link = matchedContent.startsWith('https://') ? matchedContent : BING_HOME_PAGE + matchedContent;
  const url = new URL(link);
  const { origin, pathname, searchParams } = url;
  const imageUrl = `${origin}${pathname}?id=${searchParams.get('id').replace('1920x1080', 'UHD')}&w=3840&h=2160&c=8&rs=1&o=3&r=0`;
  console.log('imageUrl:', imageUrl);
  const imageRes = await fetch(imageUrl, {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  })

  const streamPipeline = promisify(pipeline);

  if (!imageRes.ok) {
    throw new Error(`图片下载失败: ${imageRes.statusText}`);
  }

  await streamPipeline(imageRes.body, createWriteStream(path.resolve(DIR_NAME, IMAGE_FOLDER_PATH, IMAGE_NAME)));
  console.log(IMAGE_NAME + '下载成功');
}