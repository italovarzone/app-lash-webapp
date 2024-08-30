import { useEffect } from "react";
import ClienteForm from "../components/ClienteForm";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div>
      <h1>Cadastrar Cliente</h1>
      <ClienteForm />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
