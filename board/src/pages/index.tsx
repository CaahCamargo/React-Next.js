import {GetStaticProps} from 'next';
import {useState} from 'react';
import Head from 'next/head';
import styles from '../styles/styles.module.scss';
import firebase from '../services/firebaseConnection';
'../pages/services/firebaseConnection.js'
import Image from 'next/image';
import board from '../../public/imagens/board-user.svg';


type Data ={
  id:string;
  donate: boolean;
  lastDonate: Date;
  image: string;
}

interface HomeProps{
  data: string;
}

export default function Home({data}: HomeProps) {
  const[donaters, setDonaters] = useState<Data[]>(JSON.parse(data));

  return (
  <>
    <Head>
      <title>Board - Organizador de Tarefas</title>
    </Head>
    <main className={styles.contentContainer}>
      <Image src={board} alt="Ferramenta Board"/>

      <section className={styles.callToAction}>
        <h1>Escreva, Planeje e se Organize com Board</h1>
        <p>
          <span>100% Gratuito</span> e Online!
        </p>
      </section>
        {/* PARA TESTE: imagem teste para todos os users */}
        {/* <div className={styles.donaters}>
        <img objectFit="fill" width={59} height={58} src="https://sujeitoprogramador.com/steve.png" alt="User1" /> 
        </div> */}
        {/* FIM TESTE */}

        {/* PARA VIP: listagem de todos os apoiadores vip */}
        {donaters.length !== 0 && <h3>Apoiadores:</h3>}
      <div className={styles.donaters}>
        {donaters.map(item => (
          <Image objectFit="fill" width={59} height={58} key={item.image} src="item.image" alt="Usuarios" />
        ))}
      </div>
    </main>
  </>
  )
}

//função que atualiza a pagina a cada 60 min a tornando uma pagina statica
export const getStaticProps: GetStaticProps = async() => {

  const donaters = await firebase.firestore().collection('users').get();
  const data = JSON.stringify(donaters.docs.map(u=>{
    return{
      id: u.id,
      ...u.data(),
    }
  }))

  return{
    props:{
      data
    },
    revalidate: 60 * 60 
  }
}