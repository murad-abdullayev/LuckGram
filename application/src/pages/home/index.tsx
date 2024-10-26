// src/pages/home/index.tsx
import Header from "../../components/header";

const HomePage = () => {
  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold">Welcome to LuckGram</h1>
        <p className="mt-4">This is your home page content.</p>
      </main>
    </div>
  );
};

export default HomePage;
