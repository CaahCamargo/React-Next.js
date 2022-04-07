import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import GithubProvider from "next-auth/providers"
import firebase from "../../../services/firebaseConnection"

export default NextAuth({

  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
  ],

  callbacks:{
    // dados da sessao
    async session(session, profile){
      // Inicio Try-Catch
      try{
        const lastDonate = await firebase.firestore().collection('users')
        .doc(String(profile.sub)) //profile.sub acessa o id do usuario da sessao
        .get()
        .then((snapshot) => {
          if(snapshot.exists){
            return snapshot.data().lastDonate.toDate();
          }else{
            return null // retornara null quando o user no for apoiador
          }
        })

        return{
          ...session,
          id: profile.sub,
          vip: lastDonate ? true : false, //verifica se user é vip
          lastDonate: lastDonate //verifica a data da ultima doação
        }

      }catch{
        return{
          ...session,
          id: null,
          vip: false, 
          lastDonate: null
        }
      }
      // Final Try-Catch
    },
    // dados de login
    async signIn(user,account, profile){
      const{email} = user;
      // Inicio Try-Catch
      try{
        return true;
      }catch(error){
        console.log('Ops, aconteceu um erro', error);
        return false;
      }
      // Final Try-Catch
    }
  }
})