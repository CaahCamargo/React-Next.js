import { linkSync } from 'fs';
import Link from 'next/link';
import styles from './styleButoon.module.scss';

export function SupportButton(){
    return(
        <div className={styles.donateContainer}>
            <Link href="/donate">
                <button>Apoiar</button>
            </Link>
        </div>
    )
}