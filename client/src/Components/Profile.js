// import {useAuth0} from "@auth0/auth0-react"

// import React from "react"
// import styled from "styled-components"

// const Profile = () => {
//   const {user, isAuthenticated} = useAuth0()
//   console.log(isAuthenticated, "auth")
//   return (
//     isAuthenticated && (
//       <article>
//         {user?.picture && <ProfilePic src={user.picture} alt={user?.name} />}
//         <h2>{user?.given_name}</h2>
//         {JSON.stringify(user)}
//       </article>
//     )
//   )
// }

// export default Profile
// const Button = styled.button`
//   width: 80px;
//   height: 50px;
//   background-color: white;
//   border: 5px solid #b6cfcf;
//   border-radius: 10px;
//   margin: 0px 10px;
//   color: #3d5c5c;
//   font-size: 16px;

//   font-family: Arial, Helvetica, sans-serif;
//   font-weight: 700px;
//   :hover {
//     cursor: pointer;
//   }
// `
// const ProfilePic = styled.img`
//   width: 80px;
//   height: 80px;
//   border-radius: 50px;
// `
