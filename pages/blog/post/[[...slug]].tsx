import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import {
  PageViewer,
  cleanPage,
  fetchPage,
  fetchPages,
  types,
  useReactBricksContext,
} from 'react-bricks/frontend';

import ErrorNoFooter from '../../../components/errorNoFooter';
import ErrorNoKeys from '../../../components/errorNoKeys';
import config from '../../../react-bricks/config';

interface PageProps {
  page: types.Page
  footer: types.Page
  errorPage: string
  errorNoKeys: string
  errorFooter: string
}

const Page: React.FC<PageProps> = ({
  page,
  footer,
  errorNoKeys,
  errorPage,
  errorFooter,
}) => {
  const { pageTypes, bricks } = useReactBricksContext();
  const pageOk = page ? cleanPage(page, pageTypes, bricks) : null;
  const footerOk = footer ? cleanPage(footer, pageTypes, bricks) : null;

  return (
    <>
      {pageOk && !errorPage && !errorNoKeys && (
        <div style={{ width: '100%' }}>
          <Head>
            <title>{page.meta.title}</title>
            <meta name="description" content={page.meta.description} />
          </Head>
          <PageViewer page={pageOk} />
          {footerOk && !errorFooter ? (
            <PageViewer page={footerOk} showClickToEdit={false} />
          ) : (
            <ErrorNoFooter />
          )}
        </div>
      )}
      {errorNoKeys && <ErrorNoKeys />}
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  let errorNoKeys: boolean = false;
  let errorPage: boolean = false;
  let errorFooter: boolean = false;

  if (!config.apiKey) {
    errorNoKeys = true;
    return { props: { errorNoKeys } }
  }

  const { slug } = context.params;

  let cleanSlug = '';

  if (!slug) {
    cleanSlug = '/';
  } else if (typeof slug === 'string') {
    cleanSlug = slug;
  } else {
    cleanSlug = slug.join('/');
  }

  const [page, header, footer] = await Promise.all([
    fetchPage(
      cleanSlug.toString(),
      config.apiKey,
      context.locale,
      config.pageTypes
    ).catch(() => {
      errorPage = true;
      return {}
    }),
    fetchPage('header', config.apiKey, context.locale).catch(() => {
      return {}
    }),
    fetchPage('footer', config.apiKey, context.locale).catch(() => {
      errorFooter = true;
      return {}
    }),
  ]);

  return {
    props: {
      page,
      header,
      footer,
      errorNoKeys,
      errorPage,
      errorFooter,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  if (!config.apiKey) {
    return { paths: [], fallback: false }
  }

  const allPages = await fetchPages(config.apiKey, {
    type: 'blog',
    pageSize: 100,
    sort: '-publishedAt',
  });

  const paths = allPages
    .map((page) =>
      page.translations
        .filter(
          (translation) => context.locales.indexOf(translation.language) > -1
        )
        .map((translation) => ({
          params: {
            slug: [...translation.slug.split('/')],
          },
          locale: translation.language,
        }))
    )
    .flat()

  return { paths, fallback: false }
}

export default Page;