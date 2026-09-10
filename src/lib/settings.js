import settings from '@/data/settings.json';

export function getSettings() {
  return settings || {};
}

export function getAds() {
  return settings?.ads || {};
}

export function getAnalytics() {
  return settings?.analytics || {};
}