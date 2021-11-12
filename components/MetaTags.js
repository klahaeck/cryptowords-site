import Head from 'next/head';

const MetaTags = ({ meta }) => (
  <Head>
    <title>{meta.title}</title>
    <meta name="keywords"               content={meta.keywords} key="keywords" />
    <meta name="description"            content={meta.description} key="description" />

    <meta property="og:type"            content="website" key="type" />
    <meta property="og:url"             content={`${meta.url}${meta.path}`} key="og:url" />
    <meta property="og:title"           content={meta.socialTitle || meta.title} key="title" />
    <meta property="og:description"     content={meta.description} key="og:description" />
    <meta property="og:image"           content={meta.imageUrl} key="og:image" />
    <meta property="og:image:type"      content="image/png" key="og:image:type" />
    <meta property="og:image:width"     content="1200" key="og:image:width" />
    <meta property="og:image:height"    content="628" key="og:image:height" />


    <meta name="twitter:card"           content="summary_large_image" key="twitter:card" />
    <meta name="twitter:site"           content="@RealCryptoWords" key="twitter:site" />
    <meta name="twitter:creator"        content="@RealCryptoWords" key="twitter:creator" />
    <meta name="twitter:title"          content={meta.socialTitle || meta.title} key="twitter:title" />
    <meta name="twitter:description"    content={meta.description} key="twitter:description" />
    <meta name="twitter:image"          content={meta.imageUrl} key="twitter:image" />

    {/* <link rel="icon" type="image/png" href="https://6407c04a3cdfd0d80e9b-562ba8caa57940e1ebc0df098deb9607.ssl.cf1.rackcdn.com/images/favicon-16x16.png" sizes="16x16" />
    <link rel="icon" type="image/png" href="https://6407c04a3cdfd0d80e9b-562ba8caa57940e1ebc0df098deb9607.ssl.cf1.rackcdn.com/images/favicon-32x32.png" sizes="32x32" />
    <link rel="apple-touch-icon" href="https://6407c04a3cdfd0d80e9b-562ba8caa57940e1ebc0df098deb9607.ssl.cf1.rackcdn.com/images/apple-touch-icon.png" sizes="180x180" />
    <link rel="mask-icon" href="https://6407c04a3cdfd0d80e9b-562ba8caa57940e1ebc0df098deb9607.ssl.cf1.rackcdn.com/images/logo-mask.svg" /> */}
  </Head>
);

export default MetaTags;