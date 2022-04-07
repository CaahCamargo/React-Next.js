import React, {useEffect, useState} from "react";
import { Container, Loading, Owner, BackButton, IssuesList, PageAction, PageChoices} from "./styles";
import api from "../../services/api";
import {FaArrowLeft} from 'react-icons/fa'


export default function Repositorio({match}){

    const [ issues, setIssues] = useState([]);
    const [repositorio, setRepositorio] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState([
        {state:'all', label:'Todas', active:true},
        {state:'open', label:'Abertas', active:false},
        {state:'closed', label:'Fechadas', active:false},
    ]);
    const [filterIndex, setfilterIndex] = useState(0);


    useEffect(()=>{
        async function load(){
            const nomeRepo = decodeURIComponent(match.params.repositorio)

            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`,{
                    params:{
                        // state:'open',
                        state: filters.find(f => f.active).state, //mesmo que all
                        per_page: 5
                    }
                })
            ]);

            setRepositorio(repositorioData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }

        load();
    },[match.params.repositorio]);

    useEffect(() => {

        async function loadIssue(){
            const nomeRepo = decodeURIComponent(match.params.repositorio);

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params:{
                    state: filters[filterIndex].state,
                    page,
                    per_page: 5,
                },
            });
            setIssues(response.data);
        }
            loadIssue();
    }, [filterIndex, filters, match.params.repositorio, page]);

    //FUNÇÕES DA PAGINA
    //paginação
    function handlePage(action){
        setPage(action === 'back' ? page - 1 : page + 1)
    }

    //botoes do filtro
    function handleFilter(index){
        setfilterIndex(index);
    }
    //END FUNÇÕES DA PAGINA

    //LOADING DA PAGINA
    if(loading){
        return(
            <Loading>
                <h1>Carregando ...</h1>
            </Loading>
        )
    }
    //END LOADING DA PAGINA
   
    //DADOS DA PAGINA
    return(
        <Container style={{color:'#FFF'}}>
            {/* BOTÃO VOLTAR */}
            <BackButton to="/">
                <FaArrowLeft color="black" size={30} />
            </BackButton>
            {/*END BOTÃO VOLTAR */}

            {/*IMAGEM AVATAR, NOME E DESCRIÇÃO*/}
            <Owner>
                <img src={repositorio.owner.avatar_url} alt={repositorio.owner.login}/>  
                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
            </Owner>
            {/*END IMAGEM AVATAR, NOME E DESCRIÇÃO*/}

            {/*BOTÕES DE ESCOLHAS-FILTRO DA PAGINA*/}
            <PageChoices active={filterIndex}>
                {filters.map((filters, index)=> (
                    <button type="button" key={filters.label} onClick={()=> handleFilter(index)}>
                        {filters.label}
                    </button>
                ))}
            </PageChoices>
            {/*END BOTÕES DE ESCOLHAS-FILTRO DA PAGINA*/}

            {/*DADOS USUARIOS DA PAGINA*/}
            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login}/>    
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>
                                    {issue.labels.map(label =>(
                                        <span key={String(label.id)}>{label.name}</span>
                                    ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>
            {/*END DADOS USUARIOS DA PAGINA*/}

            {/*BOTÕES DE ESCOLHAS-PAGINAÇÃO DA PAGINA*/}
            <PageAction>
                <button type="button" onClick={()=>handlePage('back')} disabled={page<2}>
                    Anterior
                </button>
                <button type="button" onClick={()=>handlePage('next')}>
                    Proximo
                </button>
            </PageAction>
            {/*END BOTÕES DE ESCOLHAS-PAGINAÇÃO DA PAGINA*/}
        </Container>
    )
    //END DADOS DA PAGINA
}


