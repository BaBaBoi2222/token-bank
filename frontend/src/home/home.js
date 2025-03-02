import { Link } from "react-router-dom";
const Home = (props) => {
    const logOut = ()=>{
        localStorage.removeItem('token');
        
    }
    return (
        <>
        <h1>Logged in!</h1>
        <Link to='/signin' onClick={logOut}>Log Out</Link>
        </>
    );
};
export default Home;