import { GetStaticProps } from "next"
import { getPrismicClient } from "../../services/prismic"
import { RichText } from 'prismic-dom'
import { FaYoutube, FaInstagram, FaLinkedin, FaFacebook} from 'react-icons/fa';
import Head from "next/head"
import styles from './styles.module.scss'
import Prismic from '@prismicio/client'
import { Header } from "../../components/Header"

type Content ={
    title: string;
    description: string;
    banner: string;
    linkedin: string;
    instagram: string;
    youtube: string;
}

interface ContentProps{
    content: Content
}

export default function Sobre({content}: ContentProps){
    return(
      <>
      <Head>
          <title>Quem Somos? | Sta. Lontosa</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title}</h1>
            <p>{content.description}</p>

            <a href={content.youtube}>
              <FaYoutube size={40} />
            </a>

            <a href={content.instagram}>
              <FaInstagram size={40} />
            </a>

            <a href={content.linkedin}>
              <FaLinkedin size={40} />
            </a>
          </section>

          <img
            src={content.banner}
            alt="Sobre Sujeito Programador"
          />

        </div>
      </main>
      </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();
  
    const response = await prismic.query([
      Prismic.Predicates.at('document.type', 'about')
    ])
  
    const {
      title,
      description,
      banner,
      instagram,
      youtube,
      linkedin
    } = response.results[0].data;
  
    const content = {
      title: RichText.asText(title),
      description: RichText.asText(description),
      banner: banner.url,
    //   linkedin: linkedin.url, 
    //   instagram: instagram.url,
    //   youtube: youtube.url,
    };
  
    return{
      props:{
        content
      },
      revalidate: 60*15
    }
  }