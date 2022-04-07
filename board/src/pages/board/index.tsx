import Head from 'next/head'
import styles from './stules.module.scss'
import firebase from '../../services/firebaseConnection';
import Link from 'next/link';
import {FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX} from 'react-icons/fi'
import {SupportButton} from '../../components/Header/SupportButton'
import {useState, FormEvent} from 'react';
import {GetServerSideProps} from 'next';
import {getSession} from 'next-auth/client';
import {format, formatDistance} from 'date-fns';
import {ptBR} from 'date-fns/locale'


type TaskList = {
    id: string;
    created: string|Date;
    createdFormatData?: string;
    tarefa: string;
    userId: string;
    nome:string;
}


interface BoardProps{
  user:{
    id: string;
    nome: string;
    vip:boolean; 
    lastDonate: string | Date;
  }
  data: string;
}


export default function Board({ user, data }: BoardProps){
    const [input, setInput] = useState('');
    const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data))
    const [taskEdit, setTaskEdit] = useState<TaskList | null>(null)

    async function handleAddTask(e: FormEvent){
        e.preventDefault();

        if(input === ''){
        alert('Preencha alguma tarefa!')
        return;
        }

        if(taskEdit){
            await firebase.firestore().collection('tarefas')
            .doc(taskEdit.id)
            .update({
                tarefa: input
            })
            .then(()=>{
                let data = taskList;
                let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);
                data[taskIndex].tarefa = input

                setTaskList(data);
                setTaskEdit(null);
                setInput('');
            })
            return;
        }

        await firebase.firestore().collection('tarefas').add({
        created: new Date(),
        tarefa: input,
        userId: user.id,
        nome: user.nome
        })
        .then((doc)=>{
        console.log('CADASTRADO COM SUCESSO!');
        let data = {
            id: doc.id,
            created: new Date(),
            createdFormatData: format(new Date(), 'dd MMMM yyyy'),
            tarefa: input,
            userId: user.id,
            nome:user.nome
        }
        setTaskList([...taskList, data]);
        setInput('');
        })
        .catch((err)=>{
        console.log('ERRO AO CADASTRAR: ', err)
        })
    }

    async function handleDelete(id: string){
        await firebase.firestore().collection('tarefas').doc(id).delete()
        .then(()=>{
            console.log('DELETADO COM SUCESSO!');
            let taskDeleted = taskList.filter(item => {
                return(item.id !== id)
            });
            setTaskList(taskDeleted);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    function handleEdit(task: TaskList){
       setInput(task.tarefa);
       setTaskEdit(task);
    }

    function handleCancelEdit(){
        setInput('');
        setTaskEdit(null);
    }
    return(
        <>
        <Head>
            <title>Minhas Tarefas - Board</title>
        </Head>
            <main className={styles.container}>

                {taskEdit && (
                    <span className={styles.AvisoBotaoX}>
                    <button onClick={handleCancelEdit}>
                        <FiX size={30} color="#FF3636"/>
                    </button>
                    Você está editando uma Tarefa!</span>
                )}

                <form onSubmit={handleAddTask}>
                    <input type="text" placeholder="Digite sua Tarefa" value={input} onChange={ (e) => setInput(e.target.value) }/>
                    <button type="submit">
                        <FiPlus size={25} color="#17181f"/>
                    </button>
                </form>

                <h1>Você tem {taskList.length} {taskList.length === 1 ? 'Tarefa' : 'Tarefas'}!</h1>

                <section>
                    {taskList.map(task => (
                        <article key={task.id} className={styles.taskList}>
                            <Link href={`/board/${task.id}`}>
                                <p>{task.tarefa}</p>
                            </Link>
                            <div className={styles.actions}>
                                {/* div responsavel pelo editar */}
                                <div>
                                    {/* div Responsavel por colocar o icone de calendario e time */}
                                    <div> 
                                        <FiCalendar size={20} color="#FFB800" />;
                                        <time>{task.createdFormatData}</time>
                                    </div>
                                    {/* BUTTON EDIT: Só aparecerá se user for vip */}
                                    {user.vip && ( 
                                        <button onClick={() => handleEdit(task)}>
                                            <FiEdit2 size={20} color="#FFF"/>
                                            <span>Editar</span>
                                        </button>
                                    )}
                                    {/* END BUTTON VIP */}
                                </div>

                                <button onClick={() => handleDelete(task.id)}>
                                    <FiTrash size={20} color="#FF3636"/>
                                    <span>Excluir</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
            {/* CARD DE DOAÇÕES: Só aparecerá se user for vip */}
            {user.vip && (
                <div className={styles.ContainerList}>
                    <h4>Obrigado por apoiar esse Projeto!</h4>
                    <div>
                        <FiClock size={28} color="#FFF"/>
                        <time>
                            Ultima doação: Há {formatDistance(new Date(user.lastDonate), new Date(), {locale: ptBR})}.
                        </time>
                    </div>
                </div>
            )}
            {/* END CARD DOAÇÕES */}

        <SupportButton/>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });
  
    //Verificação de LOGIN: Se o user nao tiver logado vamos redirecionar.
    if(!session?.id){
      return{
        redirect:{
          destination: '/',
          permanent: false
        }
      }
    }

    const tasks = await firebase.firestore().collection('tarefas')
    .where('userId', '==', session?.id)
    .orderBy('created', 'asc').get();
  
    const data = JSON.stringify(tasks.docs.map( u => {
        return{
            id: u.id,
            createdFormatData: format(u.data().created.toDate(), 'dd MMMM yyyy'),
            ...u.data(),
        }
    }))

    const user = {
      nome: session?.user.name,
      id: session?.id,
      vip:session?.vip, //verifica se o usuario é vip
      lastDonate: session?.lastDonate //verifica data da ultima doação
    }
  
  
    return{
      props:{
        user,
        data
      }
    }
  
  }