import { GetStaticProps } from "next";
import { getPrismicClient } from "../services/prismic";
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import Head  from "next/head";
import styles from "../styles/home.module.scss";
import Image from "next/image";
import techImage from '../../public/images/techs.svg';

type Content ={
    title: string;
    titleContent: string;
    // linkAction: string;
    mobileTitle: string;
    mobileContent: string;
    // mobileBanner: string;
    webTitle: string;
    webContent: string;
    // webBanner: string;
}

interface ContentProps{
  content: Content
}

export default function Home({content}: ContentProps) {
  return (
    <>
      <Head>
        <title>Sra. Lontosa</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title}</h1>
            <span>{content.titleContent}</span>
            <a>
              <br/>
              <button>
                COMEÇE AGORA!
              </button>
            </a>
          </section>
          <img src="/images/lontra.svg" alt="web" />

        </div>

        <hr className={styles.divisor}/>
          <div className={styles.sectionContent}>
            <section>
              <h2>{content.mobileTitle}</h2>
              <span>{content.mobileContent}</span>
            </section>
            <img src="/images/cell.png" alt="Home App" />
          </div>

          <hr className={styles.divisor}/>
          <div className={styles.sectionContent}>
            <img src="/images/mobile-app.png" alt="Home Web" />
            <section>
              <h2>{content.webTitle}</h2>
              <span>{content.webContent}</span>
            </section>
          </div>

          <div className={styles.nextLevelContent}>
            <Image src={techImage} alt="Tecnologias" />
            <h2>Mais de <span className={styles.alunos}>15 mil</span> profissionais elevaram sua carreira ao próximo Nível</h2>
            <span>E você vai perder essa chance de evoluir de uma vez por todas?</span>
            <a>
              <button>Acessar Turma!</button>
            </a>
          </div>
      </main>

    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  //pegar dados do Prismic
  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'home')
  ])

  //Campos que desejamos editar
  const{
    title, sub_title, mobile, mobile_content, title_web, web_content, 
  } = response.results[0].data;

  const content = {
    title: RichText.asText(title),
    titleContent: RichText.asText(sub_title),
    // linkAction: link_action.url,
    mobileTitle: RichText.asText(mobile),
    mobileContent: RichText.asText(mobile_content),
    // mobileBanner: mobile_banner.url,
    webTitle: RichText.asText(title_web),
    webContent: RichText.asText(web_content),
    // webBanner: web_banner.url
  };

  return{
    props:{
      content
    },
    revalidate: 60 * 2
  }
}