import { init, initData, request2, retrieveLaunchParams, setDebug, setTargetOrigin, swipeBehavior, themeParams, viewport } from '@tma.js/sdk-vue';

export async function initSdk() {
  /**
     * Converts value from camel case to kebab case.
     * @param value - value to convert.
     */
  const camelToKebab = (value: string): string => {
    return value.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
  };

  const {
    tgWebAppStartParam = '',
    tgWebAppPlatform,
    tgWebAppThemeParams,
    tgWebAppVersion,
  } = retrieveLaunchParams();

  // Configure @tma.js SDK.
  setDebug(tgWebAppStartParam.includes('debug') || import.meta.env.DEV);
  setTargetOrigin(import.meta.env.DEV ? '*' : 'https://web.telegram.org');
  init({
    themeParams: tgWebAppPlatform === 'ios'
      // We use this hack to fix a bug related to dark themes in iOS. For some reason, the initial
      // theme params state there is invalid and contains secondaryBgColor = bgColor. Requesting
      // theme params, the client sends as new ones with valid values.
      ? (await request2('web_app_request_theme', 'theme_changed')).theme_params
      : tgWebAppThemeParams,
    version: tgWebAppVersion,
  });

  // Initialize required components.
  initData.restore();

  if (swipeBehavior.mount.isSupported()) {
    swipeBehavior.mount();
    swipeBehavior.disableVertical();
  }

  themeParams.mount();
  themeParams.bindCssVars(key => `--${key.replace(/_[a-z]/g, match => `-${match[1]}`)}`);

  await viewport.mount();
  viewport.bindCssVars(key => {
    const kebabed = camelToKebab(key);
    return key.startsWith('safeArea') || key.startsWith('contentSafeArea')
      ? `--${kebabed}`
      : `--viewport-${kebabed}`;
  });
  viewport.expand();
}
