import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Práctica 5</title>
        <meta name="description" content="Práctica 5 programación de interfaces web" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Portal de gestión de citas
        </h1>

        <p className={styles.description}>
          <code className={styles.code}>Práctica 5</code>
        </p>

        <div className={styles.grid}>
          <Link href="/medico">
            <div className={styles.card}>
              <h2>Acceso personal &rarr;</h2>
              <p>Portal del personal del centro</p>
            </div>
          </Link>

          <Link href="/paciente">
            <div className={styles.card}>
              <h2>Acceso pacientes &rarr;</h2>
              <p>Petición de citas, Reservas....</p>
            </div>
          </Link>
        </div>
      </main>
    </>
  )
}
