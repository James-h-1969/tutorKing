import Head from 'next/head';
import { useSession } from 'next-auth/react';
import withAuth from '../../utils/withAuth';
import styles from '../../styles/User_config.module.css';
import axios from 'axios';
import { format } from 'date-fns'; // Importing date-fns for formatting dates
import { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../utils/misc';

const getUser = async (user) => {
    // Construct the request URL for adding the user
    let base_url = `http://127.0.0.1:8000`;
    let extra_url = `/users/get_user/?username=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&include_role_desc=${encodeURIComponent(true)}`;
    
    // Make the Axios request to get the user
    const response = await axios.get(base_url + extra_url);
    return response.data;
};

const setUserRole = async (user_id, role_id) => {
    // check that the role has been selected
    if (role_id == -1){
        console.log("No role selected!");
    }

    let base_url = `http://127.0.0.1:8000`;
    let extra_url = `/users/update_user_role?user_id=${encodeURIComponent(user_id)}&role_id=${encodeURIComponent(role_id)}`;

    // Make the Axios request to get the user
    const response = await axios.patch(base_url + extra_url);
    return response.data;
}

const UserConfig = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const [currentlySelected, setCurrentlySelected] = useState(-1);

    const fetchUser = async () => {
        try {
            const userData = await getUser(session.user);
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (session && session.user) {
            fetchUser();
        } else {
            setLoading(false); 
        }
    }, [session]); 

    if (loading) {
        return <div>Loading...</div>; 
    }

    function handleSelection(id){
        if (id == currentlySelected){
            setCurrentlySelected(-1);
        } else {
            setCurrentlySelected(id);
        }
    }

    async function handleSubmit(){
        await setUserRole(user?.user.id, currentlySelected);
        await fetchUser();
    }

    return (
        <div className={styles.outside}>
            <Head>
                <title>tutorking</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.flexContainer}>
                <h1 style={{ fontWeight: "bold", fontSize: "60px" }}>{session.user.name}</h1>
                <img className={styles.profile_img} src={session.user.image} alt="User Image" />
                <div className={styles.profileBox}>
                    Profile created: {format(user?.user.created_at, 'MMMM, yyyy')}
                </div>
            </div>
            {
                user?.user.role_id == 1 ? 
                <div className={`${styles.choose_role}`} style={{ fontFamily: "Geist Mono, monospace", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                    <p>Choose Role</p>
                    <div className={styles.roles}>
                        <div 
                            onClick={() => handleSelection(2)} 
                            style={{ background: currentlySelected === 2 ? "#f0f0f0" : "" }}
                            className={styles.choosing}
                        >
                            Student
                        </div>

                        <div 
                            onClick={() => handleSelection(3)} 
                            style={{ background: currentlySelected === 3 ? "#f0f0f0" : "" }}
                            className={styles.choosing}
                        >
                            Parent
                        </div>
                        <div 
                            onClick={() => handleSelection(4)} 
                            style={{ background: currentlySelected === 4 ? "#f0f0f0" : ""}}
                            className={styles.choosing}
                        >
                            Tutor
                        </div>
                    </div>
                    <div className={styles.select_button} onClick={() => handleSubmit()}>Select</div>
                </div>
                : <div className={styles.role} style={{backgroundColor: user?.role.colour, fontFamily: "Geist Mono, monospace"}}>{capitalizeFirstLetter(user.role?.role_name)}</div>
            }
        </div>
    );
};

export default withAuth(UserConfig);
