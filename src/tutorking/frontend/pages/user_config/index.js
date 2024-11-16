import Head from 'next/head';
import { useSession } from 'next-auth/react';
import withAuth from '../../utils/withAuth';
import styles from '../../styles/User_config.module.css';
import axios from 'axios';
import { format } from 'date-fns'; // Importing date-fns for formatting dates
import { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../utils/misc';

// function to get the user from the api
const getUser = async (user) => {
    // Construct the request URL for adding the user
    let base_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    let extra_url = `/users/get_user/?username=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&include_role_desc=${encodeURIComponent(true)}`;
    
    // Make the Axios request to get the user
    const response = await axios.get(base_url + extra_url);
    return response.data;
};

// function to set the role of the user from the api
const setUserRole = async (user_id, role_id) => {
    let base_url = process.env.NEXT_PUBLIC_BACKEND_URL;
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

    // function that given a google user, gets the user data from the backend
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

    // state manager of the role selection
    function handleSelection(id){
        if (id == currentlySelected){
            setCurrentlySelected(-1);
        } else {
            setCurrentlySelected(id);
        }
    }

    // function that runs when the submit button is pressed
    async function handleSubmit(){
        await setUserRole(user?.user.id, currentlySelected);
        await fetchUser();
    }

    return (
        <div className={styles.outside}>
            <Head>
                <title>tutorking</title>
                <link rel="icon" href="/crown.ico" />
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
                <div className={`${styles.choose_role}`} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                    <div className={styles.roleHeader}>
                        <p>Choose Role</p>
                        <h2>This cannot be changed</h2>
                        <button className={styles.select_button} onClick={() => handleSubmit()} disabled={currentlySelected === -1}>Select</button>
                    </div>
                    <div className={styles.roles}>
                        <div 
                        onClick={() => handleSelection(2)} 
                        style={{ background: currentlySelected === 2 ? "#f0f0f0" : "" }}
                        className={styles.choosing}
                        >
                        <h3>Student</h3>
                        <ul className={styles.roleDescription}>
                            <li>Learn from tutors</li>
                            <li>Access study materials</li>
                            <li>Track progress</li>
                        </ul>
                        </div>

                        <div 
                        onClick={() => handleSelection(3)} 
                        style={{ background: currentlySelected === 3 ? "#f0f0f0" : "" }}
                        className={styles.choosing}
                        >
                        <h3>Parent</h3>
                        <ul className={styles.roleDescription}>
                            <li>Monitor child's progress</li>
                            <li>Assign tutors</li>
                            <li>Manage payments</li>
                        </ul>
                        </div>

                        <div 
                        onClick={() => handleSelection(4)} 
                        style={{ background: currentlySelected === 4 ? "#f0f0f0" : ""}}
                        className={styles.choosing}
                        >
                        <h3>Tutor</h3>
                        <ul className={styles.roleDescription}>
                            <li>Teach students</li>
                            <li>Set availability</li>
                            <li>Track student performance</li>
                        </ul>
                        </div>
                    </div>
                    
                    </div>
                : <div className={styles.role} style={{backgroundColor: user?.role.colour, fontFamily: "Geist Mono, monospace"}}>{capitalizeFirstLetter(user.role?.role_name)}</div>
            }
        </div>
    );
};

export default withAuth(UserConfig);
