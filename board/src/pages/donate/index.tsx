import styles from './styles.module.scss';
import Head from 'next/head';
import firebase from '../../services/firebaseConnection';
import Image from 'next/image';
import rocket from '../../../public/imagens/rocket.svg'
import {GiReceiveMoney} from 'react-icons/gi'
import {getSession} from 'next-auth/client';

import {PayPalButtons} from '@paypal/react-paypal-js';
import {useState} from 'react';
import { GetServerSideProps } from 'next';

interface DonateProps{
    user:{
        nome:string;
        id: string;
        image: string;
    }
}
export default function Donate({ user }: DonateProps){
    const [vip, setVip] = useState(false);

    async function handleSaveDonate(){
        await firebase.firestore().collection('users')
        .doc(user.id)
        .set({
            donate: true,
            lastDonate: new Date(),
            image: user.image
        })
        .then(()=>{
            setVip(true);
        })
    }

    return(
        <>
            <Head>
                <title>Apoie o Bord!</title>
            </Head>
            <main className={styles.container}>
                <Image src={rocket} alt="Seja Apoiador"/>

                 {vip && ( 
                    <div className={styles.apoio}>
                        <Image objectFit="fill" width={49} height={48} src={user.image} alt="imagem User" />
                        <span>Parabéns agora você é um novo membro da Board!</span>
                    </div>
                )}

                <h1>Seja um apoiador deste projeto!</h1>
                <h3>Contribua com apenas <span>R$: 1,00</span> <GiReceiveMoney size={30} color="#ff9900"/></h3>
                <strong>Apareça na nossa homepage! Usuarios Apoiadores possuem funcionalidades exclusivas!</strong>
                
                <PayPalButtons 
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount:{
                                    value: '1'
                                }
                            }]
                        })
                    }}

                    onApprove={(data, actions)=>{
                        return actions.order.capture().then(function(details){
                            console.log('COMPRA APROVADA! ', + details.payer.name.given_name);
                            handleSaveDonate();
                        })
                    }}
                
                />
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const session = await getSession({req})
    
    if(!session?.id){
        return{
            redirect:{
                destination: '/',
                permanent:false
            }
        }
    }
    
    const data = {
        nome: session?.user.name,
        id: session?.id,
        image: session?.user.image,
    }
    return{
        props:{
            data
        }
    }
}