import Cron from 'cron';
import downLoadBingWallpaper from './src/downLoadBingWallpaper.mjs'

new Cron.CronJob(
  '0 0 9 * * *',
  downLoadBingWallpaper,
  null,
  true,
)