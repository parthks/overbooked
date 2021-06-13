import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';

import '../styles/globals.css'

import Navbar from '../components/navbar'
import Footer from '../components/footer'
import 'antd/dist/antd.css'
import 'antd-mobile/dist/antd-mobile.css';

import { ApolloProvider } from '@apollo/client/react';
import {client} from '../lib/graphql/client'


import { Provider } from 'react-redux'
import store from '../lib/redux/store'



export default function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);



  return (
    <React.Fragment>
      <Head>
        <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossOrigin=""
        />
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Provider store={store}>
        <ApolloProvider client={client}>
        

        <div id="page-container">
        <Navbar />
        <main id="content-wrap">
          <Component {...pageProps} />
        </main>
        <Footer />
        </div>

       
        

        </ApolloProvider>
        </Provider>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};







/*
# replace :80 with your domain name to get automatic https via LetsEncrypt
database.overbooked.in {
  reverse_proxy graphql-engine:8080
}
*/