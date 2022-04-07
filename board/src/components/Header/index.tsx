import Link from 'next/link';
import styles from './styles.module.scss';
import Image from 'next/image';
import logo from '../../../public/imagens/logo.svg'
import {SigninButton} from './SigninButton';

export function Header(){
    return(
       <header className ={styles.headerContainer}>
           <div className={styles.headerContent}>
                <Link href="/">
                    <a>
                        <Image src={logo} alt="logo"/>
                    </a>
                </Link>
                <nav>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                    <Link href="/board">
                        <a>Meu Board</a>
                    </Link>
                </nav>
                <SigninButton/>
           </div>
       </header>
    )
}