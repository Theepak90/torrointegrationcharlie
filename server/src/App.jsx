/* third lib*/
import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { IntlProvider } from 'react-intl';

/*local component & methods*/
import routes from './routes';
import '@assets/GlobalStyles.css';
import { useGlobalContext } from 'src/context';
import { getThemeConfig } from '@lib/api';
import { AliveScope } from 'react-activation';
import Loading from '@assets/icons/StatusIcon/Loading';

/* language config*/
import CN from 'src/language/CN.js';
import US from 'src/language/US.js';

const App = () => {
  const { languageContext, setTheme, themeContext } = useGlobalContext();
  const language = languageContext.lang;
  const [loading, setLoading] = useState(true);

  let routing = useRoutes(routes(language));
  const message = useMemo(() => {
    switch (language) {
      case 'en':
        return US;
      case 'cn':
        return CN;
      default:
        return US;
    }
  }, [language]);
  let location = useLocation();

  useEffect(() => {
    getThemeConfig().then(res => {
      if (res.data) {
        setLoading(false);
        setTheme(res.data);
        Object.keys(res.data).forEach(key => {
          let value = res.data[key];
          if (value) {
            document.body.style.setProperty(`--${key}`, value);
          }
        });
      }
    });
    /* eslint-disable */
  }, []);
  /* eslint-disable */

  useEffect(() => {
    if (themeContext) {
      Object.keys(themeContext).forEach(key => {
        let value = themeContext[key];
        if (!!value) {
          document.body.style.setProperty(`--${key}`, value);
        }
      });
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Loading />
      </div>
    );
  }

  return (
    <IntlProvider messages={message} locale='fr' defaultLocale='en'>
      <AliveScope>
        <Suspense
          fallback={
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Loading />
            </div>
          }
        >
          {routing}
        </Suspense>
      </AliveScope>
    </IntlProvider>
  );
};

export default App;
