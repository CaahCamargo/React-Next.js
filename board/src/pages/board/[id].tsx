import format from "date-fns/format";
import firebase from "../../services/firebaseConnection";
import styles from './task.module.scss';
import Head from 'next/head';
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { FiCalendar} from 'react-icons/fi';

type Task = {
    id: string;
    created: string | Date;
    createdFormated?: string; 
    tarefa: string;
    userId: string;
    nome: string;
}

interface TaskListProps{
    data: string;
}

export default function Task({data}: TaskListProps){
    const task = JSON.parse(data) as Task;
    return(
        <>
            <Head>
                <title>Datalhes da Tarefa</title>
            </Head>
            <article className={styles.container}>
                <div className={styles.actions}>
                    <div>
                        <FiCalendar size={20} color="#FFF"/>
                        <span>Tarefa criada:</span>
                        <time>{task.createdFormated}</time>
                    </div>
                </div>
                <p>{task.tarefa}</p>
            </article>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
    const { id } = params;
    const session = await getSession({req});
    
    //PARA VIP: Acesso da pagina mais informaçoes apenas para usuarios vip
    if(!session?.vip){
        return{
            redirect:{
                destination:'/board',
                permanent: false,
            }
        }
    }
    //PARA TESTE: todos users acessa a pagina de mais informaçoes
    // if(!session?.id){
    //     return{
    //         redirect:{
    //             destination:'/board',
    //             permanent: false,
    //         }
    //     }
    // }
    // FIM TESTE

    const data = await firebase.firestore().collection('tarefas')
    .doc(String(id))
    .get()
    .then((snapshot)=>{
        const data = {
            id:snapshot.id,
            created:snapshot.data().created,
            createdFormated: format(snapshot.data().created.toDate(), 'dd MMMM yyyy'),
            tarefa: snapshot.data().tarefa,
            userId: snapshot.data().userId,
            nome: snapshot.data().nome,
        }

        return JSON.stringify(data);
    })

    //CATCH: verificação que indentificará se existe url data dentro do objeto, se for vazio, redireciona para board
    .catch(()=>{
        return{};
    })

    if(Object.keys(data).length === 0){
        return{
            redirect:{
                destination: '/board',
                permanent: false,
            }
        }
    }
    return{
        props:{
            data,
        }
    }
}