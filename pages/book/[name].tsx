import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";

import type { Book } from "@/types/book";
import { getBook, getBookNames } from "@/lib/books";
import { getBookLink } from "@/lib/getTelegramUrl";
import { Link, Header, Footer } from "@/components";
import slugify from "@/lib/slugify";
import { songExists } from "@/lib/songs";

export async function getStaticPaths() {
  const bookNames = await getBookNames();
  const paths = bookNames.map((name) => ({
    params: { name },
  }));

  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps<{ book: Book }> = async (
  context
) => {
  const query = context.params?.name;

  if (!query || query instanceof Array) {
    return { notFound: true };
  }

  const book = await getBook(query);

  if (book === null) {
    return { notFound: true };
  }

  const songs = await Promise.all(
    book.songs.map(async (song) => {
      if (song.content || song.slug) {
        return song;
      }

      const slug = slugify(song.title);
      if (await songExists(slug)) {
        return { ...song, slug };
      }

      return song;
    })
  );

  return {
    props: {
      book: {
        ...book,
        songs,
      },
    },
  };
};

const BookPage = ({ book }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const title = `${book.title} | saatanam.me`;

  const amountValidSongs = book.songs.filter(
    (song) => song.content || song.slug
  ).length;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={`${book.title} on saatanam.me`} />
        <meta
          name="description"
          content={`View the contents of ${book.title}.`}
        />
        <meta
          name="keywords"
          content={`${book.title}, sitsit, laulu, sitsikirja, sanat, lyrics, saatanam.me, kerava, sitz, table party, academic table party, pöytäjuhla, book`}
        />

        <meta name="og:title" content={book.title} />
        <meta name="og:type" content="website" />
        <meta
          name="og:image"
          content="https://saatanam.me/icons/apple-touch-icon.png"
        />
        <meta name="og:url" content={`https://saatanam.me/books/${book.name}`} />
        <meta
          name="og:description"
          content={`View the contents of ${book.title}.`}
        />
        <meta name="og:site_name" content="saatanam.me" />
      </Head>

      <Header>
        <Link href="/" variant="primary">
          Home
        </Link>
        <Link
          href={getBookLink(book)}
          variant="telegram"
          target="_blank"
          rel="noreferrer noopener"
        >
          Share on Telegram
        </Link>
      </Header>

      <main>
        <div>
          <h1>{book.title}</h1>
          {book.credits && (
            <details style={{ marginBottom: "2rem" }}>
              <summary>Credits</summary>
              {Object.keys(book.credits).map((title) => {
                return (
                  <div key={title} style={{ marginBottom: "2rem" }}>
                    <p>
                      <strong>{title}</strong>
                    </p>
                    {book.credits![title].join(", ")}
                  </div>
                );
              })}
            </details>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {book.songs.map((song) => {
            const numberedTitle = `${song.number}: ${song.title}`;

            if (song.content) {
              return (
                <div
                  key={song.number}
                  style={{
                    padding: "1rem",
                    width: "calc(100% - 2rem)",
                  }}
                >
                  <p>{numberedTitle}</p>
                  <pre>{song.content}</pre>
                </div>
              );
            }

            if (song.slug) {
              return (
                <Link
                  key={song.number}
                  href={`/songs/${song.slug}?book=${book.name}`}
                  style={{ width: "100%" }}
                >
                  {numberedTitle}
                </Link>
              );
            }

            return (
              <div
                key={song.number}
                style={{
                  padding: "1rem",
                  width: "calc(100% - 2rem)",
                  border: "1px solid red",
                  borderRadius: "5pt",
                  background: "rgba(255, 0, 0, 0.25)",
                }}
              >
                {song.number}: {song.title}
              </div>
            );
          })}
        </div>
      </main>

      <Footer>
        <p style={{ opacity: 0.75 }}>
          {amountValidSongs} / {book.songs.length} songs found in saatanam.me.
        </p>

        <Link
          href={`https://github.com/ConcernedHobbit/saatanam.me/edit/main/books/${book.name}.json`}
          target="_blank"
          rel="noreferrer noopener"
          variant="secondary"
        >
          Edit this book on GitHub
        </Link>
      </Footer>
    </>
  );
};

export default BookPage;
