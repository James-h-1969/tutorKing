import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/Navbar.module.css'
import Link from 'next/link';
import { FaSearch, FaBook } from 'react-icons/fa';
import Image from 'next/image'

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <h1 style={{color:"white", fontSize:"40px", paddingRight:'3rem', paddingLeft:"2rem"}}>Tutorking</h1>
        <ul className={styles.navLinks}>
            <li>
              <Link href="/" className={styles.link}>Home</Link>
            </li>
            <li>
              <Link href="/search" className={styles.link}><FaSearch size={30}/></Link>
            </li>
            <li>
              <Link href="/learn" className={styles.link}><FaBook size={30}/></Link>
            </li>
          </ul>
      </div>
      <div>
          {status === "loading" && <p>Loading...</p>}
          {session ? (
            <>
              <div className={styles.right}>
                <button onClick={() => signOut()} style={{backgroundColor:"#f3e6a8", color:"black", height:"80%", fontWeight:"bold"}}>Sign Out</button>
                <li>
                  <Link href="/user_config" className={styles.link}>
                    <Image className={styles.profile_img} src={session.user?.image} alt="User Image" width={40} height={40} />
                  </Link>
                </li>
              </div>
            </>
          ) : (
            <button onClick={() => signIn('google')} style={{backgroundColor:"#f3e6a8", color:"black", fontWeight:"bold"}}>Sign In</button>
          )}
      </div>
    </nav>
  );
};

export default Navbar;
