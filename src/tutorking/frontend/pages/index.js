import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>tutorking</title>
        <link rel="icon" href="/crown.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to My Next.js App!
        </h1>
        <p className={styles.description}>
          Get started by editing <code>pages/index.js</code>
        </p>
      </main>

    </div>
  );
}
