import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import Layout from '@/components/Layout';
import { BookmarkProvider } from '@/context/BookmarkContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="favicon.ico" />
        <title>Discussion Application</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Users can use this application to share information about different topics." />
        <meta name="keywords" content="Discussion app"></meta>
      </Head>
      <BookmarkProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BookmarkProvider>
    </>
  )
}

export default MyApp;
