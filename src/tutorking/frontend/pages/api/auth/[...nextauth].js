import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // this makes it reauth every time
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // extract the username and email
      const username = user.name;
      const email = user.email;

      // Construct the request URL for adding the user
      let base_url = `http://127.0.0.1:8000`
      let extra_url = `/users/add_user/?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
      
      try {
        // Make the Axios request to add the user
        const response = await axios.post(base_url + extra_url);
        console.log('User added:', response.data);
        return true; // Return true to allow sign-in
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.log('User already exists');
          return true;
        } else {
          console.log('Failed to sign you in. Contact IT.');
          return false;
        }
      }
    },
  },
});
