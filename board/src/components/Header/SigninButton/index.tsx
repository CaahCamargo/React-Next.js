import styles from './styles.module.scss';
import Image from 'next/image';
import {signIn, signOut, useSession} from 'next-auth/client';
import {FaGithub} from 'react-icons/fa';
import {FiX} from 'react-icons/fi';

export function SigninButton(){
    
    const [session] = useSession();

    return session ? (
        <button type="button" className={styles.signinButton} onClick={()=>signOut()}>   
            <div> {/* div apenas para ajustar a imagem */}
                <Image objectFit="fill" width={29} height={38} src={session.user.image} alt="Foto do User" />
            </div>
            Olá, {session.user.name}
            <FiX color="#737380" className={styles.closeIcon}/>
        </button>
    ) : (
        <button type="button" className={styles.signinButton} onClick={()=>signIn()}>
            <FaGithub color="#FFB800"/>
            Entrar com github
        </button>
    )
}