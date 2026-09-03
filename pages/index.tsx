import type { InferGetStaticPropsType } from "next";

import Head from "next/head";
import { Merriweather } from "next/font/google";

import {
  Logo,
  Link,
  Footer,
  Header,
  UpdateOverlay,
  SongList,
} from "@/components";

import { usePWAPrompt } from "@/lib/usePWAPrompt";
import { getSongs } from "@/lib/songs";

const merriweather = Merriweather({ subsets: ["latin"], weight: "400" });

export async function getStaticProps() {
  const songs = await getSongs();
  return {
    props: {
      titles: songs.filter(({ hidden }) => !hidden).map(({ title }) => title),
    },
  };
}

const Index = ({ titles }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // PWA update prompting, song downloads
  const { promptVisible, updateWorker } = usePWAPrompt();

  return (
    <>
      <Head>
        <title>saatanam.me | Unholy Verses</title>

        <meta
          name="keywords"
          content="sitsit, laulu, sanat, lyrics, sitsilaulu, saatanam.me, kerava, sitz, table party, academic table party, pöytäjuhla"
        />
        <meta name="description" content="Unholy Verses." />

        <meta name="og:title" content="saatanam.me, the unholy repository" />
        <meta name="og:type" content="website" />
        <meta
          name="og:image"
          content="https://saatanam.me/icons/apple-touch-icon.png"
        />
        <meta name="og:url" content="https://saatanam.me" />
        <meta name="og:description" content="An unholy verse repository" />
        <meta name="og:site_name" content="saatanam.me" />
      </Head>

      <Header>
        <div style={{ position: "relative" }}>
          <Logo style={promptVisible ? { filter: "blur(3px)" } : {}} />
          {promptVisible && <UpdateOverlay updateWorker={updateWorker} />}
        </div>
        <h1 className={merriweather.className}>saatanam.me</h1>
      </Header>

      <div
        style={{
          height: "100vh",
        }}
      >
        <main>
          <SongList titles={titles} />
        </main>

        <Footer style={{ textAlign: "center" }}>
          <Link
            href="https://github.com/ConcernedHobbit/saatanam.me"
            variant="primary"
            target="_blank"
            rel="noreferrer noopener"
          >
            Contribute a song on GitHub
          </Link>
        </Footer>
      </div>
    </>
  );
};

export default Index;
